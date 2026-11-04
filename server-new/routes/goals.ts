import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { getDb } from '../db/database';
import { GoalSchema } from '../../shared-new/types';

export async function goalsRouter(server: FastifyInstance) {
  const db = getDb();

  // 获取所有目标
  server.get('/', async (request, reply) => {
    try {
      const { status } = request.query as { status?: string };

      let query = 'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC';
      const params = ['default'];

      if (status) {
        query = 'SELECT * FROM goals WHERE user_id = ? AND status = ? ORDER BY created_at DESC';
        params.push(status);
      }

      const rows = db.prepare(query).all(...params) as any[];

      const goals = rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority,
        status: row.status,
        targetDate: row.target_date,
        estimatedHours: row.estimated_hours,
        tags: JSON.parse(row.tags || '[]'),
        progress: row.progress,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));

      return reply.send({ success: true, data: goals });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 获取单个目标
  server.get('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const row = db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as any;

      if (!row) {
        return reply.status(404).send({ success: false, error: '目标不存在' });
      }

      const goal = {
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        priority: row.priority,
        status: row.status,
        targetDate: row.target_date,
        estimatedHours: row.estimated_hours,
        tags: JSON.parse(row.tags || '[]'),
        progress: row.progress,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };

      return reply.send({ success: true, data: goal });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 创建目标
  server.post('/', async (request, reply) => {
    try {
      const data = GoalSchema.parse(request.body);
      const id = randomUUID();
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO goals (
          id, user_id, title, description, category, priority, status,
          target_date, estimated_hours, tags, progress, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, 'default', data.title, data.description || null, data.category,
        data.priority, data.status, data.targetDate, data.estimatedHours,
        JSON.stringify(data.tags), data.progress, now, now
      );

      const goal = {
        id,
        ...data,
        createdAt: now,
        updatedAt: now,
      };

      return reply.status(201).send({ success: true, data: goal, message: '目标创建成功' });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, error: '数据验证失败', details: error.errors });
      }
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 更新目标
  server.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const updates = request.body as any;

      const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(id) as any;
      if (!existing) {
        return reply.status(404).send({ success: false, error: '目标不存在' });
      }

      const data = GoalSchema.parse({
        title: updates.title ?? existing.title,
        description: updates.description ?? existing.description,
        category: updates.category ?? existing.category,
        priority: updates.priority ?? existing.priority,
        status: updates.status ?? existing.status,
        targetDate: updates.targetDate ?? existing.target_date,
        estimatedHours: updates.estimatedHours ?? existing.estimated_hours,
        tags: updates.tags ?? JSON.parse(existing.tags || '[]'),
        progress: updates.progress ?? existing.progress,
      });

      const now = new Date().toISOString();

      db.prepare(`
        UPDATE goals SET
          title = ?, description = ?, category = ?, priority = ?, status = ?,
          target_date = ?, estimated_hours = ?, tags = ?, progress = ?, updated_at = ?
        WHERE id = ?
      `).run(
        data.title, data.description || null, data.category, data.priority, data.status,
        data.targetDate, data.estimatedHours, JSON.stringify(data.tags), data.progress,
        now, id
      );

      const goal = {
        id,
        ...data,
        createdAt: existing.created_at,
        updatedAt: now,
      };

      return reply.send({ success: true, data: goal, message: '目标更新成功' });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, error: '数据验证失败', details: error.errors });
      }
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 删除目标
  server.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      const existing = db.prepare('SELECT * FROM goals WHERE id = ?').get(id);
      if (!existing) {
        return reply.status(404).send({ success: false, error: '目标不存在' });
      }

      db.prepare('DELETE FROM goals WHERE id = ?').run(id);

      return reply.send({ success: true, message: '目标已删除' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // 更新进度
  server.patch('/:id/progress', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };

      // 计算基于任务完成情况的进度
      const tasks = db.prepare('SELECT status FROM tasks WHERE goal_id = ?').all(id) as any[];

      if (tasks.length === 0) {
        return reply.send({ success: true, data: { progress: 0 } });
      }

      const completed = tasks.filter(t => t.status === 'completed').length;
      const progress = Math.round((completed / tasks.length) * 100);

      db.prepare('UPDATE goals SET progress = ?, updated_at = ? WHERE id = ?')
        .run(progress, new Date().toISOString(), id);

      return reply.send({ success: true, data: { progress }, message: '进度已更新' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

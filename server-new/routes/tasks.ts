import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { getDb } from '../db/database';
import { TaskSchema } from '../../shared-new/types';

export async function tasksRouter(server: FastifyInstance) {
  const db = getDb();

  server.get('/', async (request, reply) => {
    try {
      const { goalId, status, date } = request.query as any;
      let query = 'SELECT * FROM tasks WHERE 1=1';
      const params: any[] = [];

      if (goalId) {
        query += ' AND goal_id = ?';
        params.push(goalId);
      }
      if (status) {
        query += ' AND status = ?';
        params.push(status);
      }
      if (date) {
        query += ' AND scheduled_date = ?';
        params.push(date);
      }

      query += ' ORDER BY created_at DESC';

      const rows = db.prepare(query).all(...params) as any[];
      const tasks = rows.map(row => ({
        id: row.id,
        goalId: row.goal_id,
        title: row.title,
        description: row.description,
        type: row.type,
        status: row.status,
        priority: row.priority,
        scheduledDate: row.scheduled_date,
        dueDate: row.due_date,
        estimatedMinutes: row.estimated_minutes,
        actualMinutes: row.actual_minutes,
        difficulty: row.difficulty,
        dependencies: JSON.parse(row.dependencies || '[]'),
        notes: row.notes,
        resources: JSON.parse(row.resources || '[]'),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        completedAt: row.completed_at,
      }));

      return reply.send({ success: true, data: tasks });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.post('/', async (request, reply) => {
    try {
      const data = TaskSchema.parse(request.body);
      const id = randomUUID();
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO tasks (
          id, goal_id, title, description, type, status, priority,
          scheduled_date, due_date, estimated_minutes, actual_minutes, difficulty,
          dependencies, notes, resources, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, data.goalId, data.title, data.description || null, data.type, data.status,
        data.priority, data.scheduledDate || null, data.dueDate || null,
        data.estimatedMinutes, data.actualMinutes, data.difficulty || null,
        JSON.stringify(data.dependencies), data.notes || null,
        JSON.stringify(data.resources), now, now
      );

      const task = { id, ...data, createdAt: now, updatedAt: now };
      return reply.status(201).send({ success: true, data: task, message: '任务创建成功' });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return reply.status(400).send({ success: false, error: '数据验证失败' });
      }
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.patch('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const updates = request.body as any;

      const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id) as any;
      if (!existing) {
        return reply.status(404).send({ success: false, error: '任务不存在' });
      }

      const now = new Date().toISOString();
      const completedAt = updates.status === 'completed' && existing.status !== 'completed'
        ? now
        : existing.completed_at;

      db.prepare(`
        UPDATE tasks SET status = ?, actual_minutes = ?, notes = ?,
        updated_at = ?, completed_at = ? WHERE id = ?
      `).run(
        updates.status ?? existing.status,
        updates.actualMinutes ?? existing.actual_minutes,
        updates.notes ?? existing.notes,
        now, completedAt, id
      );

      return reply.send({ success: true, message: '任务更新成功' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
      return reply.send({ success: true, message: '任务已删除' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

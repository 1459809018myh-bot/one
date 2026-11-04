import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { getDb } from '../db/database';

export async function studyRouter(server: FastifyInstance) {
  const db = getDb();

  server.post('/sessions', async (request, reply) => {
    try {
      const data = request.body as any;
      const id = randomUUID();
      const now = new Date().toISOString();

      db.prepare(`
        INSERT INTO study_sessions (
          id, task_id, goal_id, title, start_time, end_time,
          duration_minutes, focus_score, notes, achievements, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, data.taskId || null, data.goalId || null, data.title,
        data.startTime, data.endTime || null, data.durationMinutes,
        data.focusScore || null, data.notes || null,
        JSON.stringify(data.achievements || []), now
      );

      return reply.status(201).send({ success: true, data: { id }, message: '学习记录已保存' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.get('/sessions', async (request, reply) => {
    try {
      const { goalId, from, to } = request.query as any;
      let query = 'SELECT * FROM study_sessions WHERE 1=1';
      const params: any[] = [];

      if (goalId) {
        query += ' AND goal_id = ?';
        params.push(goalId);
      }
      if (from) {
        query += ' AND DATE(start_time) >= ?';
        params.push(from);
      }
      if (to) {
        query += ' AND DATE(start_time) <= ?';
        params.push(to);
      }

      query += ' ORDER BY start_time DESC LIMIT 100';

      const rows = db.prepare(query).all(...params) as any[];
      return reply.send({ success: true, data: rows });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

import type { FastifyInstance } from 'fastify';
import { getDb } from '../db/database';

export async function statsRouter(server: FastifyInstance) {
  const db = getDb();

  server.get('/dashboard', async (request, reply) => {
    try {
      const { from, to } = request.query as any;

      const goals = db.prepare('SELECT COUNT(*) as count FROM goals WHERE status = ?').get('active') as any;
      const tasks = db.prepare('SELECT COUNT(*) as count FROM tasks WHERE status = ?').get('completed') as any;
      const sessions = db.prepare(
        'SELECT SUM(duration_minutes) as total FROM study_sessions WHERE DATE(start_time) >= ? AND DATE(start_time) <= ?'
      ).get(from, to) as any;

      return reply.send({
        success: true,
        data: {
          activeGoals: goals?.count || 0,
          completedTasks: tasks?.count || 0,
          totalStudyMinutes: sessions?.total || 0,
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

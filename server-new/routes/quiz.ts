import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { getDb } from '../db/database';

export async function quizRouter(server: FastifyInstance) {
  const db = getDb();

  server.post('/', async (request, reply) => {
    try {
      const data = request.body as any;
      const id = randomUUID();

      db.prepare(`
        INSERT INTO quizzes (id, goal_id, title, description, questions, time_limit, passing_score, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id, data.goalId, data.title, data.description || null,
        JSON.stringify(data.questions), data.timeLimit || null,
        data.passingScore || 60, new Date().toISOString()
      );

      return reply.status(201).send({ success: true, data: { id }, message: '测验创建成功' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.post('/:id/attempts', async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const data = request.body as any;
      const attemptId = randomUUID();

      db.prepare(`
        INSERT INTO quiz_attempts (id, quiz_id, answers, score, time_spent, passed, weak_topics, completed_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        attemptId, id, JSON.stringify(data.answers), data.score,
        data.timeSpent, data.passed ? 1 : 0,
        JSON.stringify(data.weakTopics || []), new Date().toISOString()
      );

      return reply.status(201).send({ success: true, data: { id: attemptId }, message: '测验已提交' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

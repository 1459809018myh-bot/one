import type { FastifyInstance } from 'fastify';
import { aiService } from '../services/ai-service';

export async function aiRouter(server: FastifyInstance) {
  server.post('/plan', async (request, reply) => {
    try {
      const goal = request.body as any;
      const plan = await aiService.generatePlan(goal);
      return reply.send({ success: true, data: plan });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.post('/quiz', async (request, reply) => {
    try {
      const options = request.body as any;
      const quiz = await aiService.generateQuiz(options);
      return reply.send({ success: true, data: quiz });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.post('/review', async (request, reply) => {
    try {
      const data = request.body as any;
      const review = await aiService.reviewProgress(data);
      return reply.send({ success: true, data: review });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.post('/motivation', async (request, reply) => {
    try {
      const context = request.body as any;
      const message = await aiService.getMotivation(context);
      return reply.send({ success: true, data: { message } });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

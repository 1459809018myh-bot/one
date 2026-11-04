import type { FastifyInstance } from 'fastify';
import { goalsRouter } from './goals';
import { tasksRouter } from './tasks';
import { studyRouter } from './study';
import { quizRouter } from './quiz';
import { statsRouter } from './stats';
import { aiRouter } from './ai';
import { settingsRouter } from './settings';

export function registerRoutes(server: FastifyInstance) {
  // 注册所有路由模块
  server.register(goalsRouter, { prefix: '/api/goals' });
  server.register(tasksRouter, { prefix: '/api/tasks' });
  server.register(studyRouter, { prefix: '/api/study' });
  server.register(quizRouter, { prefix: '/api/quiz' });
  server.register(statsRouter, { prefix: '/api/stats' });
  server.register(aiRouter, { prefix: '/api/ai' });
  server.register(settingsRouter, { prefix: '/api/settings' });

  console.log('✓ API routes registered');
}

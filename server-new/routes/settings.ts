import type { FastifyInstance } from 'fastify';
import { getDb } from '../db/database';
import { UserSettingsSchema } from '../../shared-new/types';

export async function settingsRouter(server: FastifyInstance) {
  const db = getDb();

  server.get('/', async (request, reply) => {
    try {
      const row = db.prepare('SELECT settings FROM users WHERE id = ?').get('default') as any;
      const settings = JSON.parse(row.settings);
      return reply.send({ success: true, data: settings });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  server.put('/', async (request, reply) => {
    try {
      const data = UserSettingsSchema.parse(request.body);
      db.prepare('UPDATE users SET settings = ?, updated_at = ? WHERE id = ?')
        .run(JSON.stringify(data), new Date().toISOString(), 'default');
      return reply.send({ success: true, data, message: '设置已更新' });
    } catch (error: any) {
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

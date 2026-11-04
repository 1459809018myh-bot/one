import Fastify from 'fastify';
import cors from '@fastify/cors';
import staticPlugin from '@fastify/static';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { Database } from './db/database';
import { registerRoutes } from './routes/index';

// 加载环境变量
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = parseInt(process.env.PORT || '5000', 10);
const HOST = '127.0.0.1';

async function start() {
  const server = Fastify({
    logger: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    },
  });

  // 初始化数据库
  const dbPath = resolve(process.cwd(), process.env.DATABASE_PATH || './data/learning.db');
  Database.getInstance(dbPath);
  console.log(`✓ Database initialized: ${dbPath}`);

  // CORS配置
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  });

  // 静态文件服务（生产环境）
  if (process.env.NODE_ENV === 'production') {
    await server.register(staticPlugin, {
      root: resolve(__dirname, '../dist'),
      prefix: '/',
    });

    server.get('/', async (_, reply) => {
      return reply.sendFile('index.html');
    });
  }

  // 注册API路由
  registerRoutes(server);

  // 健康检查
  server.get('/api/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
  }));

  // 错误处理
  server.setErrorHandler((error, request, reply) => {
    server.log.error(error);
    reply.status(error.statusCode || 500).send({
      success: false,
      error: error.message || '服务器内部错误',
    });
  });

  // 启动服务器
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 智能学习平台已启动               ║
║                                       ║
║   服务地址: http://${HOST}:${PORT}  ║
║   环境: ${process.env.NODE_ENV || 'development'}                    ║
║   AI提供商: ${process.env.AI_PROVIDER || 'deepseek'}                ║
╚═══════════════════════════════════════╝
    `);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n正在关闭服务器...');
  process.exit(0);
});

start();

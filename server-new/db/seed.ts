import { Database } from './database';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';

config();

async function seed() {
  console.log('🌱 开始填充测试数据...\n');

  try {
    const dbPath = resolve(process.cwd(), process.env.DATABASE_PATH || './data/learning.db');
    const db = Database.getInstance(dbPath);

    // 创建示例目标
    const goalId = randomUUID();
    const now = new Date().toISOString();
    const targetDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO goals (
        id, user_id, title, description, category, priority, status,
        target_date, estimated_hours, tags, progress, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      goalId,
      'default',
      '学习TypeScript',
      '掌握TypeScript的高级特性，包括类型系统、泛型、装饰器等',
      '技术',
      '高',
      'active',
      targetDate,
      40,
      JSON.stringify(['TypeScript', '前端', 'JavaScript']),
      15,
      now,
      now
    );

    console.log('✓ 创建了示例学习目标');

    // 创建示例任务
    const taskId = randomUUID();
    const today = new Date().toISOString().split('T')[0];

    db.prepare(`
      INSERT INTO tasks (
        id, goal_id, title, description, type, status, priority,
        scheduled_date, due_date, estimated_minutes, actual_minutes,
        difficulty, dependencies, notes, resources, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      taskId,
      goalId,
      '学习TypeScript基础语法',
      '了解TypeScript的基本类型、接口、类等概念',
      '学习',
      'pending',
      '高',
      today,
      today,
      60,
      0,
      '中等',
      JSON.stringify([]),
      '建议先阅读官方文档',
      JSON.stringify([
        {
          title: 'TypeScript官方文档',
          url: 'https://www.typescriptlang.org/docs/',
          type: '文档'
        }
      ]),
      now,
      now
    );

    console.log('✓ 创建了示例学习任务');
    console.log('\n🎉 测试数据填充完成！\n');
    console.log('现在可以启动应用并查看示例数据了。\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ 数据填充失败:', error);
    process.exit(1);
  }
}

seed();

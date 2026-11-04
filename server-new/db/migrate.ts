import { Database } from './database';
import { resolve } from 'node:path';
import { config } from 'dotenv';

config();

async function migrate() {
  console.log('🔧 开始数据库迁移...\n');

  try {
    const dbPath = resolve(process.cwd(), process.env.DATABASE_PATH || './data/learning.db');
    const db = Database.getInstance(dbPath);

    console.log(`✓ 数据库初始化完成: ${dbPath}`);
    console.log('✓ 所有表已创建');
    console.log('✓ 索引已建立');
    console.log('✓ 默认用户已初始化\n');

    console.log('🎉 迁移完成！\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ 迁移失败:', error);
    process.exit(1);
  }
}

migrate();

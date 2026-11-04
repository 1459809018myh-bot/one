import { DatabaseSync } from 'node:sqlite';
import { resolve } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

export class Database {
  private db: DatabaseSync;
  private static instance: Database;

  private constructor(dbPath: string) {
    // 确保数据目录存在
    const dir = resolve(dbPath, '..');
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    this.db = new DatabaseSync(dbPath);
    this.initialize();
  }

  public static getInstance(dbPath?: string): Database {
    if (!Database.instance) {
      if (!dbPath) {
        throw new Error('Database path must be provided for first initialization');
      }
      Database.instance = new Database(dbPath);
    }
    return Database.instance;
  }

  private initialize(): void {
    // 创建基础表
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        settings TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS goals (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL DEFAULT 'default',
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        priority TEXT NOT NULL DEFAULT '中',
        status TEXT NOT NULL DEFAULT 'planning',
        target_date TEXT NOT NULL,
        estimated_hours INTEGER NOT NULL,
        tags TEXT DEFAULT '[]',
        progress INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        goal_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL DEFAULT '学习',
        status TEXT NOT NULL DEFAULT 'pending',
        priority TEXT NOT NULL DEFAULT '中',
        scheduled_date TEXT,
        due_date TEXT,
        estimated_minutes INTEGER NOT NULL,
        actual_minutes INTEGER DEFAULT 0,
        difficulty TEXT,
        dependencies TEXT DEFAULT '[]',
        notes TEXT,
        resources TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS study_sessions (
        id TEXT PRIMARY KEY,
        task_id TEXT,
        goal_id TEXT,
        title TEXT NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME,
        duration_minutes INTEGER NOT NULL,
        focus_score REAL,
        notes TEXT,
        achievements TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL,
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS knowledge_points (
        id TEXT PRIMARY KEY,
        goal_id TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        category TEXT,
        mastery_level TEXT NOT NULL DEFAULT '新学习',
        last_reviewed_at DATETIME,
        next_review_at DATETIME,
        review_count INTEGER DEFAULT 0,
        tags TEXT DEFAULT '[]',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quizzes (
        id TEXT PRIMARY KEY,
        goal_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        questions TEXT NOT NULL,
        time_limit INTEGER,
        passing_score INTEGER DEFAULT 60,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS quiz_attempts (
        id TEXT PRIMARY KEY,
        quiz_id TEXT NOT NULL,
        answers TEXT NOT NULL,
        score REAL NOT NULL,
        time_spent INTEGER NOT NULL,
        passed INTEGER NOT NULL,
        weak_topics TEXT DEFAULT '[]',
        completed_at DATETIME NOT NULL,
        FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS agent_tasks (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        role TEXT NOT NULL,
        input TEXT NOT NULL,
        output TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        error TEXT,
        started_at DATETIME,
        completed_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS activities (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        metadata TEXT DEFAULT '{}',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- 创建索引
      CREATE INDEX IF NOT EXISTS idx_goals_user_status ON goals(user_id, status);
      CREATE INDEX IF NOT EXISTS idx_tasks_goal_status ON tasks(goal_id, status);
      CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_date ON tasks(scheduled_date);
      CREATE INDEX IF NOT EXISTS idx_sessions_date ON study_sessions(start_time);
      CREATE INDEX IF NOT EXISTS idx_activities_created ON activities(created_at DESC);
    `);

    // 初始化默认用户
    this.initDefaultUser();
  }

  private initDefaultUser(): void {
    const existing = this.db.prepare('SELECT id FROM users WHERE id = ?').get('default');
    if (!existing) {
      const defaultSettings = JSON.stringify({
        timezone: 'Asia/Shanghai',
        dailyStudyMinutes: 120,
        weeklyGoals: 3,
        notificationsEnabled: true,
        theme: 'auto',
        language: 'zh-CN',
      });
      this.db.prepare('INSERT INTO users (id, settings) VALUES (?, ?)').run('default', defaultSettings);
    }
  }

  public exec(sql: string): void {
    this.db.exec(sql);
  }

  public prepare(sql: string) {
    return this.db.prepare(sql);
  }

  public transaction<T>(fn: () => T): T {
    this.db.exec('BEGIN TRANSACTION');
    try {
      const result = fn();
      this.db.exec('COMMIT');
      return result;
    } catch (error) {
      this.db.exec('ROLLBACK');
      throw error;
    }
  }

  public close(): void {
    this.db.close();
  }
}

export const getDb = () => Database.getInstance();

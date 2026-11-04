// 共享类型定义
import { z } from 'zod';

// ============ 基础类型 ============
export const DateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const UUID = z.string().uuid();

// ============ 用户设置 ============
export const UserSettingsSchema = z.object({
  timezone: z.string().default('Asia/Shanghai'),
  dailyStudyMinutes: z.number().int().min(30).max(480).default(120),
  weeklyGoals: z.number().int().min(1).max(10).default(3),
  notificationsEnabled: z.boolean().default(true),
  theme: z.enum(['light', 'dark', 'auto']).default('auto'),
  language: z.enum(['zh-CN', 'en-US']).default('zh-CN'),
});

export type UserSettings = z.infer<typeof UserSettingsSchema>;

// ============ 学习目标 ============
export const GoalSchema = z.object({
  id: UUID.optional(),
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum(['技术', '语言', '考试', '兴趣', '其他']),
  priority: z.enum(['高', '中', '低']).default('中'),
  status: z.enum(['planning', 'active', 'paused', 'completed', 'archived']).default('planning'),
  targetDate: DateString,
  estimatedHours: z.number().min(1).max(1000),
  tags: z.array(z.string()).default([]),
  progress: z.number().min(0).max(100).default(0),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Goal = z.infer<typeof GoalSchema>;

// ============ 学习任务 ============
export const TaskSchema = z.object({
  id: UUID.optional(),
  goalId: UUID,
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  type: z.enum(['学习', '练习', '复习', '测验', '项目']).default('学习'),
  status: z.enum(['pending', 'in-progress', 'completed', 'skipped']).default('pending'),
  priority: z.enum(['高', '中', '低']).default('中'),
  scheduledDate: DateString.optional(),
  dueDate: DateString.optional(),
  estimatedMinutes: z.number().int().min(5).max(480),
  actualMinutes: z.number().int().min(0).default(0),
  difficulty: z.enum(['简单', '中等', '困难']).optional(),
  dependencies: z.array(UUID).default([]),
  notes: z.string().max(2000).optional(),
  resources: z.array(z.object({
    title: z.string(),
    url: z.string().url(),
    type: z.enum(['文章', '视频', '文档', '其他']),
  })).default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});

export type Task = z.infer<typeof TaskSchema>;

// ============ 学习记录 ============
export const StudySessionSchema = z.object({
  id: UUID.optional(),
  taskId: UUID.optional(),
  goalId: UUID.optional(),
  title: z.string().min(1).max(100),
  startTime: z.string().datetime(),
  endTime: z.string().datetime().optional(),
  durationMinutes: z.number().int().min(0),
  focusScore: z.number().min(0).max(10).optional(),
  notes: z.string().max(1000).optional(),
  achievements: z.array(z.string()).default([]),
  createdAt: z.string().datetime().optional(),
});

export type StudySession = z.infer<typeof StudySessionSchema>;

// ============ 知识点 ============
export const KnowledgePointSchema = z.object({
  id: UUID.optional(),
  goalId: UUID,
  title: z.string().min(1).max(100),
  content: z.string().max(5000),
  category: z.string().max(50).optional(),
  masteryLevel: z.enum(['新学习', '正在学习', '基本掌握', '熟练掌握', '精通']).default('新学习'),
  lastReviewedAt: z.string().datetime().optional(),
  nextReviewAt: z.string().datetime().optional(),
  reviewCount: z.number().int().min(0).default(0),
  tags: z.array(z.string()).default([]),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type KnowledgePoint = z.infer<typeof KnowledgePointSchema>;

// ============ 测验 ============
export const QuizQuestionSchema = z.object({
  question: z.string().min(1).max(500),
  options: z.array(z.string().min(1).max(300)).length(4),
  correctAnswer: z.number().int().min(0).max(3),
  explanation: z.string().max(1000),
  topic: z.string().max(100),
  difficulty: z.enum(['简单', '中等', '困难']),
});

export const QuizSchema = z.object({
  id: UUID.optional(),
  goalId: UUID,
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  questions: z.array(QuizQuestionSchema).min(3).max(20),
  timeLimit: z.number().int().min(5).max(180).optional(),
  passingScore: z.number().min(0).max(100).default(60),
  createdAt: z.string().datetime().optional(),
});

export const QuizAttemptSchema = z.object({
  id: UUID.optional(),
  quizId: UUID,
  answers: z.array(z.number().int().min(0).max(3)),
  score: z.number().min(0).max(100),
  timeSpent: z.number().int().min(0),
  passed: z.boolean(),
  weakTopics: z.array(z.string()).default([]),
  completedAt: z.string().datetime(),
});

export type Quiz = z.infer<typeof QuizSchema>;
export type QuizAttempt = z.infer<typeof QuizAttemptSchema>;

// ============ AI Agent 类型 ============
export const AgentRole = z.enum([
  'planner',      // 规划Agent
  'coach',        // 教练Agent
  'reviewer',     // 复盘Agent
  'knowledge',    // 知识Agent
  'motivator',    // 激励Agent
]);

export type AgentRoleType = z.infer<typeof AgentRole>;

export const AgentTaskSchema = z.object({
  id: UUID.optional(),
  type: z.enum(['plan', 'review', 'quiz', 'suggestion', 'motivation']),
  role: AgentRole,
  input: z.record(z.any()),
  output: z.record(z.any()).optional(),
  status: z.enum(['pending', 'running', 'completed', 'failed']).default('pending'),
  error: z.string().optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
});

export type AgentTask = z.infer<typeof AgentTaskSchema>;

// ============ 统计数据 ============
export const StatsSchema = z.object({
  period: z.enum(['day', 'week', 'month', 'year']),
  startDate: DateString,
  endDate: DateString,
  totalStudyMinutes: z.number().int().min(0),
  completedTasks: z.number().int().min(0),
  activeGoals: z.number().int().min(0),
  averageFocusScore: z.number().min(0).max(10),
  dailyBreakdown: z.array(z.object({
    date: DateString,
    minutes: z.number().int().min(0),
    tasks: z.number().int().min(0),
  })),
});

export type Stats = z.infer<typeof StatsSchema>;

// ============ API响应类型 ============
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============ Agent配置 ============
export interface AgentConfig {
  role: AgentRoleType;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
  systemPrompt: string;
}

export const AGENT_CONFIGS: Record<AgentRoleType, AgentConfig> = {
  planner: {
    role: 'planner',
    name: '规划助手',
    description: '帮助制定学习计划，分解目标为可执行任务',
    icon: '📋',
    enabled: true,
    systemPrompt: '你是一个专业的学习规划助手，擅长将大目标分解为小任务，制定合理的学习路线。',
  },
  coach: {
    role: 'coach',
    name: '学习教练',
    description: '提供学习建议，解答疑问，指导学习方法',
    icon: '🎓',
    enabled: true,
    systemPrompt: '你是一个耐心的学习教练，善于解答问题，提供个性化的学习建议。',
  },
  reviewer: {
    role: 'reviewer',
    name: '复盘分析师',
    description: '分析学习数据，发现问题，提出改进建议',
    icon: '📊',
    enabled: true,
    systemPrompt: '你是一个数据分析专家，善于从学习记录中发现规律和问题。',
  },
  knowledge: {
    role: 'knowledge',
    name: '知识管理员',
    description: '整理知识点，生成测验，安排复习计划',
    icon: '📚',
    enabled: true,
    systemPrompt: '你是一个知识管理专家，擅长整理知识结构，制定复习策略。',
  },
  motivator: {
    role: 'motivator',
    name: '激励伙伴',
    description: '提供鼓励和动力，帮助保持学习热情',
    icon: '⚡',
    enabled: true,
    systemPrompt: '你是一个积极正能量的伙伴，善于激励和鼓舞学习者。',
  },
};

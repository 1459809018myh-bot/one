import axios from 'axios';
import type { AgentRoleType, AgentConfig, AGENT_CONFIGS } from '../../shared-new/types';

interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIResponse {
  content: string;
  tokensUsed?: number;
}

export class AIService {
  private apiKey: string;
  private provider: string;
  private baseURL: string;

  constructor() {
    this.provider = process.env.AI_PROVIDER || 'deepseek';
    this.apiKey = this.getApiKey();
    this.baseURL = this.getBaseURL();
  }

  private getApiKey(): string {
    const key = this.provider === 'openai'
      ? process.env.OPENAI_API_KEY
      : process.env.DEEPSEEK_API_KEY;

    if (!key) {
      throw new Error(`${this.provider.toUpperCase()}_API_KEY not configured`);
    }
    return key;
  }

  private getBaseURL(): string {
    return this.provider === 'openai'
      ? 'https://api.openai.com/v1'
      : 'https://api.deepseek.com/v1';
  }

  async chat(messages: AIMessage[], temperature = 0.7): Promise<AIResponse> {
    try {
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: this.provider === 'openai' ? 'gpt-4' : 'deepseek-chat',
          messages,
          temperature,
          max_tokens: 2000,
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000,
        }
      );

      return {
        content: response.data.choices[0].message.content,
        tokensUsed: response.data.usage?.total_tokens,
      };
    } catch (error: any) {
      console.error('AI API Error:', error.response?.data || error.message);
      throw new Error(`AI服务调用失败: ${error.message}`);
    }
  }

  async generatePlan(goal: {
    title: string;
    description?: string;
    targetDate: string;
    estimatedHours: number;
  }): Promise<any> {
    const systemPrompt = `你是一个专业的学习规划助手。根据用户的学习目标，制定详细的学习计划。
计划应该：
1. 将目标分解为可执行的小任务
2. 合理安排任务顺序和时间
3. 考虑任务之间的依赖关系
4. 给出每个任务的预估时间

返回JSON格式：
{
  "tasks": [
    {
      "title": "任务标题",
      "description": "任务描述",
      "type": "学习|练习|复习|测验|项目",
      "estimatedMinutes": 60,
      "priority": "高|中|低",
      "difficulty": "简单|中等|困难",
      "order": 1
    }
  ],
  "milestones": [
    {
      "title": "里程碑名称",
      "description": "里程碑描述",
      "targetWeek": 1
    }
  ],
  "suggestions": ["建议1", "建议2"]
}`;

    const userPrompt = `请为以下学习目标制定详细计划：
- 目标：${goal.title}
${goal.description ? `- 描述：${goal.description}` : ''}
- 截止日期：${goal.targetDate}
- 预计投入：${goal.estimatedHours}小时`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    try {
      return JSON.parse(response.content);
    } catch {
      throw new Error('AI返回的计划格式无效');
    }
  }

  async generateQuiz(options: {
    goalTitle: string;
    topics: string[];
    difficulty: '简单' | '中等' | '困难';
    questionCount: number;
  }): Promise<any> {
    const systemPrompt = `你是一个出题专家。根据学习主题生成高质量的选择题。
每道题必须包含：
- 清晰的问题
- 4个选项
- 正确答案的索引（0-3）
- 详细的解释

返回JSON格式：
{
  "questions": [
    {
      "question": "问题内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctAnswer": 0,
      "explanation": "答案解释",
      "topic": "知识点",
      "difficulty": "简单|中等|困难"
    }
  ]
}`;

    const userPrompt = `请生成${options.questionCount}道${options.difficulty}难度的选择题。
学习目标：${options.goalTitle}
涉及主题：${options.topics.join('、')}`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.8);

    try {
      return JSON.parse(response.content);
    } catch {
      throw new Error('AI返回的测验格式无效');
    }
  }

  async reviewProgress(data: {
    goalTitle: string;
    completedTasks: number;
    totalTasks: number;
    studyTime: number;
    focusScores: number[];
    weakTopics: string[];
  }): Promise<any> {
    const systemPrompt = `你是一个学习分析专家。根据学习数据，提供深入的分析和改进建议。
分析应包括：
1. 进度评估
2. 学习效率分析
3. 薄弱点识别
4. 具体改进建议

返回JSON格式：
{
  "summary": "总体评估",
  "strengths": ["优点1", "优点2"],
  "weaknesses": ["问题1", "问题2"],
  "suggestions": [
    {
      "category": "时间管理|学习方法|知识掌握",
      "content": "具体建议",
      "priority": "高|中|低"
    }
  ],
  "nextSteps": ["下一步1", "下一步2"]
}`;

    const avgFocus = data.focusScores.length > 0
      ? (data.focusScores.reduce((a, b) => a + b, 0) / data.focusScores.length).toFixed(1)
      : 'N/A';

    const userPrompt = `请分析以下学习数据：
- 目标：${data.goalTitle}
- 已完成任务：${data.completedTasks}/${data.totalTasks}
- 累计学习时长：${Math.floor(data.studyTime / 60)}小时${data.studyTime % 60}分钟
- 平均专注度：${avgFocus}/10
${data.weakTopics.length > 0 ? `- 薄弱主题：${data.weakTopics.join('、')}` : ''}`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    try {
      return JSON.parse(response.content);
    } catch {
      throw new Error('AI返回的分析格式无效');
    }
  }

  async getMotivation(context: {
    goalTitle: string;
    progress: number;
    recentActivity: string;
  }): Promise<string> {
    const systemPrompt = `你是一个温暖、积极的学习伙伴。根据用户的学习情况，提供鼓励和动力。
- 语气亲切自然
- 认可用户的努力
- 提供具体可行的建议
- 保持积极但不夸张
- 字数控制在100字以内`;

    const userPrompt = `用户正在学习：${context.goalTitle}
当前进度：${context.progress}%
最近动态：${context.recentActivity}

请给予鼓励和建议。`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.9);

    return response.content;
  }

  async suggestNextAction(options: {
    goals: Array<{ title: string; priority: string; progress: number }>;
    todayCompleted: number;
    energyLevel: number;
  }): Promise<string> {
    const systemPrompt = `你是一个智能学习助手。根据用户当前状态，建议接下来应该做什么。
考虑因素：
- 目标优先级
- 完成进度
- 精力状态
- 时间安排

给出简洁明确的建议，50字以内。`;

    const userPrompt = `当前状态：
- 今日已完成任务：${options.todayCompleted}个
- 精力水平：${options.energyLevel}/10
- 进行中的目标：
${options.goals.map(g => `  * ${g.title} (${g.priority}优先级，${g.progress}%)`).join('\n')}

建议接下来做什么？`;

    const response = await this.chat([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], 0.7);

    return response.content;
  }
}

export const aiService = new AIService();

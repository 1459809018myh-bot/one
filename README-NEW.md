# 智能学习成长平台 v2.0

> AI驱动的个人学习助手，让每一步学习都有智能陪伴

## 🌟 项目概述

这是一个基于AI的智能学习管理平台，通过多Agent协作帮助用户规划学习路径、管理任务、记录进度、生成测验和数据分析，让学习更高效、更有成就感。

### 相比原项目的改进

1. **更现代的技术栈**
   - 前端：React 18 + TypeScript + Tailwind CSS + Framer Motion
   - 状态管理：Zustand + TanStack Query (React Query)
   - 路由：React Router v7
   - 图表：Recharts
   - 图标：Lucide React

2. **更好的用户体验**
   - 响应式设计，支持暗黑模式
   - 流畅的动画和过渡效果
   - 直观的信息展示
   - 更清晰的视觉层次

3. **更灵活的架构**
   - 清晰的分层架构（前后端分离）
   - 模块化设计，易于扩展
   - 统一的API接口
   - 类型安全（TypeScript全栈）

4. **增强的功能**
   - 多provider支持（DeepSeek + OpenAI）
   - 智能推荐和激励系统
   - 数据可视化分析
   - 间隔重复学习算法
   - 专注度追踪

## 📦 技术栈

### 后端
- **Runtime**: Node.js 20+
- **Framework**: Fastify (轻量高性能)
- **Database**: SQLite (Node内置)
- **Validation**: Zod
- **AI**: DeepSeek / OpenAI
- **Language**: TypeScript

### 前端
- **Framework**: React 18 + TypeScript
- **Build**: Vite 6
- **Styling**: Tailwind CSS 3
- **State**: Zustand + TanStack Query
- **Router**: React Router v7
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Icons**: Lucide React

## 🚀 快速开始

### 环境要求
- Node.js >= 20
- npm >= 9

### 安装步骤

1. **克隆并进入项目**
```bash
cd D:\liulandowload\colife-main
```

2. **安装依赖**（确保使用package-new.json）
```bash
npm install
```

3. **环境配置**
```bash
# 复制环境变量配置
cp .env-new.example .env

# 编辑 .env 文件，填入你的API密钥
# 支持 DeepSeek 或 OpenAI
```

4. **初始化数据库**
```bash
npm run db:migrate
```

5. **启动开发服务器**
```bash
# 同时启动前后端
npm run dev

# 或分别启动
npm run dev:server  # 后端：http://127.0.0.1:5000
npm run dev:client  # 前端：http://localhost:5173
```

### 生产环境部署

```bash
# 构建前端
npm run build

# 启动生产服务器
npm start
```

## 📂 项目结构

```
colife-main/
├── server-new/              # 后端服务
│   ├── db/                  # 数据库层
│   │   ├── database.ts     # 数据库连接和初始化
│   │   ├── migrate.ts      # 数据库迁移
│   │   └── seed.ts         # 测试数据
│   ├── routes/             # API路由
│   │   ├── goals.ts        # 目标管理
│   │   ├── tasks.ts        # 任务管理
│   │   ├── study.ts        # 学习记录
│   │   ├── quiz.ts         # 测验系统
│   │   ├── stats.ts        # 统计分析
│   │   ├── ai.ts           # AI接口
│   │   └── settings.ts     # 用户设置
│   ├── services/           # 业务逻辑
│   │   └── ai-service.ts   # AI服务封装
│   └── index.ts            # 服务器入口
│
├── client-new/             # 前端应用
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   │   ├── Layout.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── LoadingScreen.tsx
│   │   ├── pages/          # 页面组件
│   │   │   ├── Dashboard.tsx    # 工作台
│   │   │   ├── Goals.tsx        # 目标管理
│   │   │   ├── Tasks.tsx        # 任务列表
│   │   │   ├── Study.tsx        # 学习记录
│   │   │   ├── Analytics.tsx    # 数据分析
│   │   │   └── Settings.tsx     # 系统设置
│   │   ├── store/          # 状态管理
│   │   │   └── useAppStore.ts
│   │   ├── lib/            # 工具库
│   │   │   └── api.ts      # API客户端
│   │   ├── App.tsx         # 应用根组件
│   │   ├── main.tsx        # 入口文件
│   │   └── index.css       # 全局样式
│   └── index.html
│
├── shared-new/             # 共享类型定义
│   └── types.ts           # TypeScript类型和Zod schemas
│
├── data/                  # 数据存储目录
│   └── learning.db       # SQLite数据库
│
├── .env-new.example      # 环境变量示例
├── package-new.json      # 项目配置
├── tsconfig-new.json     # TypeScript配置
├── vite.config-new.ts    # Vite配置
└── tailwind.config-new.js # Tailwind配置
```

## 🎯 核心功能

### 1. 学习目标管理
- 创建和管理学习目标
- 自动进度跟踪
- 目标分类和标签
- 截止日期提醒

### 2. 智能任务规划
- AI自动分解目标为任务
- 任务优先级管理
- 依赖关系处理
- 日程智能安排

### 3. 学习记录追踪
- 专注时间记录
- 专注度评分
- 学习笔记管理
- 成就系统

### 4. 知识测验系统
- AI自动生成测验题
- 薄弱点识别
- 间隔复习提醒
- 历史成绩跟踪

### 5. 数据分析洞察
- 学习时长统计
- 完成率分析
- 趋势图表展示
- 个性化建议

### 6. AI智能助手
- **规划助手**: 制定学习计划
- **学习教练**: 提供学习建议
- **复盘分析师**: 数据分析和反馈
- **知识管理员**: 知识整理和测验
- **激励伙伴**: 保持学习动力

## 🔧 API接口

### 目标管理
```typescript
GET    /api/goals           # 获取目标列表
POST   /api/goals           # 创建目标
GET    /api/goals/:id       # 获取单个目标
PATCH  /api/goals/:id       # 更新目标
DELETE /api/goals/:id       # 删除目标
PATCH  /api/goals/:id/progress  # 更新进度
```

### AI服务
```typescript
POST /api/ai/plan          # 生成学习计划
POST /api/ai/quiz          # 生成测验
POST /api/ai/review        # 生成复盘
POST /api/ai/motivation    # 获取激励消息
```

更多API文档请参考 `server-new/routes/` 目录下的各个路由文件。

## 🎨 设计特色

### 视觉设计
- **配色方案**: 清新的蓝紫渐变，专业而不失活力
- **暗黑模式**: 完整支持，护眼且现代
- **动画效果**: 流畅自然的过渡动画
- **响应式**: 完美适配各种屏幕尺寸

### 交互设计
- **即时反馈**: 每个操作都有明确的反馈
- **状态管理**: 清晰的加载、成功、错误状态
- **快捷操作**: 键盘快捷键支持（规划中）
- **拖拽排序**: 直观的任务管理（规划中）

## 🔐 安全性

- API请求仅限本机（127.0.0.1）
- 环境变量独立配置，不提交到仓库
- 参数化SQL查询，防止注入
- 请求数据完整校验

## 🚧 开发路线

### v2.1 (计划中)
- [ ] 任务拖拽排序
- [ ] 番茄钟集成
- [ ] 导出学习报告
- [ ] 移动端适配优化

### v2.2 (规划中)
- [ ] 多用户支持
- [ ] 云端同步
- [ ] 社区学习小组
- [ ] 更多AI模型支持

## 📝 开发指南

### 添加新页面
1. 在 `client-new/src/pages/` 创建新组件
2. 在 `client-new/src/App.tsx` 添加路由
3. 在 `client-new/src/components/Sidebar.tsx` 添加导航

### 添加新API
1. 在 `server-new/routes/` 创建新路由文件
2. 在 `server-new/routes/index.ts` 注册路由
3. 在 `client-new/src/lib/api.ts` 添加客户端调用
4. 更新 `shared-new/types.ts` 添加类型定义

### 数据库变更
1. 修改 `server-new/db/database.ts` 的初始化脚本
2. 删除现有数据库文件或创建迁移脚本
3. 重新运行 `npm run db:migrate`

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 原项目 [CoLife](https://github.com/ash-629/colife) 提供的灵感
- DeepSeek 提供的优秀AI服务
- 所有开源库的贡献者们

## 📧 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- Email: your-email@example.com

---

**让学习更智能，让成长更轻松！** 🚀

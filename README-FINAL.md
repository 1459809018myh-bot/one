# 智能学习成长平台 v2.0

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**🚀 AI驱动的个人学习助手 · 让每一步学习都有智能陪伴**

[功能特性](#功能特性) · [快速开始](#快速开始) · [技术栈](#技术栈) · [文档](#文档) · [贡献](#贡献)

</div>

---

## 📖 项目简介

这是一个基于AI的智能学习管理平台，通过多Agent协作帮助用户规划学习路径、管理任务、记录进度、生成测验和数据分析，让学习更高效、更有成就感。

### 🎯 设计理念

**"让AI成为你的学习伙伴"**

- 🎓 **智能规划**: AI自动分解目标，生成可执行计划
- 📊 **数据驱动**: 深度分析学习数据，提供个性化建议
- 🎨 **现代设计**: 清爽界面，流畅交互，支持暗黑模式
- 🔒 **隐私优先**: 本地存储，数据完全掌控

### ✨ 核心亮点

相比原项目（CoLife），本版本进行了全方位改进：

| 方面 | 改进内容 |
|------|---------|
| **技术栈** | React 18 + Vite 6 + Tailwind CSS 3 |
| **状态管理** | Zustand + TanStack Query（智能缓存） |
| **代码组织** | 2000+行巨型组件 → 模块化清晰分层 |
| **AI能力** | 单一DeepSeek → 多provider + 5个专业Agent |
| **用户体验** | 基础界面 → 现代设计 + 流畅动画 + 暗黑模式 |

详细对比请查看 [IMPROVEMENTS.md](IMPROVEMENTS.md)

---

## 🎯 功能特性

### 📚 学习目标管理
- 创建和分类管理学习目标
- 自动进度追踪和可视化
- 目标分类（技术/语言/考试/兴趣）
- 智能截止日期提醒

### 🤖 AI智能规划
- **规划助手**: 自动分解目标为可执行任务
- **学习教练**: 提供学习方法和资源建议
- **复盘分析师**: 分析学习数据，发现问题
- **知识管理员**: 生成测验，安排复习计划
- **激励伙伴**: 保持学习动力和热情

### ✅ 任务管理
- 看板视图（待办-进行中-已完成）
- 日历视图（时间轴展示）
- 任务依赖关系管理
- 智能优先级排序

### ⏱️ 学习记录
- 精确到分钟的时间追踪
- 专注度评分系统
- 学习笔记和心得
- 成就系统激励

### 📊 数据分析
- 学习时长趋势图表
- 完成率和效率分析
- 薄弱点智能识别
- 个性化改进建议

### 🧪 知识测验
- AI自动生成测验题
- 薄弱知识点识别
- 间隔重复复习提醒
- 历史成绩追踪

---

## 🚀 快速开始

### 方式1: 使用快速启动脚本（推荐）

**Windows用户**:
```bash
# 双击运行
quick-start.bat
```

**Linux/macOS用户**:
```bash
# 添加执行权限
chmod +x quick-start.sh

# 运行脚本
./quick-start.sh
```

脚本会自动：
- ✓ 检查Node.js环境
- ✓ 安装项目依赖
- ✓ 创建环境配置
- ✓ 初始化数据库
- ✓ 启动开发服务器

### 方式2: 手动安装

详细步骤请参考 [INSTALL.md](INSTALL.md)

```bash
# 1. 安装依赖
npm install

# 2. 配置环境（复制并编辑.env文件）
cp .env-new.example .env
# 编辑.env，填入你的API密钥

# 3. 初始化数据库
npm run db:migrate

# 4. （可选）添加测试数据
npm run db:seed

# 5. 启动开发服务器
npm run dev
```

### 访问应用

- **前端**: http://localhost:5173
- **后端**: http://127.0.0.1:5000
- **健康检查**: http://127.0.0.1:5000/api/health

---

## 🛠️ 技术栈

### 后端
- **Runtime**: Node.js 20+
- **Framework**: Fastify（高性能）
- **Database**: SQLite（Node内置）
- **Validation**: Zod
- **AI**: DeepSeek / OpenAI
- **Language**: TypeScript

### 前端
- **Framework**: React 18
- **Build**: Vite 6
- **Styling**: Tailwind CSS 3
- **State**: Zustand + TanStack Query
- **Router**: React Router v7
- **Charts**: Recharts
- **Animation**: Framer Motion
- **Icons**: Lucide React

---

## 📂 项目结构

```
colife-main/
├── server-new/              # 后端服务
│   ├── db/                  # 数据库层
│   ├── routes/             # API路由
│   ├── services/           # 业务逻辑
│   └── index.ts            # 入口
│
├── client-new/             # 前端应用
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── pages/          # 页面组件
│   │   ├── store/          # 状态管理
│   │   └── lib/            # 工具库
│   └── index.html
│
├── shared-new/             # 共享类型
├── data/                   # 数据存储
└── docs/                   # 文档
```

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| [README-NEW.md](README-NEW.md) | 完整功能介绍 |
| [INSTALL.md](INSTALL.md) | 详细安装指南 |
| [PROJECT-DESCRIPTION.md](PROJECT-DESCRIPTION.md) | 项目设计说明 |
| [IMPROVEMENTS.md](IMPROVEMENTS.md) | 改进对比 |
| [API文档](server-new/routes/) | API接口说明（代码注释） |

---

## 🎨 界面预览

### 工作台
- 今日任务概览
- 关键数据统计
- 进行中的目标
- AI激励消息

### 学习目标
- 卡片式目标展示
- 进度可视化
- 状态筛选
- 快速创建

### 数据分析
- 学习时长趋势
- 完成率分析
- 专注度统计
- 个性化建议

---

## 🔐 安全与隐私

- ✅ 本地SQLite存储，数据不上传
- ✅ API密钥用户自行管理
- ✅ 仅本机访问（127.0.0.1）
- ✅ AI调用不包含个人信息
- ✅ 参数化查询防止SQL注入

---

## 🚧 开发路线

### v2.1（开发中）
- [ ] 任务拖拽排序
- [ ] 番茄钟功能
- [ ] 导出学习报告
- [ ] 移动端适配优化
- [ ] 键盘快捷键

### v2.2（规划中）
- [ ] 多用户支持
- [ ] 云端同步
- [ ] 学习小组
- [ ] 知识图谱
- [ ] 更多AI模型

### v3.0（长期）
- [ ] 移动APP
- [ ] 浏览器插件
- [ ] 社区资源库
- [ ] AI学习伙伴
- [ ] 订阅模式

---

## 🤝 贡献指南

欢迎贡献代码、提交Issue或改进文档！

1. Fork项目
2. 创建特性分支（`git checkout -b feature/AmazingFeature`）
3. 提交更改（`git commit -m 'Add some AmazingFeature'`）
4. 推送到分支（`git push origin feature/AmazingFeature`）
5. 开启Pull Request

### 开发规范
- 使用TypeScript，保持类型安全
- 遵循ESLint和Prettier配置
- 组件使用函数式 + Hooks
- API响应统一格式
- 提交信息清晰明确

---

## 📄 许可证

本项目采用 MIT 许可证。

---

## 🙏 致谢

- 原项目 [CoLife](https://github.com/ash-629/colife) 提供的灵感
- [DeepSeek](https://www.deepseek.com/) 提供的优秀AI服务
- 所有开源库的贡献者们

---

## 📧 联系与支持

- **GitHub Issues**: 报告问题或功能建议
- **文档**: 查看完整文档获取帮助
- **社区**: 欢迎加入讨论和分享

---

<div align="center">

**让学习更智能，让成长更轻松！** 🚀

如果这个项目对你有帮助，请给个⭐️支持一下！

Made with ❤️ by Claude

</div>

# 🚀 快速上手指南

> 5分钟让你的智能学习平台跑起来！

## 前置检查 ✅

在开始之前，确保你已经安装：
- ✅ Node.js 20 或更高版本
- ✅ 一个代码编辑器（推荐VS Code）
- ✅ DeepSeek或OpenAI的API密钥

检查Node版本：
```bash
node --version  # 应显示 v20.x.x 或更高
```

## 三种启动方式

### 🎯 方式一：一键启动（最简单）

**Windows用户**：
1. 双击 `quick-start.bat`
2. 按照提示操作即可

**Mac/Linux用户**：
```bash
chmod +x quick-start.sh
./quick-start.sh
```

脚本会自动帮你完成所有设置！

---

### 🛠️ 方式二：命令行启动（推荐）

```bash
# 1. 安装依赖（首次）
npm install

# 2. 配置环境（首次）
cp .env-new.example .env
# 编辑 .env，填入你的API密钥

# 3. 初始化数据库（首次）
npm run db:migrate

# 4. 启动开发服务器
npm run dev
```

---

### ⚙️ 方式三：分步启动（适合开发）

```bash
# 终端1：启动后端
npm run dev:server

# 终端2：启动前端  
npm run dev:client
```

## 访问应用 🌐

启动成功后，打开浏览器访问：

- **前端应用**: http://localhost:5173
- **后端API**: http://127.0.0.1:5000
- **健康检查**: http://127.0.0.1:5000/api/health

## 首次使用 🎓

### 1. 创建第一个学习目标

点击"学习目标" → "新建目标"，填写：
- 标题：如"学习React开发"
- 类别：选择"技术"
- 截止日期：设置一个合理的时间
- 预计时长：如40小时

### 2. 让AI生成学习计划

创建目标后，点击"生成学习计划"
- AI会自动分解为多个小任务
- 每个任务都有预估时间
- 任务之间有合理的顺序

### 3. 开始学习并记录

- 在"任务管理"查看今日任务
- 点击任务开始学习
- 记录学习时间和专注度
- 完成后标记为已完成

### 4. 查看数据分析

- 进入"数据分析"页面
- 查看学习时长趋势
- 了解完成率和效率
- 获取AI的改进建议

## 常见问题 ❓

### Q: API密钥在哪获取？
A: 
- **DeepSeek**: 访问 https://platform.deepseek.com/ 注册
- **OpenAI**: 访问 https://platform.openai.com/ 注册

### Q: 端口被占用怎么办？
A: 编辑 `.env` 文件，修改 `PORT=5000` 为其他端口

### Q: 数据存储在哪里？
A: 本地SQLite数据库，位置：`data/learning.db`

### Q: 如何添加测试数据？
A: 运行 `npm run db:seed`

### Q: AI功能不工作？
A: 检查：
1. `.env` 中的API密钥是否正确
2. 网络连接是否正常
3. API密钥是否有余额

## 下一步 📚

- 📖 阅读 [README-FINAL.md](README-FINAL.md) 了解完整功能
- 🎨 阅读 [PROJECT-DESCRIPTION.md](PROJECT-DESCRIPTION.md) 了解设计理念
- 🔧 阅读 [INSTALL.md](INSTALL.md) 了解详细配置
- 📈 阅读 [IMPROVEMENTS.md](IMPROVEMENTS.md) 了解改进亮点

## 获取帮助 💬

遇到问题？
- 📝 查看文档目录中的各个文档
- 🐛 创建GitHub Issue报告问题
- 💡 提出功能建议

## 小贴士 💡

1. **备份数据**: 定期运行 `npm run backup` 备份数据库
2. **测试数据**: 想重新开始？删除 `data/learning.db` 再运行 `npm run db:migrate`
3. **开发调试**: 打开浏览器开发者工具查看详细日志
4. **性能优化**: 关闭浏览器插件可能会提升性能

---

**准备好了吗？开始你的智能学习之旅吧！** 🎉

如果启动成功，你应该看到：

```
╔═══════════════════════════════════════╗
║   🚀 智能学习平台已启动               ║
║                                       ║
║   服务地址: http://127.0.0.1:5000    ║
║   环境: development                   ║
║   AI提供商: deepseek                  ║
╚═══════════════════════════════════════╝
```

现在打开浏览器，开始探索吧！✨

# 智能学习平台 - 安装指南

## 📋 前置要求

- **Node.js**: 版本 >= 20.0.0
- **npm**: 版本 >= 9.0.0
- **操作系统**: Windows / macOS / Linux

检查你的Node版本：
```bash
node --version  # 应该显示 v20.x.x 或更高
npm --version   # 应该显示 9.x.x 或更高
```

如果版本不符，请访问 https://nodejs.org/ 下载最新的LTS版本。

## 🚀 安装步骤

### 1. 准备项目文件

项目的所有新文件都以 `-new` 后缀命名，包括：
- `package-new.json`
- `tsconfig-new.json`
- `vite.config-new.ts`
- `tailwind.config-new.js`
- `postcss.config-new.js`
- `.env-new.example`
- `.gitignore-new`
- `client-new/` 目录
- `server-new/` 目录
- `shared-new/` 目录

### 2. 重命名配置文件

为了使用新的配置，你需要重命名或替换以下文件：

```powershell
# 在项目根目录执行

# 备份旧文件（可选）
Move-Item package.json package-old.json -ErrorAction SilentlyContinue
Move-Item tsconfig.json tsconfig-old.json -ErrorAction SilentlyContinue
Move-Item vite.config.ts vite.config-old.ts -ErrorAction SilentlyContinue
Move-Item tailwind.config.js tailwind.config-old.js -ErrorAction SilentlyContinue
Move-Item .env .env-old -ErrorAction SilentlyContinue

# 使用新配置
Copy-Item package-new.json package.json
Copy-Item tsconfig-new.json tsconfig.json
Copy-Item vite.config-new.ts vite.config.ts
Copy-Item tailwind.config-new.js tailwind.config.js
Copy-Item postcss.config-new.js postcss.config.js
Copy-Item .gitignore-new .gitignore
Copy-Item .env-new.example .env
```

如果你使用bash（Git Bash / WSL）：
```bash
# 备份旧文件
mv package.json package-old.json 2>/dev/null
mv tsconfig.json tsconfig-old.json 2>/dev/null
mv vite.config.ts vite.config-old.ts 2>/dev/null
mv tailwind.config.js tailwind.config-old.js 2>/dev/null
mv .env .env-old 2>/dev/null

# 使用新配置
cp package-new.json package.json
cp tsconfig-new.json tsconfig.json
cp vite.config-new.ts vite.config.ts
cp tailwind.config-new.js tailwind.config.js
cp postcss.config-new.js postcss.config.js
cp .gitignore-new .gitignore
cp .env-new.example .env
```

### 3. 安装依赖

```bash
npm install
```

这将安装所有必要的前后端依赖。安装过程可能需要几分钟。

### 4. 配置环境变量

编辑 `.env` 文件，填入你的配置：

```env
# 服务器端口（默认5000）
PORT=5000
NODE_ENV=development

# 数据库路径
DATABASE_PATH=./data/learning.db

# AI服务配置 - 选择一个provider并填入对应的API Key
AI_PROVIDER=deepseek

# DeepSeek API Key（如果使用DeepSeek）
DEEPSEEK_API_KEY=你的DeepSeek API密钥

# 或者使用 OpenAI
# AI_PROVIDER=openai
# OPENAI_API_KEY=你的OpenAI API密钥

# 前端开发服务器地址（默认不需要改）
CORS_ORIGIN=http://localhost:5173
```

**获取API密钥：**
- DeepSeek: 访问 https://platform.deepseek.com/ 注册并获取
- OpenAI: 访问 https://platform.openai.com/ 注册并获取

### 5. 初始化数据库

```bash
npm run db:migrate
```

这会创建SQLite数据库并初始化所有表结构。

### 6. （可选）添加测试数据

```bash
npm run db:seed
```

这会创建一些示例目标和任务，方便你快速体验功能。

## ✅ 启动应用

### 开发模式

同时启动前后端开发服务器（推荐）：
```bash
npm run dev
```

或者分别启动：
```bash
# 终端1：启动后端
npm run dev:server

# 终端2：启动前端
npm run dev:client
```

启动成功后，访问：
- **前端应用**: http://localhost:5173
- **后端API**: http://127.0.0.1:5000

### 生产模式

```bash
# 1. 构建前端
npm run build

# 2. 启动服务器
npm start
```

生产模式下，访问 http://127.0.0.1:5000 即可。

## 🔍 验证安装

访问 http://localhost:5173 ，你应该看到：
- 登录界面或工作台
- 左侧导航栏
- 如果运行了seed脚本，会看到示例数据

访问 http://127.0.0.1:5000/api/health ，应该返回：
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "2.0.0"
}
```

## 🐛 常见问题

### 问题1: `Cannot find module 'node:sqlite'`
**原因**: Node.js版本过低
**解决**: 升级到Node.js 20或更高版本

### 问题2: 端口被占用
```
Error: listen EADDRINUSE: address already in use :::5000
```
**解决**: 
- 修改 `.env` 中的 `PORT` 为其他值（如5001）
- 或者关闭占用5000端口的其他程序

### 问题3: AI服务调用失败
```
AI服务调用失败: Request failed with status code 401
```
**原因**: API密钥无效或未配置
**解决**: 
- 检查 `.env` 文件中的 `DEEPSEEK_API_KEY` 或 `OPENAI_API_KEY`
- 确保密钥没有多余的空格或引号
- 确认密钥是否有效（可能过期或余额不足）

### 问题4: 数据库权限错误
**原因**: 数据目录不存在或没有写入权限
**解决**: 
```bash
mkdir data
chmod 755 data  # Linux/Mac
```

### 问题5: 前端白屏
**原因**: 可能是依赖未正确安装或端口配置错误
**解决**: 
```bash
# 删除node_modules重新安装
rm -rf node_modules
npm install
npm run dev
```

## 📚 下一步

- 阅读 [README-NEW.md](README-NEW.md) 了解功能详情
- 访问工作台，创建你的第一个学习目标
- 体验AI助手自动生成学习计划
- 记录学习时间，查看数据分析

## 💡 提示

- 首次使用建议运行 `npm run db:seed` 查看示例数据
- 开发时建议使用两个终端分别查看前后端日志
- 数据库文件在 `data/learning.db`，可以随时删除重新初始化
- AI功能需要网络连接和有效的API密钥

祝你使用愉快！ 🎉

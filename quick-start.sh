#!/bin/bash

# 智能学习平台 - 快速启动脚本 (Linux/macOS)

echo ""
echo "═══════════════════════════════════════════════"
echo "    智能学习平台 - 快速启动脚本"
echo "═══════════════════════════════════════════════"
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js，请先安装Node.js 20或更高版本"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 显示Node版本
echo "✓ 检测到Node.js"
node --version
echo ""

# 检查是否需要初始化
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    echo ""
fi

# 检查环境配置
if [ ! -f ".env" ]; then
    echo "⚙️  未找到环境配置，正在创建..."
    cp .env-new.example .env
    echo ""
    echo "⚠️  请编辑 .env 文件，填入你的API密钥"
    echo "   - DEEPSEEK_API_KEY 或 OPENAI_API_KEY"
    echo ""
    read -p "按回车键继续编辑配置文件..."
    ${EDITOR:-nano} .env
fi

# 检查数据库
if [ ! -f "data/learning.db" ]; then
    echo ""
    echo "🔧 初始化数据库..."
    npm run db:migrate
    if [ $? -ne 0 ]; then
        echo "❌ 数据库初始化失败"
        exit 1
    fi

    echo ""
    read -p "🌱 是否添加测试数据? (y/n): " addSeed
    if [ "$addSeed" = "y" ] || [ "$addSeed" = "Y" ]; then
        npm run db:seed
    fi
fi

# 启动应用
echo ""
echo "🚀 正在启动应用..."
echo ""
echo "   前端: http://localhost:5173"
echo "   后端: http://127.0.0.1:5000"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务器"
echo "═══════════════════════════════════════════════"
echo ""

npm run dev

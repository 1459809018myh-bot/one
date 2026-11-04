@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════
echo     智能学习平台 - 快速启动脚本
echo ═══════════════════════════════════════════════
echo.

REM 检查Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未检测到Node.js，请先安装Node.js 20或更高版本
    echo    下载地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 显示Node版本
echo ✓ 检测到Node.js
node --version

REM 检查是否需要初始化
if not exist "node_modules" (
    echo.
    echo 📦 首次运行，正在安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
)

REM 检查环境配置
if not exist ".env" (
    echo.
    echo ⚙️  未找到环境配置，正在创建...
    copy .env-new.example .env
    echo.
    echo ⚠️  请编辑 .env 文件，填入你的API密钥
    echo    - DEEPSEEK_API_KEY 或 OPENAI_API_KEY
    echo.
    pause
    notepad .env
)

REM 检查数据库
if not exist "data\learning.db" (
    echo.
    echo 🔧 初始化数据库...
    call npm run db:migrate
    if %errorlevel% neq 0 (
        echo ❌ 数据库初始化失败
        pause
        exit /b 1
    )

    echo.
    echo 🌱 是否添加测试数据? (Y/N)
    set /p addSeed=
    if /i "%addSeed%"=="Y" (
        call npm run db:seed
    )
)

REM 启动应用
echo.
echo 🚀 正在启动应用...
echo.
echo    前端: http://localhost:5173
echo    后端: http://127.0.0.1:5000
echo.
echo 💡 提示: 按 Ctrl+C 停止服务器
echo ═══════════════════════════════════════════════
echo.

call npm run dev

pause

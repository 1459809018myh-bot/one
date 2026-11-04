@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════
echo     清理旧项目文件
echo ═══════════════════════════════════════════════
echo.
echo ⚠️  警告：此操作将删除原CoLife项目的所有文件！
echo.
echo 将要删除的内容：
echo   - apps/ 目录
echo   - docs/ 目录（旧文档）
echo   - shared/ 目录（旧共享文件）
echo   - tests/ 目录（旧测试）
echo   - prototype/ 目录
echo   - scripts/ 目录
echo   - 旧配置文件
echo.
echo 保留的内容：
echo   - server-new/ 目录
echo   - client-new/ 目录
echo   - shared-new/ 目录
echo   - *-new.* 配置文件
echo   - 所有 .md 文档文件
echo   - node_modules/
echo   - data/ 目录
echo.

set /p confirm="确认删除旧项目文件？(输入 YES 继续): "

if /i not "%confirm%"=="YES" (
    echo.
    echo ❌ 已取消删除操作
    pause
    exit /b 0
)

echo.
echo 🗑️  开始删除旧项目文件...
echo.

REM 删除目录
if exist "apps" (
    echo 删除 apps/ ...
    rmdir /s /q apps
)

if exist "docs" (
    echo 删除 docs/ ...
    rmdir /s /q docs
)

if exist "shared" (
    echo 删除 shared/ ...
    rmdir /s /q shared
)

if exist "tests" (
    echo 删除 tests/ ...
    rmdir /s /q tests
)

if exist "prototype" (
    echo 删除 prototype/ ...
    rmdir /s /q prototype
)

if exist "scripts" (
    echo 删除 scripts/ ...
    rmdir /s /q scripts
)

REM 删除旧配置文件（不带-new后缀的）
if exist "package.json" (
    echo 删除 package.json
    del /f /q package.json
)

if exist "package-lock.json" (
    echo 删除 package-lock.json
    del /f /q package-lock.json
)

if exist "tsconfig.json" (
    echo 删除 tsconfig.json
    del /f /q tsconfig.json
)

if exist "vite.config.ts" (
    echo 删除 vite.config.ts
    del /f /q vite.config.ts
)

if exist "tailwind.config.js" (
    echo 删除 tailwind.config.js
    del /f /q tailwind.config.js
)

if exist "postcss.config.js" (
    echo 删除 postcss.config.js
    del /f /q postcss.config.js
)

if exist ".gitignore" (
    echo 删除 .gitignore
    del /f /q .gitignore
)

if exist "README.md" (
    echo 删除旧 README.md
    del /f /q README.md
)

if exist "SECURITY.md" (
    echo 删除 SECURITY.md
    del /f /q SECURITY.md
)

echo.
echo ✅ 旧项目文件删除完成！
echo.
echo 📋 下一步：重命名新配置文件
echo.

REM 自动重命名配置文件
echo 重命名配置文件...
copy package-new.json package.json >nul 2>&1
copy tsconfig-new.json tsconfig.json >nul 2>&1
copy vite.config-new.ts vite.config.ts >nul 2>&1
copy tailwind.config-new.js tailwind.config.js >nul 2>&1
copy postcss.config-new.js postcss.config.js >nul 2>&1
copy .gitignore-new .gitignore >nul 2>&1

if not exist ".env" (
    copy .env-new.example .env >nul 2>&1
    echo ⚠️  已创建 .env 文件，请编辑并填入API密钥
)

echo.
echo ✅ 配置文件重命名完成！
echo.
echo 🎉 清理和配置完成！
echo.
echo 📝 当前项目结构：
echo   ├── server-new/      后端代码
echo   ├── client-new/      前端代码
echo   ├── shared-new/      共享类型
echo   ├── data/            数据库目录
echo   ├── node_modules/    依赖包
echo   └── 配置和文档文件
echo.
echo 🚀 现在可以运行：
echo    npm install  （如果还没安装依赖）
echo    npm run dev  （启动开发服务器）
echo.
pause

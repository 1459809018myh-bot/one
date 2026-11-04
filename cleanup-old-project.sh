#!/bin/bash

echo ""
echo "═══════════════════════════════════════════════"
echo "    清理旧项目文件"
echo "═══════════════════════════════════════════════"
echo ""
echo "⚠️  警告：此操作将删除原CoLife项目的所有文件！"
echo ""
echo "将要删除的内容："
echo "  - apps/ 目录"
echo "  - docs/ 目录（旧文档）"
echo "  - shared/ 目录（旧共享文件）"
echo "  - tests/ 目录（旧测试）"
echo "  - prototype/ 目录"
echo "  - scripts/ 目录"
echo "  - 旧配置文件"
echo ""
echo "保留的内容："
echo "  - server-new/ 目录"
echo "  - client-new/ 目录"
echo "  - shared-new/ 目录"
echo "  - *-new.* 配置文件"
echo "  - 所有 .md 文档文件"
echo "  - node_modules/"
echo "  - data/ 目录"
echo ""

read -p "确认删除旧项目文件？(输入 YES 继续): " confirm

if [ "$confirm" != "YES" ]; then
    echo ""
    echo "❌ 已取消删除操作"
    exit 0
fi

echo ""
echo "🗑️  开始删除旧项目文件..."
echo ""

# 删除目录
[ -d "apps" ] && echo "删除 apps/ ..." && rm -rf apps
[ -d "docs" ] && echo "删除 docs/ ..." && rm -rf docs
[ -d "shared" ] && echo "删除 shared/ ..." && rm -rf shared
[ -d "tests" ] && echo "删除 tests/ ..." && rm -rf tests
[ -d "prototype" ] && echo "删除 prototype/ ..." && rm -rf prototype
[ -d "scripts" ] && echo "删除 scripts/ ..." && rm -rf scripts

# 删除旧配置文件
[ -f "package.json" ] && echo "删除 package.json" && rm -f package.json
[ -f "package-lock.json" ] && echo "删除 package-lock.json" && rm -f package-lock.json
[ -f "tsconfig.json" ] && echo "删除 tsconfig.json" && rm -f tsconfig.json
[ -f "vite.config.ts" ] && echo "删除 vite.config.ts" && rm -f vite.config.ts
[ -f "tailwind.config.js" ] && echo "删除 tailwind.config.js" && rm -f tailwind.config.js
[ -f "postcss.config.js" ] && echo "删除 postcss.config.js" && rm -f postcss.config.js
[ -f ".gitignore" ] && echo "删除 .gitignore" && rm -f .gitignore
[ -f "README.md" ] && echo "删除旧 README.md" && rm -f README.md
[ -f "SECURITY.md" ] && echo "删除 SECURITY.md" && rm -f SECURITY.md

echo ""
echo "✅ 旧项目文件删除完成！"
echo ""
echo "📋 下一步：重命名新配置文件"
echo ""

# 自动重命名配置文件
echo "重命名配置文件..."
cp package-new.json package.json 2>/dev/null
cp tsconfig-new.json tsconfig.json 2>/dev/null
cp vite.config-new.ts vite.config.ts 2>/dev/null
cp tailwind.config-new.js tailwind.config.js 2>/dev/null
cp postcss.config-new.js postcss.config.js 2>/dev/null
cp .gitignore-new .gitignore 2>/dev/null

if [ ! -f ".env" ]; then
    cp .env-new.example .env 2>/dev/null
    echo "⚠️  已创建 .env 文件，请编辑并填入API密钥"
fi

echo ""
echo "✅ 配置文件重命名完成！"
echo ""
echo "🎉 清理和配置完成！"
echo ""
echo "📝 当前项目结构："
echo "  ├── server-new/      后端代码"
echo "  ├── client-new/      前端代码"
echo "  ├── shared-new/      共享类型"
echo "  ├── data/            数据库目录"
echo "  ├── node_modules/    依赖包"
echo "  └── 配置和文档文件"
echo ""
echo "🚀 现在可以运行："
echo "   npm install  （如果还没安装依赖）"
echo "   npm run dev  （启动开发服务器）"
echo ""

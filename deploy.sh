#!/bin/bash

# 部署到 Cloudflare Pages 的快速脚本

echo "🚀 开始部署 NotesView 到 Cloudflare Pages..."
echo ""

# 检查 wrangler 是否已安装
if ! command -v wrangler &> /dev/null; then
    echo "❌ 未检测到 Wrangler CLI"
    echo "请先安装: npm install -g @cloudflare/wrangler"
    exit 1
fi

echo "✅ 检测到 Wrangler CLI"
echo ""

# 构建项目
echo "📦 构建项目..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi
echo "✅ 构建成功"
echo ""

# 部署到 Cloudflare Pages
echo "🌐 部署到 Cloudflare Pages..."
wrangler pages deploy dist

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "📝 后续步骤:"
    echo "1. 访问 https://dash.cloudflare.com 查看部署状态"
    echo "2. 绑定自定义域名（可选）"
    echo "3. 配置环境变量（如需要）"
else
    echo ""
    echo "❌ 部署失败"
    echo "请检查 Cloudflare 账户和网络连接"
    exit 1
fi

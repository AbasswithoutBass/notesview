# 🚀 快速部署参考卡

## 一句命令部署

```bash
npm install -g @cloudflare/wrangler && wrangler login && ./deploy.sh
```

## 分步命令

```bash
# 1️⃣ 全局安装 Wrangler（仅需一次）
npm install -g @cloudflare/wrangler

# 2️⃣ 登录 Cloudflare（仅需一次）
wrangler login

# 3️⃣ 每次部署时运行
./deploy.sh
```

或者：

```bash
npm run build && wrangler pages deploy dist
```

## 预期输出

```
✓ Project name: notesview
✓ Deployment ID: abc123def456
✓ Deployment URL: https://notesview.pages.dev
✓ Website: https://notesview.pages.dev
```

## 部署后访问

访问 `https://notesview.pages.dev` (URL 可能不同，取决于项目名称)

## 状态检查

检查部署状态：https://dash.cloudflare.com → Pages → notesview

## 常见问题速查

| 问题 | 解决方案 |
|-----|--------|
| wrangler: command not found | `npm install -g @cloudflare/wrangler` |
| 未登录错误 | `wrangler login` |
| 页面空白 | 检查浏览器控制台错误 / 清除缓存 |
| 音频不工作 | 点击音频启动按钮 / 检查浏览器设置 |
| 资源 404 | 检查 _redirects 文件是否在 dist/ 中 |

## 文档快链

- 📖 [完整部署指南](./DEPLOYMENT.md)
- ✅ [部署检查清单](./DEPLOYMENT_CHECKLIST.md)
- 📊 [部署总结](./DEPLOYMENT_SUMMARY.md)
- 📝 [项目 README](./README.md)

## 一键脚本

如果上述命令中任何一个失败，使用提供的脚本：

```bash
chmod +x deploy.sh
./deploy.sh
```

该脚本会自动：
1. 检查 wrangler 是否已安装
2. 构建项目
3. 部署到 Cloudflare

---

**提示：** 首次部署可能需要 2-3 分钟。后续部署通常只需 30-60 秒。

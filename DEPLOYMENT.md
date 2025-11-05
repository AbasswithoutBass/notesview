# 部署到 Cloudflare 指南

## 前置条件
1. 有 Cloudflare 账户（免费账户即可）
2. 已安装 Node.js 和 npm
3. 已安装 Wrangler CLI：`npm install -g @cloudflare/wrangler`

## 部署步骤

### 方式一：使用 Cloudflare Pages（推荐）

#### 1. 构建项目
```bash
npm run build
```

#### 2. 登录 Cloudflare
```bash
wrangler login
```
浏览器会打开 Cloudflare 登录页面，选择授权

#### 3. 部署到 Cloudflare Pages
```bash
wrangler pages deploy dist
```

系统会提示选择项目名称（如果首次部署），输入 `notesview`

#### 4. 等待部署完成
部署完成后会收到一个 `*.pages.dev` 的 URL

---

### 方式二：通过 GitHub 仓库自动部署

这种方式更推荐，因为每次 push 到 main 分支都会自动部署

#### 1. 在 GitHub 上推送代码
```bash
git add .
git commit -m "Ready for Cloudflare deployment"
git push origin main
```

#### 2. 在 Cloudflare 控制面板创建 Pages 项目
- 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
- 选择 "Pages"
- 点击 "连接到 Git"
- 选择 GitHub 仓库 `notesview`
- 配置构建设置：
  - **Framework preset**: React
  - **Build command**: `npm run build`
  - **Build output directory**: `dist`
  - **Environment variables**: （暂无需要）

#### 3. 部署
点击 "Save and Deploy"，自动开始部署

---

## 自定义域名（可选）

如果您有自己的域名：

1. 在 Cloudflare 控制面板进入 Pages 项目
2. 选择 "Custom domain"
3. 输入您的域名，按照提示配置 DNS 记录

---

## 部署后验证

访问部署的 URL，确保：
- ✅ 应用正常加载
- ✅ 五线谱能够正常显示
- ✅ 音频功能正常（Tone.js）
- ✅ 键盘输入正常响应
- ✅ 统计数据能保存到 localStorage

---

## 常见问题

### Q: 部署后页面显示空白
**A:** 检查浏览器控制台是否有错误。可能原因：
- 资源路径问题：更新 vite.config.js 中的 `base` 配置
- CORS 问题：检查字体加载

### Q: 如何更新已部署的应用
**A:** 
- 方式一：重新运行 `wrangler pages deploy dist`
- 方式二：推送到 GitHub，自动触发重新部署

### Q: 如何回滚到之前的版本
**A:** 
在 Cloudflare Pages 控制面板，选择之前的 Deployment 并点击 "Rollback"

---

## 环境变量配置（如需要）

如果应用需要环境变量（如 API URLs），在 Cloudflare Pages 项目设置中：
1. 进入 Settings → Environment variables
2. 添加变量（支持 production 和 preview 环境）

---

## 文件说明

- `wrangler.toml` - Wrangler 配置文件
- `dist/_redirects` - Cloudflare Pages 重定向规则（支持 SPA 路由）
- `dist/` - 构建输出目录，包含所有生产文件

---

## 获取帮助

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler 文档](https://developers.cloudflare.com/workers/wrangler/)
- [GitHub Discussions](https://github.com/AbassWithoutBass/notesview/discussions)

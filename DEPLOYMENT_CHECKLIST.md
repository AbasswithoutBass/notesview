# Cloudflare 部署清单

## 📋 部署前准备

- [ ] Cloudflare 账户已创建（免费账户即可）
- [ ] Node.js 已安装
- [ ] npm 已安装
- [ ] 代码已提交到 Git（推荐）

## 🔧 安装 Wrangler CLI

```bash
npm install -g @cloudflare/wrangler
```

验证安装：
```bash
wrangler --version
```

- [ ] Wrangler 已安装

## 📱 方式一：命令行部署（快速）

### 步骤 1: 登录 Cloudflare
```bash
wrangler login
```
- [ ] 已登录 Cloudflare

### 步骤 2: 构建项目
```bash
npm run build
```
- [ ] 构建成功（检查 dist/ 文件夹）

### 步骤 3: 部署
```bash
wrangler pages deploy dist
```

或使用提供的脚本：
```bash
./deploy.sh
```

- [ ] 部署完成
- [ ] 已获得 *.pages.dev URL

## 🌐 方式二：通过 GitHub 自动部署（推荐）

### 步骤 1: 推送代码到 GitHub
```bash
git add .
git commit -m "Prepare for Cloudflare deployment"
git push origin main
```
- [ ] 代码已推送到 GitHub

### 步骤 2: 连接到 Cloudflare Pages
访问 https://dash.cloudflare.com/
1. 进入 Pages 部分
2. 点击 "连接到 Git"
3. 授权 GitHub 访问权限
4. 选择 `notesview` 仓库

- [ ] GitHub 已连接

### 步骤 3: 配置构建设置

- Project name: `notesview`
- Framework preset: `React` 或留空
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`

- [ ] 构建配置已保存

### 步骤 4: 部署
点击 "Save and Deploy"

- [ ] 首次部署完成

## ✅ 部署后验证

访问提供的 URL，检查以下功能：

- [ ] 页面正常加载
- [ ] 五线谱正常显示
- [ ] 琴键正常显示
- [ ] 音频播放正常（点击琴键应有声音）
- [ ] 键盘输入正常响应
- [ ] 模式切换正常
- [ ] 统计数据能保存到 localStorage
- [ ] 没有浏览器控制台错误

## 🎯 自定义域名（可选）

如果您拥有自己的域名：

1. 在 Cloudflare Pages 控制面板
2. 进入项目 → Settings → Custom domain
3. 输入您的域名
4. 按照提示配置 DNS

- [ ] 自定义域名已配置

## 📊 监控和日志

访问 Cloudflare 控制面板：
- 查看构建历史
- 查看部署日志
- 检查错误日志
- 监控请求统计

- [ ] 已检查控制面板

## 🔄 后续更新流程

### 自动部署（推荐）
1. 在本地做修改
2. 提交到 Git：`git add . && git commit -m "message"`
3. 推送：`git push origin main`
4. Cloudflare 自动构建和部署（2-3 分钟）

### 手动部署
1. 本地构建：`npm run build`
2. 部署：`wrangler pages deploy dist` 或 `./deploy.sh`

## ❓ 常见问题排查

### 部署失败
- 检查 wrangler 登录状态：`wrangler whoami`
- 查看 Cloudflare 账户配额限制
- 检查 dist/ 文件夹是否存在且有内容

### 页面加载失败
- 检查浏览器控制台 → Network 标签
- 检查浏览器控制台 → Console 标签错误
- 清除缓存并重新加载

### 资源加载失败
- 检查是否所有 CSS、JS 文件都在 dist/ 中
- 验证 index.html 中的脚本路径

### 音频不工作
- 检查浏览器是否允许音频播放
- 查看控制台错误信息
- 确认 tone.js 正确加载

## 📞 获取帮助

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Wrangler 文档](https://developers.cloudflare.com/workers/wrangler/)
- Cloudflare 支持：https://support.cloudflare.com

---

✨ 祝部署顺利！

# 🤖 GitHub Actions 自动部署到 Cloudflare Pages

已配置完成！此指南说明如何启用自动部署。

## ✅ 已创建的 GitHub Actions 工作流

文件：`.github/workflows/deploy.yml`

**功能：**
- ✓ 监听 main 分支的 push 事件
- ✓ 自动运行 CI 检查
- ✓ 自动构建项目
- ✓ 自动部署到 Cloudflare Pages
- ✓ 支持 PR 预览部署（可选）

## 🔧 配置步骤

### 步骤 1：获取 Cloudflare 凭证

访问 Cloudflare 控制面板：https://dash.cloudflare.com

**获取 Account ID：**
1. 登录 Cloudflare
2. 在右侧 Account Information 部分查看 Account ID（复制）

**获取 API Token：**
1. 进入 Account → API Tokens
2. 点击 "Create Token"
3. 选择 "Create Custom Token" 或使用预设
4. 所需权限：
   - Account → Cloudflare Pages → Edit
   - Account → Workers Scripts → Edit
   - Zone → Workers Routes → Edit
5. 点击 "Continue to summary"
6. 复制生成的 Token

### 步骤 2：添加 GitHub Secrets

进入 GitHub 仓库：https://github.com/AbasswithoutBass/notesview

1. 点击 **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**

**添加第一个 Secret：**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: （粘贴步骤 1 中复制的 Account ID）
- 点击 **Add secret**

**添加第二个 Secret：**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: （粘贴步骤 1 中复制的 API Token）
- 点击 **Add secret**

### 步骤 3：验证部署

现在每次 push 到 main 分支时：

1. GitHub Actions 会自动触发
2. 运行 CI 检查（lint、build）
3. 构建项目
4. 部署到 Cloudflare Pages

**查看部署状态：**
- GitHub: Repo → **Actions** 标签
- Cloudflare: https://dash.cloudflare.com → Pages → notesview

## 📝 部署流程

```
开发者 push 到 main
        ↓
GitHub Actions 触发
        ↓
✓ Checkout 代码
✓ 安装 Node.js
✓ 安装依赖
✓ 运行构建
✓ 上传到 Cloudflare
        ↓
部署完成（2-3 分钟）
        ↓
自动获得预览 URL
```

## 🚀 使用方式

部署后，只需正常的 Git 工作流：

```bash
# 1. 在本地修改代码
vim src/App.jsx

# 2. 提交变更
git add .
git commit -m "Fix: improve user experience"

# 3. 推送到 main
git push origin main

# 4. 自动部署开始
# 检查 GitHub Actions 标签查看进度
```

## 📊 自动部署的优势

✓ **完全自动化** - 无需手动运行脚本  
✓ **可靠性** - 每次都执行相同的步骤  
✓ **快速** - 从 push 到上线只需 2-3 分钟  
✓ **可追踪** - GitHub 保存完整的部署历史  
✓ **安全** - 凭证存储在 GitHub Secrets，不暴露  
✓ **PR 预览** - 支持为 Pull Request 创建预览部署（可选配置）

## ⚙️ 工作流文件说明

`.github/workflows/deploy.yml` 做了什么：

```yaml
name: Deploy to Cloudflare Pages  # 工作流名称

on:
  push:
    branches: [ main ]            # 监听 main 分支的 push
  pull_request:
    branches: [ main ]            # 也可为 PR 部署

jobs:
  deploy:
    runs-on: ubuntu-latest        # 运行环境
    
    steps:
      # 1. 检出代码
      - uses: actions/checkout@v4
      
      # 2. 设置 Node.js 20
      - uses: actions/setup-node@v4
      
      # 3. 安装依赖
      - run: npm ci
      
      # 4. 构建项目
      - run: npm run build
      
      # 5. 部署到 Cloudflare
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=notesview
```

## 🔗 查看部署历史

**GitHub Actions 日志：**
1. https://github.com/AbasswithoutBass/notesview
2. 点击 **Actions** 标签
3. 选择最新的 "Deploy to Cloudflare Pages" 工作流
4. 查看详细日志

**Cloudflare Pages 日志：**
1. https://dash.cloudflare.com
2. Pages → notesview
3. 查看 Deployments 标签

## ❌ 常见问题

### Q: Actions 执行失败
**A:** 检查：
1. Secrets 是否正确添加（Settings → Secrets）
2. 凭证是否有效（访问 Cloudflare 控制面板验证）
3. GitHub Actions 日志的错误信息

### Q: 部署很慢
**A:** 这是正常的：
- 首次部署：2-3 分钟（包括依赖缓存构建）
- 后续部署：1-2 分钟（npm ci 使用缓存）

### Q: 如何禁用自动部署
**A:** 
```bash
# 临时禁用：不 push 到 main，改用其他分支
git push origin feature-branch

# 完全禁用：删除或重命名工作流文件
mv .github/workflows/deploy.yml .github/workflows/deploy.yml.bak
```

### Q: 如何只在 main 分支部署
**A:** 已配置完成，只监听 main 分支

```yaml
on:
  push:
    branches: [ main ]  # 仅 main
```

## 💡 进阶配置

### 添加 PR 预览部署

编辑 `.github/workflows/deploy.yml`，修改 `on` 部分：

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

现在每个 PR 都会创建一个预览部署！

### 添加部署通知

可以添加 Slack/Discord/Email 通知（需额外配置）

## 📚 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Wrangler Actions](https://github.com/cloudflare/wrangler-action)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare API Tokens](https://dash.cloudflare.com/profile/api-tokens)

## ✨ 下一步

1. ✅ 已创建 `.github/workflows/deploy.yml`
2. 📌 按照上述步骤添加 GitHub Secrets
3. 🚀 Push 任何代码到 main，自动部署开始
4. 📊 在 Actions 标签监控部署进度

---

**祝自动部署顺利！** 🎉

有问题？查看 GitHub Actions 日志或 Cloudflare 控制面板的详细信息。

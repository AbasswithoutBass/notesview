# 贡献指南

感谢你考虑为 NotesView 项目做出贡献！以下是一些指导原则。

## 开发流程

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的修改 (`git commit -m 'feat: add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 提交规范

我们使用 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/) 规范：

- `feat`: 新功能
- `fix`: 修复问题
- `docs`: 文档修改
- `style`: 代码格式修改
- `refactor`: 重构代码
- `test`: 测试相关
- `chore`: 构建过程或辅助工具的变动

示例：
```
feat: 添加黑键支持
fix: 修复音频播放延迟问题
docs: 更新安装说明
```

## 开发设置

1. 安装依赖：
```bash
npm install
```

2. 运行开发服务器：
```bash
npm run dev
```

3. 运行测试：
```bash
npm test
```

## 代码风格

- 使用 ESLint 和 Prettier 进行代码格式化
- 组件使用函数式编写
- 文件使用 `.jsx` 扩展名
- 保持代码简洁和可读性

## Pull Request 指南

1. PR 应该包含完整的功能或修复
2. 更新相关的文档
3. 如果添加新功能，请包含测试
4. 确保所有测试通过
5. 遵循现有的代码风格

## Issue 指南

创建 Issue 时请包含：

1. 问题的详细描述
2. 复现步骤（如果是 bug）
3. 预期行为
4. 实际行为
5. 截图（如果适用）
6. 环境信息

## 项目结构说明

```
src/
├── components/     # React 组件
├── hooks/         # 自定义 Hooks
├── utils/         # 工具函数
└── App.jsx        # 主应用
```

## 分支策略

- `main`: 稳定版本分支
- `develop`: 开发分支
- `feature/*`: 特性分支
- `fix/*`: 修复分支

## 本地开发技巧

1. 使用 React DevTools 调试
2. Chrome 音频调试工具
3. VexFlow 调试技巧

## 联系方式

如有任何问题，请通过 Issue 或讨论区联系我们。
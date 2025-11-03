---
name: Feature — Random Quiz Generator
about: Implement random question generation and answer checking for single-note quizzes.
labels: enhancement, feature
---

### 概要
实现随机出题模块，支持配置音域与题型（单音识别），并在用户选择答案时即时判断对错。

### 验收标准
- 能根据配置生成随机音符；
- 用户点击琴键即可提交答案并得到即时反馈；
- 提供“下一题”与“重新作答”功能；
- 能记录用户每题答题结果（供统计使用）。

### 实现建议
- 在 `App.jsx` 或新模块中提供题目管理器（QuizManager）；
- 保持与 `Staff` 与 `useAudio` 的无缝集成；

### 优先级
高

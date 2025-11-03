---
name: Feature — Practice Statistics & Persistence
about: Track practice sessions and present simple statistics.
labels: enhancement, analytics
---

### 概要
为练习添加本地持久化（`localStorage`）与统计视图，展示正确率、题目数量与练习时长。

### 验收标准
- 练习结果能持久化并在页面刷新后仍可读取；
- 提供按日期或练习类型筛选的数据视图；
- 能以表格或简单图表形式展示趋势（可用轻量库或纯 SVG）。

### 实现建议
- 使用 `localStorage` 存储练习记录；
- 提供 `StatsView` 组件展示数据；

### 优先级
中

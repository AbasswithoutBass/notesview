---
name: Feature — Teacher Mode (authoring & grading)
about: Provide a teacher interface for creating quizzes and viewing student performance.
labels: enhancement, feature, teacher
---

### 概要
实现教师端功能，允许教师创建题单（题集）、布置练习并查看学生提交的成绩（初期可为本地模拟）。

### 验收标准
- 教师可创建/编辑题集并导出为 JSON；
- 学生端可加载题集进行练习；
- 教师视图能展示学生的练习统计（本地或模拟数据）。

### 实现建议
- 为题集定义简单 JSON 结构；
- 提供导入/导出功能；

### 优先级
中

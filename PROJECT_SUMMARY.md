# 识谱练耳训练器 — 项目总结提纲（for VS Code）

## 一、项目目标与初衷

教学背景：

针对中学音乐专业学生识谱与听音能力薄弱的问题，设计一个可交互的“五线谱 + 虚拟钢琴”教学工具。

结合音频播放与视觉反馈，帮助学生通过“听–看–点”三维联动加深记忆。

主要目的：

实现一个网页端应用，点击琴键即可听音并在五线谱上显示相应音符。

后续扩展目标：实现“随机出题 + 答题反馈 + 统计分析”的完整识谱训练系统。


## 二、开发环境与技术选型

| 项目部分 | 使用技术 | 说明 |
|---|---:|---|
| 前端框架 | React + Vite | 轻量高效，支持模块化开发 |
| 音频处理 | Tone.js | 生成与播放音符 |
| 乐谱绘制 | VexFlow | 动态绘制五线谱、音符 |
| 状态管理 | React Hooks | 控制当前音符状态 |
| IDE 开发 | VS Code | 代码调试、模块组织、版本管理 |


## 三、主要实现功能

### ✅ 已完成部分

- 五线谱绘制模块（`Staff.jsx`）
  - 使用 VexFlow 绘制简化谱面；
  - 能根据输入音符自动刷新显示；
  - 支持高音谱号、4/4 拍。

- 虚拟键盘模块（`PianoKeyboard.jsx`）
  - 白键可点击；
  - 点击后触发音符播放与谱面更新；
  - 简洁直观，学生易上手。

- 音频合成模块（`useAudio.jsx`）
  - 封装 Tone.js 播放逻辑；
  - 用户交互后激活音频上下文（解决 Chrome 自动播放限制）；
  - 播放时长控制与合成器初始化已完善。

- 主控制模块（`App.jsx`）
  - 负责模块间数据流传递（note → `Staff` & Audio）；
  - 控制界面布局、状态管理。


## 四、开发中遇到的关键问题与解决方案

| 问题 | 解决思路 |
|---|---|
| Tone.js 在未交互时无法播放 | 添加用户点击监听，触发 `Tone.start()` |
| VexFlow 渲染报错 “NaN fraction” | 确保传入的 note 为合法键名（如 `C4`、`D4`）|
| React 渲染重复导致白屏 | 渲染前清理上次 SVG 元素（如 `div.innerHTML = ""`）|
| 文件扩展名错误 (.js/.jsx) | 统一使用 `.jsx` 并更新 import 引用 |


## 五、项目开发过程简述

- 初始化阶段：
  - 使用 `npm create vite@latest` 初始化项目；
  - 安装依赖：`npm install react vexflow tone`；
  - 搭建基本项目结构并测试开发服务器。

- 模块分工阶段：
  - `useAudio.jsx` 封装音频逻辑；
  - `Staff.jsx` 实现乐谱绘制；
  - `PianoKeyboard.jsx` 实现交互界面；
  - `App.jsx` 整合整体逻辑。

- 调试与修正阶段：
  - 解决 Tone.js 权限问题；
  - 修正 VexFlow 渲染错误；
  - 美化布局与交互体验；
  - 验证多个音符切换逻辑正确性。


## 六、目前成果展示

启动项目后，可通过点击琴键：

- 听到相应音高；
- 在五线谱上同步显示；
- 控制台输出音符日志；

项目结构清晰，易扩展。


## 七、下一步计划（TODO）

| 方向 | 目标描述 |
|---|---|
| 🎹 键盘扩展 | 增加黑键、更多八度范围 |
| 🎼 随机识谱 | 系统随机出题、学生答题识别正确音 |
| 📊 数据记录 | 加入答题成绩统计、练习日志 |
| 💡 教师模式 | 教师端出题，学生端练习、评分 |
| 🎨 美化界面 | 与 UI 设计工具（如 Figma / Claude）协作，优化视觉风格 |


## 八、开发小结

本项目实现了音乐教育数字化的初步探索，通过结合 VexFlow 与 Tone.js，将听觉与视觉训练统一到交互界面中。

在教学中可用作课堂演示、学生自测、视唱练耳辅助工具，为后续多功能扩展奠定基础。


---

## 在 VS Code 中的使用建议

- 打开项目后，可在侧边栏直接打开 `PROJECT_SUMMARY.md` 进行查看与编辑；
- 在预览中（右上角的“Open Preview”或按 `Ctrl/Cmd+K V`）可以实时查看渲染效果；
- 建议将该文件作为提交描述或 release notes 的草稿，便于在课堂或 README 中复用。


## 建议的下一步操作（可在 VS Code 中执行）

1. 将 `七、下一步计划` 中的每一项拆分为独立 issue 或工作项（使用 GitHub Projects / Issues）；
2. 优先实现黑键与更多八度，完善 `PianoKeyboard.jsx` 和相关样式；
3. 为答题统计设计简单的数据模型（本地 `localStorage` 或后端 API）；
4. 准备一个教学演示视频或 GIF，用于课堂快速演示。


## 九、任务拆分（可直接作为 Issue 模板）

下面每一项都是可直接复制到 GitHub Issue 的模板：包含建议的标题、简短描述、验收标准和优先级，便于马上创建任务并分配。

- Issue: Add black keys and extend octaves to PianoKeyboard
  - 描述：在现有 `PianoKeyboard.jsx` 中增加黑键渲染逻辑并扩展可用八度到至少 3 个八度。需兼容现有点击/播放逻辑。
  - 验收标准：黑键可见且可点击；点击黑键能正确触发 `useAudio` 播放并在 `Staff` 上显示相应音符；样式在移动端不溢出。
  - 优先级：高

- Issue: Implement random quiz generator and answer checking
  - 描述：实现随机出题模块（后端或前端实现均可），题型为单音识别；用户点击琴键提交答案并立即给出对错反馈。
  - 验收标准：可设置题库范围（八度/音域）；记录每题正确与否；提供“下一题”按钮。
  - 优先级：高

- Issue: Add practice statistics and local persistence
  - 描述：为每次练习记录答题结果（正确率、用时等），并保存到 `localStorage`；提供简单的统计视图（表格或折线图）。
  - 验收标准：本地可持久化至少 30 天的数据；统计视图能按日期/练习类型筛选。
  - 优先级：中

- Issue: Teacher mode — authoring and grading interface
  - 描述：实现教师端功能，允许教师创建题单、布置练习，并查看学生统计/成绩（初期可为本地模拟模式）。
  - 验收标准：教师能创建题集并导出为 JSON；学生端能够加载题集进行练习并将结果返回教师视图。
  - 优先级：中

- Issue: UI polish and design system
  - 描述：与设计师协作重做样式，制定颜色/间距/组件规范，并实现响应式布局。
  - 验收标准：移动端与桌面端显示一致；新增一个可复用的 `Key` 组件并提取通用样式。
  - 优先级：低

> 使用方法：复制上面的任意一个 Issue 的“标题 + 描述 + 验收标准”到 GitHub 新建 Issue 窗口，添加合适标签（如 `feature`, `enhancement`, `bug`）及分配人。

---

## 附：自动创建 GitHub Issues 的辅助脚本

我已在项目根目录生成脚本 `create_github_issues.sh`：

- 功能：在你本地安装并登录 GitHub CLI（`gh`）后，将 `.github/ISSUE_TEMPLATE/` 中的模板作为 issues 提交到指定仓库。
- 使用方法：在项目根运行（若脚本没有执行权限，先 `chmod +x create_github_issues.sh`）：

```bash
# 交互模式（会提示输入 owner/repo）
./create_github_issues.sh

# 或直接在命令行中传入仓库
./create_github_issues.sh owner/repo
```

注意：当前环境检测到本地不是 git 仓库且 `gh` CLI 未安装/配置，因此我无法在当前环境直接提交 issues。运行脚本前请先：

1. 在你的机器上安装并登录 GitHub CLI：参考 https://cli.github.com/
2. 确保你有目标仓库的写权限（Issues 权限）。

运行脚本后会依次尝试提交 5 个 issue，若失败会打印错误信息供排查。

_文件生成于项目根目录，文件名：`PROJECT_SUMMARY.md`。_
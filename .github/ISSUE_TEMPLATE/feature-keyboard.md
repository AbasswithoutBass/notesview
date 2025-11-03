---
name: Feature — Keyboard: black keys & extended octaves
about: Add black key support and extend the keyboard range.
labels: enhancement, feature, frontend
---

### 概要
在 `PianoKeyboard.jsx` 中增加黑键并扩展八度范围，保证黑键与白键在视觉与交互上均可用。

### 验收标准
- 黑键可见且样式正确；
- 黑键可点击并触发 `useAudio` 播放对应音高；
- 点击黑键时 `Staff` 能正确显示相应音符；
- 在移动端（小屏）不出现溢出或遮挡。

### 实现建议
- 将键位数据结构扩展为包含黑键信息（半音偏移）；
- 提取通用 `Key` 组件，支持 `isBlack` 属性；

### 相关文件
- `src/components/PianoKeyboard.jsx`
- `src/components/Key.jsx`（若需新增）

### 优先级
高

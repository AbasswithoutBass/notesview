# NotesView - 识谱练耳训练器

帮助音乐专业学生提高识谱与听音能力的互动式网页应用。通过结合五线谱显示与虚拟钢琴，为学生提供直观的"听–看–点"三维联动学习体验。

## 🎯 主要功能

- 虚拟钢琴键盘（当前支持白键）
- 实时五线谱显示
- 音频合成与播放
- 交互式学习界面

## 🚀 快速开始

1. 克隆仓库
```bash
git clone https://github.com/AbasswithoutBass/notesview.git
cd notesview
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:5173 开始使用！

## 🛠️ 技术栈

- **前端框架**: React + Vite
- **音频处理**: Tone.js
- **乐谱渲染**: VexFlow
- **状态管理**: React Hooks

## 📦 项目结构

```
src/
├── components/         # React 组件
│   ├── PianoKeyboard.jsx  # 虚拟键盘
│   └── Staff.jsx          # 五线谱显示
├── hooks/              # 自定义 Hooks
│   └── useAudio.jsx       # 音频处理逻辑
├── utils/             # 工具函数
│   └── keymap.js         # 键盘映射
└── App.jsx            # 主应用组件
```

## 🤝 参与贡献

欢迎提交 PR 和 Issue！请查看 [贡献指南](CONTRIBUTING.md) 了解详情。

## 📋 开发计划

目前正在进行的开发计划：

1. 🎹 扩展键盘功能（添加黑键支持）
2. 🎼 实现随机出题功能
3. 📊 添加练习统计与进度跟踪
4. 💡 开发教师端功能
5. 🎨 优化用户界面设计

完整的任务列表请查看 [Issues](https://github.com/AbasswithoutBass/notesview/issues)。

## 📄 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。
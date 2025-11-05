# NotesView - 识谱练耳训练器 🎵

> 帮助音乐专业学生提高识谱与听音能力的互动式网页应用。通过结合五线谱显示与虚拟钢琴，为学生提供直观的"听–看–点"三维联动学习体验。

## ✨ 特色

- 🎹 逼真的虚拟钢琴键盘，支持点击和键盘输入
- 📝 动态生成的五线谱，带优雅的动画效果
- 🎧 高品质音频合成，使用 Tone.js
- 🎮 多种练习难度，从初级到大师
- 📊 详细的练习统计与成果记录，带记忆曲线复习提示
- 🌙 响应式设计，支持多端使用

## 🎯 主要功能

### 💫 基本功能
- 虚拟钢琴键盘（支持白键和黑键）
- 实时五线谱显示（带动画效果）
- 音频合成与播放
- 多种键盘布局支持

### 🎮 练习模式
- 四个难度等级的视奏练习：
  1. 🌱 初级：单音练习
  2. 🌿 中级：音程练习（两音）
  3. 🌳 高级：三和弦练习
  4. 🎓 大师：七和弦练习
- 计分系统：
  - ⏱️ 反应时间记录
  - 🎯 准确度统计
  - 🏆 综合得分计算（根据速度与连击动态奖励）
  - 📊 练习历史记录与记忆曲线
- 游戏化元素：
  - 连击奖励与错题惩罚
  - 进度追踪与复习提醒
  - 成就系统
  - 难度递进

## 🚀 快速开始

1. 克隆仓库
\`\`\`bash
git clone https://github.com/AbasswithoutBass/notesview.git
cd notesview
\`\`\`

2. 安装依赖
\`\`\`bash
npm install
\`\`\`

3. 启动开发服务器
\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:5173 开始使用！

## 🌐 部署

### 部署到 Cloudflare Pages

快速部署到免费的 Cloudflare Pages 服务：

```bash
# 安装 Wrangler CLI（全局）
npm install -g @cloudflare/wrangler

# 登录 Cloudflare
wrangler login

# 部署（自动构建）
./deploy.sh
# 或手动执行
npm run build && wrangler pages deploy dist
```

也可以通过 GitHub 自动部署。详细步骤见 [DEPLOYMENT.md](./DEPLOYMENT.md) 和 [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

**部署优势：**
- ✅ 免费托管
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS
- ✅ 支持自定义域名
- ✅ 自动构建与部署（GitHub 集成）

## 🛠️ 技术栈

- **前端框架**: React 19 + Vite 7
- **状态管理**: React Hooks（useState, useEffect, useCallback）
- **音频引擎**: Tone.js 15 - 专业级音频合成
- **乐谱渲染**: VexFlow 5 - 高性能乐谱绘制
- **构建工具**: Vite - 快速的开发体验
- **代码规范**: ESLint + Prettier
- **类型检查**: PropTypes
- **测试框架**: 待添加

## 📦 项目结构

主要目录结构及其功能说明：

\`\`\`
src/
├── components/         # React 组件
│   ├── PianoKeyboard/    # 虚拟键盘相关组件
│   │   ├── PianoKey.jsx    # 单个琴键组件
│   │   └── index.jsx       # 键盘主组件
│   ├── Staff/           # 五线谱相关组件
│   │   ├── AnimatedStaff.jsx  # 带动画的五线谱
│   │   └── Staff.jsx         # 基础五线谱组件
│   ├── Practice/        # 练习模式组件
│   │   ├── PracticeMode.jsx   # 练习主界面
│   │   ├── ScoreBoard.jsx     # 计分板组件
│   │   └── Statistics.jsx     # 统计信息显示
│   └── common/          # 通用组件
│       ├── Timer.jsx        # 计时器组件
│       └── ProgressBar.jsx  # 进度条组件
├── hooks/              # 自定义 Hooks
│   ├── useAudio.jsx      # 音频处理逻辑
│   └── usePractice.jsx   # 练习模式逻辑（记忆曲线、自适应选题）
├── utils/             # 工具函数
│   ├── keymap.js        # 键盘映射
│   ├── noteUtils.js     # 音符处理工具
│   ├── storage.js       # 本地存储工具（高分、统计、记忆曲线）
│   └── memoryCurve.js   # 记忆曲线调度与复习计划
├── constants/         # 常量定义
│   ├── notes.js         # 音符相关常量
│   └── difficulty.js    # 难度等级配置
└── App.jsx            # 主应用组件
\`\`\`

## ⚡ 性能优化

- 🔄 使用 \`useCallback\` 优化事件处理器
- 🎵 音频资源懒加载与预加载
- 🖼️ SVG 乐谱渲染优化
- ⚡ React 严格模式下的性能保证
- 📱 移动端触摸事件优化

## 🌟 亮点特性

### 音频系统
- 使用 Tone.js 实现高品质音频合成
- 完整的 ADSR 包络控制
- 智能的音频上下文管理
- 处理浏览器自动播放策略（首次需点击“点击启动音频系统 🎵” 按钮）

### 乐谱渲染
- VexFlow 实现专业级五线谱绘制
- 音符放置自动优化
- 流畅的动画过渡效果
- SVG 矢量图形保证清晰度

### 练习系统
- 多维度的进度追踪
- 智能的评分与连击算法
- 记忆曲线驱动的复习提示
- 详细的统计分析面板
- 本地数据持久化（高分、练习统计、记忆数据）

### 记忆曲线
- 根据艾宾浩斯记忆规律设置 1 分钟→ 5 分钟→ 30 分钟→ 6 小时→ 24 小时复习间隔
- 练习结束后自动记录每个音符的正确/错误次数与阶段
- 中级及以上难度会优先抽取待复习或易错音进行巩固
- 统计页实时显示“待复习音符”和“易错音排行”

## 📋 开发计划

### 当前迭代（v1.1）- 练习模式优化
1. 🎯 完善练习流程
   - 优化用户体验
   - 添加练习指导
   - 增强反馈机制
   - 完善统计分析

2. 📊 增强统计系统
   - 练习数据可视化
   - 进度追踪优化
   - 练习报告生成
   - 数据导出功能

3. 🎮 游戏化升级
   - 成就系统完善
   - 解锁机制优化
   - 练习目标设定
   - 奖励机制设计

### 未来规划（v1.2+）

#### 1. 🎵 MIDI 支持
- MIDI 键盘输入支持
- MIDI 文件导入/导出
- 多设备同步功能

#### 2. 🌐 在线功能
- 用户账号系统
- 在线排行榜
- 自定义练习集分享
- 实时练习数据同步

#### 3. 🎨 UI/UX 升级
- 深色模式支持
- 自适应布局优化
- 触摸屏优化
- 动画效果增强

#### 4. 🎯 教学功能
- 课程体系设计
- 进度跟踪系统
- 练习建议生成
- 教师后台管理

#### 5. 🤖 AI 辅助
- 练习模式智能推荐
- 演奏风格分析
- 个性化练习计划
- 错误模式识别

完整的任务列表请查看 [Issues](https://github.com/AbasswithoutBass/notesview/issues)。

## 🆕 最新更新（2025-11）

- ✨ 新增记忆曲线模块 `src/utils/memoryCurve.js`，支持易错音多轮复习
- 🔁 `usePractice` 练习逻辑支持记忆驱动的题目出题与自适应评分
- 📈 统计面板展示累计数据、待复习音符与易错音排行
- 📦 `storage.js` 支持高分、统计与记忆三类持久化数据
- 🎯 中级及以上难度要求同时按下目标音才能判定正确

## 🗃️ 最近修改的核心文件

- `src/hooks/usePractice.jsx`
- `src/utils/memoryCurve.js`
- `src/utils/storage.js`
- `src/utils/noteUtils.js`
- `src/components/Practice/PracticeMode.jsx`
- `src/components/Practice/Statistics.jsx`

## 🤝 如何贡献

1. Fork 该项目
2. 创建您的特性分支 (\`git checkout -b feature/amazing-feature\`)
3. 提交您的改动 (\`git commit -m 'feat: add some amazing feature'\`)
4. 推送到分支 (\`git push origin feature/amazing-feature\`)
5. 创建一个 Pull Request

更多详情请参考 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 📄 许可证

本项目基于 MIT 许可证开源。

Copyright (c) 2025 NotesView Contributors

详情请见 [LICENSE](LICENSE) 文件。
// 练习难度等级定义
export const DIFFICULTY_LEVELS = {
  BEGINNER: {
    id: 'beginner',
    name: '单音练习',
    description: '识别单个音符',
    noteCount: 1,
    timeLimit: 12, // 12秒
    baseScore: 100,
    comboMultiplier: 1.1
  },
  INTERMEDIATE: {
    id: 'intermediate',
    name: '音程练习',
    description: '识别双音音程',
    noteCount: 2,
    timeLimit: 9, // 9秒
    baseScore: 150,
    comboMultiplier: 1.2
  },
  ADVANCED: {
    id: 'advanced',
    name: '三和弦练习',
    description: '识别三和弦',
    noteCount: 3,
    timeLimit: 7, // 7秒
    baseScore: 200,
    comboMultiplier: 1.3
  },
  MASTER: {
    id: 'master',
    name: '七和弦练习',
    description: '识别七和弦',
    noteCount: 4,
    timeLimit: 5, // 5秒
    baseScore: 300,
    comboMultiplier: 1.5
  }
};

// 成就等级
export const ACHIEVEMENT_LEVELS = {
  NOVICE: { name: '新手', icon: '🎵', minScore: 0 },
  APPRENTICE: { name: '学徒', icon: '🎹', minScore: 1000 },
  MUSICIAN: { name: '音乐家', icon: '🎼', minScore: 5000 },
  VIRTUOSO: { name: '大师', icon: '🎭', minScore: 10000 },
  MAESTRO: { name: '宗师', icon: '👑', minScore: 50000 }
};

// 评分等级
export const SCORE_GRADES = {
  S: { name: 'S', minScore: 950, icon: '🏆' },
  A: { name: 'A', minScore: 900, icon: '🥇' },
  B: { name: 'B', minScore: 800, icon: '🥈' },
  C: { name: 'C', minScore: 700, icon: '🥉' },
  D: { name: 'D', minScore: 600, icon: '📝' },
  F: { name: 'F', minScore: 0, icon: '📚' }
};
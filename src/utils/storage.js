// 本地存储键值
const STORAGE_KEYS = {
  HIGH_SCORES: 'notesview_high_scores',
  USER_STATS: 'notesview_user_stats',
  SETTINGS: 'notesview_settings',
  MEMORY: 'notesview_memory_curve'
};

const DEFAULT_USER_STATS = {
  totalGames: 0,
  totalScore: 0,
  correctNotes: 0,
  totalNotes: 0,
  averageTime: 0,
  highestCombo: 0
};

// 保存数据到本地存储
export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Storage save error:', error);
    return false;
  }
};

// 从本地存储读取数据
export const loadFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Storage load error:', error);
    return null;
  }
};

// 保存最高分
export const saveHighScore = (difficulty, score) => {
  const highScores = loadFromStorage(STORAGE_KEYS.HIGH_SCORES) || {};
  const currentHigh = highScores[difficulty] || 0;
  
  if (score > currentHigh) {
    highScores[difficulty] = score;
    saveToStorage(STORAGE_KEYS.HIGH_SCORES, highScores);
    return true;
  }
  return false;
};

export const getHighScores = () => loadFromStorage(STORAGE_KEYS.HIGH_SCORES) || {};

export const getUserStats = () => {
  const stored = loadFromStorage(STORAGE_KEYS.USER_STATS);
  return stored ? { ...DEFAULT_USER_STATS, ...stored } : { ...DEFAULT_USER_STATS };
};

// 更新用户统计数据
export const updateUserStats = (stats) => {
  const currentStats = getUserStats();
  const sessionNotes = stats.totalNotes || 0;
  const combinedTotalNotes = currentStats.totalNotes + sessionNotes;
  const sessionCorrect = stats.correctNotes || 0;
  const sessionScore = stats.totalScore || 0;
  const sessionAverageTime = stats.averageTime || 0;
  const accumulatedTime = currentStats.averageTime * currentStats.totalNotes + sessionAverageTime * sessionNotes;
  const newAverageTime = combinedTotalNotes > 0 ? accumulatedTime / combinedTotalNotes : 0;

  const newStats = {
    totalGames: currentStats.totalGames + 1,
    totalScore: currentStats.totalScore + sessionScore,
    correctNotes: currentStats.correctNotes + sessionCorrect,
    totalNotes: combinedTotalNotes,
    averageTime: newAverageTime,
    highestCombo: Math.max(currentStats.highestCombo, stats.maxCombo || stats.highestCombo || 0)
  };

  saveToStorage(STORAGE_KEYS.USER_STATS, newStats);
  return newStats;
};

export const loadMemoryData = () => loadFromStorage(STORAGE_KEYS.MEMORY) || {};

export const saveMemoryData = (memory) => saveToStorage(STORAGE_KEYS.MEMORY, memory);

export const clearStatsData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.HIGH_SCORES);
    localStorage.removeItem(STORAGE_KEYS.USER_STATS);
    localStorage.removeItem(STORAGE_KEYS.MEMORY);
    return true;
  } catch (error) {
    console.error('Failed to clear stats data:', error);
    return false;
  }
};

export { STORAGE_KEYS, DEFAULT_USER_STATS };
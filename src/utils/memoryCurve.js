import { loadMemoryData, saveMemoryData } from './storage';

const REVIEW_INTERVALS = [60000, 300000, 1800000, 21600000, 86400000]; // 1min, 5min, 30min, 6h, 24h

const parseNotes = (notes) => {
  if (!Array.isArray(notes)) return [];
  return [...new Set(notes.filter(Boolean))];
};

// 生成带谱号的内存键，格式：note@clef（如 C4@treble）
const getMemoryKey = (note, clef = null) => {
  if (!clef || clef === 'all') {
    return note;
  }
  return `${note}@${clef}`;
};

// 从内存键提取音符和谱号
const parseMemoryKey = (key) => {
  const parts = key.split('@');
  return {
    note: parts[0],
    clef: parts[1] || null
  };
};

export const recordMemoryResult = (notes, isCorrect, clef = null) => {
  const memory = loadMemoryData();
  const uniqueNotes = parseNotes(notes);
  if (uniqueNotes.length === 0) return memory;

  const now = Date.now();

  uniqueNotes.forEach(note => {
    // 使用带谱号的键
    const key = getMemoryKey(note, clef);
    const entry = memory[key] || {
      correct: 0,
      wrong: 0,
      stage: 0,
      nextDue: now,
      lastReviewed: 0,
      note,     // 保存原始音符
      clef      // 保存谱号
    };

    if (isCorrect) {
      entry.correct += 1;
      entry.stage = Math.min(entry.stage + 1, REVIEW_INTERVALS.length - 1);
      entry.nextDue = now + REVIEW_INTERVALS[entry.stage];
    } else {
      entry.wrong += 1;
      entry.stage = 0;
      entry.nextDue = now + REVIEW_INTERVALS[0];
    }

    entry.lastReviewed = now;
    memory[key] = entry;
  });

  saveMemoryData(memory);
  return memory;
};

export const getDueNotes = (limit = 3, memoryMap, clef = null) => {
  const memory = memoryMap || loadMemoryData();
  const now = Date.now();
  const entries = Object.entries(memory);
  if (entries.length === 0) return [];

  // 过滤：只获取指定谱号的数据
  const filteredEntries = clef
    ? entries.filter(([key]) => {
        const { clef: entryClef } = parseMemoryKey(key);
        return entryClef === clef || entryClef === null; // null 表示旧数据，保持兼容
      })
    : entries;

  const dueEntries = filteredEntries
    .filter(([, data]) => !data.nextDue || data.nextDue <= now)
    .sort((a, b) => {
      const aTime = a[1].nextDue || 0;
      const bTime = b[1].nextDue || 0;
      if (aTime === bTime) {
        return (b[1].wrong || 0) - (a[1].wrong || 0);
      }
      return aTime - bTime;
    });

  if (dueEntries.length === 0) {
    // fallback: choose notes with highest wrong count
    const challenging = filteredEntries
      .filter(([, data]) => data.wrong > 0)
      .sort((a, b) => (b[1].wrong || 0) - (a[1].wrong || 0));
    return challenging.slice(0, limit).map(([key]) => {
      const { note } = parseMemoryKey(key);
      return note;
    });
  }

  return dueEntries.slice(0, limit).map(([key]) => {
    const { note } = parseMemoryKey(key);
    return note;
  });
};

export const getMemorySummary = (memoryMap, clef = null) => {
  const memory = memoryMap || loadMemoryData();
  const entries = Object.entries(memory);
  if (entries.length === 0) {
    return {
      due: [],
      challenging: []
    };
  }

  // 过滤：只获取指定谱号的数据
  const filteredEntries = clef
    ? entries.filter(([key]) => {
        const { clef: entryClef } = parseMemoryKey(key);
        return entryClef === clef || entryClef === null; // null 表示旧数据
      })
    : entries;

  const now = Date.now();

  const due = filteredEntries
    .filter(([, data]) => !data.nextDue || data.nextDue <= now)
    .sort((a, b) => {
      const aTime = a[1].nextDue || 0;
      const bTime = b[1].nextDue || 0;
      if (aTime === bTime) {
        return (b[1].wrong || 0) - (a[1].wrong || 0);
      }
      return aTime - bTime;
    })
    .map(([key, data]) => ({
      note: data.note || parseMemoryKey(key).note,
      nextDue: data.nextDue,
      stage: data.stage,
      correct: data.correct || 0,
      wrong: data.wrong || 0,
      clef: data.clef
    }));

  const challenging = filteredEntries
    .filter(([, data]) => (data.wrong || 0) > 0)
    .map(([key, data]) => {
      const total = (data.correct || 0) + (data.wrong || 0);
      const successRate = total > 0 ? (data.correct || 0) / total : 0;
      return {
        note: data.note || parseMemoryKey(key).note,
        correct: data.correct || 0,
        wrong: data.wrong || 0,
        successRate,
        nextDue: data.nextDue,
        stage: data.stage,
        clef: data.clef
      };
    })
    .sort((a, b) => {
      const aRate = a.successRate;
      const bRate = b.successRate;
      if (aRate === bRate) {
        return b.wrong - a.wrong;
      }
      return aRate - bRate;
    });

  return {
    due,
    challenging
  };
};

export const clearMemoryData = () => saveMemoryData({});

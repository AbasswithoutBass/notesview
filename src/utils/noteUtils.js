import {
  ALL_NOTES,
  INTERVALS,
  CHORDS,
  ENHARMONIC_FLATS,
  ENHARMONIC_SHARPS,
} from '../constants/notes';
import { DIFFICULTY_LEVELS, SCORE_GRADES } from '../constants/difficulty';

const parseNote = note => {
  if (typeof note !== 'string') return null;

  // 解析格式：[A-G][#/b/无]数字
  const match = note.trim().match(/^([A-Ga-g](?:#|b)?)(\d)$/);
  if (!match) return null;

  let pitch = match[1].toLowerCase();
  const octave = parseInt(match[2], 10);

  // 标准化音符格式（统一大小写：C, C#, Db 格式）
  if (pitch.length === 2) {
    pitch = pitch[0].toUpperCase() + pitch[1]; // C# or Db
  } else {
    pitch = pitch.toUpperCase(); // C
  }

  return { pitch, octave };
};

const formatNote = (pitch, octave) => `${pitch}${octave}`;

const canonicalizeNote = note => {
  const parsed = parseNote(note);
  return parsed ? formatNote(parsed.pitch, parsed.octave) : null;
};

const sanitizeAllowedNotes = (allowedNotes = []) => {
  if (!allowedNotes || !Array.isArray(allowedNotes)) {
    return [];
  }
  const canonical = allowedNotes.map(canonicalizeNote).filter(Boolean);
  return [...new Set(canonical)];
};

const sanitizeFocus = (focusNotes = [], allowedSet) => {
  const canonical = focusNotes.map(canonicalizeNote).filter(Boolean);
  const unique = [...new Set(canonical)];
  if (!allowedSet) return unique;
  return unique.filter(note => allowedSet.has(note));
};

const getOctave = (range = { min: 4, max: 4 }) => {
  const min = Number.isFinite(range.min) ? Math.floor(range.min) : 4;
  const max = Number.isFinite(range.max) ? Math.floor(range.max) : min;
  const span = Math.max(0, max - min);
  return min + Math.floor(Math.random() * (span + 1));
};

const pickRandomBase = (octaveRange, allowedNotes) => {
  if (Array.isArray(allowedNotes) && allowedNotes.length) {
    const selected = allowedNotes[Math.floor(Math.random() * allowedNotes.length)];
    const parsed = parseNote(selected);
    if (parsed) {
      return { pitch: parsed.pitch, octave: parsed.octave };
    }
  }
  const pitch = ALL_NOTES[Math.floor(Math.random() * ALL_NOTES.length)];
  const octave = getOctave(octaveRange);
  return { pitch, octave };
};

const pickFocusBase = (focus, allowedSet) => {
  const shuffled = [...focus];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  for (const note of shuffled) {
    const parsed = parseNote(note);
    if (parsed && ALL_NOTES.includes(parsed.pitch)) {
      const canonical = formatNote(parsed.pitch, parsed.octave);
      if (allowedSet && !allowedSet.has(canonical)) {
        continue;
      }
      return { pitch: parsed.pitch, octave: parsed.octave };
    }
  }
  return null;
};

const computeNoteFromInterval = (baseIndex, baseOctave, interval) => {
  const totalSteps = baseIndex + interval;
  const noteIndex = ((totalSteps % ALL_NOTES.length) + ALL_NOTES.length) % ALL_NOTES.length;
  const octaveShift = Math.floor(totalSteps / ALL_NOTES.length);
  const pitch = ALL_NOTES[noteIndex];
  return { pitch, octave: baseOctave + octaveShift };
};

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const pickAllowedCombination = (allowedNotes, count, fallbackNote) => {
  if (!Array.isArray(allowedNotes) || allowedNotes.length === 0) {
    return fallbackNote ? [fallbackNote] : [];
  }

  const uniquePool = [...new Set(allowedNotes)];
  let pool = shuffleArray([...uniquePool]);

  if (fallbackNote) {
    if (!pool.includes(fallbackNote)) {
      pool = [fallbackNote, ...pool];
    } else {
      pool = [fallbackNote, ...pool.filter(note => note !== fallbackNote)];
    }
  }

  if (pool.length >= count) {
    return pool.slice(0, count);
  }

  const result = [];
  for (let i = 0; i < count; i += 1) {
    result.push(pool[i % pool.length]);
  }
  return result;
};

const ensureAllowedCombination = (
  candidateNotes,
  allowedSet,
  allowedNotes,
  desiredCount,
  fallbackNote
) => {
  if (!allowedSet) {
    return candidateNotes;
  }

  const canonical = candidateNotes.map(canonicalizeNote).filter(Boolean);

  if (canonical.length === candidateNotes.length && canonical.every(note => allowedSet.has(note))) {
    return canonical.slice(0, desiredCount);
  }

  return pickAllowedCombination(allowedNotes, desiredCount, fallbackNote);
};

// 随机生成指定难度的音符组合，支持聚焦易错音
// 随机将升号转换为对应的降号（70% 概率）
// 生成音符显示形式 - 为每个音符选择合适的表示方式（升号/降号/自然音）
const generateNoteDisplay = note => {
  const parsed = parseNote(note);
  if (!parsed) return note;

  const { pitch, octave } = parsed;

  // 根据音符的索引找到其在 ALL_NOTES 中的位置
  const pitchForIndex = ENHARMONIC_SHARPS[pitch] || pitch;
  const noteIndex = ALL_NOTES.indexOf(pitchForIndex);

  if (noteIndex === -1) return note;

  // 该位置的音符可能有多种表示方式
  const noteAtIndex = ALL_NOTES[noteIndex];
  const enharmonicFlat = ENHARMONIC_FLATS[noteAtIndex];

  // 50% 概率选择升号或降号，自然音则保持不变
  if (enharmonicFlat && Math.random() < 0.5) {
    // 选择降号
    return enharmonicFlat + octave;
  } else {
    // 选择升号或自然音
    return noteAtIndex + octave;
  }
};

export const generateNotes = (difficulty, options = {}) => {
  const level = DIFFICULTY_LEVELS[difficulty];
  const allowedNotes = sanitizeAllowedNotes(options.allowedNotes);
  const allowedSet = allowedNotes.length ? new Set(allowedNotes) : null;
  const focus = sanitizeFocus(options.focusNotes, allowedSet);
  const focusProbability = Number.isFinite(options.focusProbability)
    ? options.focusProbability
    : 0.7;
  const octaveRange = options.octaveRange || { min: 4, max: 4 };

  let base = null;
  if (focus.length && Math.random() < focusProbability) {
    base = pickFocusBase(focus, allowedSet);
  }
  if (!base) {
    base = pickRandomBase(octaveRange, allowedNotes);
  }
  if (!base) {
    base = { pitch: 'C', octave: 4 };
  }

  let baseNoteString = formatNote(base.pitch, base.octave);
  if (allowedSet && !allowedSet.has(baseNoteString)) {
    const fallback = pickAllowedCombination(allowedNotes, 1, baseNoteString)[0];
    const parsedFallback = parseNote(fallback);
    if (parsedFallback) {
      base = { pitch: parsedFallback.pitch, octave: parsedFallback.octave };
      baseNoteString = fallback;
    }
  }

  const baseIndex = Math.max(0, ALL_NOTES.indexOf(base.pitch));
  const desiredCount = level?.noteCount || 1;
  const ensure = candidates =>
    ensureAllowedCombination(candidates, allowedSet, allowedNotes, desiredCount, baseNoteString);

  switch (difficulty) {
    case 'BEGINNER':
      return ensure([baseNoteString]).map(generateNoteDisplay);

    case 'INTERMEDIATE': {
      const intervals = Object.values(INTERVALS);
      const interval = intervals[Math.floor(Math.random() * intervals.length)];
      const second = computeNoteFromInterval(baseIndex, base.octave, interval);
      return ensure([baseNoteString, formatNote(second.pitch, second.octave)]).map(
        generateNoteDisplay
      );
    }

    case 'ADVANCED': {
      const triads = [
        CHORDS.MAJOR_TRIAD,
        CHORDS.MINOR_TRIAD,
        CHORDS.DIMINISHED_TRIAD,
        CHORDS.AUGMENTED_TRIAD,
      ];
      const triad = triads[Math.floor(Math.random() * triads.length)];
      const chordNotes = triad.map(interval => {
        const note = computeNoteFromInterval(baseIndex, base.octave, interval);
        return formatNote(note.pitch, note.octave);
      });
      return ensure(chordNotes).map(generateNoteDisplay);
    }

    case 'MASTER': {
      const seventhChords = [
        CHORDS.MAJOR_SEVENTH,
        CHORDS.MINOR_SEVENTH,
        CHORDS.DOMINANT_SEVENTH,
        CHORDS.HALF_DIMINISHED,
        CHORDS.DIMINISHED_SEVENTH,
      ];
      const chord = seventhChords[Math.floor(Math.random() * seventhChords.length)];
      const chordNotes = chord.map(interval => {
        const note = computeNoteFromInterval(baseIndex, base.octave, interval);
        return formatNote(note.pitch, note.octave);
      });
      return ensure(chordNotes).map(generateNoteDisplay);
    }

    default:
      return ensure([baseNoteString]).map(generateNoteDisplay);
  }
};

// 计算分数
export const calculateScore = (timeSpent, maxTime, isCorrect, combo, baseScore) => {
  if (!isCorrect) return 0;

  const effectiveBase = baseScore ?? 0;
  const speedRatio = Math.max(0, (maxTime - timeSpent) / maxTime); // 0~1，越快越接近1
  const speedBonus = Math.round(effectiveBase * speedRatio);
  const comboBoost = 1 + Math.min(combo * 0.05, 0.5); // 每次连击+5%，封顶50%

  return Math.round((effectiveBase + speedBonus) * comboBoost);
};

// 获取成绩等级
export const getScoreGrade = score => {
  for (const [grade, config] of Object.entries(SCORE_GRADES)) {
    if (score >= config.minScore) {
      return { grade, ...config };
    }
  }
  return SCORE_GRADES.F;
};

// 提取音符名称（不含八度）
const stripOctave = note => {
  const parsed = parseNote(note);
  if (parsed) {
    return parsed.pitch; // 返回标准化的音符 (C, C#, Db 等)
  }
  return note.replace(/\d+/g, '').trim();
};

// 获取音符的等音体（升号和降号的对应关系）
const getEnharmonicEquivalent = noteName => {
  // 移除大小写和数字，只保留音符部分
  const noteWithoutOctave = noteName.replace(/\d+/g, '').trim();

  // 统一格式：第一个字母大写，其他小写
  const normalized =
    noteWithoutOctave[0].toUpperCase() + (noteWithoutOctave[1] || '').toLowerCase();

  // 建立等音体映射（使用 Db 而非 DB 格式）
  const map = {
    'C#': 'Db',
    Db: 'C#',
    'D#': 'Eb',
    Eb: 'D#',
    'F#': 'Gb',
    Gb: 'F#',
    'G#': 'Ab',
    Ab: 'G#',
    'A#': 'Bb',
    Bb: 'A#',
  };

  return map[normalized] || null;
};

// 检查音符是否正确
export const checkNotes = (expected, actual, options = {}) => {
  if (!Array.isArray(expected) || !Array.isArray(actual)) return false;
  if (expected.length !== actual.length) return false;

  const { ignoreOctave = false } = options;

  if (ignoreOctave) {
    // 构建计数地图：音符名称 -> 数量
    const buildCountMap = notes =>
      notes.reduce((acc, note) => {
        const key = stripOctave(note);
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

    const expectedCounts = buildCountMap(expected);
    const actualCounts = buildCountMap(actual);

    const expectedKeys = Object.keys(expectedCounts);
    if (expectedKeys.length !== Object.keys(actualCounts).length) return false;

    // 检查每个音符是否匹配，考虑等音体关系
    return expectedKeys.every(expectedKey => {
      // 在实际值中查找匹配的音符
      const actualKey = Object.keys(actualCounts).find(k => {
        // 完全匹配或等音体匹配
        return k === expectedKey || getEnharmonicEquivalent(k) === expectedKey;
      });

      return actualKey && expectedCounts[expectedKey] === actualCounts[actualKey];
    });
  }

  // 带八度的精确比较
  const compareNotes = (expectedNote, actualNote) => {
    const expParsed = parseNote(expectedNote);
    const actParsed = parseNote(actualNote);

    if (!expParsed || !actParsed) return false;
    if (expParsed.octave !== actParsed.octave) return false;

    // 比较音符名称（支持等音体）
    return (
      expParsed.pitch === actParsed.pitch ||
      getEnharmonicEquivalent(expParsed.pitch) === actParsed.pitch
    );
  };

  return expected.every((exp, index) => compareNotes(exp, actual[index]));
};

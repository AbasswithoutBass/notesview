// 🎹 键盘映射配置 v2
// 功能增强：
// 1. 支持八度切换（Z/X键）
// 2. 支持升降号（Shift）
// 3. 支持多种键盘布局
// 4. 提供按键提示

// 基础音符映射（Logic Pro 风格）
export const KEYBOARD_LAYOUTS = {
  LOGIC_PRO: {
    name: 'Logic Pro 风格',
    map: {
      a: 'C',
      w: 'C#',
      s: 'D',
      e: 'D#',
      d: 'E',
      f: 'F',
      t: 'F#',
      g: 'G',
      y: 'G#',
      h: 'A',
      u: 'A#',
      j: 'B',
    },
  },
  NUMBER: {
    name: '数字键',
    map: {
      1: 'C',
      2: 'D',
      3: 'E',
      4: 'F',
      5: 'G',
      6: 'A',
      7: 'B',
    },
  },
};

// 功能键定义
export const FUNCTION_KEYS = {
  OCTAVE_UP: 'x',
  OCTAVE_DOWN: 'z',
  SHARP: 'Shift',
  FLAT: 'Alt',
};

// 音符范围限制
const OCTAVE_RANGE = {
  MIN: 2,
  MAX: 6,
};

/**
 * 将键盘按键映射为音符
 * @param {string} key - 按下的键
 * @param {number} currentOctave - 当前八度
 * @param {Object} options - 配置选项
 * @returns {Object} 返回音符信息
 */
export function mapKeyToNote(key, currentOctave = 4, options = {}) {
  const { layout = KEYBOARD_LAYOUTS.LOGIC_PRO, isShift = false, isAlt = false } = options;

  // 处理八度变化
  if (key === FUNCTION_KEYS.OCTAVE_UP) {
    const newOctave = Math.min(currentOctave + 1, OCTAVE_RANGE.MAX);
    return { type: 'octave', octave: newOctave };
  }

  if (key === FUNCTION_KEYS.OCTAVE_DOWN) {
    const newOctave = Math.max(currentOctave - 1, OCTAVE_RANGE.MIN);
    return { type: 'octave', octave: newOctave };
  }

  // 获取基础音符
  const baseNote = layout.map[key.toLowerCase()];
  if (!baseNote) {
    return null;
  }

  // 处理升降号
  let modifiedNote = baseNote;
  if (isShift && !baseNote.includes('#')) {
    modifiedNote = baseNote + '#';
  } else if (isAlt && !baseNote.includes('b')) {
    // 如果是降号，需要处理降号与升号的转换
    const flatNotes = {
      'C#': 'Db',
      'D#': 'Eb',
      'F#': 'Gb',
      'G#': 'Ab',
      'A#': 'Bb',
    };
    modifiedNote = flatNotes[modifiedNote] || baseNote + 'b';
  }

  return {
    type: 'note',
    note: `${modifiedNote}${currentOctave}`,
    baseNote: modifiedNote,
    octave: currentOctave,
  };
}

/**
 * 获取按键提示信息
 * @param {string} layout - 键盘布局名称
 * @returns {Object} 按键提示信息
 */
export function getKeyboardHints(layout = KEYBOARD_LAYOUTS.LOGIC_PRO) {
  return {
    notes: Object.entries(layout.map).map(([key, note]) => ({
      key: key.toUpperCase(),
      note,
    })),
    functions: {
      octaveUp: FUNCTION_KEYS.OCTAVE_UP.toUpperCase(),
      octaveDown: FUNCTION_KEYS.OCTAVE_DOWN.toUpperCase(),
      sharp: FUNCTION_KEYS.SHARP,
      flat: FUNCTION_KEYS.FLAT,
    },
  };
}

/**
 * 检查音符是否在有效范围内
 * @param {string} note - 音符
 * @returns {boolean} 是否有效
 */
export function isValidNote(note) {
  if (!note || typeof note !== 'string') return false;

  const match = note.match(/^([A-G][#b]?)(\d)$/);
  if (!match) return false;

  const octave = parseInt(match[2]);
  return octave >= OCTAVE_RANGE.MIN && octave <= OCTAVE_RANGE.MAX;
}

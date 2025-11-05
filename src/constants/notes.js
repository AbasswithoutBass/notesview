// 音符相关常量定义
export const NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
export const ACCIDENTALS = ['#', 'b'];

// 完整音符列表（包含升降号）- 按绝对音高顺序排列
// 索引 0-11 代表一个八度内的 12 个半音
export const ALL_NOTES = [
  'C',      // 0
  'C#',     // 1 (或 Db)
  'D',      // 2
  'D#',     // 3 (或 Eb)
  'E',      // 4
  'F',      // 5
  'F#',     // 6 (或 Gb)
  'G',      // 7
  'G#',     // 8 (或 Ab)
  'A',      // 9
  'A#',     // 10 (或 Bb)
  'B'       // 11
];

// 色度音阶 - 每个半音的三种表示形式 [natural, sharp, flat]
// 其中 natural 是该位置的自然音（如果存在），sharp 是升号，flat 是降号
export const CHROMATIC_SCALE = [
  { index: 0, natural: 'C', sharp: null, flat: 'B#' },      // C
  { index: 1, natural: null, sharp: 'C#', flat: 'Db' },     // C#/Db
  { index: 2, natural: 'D', sharp: null, flat: 'E♭' },      // D
  { index: 3, natural: null, sharp: 'D#', flat: 'Eb' },     // D#/Eb
  { index: 4, natural: 'E', sharp: 'F♭', flat: null },      // E
  { index: 5, natural: 'F', sharp: null, flat: 'E#' },      // F
  { index: 6, natural: null, sharp: 'F#', flat: 'Gb' },     // F#/Gb
  { index: 7, natural: 'G', sharp: null, flat: 'A♭' },      // G
  { index: 8, natural: null, sharp: 'G#', flat: 'Ab' },     // G#/Ab
  { index: 9, natural: 'A', sharp: null, flat: 'B♭' },      // A
  { index: 10, natural: null, sharp: 'A#', flat: 'Bb' },    // A#/Bb
  { index: 11, natural: 'B', sharp: null, flat: 'C♭' }      // B
];

// 等音体映射 - 用于识别同音异名
export const ENHARMONIC_FLATS = {
  'C#': 'Db',
  'D#': 'Eb',
  'F#': 'Gb',
  'G#': 'Ab',
  'A#': 'Bb'
};

export const ENHARMONIC_SHARPS = {
  'Db': 'C#',
  'Eb': 'D#',
  'Gb': 'F#',
  'Ab': 'G#',
  'Bb': 'A#'
};

// 谱号中文名称映射
export const CLEF_NAMES = {
  'treble': '高音谱号',
  'bass': '低音谱号',
  'alto': '中音谱号',
  'tenor': '次中音谱号'
};

// 常用音程
export const INTERVALS = {
  MINOR_SECOND: 1,
  MAJOR_SECOND: 2,
  MINOR_THIRD: 3,
  MAJOR_THIRD: 4,
  PERFECT_FOURTH: 5,
  TRITONE: 6,
  PERFECT_FIFTH: 7,
  MINOR_SIXTH: 8,
  MAJOR_SIXTH: 9,
  MINOR_SEVENTH: 10,
  MAJOR_SEVENTH: 11,
  OCTAVE: 12
};

// 常用和弦
export const CHORDS = {
  // 三和弦
  MAJOR_TRIAD: [0, 4, 7],         // 大三和弦
  MINOR_TRIAD: [0, 3, 7],         // 小三和弦
  DIMINISHED_TRIAD: [0, 3, 6],    // 减三和弦
  AUGMENTED_TRIAD: [0, 4, 8],     // 增三和弦

  // 七和弦
  MAJOR_SEVENTH: [0, 4, 7, 11],   // 大七和弦
  MINOR_SEVENTH: [0, 3, 7, 10],   // 小七和弦
  DOMINANT_SEVENTH: [0, 4, 7, 10], // 属七和弦
  HALF_DIMINISHED: [0, 3, 6, 10], // 半减七和弦
  DIMINISHED_SEVENTH: [0, 3, 6, 9] // 减七和弦
};
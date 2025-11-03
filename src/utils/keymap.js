// 🎹 keymap.js —— 定义电脑键盘与音符之间的映射关系
// 逻辑说明：
// 1. “Logic Pro 风格字母键”表示 C-B（含半音）
// 2. “数字键模式”表示 1–7 对应 C-B（不含半音）
// 3. 可配合 Z/X 实现八度切换，Shift/Alt 实现升降号

export const logicProKeyMap = {
  a: "C",
  w: "C#",
  s: "D",
  e: "D#",
  d: "E",
  f: "F",
  t: "F#",
  g: "G",
  y: "G#",
  h: "A",
  u: "A#",
  j: "B",
};

// 数字键映射（以 C 大调为例）
export const numberKeyMap = {
  1: "C",
  2: "D",
  3: "E",
  4: "F",
  5: "G",
  6: "A",
  7: "B",
};

// 根据八度与升降号组合生成最终音名
export function mapKeyToNote(key, octave = 4, isSharp = false) {
  const letterNote = logicProKeyMap[key];
  const numberNote = numberKeyMap[key];
  let base = letterNote || numberNote;
  if (!base) return null;
  if (isSharp && !base.includes("#")) base += "#";
  return `${base}${octave}`; // 例如 C4、F#3
}

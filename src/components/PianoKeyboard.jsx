// 🎹 PianoKeyboard.jsx —— 虚拟钢琴键盘组件
// 功能：
// 1. 显示简单的白键与黑键
// 2. 点击键盘可播放音符
// 3. 高亮当前按下的键（未来版本会与游戏模式联动）

import React from "react";

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS = ["C#", "D#", "F#", "G#", "A#"];

export default function PianoKeyboard({ onPlayNote }) {
  const play = (note) => {
    if (onPlayNote) onPlayNote(note);
  };

  return (
    <div className="relative flex justify-center mt-6">
      {/* 白键 */}
      {WHITE_KEYS.map((note, idx) => (
        <div
          key={note}
          onClick={() => play(note + "4")}
          className="w-12 h-40 bg-white border border-gray-400 cursor-pointer active:bg-yellow-200"
          style={{ zIndex: 1 }}
        />
      ))}

      {/* 黑键（相对定位覆盖） */}
      <div className="absolute top-0 left-6 flex space-x-8">
        {BLACK_KEYS.map((note) => (
          <div
            key={note}
            onClick={() => play(note + "4")}
            className="w-8 h-24 bg-black cursor-pointer active:bg-gray-700"
          />
        ))}
      </div>
    </div>
  );
}

// src/App.jsx
// ============================
// 功能：识谱 + 钢琴键练习主界面
// ============================

import { useAudio } from "./hooks/useAudio.jsx";// 自定义音频 Hook
import React, { useState, useEffect } from "react";
import { mapKeyToNote } from "./utils/keymap"; // 键盘按键映射
import Staff from "./components/Staff"; // 五线谱组件
import PianoKeyboard from "./components/PianoKeyboard"; // 虚拟钢琴组件

function App() {
  const { init, playNote } = useAudio();

  const [note, setNote] = useState("C4"); // 当前音符
  const [octave, setOctave] = useState(4); // 音区
  const [isReady, setIsReady] = useState(false); // 是否已启动音频系统

  // ======================
  // 初始化音频（点击按钮触发）
  // ======================
  const handleInit = async () => {
    await init(); // 调用 useAudio.js 的 init()
    setIsReady(true); // 标记音频系统已启动
  };

  // ======================
  // 键盘输入监听
  // ======================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isReady) return; // 未启动音频时不响应
      const mapped = mapKeyToNote(e.key.toLowerCase(), octave);
      if (mapped) {
        setNote(mapped);
        playNote(mapped);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [octave, isReady]);

  // ======================
  // 点击虚拟键盘播放
  // ======================
  const handlePlay = (clickedNote) => {
    if (!isReady) return;
    const fullNote = clickedNote || "C4";
    setNote(fullNote);
    playNote(fullNote);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-50">
      {/* 页面标题 */}
      <h1 className="text-3xl font-bold mb-4">🎶 Piano Reading Trainer</h1>

      {/* 音频初始化按钮（只显示一次） */}
      {!isReady ? (
        <button
          onClick={handleInit}
          className="mb-4 px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all"
        >
          点击启动音频 🎧
        </button>
      ) : (
        <>
          {/* 五线谱组件 */}
          <Staff note={note} clef="treble" />

          {/* 虚拟钢琴组件 */}
          <PianoKeyboard onPlayNote={handlePlay} />

          {/* 底部提示 */}
          <p className="mt-4 text-gray-600 text-sm">
            提示：按下键盘（A、S、D、F...）或点击琴键即可发声。
          </p>
        </>
      )}
    </div>
  );
}

export default App;

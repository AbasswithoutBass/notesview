// src/hooks/useAudio.jsx
// ============================
// 功能：提供音频初始化与播放功能（使用 Tone.js）
// 说明：新版浏览器要求必须在用户交互后才能启动音频上下文
// 因此此 hook 的 init() 方法需要在用户点击后调用
// ============================

import * as Tone from 'tone';
import { useRef } from 'react';

export const useAudio = () => {
  // 用 useRef 保存 Tone.js 的合成器实例，防止重复创建
  const synth = useRef(null);

  // 初始化 Tone.js 音频系统（需用户点击触发）
  const init = async () => {
    try {
      // 手动启动 AudioContext（浏览器要求必须用户交互触发）
      await Tone.start();
      // 如果合成器尚未创建，则初始化
      if (!synth.current) {
        synth.current = new Tone.Synth().toDestination();
      }
      return true;
    } catch (err) {
      return false;
    }
  };

  // 播放单个音符
  const playNote = note => {
    if (synth.current) {
      synth.current.triggerAttackRelease(note, '8n'); // 播放一个八分音符时长
      return true;
    }
    return false;
  };

  return { init, playNote };
};

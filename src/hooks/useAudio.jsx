// src/hooks/useAudio.jsx
// ============================
// 功能：提供音频初始化与播放功能（使用 Tone.js）
// 说明：新版浏览器要求必须在用户交互后才能启动音频上下文
// 因此此 hook 的 init() 方法需要在用户点击后调用
// ============================

import * as Tone from 'tone';
import { useRef, useCallback, useEffect } from 'react';

export const useAudio = () => {
  const synth = useRef(null);
  const lastPlayTime = useRef(0);
  const audioContext = useRef(null);

  // 组件卸载时清理资源
  useEffect(() => {
    return () => {
      if (synth.current) {
        synth.current.dispose();
        synth.current = null;
      }
      // 注意：不关闭 audioContext，因为它是全局资源
      // 在应用的整个生命周期内需要保持活跃
    };
  }, []);

  // 初始化 Tone.js 音频系统
  const audioInit = async () => {
    try {
      // 检查浏览器支持
      if (!window.AudioContext && !window.webkitAudioContext) {
        throw new Error('Browser does not support Web Audio API');
      }

      if (!audioContext.current) {
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      }

      // 检查音频上下文状态，如果是暂停状态就恢复
      if (audioContext.current.state === 'suspended') {
        await audioContext.current.resume();
      }

      // 检查 Tone 的状态，如果未启动则启动
      if (Tone.context.state === 'suspended') {
        await Tone.context.resume();
      }

      // 启动 Tone.js（需要用户交互）
      if (Tone.context.state !== 'running') {
        await Tone.start();
      }

      // 创建或重用合成器
      if (!synth.current) {
        synth.current = new Tone.Synth({
          oscillator: {
            type: 'triangle',
          },
          envelope: {
            attack: 0.005,
            decay: 0.1,
            sustain: 0.3,
            release: 1,
          },
        }).toDestination();

        // 预加载并编译音频处理工作负载
        await Tone.loaded();
      }

      // 尝试播放一个静音的测试音符以确保一切正常
      await synth.current.triggerAttackRelease('C4', '32n', undefined, 0);

      return true;
    } catch (err) {
      console.error('Audio initialization failed:', err);
      throw err; // 让调用者处理错误
    }
  };

  // 播放单个音符
  const playNote = useCallback((note, velocity = 1) => {
    if (!synth.current) return false;

    const now = Tone.now();
    // 确保与上一次播放间隔至少 0.1 秒
    const playTime = Math.max(now, lastPlayTime.current + 0.1);
    const gain = Math.min(Math.max(velocity, 0.05), 1);

    try {
      synth.current.triggerAttackRelease(note, '8n', playTime, gain);
      lastPlayTime.current = playTime;
      return true;
    } catch (err) {
      console.error('Note playback failed:', err);
      return false;
    }
  }, []);

  // 播放和弦
  const playChord = useCallback((notes, duration = '4n', velocity = 1) => {
    if (!synth.current) return false;

    const now = Tone.now();
    const playTime = Math.max(now, lastPlayTime.current + 0.1);
    const gain = Math.min(Math.max(velocity, 0.05), 1);

    try {
      notes.forEach((note, index) => {
        // 稍微错开每个音符的播放时间，创造琶音效果
        synth.current.triggerAttackRelease(note, duration, playTime + index * 0.05, gain);
      });
      lastPlayTime.current = playTime + (notes.length - 1) * 0.05;
      return true;
    } catch (err) {
      console.error('Chord playback failed:', err);
      return false;
    }
  }, []);

  return { audioInit, playNote, playChord };
};

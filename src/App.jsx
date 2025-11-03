// src/App.jsx
// ============================
// 功能：识谱 + 钢琴键练习主界面
// ============================

import { useAudio } from './hooks/useAudio.jsx'; // 自定义音频 Hook
import { useState, useEffect } from 'react';
import { mapKeyToNote, KEYBOARD_LAYOUTS } from './utils/keymap'; // 键盘按键映射
import AnimatedStaff from './components/AnimatedStaff'; // 带动画的五线谱组件
import PianoKeyboard from './components/PianoKeyboard'; // 虚拟钢琴组件
import KeyboardHints from './components/KeyboardHints'; // 键盘提示组件

function App() {
  const { init, playNote } = useAudio();

  const [note, setNote] = useState('C4'); // 当前音符
  const [octave, setOctave] = useState(4); // 音区
  const [isReady, setIsReady] = useState(false); // 是否已启动音频系统
  const [layout, setLayout] = useState(KEYBOARD_LAYOUTS.LOGIC_PRO); // 键盘布局

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
    const handleKeyDown = e => {
      if (!isReady) return; // 未启动音频时不响应
      
      const result = mapKeyToNote(e.key, octave, {
        layout,
        isShift: e.shiftKey,
        isAlt: e.altKey
      });

      if (!result) return;

      if (result.type === 'octave') {
        setOctave(result.octave);
      } else if (result.type === 'note') {
        setNote(result.note);
        playNote(result.note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [octave, isReady, layout]);

  // ======================
  // 点击虚拟键盘播放
  // ======================
  const handlePlay = clickedNote => {
    if (!isReady) return;
    const fullNote = clickedNote || 'C4';
    setNote(fullNote);
    playNote(fullNote);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#fdf2f8'
    }}>
      {/* 页面标题 */}
      <h1 style={{
        fontSize: '1.875rem',
        fontWeight: 'bold',
        marginBottom: '1rem'
      }}>🎶 Piano Reading Trainer</h1>

      {/* 音频初始化按钮（只显示一次） */}
      {!isReady ? (
        <button
          onClick={handleInit}
          style={{
            marginBottom: '1rem',
            padding: '0.5rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseOver={e => e.target.style.backgroundColor = '#2563eb'}
          onMouseOut={e => e.target.style.backgroundColor = '#3b82f6'}
        >
          点击启动音频 🎧
        </button>
      ) : (
        <>
          {/* 五线谱组件 */}
          <AnimatedStaff note={note} clef="treble" />

          {/* 虚拟钢琴组件 */}
          <PianoKeyboard 
            onPlayNote={handlePlay}
            currentNote={note}
          />

          {/* 键盘布局选择 */}
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <select
              value={layout.name}
              onChange={(e) => setLayout(
                e.target.value === 'Logic Pro 风格' 
                  ? KEYBOARD_LAYOUTS.LOGIC_PRO 
                  : KEYBOARD_LAYOUTS.NUMBER
              )}
              style={{
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem',
                border: '1px solid #d1d5db'
              }}
            >
              <option value="Logic Pro 风格">Logic Pro 风格</option>
              <option value="数字键">数字键模式</option>
            </select>
            <span style={{ color: '#4b5563' }}>当前八度：{octave}</span>
          </div>

          {/* 键盘提示 */}
          <KeyboardHints layout={layout} />
        </>
      )}
    </div>
  );
}

export default App;

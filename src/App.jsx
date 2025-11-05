// src/App.jsx
// ============================
// 功能：识谱练习主应用
// ============================

import { useAudio } from './hooks/useAudio.jsx';
import { usePractice } from './hooks/usePractice.jsx';
import { useMidi } from './hooks/useMidi.jsx';
import { useState, useEffect, useCallback, useRef } from 'react';
import { mapKeyToNote, KEYBOARD_LAYOUTS } from './utils/keymap';
import PracticeMode from './components/Practice/PracticeMode';
import Statistics from './components/Practice/Statistics';
import AnimatedStaff from './components/Staff/AnimatedStaff';
import PianoKeyboard from './components/PianoKeyboard';
import KeyboardHints from './components/KeyboardHints';

function App() {
  // 状态管理
  const [mode, setMode] = useState('practice'); // 'free' 或 'practice'
  const [note, setNote] = useState('C4');
  const [octave, setOctave] = useState(4);
  const [isReady, setIsReady] = useState(false);
  const [layout, setLayout] = useState(KEYBOARD_LAYOUTS.LOGIC_PRO);
  const [showStats, setShowStats] = useState(false);
  const [enforceLandscape, setEnforceLandscape] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [isMidiConnecting, setIsMidiConnecting] = useState(false);

  const activeMidiNotes = useRef(new Set());

  // 初始化 Hooks
  const practice = usePractice();
  const { audioInit: initAudio, playNote } = useAudio();
  const inputDisabled = enforceLandscape && !isLandscape;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const detect = () => {
      const isTouchDevice = 'ontouchstart' in window || (navigator.maxTouchPoints || 0) > 1;
      const shouldEnforce = isTouchDevice && window.innerWidth < 1024;
      setEnforceLandscape(shouldEnforce);
      setIsLandscape(window.innerWidth >= window.innerHeight);
    };

    detect();
    window.addEventListener('resize', detect);
    window.addEventListener('orientationchange', detect);

    return () => {
      window.removeEventListener('resize', detect);
      window.removeEventListener('orientationchange', detect);
    };
  }, []);

  useEffect(() => {
    if (inputDisabled && practice.isPlaying) {
      practice.endPractice();
    }
  }, [inputDisabled, practice.isPlaying, practice.endPractice]);

  // ======================
  // 初始化音频系统
  // ======================
  const handleInit = async () => {
    // 检查是否支持 AudioContext
    if (!window.AudioContext && !window.webkitAudioContext) {
      alert('您的浏览器不支持 Web Audio API，请使用 Chrome、Firefox 或 Safari 最新版本。');
      return;
    }

    try {
      const success = await initAudio();
      if (success) {
        setIsReady(true);
      } else {
        alert('音频系统初始化失败，请刷新页面重试。');
      }
    } catch (err) {
      console.error('音频初始化错误:', err);
      alert('音频系统初始化出错，请刷新页面重试。');
    }
  };

  // 播放音符（供键盘和虚拟钢琴使用）
  const handlePlay = useCallback(
    (noteToPlay, options = {}) => {
      if (!isReady || inputDisabled) return;
      let fullNote = noteToPlay || 'C4';
      const velocity = Math.min(Math.max(options.velocity ?? 1, 0.05), 1);

      // 在练习模式中，如果启用了忽略八度，需要使用乐谱中的八度来播放音符
      if (
        mode === 'practice' &&
        practice.isPlaying &&
        practice.ignoreOctave &&
        practice.currentNotes.length > 0
      ) {
        // 从乐谱中提取第一个音符的八度
        const staffNote = practice.currentNotes[0];
        const staffOctaveMatch = staffNote.match(/(\d)$/);
        if (staffOctaveMatch) {
          const staffOctave = staffOctaveMatch[1];
          // 提取琴键音符的音名部分（去掉八度）
          const noteNameMatch = fullNote.match(/^([A-G][#b]?)/);
          if (noteNameMatch) {
            const noteName = noteNameMatch[1];
            fullNote = `${noteName}${staffOctave}`;
          }
        }
      }

      setNote(fullNote);
      playNote(fullNote, velocity);

      // 如果在练习模式中，也处理练习逻辑
      if (mode === 'practice' && practice.isPlaying) {
        practice.handleNoteInput(fullNote, options);
      }
    },
    [
      isReady,
      inputDisabled,
      playNote,
      mode,
      practice.isPlaying,
      practice.ignoreOctave,
      practice.currentNotes,
      practice.handleNoteInput,
    ]
  );

  // MIDI 处理函数
  const handleMidiNoteOn = useCallback(({ note: midiNote, velocity }) => {
    if (inputDisabled) return;
    const active = activeMidiNotes.current;
    if (active.has(midiNote)) return;
    active.add(midiNote);
    handlePlay(midiNote, { source: 'midi', velocity });
  }, [handlePlay, inputDisabled]);

  const handleMidiNoteOff = useCallback(({ note: midiNote }) => {
    activeMidiNotes.current.delete(midiNote);
  }, []);

  const midi = useMidi({
    onNoteOn: handleMidiNoteOn,
    onNoteOff: handleMidiNoteOff
  });

  useEffect(() => {
    if (inputDisabled) {
      activeMidiNotes.current.clear();
    }
  }, [inputDisabled]);

  const handleToggleMidi = useCallback(async () => {
    if (!midi.isSupported) {
      alert('当前浏览器尚未支持 MIDI 设备访问，请使用支持 Web MIDI 的浏览器。');
      return;
    }

    if (midi.isEnabled) {
      midi.disconnect();
      return;
    }

    try {
      setIsMidiConnecting(true);
      const success = await midi.connect();
      if (!success && midi.error) {
        alert(`连接 MIDI 失败：${midi.error}`);
      }
    } finally {
      setIsMidiConnecting(false);
    }
  }, [midi]);

  const showOrientationOverlay = inputDisabled;

  useEffect(() => {
    // 键盘输入监听
    const handleKeyDown = e => {
      if (!isReady || inputDisabled) return; // 未启动音频时或竖屏限制时不响应
      if (e.repeat) return;

      // 遍历所有布局尝试映射音符
      const layouts = [layout, KEYBOARD_LAYOUTS.LOGIC_PRO, KEYBOARD_LAYOUTS.NUMBER];
      let matchedNote = null;

      for (const currentLayout of layouts) {
        const result = mapKeyToNote(e.key, octave, {
          layout: currentLayout,
          isShift: e.shiftKey,
          isAlt: e.altKey,
        });

        if (result) {
          if (result.type === 'octave') {
            setOctave(result.octave);
            return;
          } else if (result.type === 'note') {
            matchedNote = result.note;
            break;
          }
        }
      }

      if (matchedNote) {
        const velocity = e.shiftKey ? 0.95 : 0.8;
        handlePlay(matchedNote, { source: 'keyboard', velocity });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [octave, isReady, layout, handlePlay, inputDisabled]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Noto Sans', sans-serif",
        minHeight: '100vh',
        backgroundColor: '#fdf2f8',
        padding: '2rem',
      }}
    >
      {showOrientationOverlay && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.85)',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '2rem',
            zIndex: 9999,
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔁 请横屏使用</div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
            检测到当前为竖屏模式。为获得完整体验，请旋转设备至横屏后继续。
          </p>
        </div>
      )}
      {/* 页面头部 */}
      <header
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
          }}
        >
          🎶 Piano Reading Trainer
        </h1>

        {isReady && (
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={async () => {
                if (practice.isPlaying) {
                  practice.endPractice();
                }
                // 尝试恢复音频上下文（如果处于暂停状态）
                try {
                  if (window.AudioContext || window.webkitAudioContext) {
                    const audioCtx = window.AudioContext || window.webkitAudioContext;
                    if (typeof audioCtx.prototype.resume === 'function') {
                      const ctx = new audioCtx();
                      if (ctx.state === 'suspended') {
                        await ctx.resume();
                      }
                      ctx.close();
                    }
                  }
                } catch (e) {
                  console.warn('Audio context resume failed:', e);
                }
                setMode('practice');
                setShowStats(false);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: mode === 'practice' && !showStats ? '#3b82f6' : '#f3f4f6',
                color: mode === 'practice' && !showStats ? 'white' : '#4b5563',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              练习模式
            </button>
            <button
              onClick={() => {
                if (practice.isPlaying) {
                  practice.endPractice();
                }
                setMode('free');
                setShowStats(false);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: mode === 'free' && !showStats ? '#3b82f6' : '#f3f4f6',
                color: mode === 'free' && !showStats ? 'white' : '#4b5563',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              自由模式
            </button>
            <button
              onClick={() => {
                if (practice.isPlaying) {
                  practice.endPractice();
                }
                setShowStats(true);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: showStats ? '#3b82f6' : '#f3f4f6',
                color: showStats ? 'white' : '#4b5563',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              统计信息
            </button>
            <button
              onClick={handleToggleMidi}
              disabled={isMidiConnecting}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: midi.isEnabled ? '#10b981' : '#f3f4f6',
                color: midi.isEnabled ? '#ffffff' : '#4b5563',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: isMidiConnecting ? 'wait' : 'pointer',
                opacity: isMidiConnecting ? 0.6 : 1,
                minWidth: '110px',
                marginLeft: 'auto'
              }}
            >
              {midi.isEnabled ? '断开 MIDI' : '连接 MIDI'}
            </button>
            {midi.isEnabled && (
              <span style={{
                fontSize: '0.85rem',
                color: '#047857',
                fontWeight: 600
              }}>
                已连接：{midi.devices.length ? midi.devices.join('、') : 'MIDI 设备'}
              </span>
            )}
            {midi.error && !midi.isEnabled && (
              <span style={{
                fontSize: '0.8rem',
                color: '#b91c1c',
                fontWeight: 500
              }}>
                {midi.error}
              </span>
            )}
          </div>
        )}
      </header>

      {/* 音频初始化按钮 */}
      {!isReady ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            marginTop: '4rem',
          }}
        >
          <h2
            style={{
              fontSize: '1.5rem',
              color: '#1f2937',
              textAlign: 'center',
              maxWidth: '600px',
              lineHeight: '1.5',
            }}
          >
            欢迎使用钢琴视奏训练器！
            <br />
            这个工具将帮助你提高五线谱阅读能力。
          </h2>
          <button
            onClick={handleInit}
            style={{
              padding: '1rem 2rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)',
              transition: 'all 0.2s',
              cursor: 'pointer',
              fontSize: '1.25rem',
              fontWeight: 'bold',
            }}
            onMouseOver={e => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={e => (e.target.style.transform = 'scale(1)')}
          >
            点击启动音频系统 🎵
          </button>
        </div>
      ) : (
        <main style={{ width: '100%', maxWidth: '1200px' }}>
          {/* 统计信息 */}
          {showStats && (
            <Statistics
              stats={practice.lifetimeStats}
              highScores={practice.highScores}
              memory={practice.memorySummary}
              onClearHistory={practice.clearPracticeHistory}
            />
          )}

          {/* 练习模式 */}
          {mode === 'practice' && !showStats && (
            <PracticeMode
              difficulty={practice.difficulty}
              onChangeDifficulty={practice.setDifficulty}
              clef={practice.clef}
              onChangeClef={practice.setClef}
              rangeMode={practice.rangeMode}
              onChangeRangeMode={practice.setRangeMode}
              ignoreOctave={practice.ignoreOctave}
              onToggleIgnoreOctave={() => practice.setIgnoreOctave(prev => !prev)}
              isPlaying={practice.isPlaying}
              currentNotes={practice.currentNotes}
              currentClef={practice.currentClef}
              questionId={practice.questionId}
              onNotePlay={handlePlay}
              score={practice.score}
              combo={practice.combo}
              onStart={practice.startPractice}
              onEnd={practice.endPractice}
              lastResult={practice.lastResult}
            />
          )}

          {/* 自由模式 */}
          {mode === 'free' && !showStats && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
              }}
            >
              <AnimatedStaff note={note} clef="treble" />
              <PianoKeyboard onPlayNote={handlePlay} currentNote={note} />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <label
                  htmlFor="keyboard-layout-selector"
                  style={{
                    color: '#4b5563',
                    fontWeight: '500',
                    marginRight: '0.5rem',
                  }}
                >
                  键盘布局：
                </label>
                <select
                  id="keyboard-layout-selector"
                  value={layout.name}
                  onChange={e =>
                    setLayout(
                      e.target.value === 'Logic Pro 风格'
                        ? KEYBOARD_LAYOUTS.LOGIC_PRO
                        : KEYBOARD_LAYOUTS.NUMBER
                    )
                  }
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="Logic Pro 风格">Logic Pro 风格</option>
                  <option value="数字键">数字键模式</option>
                </select>
                <span style={{ color: '#4b5563', fontWeight: '500' }}>当前八度：{octave}</span>
              </div>
              <KeyboardHints layout={layout} />
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;

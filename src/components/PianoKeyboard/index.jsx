// 🎹 PianoKeyboard.jsx —— 虚拟钢琴键盘组件
// 功能：
// 1. 显示简单的白键与黑键
// 2. 点击键盘可播放音符
// 3. 高亮当前按下的键

import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import PianoKey from './PianoKey';

const WHITE_KEYS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
const BLACK_KEYS = ['C#', 'D#', 'F#', 'G#', 'A#'];

const BLACK_KEY_OFFSETS = {
  'C#': 0.75,
  'D#': 1.75,
  'F#': 3.75,
  'G#': 4.75,
  'A#': 5.75,
};

const KEY_WIDTH = 48; // 白键宽度

export default function PianoKeyboard({ onPlayNote, currentNote }) {
  const [activeKey, setActiveKey] = useState(null);

  // 处理当前音符变化
  useEffect(() => {
    if (currentNote) {
      setActiveKey(currentNote);
      const timer = setTimeout(() => setActiveKey(null), 200);
      return () => clearTimeout(timer);
    }
  }, [currentNote]);

  const handlePlay = (note, velocity = 0.85) => {
    setActiveKey(note);
    onPlayNote?.(note, {
      source: 'virtual-keyboard',
      velocity
    });
    setTimeout(() => setActiveKey(null), 200);
  };

  return (
    <div style={{
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      marginTop: '1.5rem',
      width: 'fit-content',
        margin: '1.5rem auto',
        userSelect: 'none'
    }}>
      {/* 白键 */}
      <div style={{ 
        display: 'flex', 
        position: 'relative', 
        zIndex: 1,
        backgroundColor: '#fff',
        borderRadius: '0 0 6px 6px',
        padding: '0 1px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        {WHITE_KEYS.map((note) => (
          <PianoKey
            key={note}
            note={`${note}4`}
            onTrigger={(value) => handlePlay(value, 0.82)}
            isActive={activeKey === `${note}4`}
          />
        ))}
      </div>

      {/* 黑键 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        display: 'flex',
        zIndex: 2
      }}>
        {BLACK_KEYS.map(note => (
          <div
            key={note}
            style={{
              position: 'absolute',
              left: `${BLACK_KEY_OFFSETS[note] * KEY_WIDTH}px`,
            }}
          >
            <PianoKey
              note={`${note}4`}
              isBlack
              onTrigger={(value) => handlePlay(value, 0.92)}
              isActive={activeKey === `${note}4`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

PianoKeyboard.propTypes = {
  onPlayNote: PropTypes.func.isRequired,
  currentNote: PropTypes.string,
};

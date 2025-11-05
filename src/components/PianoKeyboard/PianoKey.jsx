// 🎹 PianoKey.jsx
// 功能：单个钢琴键组件
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export default function PianoKey({ note, isBlack, onTrigger, isActive }) {
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    if (isActive) {
      setIsPressed(true);
      const timer = setTimeout(() => setIsPressed(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  const baseStyles = {
    width: isBlack ? '32px' : '48px',
    height: isBlack ? '100px' : '160px',
    backgroundColor: isBlack ? '#1a1a1a' : '#fff',
    border: isBlack ? '1px solid #000' : '1px solid #d1d5db',
    borderRadius: '0 0 4px 4px',
    cursor: 'pointer',
    transition: 'transform 0.1s ease, background-color 0.1s ease',
    transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
    position: 'relative',
    boxShadow: isBlack
      ? '0 0 3px rgba(0,0,0,0.4)'
      : '0 2px 4px rgba(0,0,0,0.1)',
    margin: isBlack ? '0' : '0 1px',
    touchAction: 'none',
    userSelect: 'none'
  };

  const pressedStyles = isBlack
    ? { backgroundColor: '#303030', boxShadow: '0 0 2px rgba(0,0,0,0.4)' }
    : { backgroundColor: '#f3f4f6' };

  // 黑键显示所有等价音名
  let displayNames = [note.replace(/\d/g, '')];
  if (isBlack) {
    // C# <-> Db, D# <-> Eb, F# <-> Gb, G# <-> Ab, A# <-> Bb
    const enharmonicMap = {
      'C#': 'Db',
      'D#': 'Eb',
      'F#': 'Gb',
      'G#': 'Ab',
      'A#': 'Bb',
      'Db': 'C#',
      'Eb': 'D#',
      'Gb': 'F#',
      'Ab': 'G#',
      'Bb': 'A#',
    };
    const base = note.replace(/\d/g, '');
    if (enharmonicMap[base] && !displayNames.includes(enharmonicMap[base])) {
      displayNames.push(enharmonicMap[base]);
    }
  }

  const handlePointerDown = (event) => {
    event.preventDefault();
    if (!isPressed) {
      setIsPressed(true);
      onTrigger(note);
    }
  };

  const handlePointerUp = () => {
    setIsPressed(false);
  };

  const handlePointerCancel = () => {
    setIsPressed(false);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerCancel}
      onPointerCancel={handlePointerCancel}
      style={{
        ...baseStyles,
        ...(isPressed ? pressedStyles : {}),
      }}
    >
      {/* 音符提示 */}
      <div style={{
        position: 'absolute',
        bottom: isBlack ? '8px' : '12px',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '0.75rem',
        color: isBlack ? '#ffffff80' : '#64748b',
        pointerEvents: 'none',
        userSelect: 'none',
        fontWeight: '500',
        lineHeight: 1.1,
      }}>
        {displayNames.join(' / ')}
      </div>
    </div>
  );
}

PianoKey.propTypes = {
  note: PropTypes.string.isRequired,
  isBlack: PropTypes.bool,
  onTrigger: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

PianoKey.defaultProps = {
  isBlack: false,
  isActive: false,
};
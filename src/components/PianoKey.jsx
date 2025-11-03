// 🎹 PianoKey.jsx
// 功能：单个钢琴键组件
import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export default function PianoKey({ note, isBlack, onClick, isActive }) {
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
    transition: 'all 0.1s ease',
    transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
    position: 'relative',
    boxShadow: isBlack 
      ? '0 0 3px rgba(0,0,0,0.4)' 
      : '0 2px 4px rgba(0,0,0,0.1)',
    margin: isBlack ? '0' : '0 1px',
  };

  const hoverStyles = isBlack 
    ? { backgroundColor: '#333', boxShadow: '0 0 4px rgba(0,0,0,0.5)' } 
    : { backgroundColor: '#f8fafc' };
    
  const activeStyles = isBlack 
    ? { backgroundColor: '#404040', boxShadow: '0 0 2px rgba(0,0,0,0.3)' } 
    : { backgroundColor: '#f1f5f9' };

  return (
    <div
      onClick={() => onClick(note)}
      style={{
        ...baseStyles,
        ...(isPressed ? activeStyles : {}),
      }}
      onMouseOver={e => Object.assign(e.target.style, hoverStyles)}
      onMouseOut={e => Object.assign(e.target.style, baseStyles)}
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
      }}>
        {note.replace(/\d/g, '')}
      </div>
    </div>
  );
}

PianoKey.propTypes = {
  note: PropTypes.string.isRequired,
  isBlack: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool,
};

PianoKey.defaultProps = {
  isBlack: false,
  isActive: false,
};
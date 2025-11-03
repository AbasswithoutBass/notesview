// 🎵 AnimatedStaff.jsx
// 功能：带动画效果的五线谱组件
// 改进：
// 1. 音符切换动画
// 2. 视觉反馈效果
// 3. 高亮当前音符

import { useEffect, useRef, useState } from 'react';
import { 
  Renderer, 
  Stave, 
  StaveNote, 
  Voice, 
  Formatter, 
  Accidental 
} from 'vexflow';
import PropTypes from 'prop-types';

export default function AnimatedStaff({ note = 'C4', clef = 'treble' }) {
  const containerRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousNote = useRef(note);

  // 计算音符的垂直位置（用于动画）
  const getNotePosition = (noteName) => {
    const noteMap = {
      'C': 0, 'D': 1, 'E': 2, 'F': 3, 'G': 4, 'A': 5, 'B': 6
    };
    const baseName = noteName.replace(/[0-9#b]/g, '');
    return noteMap[baseName] || 0;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // 如果音符改变，触发动画
    if (note !== previousNote.current) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        previousNote.current = note;
      }, 300);
    }

    // 清空旧画布
    containerRef.current.innerHTML = '';

    // 创建渲染器
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    renderer.resize(350, 160);

    // 绘制五线谱
    const stave = new Stave(10, 40, 330);
    stave.addClef(clef).setContext(context).draw();

    // 转换音符格式
    const key = note.toLowerCase().replace(/(\d)/, '/$1');

    // 创建音符
    const staveNote = new StaveNote({
      clef,
      keys: [key],
      duration: 'q',
    });

    // 如果是升降号，添加标记
    if (note.includes('#')) {
      staveNote.addModifier(new Accidental("#"), 0);
    } else if (note.includes('b')) {
      staveNote.addModifier(new Accidental("b"), 0);
    }

    // 设置音符颜色
    staveNote.setStyle({ fillStyle: '#2563eb', strokeStyle: '#2563eb' });

    // 创建 Voice 并绘制
    const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.setStrict(false);
    voice.addTickables([staveNote]);

    new Formatter().joinVoices([voice]).format([voice], 250);
    voice.draw(context, stave);

  }, [note, clef]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        <div 
          style={{
            fontSize: '1.125rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            transition: 'all 0.3s',
            transform: isAnimating ? 'scale(1.1)' : 'scale(1)',
            color: isAnimating ? '#2563eb' : '#374151',
          }}
        >
          当前音符：{note}
        </div>
        <div
          ref={containerRef}
          style={{
            width: '350px',
            height: '160px',
            margin: '0 auto',
            backgroundColor: '#fafafa',
            borderRadius: '8px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            transition: 'all 0.3s',
            transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>
      
      {/* 音符位置指示器 */}
      <div 
        style={{
          position: 'absolute',
          left: 0,
          width: '4px',
          backgroundColor: '#3b82f6',
          transition: 'all 0.3s',
          top: `${40 + getNotePosition(note) * 5}px`,
          height: '2px',
          opacity: isAnimating ? 1 : 0,
          transform: isAnimating ? 'scaleX(50)' : 'scaleX(0)',
        }}
      />
    </div>
  );
}

AnimatedStaff.propTypes = {
  note: PropTypes.string,
  clef: PropTypes.oneOf(['treble', 'bass', 'alto', 'tenor']),
};
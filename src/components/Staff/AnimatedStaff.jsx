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

export default function AnimatedStaff({ note, notes, clef = 'treble', hideLabels = false }) {
  const noteList = Array.isArray(notes) && notes.length > 0 ? notes : [note || 'C4'];
  const displaySignature = noteList.join('|');
  const primaryNote = noteList[0];
  const containerRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousSignature = useRef(displaySignature);

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
    if (displaySignature !== previousSignature.current) {
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        previousSignature.current = displaySignature;
      }, 300);
    }

    // 清空旧画布
    containerRef.current.innerHTML = '';

    // 创建渲染器 - 增大显示区域
    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    const context = renderer.getContext();
    renderer.resize(600, 280);

    // 绘制五线谱 - 调整五线谱的位置和宽度
    const stave = new Stave(20, 60, 560);
    stave.addClef(clef).setContext(context).draw();

    // 处理音符和升降号：分离升降号后再添加到 VexFlow
    const keys = noteList.map(n => {
      // 移除升降号后转换格式，例如 Db4 -> d/4
      const cleanNote = n.replace(/[#b]/g, '').toLowerCase();
      return cleanNote.replace(/(\d)/, '/$1');
    });

    const staveNote = new StaveNote({
      clef,
      keys,
      duration: 'w',
    });

    noteList.forEach((noteName, index) => {
      if (noteName.includes('#')) {
        staveNote.addModifier(new Accidental('#'), index);
      } else if (noteName.includes('b')) {
        staveNote.addModifier(new Accidental('b'), index);
      }
    });

    // 设置音符颜色
    staveNote.setStyle({ fillStyle: '#2563eb', strokeStyle: '#2563eb' });

    // 创建 Voice 并绘制
  const voice = new Voice({ num_beats: 4, beat_value: 4 });
    voice.setStrict(false);
    voice.addTickables([staveNote]);

    new Formatter().joinVoices([voice]).format([voice], 420);
    voice.draw(context, stave);

  }, [displaySignature, clef]);

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ textAlign: 'center', marginTop: '10px' }}>
        {!hideLabels && (
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
            当前音符：{noteList.join(' / ')}
          </div>
        )}
        <div
          ref={containerRef}
          style={{
            width: '600px',
            height: '280px',
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
          top: `${40 + getNotePosition(primaryNote) * 5}px`,
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
  notes: PropTypes.arrayOf(PropTypes.string),
  clef: PropTypes.oneOf(['treble', 'bass', 'alto', 'tenor']),
  hideLabels: PropTypes.bool,
};
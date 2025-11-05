import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';
import Timer from '../common/Timer';
import ScoreBoard from './ScoreBoard';
import AnimatedStaff from '../Staff/AnimatedStaff';
import PianoKeyboard from '../PianoKeyboard';

const CLEF_OPTIONS = [
  { key: 'treble', label: '高音谱号', icon: '𝄞' },
  { key: 'bass', label: '低音谱号', icon: '𝄢' },
  { key: 'alto', label: '中音谱号', icon: '𝄡' },
  { key: 'tenor', label: '次中音谱号', icon: '𝄡' }
];

const RANGE_OPTIONS = [
  {
    key: 'standard',
    label: '标准音域',
    description: '练习集中在常用音区'
  },
  {
    key: 'extended',
    label: '扩展音域',
    description: '覆盖更宽的高低音范围'
  }
];

export default function PracticeMode({
  difficulty,
  onChangeDifficulty,
  clef,
  onChangeClef,
  rangeMode,
  onChangeRangeMode,
  ignoreOctave,
  onToggleIgnoreOctave,
  isPlaying,
  currentNotes,
  currentClef,
  onNotePlay,
  score,
  combo,
  onStart,
  onEnd,
  lastResult,
  questionId
}) {
  const [showStats, setShowStats] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong' | null
  const feedbackTimer = useRef(null);
  const level = DIFFICULTY_LEVELS[difficulty];
  const wasPlaying = useRef(false);

  useEffect(() => {
    if (isPlaying) {
      setShowStats(false);
    } else if (wasPlaying.current) {
      setShowStats(true);
    }
    if (!isPlaying && feedbackTimer.current) {
      clearTimeout(feedbackTimer.current);
      feedbackTimer.current = null;
      setFeedback(null);
    }
    wasPlaying.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    if (!lastResult || !lastResult.status) return;
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(lastResult.status);
    feedbackTimer.current = setTimeout(() => {
      setFeedback(null);
      feedbackTimer.current = null;
    }, 500);
  }, [lastResult]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.5rem',
      padding: '1rem'
    }}>
      {/* 难度选择 */}
      {!isPlaying && !showStats && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937'
          }}>
            选择练习类型
          </h2>
          <div style={{
            display: 'flex',
            gap: '1rem'
          }}>
            {Object.entries(DIFFICULTY_LEVELS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => onChangeDifficulty(key)}
                style={{
                  padding: '1rem 1.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: difficulty === key ? '#3b82f6' : '#f3f4f6',
                  color: difficulty === key ? '#ffffff' : '#4b5563',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                <span style={{ fontWeight: 'bold' }}>{config.name}</span>
                <span style={{ fontSize: '0.875rem', color: difficulty === key ? '#dbeafe' : '#6b7280' }}>{config.description}</span>
              </button>
            ))}
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1.5rem'
          }}>
            <span style={{ color: '#4b5563', fontWeight: '600' }}>选择谱号</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {CLEF_OPTIONS.map(option => (
                <button
                  key={option.key}
                  onClick={() => onChangeClef(option.key)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '0.5rem',
                    backgroundColor: clef === option.key ? '#0ea5e9' : '#f3f4f6',
                    color: clef === option.key ? '#ffffff' : '#4b5563',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    minWidth: '90px'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{option.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.75rem',
            marginTop: '1rem'
          }}>
            <span style={{ color: '#4b5563', fontWeight: '600' }}>练习音域</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {RANGE_OPTIONS.map(option => (
                <button
                  key={option.key}
                  onClick={() => onChangeRangeMode(option.key)}
                  style={{
                    padding: '0.75rem 1.25rem',
                    borderRadius: '0.5rem',
                    backgroundColor: rangeMode === option.key ? '#6366f1' : '#f3f4f6',
                    color: rangeMode === option.key ? '#ffffff' : '#4b5563',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem',
                    minWidth: '110px'
                  }}
                >
                  <span style={{ fontWeight: '700' }}>{option.label}</span>
                  <span style={{ fontSize: '0.75rem', color: rangeMode === option.key ? '#e0e7ff' : '#6b7280' }}>
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleIgnoreOctave}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: ignoreOctave ? '#0ea5e9' : '#e5e7eb',
              color: ignoreOctave ? '#ffffff' : '#374151',
              borderRadius: '999px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              transition: 'all 0.2s'
            }}
          >
            {ignoreOctave ? '忽略八度：开启' : '忽略八度：关闭'}
          </button>

          <button
            onClick={onStart}
            style={{
              marginTop: '2rem',
              padding: '0.75rem 2rem',
              backgroundColor: '#059669',
              color: 'white',
              borderRadius: '0.5rem',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
          >
            开始练习
          </button>
        </div>
      )}

      {/* 练习界面 */}
      {isPlaying && (
        <>
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#1f2937'
          }}>
            <span style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#e0f2fe',
              borderRadius: '999px'
            }}>
              当前谱号：{CLEF_OPTIONS.find(option => option.key === currentClef)?.label || '未知'}
            </span>
            <span style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: rangeMode === 'extended' ? '#ede9fe' : '#dcfce7',
              borderRadius: '999px'
            }}>
              音域：{rangeMode === 'extended' ? '扩展' : '标准'}
            </span>
            {ignoreOctave && (
              <span style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#fee2e2',
                borderRadius: '999px',
                color: '#b91c1c'
              }}>
                忽略八度
              </span>
            )}
          </div>

          {/* 计时器和分数 */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            maxWidth: '800px',
            gap: '1rem'
          }}>
            <Timer
              duration={level.timeLimit * 1000} // 转换为毫秒
              isRunning={isPlaying}
              resetKey={`${questionId}-${currentNotes.join('-')}`}
            />
            <ScoreBoard score={score} combo={combo} />
            <button
              onClick={onEnd}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f97316',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              结束练习
            </button>
          </div>

          {/* 五线谱，带对错高亮反馈 */}
          <div style={{
            transition: 'box-shadow 0.2s',
            boxShadow:
              feedback === 'correct'
                ? '0 0 0 4px #22c55e'
                : feedback === 'wrong'
                ? '0 0 0 4px #ef4444'
                : 'none',
            borderRadius: '12px',
            marginBottom: '1rem',
          }}>
            <AnimatedStaff notes={currentNotes} clef={currentClef} hideLabels={true} />
          </div>

          {/* 钢琴键盘，包裹点击反馈逻辑 */}
          <PianoKeyboard
            onPlayNote={onNotePlay}
          />
        </>
      )}

      {/* 练习结束统计 */}
      {!isPlaying && showStats && (
        <ScoreBoard
          score={score}
          combo={combo}
          showStats
          onRestart={() => {
            setShowStats(false);
            onStart();
          }}
          onBack={() => setShowStats(false)}
        />
      )}
    </div>
  );
}

PracticeMode.propTypes = {
  difficulty: PropTypes.oneOf(Object.keys(DIFFICULTY_LEVELS)).isRequired,
  onChangeDifficulty: PropTypes.func.isRequired,
  clef: PropTypes.oneOf(CLEF_OPTIONS.map(option => option.key)).isRequired,
  onChangeClef: PropTypes.func.isRequired,
  rangeMode: PropTypes.oneOf(RANGE_OPTIONS.map(option => option.key)).isRequired,
  onChangeRangeMode: PropTypes.func.isRequired,
  ignoreOctave: PropTypes.bool.isRequired,
  onToggleIgnoreOctave: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentNotes: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentClef: PropTypes.oneOf(CLEF_OPTIONS.map(option => option.key)).isRequired,
  onNotePlay: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired,
  combo: PropTypes.number.isRequired,
  onStart: PropTypes.func.isRequired,
  onEnd: PropTypes.func.isRequired,
  lastResult: PropTypes.shape({
    status: PropTypes.oneOf(['correct', 'wrong', null]),
    timestamp: PropTypes.number
  }),
  questionId: PropTypes.number.isRequired
};

PracticeMode.defaultProps = {
  lastResult: { status: null, timestamp: 0 }
};
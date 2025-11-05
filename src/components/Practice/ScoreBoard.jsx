import PropTypes from 'prop-types';
import { getScoreGrade } from '../../utils/noteUtils';

export default function ScoreBoard({ score, combo, showStats = false, onRestart, onBack }) {
  const { grade, icon } = getScoreGrade(score);

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        width: showStats ? '100%' : 'auto',
        maxWidth: '400px',
      }}
    >
      {/* 当前分数 */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: showStats ? '2rem' : '0.5rem',
        }}
      >
        <div
          style={{
            fontSize: showStats ? '3rem' : '1.5rem',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontSize: showStats ? '1.5rem' : '1rem',
            color: '#6b7280',
          }}
        >
          分数
        </div>
      </div>

      {/* 等级评定 */}
      {showStats && (
        <div
          style={{
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              fontSize: '4rem',
              marginBottom: '0.5rem',
            }}
          >
            {icon}
          </div>
          <div
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#2563eb',
            }}
          >
            {grade}级
          </div>
        </div>
      )}

      {/* 连击数 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span
          style={{
            fontSize: showStats ? '1.25rem' : '1rem',
            color: '#6b7280',
          }}
        >
          连击
        </span>
        <span
          style={{
            fontSize: showStats ? '1.5rem' : '1.25rem',
            fontWeight: 'bold',
            color: '#2563eb',
          }}
        >
          {combo}
        </span>
      </div>

      {/* 操作按钮 */}
      {showStats && (
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '2rem',
          }}
        >
          <button
            onClick={onRestart}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            再来一次
          </button>
          <button
            onClick={onBack}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#f3f4f6',
              color: '#4b5563',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            }}
          >
            返回
          </button>
        </div>
      )}
    </div>
  );
}

ScoreBoard.propTypes = {
  score: PropTypes.number.isRequired,
  combo: PropTypes.number.isRequired,
  showStats: PropTypes.bool,
  onRestart: PropTypes.func,
  onBack: PropTypes.func,
};

import PropTypes from 'prop-types';
import ProgressBar from '../common/ProgressBar';
import { CLEF_NAMES } from '../../constants/notes';
import { DIFFICULTY_LEVELS } from '../../constants/difficulty';

const DEFAULT_STATS = {
  totalGames: 0,
  totalScore: 0,
  correctNotes: 0,
  totalNotes: 0,
  averageTime: 0,
  highestCombo: 0
};

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '随时复习';
  const diff = timestamp - Date.now();
  if (diff <= 0) return '立即复习';
  const minutes = Math.round(diff / 60000);
  if (minutes < 1) return '即将复习';
  if (minutes < 60) return `${minutes} 分钟后`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} 小时后`;
  const days = Math.round(hours / 24);
  return `${days} 天后`;
};

export default function Statistics({ stats, highScores, memory, onClearHistory }) {
  const mergedStats = { ...DEFAULT_STATS, ...stats };
  const accuracy = mergedStats.totalNotes > 0
    ? (mergedStats.correctNotes / mergedStats.totalNotes) * 100
    : 0;

  const averageTime = mergedStats.totalNotes > 0
    ? mergedStats.averageTime / 1000
    : 0;

  const dueList = (memory?.due || []).slice(0, 5);
  const challengingList = (memory?.challenging || []).slice(0, 5);

  // 为每个难度计算独立的最大值（用于进度条）
  // 根据该难度的实际最高分，加上20%的余量
  const getProgressMaxValue = (score) => {
    const baseMax = Math.max(score || 0, 1000);
    return Math.ceil(baseMax * 1.2);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '600px'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          练习统计
        </h2>
        <button
          type="button"
          onClick={onClearHistory}
          style={{
            padding: '0.4rem 0.9rem',
            fontSize: '0.85rem',
            borderRadius: '999px',
            border: 'none',
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
            cursor: 'pointer',
            fontWeight: 600
          }}
        >
          清除历史
        </button>
      </div>

      {/* 总体统计 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <StatItem
          label="总练习次数"
          value={mergedStats.totalGames}
          icon="🎯"
        />
        <StatItem
          label="最高连击"
          value={mergedStats.highestCombo}
          icon="🔥"
        />
        <StatItem
          label="准确率"
          value={`${Math.round(accuracy)}%`}
          icon="✨"
        />
        <StatItem
          label="平均反应时间"
          value={`${averageTime.toFixed(2)}s`}
          icon="⚡"
        />
      </div>

      {/* 难度最高分 */}
      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: '#374151',
        marginBottom: '1rem'
      }}>
        难度最高分
      </h3>
      <div style={{ marginBottom: '2rem' }}>
        <ProgressBar
          label={DIFFICULTY_LEVELS.BEGINNER.name}
          value={highScores.BEGINNER || 0}
          maxValue={getProgressMaxValue(highScores.BEGINNER)}
        />
        <ProgressBar
          label={DIFFICULTY_LEVELS.INTERMEDIATE.name}
          value={highScores.INTERMEDIATE || 0}
          maxValue={getProgressMaxValue(highScores.INTERMEDIATE)}
        />
        <ProgressBar
          label={DIFFICULTY_LEVELS.ADVANCED.name}
          value={highScores.ADVANCED || 0}
          maxValue={getProgressMaxValue(highScores.ADVANCED)}
        />
        <ProgressBar
          label={DIFFICULTY_LEVELS.MASTER.name}
          value={highScores.MASTER || 0}
          maxValue={getProgressMaxValue(highScores.MASTER)}
        />
      </div>

      {/* 复习阶段说明 */}
      <div style={{
        backgroundColor: '#eff6ff',
        borderLeft: '4px solid #3b82f6',
        borderRadius: '0.5rem',
        padding: '1rem',
        marginBottom: '1rem',
        fontSize: '0.9rem',
        color: '#1e40af'
      }}>
        <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>📚 复习阶段说明</div>
        <div style={{ fontSize: '0.85rem', lineHeight: '1.5' }}>
          <div style={{ marginBottom: '0.3rem' }}>• <strong>阶段 1</strong>：首次学习 (1 天后复习)</div>
          <div style={{ marginBottom: '0.3rem' }}>• <strong>阶段 2</strong>：初步巩固 (3 天后复习)</div>
          <div style={{ marginBottom: '0.3rem' }}>• <strong>阶段 3</strong>：深度记忆 (7 天后复习)</div>
          <div style={{ marginBottom: '0.3rem' }}>• <strong>阶段 4</strong>：长期记忆 (14 天后复习)</div>
          <div>• <strong>阶段 5+</strong>：深度掌握 (按需复习)</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        <MemorySection
          title="待复习音符"
          emptyHint="暂无待复习音符 🎉"
          items={dueList.map(item => ({
            key: item.note,
            primary: item.note,
            secondary: CLEF_NAMES[item.clef] || '未分类',
            detail: `阶段 ${item.stage + 1} · ${formatRelativeTime(item.nextDue)}`
          }))}
        />
        <MemorySection
          title="易错音排行"
          emptyHint="目前没有明显的易错音 👏"
          items={challengingList.map(item => {
            const total = item.correct + item.wrong;
            const successRate = total > 0 ? Math.round((item.correct / total) * 100) : 0;
            return {
              key: item.note,
              primary: item.note,
              secondary: CLEF_NAMES[item.clef] || '未分类',
              detail: `成功率 ${successRate}% · ${item.wrong} 次错记`
            };
          })}
        />
      </div>
    </div>
  );
}

// 统计项组件
function StatItem({ label, value, icon }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem',
      backgroundColor: '#f3f4f6',
      borderRadius: '0.5rem'
    }}>
      <div style={{
        fontSize: '1.5rem'
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontSize: '0.875rem',
          color: '#6b7280'
        }}>
          {label}
        </div>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: '#1f2937'
        }}>
          {value}
        </div>
      </div>
    </div>
  );
}

Statistics.propTypes = {
  stats: PropTypes.shape({
      totalGames: PropTypes.number,
      totalScore: PropTypes.number,
      correctNotes: PropTypes.number,
      totalNotes: PropTypes.number,
      averageTime: PropTypes.number,
      highestCombo: PropTypes.number
  }),
  highScores: PropTypes.object,
  memory: PropTypes.shape({
    due: PropTypes.arrayOf(PropTypes.shape({
      note: PropTypes.string.isRequired,
      nextDue: PropTypes.number,
      stage: PropTypes.number,
      correct: PropTypes.number,
      wrong: PropTypes.number
    })),
    challenging: PropTypes.arrayOf(PropTypes.shape({
      note: PropTypes.string.isRequired,
      correct: PropTypes.number,
      wrong: PropTypes.number,
      successRate: PropTypes.number,
      nextDue: PropTypes.number,
      stage: PropTypes.number
    }))
  }),
  onClearHistory: PropTypes.func
};

StatItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  icon: PropTypes.string.isRequired
};

const MemorySection = ({ title, emptyHint, items }) => (
  <div style={{
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '1rem'
  }}>
    <h3 style={{
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.75rem'
    }}>
      {title}
    </h3>
    {items.length === 0 ? (
      <div style={{
        color: '#6b7280',
        fontSize: '0.95rem'
      }}>
        {emptyHint}
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map(item => (
          <div
            key={item.key}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '0.75rem',
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              boxShadow: '0 1px 2px rgba(15, 23, 42, 0.08)'
            }}
          >
            <span style={{
              fontSize: '1.1rem',
              fontWeight: '600',
              color: '#2563eb'
            }}>
              {item.primary}
            </span>
            <span style={{
              fontSize: '0.9rem',
              color: '#4b5563'
            }}>
              {item.secondary}
            </span>
            <span style={{
              fontSize: '0.85rem',
              color: '#6b7280'
            }}>
              {item.detail}
            </span>
          </div>
        ))}
      </div>
    )}
  </div>
);

MemorySection.propTypes = {
  title: PropTypes.string.isRequired,
  emptyHint: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    primary: PropTypes.string.isRequired,
    secondary: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired
  })).isRequired
};

Statistics.defaultProps = {
  stats: DEFAULT_STATS,
  highScores: {},
  memory: { due: [], challenging: [] },
  onClearHistory: () => {}
};
import PropTypes from 'prop-types';

export default function ProgressBar({
  value,
  maxValue,
  label,
  showPercentage = false,
  showScore = true,
}) {
  const percentage = Math.round((value / maxValue) * 100);

  return (
    <div
      style={{
        width: '100%',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '0.25rem',
        }}
      >
        <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>{label}</span>
        {showScore && (
          <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>
            {Math.round(value)}/{maxValue}
          </span>
        )}
        {showPercentage && !showScore && (
          <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{percentage}%</span>
        )}
      </div>

      <div
        style={{
          width: '100%',
          height: '0.5rem',
          backgroundColor: '#e5e7eb',
          borderRadius: '0.25rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            transition: 'width 0.3s ease-in-out',
          }}
        />
      </div>
    </div>
  );
}

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  maxValue: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  showPercentage: PropTypes.bool,
  showScore: PropTypes.bool,
};

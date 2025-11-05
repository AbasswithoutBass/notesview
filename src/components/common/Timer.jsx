import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

export default function Timer({ duration, onComplete, isRunning, resetKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);

  // 支持外部重置
  useEffect(() => {
    setTimeLeft(duration);
  }, [duration, resetKey]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 100;
          if (newTime <= 0) {
            clearInterval(timer);
            onComplete?.();
            return 0;
          }
          return newTime;
        });
      }, 100);
    } else if (timeLeft <= 0) {
      onComplete?.();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onComplete]);

  const seconds = (timeLeft / 1000).toFixed(1);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '0.5rem',
        borderRadius: '0.5rem',
        backgroundColor: timeLeft < duration * 0.3 ? '#fee2e2' : '#f0fdf4',
        transition: 'background-color 0.3s',
      }}
    >
      <div
        style={{
          fontSize: '1.25rem',
          fontWeight: 'bold',
          color: timeLeft < duration * 0.3 ? '#dc2626' : '#059669',
        }}
      >
        {seconds}s
      </div>
      <div
        style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#e5e7eb',
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${(timeLeft / duration) * 100}%`,
            height: '100%',
            backgroundColor: timeLeft < duration * 0.3 ? '#dc2626' : '#059669',
            transition: 'width 0.1s linear',
          }}
        />
      </div>
    </div>
  );
}

Timer.propTypes = {
  duration: PropTypes.number.isRequired,
  onComplete: PropTypes.func,
  isRunning: PropTypes.bool,
  resetKey: PropTypes.any,
};

Timer.defaultProps = {
  isRunning: false,
};
Timer.propTypes = {
  duration: PropTypes.number.isRequired,
  onComplete: PropTypes.func,
  isRunning: PropTypes.bool,
};

Timer.defaultProps = {
  isRunning: false,
};

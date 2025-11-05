// 🎹 KeyboardHints.jsx
// 功能：显示键盘按键提示信息
import PropTypes from 'prop-types';
import { getKeyboardHints } from '../utils/keymap';

export default function KeyboardHints({ layout }) {
  const hints = getKeyboardHints(layout);

  return (
    <div
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      <h3
        style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          marginBottom: '0.5rem',
        }}
      >
        键盘指引
      </h3>

      {/* 音符按键 */}
      <div style={{ marginBottom: '1rem' }}>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#4b5563',
            marginBottom: '0.5rem',
          }}
        >
          音符键位：
        </h4>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          {hints.notes.map(({ key, note }) => (
            <div
              key={key}
              style={{
                padding: '0.25rem 0.75rem',
                backgroundColor: '#f3f4f6',
                borderRadius: '0.25rem',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              <span style={{ fontFamily: 'monospace' }}>{key}</span>
              <span style={{ color: '#6b7280' }}>→</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 功能按键 */}
      <div>
        <h4
          style={{
            fontSize: '0.875rem',
            fontWeight: '500',
            color: '#4b5563',
            marginBottom: '0.5rem',
          }}
        >
          功能键位：
        </h4>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <div
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
            }}
          >
            {hints.functions.octaveDown} / {hints.functions.octaveUp} - 切换八度
          </div>
          <div
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
            }}
          >
            {hints.functions.sharp} - 升号
          </div>
          <div
            style={{
              padding: '0.25rem 0.75rem',
              backgroundColor: '#dbeafe',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
            }}
          >
            {hints.functions.flat} - 降号
          </div>
        </div>
      </div>
    </div>
  );
}

KeyboardHints.propTypes = {
  layout: PropTypes.shape({
    name: PropTypes.string.isRequired,
    map: PropTypes.object.isRequired,
  }).isRequired,
};

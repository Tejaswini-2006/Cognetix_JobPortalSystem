import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ErrorAlert = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.25rem',
        backgroundColor: '#FEF2F2',
        border: '1px solid #FCA5A5',
        borderRadius: 'var(--radius-sm)',
        color: '#991B1B',
        fontSize: '0.9rem',
        marginBottom: '1.25rem',
        lineHeight: 1.4,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={20} style={{ flexShrink: 0, color: '#DC2626' }} />
        <span>{message}</span>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#991B1B',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;

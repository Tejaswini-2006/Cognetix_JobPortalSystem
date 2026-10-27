import React from 'react';

const StatCard = ({
  icon: Icon,
  label,
  value,
  color = 'var(--accent-teal)',
  bgColor = 'var(--accent-teal-light)',
  subtext,
}) => {
  return (
    <div
      className="card"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.25rem',
      }}
    >
      <div
        style={{
          width: '52px',
          height: '52px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: bgColor,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {Icon && <Icon size={26} />}
      </div>
      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-navy)' }}>
          {value !== undefined ? value : 0}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          {label}
        </div>
        {subtext && (
          <div style={{ fontSize: '0.775rem', color: 'var(--accent-teal)', marginTop: '2px' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

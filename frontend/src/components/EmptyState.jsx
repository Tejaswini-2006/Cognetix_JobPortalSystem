import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon: Icon = Briefcase,
  title = 'No records found',
  description = 'There are currently no items matching your criteria.',
  actionText,
  actionLink,
  onActionClick,
}) => {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 1.5rem',
        background: 'white',
        border: '1px dashed var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        margin: '1.5rem 0',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'var(--bg-muted)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem',
          color: 'var(--text-muted)',
        }}
      >
        <Icon size={30} />
      </div>
      <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p
        style={{
          color: 'var(--text-muted)',
          maxWidth: '450px',
          margin: '0 auto 1.5rem',
          fontSize: '0.925rem',
        }}
      >
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary">
          {actionText} <ArrowRight size={16} />
        </Link>
      )}

      {actionText && onActionClick && !actionLink && (
        <button onClick={onActionClick} className="btn btn-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;

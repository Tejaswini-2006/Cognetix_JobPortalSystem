import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Building, ArrowUpRight } from 'lucide-react';
import StatusBadge from './StatusBadge';

const JobCard = ({ job, showStatus = false }) => {
  if (!job) return null;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        padding: '1.5rem',
        border: '1px solid var(--border-light)',
        position: 'relative',
      }}
    >
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '0.75rem',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent-teal)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {job.category}
            </span>
            <h3
              style={{
                fontSize: '1.25rem',
                marginTop: '0.2rem',
                color: 'var(--primary-navy)',
              }}
            >
              <Link
                to={`/jobs/${job._id}`}
                style={{ color: 'inherit', textDecoration: 'none' }}
              >
                {job.title}
              </Link>
            </h3>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginTop: '0.25rem',
              }}
            >
              <Building size={15} style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontWeight: 600 }}>{job.company}</span>
            </div>
          </div>

          {showStatus && <StatusBadge status={job.status} />}
        </div>

        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-secondary)',
            margin: '0.85rem 0 1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {job.description}
        </p>

        {/* Badges / Meta row */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '1.25rem',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPin size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>{job.location}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <DollarSign size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>{job.salaryRange}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>{job.employmentType}</span>
          </div>
        </div>

        {/* Required skills chips */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.4rem',
              marginBottom: '1.25rem',
            }}
          >
            {job.requiredSkills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                style={{
                  fontSize: '0.775rem',
                  padding: '0.2rem 0.55rem',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-light)',
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 4 && (
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.4rem',
                  color: 'var(--text-muted)',
                }}
              >
                +{job.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div
        style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {job.experienceLevel}
        </span>

        <Link
          to={`/jobs/${job._id}`}
          className="btn btn-secondary btn-sm"
          style={{ gap: '0.3rem' }}
        >
          View Details
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;

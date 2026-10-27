import React from 'react';
import { Search, MapPin, Briefcase, Filter, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Technology & IT',
  'Design & Creative',
  'Sales & Marketing',
  'Finance & Accounting',
  'Engineering',
  'Healthcare',
  'Customer Support',
  'Human Resources',
  'Product Management',
  'Other',
];

const EMPLOYMENT_TYPES = ['All', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

const EXPERIENCE_LEVELS = [
  'All',
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead / Manager',
  'Director / Executive',
];

const SearchFilterBar = ({ filters, onChange, onSearch, onReset }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <div
      className="card"
      style={{
        padding: '1.25rem',
        marginBottom: '2rem',
        background: 'white',
      }}
    >
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            alignItems: 'flex-end',
          }}
        >
          {/* Search Keywords */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <Search size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Keywords or Title
            </label>
            <input
              type="text"
              name="search"
              placeholder="e.g. React Developer, Designer..."
              value={filters.search || ''}
              onChange={(e) => onChange('search', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Location */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">
              <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Remote, New York, Austin..."
              value={filters.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              className="form-input"
            />
          </div>

          {/* Category */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Category</label>
            <select
              value={filters.category || 'All'}
              onChange={(e) => onChange('category', e.target.value)}
              className="form-select"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Employment Type */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Employment Type</label>
            <select
              value={filters.employmentType || 'All'}
              onChange={(e) => onChange('employmentType', e.target.value)}
              className="form-select"
            >
              {EMPLOYMENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Experience</label>
            <select
              value={filters.experienceLevel || 'All'}
              onChange={(e) => onChange('experienceLevel', e.target.value)}
              className="form-select"
            >
              {EXPERIENCE_LEVELS.map((exp) => (
                <option key={exp} value={exp}>
                  {exp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.25rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem' }}
            >
              <RotateCcw size={14} />
              Reset Filters
            </button>
          )}

          <button type="submit" className="btn btn-primary btn-sm" style={{ gap: '0.4rem' }}>
            <Filter size={14} />
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchFilterBar;

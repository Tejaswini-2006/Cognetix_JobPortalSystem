import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import SearchFilterBar from '../components/SearchFilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ErrorAlert from '../components/ErrorAlert';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const BrowseJobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'All',
    location: searchParams.get('location') || '',
    employmentType: searchParams.get('employmentType') || 'All',
    experienceLevel: searchParams.get('experienceLevel') || 'All',
    sort: 'newest',
    page: parseInt(searchParams.get('page') || '1', 10),
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    totalJobs: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchJobs = async () => {
    setLoading(true);
    setError('');

    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category && filters.category !== 'All')
        queryParams.append('category', filters.category);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.employmentType && filters.employmentType !== 'All')
        queryParams.append('employmentType', filters.employmentType);
      if (filters.experienceLevel && filters.experienceLevel !== 'All')
        queryParams.append('experienceLevel', filters.experienceLevel);
      if (filters.sort) queryParams.append('sort', filters.sort);
      queryParams.append('page', filters.page);
      queryParams.append('limit', '9');

      // Update URL query params without reloading
      setSearchParams(queryParams);

      const res = await api.get(`/jobs?${queryParams.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data);
        setPagination({
          totalJobs: res.data.totalJobs,
          totalPages: res.data.totalPages,
          currentPage: res.data.currentPage,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to load job listings. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters.page, filters.sort]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearchSubmit = () => {
    setFilters((prev) => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const handleResetFilters = () => {
    const resetState = {
      search: '',
      category: 'All',
      location: '',
      employmentType: 'All',
      experienceLevel: 'All',
      sort: 'newest',
      page: 1,
    };
    setFilters(resetState);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.4rem' }}>
            Explore Verified Jobs
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Showing{' '}
            <strong style={{ color: 'var(--primary-navy)' }}>
              {pagination.totalJobs}
            </strong>{' '}
            approved opportunities from verified employers
          </p>
        </div>

        {/* Filter Controls */}
        <SearchFilterBar
          filters={filters}
          onChange={handleFilterChange}
          onSearch={handleSearchSubmit}
          onReset={handleResetFilters}
        />

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* Results Header: Sort order */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Sort by:
            </label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="form-select"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <LoadingSpinner message="Searching job listings..." />
        ) : jobs.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching job listings"
            description="We couldn't find any approved jobs matching your filter parameters. Try clearing some criteria or searching for different keywords."
            actionText="Reset All Filters"
            onActionClick={handleResetFilters}
          />
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '3rem',
            }}
          >
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.3rem' }}
            >
              <ArrowLeft size={14} /> Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => handlePageChange(p)}
                className={`btn btn-sm ${
                  pagination.currentPage === p ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ minWidth: '36px' }}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.3rem' }}
            >
              Next <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseJobs;

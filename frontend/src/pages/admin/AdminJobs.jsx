import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Filter,
} from 'lucide-react';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (search.trim()) params.append('search', search.trim());
      params.append('limit', '50');

      const res = await api.get(`/admin/jobs?${params.toString()}`);
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve jobs for moderation.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleUpdateStatus = async (jobId, newStatus) => {
    setUpdatingId(jobId);
    setActionSuccess('');
    try {
      const res = await api.patch(`/admin/jobs/${jobId}/status`, { status: newStatus });
      if (res.data.success) {
        setActionSuccess(`Job status updated to "${newStatus}".`);
        setJobs((prev) =>
          prev.map((j) => (j._id === jobId ? { ...j, status: newStatus } : j))
        );
        setTimeout(() => setActionSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
            Job Requisition Moderation
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Review, approve, or reject job postings submitted by employers across the platform
          </p>
        </div>

        {actionSuccess && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1.25rem',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              borderRadius: 'var(--radius-sm)',
              color: '#065F46',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
            }}
          >
            <CheckCircle2 size={18} style={{ color: '#059669' }} />
            <span>{actionSuccess}</span>
          </div>
        )}

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* Filter Controls Bar */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['all', 'pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`btn btn-sm ${
                  statusFilter === tab ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab === 'all' ? 'All Requisitions' : tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Search title, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Jobs Table */}
        {loading ? (
          <LoadingSpinner message="Retrieving job postings for moderation..." />
        ) : jobs.length > 0 ? (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title & Requisition</th>
                    <th>Employer / Organization</th>
                    <th>Compensation & Type</th>
                    <th>Created On</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Moderation Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {job.category} &bull; {job.location}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{job.company}</div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {job.employer?.email || 'N/A'}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {job.salaryRange}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {job.employmentType}
                        </div>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <StatusBadge status={job.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            gap: '0.35rem',
                            alignItems: 'center',
                          }}
                        >
                          <Link
                            to={`/jobs/${job._id}`}
                            className="btn btn-secondary btn-sm"
                            title="Preview Job Specification"
                            style={{ padding: '0.35rem 0.55rem' }}
                          >
                            <Eye size={13} />
                          </Link>

                          {job.status !== 'approved' && (
                            <button
                              disabled={updatingId === job._id}
                              onClick={() => handleUpdateStatus(job._id, 'approved')}
                              className="btn btn-success btn-sm"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                            >
                              Approve
                            </button>
                          )}

                          {job.status !== 'rejected' && (
                            <button
                              disabled={updatingId === job._id}
                              onClick={() => handleUpdateStatus(job._id, 'rejected')}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                            >
                              Reject
                            </button>
                          )}

                          {job.status !== 'pending' && (
                            <button
                              disabled={updatingId === job._id}
                              onClick={() => handleUpdateStatus(job._id, 'pending')}
                              className="btn btn-secondary btn-sm"
                              title="Set Back to Pending"
                              style={{ padding: '0.35rem 0.65rem', fontSize: '0.775rem' }}
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No job requisitions found"
            description="There are currently no job postings matching the selected moderation filters."
          />
        )}
      </main>
    </div>
  );
};

export default AdminJobs;

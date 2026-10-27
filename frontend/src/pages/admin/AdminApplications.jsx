import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import {
  FileText,
  Building,
  CheckCircle2,
  Calendar,
  Eye,
  Filter,
} from 'lucide-react';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      params.append('limit', '50');

      const res = await api.get(`/admin/applications?${params.toString()}`);
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve applications audit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter]);

  const handleViewResume = async (appId) => {
    try {
      const res = await api.get(`/applications/${appId}/resume`, {
        responseType: 'blob',
      });
      const fileBlob = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert('Unable to load resume. Document might be missing or corrupted.');
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setUpdatingId(appId);
    setActionSuccess('');
    try {
      const res = await api.patch(`/admin/applications/${appId}/status`, {
        status: newStatus,
      });

      if (res.data.success) {
        setActionSuccess(`Application status updated to "${newStatus}".`);
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
        );
        setTimeout(() => setActionSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status.');
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
            Application Audit & Moderation
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Audit candidate applications submitted across all platform job postings
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

        {/* Status Filters */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          {['all', 'pending', 'reviewed', 'shortlisted', 'accepted', 'rejected'].map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`btn btn-sm ${
                  statusFilter === tab ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab === 'all' ? 'All Applications' : tab}
              </button>
            )
          )}
        </div>

        {/* Applications Table */}
        {loading ? (
          <LoadingSpinner message="Auditing platform applications..." />
        ) : applications.length > 0 ? (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Target Position</th>
                    <th>Date Applied</th>
                    <th>Resume PDF</th>
                    <th>Current Status</th>
                    <th style={{ textAlign: 'right' }}>Admin Status Override</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          {app.candidate?.name || 'Candidate'}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {app.candidate?.email}
                        </span>
                      </td>

                      <td>
                        <div>
                          {app.job ? (
                            <Link to={`/jobs/${app.job._id}`}>
                              <strong>{app.job.title}</strong>
                            </Link>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>Position Removed</span>
                          )}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.8rem',
                            color: 'var(--text-muted)',
                          }}
                        >
                          <Building size={12} />
                          <span>{app.job?.company || 'N/A'}</span>
                        </div>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        <button
                          onClick={() => handleViewResume(app._id)}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                        >
                          <FileText size={14} style={{ color: 'var(--accent-teal)' }} />
                          PDF Resume
                        </button>
                      </td>

                      <td>
                        <StatusBadge status={app.status} />
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <select
                          disabled={updatingId === app._id}
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                          className="form-select"
                          style={{
                            width: 'auto',
                            padding: '0.35rem 0.6rem',
                            fontSize: '0.8rem',
                            display: 'inline-block',
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No applications found"
            description="There are currently no candidate applications matching the selected criteria."
          />
        )}
      </main>
    </div>
  );
};

export default AdminApplications;

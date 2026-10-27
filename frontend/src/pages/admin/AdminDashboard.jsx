import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import {
  Users,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve administrative overview metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickJobStatus = async (jobId, status) => {
    try {
      const res = await api.patch(`/admin/jobs/${jobId}/status`, { status });
      if (res.data.success) {
        setActionSuccess(`Job status updated to "${status}".`);
        fetchStats();
        setTimeout(() => setActionSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job status.');
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner message="Calculating platform statistics..." />
        </main>
      </div>
    );
  }

  const { stats, recentJobs = [], recentApplications = [] } = data || {};

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'var(--accent-teal)',
              fontWeight: 700,
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '0.25rem',
            }}
          >
            <Shield size={16} /> Administrative Control Portal
          </div>
          <h1 style={{ fontSize: '1.85rem' }}>Platform Operations Overview</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Supervise platform activity, moderate employer job postings, and audit applications
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

        {/* Pending Moderation Banner */}
        {stats?.jobs?.pending > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1.25rem 1.5rem',
              backgroundColor: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: 'var(--radius-md)',
              color: '#92400E',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle size={24} style={{ color: '#D97706', flexShrink: 0 }} />
              <div>
                <strong>Requisitions Awaiting Moderation:</strong> You have{' '}
                <strong>{stats.jobs.pending}</strong> pending job posting(s) waiting for approval.
              </div>
            </div>
            <Link to="/admin/jobs" className="btn btn-primary btn-sm">
              Review Pending Jobs
            </Link>
          </div>
        )}

        {/* Metric Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <StatCard
            icon={Users}
            label="Total Registered Users"
            value={stats?.users?.total || 0}
            color="#0284C7"
            bgColor="#E0F2FE"
            subtext={`${stats?.users?.candidates || 0} Candidates &bull; ${stats?.users?.employers || 0} Employers`}
          />
          <StatCard
            icon={Briefcase}
            label="Total Job Requisitions"
            value={stats?.jobs?.total || 0}
            color="#0D9488"
            bgColor="#CCFBF1"
            subtext={`${stats?.jobs?.approved || 0} Approved &bull; ${stats?.jobs?.rejected || 0} Rejected`}
          />
          <StatCard
            icon={Clock}
            label="Jobs Pending Review"
            value={stats?.jobs?.pending || 0}
            color="#D97706"
            bgColor="#FEF3C7"
            subtext="Awaiting Administrator Action"
          />
          <StatCard
            icon={FileText}
            label="Candidate Applications"
            value={stats?.applications?.total || 0}
            color="#4338CA"
            bgColor="#E0E7FF"
            subtext={`${stats?.applications?.accepted || 0} Accepted Hires`}
          />
        </div>

        {/* Split Grid: Recent Jobs & Recent Applications */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {/* Recent Jobs */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem' }}>Recent Job Postings</h3>
              <Link
                to="/admin/jobs"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                All Jobs <ArrowRight size={14} />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Job & Employer</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Moderation</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr key={job._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          {job.title}
                        </strong>
                        <span style={{ color: 'var(--text-muted)' }}>{job.company}</span>
                      </td>
                      <td>
                        <StatusBadge status={job.status} />
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {job.status === 'pending' ? (
                          <div style={{ display: 'inline-flex', gap: '0.3rem' }}>
                            <button
                              onClick={() => handleQuickJobStatus(job._id, 'approved')}
                              className="btn btn-success btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleQuickJobStatus(job._id, 'rejected')}
                              className="btn btn-danger btn-sm"
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="card" style={{ padding: '1.75rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h3 style={{ fontSize: '1.2rem' }}>Recent Applications</h3>
              <Link
                to="/admin/applications"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                All Applications <ArrowRight size={14} />
              </Link>
            </div>

            <div className="table-responsive">
              <table className="table" style={{ fontSize: '0.85rem' }}>
                <thead>
                  <tr>
                    <th>Candidate</th>
                    <th>Job Position</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          {app.candidate?.name || 'Candidate'}
                        </strong>
                        <span style={{ color: 'var(--text-muted)' }}>{app.candidate?.email}</span>
                      </td>
                      <td>
                        <div>{app.job?.title || 'Unknown Job'}</div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {app.job?.company}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

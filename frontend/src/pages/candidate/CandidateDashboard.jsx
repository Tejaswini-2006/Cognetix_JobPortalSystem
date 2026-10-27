import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  FileText,
  Clock,
  Star,
  CheckCircle2,
  Briefcase,
  ArrowRight,
  User,
} from 'lucide-react';

const CandidateDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my-applications');
        if (res.data.success) {
          setApplications(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'pending').length;
  const shortlisted = applications.filter((a) => a.status === 'shortlisted').length;
  const accepted = applications.filter((a) => a.status === 'accepted').length;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Welcome Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
              Welcome, {user?.name}
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Candidate Dashboard — Track your applications and profile readiness
            </p>
          </div>

          <Link to="/jobs" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <Briefcase size={16} /> Browse New Jobs
          </Link>
        </div>

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
            icon={FileText}
            label="Total Submitted"
            value={total}
            color="#0284C7"
            bgColor="#E0F2FE"
          />
          <StatCard
            icon={Clock}
            label="Pending Review"
            value={pending}
            color="#D97706"
            bgColor="#FEF3C7"
          />
          <StatCard
            icon={Star}
            label="Shortlisted"
            value={shortlisted}
            color="#4338CA"
            bgColor="#E0E7FF"
          />
          <StatCard
            icon={CheckCircle2}
            label="Offers / Accepted"
            value={accepted}
            color="#059669"
            bgColor="#D1FAE5"
          />
        </div>

        {/* Recent Applications Section */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.25rem' }}>Recent Job Applications</h3>
            {total > 0 && (
              <Link
                to="/candidate/applications"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                View all ({total}) <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your applications..." />
          ) : applications.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title & Company</th>
                    <th>Employment Type</th>
                    <th>Submitted On</th>
                    <th>Application Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          {app.job?.title || 'Unknown Position'}
                        </strong>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {app.job?.company}
                        </span>
                      </td>
                      <td>{app.job?.employmentType || 'N/A'}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                      <td>
                        {app.job?._id && (
                          <Link
                            to={`/jobs/${app.job._id}`}
                            className="btn btn-secondary btn-sm"
                          >
                            Job Details
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No applications submitted yet"
              description="You haven't submitted any job applications yet. Browse open listings from verified employers and submit your PDF resume."
              actionText="Search Approved Jobs"
              actionLink="/jobs"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;

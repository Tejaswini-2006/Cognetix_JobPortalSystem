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
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Eye,
} from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployerJobs = async () => {
      try {
        const res = await api.get('/jobs/employer/my-jobs');
        if (res.data.success) {
          setJobs(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load employer jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployerJobs();
  }, []);

  const totalJobs = jobs.length;
  const approvedJobs = jobs.filter((j) => j.status === 'approved').length;
  const pendingJobs = jobs.filter((j) => j.status === 'pending').length;
  const totalApplicants = jobs.reduce((sum, j) => sum + (j.applicantCount || 0), 0);

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
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
              Employer Dashboard
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {user?.company || 'Organization'} &bull; Manage hiring requisitions and review applicants
            </p>
          </div>

          <Link to="/employer/create-job" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <PlusCircle size={16} /> Post a New Job
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
            icon={Briefcase}
            label="Total Job Postings"
            value={totalJobs}
            color="#0284C7"
            bgColor="#E0F2FE"
          />
          <StatCard
            icon={CheckCircle2}
            label="Active & Approved"
            value={approvedJobs}
            color="#059669"
            bgColor="#D1FAE5"
          />
          <StatCard
            icon={Clock}
            label="Pending Moderation"
            value={pendingJobs}
            color="#D97706"
            bgColor="#FEF3C7"
          />
          <StatCard
            icon={Users}
            label="Total Applicants"
            value={totalApplicants}
            color="#0D9488"
            bgColor="#CCFBF1"
          />
        </div>

        {/* Recent Jobs Table */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.25rem' }}>Recent Job Requisitions</h3>
            {totalJobs > 0 && (
              <Link
                to="/employer/jobs"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                View all ({totalJobs}) <ArrowRight size={14} />
              </Link>
            )}
          </div>

          {loading ? (
            <LoadingSpinner message="Loading your job requisitions..." />
          ) : jobs.length > 0 ? (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Applicants</th>
                    <th>Created On</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.slice(0, 5).map((job) => (
                    <tr key={job._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {job.location} &bull; {job.employmentType}
                        </span>
                      </td>
                      <td>{job.category}</td>
                      <td>
                        <StatusBadge status={job.status} />
                      </td>
                      <td>
                        <Link
                          to={`/employer/jobs/${job._id}/applicants`}
                          className="badge badge-reviewed"
                          style={{
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            gap: '0.3rem',
                            alignItems: 'center',
                          }}
                        >
                          <Users size={12} /> {job.applicantCount || 0} applicants
                        </Link>
                      </td>
                      <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link
                          to={`/employer/jobs/${job._id}/applicants`}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.3rem', fontSize: '0.8rem' }}
                        >
                          <Eye size={13} /> Review
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No job postings yet"
              description="You have not published any job opportunities. Post your first position to begin receiving applications from verified candidates."
              actionText="Post Your First Job"
              actionLink="/employer/create-job"
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployerDashboard;

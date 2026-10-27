import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ConfirmModal from '../../components/ConfirmModal';
import ErrorAlert from '../../components/ErrorAlert';
import {
  Briefcase,
  Users,
  Edit,
  Trash2,
  PlusCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react';

const MyJobs = () => {
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState(location.state?.successMessage || '');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/jobs/employer/my-jobs');
      if (res.data.success) {
        setJobs(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your job listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    if (location.state?.successMessage) {
      setTimeout(() => setSuccessMsg(''), 4500);
    }
  }, []);

  const openDeleteModal = (job) => {
    setJobToDelete(job);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;

    try {
      const res = await api.delete(`/jobs/${jobToDelete._id}`);
      if (res.data.success) {
        setSuccessMsg('Job posting and associated applications removed successfully.');
        setJobs((prev) => prev.filter((j) => j._id !== jobToDelete._id));
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job posting.');
    } finally {
      setDeleteModalOpen(false);
      setJobToDelete(null);
    }
  };

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
              My Job Listings
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage requisitions, check moderation status, and review candidate applications
            </p>
          </div>

          <Link to="/employer/create-job" className="btn btn-primary" style={{ gap: '0.4rem' }}>
            <PlusCircle size={16} /> Post New Job
          </Link>
        </div>

        {successMsg && (
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
            <span>{successMsg}</span>
          </div>
        )}

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSpinner message="Retrieving your job requisitions..." />
        ) : jobs.length > 0 ? (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title & Details</th>
                    <th>Category</th>
                    <th>Compensation</th>
                    <th>Moderation Status</th>
                    <th>Applicants</th>
                    <th>Created On</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
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
                          {job.location} &bull; {job.employmentType}
                        </span>
                      </td>

                      <td>{job.category}</td>

                      <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                        {job.salaryRange}
                      </td>

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
                            gap: '0.35rem',
                            alignItems: 'center',
                          }}
                        >
                          <Users size={12} /> {job.applicantCount || 0} Applicants
                        </Link>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        <div
                          style={{
                            display: 'inline-flex',
                            gap: '0.4rem',
                            alignItems: 'center',
                          }}
                        >
                          <Link
                            to={`/employer/jobs/${job._id}/applicants`}
                            className="btn btn-secondary btn-sm"
                            title="View Applicants"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Eye size={14} />
                          </Link>

                          <Link
                            to={`/employer/jobs/${job._id}/edit`}
                            className="btn btn-secondary btn-sm"
                            title="Edit Job Requisition"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Edit size={14} />
                          </Link>

                          <button
                            onClick={() => openDeleteModal(job)}
                            className="btn btn-outline-danger btn-sm"
                            title="Delete Job"
                            style={{ padding: '0.35rem 0.6rem' }}
                          >
                            <Trash2 size={14} />
                          </button>
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
            title="No job listings found"
            description="You have not posted any job listings yet. Create a requisition to start receiving candidate applications."
            actionText="Create Your First Job"
            actionLink="/employer/create-job"
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          isDanger={true}
          title="Delete Job Requisition"
          message={`Are you sure you want to permanently delete "${jobToDelete?.title}"? All submitted candidate applications for this position will also be deleted.`}
          confirmText="Yes, Delete Job"
          cancelText="Cancel"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default MyJobs;

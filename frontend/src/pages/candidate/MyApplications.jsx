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
  Calendar,
  ExternalLink,
  Download,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);

  const fetchApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/applications/my-applications');
      if (res.data.success) {
        setApplications(res.data.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load your submitted applications.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Securely download / open PDF resume with JWT authorization
  const handleViewResume = async (appId, fileName) => {
    setDownloadingId(appId);
    try {
      const res = await api.get(`/applications/${appId}/resume`, {
        responseType: 'blob',
      });
      const fileBlob = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert('Unable to load resume. Access may be restricted or the file is missing.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>My Applications</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Track the status, feedback, and submitted documents for all your job applications
          </p>
        </div>

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {loading ? (
          <LoadingSpinner message="Retrieving your submitted applications..." />
        ) : applications.length > 0 ? (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Job Title & Company</th>
                    <th>Compensation & Location</th>
                    <th>Date Applied</th>
                    <th>Status</th>
                    <th>Submitted Resume</th>
                    <th>Feedback / Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          {app.job ? (
                            <Link to={`/jobs/${app.job._id}`}>{app.job.title}</Link>
                          ) : (
                            'Position Closed'
                          )}
                        </strong>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.85rem',
                            color: 'var(--text-muted)',
                            marginTop: '2px',
                          }}
                        >
                          <Building size={13} />
                          <span>{app.job?.company || 'N/A'}</span>
                        </div>
                      </td>

                      <td>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                          {app.job?.salaryRange || 'Disclosed upon interview'}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {app.job?.location || 'Remote'} &bull; {app.job?.employmentType}
                        </div>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.875rem' }}>
                          {new Date(app.createdAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={app.status} />
                      </td>

                      <td>
                        <button
                          onClick={() =>
                            handleViewResume(app._id, app.resumeOriginalName || 'resume.pdf')
                          }
                          disabled={downloadingId === app._id}
                          className="btn btn-secondary btn-sm"
                          style={{ gap: '0.35rem', fontSize: '0.8rem' }}
                        >
                          <FileText size={14} style={{ color: 'var(--accent-teal)' }} />
                          {downloadingId === app._id ? 'Loading...' : 'View Resume'}
                        </button>
                      </td>

                      <td style={{ maxWidth: '240px' }}>
                        {app.feedback ? (
                          <div
                            style={{
                              fontSize: '0.825rem',
                              backgroundColor: '#EFF6FF',
                              padding: '0.45rem 0.65rem',
                              borderRadius: 'var(--radius-xs)',
                              color: '#1E40AF',
                              border: '1px solid #BFDBFE',
                            }}
                          >
                            <MessageSquare
                              size={12}
                              style={{ display: 'inline', marginRight: '4px' }}
                            />
                            {app.feedback}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                            No feedback provided yet.
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No applications submitted"
            description="You have not submitted any applications yet. Explore approved job opportunities and take your career to the next level."
            actionText="Find Jobs Now"
            actionLink="/jobs"
          />
        )}
      </main>
    </div>
  );
};

export default MyApplications;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import {
  Users,
  FileText,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  ArrowLeft,
  CheckCircle2,
  MessageSquare,
  X,
  ExternalLink,
} from 'lucide-react';

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [jobInfo, setJobInfo] = useState({ title: '', company: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected Cover Letter modal
  const [selectedLetter, setSelectedLetter] = useState(null);

  // Status updating state
  const [updatingId, setUpdatingId] = useState(null);
  const [feedbackInputs, setFeedbackInputs] = useState({});

  const fetchApplicants = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/applications/job/${jobId}`);
      if (res.data.success) {
        setApplicants(res.data.data);
        setJobInfo({ title: res.data.jobTitle, company: res.data.company });

        // Initialize feedback inputs map
        const initialFeedbacks = {};
        res.data.data.forEach((app) => {
          initialFeedbacks[app._id] = app.feedback || '';
        });
        setFeedbackInputs(initialFeedbacks);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to retrieve applicants for this job requisition.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  // Securely view PDF resume with JWT
  const handleViewResume = async (appId) => {
    try {
      const res = await api.get(`/applications/${appId}/resume`, {
        responseType: 'blob',
      });
      const fileBlob = new Blob([res.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(fileBlob);
      window.open(fileURL, '_blank');
    } catch (err) {
      alert('Unable to load resume. Access restricted or document not found.');
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    setSuccessMsg('');
    try {
      const feedback = feedbackInputs[appId] || '';
      const res = await api.patch(`/applications/${appId}/status`, {
        status: newStatus,
        feedback,
      });

      if (res.data.success) {
        setSuccessMsg(`Candidate application marked as "${newStatus}".`);
        setApplicants((prev) =>
          prev.map((app) =>
            app._id === appId ? { ...app, status: newStatus, feedback } : app
          )
        );
        setTimeout(() => setSuccessMsg(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFeedbackChange = (appId, val) => {
    setFeedbackInputs((prev) => ({ ...prev, [appId]: val }));
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/employer/jobs')}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem', marginBottom: '1rem' }}
          >
            <ArrowLeft size={14} /> Back to My Job Listings
          </button>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
                Job Applicants
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Review candidates for{' '}
                <strong style={{ color: 'var(--primary-navy)' }}>
                  {jobInfo.title || 'Requisition'}
                </strong>{' '}
                ({applicants.length} total)
              </p>
            </div>

            <Link to={`/jobs/${jobId}`} className="btn btn-secondary btn-sm" style={{ gap: '0.4rem' }}>
              <ExternalLink size={14} /> View Public Job Page
            </Link>
          </div>
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
          <LoadingSpinner message="Loading candidates and resume metadata..." />
        ) : applicants.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {applicants.map((app) => (
              <div
                key={app._id}
                className="card"
                style={{
                  padding: '1.75rem',
                  borderLeft: `4px solid ${
                    app.status === 'accepted'
                      ? 'var(--status-approved-text)'
                      : app.status === 'shortlisted'
                      ? 'var(--status-shortlisted-text)'
                      : app.status === 'rejected'
                      ? 'var(--status-rejected-text)'
                      : 'var(--accent-teal)'
                  }`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '1.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '1.25rem',
                  }}
                >
                  {/* Candidate Primary Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.3rem', margin: 0, color: 'var(--primary-navy)' }}>
                        {app.candidate?.name || 'Candidate Name'}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-teal)', marginTop: '0.2rem' }}>
                      {app.candidate?.title || 'Professional Applicant'}
                    </div>

                    {/* Contact row */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.5rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Mail size={14} style={{ color: 'var(--text-muted)' }} />
                        <span>{app.candidate?.email}</span>
                      </div>
                      {app.candidate?.phone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Phone size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{app.candidate?.phone}</span>
                        </div>
                      )}
                      {app.candidate?.location && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
                          <span>{app.candidate?.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions & Resume */}
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => handleViewResume(app._id)}
                      className="btn btn-primary btn-sm"
                      style={{ gap: '0.35rem' }}
                    >
                      <FileText size={15} /> View Resume (PDF)
                    </button>

                    {app.coverLetter && (
                      <button
                        onClick={() =>
                          setSelectedLetter({
                            candidateName: app.candidate?.name,
                            text: app.coverLetter,
                          })
                        }
                        className="btn btn-secondary btn-sm"
                        style={{ gap: '0.35rem' }}
                      >
                        <MessageSquare size={15} /> Read Cover Letter
                      </button>
                    )}
                  </div>
                </div>

                {/* Candidate Skills */}
                {app.candidate?.skills && app.candidate.skills.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexWrap: 'wrap',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Skills:
                    </span>
                    {app.candidate.skills.map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '0.75rem',
                          backgroundColor: 'var(--bg-muted)',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 'var(--radius-xs)',
                          border: '1px solid var(--border-light)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Review & Status Updater Controls */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-muted)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '1rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  {/* Feedback Note input */}
                  <div style={{ flex: '2 1 280px' }}>
                    <input
                      type="text"
                      placeholder="Add hiring feedback note (e.g. Scheduled for technical interview on Friday)..."
                      value={feedbackInputs[app._id] || ''}
                      onChange={(e) => handleFeedbackChange(app._id, e.target.value)}
                      className="form-input"
                      style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
                    />
                  </div>

                  {/* Status Buttons */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Update Status:
                    </span>

                    <button
                      disabled={updatingId === app._id}
                      onClick={() => handleStatusChange(app._id, 'reviewed')}
                      className={`btn btn-sm ${
                        app.status === 'reviewed' ? 'btn-primary' : 'btn-secondary'
                      }`}
                      style={{ fontSize: '0.775rem' }}
                    >
                      Reviewed
                    </button>

                    <button
                      disabled={updatingId === app._id}
                      onClick={() => handleStatusChange(app._id, 'shortlisted')}
                      className={`btn btn-sm ${
                        app.status === 'shortlisted' ? 'btn-primary' : 'btn-secondary'
                      }`}
                      style={{ fontSize: '0.775rem' }}
                    >
                      Shortlist
                    </button>

                    <button
                      disabled={updatingId === app._id}
                      onClick={() => handleStatusChange(app._id, 'accepted')}
                      className={`btn btn-sm ${
                        app.status === 'accepted' ? 'btn-success' : 'btn-secondary'
                      }`}
                      style={{ fontSize: '0.775rem' }}
                    >
                      Accept
                    </button>

                    <button
                      disabled={updatingId === app._id}
                      onClick={() => handleStatusChange(app._id, 'rejected')}
                      className={`btn btn-sm ${
                        app.status === 'rejected' ? 'btn-danger' : 'btn-secondary'
                      }`}
                      style={{ fontSize: '0.775rem' }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No applicants yet"
            description="No candidates have applied to this job posting yet. Ensure your job requirements and salary range are attractive to applicants."
          />
        )}

        {/* Cover Letter Modal */}
        {selectedLetter && (
          <div className="modal-overlay" onClick={() => setSelectedLetter(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--border-light)',
                  paddingBottom: '0.75rem',
                }}
              >
                <h3 style={{ fontSize: '1.25rem', margin: 0 }}>
                  Cover Letter &bull; {selectedLetter.candidateName}
                </h3>
                <button
                  onClick={() => setSelectedLetter(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div
                style={{
                  whiteSpace: 'pre-line',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)',
                  padding: '1rem 0',
                }}
              >
                {selectedLetter.text}
              </div>

              <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedLetter(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobApplicants;

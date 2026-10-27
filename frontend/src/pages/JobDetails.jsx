import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import {
  Building,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  Briefcase,
  Send,
  Upload,
  CheckCircle2,
  ArrowLeft,
  X,
  FileCheck,
  AlertTriangle,
  Users,
} from 'lucide-react';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isCandidate, isEmployer, isAdmin } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  // Application Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success) {
          setJob(res.data.data);
          setHasApplied(res.data.hasApplied || false);
          setApplicationStatus(res.data.applicationStatus || null);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            'Could not retrieve job posting details or this position is inactive.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSubmitError('');

    if (!file) {
      setResumeFile(null);
      return;
    }

    // Validation: PDF only
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setSubmitError('Invalid file format. Please upload your resume in PDF format only.');
      setResumeFile(null);
      return;
    }

    // Validation: File size <= 5MB
    if (file.size > 5 * 1024 * 1024) {
      setSubmitError('File is too large. Resume must be less than 5MB.');
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setSubmitError('Please attach your PDF resume.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      if (coverLetter.trim()) {
        formData.append('coverLetter', coverLetter.trim());
      }

      const res = await api.post(`/applications/${job._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSubmitSuccess(true);
        setHasApplied(true);
        setApplicationStatus('pending');
        setTimeout(() => {
          setModalOpen(false);
          setSubmitSuccess(false);
        }, 1800);
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Failed to submit application. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullPage message="Loading job posting specifications..." />;
  }

  if (error || !job) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <ErrorAlert message={error || 'Job not found'} />
        <Link to="/jobs" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Return to Job Listings
        </Link>
      </div>
    );
  }

  const isOwnerEmployer =
    isEmployer && job.employer && (job.employer._id === user?.id || job.employer === user?.id);

  return (
    <div style={{ padding: '2.5rem 0 4rem' }}>
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-secondary btn-sm"
            style={{ gap: '0.4rem' }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        </div>

        {/* Job Header Card */}
        <div
          className="card"
          style={{
            padding: '2.5rem',
            marginBottom: '2rem',
            borderTop: '4px solid var(--accent-teal)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1.5rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '0.5rem',
                }}
              >
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: 'var(--accent-teal)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {job.category}
                </span>
                <StatusBadge status={job.status} />
              </div>

              <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)', color: 'var(--primary-navy)' }}>
                {job.title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  marginTop: '0.5rem',
                  fontWeight: 600,
                }}
              >
                <Building size={18} style={{ color: 'var(--accent-teal)' }} />
                <span>{job.company}</span>
              </div>
            </div>

            {/* Application CTA Area */}
            <div>
              {isAuthenticated ? (
                isCandidate ? (
                  hasApplied ? (
                    <div
                      style={{
                        padding: '1rem 1.25rem',
                        backgroundColor: 'var(--bg-muted)',
                        borderRadius: 'var(--radius-sm)',
                        textAlign: 'center',
                        border: '1px solid var(--border-light)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          color: 'var(--status-approved-text)',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        <CheckCircle2 size={16} /> Application Submitted
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Status: <StatusBadge status={applicationStatus || 'pending'} />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setModalOpen(true)}
                      className="btn btn-primary btn-lg"
                      style={{ gap: '0.5rem' }}
                    >
                      <Send size={18} /> Apply for this Position
                    </button>
                  )
                ) : isOwnerEmployer ? (
                  <Link
                    to={`/employer/jobs/${job._id}/applicants`}
                    className="btn btn-primary btn-lg"
                    style={{ gap: '0.5rem' }}
                  >
                    <Users size={18} /> View Job Applicants
                  </Link>
                ) : isAdmin ? (
                  <Link to="/admin/jobs" className="btn btn-secondary">
                    Manage in Admin Portal
                  </Link>
                ) : null
              ) : (
                <Link
                  to="/login"
                  state={{ from: { pathname: `/jobs/${job._id}` } }}
                  className="btn btn-primary btn-lg"
                >
                  Sign In to Apply
                </Link>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1.25rem',
              marginTop: '2rem',
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--border-light)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--accent-teal-light)',
                  color: 'var(--accent-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MapPin size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  Location
                </span>
                <strong style={{ fontSize: '0.95rem' }}>{job.location}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--accent-blue-light)',
                  color: 'var(--accent-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DollarSign size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  Salary Range
                </span>
                <strong style={{ fontSize: '0.95rem' }}>{job.salaryRange}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#FEF3C7',
                  color: '#D97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Clock size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  Employment Type
                </span>
                <strong style={{ fontSize: '0.95rem' }}>{job.employmentType}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: '#E0E7FF',
                  color: '#4338CA',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Briefcase size={20} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  Experience Level
                </span>
                <strong style={{ fontSize: '0.95rem' }}>{job.experienceLevel}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Job Body & Sidebar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
          }}
        >
          {/* Main Description */}
          <div style={{ flex: '2 1 600px' }}>
            <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Position Overview</h3>
              <p style={{ whiteSpace: 'pre-line', lineHeight: 1.7, fontSize: '0.975rem' }}>
                {job.description}
              </p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                  Key Responsibilities
                </h3>
                <ul
                  style={{
                    paddingLeft: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {job.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>
                  Candidate Requirements
                </h3>
                <ul
                  style={{
                    paddingLeft: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem',
                    fontSize: '0.95rem',
                    color: 'var(--text-secondary)',
                  }}
                >
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column Specifications */}
          <div style={{ flex: '1 1 320px' }}>
            <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Required Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {job.requiredSkills?.map((skill, index) => (
                  <span
                    key={index}
                    style={{
                      padding: '0.35rem 0.75rem',
                      backgroundColor: 'var(--bg-muted)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-main)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem' }}>
              <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Posting Timeline</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>Posted On:</span>
                  <strong>{new Date(job.createdAt).toLocaleDateString()}</strong>
                </div>
                {job.applicationDeadline && (
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                      Application Deadline:
                    </span>
                    <strong style={{ color: '#DC2626' }}>
                      {new Date(job.applicationDeadline).toLocaleDateString()}
                    </strong>
                  </div>
                )}
                <div>
                  <span style={{ color: 'var(--text-muted)', display: 'block' }}>
                    Hiring Organization:
                  </span>
                  <strong>{job.company}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Submission Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.35rem' }}>Apply for Position</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  {job.title} at {job.company}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {submitSuccess ? (
              <div
                style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  backgroundColor: '#ECFDF5',
                  borderRadius: 'var(--radius-md)',
                  color: '#065F46',
                }}
              >
                <CheckCircle2 size={48} style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  Application Submitted!
                </h4>
                <p style={{ fontSize: '0.9rem' }}>
                  Your resume and cover letter have been sent to {job.company}. You can track this in
                  your candidate dashboard.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit}>
                {submitError && <ErrorAlert message={submitError} onClose={() => setSubmitError('')} />}

                {/* PDF Resume Upload */}
                <div className="form-group">
                  <label className="form-label">
                    Resume Document (PDF Only, Max 5MB) *
                  </label>
                  <div
                    style={{
                      border: '2px dashed var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.5rem',
                      textAlign: 'center',
                      backgroundColor: resumeFile ? 'var(--accent-teal-light)' : 'var(--bg-muted)',
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)',
                    }}
                    onClick={() => document.getElementById('resume-file-input').click()}
                  >
                    <input
                      id="resume-file-input"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                    {resumeFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-teal-hover)' }}>
                        <FileCheck size={24} />
                        <span style={{ fontWeight: 600 }}>{resumeFile.name}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                    ) : (
                      <div>
                        <Upload size={28} style={{ color: 'var(--accent-teal)', marginBottom: '0.5rem' }} />
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                          Click to select your PDF resume
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Accepts genuine PDF files up to 5MB
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="form-group">
                  <label className="form-label">Cover Letter / Note to Hiring Team</label>
                  <textarea
                    rows={5}
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Briefly introduce your qualifications, relevant projects, and interest in this role..."
                    className="form-textarea"
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.75rem',
                    marginTop: '1.5rem',
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || !resumeFile}
                    style={{ gap: '0.4rem' }}
                  >
                    {submitting ? 'Submitting Application...' : 'Send Application'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;

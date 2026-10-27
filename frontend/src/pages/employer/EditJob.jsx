import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { Save, ArrowLeft, ShieldAlert } from 'lucide-react';

const CATEGORIES = [
  'Technology & IT',
  'Design & Creative',
  'Sales & Marketing',
  'Finance & Accounting',
  'Engineering',
  'Healthcare',
  'Customer Support',
  'Human Resources',
  'Product Management',
  'Other',
];

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];

const EXPERIENCE_LEVELS = [
  'Entry Level',
  'Mid Level',
  'Senior Level',
  'Lead / Manager',
  'Director / Executive',
];

const EditJob = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    category: 'Technology & IT',
    location: '',
    employmentType: 'Full-time',
    salaryRange: '',
    experienceLevel: 'Mid Level',
    requiredSkills: '',
    description: '',
    responsibilities: '',
    requirements: '',
    applicationDeadline: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        if (res.data.success && res.data.data) {
          const j = res.data.data;

          // Verify ownership
          const employerId = j.employer?._id || j.employer;
          if (employerId.toString() !== user?.id && user?.role !== 'admin') {
            setError('Unauthorized: You can only edit job postings created by your account.');
            setLoading(false);
            return;
          }

          setFormData({
            title: j.title || '',
            company: j.company || '',
            category: j.category || 'Technology & IT',
            location: j.location || '',
            employmentType: j.employmentType || 'Full-time',
            salaryRange: j.salaryRange || '',
            experienceLevel: j.experienceLevel || 'Mid Level',
            requiredSkills: Array.isArray(j.requiredSkills) ? j.requiredSkills.join(', ') : '',
            description: j.description || '',
            responsibilities: Array.isArray(j.responsibilities) ? j.responsibilities.join('\n') : '',
            requirements: Array.isArray(j.requirements) ? j.requirements.join('\n') : '',
            applicationDeadline: j.applicationDeadline ? j.applicationDeadline.split('T')[0] : '',
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to retrieve job details.');
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await api.put(`/jobs/${id}`, {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      });

      if (res.data.success) {
        navigate('/employer/jobs', {
          state: {
            successMessage:
              'Job posting updated successfully! Modifications will be reviewed by an Administrator.',
          },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update job posting.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner message="Loading job posting details..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              onClick={() => navigate('/employer/jobs')}
              className="btn btn-secondary btn-sm"
              style={{ gap: '0.4rem', marginBottom: '1rem' }}
            >
              <ArrowLeft size={14} /> Back to My Listings
            </button>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Edit Job Posting</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Modify job requisitions and candidate specifications
            </p>
          </div>

          {error && <ErrorAlert message={error} onClose={() => setError('')} />}

          <div className="card" style={{ padding: '2.5rem' }}>
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    required
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hiring Company Name *</label>
                  <input
                    type="text"
                    required
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location *</label>
                  <input
                    type="text"
                    required
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Employment Type *</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {EMPLOYMENT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Salary Range *</label>
                  <input
                    type="text"
                    required
                    name="salaryRange"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Experience Level *</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="form-select"
                  >
                    {EXPERIENCE_LEVELS.map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Application Deadline</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Required Skills * (Comma-separated)</label>
                  <input
                    type="text"
                    required
                    name="requiredSkills"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Job Description *</label>
                  <textarea
                    rows={5}
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Key Responsibilities (One per line)</label>
                  <textarea
                    rows={4}
                    name="responsibilities"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Requirements (One per line)</label>
                  <textarea
                    rows={4}
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  marginTop: '2rem',
                  paddingTop: '1.5rem',
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate('/employer/jobs')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ gap: '0.4rem', minWidth: '160px' }}
                >
                  <Save size={16} />
                  {saving ? 'Saving Changes...' : 'Save Job Posting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditJob;

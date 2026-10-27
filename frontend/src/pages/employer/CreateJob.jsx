import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import ErrorAlert from '../../components/ErrorAlert';
import {
  Briefcase,
  Building,
  MapPin,
  DollarSign,
  Clock,
  Calendar,
  AlertCircle,
  PlusCircle,
  ShieldCheck,
} from 'lucide-react';

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

const CreateJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '',
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.company || !formData.description || !formData.salaryRange || !formData.location) {
      setError('Please fill in all mandatory job specification fields.');
      return;
    }

    if (!formData.requiredSkills.trim()) {
      setError('Please specify at least one required skill for candidates.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/jobs', {
        ...formData,
        requiredSkills: formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean),
        responsibilities: formData.responsibilities.split('\n').map((r) => r.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
      });

      if (res.data.success) {
        navigate('/employer/jobs', {
          state: {
            successMessage:
              'Job requisition created successfully! It is currently pending administrative review.',
          },
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to submit job posting. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
              Create Job Requisition
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Publish a new career opportunity to discover top applicants
            </p>
          </div>

          {/* Admin Moderation Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.85rem',
              padding: '1rem 1.25rem',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: 'var(--radius-sm)',
              color: '#1E40AF',
              marginBottom: '2rem',
              fontSize: '0.9rem',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={22} style={{ flexShrink: 0, marginTop: '2px', color: '#2563EB' }} />
            <div>
              <strong>Quality Assurance & Administrative Review:</strong> Newly posted jobs default to{' '}
              <span className="badge badge-pending" style={{ verticalAlign: 'middle' }}>
                Pending Review
              </span>{' '}
              and will appear in the public job board immediately upon platform administrator approval.
            </div>
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
                {/* Title */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    required
                    name="title"
                    placeholder="e.g. Senior Full Stack Engineer (MERN)"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Company Name */}
                <div className="form-group">
                  <label className="form-label">Hiring Company Name *</label>
                  <input
                    type="text"
                    required
                    name="company"
                    placeholder="e.g. CloudScale Technologies"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label">Job Category *</label>
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

                {/* Location */}
                <div className="form-group">
                  <label className="form-label">Location (or "Remote") *</label>
                  <input
                    type="text"
                    required
                    name="location"
                    placeholder="e.g. Remote, Austin, TX, or San Francisco, CA"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Employment Type */}
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

                {/* Salary Range */}
                <div className="form-group">
                  <label className="form-label">Salary Range *</label>
                  <input
                    type="text"
                    required
                    name="salaryRange"
                    placeholder="e.g. $110,000 - $135,000 / year"
                    value={formData.salaryRange}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Experience Level */}
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

                {/* Deadline */}
                <div className="form-group">
                  <label className="form-label">Application Deadline (Optional)</label>
                  <input
                    type="date"
                    name="applicationDeadline"
                    value={formData.applicationDeadline}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Required Skills */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    Required Skills * (Comma-separated)
                  </label>
                  <input
                    type="text"
                    required
                    name="requiredSkills"
                    placeholder="e.g. React.js, Node.js, Express, MongoDB, RESTful APIs, Git"
                    value={formData.requiredSkills}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {/* Description */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Job Description *</label>
                  <textarea
                    rows={5}
                    required
                    name="description"
                    placeholder="Detailed explanation of the job position, team mission, and projects..."
                    value={formData.description}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>

                {/* Responsibilities */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    Key Responsibilities (One item per line)
                  </label>
                  <textarea
                    rows={4}
                    name="responsibilities"
                    placeholder="Design and deliver scalable REST APIs&#10;Collaborate with product and UX design teams&#10;Maintain code quality and automated tests"
                    value={formData.responsibilities}
                    onChange={handleChange}
                    className="form-textarea"
                  />
                </div>

                {/* Requirements */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">
                    Candidate Requirements (One item per line)
                  </label>
                  <textarea
                    rows={4}
                    name="requirements"
                    placeholder="3+ years of professional software development experience&#10;Proficiency with modern JavaScript ES6+ and React&#10;Strong communication and problem-solving skills"
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
                  disabled={loading}
                  style={{ gap: '0.4rem', minWidth: '160px' }}
                >
                  <PlusCircle size={16} />
                  {loading ? 'Submitting...' : 'Submit Job Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateJob;

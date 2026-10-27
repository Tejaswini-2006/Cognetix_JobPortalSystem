import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorAlert from '../../components/ErrorAlert';
import { User, Mail, Phone, Briefcase, MapPin, CheckCircle2, Save } from 'lucide-react';

const CandidateProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    title: '',
    location: '',
    bio: '',
    skills: '',
    experienceYears: 0,
    company: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/me');
        if (res.data.success && res.data.data) {
          const u = res.data.data;
          setFormData({
            name: u.name || '',
            phone: u.phone || '',
            title: u.title || '',
            location: u.location || '',
            bio: u.bio || '',
            skills: Array.isArray(u.skills) ? u.skills.join(', ') : '',
            experienceYears: u.experienceYears || 0,
            company: u.company || '',
          });
        }
      } catch (err) {
        setErrorMsg('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.put('/users/me', formData);
      if (res.data.success) {
        setSuccessMsg('Profile updated successfully!');
        updateUser(res.data.data);
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <LoadingSpinner message="Loading profile details..." />
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>Profile Settings</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Manage your personal information, experience, and key skills visible to hiring teams
            </p>
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

          {errorMsg && <ErrorAlert message={errorMsg} onClose={() => setErrorMsg('')} />}

          <div className="card" style={{ padding: '2rem' }}>
            <form onSubmit={handleSubmit}>
              {/* Account Meta Box */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  padding: '1.25rem',
                  backgroundColor: 'var(--bg-muted)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem',
                }}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-teal)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                  }}
                >
                  {formData.name.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{formData.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {user?.email}
                  </div>
                  <span
                    className="badge badge-reviewed"
                    style={{ marginTop: '0.35rem', textTransform: 'uppercase' }}
                  >
                    Role: {user?.role}
                  </span>
                </div>
              </div>

              {/* Form Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Headline / Desired Job Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Location / City</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Austin, TX or Remote"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                {user?.role === 'employer' && (
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Years of Experience</label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              </div>

              {/* Skills */}
              <div className="form-group" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">
                  Skills & Core Competencies (Comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  placeholder="e.g. React.js, Node.js, MongoDB, TypeScript, Docker"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-input"
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Employers can match your profile against job requirements using these keywords.
                </span>
              </div>

              {/* Bio */}
              <div className="form-group">
                <label className="form-label">Professional Summary / Bio</label>
                <textarea
                  rows={4}
                  name="bio"
                  placeholder="Summarize your professional experience, notable achievements, and what you bring to potential employers..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="form-textarea"
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '1.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-light)',
                }}
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ gap: '0.4rem', minWidth: '150px' }}
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CandidateProfile;

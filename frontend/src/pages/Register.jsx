import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import { Briefcase, User, Building, Lock, Mail, Phone, ArrowRight, ShieldAlert } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('candidate'); // 'candidate' or 'employer'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please provide your name, email, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (role === 'employer' && !company.trim()) {
      setError('Please provide your company or organization name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await register({
        name,
        email,
        password,
        role,
        phone,
        company,
        title,
      });

      if (data.user.role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Registration failed. Please check your information.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '3rem 1rem 5rem',
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      <div
        className="card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '4px solid var(--accent-teal)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Create Account</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Join CareerConnect to discover jobs or hire top candidates
          </p>

          {/* Role Selection Toggle */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              backgroundColor: 'var(--bg-muted)',
              padding: '0.35rem',
              borderRadius: 'var(--radius-sm)',
              marginTop: '1.5rem',
            }}
          >
            <button
              type="button"
              onClick={() => setRole('candidate')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.65rem',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: role === 'candidate' ? 'white' : 'transparent',
                color: role === 'candidate' ? 'var(--primary-navy)' : 'var(--text-muted)',
                boxShadow: role === 'candidate' ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition-fast)',
              }}
            >
              <User size={16} /> Candidate
            </button>

            <button
              type="button"
              onClick={() => setRole('employer')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                padding: '0.65rem',
                border: 'none',
                borderRadius: 'var(--radius-xs)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                backgroundColor: role === 'employer' ? 'white' : 'transparent',
                color: role === 'employer' ? 'var(--primary-navy)' : 'var(--text-muted)',
                boxShadow: role === 'employer' ? 'var(--shadow-sm)' : 'none',
                transition: 'var(--transition-fast)',
              }}
            >
              <Building size={16} /> Employer / Recruiter
            </button>
          </div>
        </div>

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                required
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <User
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password * (Min 6 characters)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          {/* Role-Specific Fields */}
          {role === 'employer' ? (
            <div className="form-group">
              <label className="form-label">Hiring Company Name *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. CloudScale Technologies"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Building
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">Desired Job Title / Headline</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="e.g. Full Stack Developer, Product Designer..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                />
                <Briefcase
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-muted)',
                  }}
                />
              </div>
            </div>
          )}

          {/* Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              <Phone
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.75rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : `Register as ${role === 'employer' ? 'Employer' : 'Candidate'}`}
            <ArrowRight size={16} />
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--accent-teal)' }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

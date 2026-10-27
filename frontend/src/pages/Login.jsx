import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';
import { Briefcase, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      const role = data.user.role;

      if (from) {
        navigate(from, { replace: true });
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else if (role === 'employer') {
        navigate('/employer/dashboard');
      } else {
        navigate('/candidate/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div
      style={{
        padding: '3.5rem 1rem 5rem',
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
          maxWidth: '460px',
          width: '100%',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          borderTop: '4px solid var(--accent-teal)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--accent-teal), #0284C7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              margin: '0 auto 1rem',
            }}
          >
            <Briefcase size={24} />
          </div>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>
            Sign in to access your CareerConnect dashboard
          </p>
        </div>

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="name@company.com"
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

          <div className="form-group">
            <label className="form-label">Password</label>
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

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.8rem', fontSize: '1rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Demo Fast-Login Helpers */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-light)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              marginBottom: '0.75rem',
              fontWeight: 600,
            }}
          >
            <Sparkles size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>ONE-CLICK DEMO ACCOUNTS</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('alex.rivera@example.com', 'CandidatePassword@123')}
              title="Alex Rivera - Full Stack Candidate"
            >
              Candidate
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('sarah@cloudscale.io', 'EmployerPassword@123')}
              title="Sarah Jenkins - CloudScale Employer"
            >
              Employer
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoFill('admin@careerconnect.com', 'AdminPassword@123')}
              title="System Administrator"
            >
              Admin
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
          <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent-teal)' }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage message="Verifying session credentials..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: '500px',
            margin: '0 auto',
            background: 'white',
            padding: '2.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}
          >
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Access Restricted</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '0.95rem' }}>
            This page is restricted to users with the <strong>[{allowedRoles.join(', ')}]</strong> role.
            Your current logged-in role is <strong>{user.role}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-secondary">
              Go Home
            </Link>
            <Link
              to={
                user.role === 'admin'
                  ? '/admin/dashboard'
                  : user.role === 'employer'
                  ? '/employer/dashboard'
                  : '/candidate/dashboard'
              }
              className="btn btn-primary"
            >
              Go to Your Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

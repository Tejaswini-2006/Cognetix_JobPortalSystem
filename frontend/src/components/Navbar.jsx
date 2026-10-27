import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Shield,
  LayoutDashboard,
  FileText,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isCandidate, isEmployer, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        backgroundColor: 'var(--primary-navy)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Brand Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            textDecoration: 'none',
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, var(--accent-teal), #0284C7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 2px 8px rgba(13, 148, 136, 0.3)',
            }}
          >
            <Briefcase size={22} />
          </div>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.25rem',
                fontWeight: 800,
                color: 'white',
                letterSpacing: '-0.02em',
                display: 'block',
                lineHeight: 1.1,
              }}
            >
              Career<span style={{ color: 'var(--accent-teal)' }}>Connect</span>
            </span>
            <span
              style={{
                fontSize: '0.65rem',
                color: 'rgba(255, 255, 255, 0.65)',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Discover Opportunities
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          <Link
            to="/"
            style={{
              color: isActive('/') ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.8)',
              fontWeight: 600,
              fontSize: '0.925rem',
              transition: 'color var(--transition-fast)',
            }}
          >
            Home
          </Link>

          <Link
            to="/jobs"
            style={{
              color: isActive('/jobs') ? 'var(--accent-teal)' : 'rgba(255, 255, 255, 0.8)',
              fontWeight: 600,
              fontSize: '0.925rem',
              transition: 'color var(--transition-fast)',
            }}
          >
            Browse Jobs
          </Link>

          {/* Role-specific Nav Items */}
          {isAuthenticated && isCandidate && (
            <>
              <Link
                to="/candidate/dashboard"
                style={{
                  color: isActive('/candidate/dashboard')
                    ? 'var(--accent-teal)'
                    : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/candidate/applications"
                style={{
                  color: isActive('/candidate/applications')
                    ? 'var(--accent-teal)'
                    : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                }}
              >
                My Applications
              </Link>
            </>
          )}

          {isAuthenticated && isEmployer && (
            <>
              <Link
                to="/employer/dashboard"
                style={{
                  color: isActive('/employer/dashboard')
                    ? 'var(--accent-teal)'
                    : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                }}
              >
                Dashboard
              </Link>
              <Link
                to="/employer/jobs"
                style={{
                  color: isActive('/employer/jobs')
                    ? 'var(--accent-teal)'
                    : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                }}
              >
                My Listings
              </Link>
              <Link
                to="/employer/create-job"
                className="btn btn-primary btn-sm"
                style={{ gap: '0.35rem' }}
              >
                <PlusCircle size={15} />
                Post a Job
              </Link>
            </>
          )}

          {isAuthenticated && isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                style={{
                  color: isActive('/admin/dashboard')
                    ? 'var(--accent-teal)'
                    : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Shield size={16} />
                Admin Overview
              </Link>
              <Link
                to="/admin/jobs"
                style={{
                  color: isActive('/admin/jobs')
                    ? 'var(--accent-teal)'
                    : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                }}
              >
                Jobs Review
              </Link>
              <Link
                to="/admin/applications"
                style={{
                  color: isActive('/admin/applications')
                    ? 'var(--accent-teal)'
                    : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: 600,
                  fontSize: '0.925rem',
                }}
              >
                Applications
              </Link>
            </>
          )}

          {/* User Auth Info / Buttons */}
          <div
            style={{
              marginLeft: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              borderLeft: '1px solid rgba(255, 255, 255, 0.15)',
              paddingLeft: '1.25rem',
            }}
          >
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    isCandidate
                      ? '/candidate/profile'
                      : isEmployer
                      ? '/employer/dashboard'
                      : '/admin/dashboard'
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    textDecoration: 'none',
                    color: 'white',
                  }}
                >
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--navy-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-teal)',
                      fontWeight: 700,
                      fontSize: '0.875rem',
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                  </div>
                  <div style={{ lineHeight: 1.2 }}>
                    <div
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        maxWidth: '130px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {user?.name}
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        color: 'var(--accent-teal)',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                      }}
                    >
                      {user?.role}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    gap: '0.35rem',
                  }}
                  title="Log out of CareerConnect"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontWeight: 600,
                    fontSize: '0.925rem',
                  }}
                >
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '0.5rem',
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: 'var(--secondary-navy)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'white', fontWeight: 600 }}
          >
            Home
          </Link>
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            style={{ color: 'white', fontWeight: 600 }}
          >
            Browse Jobs
          </Link>

          {isAuthenticated ? (
            <>
              {isCandidate && (
                <>
                  <Link
                    to="/candidate/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    Candidate Dashboard
                  </Link>
                  <Link
                    to="/candidate/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/candidate/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    My Profile
                  </Link>
                </>
              )}

              {isEmployer && (
                <>
                  <Link
                    to="/employer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    Employer Dashboard
                  </Link>
                  <Link
                    to="/employer/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    My Job Listings
                  </Link>
                  <Link
                    to="/employer/create-job"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'var(--accent-teal)', fontWeight: 600 }}
                  >
                    + Post a New Job
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    Admin Dashboard
                  </Link>
                  <Link
                    to="/admin/jobs"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    Job Approvals
                  </Link>
                  <Link
                    to="/admin/applications"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    Applications Audit
                  </Link>
                  <Link
                    to="/admin/users"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ color: 'white' }}
                  >
                    User Management
                  </Link>
                </>
              )}

              <div
                style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ color: 'white', fontSize: '0.9rem' }}>
                  {user?.name} ({user?.role})
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary btn-sm"
                  style={{ color: '#DC2626' }}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                paddingTop: '1rem',
              }}
            >
              <Link
                to="/login"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Responsive CSS for desktop vs mobile nav */}
      <style>{`
        .desktop-nav {
          display: flex;
        }
        .mobile-toggle {
          display: none;
        }
        @media (max-width: 860px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;

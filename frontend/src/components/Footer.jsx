import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Heart, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--primary-navy)',
        color: 'white',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Info */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                marginBottom: '1rem',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--accent-teal)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <Briefcase size={18} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'white',
                }}
              >
                Career<span style={{ color: 'var(--accent-teal)' }}>Connect</span>
              </span>
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                marginBottom: '1rem',
              }}
            >
              Discover Opportunities. Build Your Future. A full-stack recruitment platform
              connecting skilled professionals with leading enterprises.
            </p>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.8rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                color: 'var(--accent-teal-light)',
              }}
            >
              <span>Cognetix Technology Internship — Task 5</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              style={{
                color: 'white',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '1.2rem',
              }}
            >
              For Candidates
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.9rem',
              }}
            >
              <li>
                <Link to="/jobs" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Browse All Jobs
                </Link>
              </li>
              <li>
                <Link to="/candidate/dashboard" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link to="/candidate/applications" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Track Applications
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Create Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4
              style={{
                color: 'white',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '1.2rem',
              }}
            >
              For Employers
            </h4>
            <ul
              style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                fontSize: '0.9rem',
              }}
            >
              <li>
                <Link to="/employer/create-job" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Post a Job Opportunity
                </Link>
              </li>
              <li>
                <Link to="/employer/jobs" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Manage Active Listings
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Review Candidate Applications
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                  Register Company Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Repos */}
          <div>
            <h4
              style={{
                color: 'white',
                fontSize: '1rem',
                fontWeight: 700,
                marginBottom: '1.2rem',
              }}
            >
              Project Details
            </h4>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '0.875rem',
                marginBottom: '1rem',
              }}
            >
              Built with React, Node.js, Express, MongoDB, and Multer for PDF resume handling.
            </p>
            <a
              href="https://github.com/Tejaswini-2006/Cognetix_JobPortalSystem"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                gap: '0.5rem',
              }}
            >
              <Github size={16} />
              View on GitHub
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.85rem',
            color: 'rgba(255, 255, 255, 0.6)',
            gap: '1rem',
          }}
        >
          <div>
            &copy; {new Date().getFullYear()} CareerConnect. All rights reserved. Cognetix Internship
            Task 5.
          </div>
          <div>
            Developed by <strong>Tejaswini Rakhunde</strong>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

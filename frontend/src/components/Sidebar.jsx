import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  User,
  PlusCircle,
  Users,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';

const Sidebar = () => {
  const { user, isCandidate, isEmployer, isAdmin } = useAuth();

  const getLinks = () => {
    if (isCandidate) {
      return [
        { to: '/candidate/dashboard', label: 'Overview', icon: LayoutDashboard },
        { to: '/candidate/applications', label: 'My Applications', icon: FileText },
        { to: '/candidate/profile', label: 'Profile Settings', icon: User },
        { to: '/jobs', label: 'Browse Jobs', icon: Briefcase },
      ];
    }
    if (isEmployer) {
      return [
        { to: '/employer/dashboard', label: 'Employer Dashboard', icon: LayoutDashboard },
        { to: '/employer/jobs', label: 'My Job Listings', icon: Briefcase },
        { to: '/employer/create-job', label: 'Post New Job', icon: PlusCircle },
        { to: '/candidate/profile', label: 'Company Profile', icon: User },
      ];
    }
    if (isAdmin) {
      return [
        { to: '/admin/dashboard', label: 'Platform Metrics', icon: LayoutDashboard },
        { to: '/admin/jobs', label: 'Job Moderation', icon: Briefcase },
        { to: '/admin/applications', label: 'Applications Audit', icon: FileText },
        { to: '/admin/users', label: 'User Directory', icon: Users },
      ];
    }
    return [];
  };

  const links = getLinks();

  return (
    <aside className="dashboard-sidebar">
      <div style={{ marginBottom: '1.5rem', padding: '0 0.5rem' }}>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.05em' }}>
          Portal Navigation
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to.includes('dashboard')}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'none',
                color: isActive ? 'var(--accent-teal)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--accent-teal-light)' : 'transparent',
                transition: 'var(--transition-fast)',
              })}
            >
              <Icon size={18} />
              <span>{link.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;

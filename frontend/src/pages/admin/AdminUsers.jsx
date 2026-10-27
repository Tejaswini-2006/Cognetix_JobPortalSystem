import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ErrorAlert from '../../components/ErrorAlert';
import {
  Users,
  Search,
  UserCheck,
  UserX,
  Mail,
  Shield,
  Building,
  User,
  CheckCircle2,
} from 'lucide-react';

const AdminUsers = () => {
  const { user: currentAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (roleFilter !== 'all') params.append('role', roleFilter);
      if (search.trim()) params.append('search', search.trim());
      params.append('limit', '50');

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (user) => {
    if (user._id === currentAdmin?.id) {
      setError('Security Restriction: You cannot deactivate your own administrative account.');
      return;
    }

    setUpdatingId(user._id);
    setActionSuccess('');
    setError('');

    try {
      const res = await api.patch(`/admin/users/${user._id}/status`);
      if (res.data.success) {
        const nextState = !user.isActive;
        setActionSuccess(
          `User ${user.name} has been ${nextState ? 'activated' : 'deactivated'}.`
        );
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? { ...u, isActive: nextState } : u))
        );
        setTimeout(() => setActionSuccess(''), 3500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="dashboard-main">
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.25rem' }}>
            User Account Management
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Supervise registered candidates, hiring employers, and platform administrators
          </p>
        </div>

        {actionSuccess && (
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
            <span>{actionSuccess}</span>
          </div>
        )}

        {error && <ErrorAlert message={error} onClose={() => setError('')} />}

        {/* Filter Controls Bar */}
        <div
          className="card"
          style={{
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Role Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {['all', 'candidate', 'employer', 'admin'].map((tab) => (
              <button
                key={tab}
                onClick={() => setRoleFilter(tab)}
                className={`btn btn-sm ${
                  roleFilter === tab ? 'btn-primary' : 'btn-secondary'
                }`}
                style={{ textTransform: 'capitalize' }}
              >
                {tab === 'all' ? 'All Roles' : tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
          >
            <input
              type="text"
              placeholder="Search user name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input"
              style={{ width: '220px', padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
            />
            <button type="submit" className="btn btn-secondary btn-sm">
              <Search size={14} />
            </button>
          </form>
        </div>

        {/* Users Table */}
        {loading ? (
          <LoadingSpinner message="Loading registered platform accounts..." />
        ) : users.length > 0 ? (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>User / Full Name</th>
                    <th>Email Address</th>
                    <th>Account Role</th>
                    <th>Registered On</th>
                    <th>Account Status</th>
                    <th style={{ textAlign: 'right' }}>Security Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <strong style={{ display: 'block', color: 'var(--primary-navy)' }}>
                          {u.name}
                        </strong>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {u.role === 'employer' ? u.company || 'Employer' : u.title || 'Candidate'}
                        </span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.875rem' }}>{u.email}</span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            u.role === 'admin'
                              ? 'badge-shortlisted'
                              : u.role === 'employer'
                              ? 'badge-reviewed'
                              : 'badge-tag'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td style={{ fontSize: '0.85rem' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>

                      <td>
                        {u.isActive ? (
                          <span
                            className="badge badge-approved"
                            style={{ display: 'inline-flex', gap: '0.25rem' }}
                          >
                            <UserCheck size={12} /> Active
                          </span>
                        ) : (
                          <span
                            className="badge badge-rejected"
                            style={{ display: 'inline-flex', gap: '0.25rem' }}
                          >
                            <UserX size={12} /> Deactivated
                          </span>
                        )}
                      </td>

                      <td style={{ textAlign: 'right' }}>
                        {u._id === currentAdmin?.id ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            Current Admin (You)
                          </span>
                        ) : (
                          <button
                            disabled={updatingId === u._id}
                            onClick={() => handleToggleStatus(u)}
                            className={`btn btn-sm ${
                              u.isActive ? 'btn-outline-danger' : 'btn-success'
                            }`}
                            style={{ fontSize: '0.775rem', padding: '0.3rem 0.65rem' }}
                          >
                            {u.isActive ? 'Deactivate' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No users match the criteria"
            description="No accounts were found matching your current filter selection."
          />
        )}
      </main>
    </div>
  );
};

export default AdminUsers;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Navigation & Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import BrowseJobs from './pages/BrowseJobs';
import JobDetails from './pages/JobDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// Candidate Pages
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import CandidateProfile from './pages/candidate/CandidateProfile';
import MyApplications from './pages/candidate/MyApplications';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import CreateJob from './pages/employer/CreateJob';
import EditJob from './pages/employer/EditJob';
import MyJobs from './pages/employer/MyJobs';
import JobApplicants from './pages/employer/JobApplicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import AdminApplications from './pages/admin/AdminApplications';
import AdminUsers from './pages/admin/AdminUsers';

// 404 Fallback
const NotFound = () => (
  <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
    <h1 style={{ fontSize: '3rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
      404
    </h1>
    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
      The requested page could not be located on the CareerConnect platform.
    </p>
    <a href="/" className="btn btn-primary">
      Return to Home
    </a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/jobs" element={<BrowseJobs />} />
              <Route path="/jobs/:id" element={<JobDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Candidate Protected Routes */}
              <Route
                path="/candidate/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <CandidateDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/profile"
                element={
                  <ProtectedRoute allowedRoles={['candidate', 'employer', 'admin']}>
                    <CandidateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/candidate/applications"
                element={
                  <ProtectedRoute allowedRoles={['candidate']}>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />

              {/* Employer Protected Routes */}
              <Route
                path="/employer/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/create-job"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <CreateJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <MyJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={['employer']}>
                    <EditJob />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/employer/jobs/:jobId/applicants"
                element={
                  <ProtectedRoute allowedRoles={['employer', 'admin']}>
                    <JobApplicants />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/applications"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

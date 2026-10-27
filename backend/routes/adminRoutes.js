const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllJobs,
  updateJobStatus,
  getAllApplications,
  updateApplicationStatus,
  getAllUsers,
  toggleUserStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All admin routes strictly require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/jobs', getAllJobs);
router.patch('/jobs/:id/status', updateJobStatus);
router.get('/applications', getAllApplications);
router.patch('/applications/:id/status', updateApplicationStatus);
router.get('/users', getAllUsers);
router.patch('/users/:id/status', toggleUserStatus);

module.exports = router;

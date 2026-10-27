const express = require('express');
const router = express.Router();
const {
  getApprovedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public route to view all approved jobs
router.get('/', getApprovedJobs);

// Employer route to view all jobs they posted
router.get('/employer/my-jobs', protect, authorize('employer'), getEmployerJobs);

// Single job details
router.get('/:id', getJobById);

// Employer creates job (defaults to pending)
router.post('/', protect, authorize('employer'), createJob);

// Employer edits own job
router.put('/:id', protect, authorize('employer'), updateJob);

// Employer deletes own job
router.delete('/:id', protect, authorize('employer'), deleteJob);

module.exports = router;

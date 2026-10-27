const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getResumeFile,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadResume } = require('../middleware/uploadMiddleware');

// Candidate submits application with PDF resume
router.post(
  '/:jobId',
  protect,
  authorize('candidate'),
  uploadResume.single('resume'),
  applyForJob
);

// Candidate views all their applications
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);

// Employer views applicants for a job they posted
router.get('/job/:jobId', protect, authorize('employer', 'admin'), getJobApplications);

// Secure resume download/view (authorized candidate owner, job employer, or admin)
router.get('/:id/resume', protect, getResumeFile);

// Employer or admin updates application status
router.patch(
  '/:id/status',
  protect,
  authorize('employer', 'admin'),
  updateApplicationStatus
);

module.exports = router;

const Application = require('../models/Application');
const Job = require('../models/Job');
const path = require('path');
const fs = require('fs');
const { uploadDir } = require('../middleware/uploadMiddleware');

// @desc    Apply for an approved job position with PDF resume & cover letter
// @route   POST /api/applications/:jobId
// @access  Private (Candidate only)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // 1. Verify job exists
    const job = await Job.findById(jobId);
    if (!job) {
      // Remove uploaded file if job not found
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // 2. Verify job is approved
    if (job.status !== 'approved') {
      if (req.file) {
        fs.unlink(req.file.path, () => {});
      }
      return res.status(400).json({
        success: false,
        message:
          'Applications can only be submitted for approved and active job postings.',
      });
    }

    // 3. Verify PDF file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please attach a valid PDF resume to submit your application.',
      });
    }

    // 4. Verify candidate hasn't already applied
    const alreadyApplied = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });

    if (alreadyApplied) {
      // Clean up uploaded file
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this position.',
      });
    }

    // 5. Create application record
    const application = await Application.create({
      job: jobId,
      candidate: req.user._id,
      resume: req.file.filename,
      resumeOriginalName: req.file.originalname,
      resumeSize: req.file.size,
      coverLetter: coverLetter ? coverLetter.trim() : '',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! You can track its progress in your dashboard.',
      data: application,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    next(error);
  }
};

// @desc    Get all applications submitted by logged-in candidate
// @route   GET /api/applications/my-applications
// @access  Private (Candidate only)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ candidate: req.user._id })
      .populate({
        path: 'job',
        select: 'title company location employmentType salaryRange category status',
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job posting owned by logged-in employer
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer only)
const getJobApplications = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    // Check if job exists and belongs to employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    if (job.employer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view applications for your own job postings.',
      });
    }

    const applications = await Application.find({ job: jobId })
      .populate('candidate', 'name email phone title skills experienceYears location bio')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobTitle: job.title,
      company: job.company,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download or view candidate PDF resume securely
// @route   GET /api/applications/:id/resume
// @access  Private (Candidate owner, Employer owner of job, or Admin)
const getResumeFile = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Authorization verification
    const isCandidateOwner = application.candidate.toString() === req.user._id.toString();
    const isEmployerOwner =
      application.job && application.job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCandidateOwner && !isEmployerOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: You are not authorized to view this resume document.',
      });
    }

    // Sanitize filename to prevent directory traversal
    const safeFilename = path.basename(application.resume);
    const filePath = path.join(uploadDir, safeFilename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Resume file not found on server storage.',
      });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${application.resumeOriginalName || 'resume.pdf'}"`
    );

    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (error) {
    next(error);
  }
};

// @desc    Update application review status
// @route   PATCH /api/applications/:id/status
// @access  Private (Owning Employer or Admin)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Check ownership (employer owning the job or admin)
    const isEmployerOwner =
      application.job && application.job.employer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isEmployerOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          'Unauthorized: Only the hiring employer or an administrator can update application statuses.',
      });
    }

    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted values: ${validStatuses.join(', ')}`,
      });
    }

    if (status) application.status = status;
    if (feedback !== undefined) application.feedback = feedback.trim();
    application.reviewedBy = req.user._id;

    await application.save();

    res.status(200).json({
      success: true,
      message: `Application marked as ${application.status}`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getJobApplications,
  getResumeFile,
  updateApplicationStatus,
};

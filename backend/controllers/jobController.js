const Job = require('../models/Job');
const Application = require('../models/Application');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @desc    Get all approved jobs (public browse with search and filtering)
// @route   GET /api/jobs
// @access  Public
const getApprovedJobs = async (req, res, next) => {
  try {
    const {
      search,
      category,
      location,
      employmentType,
      experienceLevel,
      page = 1,
      limit = 10,
      sort = 'newest',
    } = req.query;

    const query = { status: 'approved' };

    // Search query across title, company, description, location
    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
        { requiredSkills: { $in: [searchRegex] } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (employmentType && employmentType !== 'All') {
      query.employmentType = employmentType;
    }

    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    if (location && location.trim()) {
      query.location = new RegExp(location.trim(), 'i');
    }

    // Sort order
    let sortOptions = { createdAt: -1 };
    if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(50, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const totalJobs = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name company email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const totalPages = Math.ceil(totalJobs / limitNum) || 1;

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages,
      currentPage: pageNum,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public (if approved) / Private (if pending/rejected, owning employer or admin)
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      'employer',
      'name company email phone'
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // If job is not approved, check if requester is owning employer or admin
    if (job.status !== 'approved') {
      let isAuthorized = false;

      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'careerconnect_dev_secret_key_987654321_jwt'
          );
          if (
            decoded.role === 'admin' ||
            (job.employer && job.employer._id.toString() === decoded.id)
          ) {
            isAuthorized = true;
          }
        } catch (err) {
          // Token invalid or expired
        }
      }

      if (!isAuthorized) {
        return res.status(403).json({
          success: false,
          message:
            'This job posting is currently under review or unavailable to the public.',
        });
      }
    }

    // If candidate token provided, check if candidate already applied
    let hasApplied = false;
    let applicationStatus = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'careerconnect_dev_secret_key_987654321_jwt'
        );
        const app = await Application.findOne({
          job: job._id,
          candidate: decoded.id,
        });
        if (app) {
          hasApplied = true;
          applicationStatus = app.status;
        }
      } catch (e) {
        // Ignored
      }
    }

    res.status(200).json({
      success: true,
      data: job,
      hasApplied,
      applicationStatus,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer only)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      description,
      location,
      employmentType,
      salaryRange,
      category,
      requiredSkills,
      experienceLevel,
      applicationDeadline,
      requirements,
      responsibilities,
    } = req.body;

    // Formatting skills if sent as string
    let parsedSkills = requiredSkills;
    if (typeof requiredSkills === 'string') {
      parsedSkills = requiredSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let parsedReqs = requirements;
    if (typeof requirements === 'string') {
      parsedReqs = requirements
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    let parsedResps = responsibilities;
    if (typeof responsibilities === 'string') {
      parsedResps = responsibilities
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    // Create job with status default 'pending'
    const newJob = await Job.create({
      title,
      company: company || req.user.company || 'Hiring Company',
      description,
      location,
      employmentType,
      salaryRange,
      category,
      requiredSkills: parsedSkills,
      experienceLevel,
      applicationDeadline: applicationDeadline || null,
      requirements: Array.isArray(parsedReqs) ? parsedReqs : [],
      responsibilities: Array.isArray(parsedResps) ? parsedResps : [],
      employer: req.user._id,
      status: 'pending', // Requires admin approval
    });

    res.status(201).json({
      success: true,
      message:
        'Job posted successfully! It is currently pending administrative review before appearing publicly.',
      data: newJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Employer only - must own the job)
const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Ownership check: Only owning employer can edit
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit job postings created by your account.',
      });
    }

    const {
      title,
      company,
      description,
      location,
      employmentType,
      salaryRange,
      category,
      requiredSkills,
      experienceLevel,
      applicationDeadline,
      requirements,
      responsibilities,
    } = req.body;

    if (title) job.title = title.trim();
    if (company) job.company = company.trim();
    if (description) job.description = description;
    if (location) job.location = location.trim();
    if (employmentType) job.employmentType = employmentType;
    if (salaryRange) job.salaryRange = salaryRange.trim();
    if (category) job.category = category;
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (applicationDeadline !== undefined)
      job.applicationDeadline = applicationDeadline;

    if (requiredSkills) {
      job.requiredSkills = Array.isArray(requiredSkills)
        ? requiredSkills
        : requiredSkills
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
    }

    if (requirements !== undefined) {
      job.requirements = Array.isArray(requirements)
        ? requirements
        : typeof requirements === 'string'
        ? requirements.split('\n').map((r) => r.trim()).filter(Boolean)
        : job.requirements;
    }

    if (responsibilities !== undefined) {
      job.responsibilities = Array.isArray(responsibilities)
        ? responsibilities
        : typeof responsibilities === 'string'
        ? responsibilities.split('\n').map((r) => r.trim()).filter(Boolean)
        : job.responsibilities;
    }

    // Reset status to pending review when modified
    job.status = 'pending';

    const updatedJob = await job.save();

    res.status(200).json({
      success: true,
      message: 'Job updated successfully and submitted for administrative re-approval.',
      data: updatedJob,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Employer only - must own the job)
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    // Ownership check
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete job postings created by your account.',
      });
    }

    // Remove job
    await Job.findByIdAndDelete(req.params.id);

    // Also remove associated applications
    await Application.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Job posting and associated applications removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs created by current employer with applicant counts
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer only)
const getEmployerJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({
      createdAt: -1,
    });

    // Populate applicant count for each job
    const jobsWithStats = await Promise.all(
      jobs.map(async (job) => {
        const applicantCount = await Application.countDocuments({
          job: job._id,
        });
        const jobObj = job.toObject();
        jobObj.applicantCount = applicantCount;
        return jobObj;
      })
    );

    res.status(200).json({
      success: true,
      count: jobsWithStats.length,
      data: jobsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getApprovedJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
};

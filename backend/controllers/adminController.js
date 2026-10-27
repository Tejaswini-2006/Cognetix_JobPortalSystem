const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get aggregate platform statistics for admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      candidatesCount,
      employersCount,
      totalJobs,
      pendingJobs,
      approvedJobs,
      rejectedJobs,
      totalApplications,
      pendingApplications,
      acceptedApplications,
      recentJobs,
      recentApplications,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'candidate' }),
      User.countDocuments({ role: 'employer' }),
      Job.countDocuments(),
      Job.countDocuments({ status: 'pending' }),
      Job.countDocuments({ status: 'approved' }),
      Job.countDocuments({ status: 'rejected' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'accepted' }),
      Job.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('employer', 'name company email'),
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('candidate', 'name email')
        .populate('job', 'title company'),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          candidates: candidatesCount,
          employers: employersCount,
        },
        jobs: {
          total: totalJobs,
          pending: pendingJobs,
          approved: approvedJobs,
          rejected: rejectedJobs,
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          accepted: acceptedApplications,
        },
      },
      recentJobs,
      recentApplications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs for admin moderation
// @route   GET /api/admin/jobs
// @access  Private (Admin only)
const getAllJobs = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { company: searchRegex },
        { location: searchRegex },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('employer', 'name email company phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve or reject a job posting
// @route   PATCH /api/admin/jobs/:id/status
// @access  Private (Admin only)
const updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'approved', 'rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted values: ${validStatuses.join(', ')}`,
      });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job posting not found',
      });
    }

    job.status = status;
    await job.save();

    res.status(200).json({
      success: true,
      message: `Job status updated to "${status}". ${
        status === 'approved'
          ? 'It is now visible in the public job board.'
          : 'It will not appear in the public board.'
      }`,
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications across platform for admin audit
// @route   GET /api/admin/applications
// @access  Private (Admin only)
const getAllApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await Application.countDocuments(query);
    const applications = await Application.find(query)
      .populate('candidate', 'name email phone title skills location')
      .populate('job', 'title company location employmentType salaryRange status')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status by admin
// @route   PATCH /api/admin/applications/:id/status
// @access  Private (Admin only)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    const validStatuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Permitted values: ${validStatuses.join(', ')}`,
      });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status = status;
    if (feedback !== undefined) application.feedback = feedback.trim();
    application.reviewedBy = req.user._id;
    await application.save();

    res.status(200).json({
      success: true,
      message: `Application status updated to "${status}"`,
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role && role !== 'all') {
      query.role = role;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { company: searchRegex }];
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active/inactive status
// @route   PATCH /api/admin/users/:id/status
// @access  Private (Admin only)
const toggleUserStatus = async (req, res, next) => {
  try {
    // Prevent admin from deactivating themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Security Restriction: You cannot deactivate your own administrative account.',
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'}.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllJobs,
  updateJobStatus,
  getAllApplications,
  updateApplicationStatus,
  getAllUsers,
  toggleUserStatus,
};

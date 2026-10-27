const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT token
const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email },
    process.env.JWT_SECRET || 'careerconnect_dev_secret_key_987654321_jwt',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

// @desc    Register a new user (Candidate or Employer)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, company, title } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Security check: Never permit self-registration as admin
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message:
          'Security Violation: Administrator accounts cannot be self-registered. Use initialization scripts.',
      });
    }

    const assignedRole = role === 'employer' ? 'employer' : 'candidate';

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
      phone: phone ? phone.trim() : '',
      company: company ? company.trim() : '',
      title: title ? title.trim() : '',
    });

    // Generate token
    const token = generateToken(user._id, user.role, user.email);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        title: user.title,
        skills: user.skills,
        experienceYears: user.experienceYears,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
    }

    // Check for user and include password field for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: No account found with this email',
      });
    }

    // Check account status
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been deactivated. Please contact support.',
      });
    }

    // Validate password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials: Password does not match',
      });
    }

    // Generate token
    const token = generateToken(user._id, user.role, user.email);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        company: user.company,
        title: user.title,
        skills: user.skills,
        experienceYears: user.experienceYears,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user info
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };

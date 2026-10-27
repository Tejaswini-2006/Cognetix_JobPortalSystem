const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
const getProfile = async (req, res, next) => {
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
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/me
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const {
      name,
      phone,
      bio,
      company,
      title,
      location,
      skills,
      experienceYears,
    } = req.body;

    // Security check: Never permit changing role or email through standard profile update
    if (req.body.role && req.body.role !== user.role) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Changing account role is not allowed.',
      });
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (company !== undefined) user.company = company.trim();
    if (title !== undefined) user.title = title.trim();
    if (location !== undefined) user.location = location.trim();
    if (skills !== undefined) {
      user.skills = Array.isArray(skills)
        ? skills.map((s) => s.trim()).filter(Boolean)
        : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : user.skills;
    }
    if (experienceYears !== undefined) {
      user.experienceYears = Number(experienceYears) || 0;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Prevents returning password hash by default
    },
    role: {
      type: String,
      enum: {
        values: ['candidate', 'employer', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'candidate',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    title: {
      type: String,
      trim: true,
      default: '', // Desired role for candidate or position for employer
    },
    company: {
      type: String,
      trim: true,
      default: '', // Primarily for employers
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: {
      type: Number,
      min: [0, 'Experience cannot be negative'],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare candidate password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to return user info safely without sensitive fields
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

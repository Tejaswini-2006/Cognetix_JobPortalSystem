const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a job title'],
      trim: true,
      maxlength: [120, 'Job title cannot exceed 120 characters'],
    },
    company: {
      type: String,
      required: [true, 'Please provide the hiring company name'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed job description'],
    },
    location: {
      type: String,
      required: [true, 'Please provide a job location or "Remote"'],
      trim: true,
    },
    employmentType: {
      type: String,
      required: [true, 'Please specify employment type'],
      enum: {
        values: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'],
        message: '{VALUE} is not a valid employment type',
      },
    },
    salaryRange: {
      type: String,
      required: [true, 'Please provide an estimated salary range (e.g. $70k - $90k/yr)'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please select a job category'],
      enum: {
        values: [
          'Technology & IT',
          'Design & Creative',
          'Sales & Marketing',
          'Finance & Accounting',
          'Engineering',
          'Healthcare',
          'Customer Support',
          'Human Resources',
          'Product Management',
          'Other',
        ],
        message: '{VALUE} is not a supported category',
      },
    },
    requiredSkills: {
      type: [String],
      required: [true, 'Please add at least one required skill'],
      validate: {
        validator: function (val) {
          return Array.isArray(val) && val.length > 0;
        },
        message: 'At least one skill is required',
      },
    },
    experienceLevel: {
      type: String,
      required: [true, 'Please select an experience level'],
      enum: {
        values: [
          'Entry Level',
          'Mid Level',
          'Senior Level',
          'Lead / Manager',
          'Director / Executive',
        ],
        message: '{VALUE} is not a valid experience level',
      },
    },
    employer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Job must be linked to an employer account'],
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: '{VALUE} is not a valid job status',
      },
      default: 'pending',
      index: true,
    },
    applicationDeadline: {
      type: Date,
    },
    requirements: {
      type: [String],
      default: [],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search queries
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  location: 'text',
  category: 'text',
});

// Single and compound filters
jobSchema.index({ status: 1, category: 1, createdAt: -1 });
jobSchema.index({ status: 1, employmentType: 1 });
jobSchema.index({ status: 1, experienceLevel: 1 });

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;

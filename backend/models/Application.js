const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Application must be linked to a job'],
      index: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Application must be linked to a candidate'],
      index: true,
    },
    resume: {
      type: String,
      required: [true, 'Please provide a PDF resume'],
    },
    resumeOriginalName: {
      type: String,
      default: 'resume.pdf',
    },
    resumeSize: {
      type: Number,
      default: 0,
    },
    coverLetter: {
      type: String,
      maxlength: [4000, 'Cover letter cannot exceed 4000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'reviewed', 'shortlisted', 'rejected', 'accepted'],
        message: '{VALUE} is not a valid application status',
      },
      default: 'pending',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    feedback: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index prevents a candidate from submitting duplicate applications to the same job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;

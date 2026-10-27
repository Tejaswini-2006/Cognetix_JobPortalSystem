const multer = require('multer');

// 404 Not Found handler
const notFound = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File size exceeds maximum permitted limit (5MB). Please upload a smaller file.';
    } else {
      message = `Upload error: ${err.message}`;
    }
  }

  // Handle Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with specified identifier format (${err.value})`;
  }

  // Handle Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    if (field === 'email') {
      message = 'An account with this email address already exists. Please log in or use another email.';
    } else if (field === 'job' || field === 'candidate') {
      message = 'You have already applied for this job position. Duplicate applications are not permitted.';
    } else {
      message = `Duplicate field value entered: ${field}. Please provide unique values.`;
    }
  }

  // Handle Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map((el) => el.message);
    message = errors.join('. ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };

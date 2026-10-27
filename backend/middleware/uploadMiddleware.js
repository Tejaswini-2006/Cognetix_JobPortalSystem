const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Ensure destination directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'resumes');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage with unique, sanitized filenames
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const randomHex = crypto.randomBytes(8).toString('hex');
    const safeFilename = `resume-${timestamp}-${randomHex}.pdf`;
    cb(null, safeFilename);
  },
});

// File filter to allow ONLY genuine PDF files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (ext === '.pdf' && mime === 'application/pdf') {
    cb(null, true);
  } else {
    cb(
      new Error('Invalid file format. Only PDF documents (.pdf) are accepted.'),
      false
    );
  }
};

const maxSizeBytes = (parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5) * 1024 * 1024;

const uploadResume = multer({
  storage: storage,
  limits: {
    fileSize: maxSizeBytes, // 5MB default limit
    files: 1,
  },
  fileFilter: fileFilter,
});

module.exports = { uploadResume, uploadDir };

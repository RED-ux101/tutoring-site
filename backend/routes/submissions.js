const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');
const auth = require('../middleware/auth');
const router = express.Router();

// Ensure submissions directory exists
const submissionsDir = path.join(__dirname, '../submissions');
if (!fs.existsSync(submissionsDir)) {
  fs.mkdirSync(submissionsDir, { recursive: true });
}

// Input validation middleware
const validateSubmissionInput = (req, res, next) => {
  const { studentName, studentEmail, description, category } = req.body;
  
  // Validate required fields
  if (!studentName || typeof studentName !== 'string' || studentName.trim() === '') {
    return res.status(400).json({ message: 'Student name is required' });
  }
  
  if (!studentEmail || typeof studentEmail !== 'string' || studentEmail.trim() === '') {
    return res.status(400).json({ message: 'Student email is required' });
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(studentEmail)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Sanitize inputs
  req.body.studentName = studentName.trim().substring(0, 100);
  req.body.studentEmail = studentEmail.trim().toLowerCase().substring(0, 100);
  req.body.description = description ? description.trim().substring(0, 500) : '';
  req.body.category = category ? category.trim().substring(0, 50) : 'other';
  
  next();
};

// Configure multer for student submissions with enhanced security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submissionsDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `submission-${timestamp}-${random}${ext}`;
    cb(null, safeName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1 // Only allow 1 file per request
  },
  fileFilter: (req, file, cb) => {
    // Enhanced file type validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    // Check MIME type
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only documents, PDFs, and images are allowed.'), false);
    }

    // Check file extension
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png', '.gif'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error('Invalid file extension.'), false);
    }

    // Additional security checks
    if (file.originalname.includes('..') || file.originalname.includes('/') || file.originalname.includes('\\')) {
      return cb(new Error('Invalid filename.'), false);
    }

    cb(null, true);
  }
});

// Submit a file from a student (no auth required)
router.post('/submit', validateSubmissionInput, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { studentName, studentEmail, description, category } = req.body;
    const { filename, originalname, size, mimetype } = req.file;
    const filePath = path.join('submissions', filename);

    // Validate file size
    if (size > 10 * 1024 * 1024) {
      // Remove uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }

    // Save submission info to database
    db.run(
      `INSERT INTO submissions 
       (student_name, student_email, filename, original_name, file_path, file_size, mime_type, description, category, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentName, studentEmail, filename, originalname, filePath, size, mimetype, description, category, 'pending'],
      function (err) {
        if (err) {
          // Remove uploaded file if database save fails
          fs.unlinkSync(req.file.path);
          return res.status(500).json({ message: 'Error saving submission info' });
        }

        res.status(201).json({
          message: 'Submission received successfully',
          submissionId: this.lastID
        });
      }
    );
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error during submission' });
  }
});

// Get all pending submissions (admin only)
router.get('/pending', auth, (req, res) => {
  db.all(
    'SELECT * FROM submissions WHERE status = ? ORDER BY submitted_at DESC',
    ['pending'],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      const submissions = rows.map(submission => ({
        id: submission.id,
        studentName: submission.student_name,
        studentEmail: submission.student_email,
        filename: submission.filename,
        originalName: submission.original_name,
        size: submission.file_size,
        mimeType: submission.mime_type,
        description: submission.description,
        category: submission.category,
        status: submission.status,
        submittedAt: submission.submitted_at
      }));

      res.json({ submissions });
    }
  );
});

// Get all submissions (admin only)
router.get('/all', auth, (req, res) => {
  db.all(
    'SELECT * FROM submissions ORDER BY submitted_at DESC',
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      const submissions = rows.map(submission => ({
        id: submission.id,
        studentName: submission.student_name,
        studentEmail: submission.student_email,
        filename: submission.filename,
        originalName: submission.original_name,
        size: submission.file_size,
        mimeType: submission.mime_type,
        description: submission.description,
        category: submission.category,
        status: submission.status,
        submittedAt: submission.submitted_at
      }));

      res.json({ submissions });
    }
  );
});

// Download submission file (admin only)
router.get('/download/:id', auth, (req, res) => {
  const submissionId = parseInt(req.params.id);
  
  if (isNaN(submissionId) || submissionId <= 0) {
    return res.status(400).json({ message: 'Invalid submission ID' });
  }

  db.get('SELECT * FROM submissions WHERE id = ?', [submissionId], (err, submission) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    const filePath = path.join(__dirname, '..', submission.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    // Set security headers
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.download(filePath, submission.original_name);
  });
});

// Approve submission and move to public files (admin only)
router.post('/approve/:id', auth, (req, res) => {
  const submissionId = parseInt(req.params.id);
  
  if (isNaN(submissionId) || submissionId <= 0) {
    return res.status(400).json({ message: 'Invalid submission ID' });
  }

  // Get submission details
  db.get('SELECT * FROM submissions WHERE id = ?', [submissionId], (err, submission) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission already processed' });
    }

    // Move file to public uploads directory
    const oldPath = path.join(__dirname, '..', submission.file_path);
    const newFilename = submission.filename.replace('submission-', '');
    const newPath = path.join(__dirname, '../uploads', newFilename);

    try {
      if (fs.existsSync(oldPath)) {
        fs.copyFileSync(oldPath, newPath);
        fs.unlinkSync(oldPath); // Delete from submissions folder
      }

      // Add to public files table
      db.run(
        'INSERT INTO files (tutor_id, filename, original_name, file_path, file_size, mime_type, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [req.tutor.id, newFilename, submission.original_name, path.join('uploads', newFilename), submission.file_size, submission.mime_type, submission.category],
        function (err) {
          if (err) {
            return res.status(500).json({ message: 'Error adding file to public collection' });
          }

          // Update submission status
          db.run(
            'UPDATE submissions SET status = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?',
            ['approved', submissionId],
            (err) => {
              if (err) {
                return res.status(500).json({ message: 'Error updating submission status' });
              }

              res.json({ message: 'Submission approved and added to public files' });
            }
          );
        }
      );
    } catch (error) {
      res.status(500).json({ message: 'Error processing file' });
    }
  });
});

// Reject submission (admin only)
router.post('/reject/:id', auth, (req, res) => {
  const submissionId = parseInt(req.params.id);
  const { reason } = req.body;
  
  if (isNaN(submissionId) || submissionId <= 0) {
    return res.status(400).json({ message: 'Invalid submission ID' });
  }

  // Sanitize reason
  const sanitizedReason = reason ? reason.trim().substring(0, 500) : 'No reason provided';

  // Get submission details
  db.get('SELECT * FROM submissions WHERE id = ?', [submissionId], (err, submission) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission already processed' });
    }

    // Delete the file
    const filePath = path.join(__dirname, '..', submission.file_path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Update submission status
    db.run(
      'UPDATE submissions SET status = ?, rejection_reason = ?, rejected_at = CURRENT_TIMESTAMP WHERE id = ?',
      ['rejected', sanitizedReason, submissionId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating submission status' });
        }

        res.json({ message: 'Submission rejected' });
      }
    );
  });
});

// Rename submission file (admin only)
router.put('/:id/rename', auth, (req, res) => {
  const submissionId = parseInt(req.params.id);
  const { newName } = req.body;

  if (isNaN(submissionId) || submissionId <= 0) {
    return res.status(400).json({ message: 'Invalid submission ID' });
  }

  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    return res.status(400).json({ message: 'New name is required' });
  }

  // Sanitize new name
  const sanitizedName = newName.trim().substring(0, 255);

  // Get submission details
  db.get('SELECT * FROM submissions WHERE id = ?', [submissionId], (err, submission) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update the original_name in database
    db.run(
      'UPDATE submissions SET original_name = ? WHERE id = ?',
      [sanitizedName, submissionId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error renaming submission' });
        }

        res.json({ 
          message: 'Submission renamed successfully',
          newName: sanitizedName
        });
      }
    );
  });
});

module.exports = router; 
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

// Configure multer for student submissions
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, submissionsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'submission-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common document types
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

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only documents, PDFs, and images are allowed.'));
    }
  }
});

// Submit a file from a student (no auth required)
router.post('/submit', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { studentName, studentEmail, description, category } = req.body;

    if (!studentName || !studentEmail) {
      return res.status(400).json({ message: 'Student name and email are required' });
    }

    const { filename, originalname, size, mimetype } = req.file;
    const filePath = path.join('submissions', filename);

    // Save submission info to database
    db.run(
      `INSERT INTO submissions 
       (student_name, student_email, filename, original_name, file_path, file_size, mime_type, description, category, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [studentName, studentEmail, filename, originalname, filePath, size, mimetype, description || '', category || 'other', 'pending'],
      function (err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error saving submission info' });
        }

        res.status(201).json({
          message: 'Submission received successfully',
          submissionId: this.lastID
        });
      }
    );
  } catch (error) {
    console.error('Submission error:', error);
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
  const submissionId = req.params.id;

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

    res.download(filePath, submission.original_name);
  });
});

// Approve submission and move to public files (admin only)
router.post('/approve/:id', auth, (req, res) => {
  const submissionId = req.params.id;

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
        'INSERT INTO files (tutor_id, filename, original_name, file_path, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)',
        [req.tutor.id, newFilename, submission.original_name, path.join('uploads', newFilename), submission.file_size, submission.mime_type],
        function (err) {
          if (err) {
            console.error('Error adding to files:', err);
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
      console.error('File operation error:', error);
      res.status(500).json({ message: 'Error processing file' });
    }
  });
});

// Reject submission (admin only)
router.post('/reject/:id', auth, (req, res) => {
  const submissionId = req.params.id;
  const { reason } = req.body;

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
      ['rejected', reason || 'No reason provided', submissionId],
      (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating submission status' });
        }

        res.json({ message: 'Submission rejected' });
      }
    );
  });
});

module.exports = router; 
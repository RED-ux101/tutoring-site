const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { db } = require('../database');
const auth = require('../middleware/auth');
const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

// Upload file (protected route)
router.post('/upload', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filename, originalname, size, mimetype } = req.file;
    const filePath = path.join('uploads', filename);

    // Save file info to database
    db.run(
      'INSERT INTO files (tutor_id, filename, original_name, file_path, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)',
      [req.tutor.id, filename, originalname, filePath, size, mimetype],
      function (err) {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Error saving file info' });
        }

        res.status(201).json({
          message: 'File uploaded successfully',
          file: {
            id: this.lastID,
            filename,
            originalName: originalname,
            size,
            mimeType: mimetype,
            uploadedAt: new Date().toISOString()
          }
        });
      }
    );
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Get all files for a tutor (protected route)
router.get('/my-files', auth, (req, res) => {
  db.all(
    'SELECT * FROM files WHERE tutor_id = ? ORDER BY uploaded_at DESC',
    [req.tutor.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      const files = rows.map(file => ({
        id: file.id,
        filename: file.filename,
        originalName: file.original_name,
        size: file.file_size,
        mimeType: file.mime_type,
        uploadedAt: file.uploaded_at
      }));

      res.json({ files });
    }
  );
});

// Get all public files (no auth required)
router.get('/public', (req, res) => {
  db.all(
    `SELECT files.*, COALESCE(tutors.name, 'Admin') as tutor_name 
     FROM files 
     LEFT JOIN tutors ON files.tutor_id = tutors.id 
     ORDER BY files.uploaded_at DESC`,
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error' });
      }

      const files = rows.map(file => ({
        id: file.id,
        filename: file.filename,
        originalName: file.original_name,
        size: file.file_size,
        mimeType: file.mime_type,
        uploadedAt: file.uploaded_at,
        tutorName: file.tutor_name || 'Admin'
      }));

      console.log(`Found ${files.length} public files`);
      res.json({ files });
    }
  );
});

// Download file (no auth required)
router.get('/download/:id', (req, res) => {
  const fileId = req.params.id;

  db.get('SELECT * FROM files WHERE id = ?', [fileId], (err, file) => {
    if (err) {
      return res.status(500).json({ message: 'Database error' });
    }

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, '..', file.file_path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on disk' });
    }

    res.download(filePath, file.original_name);
  });
});

// Delete file (protected route)
router.delete('/:id', auth, (req, res) => {
  const fileId = req.params.id;

  // First get file info to check ownership and get file path
  db.get(
    'SELECT * FROM files WHERE id = ? AND tutor_id = ?',
    [fileId, req.tutor.id],
    (err, file) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }

      if (!file) {
        return res.status(404).json({ message: 'File not found or unauthorized' });
      }

      // Delete file from filesystem
      const filePath = path.join(__dirname, '..', file.file_path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from database
      db.run('DELETE FROM files WHERE id = ?', [fileId], (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error deleting file' });
        }

        res.json({ message: 'File deleted successfully' });
      });
    }
  );
});

module.exports = router; 
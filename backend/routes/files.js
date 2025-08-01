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

// Input validation middleware
const validateFileInput = (req, res, next) => {
  const { category } = req.body;
  
  // Validate category if provided
  if (category && typeof category !== 'string') {
    return res.status(400).json({ message: 'Invalid category format' });
  }
  
  // Sanitize category
  if (category) {
    req.body.category = category.trim().substring(0, 100); // Limit length
  }
  
  next();
};

// Configure multer for file uploads with enhanced security
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate secure filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${timestamp}-${random}${ext}`;
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

// Upload file (protected route)
router.post('/upload', auth, validateFileInput, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { filename, originalname, size, mimetype } = req.file;
    const { category } = req.body;
    const filePath = path.join('uploads', filename);

    // Validate file size
    if (size > 10 * 1024 * 1024) {
      // Remove uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }

    // Save file info to database
    db.run(
      'INSERT INTO files (tutor_id, filename, original_name, file_path, file_size, mime_type, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.tutor.id, filename, originalname, filePath, size, mimetype, category || null],
      function (err) {
        if (err) {
          // Remove uploaded file if database save fails
          fs.unlinkSync(req.file.path);
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
            category: category || null,
            uploadedAt: new Date().toISOString()
          }
        });
      }
    );
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
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
        category: file.category,
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
        return res.status(500).json({ message: 'Database error' });
      }

      const files = rows.map(file => ({
        id: file.id,
        filename: file.filename,
        originalName: file.original_name,
        size: file.file_size,
        mimeType: file.mime_type,
        category: file.category,
        uploadedAt: file.uploaded_at,
        tutorName: file.tutor_name || 'Admin'
      }));

      res.json({ files });
    }
  );
});

// Download file (no auth required)
router.get('/download/:id', (req, res) => {
  const fileId = parseInt(req.params.id);
  
  if (isNaN(fileId) || fileId <= 0) {
    return res.status(400).json({ message: 'Invalid file ID' });
  }

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

    // Set security headers
    res.set('X-Content-Type-Options', 'nosniff');
    res.set('X-Frame-Options', 'DENY');
    res.download(filePath, file.original_name);
  });
});

// Delete file (protected route)
router.delete('/:id', auth, (req, res) => {
  const fileId = parseInt(req.params.id);
  
  if (isNaN(fileId) || fileId <= 0) {
    return res.status(400).json({ message: 'Invalid file ID' });
  }

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

// Rename file (protected route)
router.put('/:id/rename', auth, (req, res) => {
  const fileId = parseInt(req.params.id);
  const { newName } = req.body;

  if (isNaN(fileId) || fileId <= 0) {
    return res.status(400).json({ message: 'Invalid file ID' });
  }

  if (!newName || typeof newName !== 'string' || newName.trim() === '') {
    return res.status(400).json({ message: 'New name is required' });
  }

  // Sanitize new name
  const sanitizedName = newName.trim().substring(0, 255);

  // First get file info to check ownership
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

      // Update the original_name in database
      db.run(
        'UPDATE files SET original_name = ? WHERE id = ?',
        [sanitizedName, fileId],
        (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error renaming file' });
          }

          res.json({ 
            message: 'File renamed successfully',
            newName: sanitizedName
          });
        }
      );
    }
  );
});

module.exports = router; 
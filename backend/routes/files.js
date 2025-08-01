const express = require('express');
const multer = require('multer');
const path = require('path');
const { dbOperations, storageOperations } = require('../firebase-config');
const auth = require('../middleware/auth');
const router = express.Router();

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

// Configure multer for memory storage (for Firebase upload)
const upload = multer({
  storage: multer.memoryStorage(),
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
router.post('/upload', auth, validateFileInput, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { category } = req.body;
    const { originalname, size, mimetype } = req.file;

    // Validate file size
    if (size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }

    // Upload file to Firebase Storage
    const uploadResult = await storageOperations.uploadFile(req.file, 'uploads');
    
    // Save file info to Firestore
    const fileData = {
      tutorId: req.tutor.id,
      fileName: uploadResult.fileName,
      originalName: uploadResult.originalName,
      publicUrl: uploadResult.publicUrl,
      size: uploadResult.size,
      mimeType: uploadResult.mimeType,
      category: category || null
    };

    const savedFile = await dbOperations.files.create(fileData);

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: savedFile.id,
        fileName: savedFile.fileName,
        originalName: savedFile.originalName,
        publicUrl: savedFile.publicUrl,
        size: savedFile.size,
        mimeType: savedFile.mimeType,
        category: savedFile.category,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

// Get all files for a tutor (protected route)
router.get('/my-files', auth, async (req, res) => {
  try {
    const files = await dbOperations.files.getByTutorId(req.tutor.id);
    
    const formattedFiles = files.map(file => ({
      id: file.id,
      fileName: file.fileName,
      originalName: file.originalName,
      publicUrl: file.publicUrl,
      size: file.size,
      mimeType: file.mimeType,
      category: file.category,
      uploadedAt: file.createdAt?.toDate?.() || file.createdAt
    }));

    res.json({ files: formattedFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Get all public files (no auth required)
router.get('/public', async (req, res) => {
  try {
    const files = await dbOperations.files.getAll();
    
    const formattedFiles = files.map(file => ({
      id: file.id,
      fileName: file.fileName,
      originalName: file.originalName,
      publicUrl: file.publicUrl,
      size: file.size,
      mimeType: file.mimeType,
      category: file.category,
      uploadedAt: file.createdAt?.toDate?.() || file.createdAt,
      tutorName: file.tutorName || 'Admin'
    }));

    res.json({ files: formattedFiles });
  } catch (error) {
    console.error('Error fetching public files:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Download file (no auth required)
router.get('/download/:id', async (req, res) => {
  try {
    const fileId = req.params.id;
    
    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    const file = await dbOperations.files.getById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Redirect to Firebase Storage URL
    res.redirect(file.publicUrl);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Delete file (protected route)
router.delete('/:id', auth, async (req, res) => {
  try {
    const fileId = req.params.id;
    
    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    // Get file info to check ownership and get file path
    const file = await dbOperations.files.getById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.tutorId !== req.tutor.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this file' });
    }

    // Delete file from Firebase Storage
    await storageOperations.deleteFile(file.fileName);

    // Delete from Firestore
    await dbOperations.files.delete(fileId);

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Error deleting file' });
  }
});

// Rename file (protected route)
router.put('/:id/rename', auth, async (req, res) => {
  try {
    const fileId = req.params.id;
    const { newName } = req.body;

    if (!fileId) {
      return res.status(400).json({ message: 'File ID is required' });
    }

    if (!newName || typeof newName !== 'string' || newName.trim() === '') {
      return res.status(400).json({ message: 'New name is required' });
    }

    // Sanitize new name
    const sanitizedName = newName.trim().substring(0, 255);

    // Get file info to check ownership
    const file = await dbOperations.files.getById(fileId);
    
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    if (file.tutorId !== req.tutor.id) {
      return res.status(403).json({ message: 'Unauthorized to rename this file' });
    }

    // Update the original_name in Firestore
    await dbOperations.files.update(fileId, { originalName: sanitizedName });

    res.json({ 
      message: 'File renamed successfully',
      newName: sanitizedName
    });
  } catch (error) {
    console.error('Error renaming file:', error);
    res.status(500).json({ message: 'Error renaming file' });
  }
});

module.exports = router; 
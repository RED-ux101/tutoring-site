const express = require('express');
const multer = require('multer');
const path = require('path');
const { dbOperations, storageOperations } = require('../firebase-config');
const auth = require('../middleware/auth');
const router = express.Router();

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

// Submit a file from a student (no auth required)
router.post('/submit', validateSubmissionInput, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { studentName, studentEmail, description, category } = req.body;
    const { originalname, size, mimetype } = req.file;

    // Validate file size
    if (size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: 'File too large. Maximum size is 10MB.' });
    }

    // Upload file to Firebase Storage
    const uploadResult = await storageOperations.uploadFile(req.file, 'submissions');
    
    // Save submission info to Firestore
    const submissionData = {
      studentName,
      studentEmail,
      fileName: uploadResult.fileName,
      originalName: uploadResult.originalName,
      publicUrl: uploadResult.publicUrl,
      size: uploadResult.size,
      mimeType: uploadResult.mimeType,
      description,
      category
    };

    const savedSubmission = await dbOperations.submissions.create(submissionData);

    res.status(201).json({
      message: 'Submission received successfully',
      submissionId: savedSubmission.id
    });
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: 'Server error during submission' });
  }
});

// Get all pending submissions (admin only)
router.get('/pending', auth, async (req, res) => {
  try {
    const submissions = await dbOperations.submissions.getPending();
    
    const formattedSubmissions = submissions.map(submission => ({
      id: submission.id,
      studentName: submission.studentName,
      studentEmail: submission.studentEmail,
      fileName: submission.fileName,
      originalName: submission.originalName,
      publicUrl: submission.publicUrl,
      size: submission.size,
      mimeType: submission.mimeType,
      description: submission.description,
      category: submission.category,
      status: submission.status,
      submittedAt: submission.createdAt?.toDate?.() || submission.createdAt
    }));

    res.json({ submissions: formattedSubmissions });
  } catch (error) {
    console.error('Error fetching pending submissions:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Get all submissions (admin only)
router.get('/all', auth, async (req, res) => {
  try {
    const submissions = await dbOperations.submissions.getAll();
    
    const formattedSubmissions = submissions.map(submission => ({
      id: submission.id,
      studentName: submission.studentName,
      studentEmail: submission.studentEmail,
      fileName: submission.fileName,
      originalName: submission.originalName,
      publicUrl: submission.publicUrl,
      size: submission.size,
      mimeType: submission.mimeType,
      description: submission.description,
      category: submission.category,
      status: submission.status,
      submittedAt: submission.createdAt?.toDate?.() || submission.createdAt
    }));

    res.json({ submissions: formattedSubmissions });
  } catch (error) {
    console.error('Error fetching all submissions:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Download submission file (admin only)
router.get('/download/:id', auth, async (req, res) => {
  try {
    const submissionId = req.params.id;
    
    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required' });
    }

    const submission = await dbOperations.submissions.getById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Redirect to Firebase Storage URL
    res.redirect(submission.publicUrl);
  } catch (error) {
    console.error('Error downloading submission:', error);
    res.status(500).json({ message: 'Database error' });
  }
});

// Approve submission and move to public files (admin only)
router.post('/approve/:id', auth, async (req, res) => {
  try {
    const submissionId = req.params.id;
    
    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required' });
    }

    // Get submission details
    const submission = await dbOperations.submissions.getById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission already processed' });
    }

    // Copy file to uploads folder in Firebase Storage
    const newFileName = submission.fileName.replace('submissions/', 'uploads/');
    
    // For now, we'll just update the submission status and add to files collection
    // In a full implementation, you'd copy the file in Firebase Storage
    
    // Add to public files collection
    const fileData = {
      tutorId: req.tutor.id,
      fileName: newFileName,
      originalName: submission.originalName,
      publicUrl: submission.publicUrl.replace('submissions/', 'uploads/'),
      size: submission.size,
      mimeType: submission.mimeType,
      category: submission.category
    };

    await dbOperations.files.create(fileData);

    // Update submission status
    await dbOperations.submissions.update(submissionId, { 
      status: 'approved',
      approvedAt: new Date()
    });

    res.json({ message: 'Submission approved and added to public files' });
  } catch (error) {
    console.error('Error approving submission:', error);
    res.status(500).json({ message: 'Error processing submission' });
  }
});

// Reject submission (admin only)
router.post('/reject/:id', auth, async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { reason } = req.body;
    
    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required' });
    }

    // Sanitize reason
    const sanitizedReason = reason ? reason.trim().substring(0, 500) : 'No reason provided';

    // Get submission details
    const submission = await dbOperations.submissions.getById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    if (submission.status !== 'pending') {
      return res.status(400).json({ message: 'Submission already processed' });
    }

    // Delete the file from Firebase Storage
    await storageOperations.deleteFile(submission.fileName);

    // Update submission status
    await dbOperations.submissions.update(submissionId, {
      status: 'rejected',
      rejectionReason: sanitizedReason,
      rejectedAt: new Date()
    });

    res.json({ message: 'Submission rejected' });
  } catch (error) {
    console.error('Error rejecting submission:', error);
    res.status(500).json({ message: 'Error updating submission status' });
  }
});

// Rename submission file (admin only)
router.put('/:id/rename', auth, async (req, res) => {
  try {
    const submissionId = req.params.id;
    const { newName } = req.body;

    if (!submissionId) {
      return res.status(400).json({ message: 'Submission ID is required' });
    }

    if (!newName || typeof newName !== 'string' || newName.trim() === '') {
      return res.status(400).json({ message: 'New name is required' });
    }

    // Sanitize new name
    const sanitizedName = newName.trim().substring(0, 255);

    // Get submission details
    const submission = await dbOperations.submissions.getById(submissionId);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update the original_name in Firestore
    await dbOperations.submissions.update(submissionId, { originalName: sanitizedName });

    res.json({ 
      message: 'Submission renamed successfully',
      newName: sanitizedName
    });
  } catch (error) {
    console.error('Error renaming submission:', error);
    res.status(500).json({ message: 'Error renaming submission' });
  }
});

module.exports = router; 
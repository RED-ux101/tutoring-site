const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { message: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all auth routes
router.use(authLimiter);

// Input validation middleware
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }
  
  // Password strength validation
  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters long' });
  }
  
  next();
};

// Admin login with proper validation
router.post('/admin-login', validateLoginInput, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    if (!adminEmail || !adminPasswordHash) {
      console.error('Admin credentials not configured');
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    // Check email
    if (email !== adminEmail) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminPasswordHash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Issue JWT token
    const token = jwt.sign(
      { id: 1, name: 'Admin', role: 'admin', email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      tutor: { id: 1, name: 'Admin', email }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Legacy key-based login (deprecated - for backward compatibility)
router.post('/legacy-login', authLimiter, async (req, res) => {
  try {
    const { accessKey } = req.body;
    
    if (!accessKey) {
      return res.status(400).json({ message: 'Access key required' });
    }
    
    // Check against environment variable
    const validAccessKey = process.env.LEGACY_ACCESS_KEY;
    
    if (!validAccessKey || accessKey !== validAccessKey) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Issue JWT token
    const token = jwt.sign(
      { id: 1, name: 'Admin', role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      tutor: { id: 1, name: 'Admin', email: 'admin@system.local' }
    });
  } catch (error) {
    console.error('Legacy login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Health check endpoint (no sensitive info)
router.get('/health', (req, res) => {
  res.json({ 
    message: 'Auth service is running', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router; 
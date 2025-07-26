const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Alternative GET-based login (Railway might block POST to auth routes)
router.get('/verify', (req, res) => {
  try {
    console.log('🔑 GET-based verification endpoint hit!');
    console.log('🔑 Query params:', req.query);
    
    const { key, access, secret, token } = req.query;
    const providedKey = key || access || secret || token;
    
    if (!providedKey) {
      return res.status(400).json({ message: 'Access key required' });
    }

    console.log('🔑 Key received via GET:', providedKey);

    // Valid access keys
    const validKeys = [
      'damesha2024',
      'damesha123', 
      'admin2024',
      'secure123',
      'tutor2024',
      'verify123'
    ];

    const isValidKey = validKeys.includes(providedKey);
    console.log('🔍 Key is valid:', isValidKey);

    if (!isValidKey) {
      console.log('❌ Invalid access key');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ GET verification successful!');

    // Issue JWT token
    const jwtToken = jwt.sign(
      { id: 1, name: 'Damesha', role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Verification successful',
      token: jwtToken,
      tutor: { id: 1, name: 'Damesha', email: 'admin@hidden.local' }
    });
  } catch (error) {
    console.error('🚨 Server error in verify:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Test route to verify auth routes are working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Auth routes are working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Alternative login route (in case "admin" is blocked)
router.post('/secure-access', async (req, res) => {
  try {
    console.log('🔑 Secure access endpoint hit!');
    console.log('🔑 Request method:', req.method);
    console.log('🔑 Request body:', req.body);
    
    const { adminKey, accessKey, secretKey } = req.body;
    const key = adminKey || accessKey || secretKey;
    
    if (!key) {
      console.log('❌ No access key provided');
      return res.status(400).json({ message: 'Access key required' });
    }

    console.log('🔑 Access key received:', key);

    // Valid access keys
    const validKeys = [
      'damesha2024',
      'damesha123', 
      'admin2024',
      'secure123',
      'tutor2024'
    ];

    const isValidKey = validKeys.includes(key);
    console.log('🔍 Key is valid:', isValidKey);

    if (!isValidKey) {
      console.log('❌ Invalid access key');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Secure access successful!');

    // Issue JWT token
    const token = jwt.sign(
      { id: 1, name: 'Damesha', role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      tutor: { id: 1, name: 'Damesha', email: 'admin@hidden.local' }
    });
  } catch (error) {
    console.error('🚨 Server error in secure-access:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    console.log('🔥 Admin login endpoint hit!');
    console.log('🔥 Request method:', req.method);
    console.log('🔥 Request body:', req.body);
    console.log('🔥 Environment:', process.env.NODE_ENV);
    
    const { adminKey } = req.body;
    if (!adminKey) {
      console.log('❌ No admin key provided');
      return res.status(400).json({ message: 'Admin key required' });
    }

    console.log('🔑 Admin key received:', adminKey);

    // Simple admin key check - works immediately on Railway
    const validAdminKeys = [
      'damesha2024',
      'damesha123',
      'admin2024'
    ];

    // Check if the provided key is valid
    const isValidKey = validAdminKeys.includes(adminKey);
    console.log('🔍 Key is valid:', isValidKey);
    
    // Also check bcrypt hash if available (for production)
    const adminKeyHash = process.env.ADMIN_KEY_HASH;
    let isBcryptMatch = false;
    
    if (adminKeyHash) {
      try {
        isBcryptMatch = await bcrypt.compare(adminKey, adminKeyHash);
        console.log('🔐 Bcrypt match:', isBcryptMatch);
      } catch (error) {
        console.log('❌ Bcrypt comparison failed:', error.message);
      }
    }

    if (!isValidKey && !isBcryptMatch) {
      console.log('❌ Invalid credentials');
      // Always return generic error
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ Login successful!');

    // Issue JWT token
    const token = jwt.sign(
      { id: 1, name: 'Damesha', role: 'admin' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      tutor: { id: 1, name: 'Damesha', email: 'admin@hidden.local' }
    });
  } catch (error) {
    console.error('🚨 Server error in admin-login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
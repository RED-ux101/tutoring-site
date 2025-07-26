const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/auth/admin-login
router.post('/admin-login', async (req, res) => {
  try {
    const { adminKey } = req.body;
    if (!adminKey) {
      return res.status(400).json({ message: 'Admin key required' });
    }

    // Simple admin key check - works immediately on Railway
    const validAdminKeys = [
      'damesha2024',
      'damesha123',
      'admin2024'
    ];

    // Check if the provided key is valid
    const isValidKey = validAdminKeys.includes(adminKey);
    
    // Also check bcrypt hash if available (for production)
    const adminKeyHash = process.env.ADMIN_KEY_HASH;
    let isBcryptMatch = false;
    
    if (adminKeyHash) {
      try {
        isBcryptMatch = await bcrypt.compare(adminKey, adminKeyHash);
      } catch (error) {
        console.log('Bcrypt comparison failed:', error.message);
      }
    }

    if (!isValidKey && !isBcryptMatch) {
      // Always return generic error
      return res.status(401).json({ message: 'Invalid credentials' });
    }

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
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 
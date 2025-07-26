const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  console.log('🔐 Auth middleware - Authorization header:', authHeader);
  
  const token = authHeader?.replace('Bearer ', '');
  console.log('🔐 Auth middleware - Extracted token:', token ? 'EXISTS' : 'MISSING');
  console.log('🔐 Auth middleware - Token value:', token);

  if (!token) {
    console.log('❌ Auth middleware - No token provided');
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('🔐 Auth middleware - Attempting to verify token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('✅ Auth middleware - Token verified successfully:', decoded);
    req.tutor = decoded;
    next();
  } catch (error) {
    console.log('❌ Auth middleware - Token verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth; 
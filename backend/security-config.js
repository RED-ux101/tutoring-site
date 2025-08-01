// Security Configuration for Tutor File Sharing Platform
// This file contains security settings and validation functions

const crypto = require('crypto');

// Security constants
const SECURITY_CONFIG = {
  // JWT Configuration
  JWT_EXPIRY: '24h',
  JWT_REFRESH_EXPIRY: '7d',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 5, // 5 requests per window for auth
  GENERAL_RATE_LIMIT_MAX: 100, // 100 requests per window for general endpoints
  
  // File Upload Security
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_MIME_TYPES: [
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
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.jpg', '.jpeg', '.png', '.gif'],
  
  // Input Validation
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_CATEGORY_LENGTH: 50,
  MAX_FILENAME_LENGTH: 255,
  
  // Password Requirements
  MIN_PASSWORD_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // CORS Configuration
  ALLOWED_ORIGINS: [
    'https://tutoring-site-production.up.railway.app',
    'https://tutoring-site-production-30eb.up.railway.app'
  ],
  
  // Security Headers
  SECURITY_HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': "default-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data: https:;"
  }
};

// Input validation functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= SECURITY_CONFIG.MIN_PASSWORD_LENGTH;
};

const sanitizeString = (str, maxLength = 100) => {
  if (typeof str !== 'string') return '';
  return str.trim().substring(0, maxLength);
};

const validateFileType = (mimetype, originalname) => {
  // Check MIME type
  if (!SECURITY_CONFIG.ALLOWED_MIME_TYPES.includes(mimetype)) {
    return false;
  }
  
  // Check file extension
  const extension = require('path').extname(originalname).toLowerCase();
  if (!SECURITY_CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
    return false;
  }
  
  // Check for path traversal attempts
  if (originalname.includes('..') || originalname.includes('/') || originalname.includes('\\')) {
    return false;
  }
  
  return true;
};

const generateSecureFilename = (originalname) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  const ext = require('path').extname(originalname).toLowerCase();
  return `${timestamp}-${random}${ext}`;
};

const validateInteger = (value, min = 1) => {
  const num = parseInt(value);
  return !isNaN(num) && num >= min;
};

// Rate limiting configuration
const getRateLimitConfig = (endpoint) => {
  if (endpoint.includes('/auth/')) {
    return {
      windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
      max: SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS,
      message: { message: 'Too many authentication attempts, please try again later' },
      standardHeaders: true,
      legacyHeaders: false,
    };
  }
  
  return {
    windowMs: SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
    max: SECURITY_CONFIG.GENERAL_RATE_LIMIT_MAX,
    message: { message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
  };
};

// Environment validation
const validateEnvironment = () => {
  const required = ['JWT_SECRET'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
  
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD_HASH) {
      throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD_HASH are required in production');
    }
  }
};

module.exports = {
  SECURITY_CONFIG,
  validateEmail,
  validatePassword,
  sanitizeString,
  validateFileType,
  generateSecureFilename,
  validateInteger,
  getRateLimitConfig,
  validateEnvironment
}; 
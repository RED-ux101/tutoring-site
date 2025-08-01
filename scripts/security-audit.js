#!/usr/bin/env node

/**
 * Security Audit Script for Tutor File Sharing Platform
 * This script checks for common security vulnerabilities and misconfigurations
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

class SecurityAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.passed = [];
  }

  addIssue(severity, message, file = null, line = null) {
    this.issues.push({ severity, message, file, line });
  }

  addWarning(message, file = null, line = null) {
    this.warnings.push({ message, file, line });
  }

  addPassed(message) {
    this.passed.push(message);
  }

  // Check for hardcoded secrets
  checkHardcodedSecrets() {
    log.header('Checking for hardcoded secrets...');
    
    const filesToCheck = [
      'backend/routes/auth.js',
      'backend/middleware/auth.js',
      'backend/server.js',
      'frontend/src/services/api.js'
    ];

    const secretPatterns = [
      /['"]damesha\d+['"]/g,
      /['"]admin\d+['"]/g,
      /['"]secure\d+['"]/g,
      /['"]tutor\d+['"]/g,
      /['"]verify\d+['"]/g,
      /['"]your-secret-key['"]/g,
      /JWT_SECRET.*['"][^'"]{1,31}['"]/g
    ];

    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        secretPatterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            this.addIssue('HIGH', `Hardcoded secret found in ${file}: ${matches[0]}`, file);
          }
        });
      }
    });

    if (this.issues.length === 0) {
      this.addPassed('No hardcoded secrets found');
    }
  }

  // Check for sensitive logging
  checkSensitiveLogging() {
    log.header('Checking for sensitive data logging...');
    
    const filesToCheck = [
      'backend/routes/auth.js',
      'backend/middleware/auth.js',
      'backend/server.js',
      'frontend/src/services/api.js'
    ];

    const sensitivePatterns = [
      /console\.log.*token/gi,
      /console\.log.*password/gi,
      /console\.log.*secret/gi,
      /console\.log.*key/gi,
      /console\.log.*JWT_SECRET/gi
    ];

    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        sensitivePatterns.forEach(pattern => {
          const matches = content.match(pattern);
          if (matches) {
            this.addWarning(`Sensitive data logging found in ${file}`, file);
          }
        });
      }
    });

    if (this.warnings.length === 0) {
      this.addPassed('No sensitive data logging found');
    }
  }

  // Check environment variables
  checkEnvironmentVariables() {
    log.header('Checking environment configuration...');
    
    const envFile = 'backend/.env';
    if (fs.existsSync(envFile)) {
      const content = fs.readFileSync(envFile, 'utf8');
      
      // Check for weak JWT secret
      const jwtSecretMatch = content.match(/JWT_SECRET=(.+)/);
      if (jwtSecretMatch && jwtSecretMatch[1].length < 32) {
        this.addIssue('HIGH', 'JWT_SECRET is too short (minimum 32 characters)', envFile);
      }
      
      // Check for default values
      if (content.includes('your-secret-key')) {
        this.addIssue('CRITICAL', 'Default JWT_SECRET found in .env file', envFile);
      }
      
      if (!content.includes('ADMIN_EMAIL') || !content.includes('ADMIN_PASSWORD_HASH')) {
        this.addWarning('Admin credentials not configured in .env file', envFile);
      }
    } else {
      this.addWarning('.env file not found - make sure to create one for production');
    }
  }

  // Check dependencies
  checkDependencies() {
    log.header('Checking dependencies...');
    
    const packageFiles = ['backend/package.json', 'frontend/package.json'];
    
    packageFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
        
        // Check for security-related packages
        const securityPackages = ['helmet', 'express-rate-limit', 'bcryptjs'];
        const missing = securityPackages.filter(pkg => 
          !pkg.dependencies || !pkg.dependencies[pkg]
        );
        
        if (missing.length > 0) {
          this.addWarning(`Missing security packages: ${missing.join(', ')}`, file);
        } else {
          this.addPassed('Security packages are installed');
        }
      }
    });
  }

  // Check file upload security
  checkFileUploadSecurity() {
    log.header('Checking file upload security...');
    
    const filesToCheck = [
      'backend/routes/files.js',
      'backend/routes/submissions.js'
    ];

    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        
        // Check for file type validation
        if (!content.includes('allowedTypes') && !content.includes('ALLOWED_MIME_TYPES')) {
          this.addIssue('MEDIUM', 'File type validation may be missing', file);
        }
        
        // Check for file size limits
        if (!content.includes('fileSize') && !content.includes('MAX_FILE_SIZE')) {
          this.addIssue('MEDIUM', 'File size limits may be missing', file);
        }
        
        // Check for path traversal protection
        if (!content.includes('path.extname') && !content.includes('includes(\'..\')')) {
          this.addIssue('HIGH', 'Path traversal protection may be missing', file);
        }
      }
    });
  }

  // Check CORS configuration
  checkCORSConfiguration() {
    log.header('Checking CORS configuration...');
    
    const serverFile = 'backend/server.js';
    if (fs.existsSync(serverFile)) {
      const content = fs.readFileSync(serverFile, 'utf8');
      
      if (content.includes('origin: true') || content.includes('origin: "*"')) {
        this.addIssue('HIGH', 'CORS is configured to allow all origins', serverFile);
      }
      
      if (content.includes('allowedOrigins') && content.includes('localhost')) {
        this.addWarning('Localhost is in allowed origins - ensure this is removed in production', serverFile);
      }
    }
  }

  // Check authentication
  checkAuthentication() {
    log.header('Checking authentication...');
    
    const authFile = 'backend/routes/auth.js';
    if (fs.existsSync(authFile)) {
      const content = fs.readFileSync(authFile, 'utf8');
      
      // Check for rate limiting
      if (!content.includes('rateLimit') && !content.includes('express-rate-limit')) {
        this.addIssue('MEDIUM', 'Rate limiting not implemented on auth routes', authFile);
      }
      
      // Check for input validation
      if (!content.includes('validateLoginInput') && !content.includes('emailRegex')) {
        this.addIssue('MEDIUM', 'Input validation may be missing', authFile);
      }
    }
  }

  // Generate report
  generateReport() {
    log.header('Security Audit Report');
    
    console.log(`\n${colors.bold}Summary:${colors.reset}`);
    console.log(`  Issues: ${this.issues.length}`);
    console.log(`  Warnings: ${this.warnings.length}`);
    console.log(`  Passed: ${this.passed.length}`);
    
    if (this.issues.length > 0) {
      console.log(`\n${colors.bold}${colors.red}Issues Found:${colors.reset}`);
      this.issues.forEach(issue => {
        const severityColor = issue.severity === 'CRITICAL' ? colors.red : 
                            issue.severity === 'HIGH' ? colors.red :
                            colors.yellow;
        console.log(`  ${severityColor}[${issue.severity}]${colors.reset} ${issue.message}`);
        if (issue.file) {
          console.log(`    File: ${issue.file}`);
        }
      });
    }
    
    if (this.warnings.length > 0) {
      console.log(`\n${colors.bold}${colors.yellow}Warnings:${colors.reset}`);
      this.warnings.forEach(warning => {
        console.log(`  ⚠ ${warning.message}`);
        if (warning.file) {
          console.log(`    File: ${warning.file}`);
        }
      });
    }
    
    if (this.passed.length > 0) {
      console.log(`\n${colors.bold}${colors.green}Passed Checks:${colors.reset}`);
      this.passed.forEach(passed => {
        console.log(`  ✓ ${passed}`);
      });
    }
    
    // Recommendations
    console.log(`\n${colors.bold}${colors.blue}Recommendations:${colors.reset}`);
    console.log('  1. Set strong JWT_SECRET (minimum 32 characters)');
    console.log('  2. Configure admin credentials in environment variables');
    console.log('  3. Enable HTTPS in production');
    console.log('  4. Set up proper CORS origins');
    console.log('  5. Implement rate limiting on all endpoints');
    console.log('  6. Regular security updates and dependency audits');
    console.log('  7. Set up monitoring and logging');
    console.log('  8. Database backups and security');
    
    return {
      issues: this.issues.length,
      warnings: this.warnings.length,
      passed: this.passed.length
    };
  }

  // Run all checks
  run() {
    log.header('Starting Security Audit');
    
    this.checkHardcodedSecrets();
    this.checkSensitiveLogging();
    this.checkEnvironmentVariables();
    this.checkDependencies();
    this.checkFileUploadSecurity();
    this.checkCORSConfiguration();
    this.checkAuthentication();
    
    return this.generateReport();
  }
}

// Run the audit if this script is executed directly
if (require.main === module) {
  const auditor = new SecurityAuditor();
  const results = auditor.run();
  
  // Exit with error code if there are critical issues
  const criticalIssues = auditor.issues.filter(issue => issue.severity === 'CRITICAL').length;
  process.exit(criticalIssues > 0 ? 1 : 0);
}

module.exports = SecurityAuditor; 
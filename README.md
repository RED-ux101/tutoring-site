# Tutor File Sharing Platform

A secure file sharing platform for tutors and students, built with React frontend and Node.js backend.

## 🚀 Features

- **Secure File Upload**: Tutors can upload educational resources with category organization
- **Student Submissions**: Students can submit resources for review and approval
- **Admin Dashboard**: Comprehensive dashboard for managing files and submissions
- **Public File Access**: Students can download approved educational resources
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication with secure token management
- Rate limiting on authentication endpoints (5 attempts per 15 minutes)
- Password hashing with bcryptjs
- Protected routes for admin-only operations
- Input validation and sanitization

### File Upload Security
- File type validation (MIME type and extension checking)
- File size limits (10MB maximum)
- Secure filename generation to prevent path traversal
- Malicious file detection and prevention
- File cleanup on upload errors

### API Security
- Helmet.js for security headers
- CORS protection with whitelisted origins
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- XSS protection with Content Security Policy
- Rate limiting on all endpoints

### Data Protection
- No sensitive data logging
- Secure error handling without information disclosure
- Environment variable validation
- HTTPS enforcement in production

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD_HASH=$2a$12$your-bcrypt-hash-here
   DATABASE_PATH=/tmp/database.db
   ```

3. **Generate admin password hash:**
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-admin-password', 12))"
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
website/
├── backend/
│   ├── database.js          # Database initialization and configuration
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── files.js         # File management routes
│   │   └── submissions.js   # Student submission routes
│   ├── security-config.js   # Security configuration and validation
│   ├── server.js            # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/
│   │   │   └── api.js       # API service functions
│   │   └── context/         # React context providers
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login with email/password
- `POST /api/auth/legacy-login` - Legacy key-based login (deprecated)
- `GET /api/auth/health` - Health check

### File Management
- `POST /api/files/upload` - Upload file (admin only)
- `GET /api/files/my-files` - Get admin's files (admin only)
- `GET /api/files/public` - Get all public files
- `GET /api/files/download/:id` - Download file
- `DELETE /api/files/:id` - Delete file (admin only)
- `PUT /api/files/:id/rename` - Rename file (admin only)

### Student Submissions
- `POST /api/submissions/submit` - Submit resource (no auth required)
- `GET /api/submissions/pending` - Get pending submissions (admin only)
- `GET /api/submissions/all` - Get all submissions (admin only)
- `GET /api/submissions/download/:id` - Download submission (admin only)
- `POST /api/submissions/approve/:id` - Approve submission (admin only)
- `POST /api/submissions/reject/:id` - Reject submission (admin only)
- `PUT /api/submissions/:id/rename` - Rename submission (admin only)

## 🚀 Deployment

### Railway Deployment

This application is configured for deployment on Railway. Here's how to deploy:

1. **Prepare for production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set environment variables on Railway:**
   - `NODE_ENV=production`
   - `JWT_SECRET=your-production-jwt-secret` (minimum 32 characters)
   - `ADMIN_EMAIL=admin@yourdomain.com`
   - `ADMIN_PASSWORD_HASH=your-bcrypt-hash`
   - `PORT` (Railway will set this automatically)

3. **Deploy**
   - Connect your repository to Railway
   - Set the start command to: `npm start`
   - Railway will automatically build and deploy

### Security Checklist for Production

- [ ] Set strong JWT_SECRET (minimum 32 characters)
- [ ] Configure admin credentials (email and password hash)
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Database backups

## 🔒 Security Best Practices

### For Administrators
1. Use strong, unique passwords
2. Regularly rotate JWT secrets
3. Monitor access logs
4. Keep dependencies updated
5. Use HTTPS in production

### For Students
1. Only upload appropriate educational content
2. Don't share personal information in submissions
3. Use valid email addresses for submissions

## 📝 File Upload Limits

- Maximum file size: 10MB
- Supported formats: PDF, Word, PowerPoint, Excel, images (JPG, PNG, GIF), text files
- File type validation: Both MIME type and extension checking
- Secure filename generation to prevent path traversal attacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For security issues, please contact the administrator directly. For other issues, please create an issue in the repository. 
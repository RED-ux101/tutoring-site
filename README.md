# Tutor File Sharing Platform

A secure file sharing platform for tutors and students, built with React frontend and Node.js backend, featuring **persistent Firebase storage** that survives domain changes and site migrations.

## 🚀 Features

- **Secure File Upload**: Tutors can upload educational resources with category organization
- **Student Submissions**: Students can submit resources for review and approval
- **Admin Dashboard**: Comprehensive dashboard for managing files and submissions
- **Public File Access**: Students can download approved educational resources
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Persistent Storage**: Firebase Firestore database and Firebase Storage for files
- **Domain Migration Ready**: Data persists even when changing hosting providers

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

## 🗄️ Storage Architecture

### Firebase Integration
- **Firestore Database**: NoSQL database for file metadata and submissions
- **Firebase Storage**: Cloud storage for actual files
- **Persistent Data**: Survives domain changes and hosting migrations
- **Scalable**: Automatic scaling with Firebase's infrastructure

### Data Collections
- **Files**: Public educational resources uploaded by tutors
- **Submissions**: Student submissions awaiting approval
- **Tutors**: Admin user information

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (see [Firebase Setup Guide](FIREBASE_SETUP.md))

### Backend Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up Firebase (Required):**
   Follow the [Firebase Setup Guide](FIREBASE_SETUP.md) to:
   - Create Firebase project
   - Enable Firestore and Storage
   - Get service account key
   - Configure security rules

3. **Set up environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters
   ADMIN_EMAIL=admin@yourdomain.com
   ADMIN_PASSWORD_HASH=$2a$12$your-bcrypt-hash-here
   
   # Firebase Configuration (Required)
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
   FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   FIREBASE_PROJECT_ID=your-project-id
   ```

4. **Generate admin password hash:**
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('your-admin-password', 12))"
   ```

5. **Start the server:**
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
│   ├── firebase-config.js    # Firebase configuration and operations
│   ├── database.js           # Legacy SQLite (deprecated)
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── files.js         # File management routes (Firebase)
│   │   └── submissions.js   # Student submission routes (Firebase)
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
├── FIREBASE_SETUP.md        # Complete Firebase setup guide
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/admin-login` - Admin login with email/password
- `POST /api/auth/legacy-login` - Legacy key-based login (deprecated)
- `GET /api/auth/health` - Health check

### File Management (Firebase)
- `POST /api/files/upload` - Upload file to Firebase Storage (admin only)
- `GET /api/files/my-files` - Get admin's files from Firestore (admin only)
- `GET /api/files/public` - Get all public files from Firestore
- `GET /api/files/download/:id` - Redirect to Firebase Storage URL
- `DELETE /api/files/:id` - Delete file from Firebase Storage & Firestore (admin only)
- `PUT /api/files/:id/rename` - Rename file in Firestore (admin only)

### Student Submissions (Firebase)
- `POST /api/submissions/submit` - Submit resource to Firebase Storage (no auth required)
- `GET /api/submissions/pending` - Get pending submissions from Firestore (admin only)
- `GET /api/submissions/all` - Get all submissions from Firestore (admin only)
- `GET /api/submissions/download/:id` - Redirect to Firebase Storage URL (admin only)
- `POST /api/submissions/approve/:id` - Approve submission (admin only)
- `POST /api/submissions/reject/:id` - Reject submission (admin only)
- `PUT /api/submissions/:id/rename` - Rename submission (admin only)

## 🚀 Deployment

### Railway Deployment

This application is configured for deployment on Railway with Firebase:

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
   - `FIREBASE_SERVICE_ACCOUNT_KEY=your-firebase-service-account-json`
   - `FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com`
   - `FIREBASE_PROJECT_ID=your-project-id`

3. **Deploy**
   - Connect your repository to Railway
   - Set the start command to: `npm start`
   - Railway will automatically build and deploy

### Vercel Deployment

You can also deploy to Vercel with Firebase:

1. **Frontend on Vercel:**
   - Connect frontend directory to Vercel
   - Set build command: `npm run build`
   - Set output directory: `build`

2. **Backend on Railway or Vercel:**
   - Same environment variables as Railway
   - Firebase handles all data persistence

### Security Checklist for Production

- [ ] Set strong JWT_SECRET (32+ characters)
- [ ] Configure admin credentials
- [ ] Set up Firebase project and security rules
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Monitor Firebase usage and costs

## 🔒 Security Best Practices

### For Administrators
1. Use strong, unique passwords
2. Regularly rotate JWT secrets
3. Monitor access logs
4. Keep dependencies updated
5. Use HTTPS in production
6. Monitor Firebase usage and costs

### For Students
1. Only upload appropriate educational content
2. Don't share personal information in submissions
3. Use valid email addresses for submissions

## 📝 File Upload Limits

- Maximum file size: 10MB
- Supported formats: PDF, Word, PowerPoint, Excel, images (JPG, PNG, GIF), text files
- File type validation: Both MIME type and extension checking
- Secure filename generation to prevent path traversal attacks
- Files stored in Firebase Storage with public URLs

## 💰 Firebase Pricing

### Free Tier (Spark Plan)
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB downloads/day
- **Perfect for small to medium projects**

### Paid Plans
- **Blaze Plan**: Pay-as-you-go
- **Very affordable for most use cases**
- **Automatic scaling**

## 🔄 Migration Benefits

### Domain Changes
- ✅ Data persists when changing hosting providers
- ✅ No data loss during migrations
- ✅ Easy to switch between Railway, Vercel, etc.

### Scaling
- ✅ Automatic scaling with Firebase
- ✅ No server storage limitations
- ✅ Global CDN for file delivery

### Backup & Recovery
- ✅ Firebase handles backups automatically
- ✅ Data redundancy and reliability
- ✅ Easy data export and migration

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

## 📚 Additional Resources

- [Firebase Setup Guide](FIREBASE_SETUP.md) - Complete Firebase configuration
- [Firebase Documentation](https://firebase.google.com/docs) - Official Firebase docs
- [Security Audit Script](scripts/security-audit.js) - Security vulnerability checker 
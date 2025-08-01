# Firebase Setup Guide for Tutor File Sharing Platform

This guide will help you set up Firebase for persistent storage that survives domain changes and site migrations.

## 🚀 Firebase Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `tutor-file-sharing` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services

#### Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

#### Enable Firebase Storage
1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select the same location as Firestore
5. Click "Done"

### 3. Get Firebase Service Account Key

1. In Firebase Console, go to "Project settings" (gear icon)
2. Go to "Service accounts" tab
3. Click "Generate new private key"
4. Download the JSON file
5. **IMPORTANT**: Keep this file secure and never commit it to Git

### 4. Configure Environment Variables

Add these to your `backend/.env` file:

```env
# Firebase Configuration
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
FIREBASE_PROJECT_ID=your-project-id

# Or use the service account file path
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

### 5. Install Firebase Dependencies

```bash
cd backend
npm install firebase-admin
```

### 6. Set Up Firebase Security Rules

#### Firestore Security Rules
Go to Firestore Database → Rules and add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Files collection
    match /files/{fileId} {
      allow read: if true; // Public read access
      allow write: if request.auth != null; // Only authenticated users can write
    }
    
    // Submissions collection
    match /submissions/{submissionId} {
      allow read, write: if request.auth != null; // Only authenticated users
    }
    
    // Tutors collection
    match /tutors/{tutorId} {
      allow read, write: if request.auth != null; // Only authenticated users
    }
  }
}
```

#### Storage Security Rules
Go to Storage → Rules and add:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read access to all files
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 🔧 Configuration Options

### Option 1: Environment Variable (Recommended for Production)
```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project-id",...}
```

### Option 2: Service Account File (Good for Development)
1. Save the downloaded JSON as `backend/firebase-service-account.json`
2. Add to `.gitignore`:
   ```
   firebase-service-account.json
   ```

## 📁 Firebase Collections Structure

### Files Collection
```javascript
{
  id: "auto-generated",
  tutorId: "admin-id",
  fileName: "uploads/1234567890-abc123.pdf",
  originalName: "Math Homework.pdf",
  publicUrl: "https://storage.googleapis.com/bucket/uploads/1234567890-abc123.pdf",
  size: 1024000,
  mimeType: "application/pdf",
  category: "homework",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Submissions Collection
```javascript
{
  id: "auto-generated",
  studentName: "John Doe",
  studentEmail: "john@example.com",
  fileName: "submissions/1234567890-abc123.pdf",
  originalName: "Student Submission.pdf",
  publicUrl: "https://storage.googleapis.com/bucket/submissions/1234567890-abc123.pdf",
  size: 1024000,
  mimeType: "application/pdf",
  description: "This is my homework submission",
  category: "homework",
  status: "pending", // pending, approved, rejected
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

### Tutors Collection
```javascript
{
  id: "auto-generated",
  email: "admin@example.com",
  name: "Admin",
  createdAt: "2024-01-01T00:00:00.000Z"
}
```

## 🚀 Deployment Configuration

### Railway Deployment
1. Add environment variables in Railway dashboard:
   - `FIREBASE_SERVICE_ACCOUNT_KEY` (the entire JSON as a string)
   - `FIREBASE_STORAGE_BUCKET`
   - `FIREBASE_PROJECT_ID`

### Vercel Deployment
1. Add environment variables in Vercel dashboard
2. Same variables as Railway

### Local Development
1. Create `backend/.env` file
2. Add Firebase configuration
3. Run `npm install` to install dependencies

## 🔒 Security Considerations

1. **Never commit service account keys to Git**
2. **Use environment variables in production**
3. **Set up proper Firebase security rules**
4. **Regularly rotate service account keys**
5. **Monitor Firebase usage and costs**

## 💰 Firebase Pricing

### Free Tier (Spark Plan)
- **Firestore**: 1GB storage, 50K reads/day, 20K writes/day
- **Storage**: 5GB storage, 1GB downloads/day
- **Perfect for small to medium projects**

### Paid Plans
- **Blaze Plan**: Pay-as-you-go
- **Very affordable for most use cases**
- **Automatic scaling**

## 🛠️ Troubleshooting

### Common Issues

1. **"Permission denied" errors**
   - Check Firebase security rules
   - Verify service account has proper permissions

2. **"Project not found" errors**
   - Verify project ID in environment variables
   - Check service account key is correct

3. **"Storage bucket not found" errors**
   - Verify storage bucket name
   - Ensure storage is enabled in Firebase console

4. **File upload failures**
   - Check file size limits (10MB)
   - Verify file type is allowed
   - Check network connectivity

### Testing Firebase Connection

Add this to your server startup to test Firebase connection:

```javascript
// In server.js
const { initializeFirebase } = require('./firebase-config');

const startServer = async () => {
  try {
    // Initialize Firebase
    const firebaseApp = initializeFirebase();
    console.log('Firebase initialized successfully');
    
    // Test Firestore connection
    const db = firebaseApp.firestore();
    await db.collection('test').doc('test').get();
    console.log('Firestore connection successful');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Storage: Firebase');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};
```

## 📞 Support

If you encounter issues:
1. Check Firebase Console for error logs
2. Verify environment variables are set correctly
3. Test with Firebase CLI: `firebase projects:list`
4. Check Firebase documentation for latest updates 
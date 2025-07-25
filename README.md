# Damesha's Learning Hub

A modern, full-stack web application that serves as Damesha's personal learning hub, where he can share educational materials with students and students can contribute their own resources to the community.

## Features

### For Damesha (Admin)
- **Secure Authentication** - Admin login to access dashboard
- **File Upload** - Drag-and-drop or click to upload educational materials
- **File Management** - View, download, and delete uploaded files
- **Submission Review** - Approve or reject student-submitted resources
- **Admin Dashboard** - Centralized interface to manage all content

### For Students  
- **Public Access** - Browse and download study materials without registration
- **Resource Submission** - Submit helpful resources for community sharing
- **File Details** - See file names, sizes, upload dates, and categories
- **Direct Downloads** - One-click file downloads

### Technical Features
- **Modern UI** - Built with React and TailwindCSS
- **Responsive Design** - Works on desktop, tablet, and mobile
- **File Support** - PDFs, Word docs, PowerPoint, Excel, images, and text files
- **Security** - JWT authentication and protected routes
- **Database** - SQLite for easy deployment and development

## Tech Stack

### Frontend
- React 18
- React Router for navigation
- TailwindCSS for styling
- Axios for API calls

### Backend
- Node.js with Express
- SQLite database
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tutor-file-sharing
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start both the backend server (port 5000) and frontend development server (port 3000).

### Individual Services

**Backend only:**
```bash
npm run server
```

**Frontend only:**
```bash
npm run client
```

## Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
JWT_SECRET=your-very-secure-jwt-secret-key-here
NODE_ENV=development
```

For production, make sure to set `NODE_ENV=production` and use a strong JWT secret.

## Project Structure

```
tutor-file-sharing/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT authentication middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   └── files.js         # File management routes
│   ├── uploads/             # File storage directory
│   ├── database.js          # SQLite database setup
│   ├── server.js            # Express server configuration
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── context/         # React context for state management
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── App.js           # Main app component
│   │   ├── index.js         # React entry point
│   │   └── index.css        # TailwindCSS styles
│   └── package.json
└── package.json             # Root package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create admin account (Damesha only)
- `POST /api/auth/login` - Admin login

### Files
- `POST /api/files/upload` - Upload file (admin only)
- `GET /api/files/my-files` - Get admin's files (admin only)
- `GET /api/files/public` - Get all public files
- `GET /api/files/download/:id` - Download file
- `DELETE /api/files/:id` - Delete file (admin only)

### Student Submissions
- `POST /api/submissions/submit` - Submit resource (no auth required)
- `GET /api/submissions/pending` - Get pending submissions (admin only)
- `GET /api/submissions/all` - Get all submissions (admin only)
- `GET /api/submissions/download/:id` - Download submission (admin only)
- `POST /api/submissions/approve/:id` - Approve submission (admin only)
- `POST /api/submissions/reject/:id` - Reject submission (admin only)

## Deployment

### Railway Deployment

This application is configured for deployment on Railway. Here's how to deploy:

1. **Prepare for production**
   ```bash
   cd frontend
   npm run build
   ```

2. **Set environment variables on Railway:**
   - `NODE_ENV=production`
   - `JWT_SECRET=your-production-jwt-secret`
   - `PORT` (Railway will set this automatically)

3. **Deploy**
   - Connect your repository to Railway
   - Set the start command to: `npm start`
   - Railway will automatically build and deploy

### Other Platforms

For other platforms (Heroku, DigitalOcean, etc.):

1. **Build the frontend:**
   ```bash
   cd frontend && npm run build
   ```

2. **Set environment variables:**
   - `NODE_ENV=production`
   - `JWT_SECRET=strong-random-secret`
   - `PORT=5000` (or platform-specific)

3. **Start command:**
   ```bash
   npm start
   ```

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: PDF, Word, PowerPoint, Excel, images (JPG, PNG, GIF), text files

## Security Features

- Password hashing with bcryptjs
- JWT tokens for authentication
- Protected routes for tutor-only operations
- File type validation
- SQL injection prevention with parameterized queries

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the repository. 
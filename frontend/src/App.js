import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import PublicFilesPage from './pages/PublicFilesPage';
import StudentSubmissionPage from './pages/StudentSubmissionPage';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              {/* Multiple discrete tutor access routes */}
              <Route path="/damesha-admin-portal" element={<LoginPage />} />
              <Route path="/admin" element={<LoginPage />} />
              <Route path="/tutor" element={<LoginPage />} />
              <Route path="/secret-access" element={<LoginPage />} />
              <Route path="/hidden-portal" element={<LoginPage />} />
              <Route path="/teacher-login" element={<LoginPage />} />
              <Route path="/staff-access" element={<LoginPage />} />
              <Route path="/management" element={<LoginPage />} />
              <Route path="/control-panel" element={<LoginPage />} />
              
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/files" element={<PublicFilesPage />} />
              <Route path="/submit" element={<StudentSubmissionPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 
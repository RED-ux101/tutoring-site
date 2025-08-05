import React, { useState, useEffect, useRef, useCallback } from 'react';
import { filesAPI, submissionsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { 
  Upload, 
  FileText, 
  Download, 
  Trash2, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Search,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Bell,
  ArrowUpRight,
  CheckCheck,
  X,
  Activity,
  Zap,
  Sparkles,
  Edit3,
  Save
} from 'lucide-react';

const Dashboard = () => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSubmissions: 0,
    pendingSubmissions: 0,
    approvedToday: 0,
    totalDownloads: 0,
    storageUsed: 0
  });
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userName] = useState('Damesha');
  const [greeting, setGreeting] = useState('');
  const [renamingFile, setRenamingFile] = useState(null);
  const [newFileName, setNewFileName] = useState('');
  const [showRenameModal, setShowRenameModal] = useState(false);
  const fileInputRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good morning');
    } else if (hour < 17) {
      setGreeting('Good afternoon');
    } else {
      setGreeting('Good evening');
    }
  }, []);

  const addNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev.slice(0, 4)]); // Keep last 5
  }, []);

  const updateNotifications = useCallback(() => {
    // Clean up old notifications (older than 5 minutes)
    setNotifications(prev => prev.filter(n => 
      Date.now() - n.timestamp.getTime() < 5 * 60 * 1000
    ));
  }, []);

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await filesAPI.getMyFiles();
      setFiles(response.files || []);
    } catch (error) {
      setError('Failed to load files');
      console.error('Error loading files:', error);
      setFiles([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPendingSubmissions = useCallback(async () => {
    try {
      const response = await submissionsAPI.getPendingSubmissions();
      const newSubmissions = response.submissions || [];
      
      // Check for new submissions to trigger notifications
      if (submissions.length > 0 && newSubmissions.length > submissions.length) {
        const newCount = newSubmissions.length - submissions.length;
        addNotification(`${newCount} new submission${newCount > 1 ? 's' : ''} received!`, 'info');
      }
      
      setSubmissions(newSubmissions);
    } catch (error) {
      console.error('Error loading submissions:', error);
      setSubmissions([]);
    }
  }, [submissions.length, addNotification]);

  const loadStats = useCallback(async () => {
    try {
      // Load comprehensive stats
      const [filesRes, submissionsRes] = await Promise.all([
        fetch('https://tutoring-site-production-30eb.up.railway.app/api/files/my-files', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('tutorToken')}` }
        }),
        fetch('https://tutoring-site-production-30eb.up.railway.app/api/submissions/all', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('tutorToken')}` }
        })
      ]);

      if (filesRes.ok && submissionsRes.ok) {
        const filesData = await filesRes.json();
        const submissionsData = await submissionsRes.json();
        
        const files = filesData.files || [];
        const submissions = submissionsData.submissions || [];
        
        const today = new Date().toDateString();
        const approvedToday = submissions.filter(s => 
          s.status === 'approved' && new Date(s.approved_at).toDateString() === today
        ).length;

        const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0);

        setStats({
          totalFiles: files.length,
          totalSubmissions: submissions.length,
          pendingSubmissions: submissions.filter(s => s.status === 'pending').length,
          approvedToday,
          totalDownloads: Math.floor(Math.random() * 1000) + 500, // Simulated for demo
          storageUsed: totalSize
        });
      } else {
        console.error('Failed to load stats:', { filesRes: filesRes.status, submissionsRes: submissionsRes.status });
        // Set default stats on error
        setStats({
          totalFiles: 0,
          totalSubmissions: 0,
          pendingSubmissions: 0,
          approvedToday: 0,
          totalDownloads: 0,
          storageUsed: 0
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
      // Set default stats on error
      setStats({
        totalFiles: 0,
        totalSubmissions: 0,
        pendingSubmissions: 0,
        approvedToday: 0,
        totalDownloads: 0,
        storageUsed: 0
      });
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
    const token = localStorage.getItem('tutorToken');
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setLoading(false);
      return;
    }
    
    await Promise.all([
      loadFiles(),
      loadPendingSubmissions(),
      loadStats()
    ]);
  }, [loadFiles, loadPendingSubmissions, loadStats]);

  useEffect(() => {
    loadDashboardData();
    
    // Set up periodic refresh for real-time updates
    const interval = setInterval(() => {
      loadPendingSubmissions();
      updateNotifications();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [loadDashboardData, loadPendingSubmissions, updateNotifications]);

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await filesAPI.uploadFile(file, selectedCategory);
      setSuccess(`${file.name} uploaded successfully!`);
      addNotification(`File "${file.name}" uploaded successfully!`, 'success');
      loadFiles();
      loadStats(); // Update stats after successful upload
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload file');
      addNotification('Failed to upload file', 'warning');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
    e.target.value = '';
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDeleteFile = async (fileId, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        await filesAPI.deleteFile(fileId);
        addNotification(`File "${fileName}" deleted successfully`, 'success');
        loadFiles(); // Reload files
        loadStats(); // Reload stats
      } catch (error) {
        console.error('Error deleting file:', error);
        addNotification('Failed to delete file', 'error');
      }
    }
  };

  const handleRenameFile = async (fileId, currentName) => {
    setRenamingFile({ id: fileId, name: currentName, type: 'file' });
    setNewFileName(currentName);
    setShowRenameModal(true);
  };

  const handleSaveRename = async () => {
    console.log('🔧 Starting rename process...');
    console.log('🔧 Renaming file:', renamingFile);
    console.log('🔧 New name:', newFileName);
    
    if (!newFileName.trim()) {
      console.log('❌ Name is empty');
      addNotification('Name cannot be empty', 'error');
      return;
    }

    try {
      console.log('🔧 Checking file type:', renamingFile.type);
      
      if (renamingFile.type === 'submission') {
        console.log('🔧 Renaming submission...');
        // Rename submission
        await submissionsAPI.renameSubmission(renamingFile.id, newFileName.trim());
        console.log('✅ Submission renamed successfully');
        addNotification(`Submission renamed to "${newFileName.trim()}" successfully`, 'success');
        loadPendingSubmissions();
      } else {
        console.log('🔧 Renaming file...');
        // Rename file
        await filesAPI.renameFile(renamingFile.id, newFileName.trim());
        console.log('✅ File renamed successfully');
        addNotification(`File renamed to "${newFileName.trim()}" successfully`, 'success');
        loadFiles();
      }
      
      console.log('🔧 Closing modal...');
      setShowRenameModal(false);
      setRenamingFile(null);
      setNewFileName('');
      console.log('✅ Rename process completed');
    } catch (error) {
      console.error('❌ Error during rename:', error);
      addNotification('Failed to rename', 'error');
    }
  };

  const handleCancelRename = () => {
    setShowRenameModal(false);
    setRenamingFile(null);
    setNewFileName('');
  };

  const handleApproveSubmission = async (submissionId, fileName) => {
    try {
      await submissionsAPI.approveSubmission(submissionId);
      setSuccess('Submission approved and added to public files!');
      addNotification(`Submission "${fileName}" approved!`, 'success');
      loadPendingSubmissions();
      loadFiles();
      loadStats(); // Update stats after successful approval
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to approve submission');
      addNotification('Failed to approve submission', 'warning');
    }
  };

  const handleRejectSubmission = async (submissionId, fileName) => {
    const reason = window.prompt(`Why are you rejecting "${fileName}"? (Optional)`);
    if (reason === null) return;

    try {
      await submissionsAPI.rejectSubmission(submissionId, reason);
      setSuccess('Submission rejected');
      addNotification(`Submission "${fileName}" rejected`, 'info');
      loadPendingSubmissions();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to reject submission');
      addNotification('Failed to reject submission', 'warning');
    }
  };

  const handleRenameSubmission = async (submissionId, currentName) => {
    setRenamingFile({ id: submissionId, name: currentName, type: 'submission' });
    setNewFileName(currentName);
    setShowRenameModal(true);
  };

  const handleSaveRenameSubmission = async () => {
    if (!newFileName.trim()) {
      addNotification('Submission name cannot be empty', 'error');
      return;
    }

    try {
      await filesAPI.renameSubmission(renamingFile.id, newFileName.trim());
      addNotification(`Submission renamed to "${newFileName.trim()}" successfully`, 'success');
      setShowRenameModal(false);
      setRenamingFile(null);
      setNewFileName('');
      loadPendingSubmissions();
    } catch (error) {
      console.error('Error renaming submission:', error);
      addNotification('Failed to rename submission', 'error');
    }
  };

  const handleCancelRenameSubmission = () => {
    setShowRenameModal(false);
    setRenamingFile(null);
    setNewFileName('');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (mimeType.includes('word')) {
      return <FileText className="w-6 h-6 text-blue-500" />;
    } else if (mimeType.includes('image')) {
      return <FileText className="w-6 h-6 text-green-500" />;
    } else {
      return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" text="Loading your dashboard..." />
          <div className="mt-4 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 inline mr-2 animate-pulse" />
            Preparing your workspace...
          </div>
        </div>
      </div>
    );
  }

  // Additional helper functions
  const formatStorageUsed = (bytes) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const filteredSubmissions = submissions.filter(submission =>
    submission.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBulkApprove = async () => {
    if (selectedSubmissions.length === 0) {
      addNotification('No submissions selected', 'warning');
      return;
    }

    if (!window.confirm(`Approve ${selectedSubmissions.length} submissions?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedSubmissions.map(id => submissionsAPI.approveSubmission(id))
      );
      
      addNotification(`${selectedSubmissions.length} submissions approved`, 'success');
      setSelectedSubmissions([]);
      loadDashboardData();
    } catch (error) {
      setError('Failed to approve submissions');
      addNotification('Failed to approve submissions', 'warning');
    }
  };

  const handleBulkReject = async () => {
    if (selectedSubmissions.length === 0) {
      addNotification('No submissions selected', 'warning');
      return;
    }

    if (!window.confirm(`Reject ${selectedSubmissions.length} submissions?`)) {
      return;
    }
    
    const reason = window.prompt(`Reason for rejecting ${selectedSubmissions.length} submissions?`);
    if (reason === null) return;

    try {
      await Promise.all(
        selectedSubmissions.map(id => submissionsAPI.rejectSubmission(id, reason))
      );
      
      addNotification(`${selectedSubmissions.length} submissions rejected`, 'info');
      setSelectedSubmissions([]);
      loadDashboardData();
    } catch (error) {
      setError('Failed to reject submissions');
      addNotification('Failed to reject submissions', 'warning');
    }
  };

  const toggleSubmissionSelection = (submissionId) => {
    setSelectedSubmissions(prev =>
      prev.includes(submissionId)
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                {greeting}, {userName}!
              </h1>
              <p className="text-sm text-muted-foreground">
                Here's what's happening with your learning hub today
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-4 h-4 mr-1" />
                  {notifications.length > 0 && (
                    <Badge variant="destructive" className="px-1 py-0 text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
                
                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 top-12 w-80 bg-background border rounded-lg shadow-xl z-50 p-4">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Recent Activity
                    </h3>
                    {notifications.map(notification => (
                      <div key={notification.id} className="mb-3 p-3 bg-muted rounded-lg text-sm border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-2">
                          {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
                          {notification.type === 'info' && <Bell className="w-4 h-4 text-blue-500" />}
                          {notification.type === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
                          <span className="font-medium">{notification.message}</span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {notification.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card variant="plain">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.approvedToday}</div>
                <Zap className="w-5 h-5 text-primary" />
              </CardContent>
            </Card>
            <Card variant="plain">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.pendingSubmissions}</div>
                <Clock className="w-5 h-5 text-primary" />
              </CardContent>
            </Card>
            <Card variant="plain">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.totalFiles}</div>
                <FileText className="w-5 h-5 text-primary" />
              </CardContent>
            </Card>
            <Card variant="plain">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-2xl font-bold">{formatStorageUsed(stats.storageUsed)}</div>
                <BarChart3 className="w-5 h-5 text-primary" />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">Total Files</CardTitle>
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.totalFiles}</div>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" />
                Available for students
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-yellow-500 bg-gradient-to-br from-yellow-50 to-yellow-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-700">Pending Reviews</CardTitle>
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Clock className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingSubmissions}</div>
              <p className="text-xs text-yellow-600">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">Total Downloads</CardTitle>
              <div className="p-2 bg-green-500 rounded-lg">
                <Download className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.totalDownloads}</div>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                All time
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">Storage Used</CardTitle>
              <div className="p-2 bg-purple-500 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{formatStorageUsed(stats.storageUsed)}</div>
              <p className="text-xs text-purple-600">
                Approved today: {stats.approvedToday}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        {error && (
          <Card className="mb-6 border-destructive bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-500 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Upload Section */}
        <Card className="mb-8" variant="plain">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Material
            </CardTitle>
            <CardDescription>
              Add study materials, resources, or educational content for your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-primary/60 bg-primary/5'
                  : 'border-input hover:bg-muted/40'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <div className="space-y-4">
                  <LoadingSpinner size="medium" text="Uploading file..." />
                  <div className="text-sm text-muted-foreground">
                    <Zap className="w-4 h-4 inline mr-2 animate-pulse" />
                    Processing your file...
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                    <Upload className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">
                    {dragActive ? 'Drop your file here' : 'Upload a file'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop or click to select • Max 10MB
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      PDFs
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Word docs
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Images
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                </>
              )}
            </div>
            
            {/* Category Selector */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (Optional)
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
              >
                <option value="">No Category</option>
                <option value="year7">Year 7 Math</option>
                <option value="year8">Year 8 Math</option>
                <option value="year9">Year 9 Math</option>
                <option value="year10">Year 10 Math</option>
                <option value="year11">Year 11 Math</option>
                <option value="as-pure">AS Pure Math</option>
                <option value="as-applied">AS Applied Math</option>
                <option value="as-stats">AS Statistics</option>
                <option value="as-mechanics">AS Mechanics</option>
                <option value="a2-pure">A2 Pure Math</option>
                <option value="a2-applied">A2 Applied Math</option>
                <option value="a2-stats">A2 Statistics</option>
                <option value="a2-mechanics">A2 Mechanics</option>
                <option value="further">Further Math</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Categorizing files helps students find specific topics more easily
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pending Submissions */}
        {submissions.length > 0 && (
          <Card className="mb-8" variant="plain">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Pending Submissions ({filteredSubmissions.length} of {submissions.length})
                  </CardTitle>
                  <CardDescription>
                    Review and approve student-submitted resources
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  {/* Bulk Actions */}
                  {selectedSubmissions.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkApprove}
                      >
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Approve ({selectedSubmissions.length})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkReject}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject ({selectedSubmissions.length})
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader sticky>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedSubmissions.length === filteredSubmissions.length && filteredSubmissions.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSubmissions(filteredSubmissions.map(s => s.id));
                          } else {
                            setSelectedSubmissions([]);
                          }
                        }}
                        className="rounded"
                      />
                    </TableHead>
                    <TableHead>File & Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.map((submission) => (
                    <TableRow 
                      key={submission.id} 
                      className={`hover:bg-yellow-50/30 transition-all duration-200 ${
                        selectedSubmissions.includes(submission.id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedSubmissions.includes(submission.id)}
                          onChange={() => toggleSubmissionSelection(submission.id)}
                          className="rounded"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {getFileIcon(submission.mimeType)}
                          <div>
                            <div className="font-medium">{submission.originalName}</div>
                            <div className="text-sm text-muted-foreground">
                              by {submission.studentName}
                            </div>
                            {submission.description && (
                              <div className="text-xs text-muted-foreground mt-1 max-w-xs">
                                {submission.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize bg-yellow-100 text-yellow-800">
                          {submission.category.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatFileSize(submission.size)}</TableCell>
                      <TableCell>{formatDate(submission.submittedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-blue-50"
                          >
                            <a
                              href={`/api/submissions/download/${submission.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRenameSubmission(submission.id, submission.originalName)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApproveSubmission(submission.id, submission.originalName)}
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectSubmission(submission.id, submission.originalName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Files List */}
        <Card variant="plain">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Files ({files ? files.length : 0})
            </CardTitle>
            <CardDescription>
              Manage all your uploaded study materials and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!files || files.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-3 bg-muted rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                  <FileText className="w-7 h-7 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No files uploaded yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Upload your first file using the upload area above to get started! Your files will appear here once uploaded.
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First File
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} className="hover:bg-muted/40 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.mimeType)}
                          <div>
                            <div className="font-medium">{file.originalName}</div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {file.mimeType.split('/')[1]} file
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-green-50"
                          >
                            <a
                              href={filesAPI.getDownloadUrl(file.id)}
                              download
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRenameFile(file.id, file.originalName)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteFile(file.id, file.originalName)}
                            className=""
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rename File Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Rename File</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelRename}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New File Name
              </label>
              <Input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Enter new file name"
                className="w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveRename();
                  } else if (e.key === 'Escape') {
                    handleCancelRename();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancelRename}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRename}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Submission Modal */}
      {showRenameModal && renamingFile && renamingFile.type === 'submission' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Rename Submission</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelRenameSubmission}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Submission Name
              </label>
              <Input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Enter new submission name"
                className="w-full"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveRenameSubmission();
                  } else if (e.key === 'Escape') {
                    handleCancelRenameSubmission();
                  }
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={handleCancelRenameSubmission}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveRenameSubmission}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { filesAPI } from '../services/api';
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
  Users,
  BookOpen,
  Star,
  Activity,
  Zap,
  Sparkles
} from 'lucide-react';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
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
  const [userName, setUserName] = useState('Damesha');
  const [greeting, setGreeting] = useState('');
  const fileInputRef = useRef(null);

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
      setFiles(response.files);
    } catch (error) {
      setError('Failed to load files');
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPendingSubmissions = useCallback(async () => {
    try {
      const response = await fetch('/api/submissions/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tutorToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        const newSubmissions = data.submissions;
        
        // Check for new submissions to trigger notifications
        if (submissions.length > 0 && newSubmissions.length > submissions.length) {
          const newCount = newSubmissions.length - submissions.length;
          addNotification(`${newCount} new submission${newCount > 1 ? 's' : ''} received!`, 'info');
        }
        
        setSubmissions(newSubmissions);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  }, [submissions.length, addNotification]);

  const loadStats = useCallback(async () => {
    try {
      // Load comprehensive stats
      const [filesRes, submissionsRes] = await Promise.all([
        fetch('/api/files/my-files', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('tutorToken')}` }
        }),
        fetch('/api/submissions/all', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('tutorToken')}` }
        })
      ]);

      if (filesRes.ok && submissionsRes.ok) {
        const filesData = await filesRes.json();
        const submissionsData = await submissionsRes.json();
        
        const today = new Date().toDateString();
        const approvedToday = submissionsData.submissions.filter(s => 
          s.status === 'approved' && new Date(s.approved_at).toDateString() === today
        ).length;

        const totalSize = filesData.files.reduce((acc, file) => acc + file.size, 0);

        setStats({
          totalFiles: filesData.files.length,
          totalSubmissions: submissionsData.submissions.length,
          pendingSubmissions: submissionsData.submissions.filter(s => s.status === 'pending').length,
          approvedToday,
          totalDownloads: Math.floor(Math.random() * 1000) + 500, // Simulated for demo
          storageUsed: totalSize
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const loadDashboardData = useCallback(async () => {
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
      await filesAPI.uploadFile(file);
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
    if (!window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await filesAPI.deleteFile(fileId);
      setSuccess('File deleted successfully!');
      addNotification(`File "${fileName}" deleted successfully!`, 'success');
      loadFiles();
      loadStats(); // Update stats after successful deletion
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete file');
      addNotification('Failed to delete file', 'warning');
    }
  };

  const handleApproveSubmission = async (submissionId, fileName) => {
    if (!window.confirm(`Approve "${fileName}" and add it to public files?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/submissions/approve/${submissionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tutorToken')}`
        }
      });

      if (response.ok) {
        setSuccess('Submission approved and added to public files!');
        addNotification(`Submission "${fileName}" approved!`, 'success');
        loadPendingSubmissions();
        loadFiles();
        loadStats(); // Update stats after successful approval
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to approve submission');
        addNotification('Failed to approve submission', 'warning');
      }
    } catch (error) {
      setError('Failed to approve submission');
      addNotification('Failed to approve submission', 'warning');
    }
  };

  const handleRejectSubmission = async (submissionId, fileName) => {
    const reason = window.prompt(`Why are you rejecting "${fileName}"? (Optional)`);
    if (reason === null) return;

    try {
      const response = await fetch(`/api/submissions/reject/${submissionId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tutorToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      });

      if (response.ok) {
        setSuccess('Submission rejected');
        addNotification(`Submission "${fileName}" rejected`, 'info');
        loadPendingSubmissions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to reject submission');
        addNotification('Failed to reject submission', 'warning');
      }
    } catch (error) {
      setError('Failed to reject submission');
      addNotification('Failed to reject submission', 'warning');
    }
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
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
    if (selectedSubmissions.length === 0) return;
    
    if (!window.confirm(`Approve ${selectedSubmissions.length} selected submissions?`)) {
      return;
    }

    try {
      await Promise.all(
        selectedSubmissions.map(id =>
          fetch(`/api/submissions/approve/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('tutorToken')}` }
          })
        )
      );
      
      addNotification(`${selectedSubmissions.length} submissions approved!`, 'success');
      setSelectedSubmissions([]);
      loadDashboardData();
    } catch (error) {
      setError('Failed to approve submissions');
      addNotification('Failed to approve submissions', 'warning');
    }
  };

  const handleBulkReject = async () => {
    if (selectedSubmissions.length === 0) return;
    
    const reason = window.prompt(`Reason for rejecting ${selectedSubmissions.length} submissions?`);
    if (reason === null) return;

    try {
      await Promise.all(
        selectedSubmissions.map(id =>
          fetch(`/api/submissions/reject/${id}`, {
            method: 'POST',
            headers: { 
              'Authorization': `Bearer ${localStorage.getItem('tutorToken')}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ reason })
          })
        )
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Header with Welcome Message */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {greeting}, {userName}!
                  </h1>
                  <p className="text-lg text-muted-foreground">
                    Here's what's happening with your learning hub today
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="flex items-center gap-2 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200"
                >
                  <Bell className="w-4 h-4" />
                  {notifications.length > 0 && (
                    <Badge variant="destructive" className="px-1 py-0 text-xs animate-pulse">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
                
                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 top-12 w-80 bg-background border rounded-lg shadow-xl z-50 p-4 animate-in slide-in-from-top-2">
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
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Activity</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.approvedToday}</p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingSubmissions}</p>
                </div>
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFiles}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border border-white/20 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Storage Used</p>
                  <p className="text-2xl font-bold text-gray-900">{formatStorageUsed(stats.storageUsed)}</p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
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
        <Card className="mb-8 shadow-lg border-0 bg-gradient-to-r from-white to-blue-50/30">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload New Material
            </CardTitle>
            <CardDescription className="text-blue-100">
              Add study materials, resources, or educational content for your students
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50 scale-105' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 hover:scale-[1.02]'
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
                  <div className="p-4 bg-blue-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {dragActive ? 'Drop your file here' : 'Upload a file'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Drag and drop or click to select • Max 10MB
                  </p>
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
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
          </CardContent>
        </Card>

        {/* Enhanced Pending Submissions */}
        {submissions.length > 0 && (
          <Card className="mb-8 shadow-xl border-0 bg-gradient-to-r from-white to-yellow-50/30">
            <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Pending Submissions ({filteredSubmissions.length} of {submissions.length})
                  </CardTitle>
                  <CardDescription className="text-yellow-100">
                    Review and approve student-submitted resources
                  </CardDescription>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search submissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 bg-white/90 border-white/50 text-gray-800 placeholder-gray-500"
                    />
                  </div>
                  
                  {/* Bulk Actions */}
                  {selectedSubmissions.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkApprove}
                        className="text-green-600 hover:text-green-700 bg-white/90 hover:bg-green-50 border-white/50"
                      >
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Approve ({selectedSubmissions.length})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkReject}
                        className="text-red-600 hover:text-red-700 bg-white/90 hover:bg-red-50 border-white/50"
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
                <TableHeader>
                  <TableRow className="bg-yellow-50/50">
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
        <Card className="shadow-xl border-0 bg-gradient-to-r from-white to-gray-50/30">
          <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Files ({files.length})
            </CardTitle>
            <CardDescription className="text-gray-200">
              Manage all your uploaded study materials and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {files.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No files uploaded yet</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  Upload your first file using the upload area above to get started! Your files will appear here once uploaded.
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Your First File
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead>File</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} className="hover:bg-gray-50/30 transition-colors">
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
                            onClick={() => handleDeleteFile(file.id, file.originalName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
    </div>
  );
};

export default Dashboard; 
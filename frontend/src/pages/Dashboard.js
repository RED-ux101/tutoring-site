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
  RefreshCw,
  Bell,
  CheckCheck,
  X,
  Activity,
  Zap,
  Sparkles,
  Edit3,
  Save,
  Calculator,
  Book,
  GraduationCap,
  Star,
  Layers
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

  // Enhanced category configuration with better organization
  const categories = [
    {
      id: '',
      label: 'No Category',
      icon: Layers,
      color: 'gray',
      description: 'General resources'
    },
    {
      id: 'year7',
      label: 'Year 7 Math',
      icon: Calculator,
      color: 'blue',
      description: 'Foundation mathematics'
    },
    {
      id: 'year8',
      label: 'Year 8 Math',
      icon: Calculator,
      color: 'blue',
      description: 'Core mathematics'
    },
    {
      id: 'year9',
      label: 'Year 9 Math',
      icon: Calculator,
      color: 'blue',
      description: 'Pre-GCSE mathematics'
    },
    {
      id: 'year10',
      label: 'Year 10 Math',
      icon: Calculator,
      color: 'blue',
      description: 'GCSE preparation'
    },
    {
      id: 'year11',
      label: 'Year 11 Math',
      icon: Calculator,
      color: 'blue',
      description: 'GCSE revision'
    },
    {
      id: 'as-pure',
      label: 'AS Pure Math',
      icon: Book,
      color: 'green',
      description: 'Advanced concepts'
    },
    {
      id: 'as-applied',
      label: 'AS Applied Math',
      icon: Book,
      color: 'green',
      description: 'Applied mathematics'
    },
    {
      id: 'as-stats',
      label: 'AS Statistics',
      icon: Book,
      color: 'green',
      description: 'Statistical analysis'
    },
    {
      id: 'as-mechanics',
      label: 'AS Mechanics',
      icon: Book,
      color: 'green',
      description: 'Mechanical systems'
    },
    {
      id: 'a2-pure',
      label: 'A2 Pure Math',
      icon: GraduationCap,
      color: 'purple',
      description: 'Advanced pure math'
    },
    {
      id: 'a2-applied',
      label: 'A2 Applied Math',
      icon: GraduationCap,
      color: 'purple',
      description: 'Advanced applied math'
    },
    {
      id: 'a2-stats',
      label: 'A2 Statistics',
      icon: GraduationCap,
      color: 'purple',
      description: 'Advanced statistics'
    },
    {
      id: 'a2-mechanics',
      label: 'A2 Mechanics',
      icon: GraduationCap,
      color: 'purple',
      description: 'Advanced mechanics'
    },
    {
      id: 'further',
      label: 'Further Math',
      icon: Star,
      color: 'orange',
      description: 'Further mathematics'
    }
  ];

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
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4 animate-fadeIn">
                <Sparkles className="w-4 h-4" />
                Tutor Dashboard
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                <span className="text-gradient-primary">{greeting}, {userName}!</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Here's what's happening with your learning hub today
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                className="bg-white/70 backdrop-blur-xl hover:bg-white/90 dark:bg-slate-800/70 dark:hover:bg-slate-800/90"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="bg-white/70 backdrop-blur-xl hover:bg-white/90 dark:bg-slate-800/70 dark:hover:bg-slate-800/90"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {notifications.length > 0 && (
                    <Badge variant="destructive" className="px-1 py-0 text-xs">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
                
                {showNotifications && notifications.length > 0 && (
                  <div className="absolute right-0 top-12 w-80 bg-white/90 backdrop-blur-xl border rounded-lg shadow-xl z-50 p-4 dark:bg-slate-800/90">
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

          {/* Enhanced Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <Card className="border-0 bg-white/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300 dark:bg-slate-800/70">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl mx-auto mb-3">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.approvedToday}</div>
                <div className="text-sm text-muted-foreground">Today's Activity</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300 dark:bg-slate-800/70">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl mx-auto mb-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.pendingSubmissions}</div>
                <div className="text-sm text-muted-foreground">Pending Reviews</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300 dark:bg-slate-800/70">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl mx-auto mb-3">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.totalFiles}</div>
                <div className="text-sm text-muted-foreground">Total Files</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 bg-white/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300 dark:bg-slate-800/70">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{formatStorageUsed(stats.storageUsed)}</div>
                <div className="text-sm text-muted-foreground">Storage Used</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">



        {/* Messages */}
        {error && (
          <Card className="mb-6 border-0 bg-red-50/80 backdrop-blur-xl dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-0 bg-green-50/80 backdrop-blur-xl dark:bg-green-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Enhanced Upload Section */}
        <Card className="mb-8 border-0 bg-white/70 backdrop-blur-xl shadow-xl dark:bg-slate-800/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Upload className="h-5 w-5" />
              Upload New Material
            </CardTitle>
            <CardDescription className="text-base">
              Add study materials, resources, or educational content for your students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-blue-500/60 bg-blue-500/5'
                  : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/40'
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
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {dragActive ? 'Drop your file here' : 'Upload a file'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Drag and drop or click to select • Max 10MB
                  </p>
                  <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
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
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Select Category (Optional)
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Categorizing files helps students find specific topics more easily
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  const isActive = selectedCategory === category.id;
                  const colorVariants = {
                    blue: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
                    green: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
                    purple: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
                    orange: 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
                    gray: 'border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
                  };
                  
                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
                        isActive 
                          ? colorVariants[category.color]
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-3 text-center">
                        <div className={`w-10 h-10 mx-auto mb-2 rounded-lg flex items-center justify-center ${
                          isActive 
                            ? 'bg-white/80 dark:bg-slate-800/80' 
                            : 'bg-gray-50 dark:bg-slate-800'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            isActive ? `text-${category.color}-600` : 'text-gray-500'
                          }`} />
                        </div>
                        <h4 className="font-semibold text-xs mb-1">{category.label}</h4>
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Pending Submissions */}
        {submissions.length > 0 && (
          <Card className="mb-8 border-0 bg-white/70 backdrop-blur-xl shadow-xl dark:bg-slate-800/70">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertCircle className="h-5 w-5" />
                    Pending Submissions ({filteredSubmissions.length} of {submissions.length})
                  </CardTitle>
                  <CardDescription className="text-base">
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
                        className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                      >
                        <CheckCheck className="w-4 h-4 mr-1" />
                        Approve ({selectedSubmissions.length})
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleBulkReject}
                        className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
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
        <Card className="border-0 bg-white/70 backdrop-blur-xl shadow-xl dark:bg-slate-800/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5" />
              Your Files ({files ? files.length : 0})
            </CardTitle>
            <CardDescription className="text-base">
              Manage all your uploaded study materials and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {!files || files.length === 0 ? (
              <div className="text-center py-16">
                <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No files uploaded yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Upload your first file using the upload area above to get started! Your files will appear here once uploaded.
                </p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
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
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { filesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
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
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [submissions, setSubmissions] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
    loadPendingSubmissions();
  }, []);

  const loadFiles = async () => {
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
  };

  const loadPendingSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('tutorToken')}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      await filesAPI.uploadFile(file);
      setSuccess(`${file.name} uploaded successfully!`);
      loadFiles();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to upload file');
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
      loadFiles();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to delete file');
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
        loadPendingSubmissions();
        loadFiles();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to approve submission');
      }
    } catch (error) {
      setError('Failed to approve submission');
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
        loadPendingSubmissions();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to reject submission');
      }
    } catch (error) {
      setError('Failed to reject submission');
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Damesha! Manage your learning hub below.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files.length}</div>
              <p className="text-xs text-muted-foreground">
                Available for students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting review
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Messages */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                {success}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Section */}
        <Card className="mb-8">
          <CardHeader>
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
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <LoadingSpinner size="medium" text="Uploading file..." />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    {dragActive ? 'Drop your file here' : 'Upload a file'}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop or click to select • Max 10MB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports PDFs, Word docs, PowerPoint, Excel, images, and text files
                  </p>
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

        {/* Pending Submissions */}
        {submissions.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="bg-yellow-50 border-b">
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertCircle className="h-5 w-5" />
                Pending Submissions ({submissions.length})
              </CardTitle>
              <CardDescription className="text-yellow-700">
                Review and approve student-submitted resources
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File & Student</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
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
                        <Badge variant="secondary" className="capitalize">
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
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectSubmission(submission.id, submission.originalName)}
                            className="text-red-600 hover:text-red-700"
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

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Your Files ({files.length})
            </CardTitle>
            <CardDescription>
              Manage all your uploaded study materials and resources
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {files.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
                <p className="text-muted-foreground mb-4">
                  Upload your first file using the upload area above to get started!
                </p>
                <Button onClick={() => fileInputRef.current?.click()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload File
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
                    <TableRow key={file.id}>
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
                            className="text-red-600 hover:text-red-700"
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
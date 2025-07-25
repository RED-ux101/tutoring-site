import React, { useState, useEffect } from 'react';
import { filesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { 
  FileText, 
  Download, 
  Search,
  BookOpen,
  AlertCircle,
  Calendar,
  User,
  HardDriveIcon
} from 'lucide-react';

const PublicFilesPage = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await filesAPI.getPublicFiles();
      setFiles(response.files);
    } catch (error) {
      setError('Failed to load files');
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
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

  const getFileTypeLabel = (mimeType) => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word')) return 'Word';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'PowerPoint';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Excel';
    if (mimeType.includes('image')) return 'Image';
    return 'Document';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading files..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Study Materials
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Browse and download educational resources from Damesha's learning hub. 
            All materials are available for free download without registration.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Files</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{files.length}</div>
              <p className="text-xs text-muted-foreground">
                Available for download
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">File Types</CardTitle>
              <HardDriveIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(files.map(file => getFileTypeLabel(file.mimeType))).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Different formats
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Latest Upload</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {files.length > 0 ? 'Today' : 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                Most recent file
              </p>
            </CardContent>
          </Card>
        </div>

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

        {/* Files List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Available Study Materials
            </CardTitle>
            <CardDescription>
              Click the download button to access any file instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {files.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No files available</h3>
                <p className="text-muted-foreground mb-6">
                  {error ? 
                    "Unable to load files at the moment. Please try again later." :
                    "There are no study materials shared yet. Check back later for new resources!"
                  }
                </p>
                {!error && (
                  <Button asChild>
                    <a href="/submit">
                      Contribute the first resource
                    </a>
                  </Button>
                )}
                {error && (
                  <Button onClick={loadFiles}>
                    Try Again
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Shared by</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.mimeType)}
                          <div>
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {file.originalName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {file.originalName.split('.').pop()?.toUpperCase()} file
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {getFileTypeLabel(file.mimeType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{file.tutorName}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatFileSize(file.size)}</TableCell>
                      <TableCell>{formatDate(file.uploadedAt)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        >
                          <a
                            href={filesAPI.getDownloadUrl(file.id)}
                            download
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Call to Action */}
        {files.length > 0 && (
          <Card className="mt-8 bg-primary text-primary-foreground">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Have something to share?</h3>
                <p className="text-primary-foreground/80 mb-4">
                  Help grow our learning community by contributing your own study materials.
                </p>
                <Button variant="secondary" asChild>
                  <a href="/submit">
                    Submit a Resource
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PublicFilesPage; 
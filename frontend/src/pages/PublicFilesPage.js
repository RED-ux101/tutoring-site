import React, { useState, useEffect, useCallback } from 'react';
import { filesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Input } from '../components/ui/input';
import { 
  FileText, 
  Download, 
  Search,
  BookOpen,
  AlertCircle,
  User,
  Grid,
  List,
  Star,
  Clock,
  Calculator,
  Book,
  GraduationCap
} from 'lucide-react';

const PublicFilesPage = () => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [selectedMathTab, setSelectedMathTab] = useState('year7'); // Default to Year 7
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    categories: []
  });

  // Math subject tabs configuration
  const mathTabs = [
    { id: 'year7', label: 'Year 7 Math', icon: Calculator, color: 'blue' },
    { id: 'year8', label: 'Year 8 Math', icon: Calculator, color: 'blue' },
    { id: 'year9', label: 'Year 9 Math', icon: Calculator, color: 'blue' },
    { id: 'year10', label: 'Year 10 Math', icon: Calculator, color: 'blue' },
    { id: 'year11', label: 'Year 11 Math', icon: Calculator, color: 'blue' },
    { id: 'as-pure', label: 'AS Pure Math', icon: Book, color: 'green' },
    { id: 'as-applied', label: 'AS Applied Math', icon: Book, color: 'green' },
    { id: 'as-stats', label: 'AS Statistics', icon: Book, color: 'green', parent: 'as-applied' },
    { id: 'as-mechanics', label: 'AS Mechanics', icon: Calculator, color: 'green', parent: 'as-applied' },
    { id: 'a2-pure', label: 'A2 Pure Math', icon: GraduationCap, color: 'purple' },
    { id: 'a2-applied', label: 'A2 Applied Math', icon: GraduationCap, color: 'purple' },
    { id: 'a2-stats', label: 'A2 Statistics', icon: Book, color: 'purple', parent: 'a2-applied' },
    { id: 'a2-mechanics', label: 'A2 Mechanics', icon: Calculator, color: 'purple', parent: 'a2-applied' },
    { id: 'further', label: 'Further Math', icon: Star, color: 'orange' }
  ];

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await filesAPI.getPublicFiles();
      const filesData = response.files || [];
      setFiles(filesData);
      
      // Calculate stats
      const categories = [...new Set(filesData.map(file => getFileTypeLabel(file.mimeType)))];
      setStats({
        totalFiles: filesData.length,
        totalDownloads: filesData.reduce((acc, file) => acc + (file.downloads || Math.floor(Math.random() * 100)), 0),
        categories: categories
      });
    } catch (error) {
      setError('Failed to load files');
      console.error('Error loading files:', error);
      setFiles([]); // Set empty array on error
      setStats({
        totalFiles: 0,
        totalDownloads: 0,
        categories: []
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  // Filter and sort files
  const filteredAndSortedFiles = (files || [])
    .filter(file => {
      const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || getFileTypeLabel(file.mimeType).toLowerCase() === selectedCategory.toLowerCase();
      
      // Math subject filtering
      let matchesMathSubject = true; // Default to true if no math filtering
      
      if (selectedMathTab && selectedMathTab !== 'all') {
        const fileCategory = file.category ? file.category.toLowerCase() : '';
        const fileName = file.originalName.toLowerCase();
        
        // Check if file matches the selected math tab
        if (selectedMathTab.includes('year')) {
          // Year 7-11 filtering
          matchesMathSubject = fileCategory.includes(selectedMathTab) || fileName.includes(selectedMathTab);
        } else if (selectedMathTab.includes('as-')) {
          // AS Level filtering
          if (selectedMathTab === 'as-pure') {
            matchesMathSubject = (fileCategory.includes('as') && fileCategory.includes('pure')) || 
                               (fileName.includes('as') && fileName.includes('pure'));
          } else if (selectedMathTab === 'as-applied') {
            matchesMathSubject = (fileCategory.includes('as') && fileCategory.includes('applied')) || 
                               (fileName.includes('as') && fileName.includes('applied'));
          } else if (selectedMathTab === 'as-stats') {
            matchesMathSubject = (fileCategory.includes('as') && fileCategory.includes('stat')) || 
                               (fileName.includes('as') && fileName.includes('stat'));
          } else if (selectedMathTab === 'as-mechanics') {
            matchesMathSubject = (fileCategory.includes('as') && fileCategory.includes('mechanic')) || 
                               (fileName.includes('as') && fileName.includes('mechanic'));
          }
        } else if (selectedMathTab.includes('a2-')) {
          // A2 Level filtering
          if (selectedMathTab === 'a2-pure') {
            matchesMathSubject = (fileCategory.includes('a2') && fileCategory.includes('pure')) || 
                               (fileName.includes('a2') && fileName.includes('pure'));
          } else if (selectedMathTab === 'a2-applied') {
            matchesMathSubject = (fileCategory.includes('a2') && fileCategory.includes('applied')) || 
                               (fileName.includes('a2') && fileName.includes('applied'));
          } else if (selectedMathTab === 'a2-stats') {
            matchesMathSubject = (fileCategory.includes('a2') && fileCategory.includes('stat')) || 
                               (fileName.includes('a2') && fileName.includes('stat'));
          } else if (selectedMathTab === 'a2-mechanics') {
            matchesMathSubject = (fileCategory.includes('a2') && fileCategory.includes('mechanic')) || 
                               (fileName.includes('a2') && fileName.includes('mechanic'));
          }
        } else if (selectedMathTab === 'further') {
          // Further Math filtering
          matchesMathSubject = fileCategory.includes('further') || fileName.includes('further');
        }
      }
      
      return matchesSearch && matchesCategory && matchesMathSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        case 'oldest':
          return new Date(a.uploadedAt) - new Date(b.uploadedAt);
        case 'name':
          return a.originalName.localeCompare(b.originalName);
        case 'size':
          return b.size - a.size;
        default:
          return 0;
      }
    });

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" text="Loading study materials..." />
          <div className="mt-4 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4 inline mr-2 animate-pulse" />
            Preparing your learning resources...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6 animate-float">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 animate-slideUp">
            Study Materials
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slideUp" style={{animationDelay: '0.2s'}}>
            Browse and download educational resources from Damesha's learning hub. 
            All materials are available for free download without registration.
          </p>
          
          {/* Interactive Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8 animate-slideUp" style={{animationDelay: '0.4s'}}>
            <Card className="text-center hover-lift border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-6 h-6 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-blue-600">{stats.totalFiles}</span>
                </div>
                <p className="text-sm text-muted-foreground">Available Resources</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift border-l-4 border-l-green-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <Download className="w-6 h-6 text-green-500 mr-2" />
                  <span className="text-2xl font-bold text-green-600">{stats.totalDownloads}</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover-lift border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-6 h-6 text-purple-500 mr-2" />
                  <span className="text-2xl font-bold text-purple-600">{stats.categories.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Categories</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Search and Filter Interface */}
        <Card className="mb-8 shadow-lg animate-slideUp" style={{animationDelay: '0.6s'}}>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Find Resources
                </CardTitle>
                <CardDescription>
                  Search and filter through {files ? files.length : 0} available study materials
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search files by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="all">All Categories</option>
                  {stats.categories.map(category => (
                    <option key={category} value={category.toLowerCase()}>
                      {category}
                    </option>
                  ))}
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name A-Z</option>
                  <option value="size">Largest First</option>
                </select>
              </div>
            </div>
            
            {(searchTerm || selectedCategory !== 'all' || selectedMathTab !== 'all') && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Showing {filteredAndSortedFiles.length} of {files ? files.length : 0} files
                  {searchTerm && ` matching "${searchTerm}"`}
                  {selectedCategory !== 'all' && ` in ${selectedCategory} category`}
                  {selectedMathTab !== 'all' && ` in ${mathTabs.find(tab => tab.id === selectedMathTab)?.label || selectedMathTab} subject`}
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedMathTab('all');
                    }}
                    className="ml-2 p-0 h-auto text-blue-600"
                  >
                    Clear filters
                  </Button>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Math Subject Tabs */}
        <Card className="mb-8 shadow-lg animate-slideUp" style={{animationDelay: '0.7s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Math Subjects
            </CardTitle>
            <CardDescription>
              Browse resources by specific math topics and levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedMathTab === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedMathTab('all')}
                className="flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                Show All
              </Button>
              {mathTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = selectedMathTab === tab.id;
                const colorClasses = {
                  blue: 'border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100',
                  green: 'border-green-500 text-green-600 bg-green-50 hover:bg-green-100',
                  purple: 'border-purple-500 text-purple-600 bg-purple-50 hover:bg-purple-100',
                  orange: 'border-orange-500 text-orange-600 bg-orange-50 hover:bg-orange-100'
                };
                
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedMathTab(tab.id)}
                    className={`flex items-center gap-2 transition-all duration-200 ${
                      isActive 
                        ? colorClasses[tab.color] 
                        : 'hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
            
            {/* Applied Math Sub-tabs */}
            {(selectedMathTab === 'as-applied' || selectedMathTab === 'a2-applied') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMathTab(selectedMathTab === 'as-applied' ? 'as-stats' : 'a2-stats')}
                    className="flex items-center gap-2"
                  >
                    <Book className="w-4 h-4" />
                    Statistics
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMathTab(selectedMathTab === 'as-applied' ? 'as-mechanics' : 'a2-mechanics')}
                    className="flex items-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    Mechanics
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>



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

        {/* Enhanced Files List */}
        <Card className="shadow-lg animate-slideUp" style={{animationDelay: '0.8s'}}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Available Study Materials ({filteredAndSortedFiles.length})
            </CardTitle>
            <CardDescription>
              Click the download button to access any file instantly • All files are free and require no registration
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredAndSortedFiles.length === 0 && files.length > 0 ? (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters
                </p>
              </div>
            ) : !files || files.length === 0 ? (
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No files available</h3>
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
                  {filteredAndSortedFiles.map((file, index) => (
                    <TableRow 
                      key={file.id} 
                      className="group hover:bg-muted/50 transition-all duration-200 animate-slideUp"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="group-hover:scale-110 transition-transform">
                            {getFileIcon(file.mimeType)}
                          </div>
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
                        <Badge variant="secondary" className="group-hover:bg-primary/10">
                          {getFileTypeLabel(file.mimeType)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          <span className="group-hover:text-primary transition-colors">{file.tutorName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{formatFileSize(file.size)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {formatDate(file.uploadedAt)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          asChild
                          size="sm"
                          className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105 transition-all duration-200"
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
        {files && files.length > 0 && (
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
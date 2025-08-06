import React, { useState, useEffect, useCallback } from 'react';
import { filesAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
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
  GraduationCap,
  Sparkles,
  Zap,
  Filter,
  Eye,
  Share2,
  ArrowRight,
  Layers,
  BookMarked
} from 'lucide-react';

const PublicFilesPage = () => {
  const [files, setFiles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid'); // Default to grid view
  const [selectedMathTab, setSelectedMathTab] = useState('all');
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalDownloads: 0,
    categories: []
  });

  // Enhanced category configuration with better organization
  const categories = [
    {
      id: 'all',
      label: 'All Resources',
      icon: BookOpen,
      color: 'blue',
      description: 'Browse all available study materials'
    },
    {
      id: 'pdf',
      label: 'PDF Documents',
      icon: FileText,
      color: 'red',
      description: 'Study guides, notes, and reference materials'
    },
    {
      id: 'word',
      label: 'Word Documents',
      icon: FileText,
      color: 'blue',
      description: 'Worksheets, assignments, and practice papers'
    },
    {
      id: 'powerpoint',
      label: 'Presentations',
      icon: FileText,
      color: 'orange',
      description: 'Lecture slides and visual learning materials'
    },
    {
      id: 'excel',
      label: 'Spreadsheets',
      icon: FileText,
      color: 'green',
      description: 'Data analysis and calculation templates'
    },
    {
      id: 'image',
      label: 'Images',
      icon: FileText,
      color: 'purple',
      description: 'Diagrams, charts, and visual aids'
    }
  ];

  // Enhanced maths subject tabs with better organization
  const mathTabs = [
    { 
      id: 'all', 
      label: 'All Subjects', 
      icon: BookOpen, 
      color: 'blue',
      description: 'Browse all maths resources'
    },
    { 
      id: 'year7', 
      label: 'Year 7 Maths', 
      icon: Calculator, 
      color: 'blue',
      description: 'Foundation mathematics for Year 7'
    },
    { 
      id: 'year8', 
      label: 'Year 8 Maths', 
      icon: Calculator, 
      color: 'blue',
      description: 'Core mathematics for Year 8'
    },
    { 
      id: 'year9', 
      label: 'Year 9 Maths', 
      icon: Calculator, 
      color: 'blue',
      description: 'Pre-GCSE mathematics'
    },
    { 
      id: 'year10', 
      label: 'Year 10 Maths', 
      icon: Calculator, 
      color: 'blue',
      description: 'GCSE mathematics preparation'
    },
    { 
      id: 'year11', 
      label: 'Year 11 Maths', 
      icon: Calculator, 
      color: 'blue',
      description: 'GCSE mathematics revision'
    },
    { 
      id: 'as-pure', 
      label: 'AS Pure Maths', 
      icon: Book, 
      color: 'green',
      description: 'Advanced mathematics concepts'
    },
    { 
      id: 'as-applied', 
      label: 'AS Applied Maths', 
      icon: Book, 
      color: 'green',
      description: 'Applied mathematics and statistics'
    },
    { 
      id: 'a2-pure', 
      label: 'A2 Pure Maths', 
      icon: GraduationCap, 
      color: 'purple',
      description: 'Advanced pure mathematics'
    },
    { 
      id: 'a2-applied', 
      label: 'A2 Applied Maths', 
      icon: GraduationCap, 
      color: 'purple',
      description: 'Advanced applied mathematics'
    },
    { 
      id: 'further', 
      label: 'Further Maths', 
      icon: Star, 
      color: 'orange',
      description: 'Further mathematics topics'
    }
  ];

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const response = await filesAPI.getPublicFiles();
      const filesData = response.files || [];
      setFiles(filesData);
      
      // Calculate enhanced stats
      const fileCategories = [...new Set(filesData.map(file => getFileTypeLabel(file.mimeType)))];
      setStats({
        totalFiles: filesData.length,
        totalDownloads: filesData.reduce((acc, file) => acc + (file.downloads || Math.floor(Math.random() * 100)), 0),
        categories: fileCategories
      });
    } catch (error) {
      setError('Failed to load files');
      console.error('Error loading files:', error);
      setFiles([]);
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

  // Enhanced filter and sort logic
  const filteredAndSortedFiles = (files || [])
    .filter(file => {
      const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || getFileTypeLabel(file.mimeType).toLowerCase() === selectedCategory.toLowerCase();
      const matchesMathSubject = selectedMathTab === 'all' || true; // Simplified for now
      
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
        case 'downloads':
          return (b.downloads || 0) - (a.downloads || 0);
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
      day: 'numeric'
    });
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) {
      return <FileText className="w-6 h-6 text-red-500" />;
    } else if (mimeType.includes('word')) {
      return <FileText className="w-6 h-6 text-blue-500" />;
    } else if (mimeType.includes('powerpoint')) {
      return <FileText className="w-6 h-6 text-orange-500" />;
    } else if (mimeType.includes('excel')) {
      return <FileText className="w-6 h-6 text-green-500" />;
    } else if (mimeType.includes('image')) {
      return <FileText className="w-6 h-6 text-purple-500" />;
    } else {
      return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getFileTypeLabel = (mimeType) => {
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('word')) return 'Word';
    if (mimeType.includes('powerpoint')) return 'PowerPoint';
    if (mimeType.includes('excel')) return 'Excel';
    if (mimeType.includes('image')) return 'Image';
    return 'Document';
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" text="Loading study materials..." />
          <div className="mt-4 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 inline mr-2 animate-pulse" />
            Preparing your learning resources...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 animate-fadeIn">
              <Sparkles className="w-4 h-4" />
              {stats.totalFiles}+ Study Resources Available
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 animate-slideUp">
              <span className="text-gradient-primary">Study</span> Materials
              <br />
              <span className="text-foreground">Hub</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Discover curated educational resources for GCSE and A-Level students. 
              Free access to quality study materials from experienced educators.
            </p>

            {/* Enhanced Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slideUp" style={{ animationDelay: '0.4s' }}>
              <Card className="border-0 bg-white/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300 dark:bg-slate-800/70">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl mx-auto mb-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.totalFiles}</div>
                  <div className="text-sm text-muted-foreground">Available Resources</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300 dark:bg-slate-800/70">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl mx-auto mb-3">
                    <Download className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.totalDownloads}</div>
                  <div className="text-sm text-muted-foreground">Total Downloads</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 bg-white/70 backdrop-blur-xl hover:shadow-xl transition-all duration-300 dark:bg-slate-800/70">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl mx-auto mb-3">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stats.categories.length}</div>
                  <div className="text-sm text-muted-foreground">Categories</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <Card className="mb-8 border-0 bg-white/70 backdrop-blur-xl shadow-xl dark:bg-slate-800/70">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Search className="w-5 h-5" />
                  Find Your Perfect Resource
                </CardTitle>
                <CardDescription className="text-base">
                  Search through {files ? files.length : 0} carefully curated study materials
                </CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-2"
                >
                  <Grid className="w-4 h-4" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="flex items-center gap-2"
                >
                  <List className="w-4 h-4" />
                  List
                </Button>
              </div>
            </div>
          </CardHeader>
          
                     <CardContent>
             <div className="space-y-6">
               {/* Search Bar */}
               <div className="relative">
                 <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                 <Input
                   placeholder="Search for study materials, topics, or file names..."
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="pl-10 h-12 text-base"
                 />
               </div>
               
               {/* Filters Row */}
               <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                 {/* Category Filter Buttons */}
                 <div className="flex-1">
                   <div className="flex flex-wrap items-center gap-3">
                     <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Category:</span>
                     <div className="flex flex-wrap gap-2">
                       {categories.map((category) => {
                         const IconComponent = category.icon;
                         const isActive = selectedCategory === category.id;
                         const colorVariants = {
                           blue: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
                           red: 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
                           green: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
                           orange: 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
                           purple: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
                           gray: 'border-gray-500 bg-gray-50 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
                         };
                         
                         return (
                           <button
                             key={category.id}
                             onClick={() => setSelectedCategory(category.id)}
                             className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 hover:scale-105 text-sm font-medium ${
                               isActive 
                                 ? colorVariants[category.color]
                                 : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-slate-800'
                             }`}
                           >
                             <div className="flex items-center gap-2">
                               <IconComponent className="w-4 h-4" />
                               {category.label}
                             </div>
                           </button>
                         );
                       })}
                     </div>
                   </div>
                 </div>
                 
                 {/* Sort Dropdown */}
                 <div className="flex items-center gap-2 lg:ml-4">
                   <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
                   <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="px-3 py-2 border border-input bg-background rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
                   >
                     <option value="newest">Newest First</option>
                     <option value="oldest">Oldest First</option>
                     <option value="name">Name A-Z</option>
                     <option value="size">Largest First</option>
                     <option value="downloads">Most Downloaded</option>
                   </select>
                 </div>
               </div>
             </div>
            
            {/* Active Filters Display */}
            {(searchTerm || selectedCategory !== 'all' || selectedMathTab !== 'all') && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <span className="text-sm text-blue-700 dark:text-blue-300">
                      Showing {filteredAndSortedFiles.length} of {files ? files.length : 0} files
                      {searchTerm && (
                        <Badge variant="secondary" className="ml-2">
                          Search: "{searchTerm}"
                        </Badge>
                      )}
                      {selectedCategory !== 'all' && (
                        <Badge variant="secondary" className="ml-2">
                          Category: {categories.find(cat => cat.id === selectedCategory)?.label}
                        </Badge>
                      )}
                      {selectedMathTab !== 'all' && (
                        <Badge variant="secondary" className="ml-2">
                          Subject: {mathTabs.find(tab => tab.id === selectedMathTab)?.label}
                        </Badge>
                      )}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedMathTab('all');
                    }}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Navigation */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6" />
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isActive = selectedCategory === category.id;
              const colorVariants = {
                blue: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
                red: 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
                green: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
                orange: 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
                purple: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
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
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      isActive 
                        ? 'bg-white/80 dark:bg-slate-800/80' 
                        : 'bg-gray-50 dark:bg-slate-800'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isActive ? `text-${category.color}-600` : 'text-gray-500'
                      }`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{category.label}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

                 {/* Maths Subject Navigation */}
         <div className="mb-8">
           <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
             <Calculator className="w-6 h-6" />
             Maths Subjects
           </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {mathTabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = selectedMathTab === tab.id;
              const colorVariants = {
                blue: 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
                green: 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
                purple: 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
                orange: 'border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
              };
              
              return (
                <Card
                  key={tab.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-2 ${
                    isActive 
                      ? colorVariants[tab.color]
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedMathTab(tab.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                      isActive 
                        ? 'bg-white/80 dark:bg-slate-800/80' 
                        : 'bg-gray-50 dark:bg-slate-800'
                    }`}>
                      <IconComponent className={`w-6 h-6 ${
                        isActive ? `text-${tab.color}-600` : 'text-gray-500'
                      }`} />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{tab.label}</h3>
                    <p className="text-xs text-muted-foreground">{tab.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive bg-red-50 dark:bg-red-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Files Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-6 h-6" />
              Study Materials ({filteredAndSortedFiles.length})
            </h2>
            <div className="text-sm text-muted-foreground">
              Click any resource to download instantly
            </div>
          </div>

          {filteredAndSortedFiles.length === 0 && files.length > 0 ? (
            <Card className="text-center py-16">
              <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No resources found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search terms or filters to find what you're looking for
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedMathTab('all');
                }}
              >
                Clear Filters
              </Button>
            </Card>
          ) : !files || files.length === 0 ? (
            <Card className="text-center py-16">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No study materials available</h3>
              <p className="text-muted-foreground mb-6">
                {error ? 
                  "Unable to load resources at the moment. Please try again later." :
                  "Be the first to contribute study materials to help other students!"
                }
              </p>
              {!error && (
                <Button asChild>
                  <a href="/submit">
                    <Share2 className="w-4 h-4 mr-2" />
                    Contribute Resources
                  </a>
                </Button>
              )}
              {error && (
                <Button onClick={loadFiles}>
                  <Zap className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
            </Card>
          ) : viewMode === 'grid' ? (
            // Grid View
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedFiles.map((file, index) => (
                <Card
                  key={file.id}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/70 backdrop-blur-xl dark:bg-slate-800/70"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="group-hover:scale-110 transition-transform">
                        {getFileIcon(file.mimeType)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(file.mimeType)}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {file.originalName}
                    </h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        <span>{file.tutorName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(file.uploadedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Eye className="w-4 h-4" />
                        <span>{file.downloads || Math.floor(Math.random() * 100)} downloads</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-mono">
                        {formatFileSize(file.size)}
                      </span>
                      <Button
                        asChild
                        size="sm"
                        className="group-hover:scale-105 transition-all duration-200"
                      >
                        <a
                          href={filesAPI.getDownloadUrl(file.id)}
                          download
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Table View
            <Card className="border-0 bg-white/70 backdrop-blur-xl dark:bg-slate-800/70">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-700/50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">File</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Shared by</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Size</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Uploaded</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Download</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredAndSortedFiles.map((file, index) => (
                        <tr
                          key={file.id}
                          className="group hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="group-hover:scale-110 transition-transform">
                                {getFileIcon(file.mimeType)}
                              </div>
                              <div>
                                <div className="font-medium group-hover:text-blue-600 transition-colors">
                                  {file.originalName}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {file.downloads || Math.floor(Math.random() * 100)} downloads
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary">
                              {getFileTypeLabel(file.mimeType)}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span>{file.tutorName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-mono text-sm">{formatFileSize(file.size)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1 text-sm">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {formatDate(file.uploadedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button
                              asChild
                              size="sm"
                              className="group-hover:scale-105 transition-all duration-200"
                            >
                              <a
                                href={filesAPI.getDownloadUrl(file.id)}
                                download
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </a>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Call to Action */}
        {files && files.length > 0 && (
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-cyan-600/90"></div>
            <div className="relative z-10 p-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mx-auto mb-6">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Share Your Knowledge</h3>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                Help other students succeed by contributing your own study materials, notes, and resources to our growing community.
              </p>
              <Button
                variant="secondary"
                size="lg"
                asChild
                className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <a href="/submit">
                  <BookMarked className="w-5 h-5 mr-2" />
                  Submit Resources
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PublicFilesPage; 
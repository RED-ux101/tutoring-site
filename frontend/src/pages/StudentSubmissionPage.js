import React, { useState, useRef } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Users, 
  BookOpen,
  GraduationCap,
  Star,
  Heart,
  Sparkles
} from 'lucide-react';

const StudentSubmissionPage = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    description: '',
    category: 'study-guide'
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const categories = [
    { value: 'study-guide', label: 'Study Guide', icon: BookOpen, color: 'blue' },
    { value: 'notes', label: 'Class Notes', icon: FileText, color: 'green' },
    { value: 'practice', label: 'Practice Problems', icon: Users, color: 'purple' },
    { value: 'reference', label: 'Reference Material', icon: GraduationCap, color: 'orange' },
    { value: 'other', label: 'Other', icon: Star, color: 'gray' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleFileSelect = (selectedFile) => {
    if (selectedFile && selectedFile.size <= 10 * 1024 * 1024) { // 10MB limit
      setFile(selectedFile);
      setError('');
    } else {
      setError('File size must be less than 10MB');
    }
  };

  const handleFileInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
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
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to submit');
      return;
    }

    if (!formData.studentName.trim() || !formData.studentEmail.trim()) {
      setError('Please provide your name and email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create a FormData object with all the submission data
      const submissionData = new FormData();
      submissionData.append('file', file);
      submissionData.append('studentName', formData.studentName);
      submissionData.append('studentEmail', formData.studentEmail);
      submissionData.append('description', formData.description);
      submissionData.append('category', formData.category);

      // Submit to backend
      const response = await fetch('/api/submissions/submit', {
        method: 'POST',
        body: submissionData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Submission failed:', response.status, errorText);
        throw new Error(`Submission failed: ${response.status} - ${errorText || 'Server error'}`);
      }

      setSuccess('Thank you! Your resource has been submitted for review. Damesha will review it and add it to the collection if appropriate.');
      
      // Reset form
      setFormData({
        studentName: '',
        studentEmail: '',
        description: '',
        category: 'study-guide'
      });
      setFile(null);
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
    } catch (error) {
      console.error('Submission error:', error);
      if (error.message.includes('fetch') || error.message.includes('405')) {
        setError('The submission service is currently unavailable. Please try again later or contact support.');
      } else {
        setError(`Submission failed: ${error.message}`);
      }
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

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension)) return <FileText className="w-6 h-6 text-red-500" />;
    if (['doc', 'docx'].includes(extension)) return <FileText className="w-6 h-6 text-blue-500" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return <FileText className="w-6 h-6 text-green-500" />;
    return <FileText className="w-6 h-6 text-purple-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-12">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6 animate-float">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4 animate-slideUp">
            Share Your Knowledge
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slideUp" style={{animationDelay: '0.2s'}}>
            Have a helpful study guide, notes, or educational material? Share it with the learning community and help others succeed!
          </p>
          
          {/* Platform Info */}
          <div className="flex justify-center gap-8 mt-8 animate-slideUp" style={{animationDelay: '0.4s'}}>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Free</div>
              <div className="text-sm text-muted-foreground">Submission</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Simple</div>
              <div className="text-sm text-muted-foreground">Process</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">Secure</div>
              <div className="text-sm text-muted-foreground">Platform</div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          {success && (
            <Card className="mb-8 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 animate-slideUp">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{success}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {error && (
            <Card className="mb-8 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 animate-slideUp">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-red-700 dark:text-red-400">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Form */}
          <Card className="shadow-xl animate-slideUp" style={{animationDelay: '0.6s'}}>
            <CardHeader className="bg-gradient-to-r from-primary/5 to-purple/5 border-b">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Sparkles className="w-6 h-6 text-primary" />
                Submit Your Resource
              </CardTitle>
              <CardDescription className="text-base">
                Fill out the form below to share your educational materials with the community
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Student Information */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Your Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentName" className="text-sm font-medium">
                        Your Name *
                      </Label>
                      <Input
                        id="studentName"
                        name="studentName"
                        type="text"
                        required
                        value={formData.studentName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="studentEmail" className="text-sm font-medium">
                        Your Email *
                      </Label>
                      <Input
                        id="studentEmail"
                        name="studentEmail"
                        type="email"
                        required
                        value={formData.studentEmail}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        className="h-12"
                      />
                    </div>
                  </div>
                </div>

                {/* Resource Details */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Resource Details
                  </h3>

                  {/* Category Selection */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Resource Type</Label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = formData.category === category.value;
                        return (
                          <button
                            key={category.value}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: category.value })}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                              isSelected
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-border hover:border-primary/50 hover:bg-muted/50'
                            }`}
                          >
                            <Icon className="w-6 h-6 mx-auto mb-2" />
                            <div className="text-sm font-medium">{category.label}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-input bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                      placeholder="Briefly describe what this resource contains and how it might help other students..."
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload File *
                  </h3>
                  
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                      dragActive 
                        ? 'border-primary bg-primary/5 scale-[1.02]' 
                        : file 
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700'
                        : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/25'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {file ? (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                            {getFileIcon(file.name)}
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground mb-1">{file.name}</p>
                          <div className="flex items-center justify-center gap-2">
                            <Badge variant="secondary">{file.name.split('.').pop()?.toUpperCase()}</Badge>
                            <span className="text-sm text-muted-foreground">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFile(null)}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Remove file
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <div className="p-4 bg-primary/10 rounded-full">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-foreground mb-2">
                            {dragActive ? 'Drop your file here!' : 'Upload your resource'}
                          </p>
                          <p className="text-muted-foreground mb-4">
                            Drag and drop your file here, or click to browse
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Supports PDFs, Word docs, PowerPoint, Excel, images, and text files (max 10MB)
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="hover:scale-105 transition-transform"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileInputChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={loading || !file}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-200 hover:scale-[1.02]"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <LoadingSpinner size="small" />
                        <span>Submitting...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        <span>Share with Community</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              {/* Footer Note */}
              <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  <span className="font-medium">Privacy Note:</span> By submitting, you confirm that you have the right to share this material and 
                  that it's appropriate for educational use. All submissions are reviewed by Damesha before being published.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Community Stats */}
          <Card className="mt-8 bg-gradient-to-r from-primary/5 to-purple/5 animate-slideUp" style={{animationDelay: '0.8s'}}>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Join Our Amazing Community
                </h3>
                <p className="text-muted-foreground mb-4">
                  Your contribution helps thousands of students learn and grow. Every resource makes a difference!
                </p>
                <div className="flex justify-center gap-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">Quality</div>
                    <div className="text-xs text-muted-foreground">Reviewed Content</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">Community</div>
                    <div className="text-xs text-muted-foreground">Driven Learning</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-primary">Support</div>
                    <div className="text-xs text-muted-foreground">Always Available</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentSubmissionPage; 
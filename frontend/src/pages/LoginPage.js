import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Lock, KeyRound, AlertCircle, Shield, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [attempts, setAttempts] = useState(0);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get discrete portal name based on route
  const getPortalName = () => {
    const path = location.pathname;
    const portals = {
      '/damesha-admin-portal': 'Damesha\'s Portal',
      '/admin': 'Admin Access',
      '/tutor': 'Tutor Panel',
      '/secret-access': 'Authorized Access',
      '/hidden-portal': 'Hidden Portal',
      '/teacher-login': 'Teacher Portal',
      '/staff-access': 'Staff Access',
      '/management': 'Management Panel',
      '/control-panel': 'Control Panel'
    };
    return portals[path] || 'Secure Access';
  };

  const handleChange = (e) => {
    setAdminKey(e.target.value);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting login with key:', adminKey);
      console.log('🌐 API URL:', '/api/auth/admin-login');
      
      const response = await fetch('/api/auth/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminKey })
      });
      
      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Backend error:', errorData);
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      const data = await response.json();
      console.log('✅ Login successful:', data);
      login(data.tutor, data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('🚨 Login error:', error);
      setAttempts(prev => prev + 1);
      setError(`Login failed: ${error.message}`);
      
      // Add slight delay for security
      setTimeout(() => {
        setLoading(false);
      }, 1000 + (attempts * 500));
      return;
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMjIiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <Card className="w-full max-w-md relative z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur shadow-2xl border-0">
        <CardHeader className="space-y-6 text-center pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              {getPortalName()}
            </CardTitle>
            <CardDescription className="text-muted-foreground mt-2">
              Enter your secure access key to continue
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="adminKey" className="text-sm font-medium">
                Access Key
              </Label>
              <div className="relative">
                <Input
                  id="adminKey"
                  type={showKey ? 'text' : 'password'}
                  value={adminKey}
                  onChange={handleChange}
                  placeholder="Enter your secret key..."
                  className="pr-12 h-12 bg-background/50"
                  disabled={loading}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-8 w-8 p-0"
                  onClick={() => setShowKey(!showKey)}
                  disabled={loading}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
                {attempts > 2 && (
                  <span className="ml-2 text-xs opacity-75">
                    (Multiple attempts detected)
                  </span>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium transition-all duration-200"
              disabled={loading || !adminKey.trim()}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="small" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4" />
                  <span>Access Portal</span>
                </div>
              )}
            </Button>
          </form>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Authorized personnel only • All access is logged
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Subtle security indicator */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-white/60">
        <Lock className="w-3 h-3" />
        <span>Secure Connection</span>
      </div>
    </div>
  );
};

export default LoginPage; 
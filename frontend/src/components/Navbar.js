import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';
import { GraduationCap, BookOpen, Upload, LogOut, Settings, Moon, Sun } from 'lucide-react';

const NavLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={`relative flex items-center space-x-2 text-sm font-medium transition-all duration-300 px-4 py-2 rounded-lg ${
        active 
          ? 'text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25 dark:shadow-blue-500/25' 
          : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-cyan-500/10 dark:hover:from-blue-500/10 dark:hover:to-cyan-500/10'
      }`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className={`h-4 w-4 transition-transform duration-300 ${active ? 'animate-pulse' : 'group-hover:scale-110'}`} />
      <span>{children}</span>
      {active && (
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-600/20 animate-pulse" />
      )}
    </Link>
  );
};

const Navbar = () => {
  const { isAuthenticated, tutor, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50">
      <div className={`backdrop-blur-xl border-b shadow-lg transition-all duration-500 ${
        isDarkMode 
          ? 'bg-gradient-to-r from-slate-900/95 to-slate-800/95 border-slate-700/50' 
          : 'bg-gradient-to-r from-white/95 via-blue-50/95 to-cyan-50/95 border-slate-200/50'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className={`relative flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/25 group-hover:shadow-blue-500/40' 
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-400/30 group-hover:shadow-blue-400/50'
                }`}>
                  <GraduationCap className="h-5 w-5" />
                  <div className={`absolute inset-0 rounded-xl animate-pulse ${
                    isDarkMode 
                      ? 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20' 
                      : 'bg-gradient-to-r from-blue-300/30 to-cyan-300/30'
                  }`} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-extrabold tracking-tight">
                    <span className={`${
                      isDarkMode 
                        ? 'text-gradient-primary' 
                        : 'bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'
                    }`}>
                      Damesha's
                    </span>
                  </span>
                  <span className={`text-sm font-medium -mt-1 ${
                    isDarkMode 
                      ? 'text-muted-foreground' 
                      : 'text-slate-600'
                  }`}>
                    Learning Hub
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center gap-2">
                <NavLink to="/files" icon={BookOpen}>Study Materials</NavLink>
                <NavLink to="/submit" icon={Upload}>Submit Resource</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Dark mode toggle */}
              <Button
                variant="outline"
                size="sm"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className={`transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isDarkMode 
                    ? 'border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500/50' 
                    : 'border-slate-300/50 bg-white/50 hover:bg-slate-100/50 hover:border-slate-400/50'
                }`}
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-yellow-400" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </Button>

              {isAuthenticated() ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard">
                    <Button 
                      size="sm" 
                      className={`text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/25 hover:shadow-blue-500/40' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-blue-400/30 hover:shadow-blue-400/50'
                      }`}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <div className={`hidden md:flex items-center gap-3 pl-4 ml-2 border-l ${
                    isDarkMode 
                      ? 'border-slate-600/50' 
                      : 'border-slate-300/50'
                  }`}>
                    <div className={`relative h-9 w-9 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-blue-500/25' 
                        : 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-blue-400/30'
                    }`}>
                      <span className="text-sm font-semibold">
                        {tutor?.name?.charAt(0).toUpperCase()}
                      </span>
                      <div className={`absolute inset-0 rounded-full animate-pulse ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-400/20 to-cyan-400/20' 
                          : 'bg-gradient-to-r from-blue-300/30 to-cyan-300/30'
                      }`} />
                    </div>
                    <div className="flex flex-col">
                      <span className={`text-sm font-semibold ${
                        isDarkMode 
                          ? 'text-foreground' 
                          : 'text-slate-800'
                      }`}>
                        {tutor?.name}
                      </span>
                      <span className={`text-xs ${
                        isDarkMode 
                          ? 'text-muted-foreground' 
                          : 'text-slate-600'
                      }`}>
                        Tutor
                      </span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout} 
                    className={`transition-all duration-300 hover:scale-105 active:scale-95 ${
                      isDarkMode 
                        ? 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20 hover:border-red-400/50 text-red-400 hover:text-red-300' 
                        : 'border-red-400/50 bg-red-50/50 hover:bg-red-100/50 hover:border-red-300/50 text-red-600 hover:text-red-700'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/files">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`transition-all duration-300 hover:scale-105 ${
                        isDarkMode 
                          ? 'border-slate-600/50 bg-slate-800/50 hover:bg-slate-700/50 hover:border-slate-500/50' 
                          : 'border-slate-300/50 bg-white/50 hover:bg-slate-100/50 hover:border-slate-400/50'
                      }`}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse
                    </Button>
                  </Link>
                  <Link to="/submit">
                    <Button 
                      size="sm"
                      className={`text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 ${
                        isDarkMode 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/25 hover:shadow-blue-500/40' 
                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-blue-400/30 hover:shadow-blue-400/50'
                      }`}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Submit
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
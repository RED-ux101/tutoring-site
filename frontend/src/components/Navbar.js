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
      className={`nav-underline flex items-center space-x-2 text-sm font-medium transition-colors ${active ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      aria-current={active ? 'page' : undefined}
    >
      <Icon className="h-4 w-4" />
      <span>{children}</span>
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
      <div className="border-b glass backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-md gradient-primary text-white shadow-elevated group-hover:brightness-110 transition">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold text-foreground text-gradient-primary">
                  Damesha's Learning Hub
                </span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <NavLink to="/files" icon={BookOpen}>Study Materials</NavLink>
                <NavLink to="/submit" icon={Upload}>Submit Resource</NavLink>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Dark mode toggle */}
              <Button variant="glass" size="sm" aria-label="Toggle theme" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {isAuthenticated() ? (
                <div className="flex items-center space-x-4">
                  <Link to="/dashboard">
                    <Button variant="gradient" size="sm" elevation="md">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <div className="hidden md:flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 rounded-full bg-white/20 dark:bg-white/10 flex items-center justify-center backdrop-blur">
                        <span className="text-sm font-medium text-white">
                          {tutor?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-foreground">
                        {tutor?.name}
                      </span>
                    </div>
                  </div>
                  
                  <Button variant="glass" size="sm" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
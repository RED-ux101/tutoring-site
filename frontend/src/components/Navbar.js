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
      <div className="backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-md gradient-primary text-white shadow-[var(--shadow-md)] group-hover:brightness-110 transition">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="text-gradient-primary">Damesha's</span>
                  <span className="ml-2 text-foreground/90">Learning Hub</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-6">
                <NavLink to="/files" icon={BookOpen}>Study Materials</NavLink>
                <NavLink to="/submit" icon={Upload}>Submit Resource</NavLink>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Dark mode toggle */}
              <Button
                variant="glass"
                size="sm"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="hover:scale-105 active:scale-95"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              {isAuthenticated() ? (
                <div className="flex items-center gap-3">
                  <Link to="/dashboard">
                    <Button variant="gradient" size="sm" elevation="md" className="hover:scale-105 active:scale-95">
                      <Settings className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                  
                  <div className="hidden md:flex items-center gap-2 pl-3 ml-1 border-l border-border">
                    <div className="h-8 w-8 rounded-full bg-white/30 dark:bg-white/10 flex items-center justify-center backdrop-blur text-white shadow-[var(--shadow-sm)]">
                      <span className="text-sm font-medium">
                        {tutor?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {tutor?.name}
                    </span>
                  </div>
                  
                  <Button variant="glass" size="sm" onClick={handleLogout} className="hover:scale-105 active:scale-95">
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
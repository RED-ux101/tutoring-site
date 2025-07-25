import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [tutor, setTutor] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const savedToken = localStorage.getItem('tutorToken');
    const savedTutor = localStorage.getItem('tutorData');

    if (savedToken && savedTutor) {
      setToken(savedToken);
      setTutor(JSON.parse(savedTutor));
    }
    
    setLoading(false);
  }, []);

  const login = (tutorData, authToken) => {
    setTutor(tutorData);
    setToken(authToken);
    localStorage.setItem('tutorToken', authToken);
    localStorage.setItem('tutorData', JSON.stringify(tutorData));
  };

  const logout = () => {
    setTutor(null);
    setToken(null);
    localStorage.removeItem('tutorToken');
    localStorage.removeItem('tutorData');
  };

  const isAuthenticated = () => {
    return !!token && !!tutor;
  };

  const value = {
    tutor,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
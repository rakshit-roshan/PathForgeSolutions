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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is authenticated on app load
    const userEmail = localStorage.getItem('userEmail') || sessionStorage.getItem('userEmail');
    if (userEmail) {
      setIsAuthenticated(true);
      setUser({ email: userEmail });
    } else {
      // Ensure clean state if no stored email
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    if (userData.rememberMe) {
      localStorage.setItem('userEmail', userData.email);
    } else {
      // For session-only authentication, use sessionStorage
      sessionStorage.setItem('userEmail', userData.email);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('userEmail');
  };

  const value = { isAuthenticated, user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

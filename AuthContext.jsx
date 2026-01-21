import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('health_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // MOCK AUTH
    const mockUsers = {
  'doctor@health.com': { 
    email: 'doctor@health.com', 
    role: 'doctor', 
    name: 'Dr. X'  // ← Change this
  },
  'patient@health.com': { 
    email: 'patient@health.com', 
    role: 'patient', 
    name: 'Patient Y'   // ← Change this
  }
};

    if (mockUsers[email] && password === '123') {
      const userData = mockUsers[email];
      localStorage.setItem('health_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    localStorage.removeItem('health_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
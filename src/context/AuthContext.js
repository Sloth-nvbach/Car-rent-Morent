import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'morent_auth_user';
const TOKEN_KEY = 'morent_auth_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password, role = 'customer') => {
    setError(null);
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const mockUsers = {
      customer: { id: 'user-001', name: 'Nguyễn Văn An', email: 'nguyenvanan@email.com', phone: '0901 234 567', role: 'customer', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', verified: true },
      provider: { id: 'provider-001', name: 'Morent Auto Hà Nội', email: 'hanoi@morentauto.vn', phone: '024 3974 1234', role: 'provider', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', verified: true },
      admin: { id: 'admin-001', name: 'Quản trị viên', email: 'admin@morent.vn', role: 'admin', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200', verified: true },
    };
    
    const mockUser = mockUsers[role] || mockUsers.customer;
    const token = `mock-jwt-token-${Date.now()}`;
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(mockUser);
    setLoading(false);
    return { user: mockUser, token };
  }, []);

  const register = useCallback(async (userData) => {
    setError(null);
    setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    
    const token = `mock-jwt-token-${Date.now()}`;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, token);
    setUser(newUser);
    setLoading(false);
    return { user: newUser, token };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isProvider: user?.role === 'provider',
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
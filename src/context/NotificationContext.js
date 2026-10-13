import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { mockNotifications } from '../data/mockData';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const addNotification = useCallback((notification) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
    return newNotif;
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notif = prev.find(n => n.id === notificationId);
      if (notif && !notif.read) {
        setUnreadCount(c => Math.max(0, c - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  const showToast = useCallback((toast) => {
    const id = `toast-${Date.now()}`;
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, toast.duration || 5000);
    return id;
  }, []);

  const hideToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId));
  }, []);

  const success = useCallback((title, message, options = {}) => {
    return showToast({ type: 'success', title, message, ...options });
  }, [showToast]);

  const error = useCallback((title, message, options = {}) => {
    return showToast({ type: 'error', title, message, ...options });
  }, [showToast]);

  const warning = useCallback((title, message, options = {}) => {
    return showToast({ type: 'warning', title, message, ...options });
  }, [showToast]);

  const info = useCallback((title, message, options = {}) => {
    return showToast({ type: 'info', title, message, ...options });
  }, [showToast]);

  const value = {
    notifications,
    unreadCount,
    toasts,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
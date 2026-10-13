import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Menu, X, User, LogOut, Settings, Bell, ChevronDown, Car, Star, Shield, Truck, Headphones, Search, MapPin, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Dropdown } from './DataDisplay';
import { Button } from './Button';
import { Avatar } from './DataDisplay';
import { Modal } from './Modal';
import { cities } from '../../data/mockData';

export function Header() {
  const { user, logout, isAuthenticated, isProvider, isAdmin } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const userMenuRef = useRef(null);
  const notifRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  };
  
  const handleNotificationClick = (notif) => {
    if (notif.actionUrl) {
      navigate(notif.actionUrl);
      markAsRead(notif.id);
    }
    setNotifOpen(false);
  };
  
  const navItems = [
    { path: '/', label: 'Trang chủ', icon: <Home className="w-5 h-5" /> },
    { path: '/search', label: 'Tìm xe', icon: <Search className="w-5 h-5" /> },
    { path: '/how-it-works', label: 'Cách thuê xe', icon: <Info className="w-5 h-5" /> },
    { path: '/offers', label: 'Ưu đãi', icon: <Tag className="w-5 h-5" /> },
    { path: '/support', label: 'Hỗ trợ', icon: <Headphones className="w-5 h-5" /> },
  ];
  
  const isActive = (path) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border" style={{ height: 'var(--header-height)' }}>
      <nav className="container h-full" aria-label="Điều hướng chính">
        <div className="flex h-full items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl" aria-label="Car rent Morent - Trang chủ">
            <Car className="w-7 h-7" aria-hidden="true" />
            <span>Morent</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  'px-4 py-2 rounded-lg text-sm font-medium transition',
                  isActive(item.path) 
                    ? 'bg-primary text-white' 
                    : 'text-secondary hover:text-primary hover:bg-primary/10'
                )}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          <div className="hidden lg:block w-64">
            <Link to="/search" className="w-full" onClick={(e) => { e.preventDefault(); setSearchOpen(true); }}>
              <SearchBarInline onSearch={setSearchOpen} />
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button
                    className="relative p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition"
                    onClick={() => setNotifOpen(!notifOpen)}
                    aria-label={`Thông báo${unreadCount > 0 ? `, ${unreadCount} chưa đọc` : ''}`}
                    aria-expanded={notifOpen}
                  >
                    <Bell className="w-5 h-5" aria-hidden="true" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 text-xs font-bold text-white bg-error rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">Thông báo</h3>
                          {unreadCount > 0 && (
                            <button className="text-xs text-primary hover:underline" onClick={(e) => { e.stopPropagation(); markAllAsRead(); }}>
                              Đánh dấu tất cả đã đọc
                            </button>
                          )}
                        </div>
                        <button onClick={() => setNotifOpen(false)} className="p-1 text-tertiary hover:text-primary" aria-label="Đóng">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-tertiary">Chưa có thông báo nào</div>
                        ) : (
                          notifications.slice(0, 10).map(notif => (
                            <button
                              key={notif.id}
                              onClick={(e) => { e.stopPropagation(); handleNotificationClick(notif); }}
                              className={classNames('w-full p-4 text-left hover:bg-primary/5 transition border-b border-border/50', !notif.read && 'bg-primary/5')}
                            >
                              <p className="font-medium text-sm text-primary">{notif.title}</p>
                              <p className="text-xs text-secondary mt-1 line-clamp-2">{notif.message}</p>
                              <p className="text-xs text-tertiary mt-1">{formatRelativeTime(notif.createdAt)}</p>
                            </button>
                          ))
                        )}
                      </div>
                      {notifications.length > 10 && (
                        <div className="p-3 border-t border-border text-center">
                          <Link to="/account/notifications" className="text-sm text-primary hover:underline">Xem tất cả thông báo</Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="relative" ref={userMenuRef}>
                  <button
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-primary/10 transition"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-expanded={userMenuOpen}
                    aria-label="Menu người dùng"
                  >
                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                    <span className="hidden sm:block text-sm font-medium text-primary">{user?.name}</span>
                    <ChevronDown className="w-4 h-4 text-tertiary" aria-hidden="true" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl overflow-hidden py-1">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium text-sm text-primary">{user?.name}</p>
                        <p className="text-xs text-tertiary">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full capitalize">{user?.role}</span>
                      </div>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-primary/5" onClick={() => setUserMenuOpen(false)}>
                          <Settings className="w-4 h-4" />
                          Bảng điều khiển quản trị
                        </Link>
                      )}
                      {isProvider && (
                        <Link to="/provider" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-primary/5" onClick={() => setUserMenuOpen(false)}>
                          <Car className="w-4 h-4" />
                          Bảng điều khiển nhà cung cấp
                        </Link>
                      )}
                      <Link to="/account" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-primary/5" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" />
                        Tài khoản của tôi
                      </Link>
                      <Link to="/account/bookings" className="flex items-center gap-2 px-4 py-2 text-sm text-secondary hover:text-primary hover:bg-primary/5" onClick={() => setUserMenuOpen(false)}>
                        <Calendar className="w-4 h-4" />
                        Đơn đặt xe
                      </Link>
                      <div className="border-t border-border my-1" />
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error hover:bg-error/5">
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost text-sm">Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary text-sm">Đăng ký</Link>
              </div>
            )}
            
            <button
              className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-primary/10 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>
      
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface animate-slide-down">
          <div className="container py-4 space-y-2">
            <SearchBarInline onSearch={setSearchOpen} />
            <div className="pt-2 border-t border-border" />
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium',
                  isActive(item.path) ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            {!isAuthenticated && (
              <div className="pt-2 border-t border-border flex gap-2">
                <Link to="/login" className="btn btn-ghost flex-1" onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
                <Link to="/register" className="btn btn-primary flex-1" onClick={() => setMobileMenuOpen(false)}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      )}
      
      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </header>
  );
}

function SearchBarInline({ onSearch }) {
  return (
    <div className="relative group">
      <button
        className="w-full flex items-center gap-3 px-4 py-2.5 bg-bg-tertiary border border-border rounded-lg text-left hover:border-primary transition"
        onClick={(e) => { e.preventDefault(); onSearch(true); }}
        aria-label="Tìm kiếm xe"
      >
        <MapPin className="w-5 h-5 text-tertiary" aria-hidden="true" />
        <span className="flex-1 text-sm text-tertiary truncate">Địa điểm nhận xe...</span>
        <Calendar className="w-5 h-5 text-tertiary" aria-hidden="true" />
        <span className="px-2 py-1 text-xs bg-surface border border-border rounded text-tertiary">Ngày nhận</span>
        <Clock className="w-5 h-5 text-tertiary" aria-hidden="true" />
        <span className="px-2 py-1 text-xs bg-surface border border-border rounded text-tertiary">Ngày trả</span>
        <Search className="w-5 h-5 text-primary" aria-hidden="true" />
      </button>
    </div>
  );
}

function SearchModal({ onClose }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('09:00');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('18:00');
  const [sameLocation, setSameLocation] = useState(true);
  const [dropoffLocation, setDropoffLocation] = useState('');
  const navigate = useNavigate();
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  if (!pickupDate) setPickupDate(today);
  if (!dropoffDate) setDropoffDate(tomorrow);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (pickupLocation) params.set('pickup', pickupLocation);
    if (pickupDate) params.set('startDate', pickupDate);
    if (pickupTime) params.set('startTime', pickupTime);
    if (dropoffDate) params.set('endDate', dropoffDate);
    if (dropoffTime) params.set('endTime', dropoffTime);
    if (!sameLocation && dropoffLocation) params.set('dropoff', dropoffLocation);
    navigate(`/search?${params.toString()}`);
    onClose();
  };
  
  return (
    <Modal isOpen={true} onClose={onClose} size="lg" title="Tìm kiếm xe cho thuê">
      <form onSubmit={handleSearch} className="space-y-6">
        <div className="grid grid-2 gap-4">
          <div>
            <label htmlFor="pickupLocation" className="input-label">Địa điểm nhận xe <span className="text-error">*</span></label>
            <select
              id="pickupLocation"
              className="input-field"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              required
            >
              <option value="">Chọn địa điểm</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="dropoffLocation" className="input-label">Địa điểm trả xe</label>
            <select
              id="dropoffLocation"
              className="input-field"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              disabled={sameLocation}
            >
              <option value="">Tương tự địa điểm nhận</option>
              {cities.map(city => (
                <option key={city.id} value={city.id}>{city.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sameLocation"
            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            checked={sameLocation}
            onChange={(e) => setSameLocation(e.target.checked)}
          />
          <label htmlFor="sameLocation" className="text-sm text-secondary cursor-pointer">Trả xe tại cùng địa điểm</label>
        </div>
        
        <div className="grid grid-4 gap-4">
          <div>
            <label htmlFor="pickupDate" className="input-label">Ngày nhận <span className="text-error">*</span></label>
            <input
              type="date"
              id="pickupDate"
              className="input-field"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={today}
              required
            />
          </div>
          <div>
            <label htmlFor="pickupTime" className="input-label">Giờ nhận <span className="text-error">*</span></label>
            <input
              type="time"
              id="pickupTime"
              className="input-field"
              value={pickupTime}
              onChange={(e) => setPickupTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="dropoffDate" className="input-label">Ngày trả <span className="text-error">*</span></label>
            <input
              type="date"
              id="dropoffDate"
              className="input-field"
              value={dropoffDate}
              onChange={(e) => setDropoffDate(e.target.value)}
              min={pickupDate}
              required
            />
          </div>
          <div>
            <label htmlFor="dropoffTime" className="input-label">Giờ trả <span className="text-error">*</span></label>
            <input
              type="time"
              id="dropoffTime"
              className="input-field"
              value={dropoffTime}
              onChange={(e) => setDropoffTime(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Hủy</button>
          <button type="submit" className="btn btn-primary btn-lg">Tìm xe</button>
        </div>
      </form>
    </Modal>
  );
}

function Home({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}

function Info({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
}

function Tag({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
}

function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;
  return then.toLocaleDateString('vi-VN');
}
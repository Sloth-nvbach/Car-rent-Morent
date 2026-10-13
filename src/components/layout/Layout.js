import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '../ui/Modal';
import { useNotification } from '../../context/NotificationContext';

export function MainLayout() {
  const { toasts, hideToast } = useNotification();
  
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Chuyển đến nội dung chính
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-[var(--header-height)]" role="main">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </div>
  );
}

export function AuthLayout() {
  const { toasts, hideToast } = useNotification();
  
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main-content" className="skip-link">
        Chuyển đến nội dung chính
      </a>
      <Header />
      <main id="main-content" className="flex-1 pt-[var(--header-height)]" role="main">
        <div className="container py-8 lg:py-12">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </div>
  );
}

export function AdminLayout() {
  const { toasts, hideToast } = useNotification();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/admin/users', label: 'Người dùng', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/providers', label: 'Nhà cung cấp', icon: <Building className="w-5 h-5" /> },
    { path: '/admin/cars', label: 'Quản lý xe', icon: <Car className="w-5 h-5" /> },
    { path: '/admin/bookings', label: 'Đơn đặt xe', icon: <Calendar className="w-5 h-5" /> },
    { path: '/admin/payments', label: 'Thanh toán', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/admin/support', label: 'Hỗ trợ', icon: <Headphones className="w-5 h-5" /> },
    { path: '/admin/reviews', label: 'Đánh giá', icon: <Star className="w-5 h-5" /> },
    { path: '/admin/settings', label: 'Cài đặt', icon: <Settings className="w-5 h-5" /> },
  ];
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <aside 
        className={classNames(
          'fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Menu quản trị"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Link to="/admin" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Car className="w-7 h-7" />
              <span>Morent Admin</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-tertiary hover:text-primary hover:bg-primary/10"
              onClick={() => setSidebarOpen(false)}
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Điều hướng quản trị">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                  'text-secondary hover:text-primary hover:bg-primary/10'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar name="Admin" size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">Quản trị viên</p>
                <p className="text-xs text-tertiary truncate">admin@morent.vn</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-surface border-b border-border lg:hidden">
          <div className="container h-full flex items-center justify-between">
            <button
              className="p-2 rounded-lg text-tertiary hover:text-primary hover:bg-primary/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/admin" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Car className="w-7 h-7" />
              <span>Morent Admin</span>
            </Link>
            <div className="w-10" />
          </div>
        </header>
        
        <main className="container py-6 lg:py-8" role="main">
          <Outlet />
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </div>
  );
}

export function ProviderLayout() {
  const { toasts, hideToast } = useNotification();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  
  const navItems = [
    { path: '/provider', label: 'Tổng quan', icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: '/provider/cars', label: 'Quản lý xe', icon: <Car className="w-5 h-5" /> },
    { path: '/provider/bookings', label: 'Đơn đặt xe', icon: <Calendar className="w-5 h-5" /> },
    { path: '/provider/customers', label: 'Khách hàng', icon: <Users className="w-5 h-5" /> },
    { path: '/provider/payments', label: 'Thanh toán', icon: <CreditCard className="w-5 h-5" /> },
    { path: '/provider/reviews', label: 'Đánh giá', icon: <Star className="w-5 h-5" /> },
    { path: '/provider/support', label: 'Hỗ trợ', icon: <Headphones className="w-5 h-5" /> },
    { path: '/provider/reports', label: 'Báo cáo', icon: <BarChart className="w-5 h-5" /> },
    { path: '/provider/settings', label: 'Cài đặt', icon: <Settings className="w-5 h-5" /> },
  ];
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <aside 
        className={classNames(
          'fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-border transform transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label="Menu nhà cung cấp"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-4 border-b border-border">
            <Link to="/provider" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Car className="w-7 h-7" />
              <span>Morent Provider</span>
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg text-tertiary hover:text-primary hover:bg-primary/10"
              onClick={() => setSidebarOpen(false)}
              aria-label="Đóng menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label="Điều hướng nhà cung cấp">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={classNames(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition',
                  'text-secondary hover:text-primary hover:bg-primary/10'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar name="Provider" size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">Nhà cung cấp</p>
                <p className="text-xs text-tertiary truncate">provider@morent.vn</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-surface border-b border-border lg:hidden">
          <div className="container h-full flex items-center justify-between">
            <button
              className="p-2 rounded-lg text-tertiary hover:text-primary hover:bg-primary/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/provider" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Car className="w-7 h-7" />
              <span>Morent Provider</span>
            </Link>
            <div className="w-10" />
          </div>
        </header>
        
        <main className="container py-6 lg:py-8" role="main">
          <Outlet />
        </main>
      </div>
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      <ToastContainer toasts={toasts} onClose={hideToast} />
    </div>
  );
}

function LayoutDashboard({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
}

function Users({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
}

function Building({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="21" width="18" height="2" rx="1"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M6 16v-4"/><path d="M10 16v-4"/><path d="M14 16v-4"/><path d="M18 16v-4"/></svg>;
}

function CreditCard({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>;
}

function BarChart({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
}
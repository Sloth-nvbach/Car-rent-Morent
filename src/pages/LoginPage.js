import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Car, Mail, Lock, Eye, EyeOff, User, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();
  const { error: showError } = useNotification();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [role, setRole] = useState('customer');
  
  const from = location.state?.from?.pathname || '/';
  
  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await login(formData.email, formData.password, role);
      navigate(from, { replace: true });
    } catch (err) {
      showError('Đăng nhập thất bại', err.message || 'Email hoặc mật khẩu không đúng');
    }
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl mb-6">
            <Car className="w-8 h-8" />
            <span>Morent</span>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Đăng nhập</h1>
          <p className="text-secondary mt-2">Chào mừng bạn quay lại với Morent</p>
        </div>
        
        <div className="card p-6 sm:p-8">
          <div className="mb-6">
            <label className="text-sm font-medium text-primary mb-2 block">Đăng nhập với tư cách</label>
            <div className="flex gap-3">
              {['customer', 'provider', 'admin'].map(r => (
                <button
                  key={r}
                  type="button"
                  className={classNames(
                    'flex-1 py-3 px-4 rounded-lg border-2 font-medium transition',
                    role === r 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-border text-secondary hover:border-primary/50'
                  )}
                  onClick={() => setRole(r)}
                >
                  {r === 'customer' && <User className="w-5 h-5 mx-auto mb-1" />}
                  {r === 'provider' && <Building className="w-5 h-5 mx-auto mb-1" />}
                  {r === 'admin' && <Shield className="w-5 h-5 mx-auto mb-1" />}
                  {r === 'customer' ? 'Khách hàng' : r === 'provider' ? 'Nhà cung cấp' : 'Quản trị'}
                </button>
              ))}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData(d => ({ ...d, [e.target.name]: e.target.value }))}
              error={errors.email}
              placeholder="nhap@email.com"
              required
              leftIcon="mail"
              autoComplete="email"
            />
            
            <Input
              label="Mật khẩu"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => setFormData(d => ({ ...d, [e.target.name]: e.target.value }))}
              error={errors.password}
              placeholder="••••••••"
              required
              leftIcon="lock"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconClick={() => setShowPassword(!showPassword)}
              autoComplete="current-password"
            />
            
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData(d => ({ ...d, remember: e.target.checked }))}
                  className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
                />
                <span className="text-sm text-secondary">Ghi nhớ đăng nhập</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">Quên mật khẩu?</Link>
            </div>
            
            <Button type="submit" className="w-full" size="lg" loading={authLoading}>
              Đăng nhập
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-secondary">Chưa có tài khoản? 
              <Link to="/register" className="text-primary font-medium hover:underline ml-1">Đăng ký ngay</Link>
            </p>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-tertiary text-center mb-3">Tài khoản demo (mật khẩu: 123456):</p>
            <div className="space-y-2 text-xs text-tertiary">
              <p>Khách hàng: nguyenvanan@email.com</p>
              <p>Nhà cung cấp: hanoi@morentauto.vn</p>
              <p>Quản trị: admin@morent.vn</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Building({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="21" width="18" height="2" rx="1"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M6 16v-4"/><path d="M10 16v-4"/><path d="M14 16v-4"/><path d="M18 16v-4"/></svg>;
}

function Shield({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
}
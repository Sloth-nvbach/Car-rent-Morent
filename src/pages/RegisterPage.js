import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Car, Mail, Lock, Eye, EyeOff, User, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Checkbox } from '../ui/Input';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading: authLoading } = useAuth();
  const { error: showError, success } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
    agreeMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Họ tên không được để trống';
    else if (formData.name.trim().length < 2) newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ (VD: 09xxxxxxxx)';
    
    if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (formData.password.length < 8) newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    else if (!/[A-Z]/.test(formData.password)) newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa';
    else if (!/[a-z]/.test(formData.password)) newErrors.password = 'Mật khẩu phải có ít nhất 1 chữ thường';
    else if (!/[0-9]/.test(formData.password)) newErrors.password = 'Mật khẩu phải có ít nhất 1 số';
    
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Bạn phải đồng ý với Điều khoản và Chính sách bảo mật';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    try {
      await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      });
      success('Đăng ký thành công!', 'Chào mừng bạn đến với Morent');
      navigate('/');
    } catch (err) {
      showError('Đăng ký thất bại', err.message || 'Email hoặc số điện thoại đã được sử dụng');
    }
  };
  
  const passwordStrengthLabels = ['Rất yếu', 'Yếu', 'Trung bình', 'Khá', 'Mạnh'];
  const passwordStrengthColors = ['bg-error', 'bg-warning', 'bg-info', 'bg-primary', 'bg-success'];
  
  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl mb-6">
            <Car className="w-8 h-8" />
            <span>Morent</span>
          </Link>
          <h1 className="text-2xl font-bold text-primary">Tạo tài khoản mới</h1>
          <p className="text-secondary mt-2">Tham gia Morent để trải nghiệm thuê xe dễ dàng, an tâm</p>
        </div>
        
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Họ tên *"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(d => ({ ...d, [e.target.name]: e.target.value }))}
              error={errors.name}
              placeholder="Nguyễn Văn An"
              required
              leftIcon="user"
              autoComplete="name"
            />
            
            <Input
              label="Email *"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => setFormData(d => ({ ...d, [e.target.name]: e.target.value }))}
              error={errors.email}
              placeholder="nguyenvanan@email.com"
              required
              leftIcon="mail"
              autoComplete="email"
            />
            
            <Input
              label="Số điện thoại *"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData(d => ({ ...d, [e.target.name]: e.target.value }))}
              error={errors.phone}
              placeholder="09xxxxxxxx"
              required
              leftIcon="phone"
              autoComplete="tel"
            />
            
            <Input
              label="Mật khẩu *"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={(e) => { 
                setFormData(d => ({ ...d, [e.target.name]: e.target.value }));
                checkPasswordStrength(e.target.value);
              }}
              error={errors.password}
              placeholder="••••••••"
              required
              leftIcon="lock"
              rightIcon={showPassword ? 'eye-off' : 'eye'}
              onRightIconClick={() => setShowPassword(!showPassword)}
              autoComplete="new-password"
              hint={formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 h-1.5">
                    {[1,2,3,4,5].map((i, idx) => (
                      <div key={i} className={`flex-1 rounded ${idx < passwordStrength ? passwordStrengthColors[passwordStrength - 1] : 'bg-border'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-tertiary mt-1">Độ mạnh: {passwordStrengthLabels[passwordStrength - 1] || 'Chưa nhập'}</p>
                </div>
              )}
            />
            
            <Input
              label="Xác nhận mật khẩu *"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(d => ({ ...d, [e.target.name]: e.target.value }))}
              error={errors.confirmPassword}
              placeholder="••••••••"
              required
              leftIcon="lock"
              rightIcon={showConfirmPassword ? 'eye-off' : 'eye'}
              onRightIconClick={() => setShowConfirmPassword(!showConfirmPassword)}
              autoComplete="new-password"
            />
            
            <Checkbox
              label="Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Morent"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData(d => ({ ...d, agreeTerms: e.target.checked }))}
              error={errors.agreeTerms}
              required
            />
            
            <Checkbox
              label="Nhận thông tin khuyến mãi, ưu đãi qua email/SMS"
              name="agreeMarketing"
              checked={formData.agreeMarketing}
              onChange={(e) => setFormData(d => ({ ...d, agreeMarketing: e.target.checked }))}
            />
            
            <Button type="submit" className="w-full" size="lg" loading={authLoading}>
              Tạo tài khoản
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-secondary">Đã có tài khoản? 
              <Link to="/login" className="text-primary font-medium hover:underline ml-1">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
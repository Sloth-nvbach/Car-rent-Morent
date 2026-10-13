import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Car, Mail, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useNotification } from '../context/NotificationContext';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const validateEmail = () => {
    if (!email.trim()) { setErrors({ email: 'Email không được để trống' }); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErrors({ email: 'Email không hợp lệ' }); return false; }
    setErrors({}); return true;
  };
  
  const validateCode = () => {
    if (!code.trim()) { setErrors({ code: 'Mã xác thực không được để trống' }); return false; }
    if (code.length !== 6) { setErrors({ code: 'Mã xác thực phải có 6 chữ số' }); return false; }
    setErrors({}); return true;
  };
  
  const validatePassword = () => {
    if (!password) { setErrors({ password: 'Mật khẩu mới không được để trống' }); return false; }
    if (password.length < 8) { setErrors({ password: 'Mật khẩu phải có ít nhất 8 ký tự' }); return false; }
    if (password !== confirmPassword) { setErrors({ confirmPassword: 'Mật khẩu xác nhận không khớp' }); return false; }
    setErrors({}); return true;
  };
  
  const handleSendCode = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep('code');
    success('Đã gửi mã', 'Mã xác thực đã được gửi đến email của bạn');
  };
  
  const handleVerifyCode = async () => {
    if (!validateCode()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep('password');
  };
  
  const handleResetPassword = async () => {
    if (!validatePassword()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    success('Đổi mật khẩu thành công', 'Bạn có thể đăng nhập với mật khẩu mới');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-2xl mb-6">
            <Car className="w-8 h-8" /> <span>Morent</span>
          </Link>
          <button className="absolute left-0 top-0 p-2 text-tertiary hover:text-primary" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-primary">Quên mật khẩu</h1>
          <p className="text-secondary mt-2">Nhập email để nhận mã đặt lại mật khẩu</p>
        </div>
        
        <div className="card p-6 sm:p-8">
          <div className="flex justify-center gap-2 mb-6">
            {['email', 'code', 'password'].map((s, i) => (
              <div key={s} className="flex items-center gap-1">
                <div className={classNames('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium', 
                  (['email', 'code', 'password'].indexOf(step) >= i) ? 'bg-primary text-white' : 'bg-border text-tertiary')}>
                  {['email', 'code', 'password'].indexOf(step) > i ? <CheckCircle className="w-5 h-5" /> : i + 1}
                </div>
                {i < 2 && <div className="w-16 h-1 bg-border" />}
              </div>
            ))}
          </div>
          
          {step === 'email' && (
            <form onSubmit={(e) => { e.preventDefault(); handleSendCode(); }} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} placeholder="nhap@email.com" required leftIcon="mail" />
              <Button type="submit" className="w-full" size="lg" loading={loading}>Gửi mã xác thực</Button>
            </form>
          )}
          
          {step === 'code' && (
            <form onSubmit={(e) => { e.preventDefault(); handleVerifyCode(); }} className="space-y-4">
              <p className="text-sm text-secondary text-center">Nhập mã 6 chữ số đã gửi đến <strong>{email}</strong></p>
              <Input label="Mã xác thực" value={code} onChange={(e) => setCode(e.target.value)} error={errors.code} placeholder="123456" required maxLength={6} />
              <Button type="submit" className="w-full" size="lg" loading={loading}>Xác thực</Button>
              <Button variant="ghost" className="w-full" size="sm" onClick={() => setStep('email')}>Gửi lại mã</Button>
            </form>
          )}
          
          {step === 'password' && (
            <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(); }} className="space-y-4">
              <Input label="Mật khẩu mới" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} placeholder="••••••••" required leftIcon="lock" rightIcon={showPassword ? 'eye-off' : 'eye'} onRightIconClick={() => setShowPassword(!showPassword)} />
              <Input label="Xác nhận mật khẩu" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={errors.confirmPassword} placeholder="••••••••" required leftIcon="lock" rightIcon={showPassword ? 'eye-off' : 'eye'} onRightIconClick={() => setShowPassword(!showPassword)} />
              <Button type="submit" className="w-full" size="lg" loading={loading}>Đặt lại mật khẩu</Button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-secondary">Nhớ mật khẩu? <Link to="/login" className="text-primary font-medium hover:underline ml-1">Đăng nhập</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
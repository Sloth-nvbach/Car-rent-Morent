import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { formatCurrency, formatDate } from '../utils/helpers';
import { 
  ChevronLeft, ChevronRight, X, MapPin, Calendar, Clock, User, Star, Shield, CheckCircle, 
  Truck, Headphones, Car, Fuel, Settings, Users, Zap, Leaf, Award, Share2, Heart, MapPin as MapPinIcon,
  ArrowLeft, Phone, Mail, MessageCircle, CreditCard, Banknote, Smartphone, Loader2, AlertCircle, CheckCircle2
} from 'lucide-react';
import { mockCars, mockProviders } from '../data/mockData';
import { Button } from '../ui/Button';
import { Badge, StepIndicator, Avatar, Skeleton, Input, RadioGroup } from '../ui/DataDisplay';
import { Modal } from '../ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';

const STEPS = [
  { id: 'info', label: 'Thông tin' },
  { id: 'payment', label: 'Thanh toán' },
  { id: 'confirm', label: 'Xác nhận' },
];

const PAYMENT_METHODS = [
  { id: 'vnpay', label: 'VNPAY', icon: <Smartphone className="w-5 h-5" />, desc: 'Thanh toán qua ứng dụng VNPAY/Ngân hàng' },
  { id: 'momo', label: 'MoMo', icon: <Smartphone className="w-5 h-5" />, desc: 'Ví điện tử MoMo' },
  { id: 'zalopay', label: 'ZaloPay', icon: <Smartphone className="w-5 h-5" />, desc: 'Ví điện tử ZaloPay' },
  { id: 'bank_transfer', label: 'Chuyển khoản', icon: <Banknote className="w-5 h-5" />, desc: 'Chuyển khoản ngân hàng (xác nhận trong 24h)' },
  { id: 'cash', label: 'Tiền mặt', icon: <CreditCard className="w-5 h-5" />, desc: 'Thanh toán khi nhận xe (chỉ áp dụng một số xe)' },
];

export function BookingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { calculatePrice, createBooking } = useBooking();
  const { success, error: showError } = useNotification();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [car, setCar] = useState(null);
  const [provider, setProvider] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    startTime: '09:00',
    endTime: '18:00',
    pickupLocation: '',
    dropoffLocation: '',
    sameLocation: true,
    notes: '',
    fullName: '',
    email: '',
    phone: '',
    cccd: '',
    licenseNumber: '',
    licenseExpiry: '',
    paymentMethod: 'vnpay',
    agreeTerms: false,
  });
  const [priceInfo, setPriceInfo] = useState(null);
  const [errors, setErrors] = useState({});
  
  const state = location.state;
  
  useEffect(() => {
    if (state?.carId) {
      const foundCar = mockCars.find(c => c.id === state.carId);
      if (foundCar) {
        setCar(foundCar);
        setProvider(mockProviders.find(p => p.id === foundCar.providerId));
        setFormData(prev => ({
          ...prev,
          startDate: state.startDate,
          endDate: state.endDate,
          startTime: state.startTime,
          endTime: state.endTime,
          pickupLocation: state.pickupLocation,
          dropoffLocation: state.dropoffLocation,
          notes: state.notes,
          fullName: user?.name || '',
          email: user?.email || '',
          phone: user?.phone || '',
        }));
      }
    } else if (!car) {
      navigate('/search');
    }
  }, [state, user, navigate]);
  
  useEffect(() => {
    if (car && formData.startDate && formData.endDate) {
      setPriceInfo(calculatePrice(car.id, formData.startDate, formData.endDate));
    }
  }, [car, formData.startDate, formData.endDate, calculatePrice]);
  
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Họ tên không được để trống';
      if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
      if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
      else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'Số điện thoại không hợp lệ';
      if (!formData.cccd.trim()) newErrors.cccd = 'CCCD không được để trống';
      else if (!/^[0-9]{12}$/.test(formData.cccd)) newErrors.cccd = 'CCCD phải có 12 chữ số';
      if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'Số bằng lái không được để trống';
      if (!formData.licenseExpiry.trim()) newErrors.licenseExpiry = 'Ngày hết hạn bằng lái không được để trống';
      if (!formData.agreeTerms) newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản';
    }
    
    if (step === 1) {
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Vui lòng chọn phương thức thanh toán';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setStep(s => Math.min(s + 1, STEPS.length - 1));
    }
  };
  
  const handleBack = () => {
    setStep(s => Math.max(s - 1, 0));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    if (!car || !user) return;
    
    setLoading(true);
    try {
      await createBooking({
        userId: user.id,
        carId: car.id,
        providerId: car.providerId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        pickupLocation: formData.pickupLocation,
        dropoffLocation: formData.sameLocation ? formData.pickupLocation : formData.dropoffLocation,
        totalDays: priceInfo?.days || 1,
        pricePerDay: priceInfo?.pricePerDay || car.pricePerDay,
        subtotal: priceInfo?.subtotal || 0,
        discount: priceInfo?.discount || 0,
        tax: priceInfo?.tax || 0,
        total: priceInfo?.total || 0,
        status: 'pending',
        paymentStatus: 'pending',
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });
      
      success('Đặt xe thành công!', 'Đơn đặt xe đã được tạo. Nhà cung cấp sẽ xác nhận trong thời gian sớm nhất.');
      navigate('/account/bookings');
    } catch (err) {
      showError('Lỗi', 'Không thể tạo đơn đặt xe. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  if (!car) {
    return (
      <div className="container py-16 text-center">
        <Car className="w-16 h-16 text-tertiary mx-auto mb-4" />
        <Skeleton variant="title" className="mx-auto mb-4" style={{ width: '300px' }} />
        <Skeleton variant="text" count={3} />
      </div>
    );
  }
  
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container py-8">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-tertiary">
            <li><Link to="/" className="hover:text-primary">Trang chủ</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link to="/search" className="hover:text-primary">Tìm xe</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-primary truncate max-w-[200px]">{car.name}</li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-primary">Đặt xe</li>
          </ol>
        </nav>
        
        <StepIndicator steps={STEPS} currentStep={step} className="mb-8" />
        
        <div className="grid lg:grid-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <PanelStep step={step} onNext={handleNext} onBack={handleBack} />
            </form>
          </div>
          
          <div className="lg:col-span-1">
            <BookingSummary 
              car={car} 
              provider={provider}
              formData={formData}
              priceInfo={priceInfo}
              step={step}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelStep({ step, onNext, onBack }) {
  const { formData, setFormData, errors } = React.useContext(BookingFormContext);
  
  if (step === 0) {
    return (
      <div className="card p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">Thông tin người thuê</h2>
        
        <div className="grid grid-2 gap-4">
          <Input
            label="Họ tên *"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
            required
          />
          <Input
            label="Email *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
        </div>
        
        <div className="grid grid-2 gap-4">
          <Input
            label="Số điện thoại *"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            placeholder="09xxxxxxxx"
          />
          <Input
            label="CCCD *"
            name="cccd"
            value={formData.cccd}
            onChange={handleChange}
            error={errors.cccd}
            required
            placeholder="12 số"
            maxLength={12}
          />
        </div>
        
        <div className="grid grid-2 gap-4">
          <Input
            label="Số bằng lái xe *"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            error={errors.licenseNumber}
            required
          />
          <Input
            label="Hết hạn bằng lái *"
            type="date"
            name="licenseExpiry"
            value={formData.licenseExpiry}
            onChange={handleChange}
            error={errors.licenseExpiry}
            required
            min={today}
          />
        </div>
        
        <div className="grid grid-2 gap-4">
          <Input
            label="Địa điểm nhận xe *"
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            required
          />
          <Input
            label="Địa điểm trả xe"
            name="dropoffLocation"
            value={formData.dropoffLocation}
            onChange={handleChange}
            disabled={formData.sameLocation}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="sameLocation"
            className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
            checked={formData.sameLocation}
            onChange={(e) => setFormData(d => ({ ...d, sameLocation: e.target.checked }))}
          />
          <label htmlFor="sameLocation" className="text-sm text-secondary cursor-pointer">Trả xe tại cùng địa điểm</label>
        </div>
        
        <Input
          label="Ghi chú"
          name="notes"
          as="textarea"
          rows={3}
          value={formData.notes}
          onChange={handleChange}
          placeholder="Yêu cầu đặc biệt..."
        />
        
        <Checkbox
          label="Tôi đồng ý với Điều khoản sử dụng và Chính sách bảo mật của Morent"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={(e) => setFormData(d => ({ ...d, agreeTerms: e.target.checked }))}
          error={errors.agreeTerms}
          required
        />
        
        <div className="flex justify-end pt-4 border-t border-border">
          <Button size="lg" onClick={onNext}>Tiếp theo: Thanh toán</Button>
        </div>
      </div>
    );
  }
  
  if (step === 1) {
    return (
      <div className="card p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">Phương thức thanh toán</h2>
        <p className="text-secondary">Chọn cách thanh toán phù hợp với bạn</p>
        
        <RadioGroup
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          options={PAYMENT_METHODS.map(p => ({ 
            value: p.id, 
            label: (
              <div className="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-primary transition">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                  {p.icon}
                </div>
                <div>
                  <p className="font-medium text-primary">{p.label}</p>
                  <p className="text-sm text-secondary">{p.desc}</p>
                </div>
              </div>
            )
          }))}
        />
        
        <div className="flex justify-between gap-4 pt-4 border-t border-border">
          <Button variant="secondary" size="lg" onClick={onBack}>Quay lại</Button>
          <Button size="lg" onClick={onNext}>Tiếp theo: Xác nhận</Button>
        </div>
      </div>
    );
  }
  
  if (step === 2) {
    return (
      <div className="card p-6 space-y-6">
        <h2 className="text-xl font-bold text-primary">Xác nhận đơn hàng</h2>
        <p className="text-secondary">Vui lòng kiểm tra kỹ thông tin trước khi đặt xe</p>
        
        <div className="space-y-4">
          <div className="p-4 bg-bg-secondary rounded-lg">
            <h3 className="font-medium text-primary mb-3">Thông tin xe</h3>
            <div className="flex items-center gap-3">
              <img src={car.images[0]} alt={car.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <p className="font-medium text-primary">{car.name}</p>
                <p className="text-sm text-secondary">{car.brand} {car.model} ({car.year}) · {car.seats} chỗ</p>
                <p className="text-sm text-secondary">{formData.startTime} {formatDate(formData.startDate)} - {formData.endTime} {formatDate(formData.endDate)}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-bg-secondary rounded-lg">
            <h3 className="font-medium text-primary mb-3">Thông tin người thuê</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Họ tên:</span> {formData.fullName}</p>
              <p><span className="font-medium">Email:</span> {formData.email}</p>
              <p><span className="font-medium">SĐT:</span> {formData.phone}</p>
              <p><span className="font-medium">CCCD:</span> {formData.cccd}</p>
              <p><span className="font-medium">Bằng lái:</span> {formData.licenseNumber} (hết hạn: {formatDate(formData.licenseExpiry)})</p>
            </div>
          </div>
          
          <div className="p-4 bg-bg-secondary rounded-lg">
            <h3 className="font-medium text-primary mb-3">Địa điểm</h3>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Nhận: {formData.pickupLocation}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> Trả: {formData.sameLocation ? 'Cùng địa điểm' : formData.dropoffLocation}</p>
            </div>
          </div>
          
          {formData.notes && (
            <div className="p-4 bg-bg-secondary rounded-lg">
              <h3 className="font-medium text-primary mb-3">Ghi chú</h3>
              <p className="text-sm text-secondary">{formData.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between gap-4 pt-4 border-t border-border">
          <Button variant="secondary" size="lg" onClick={onBack}>Quay lại</Button>
          <Button size="lg" loading={loading} onClick={handleSubmit}>Xác nhận đặt xe</Button>
        </div>
      </div>
    );
  }
  
  return null;
}

const BookingFormContext = React.createContext(null);

function BookingSummary({ car, provider, formData, priceInfo, step }) {
  return (
    <div className="card p-6 sticky top-24">
      <h3 className="font-semibold text-primary mb-4">Tóm tắt đơn hàng</h3>
      
      <div className="flex items-start gap-3 mb-4">
        <img src={car.images[0]} alt={car.name} className="w-20 h-20 rounded-lg object-cover" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-primary truncate">{car.name}</p>
          <p className="text-sm text-secondary">{car.brand} {car.model} · {car.seats} chỗ</p>
          <p className="text-sm text-secondary">{formData.startTime} {formatDate(formData.startDate)} - {formData.endTime} {formatDate(formData.endDate)}</p>
        </div>
      </div>
      
      {priceInfo && (
        <div className="space-y-3 mb-4 p-4 bg-bg-secondary rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Giá thuê ({priceInfo.days} ngày)</span>
            <span>{formatCurrency(priceInfo.subtotal)}</span>
          </div>
          {priceInfo.discount > 0 && (
            <div className="flex justify-between text-sm text-success">
              <span>Giảm giá</span>
              <span>-{formatCurrency(priceInfo.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-secondary">Thuế (9%)</span>
            <span>{formatCurrency(priceInfo.tax)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-lg font-bold text-primary">
            <span>Tổng thanh toán</span>
            <span>{formatCurrency(priceInfo.total)}</span>
          </div>
        </div>
      )}
      
      <div className="border-t border-border pt-4 space-y-2 text-sm text-secondary">
        <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Bảo hiểm toàn diện</div>
        <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Giao xe tận nơi</div>
        <div className="flex items-center gap-2"><Headphones className="w-4 h-4 text-primary" /> Hỗ trợ 24/7</div>
        <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> Hủy miễn phí 24h trước</div>
      </div>
      
      {step < 2 && (
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20 text-sm text-primary">
          <p className="font-medium mb-1">Bước {step + 1} / {STEPS.length}</p>
          <p>{STEPS[step].label}</p>
        </div>
      )}
    </div>
  );
}

function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
}
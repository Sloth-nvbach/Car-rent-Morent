import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { formatCurrency, formatDate } from '../utils/helpers';
import { 
  ChevronLeft, ChevronRight, X, MapPin, Calendar, Clock, User, Star, Shield, CheckCircle, 
  Truck, Headphones, Car, Fuel, Settings, Users, Zap, Leaf, Award, Share2, Heart, MapPin as MapPinIcon,
  ArrowLeft, Phone, Mail, MessageCircle
} from 'lucide-react';
import { mockCars, mockProviders, mockReviews, carFeatures, policies } from '../data/mockData';
import { Button } from '../ui/Button';
import { Badge, Rating, Avatar, Skeleton, TabPanel, Tabs, Accordion } from '../ui/DataDisplay';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';

export function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { calculatePrice, isCarAvailable } = useBooking();
  const { success, error: showError } = useNotification();
  
  const [car, setCar] = useState(null);
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndex, setImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '18:00',
    pickupLocation: '',
    dropoffLocation: '',
    sameLocation: true,
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [priceInfo, setPriceInfo] = useState(null);
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  useEffect(() => {
    const foundCar = mockCars.find(c => c.id === id);
    if (foundCar) {
      setCar(foundCar);
      setProvider(mockProviders.find(p => p.id === foundCar.providerId));
      setReviews(mockReviews.filter(r => r.carId === id));
      setBookingData(prev => ({
        ...prev,
        startDate: today,
        endDate: tomorrow,
        pickupLocation: foundCar.address,
        dropoffLocation: foundCar.address,
      }));
    }
    setLoading(false);
  }, [id]);
  
  useEffect(() => {
    if (car && bookingData.startDate && bookingData.endDate) {
      const available = isCarAvailable(car.id, bookingData.startDate, bookingData.endDate);
      if (!available) {
        setPriceInfo({ ...calculatePrice(car.id, bookingData.startDate, bookingData.endDate), available: false });
      } else {
        setPriceInfo(calculatePrice(car.id, bookingData.startDate, bookingData.endDate));
      }
    }
  }, [car, bookingData.startDate, bookingData.endDate]);
  
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/cars/${id}` } });
      return;
    }
    if (!car) return;
    
    const available = isCarAvailable(car.id, bookingData.startDate, bookingData.endDate);
    if (!available) {
      showError('Xe không sẵn có', 'Xe đã được đặt trong khoảng thời gian này. Vui lòng chọn thời gian khác.');
      return;
    }
    
    setBookingLoading(true);
    try {
      const price = calculatePrice(car.id, bookingData.startDate, bookingData.endDate);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      navigate('/booking', { 
        state: { 
          carId: car.id,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          startTime: bookingData.startTime,
          endTime: bookingData.endTime,
          pickupLocation: bookingData.pickupLocation,
          dropoffLocation: bookingData.dropoffLocation,
          notes: bookingData.notes,
          price,
        } 
      });
      setShowBookingModal(false);
      success('Đặt xe thành công', 'Đang chuyển đến trang thanh toán...');
    } catch (err) {
      showError('Lỗi', 'Không thể tạo đơn đặt xe. Vui lòng thử lại.');
    } finally {
      setBookingLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-8">
        <Skeleton variant="title" className="mb-4" />
        <div className="grid lg:grid-3 gap-8">
          <Skeleton variant="image" className="aspect-video lg:col-span-2" />
          <Skeleton variant="card" />
        </div>
      </div>
    );
  }
  
  if (!car) {
    return (
      <div className="container py-16 text-center">
        <Car className="w-16 h-16 text-tertiary mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-primary mb-2">Không tìm thấy xe</h2>
        <p className="text-secondary mb-6">Xe bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
        <Link to="/search" className="btn btn-primary">Quay lại tìm kiếm</Link>
      </div>
    );
  }
  
  const featureIcons = {
    ac: '🌡️', bluetooth: '📱', usb: '🔌', gps: '🗺️', camera: '📷',
    sensor: '📡', sunroof: '☀️', leather: '🛋️', apple_carplay: '🍎', android_auto: '🤖',
    keyless: '🔑', push_start: '🔘',
  };
  
  const policyIcons = {
    cancel_free: '↩️', unlimited_km: '♾️', insurance: '🛡️', roadside: '🛠️', delivery: '🚚', long_term: '📅',
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <nav className="bg-surface border-b border-border" aria-label="Breadcrumb">
        <div className="container py-4">
          <ol className="flex items-center gap-2 text-sm text-tertiary">
            <li><Link to="/" className="hover:text-primary">Trang chủ</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link to="/search" className="hover:text-primary">Tìm xe</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-primary truncate max-w-[200px]">{car.name}</li>
          </ol>
        </div>
      </nav>
      
      <div className="container py-8">
        <div className="grid lg:grid-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="card overflow-hidden">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={car.images[imageIndex]}
                  alt={`${car.name} - Hình ${imageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />
                {car.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur text-primary flex items-center justify-center shadow-lg hover:bg-white transition"
                      onClick={() => setImageIndex(i => (i - 1 + car.images.length) % car.images.length)}
                      aria-label="Hình trước"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur text-primary flex items-center justify-center shadow-lg hover:bg-white transition"
                      onClick={() => setImageIndex(i => (i + 1) % car.images.length)}
                      aria-label="Hình sau"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {car.images.map((_, i) => (
                        <button
                          key={i}
                          className={classNames('w-2 h-2 rounded-full transition', i === imageIndex ? 'bg-white' : 'bg-white/50')}
                          onClick={() => setImageIndex(i)}
                          aria-label={`Xem hình ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                {car.verified && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="primary" className="gap-1">
                      <Award className="w-3 h-3" />
                      Đã xác minh
                    </Badge>
                  </div>
                )}
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-2xl lg:text-3xl font-bold text-primary">{car.name}</h1>
                {car.verified && (
                  <Badge variant="primary" className="gap-1">
                    <Award className="w-3 h-3" />
                    Xe đã xác minh
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-secondary mb-4">
                <span className="flex items-center gap-1">{car.brand} {car.model} ({car.year})</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {car.seats} chỗ</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Settings className="w-4 h-4" /> {car.transmission === 'auto' ? 'Số tự động' : 'Số sàn'}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Fuel className="w-4 h-4" /> {car.fuel === 'electric' ? 'Điện' : car.fuel === 'hybrid' ? 'Hybrid' : car.fuel === 'diesel' ? 'Dầu' : 'Xăng'}</span>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1 text-warning">
                  <Rating value={car.rating} max={5} size="md" showValue />
                </div>
                <span className="text-secondary">({car.reviewCount} đánh giá)</span>
                <span className="text-border mx-2">|</span>
                <span className="text-secondary flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {provider?.address || car.address}
                </span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {car.policies?.slice(0, 4).map(p => {
                  const policy = policies.find(pol => pol.id === p);
                  return policy ? (
                    <Badge key={p} variant="gray" className="gap-1">
                      <span>{policyIcons[p] || '✓'}</span>
                      {policy.name}
                    </Badge>
                  ) : null;
                })}
                {car.policies && car.policies.length > 4 && (
                  <Badge variant="gray">+{car.policies.length - 4} chính sách khác</Badge>
                )}
              </div>
              
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(car.pricePerDay)}</p>
                    <p className="text-secondary">/ ngày</p>
                  </div>
                  <Button size="lg" className="w-full sm:w-auto" onClick={() => setShowBookingModal(true)}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Đặt xe ngay
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Mô tả xe</h3>
              <p className="text-secondary whitespace-pre-line">{car.description}</p>
              
              {car.specs && (
                <div className="mt-6 grid grid-2 lg:grid-4 gap-4">
                  {Object.entries(car.specs).map(([key, value]) => (
                    <div key={key} className="p-4 bg-bg-secondary rounded-lg">
                      <p className="text-sm text-tertiary">{key}</p>
                      <p className="font-medium text-primary">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Tiện ích & Trang thiết bị</h3>
              <div className="grid grid-2 md:grid-3 lg:grid-4 gap-3">
                {car.features?.map(f => (
                  <div key={f} className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg">
                    <span className="text-2xl">{featureIcons[f] || '✓'}</span>
                    <span className="text-sm text-secondary">{carFeatures.find(cf => cf.id === f)?.name || f}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Chính sách & Đảm bảo</h3>
              <div className="space-y-3">
                {car.policies?.map(p => {
                  const policy = policies.find(pol => pol.id === p);
                  return policy ? (
                    <div key={p} className="flex items-start gap-3 p-4 bg-bg-secondary rounded-lg">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-primary">{policy.name}</p>
                        <p className="text-sm text-secondary">{policy.description}</p>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Đánh giá từ khách hàng ({reviews.length})</h3>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map(review => (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar src={mockUsers.find(u => u.id === review.userId)?.avatar} name={mockUsers.find(u => u.id === review.userId)?.name} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-primary">{mockUsers.find(u => u.id === review.userId)?.name}</p>
                            <p className="text-sm text-tertiary">{formatDate(review.createdAt)}</p>
                          </div>
                          <Rating value={review.rating} size="sm" className="mt-1" />
                        </div>
                      </div>
                      <p className="text-secondary ml-10">{review.comment}</p>
                      {review.providerReply && (
                        <div className="mt-3 ml-10 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                          <p className="text-sm font-medium text-primary mb-1">Phản hồi từ nhà cung cấp:</p>
                          <p className="text-sm text-secondary">{review.providerReply.content}</p>
                          <p className="text-xs text-tertiary mt-1">{formatDate(review.providerReply.createdAt)}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-secondary text-center py-8">Chưa có đánh giá nào cho xe này</p>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="card p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-primary mb-4">Thông tin giá</h3>
              
              <div className="space-y-3 mb-4 p-4 bg-bg-secondary rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Giá thuê/ngày</span>
                  <span className="font-medium text-primary">{formatCurrency(car.pricePerDay)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Giá thuê/tuần</span>
                  <span className="font-medium text-primary">{formatCurrency(car.pricePerWeek)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-secondary">Giá thuê/tháng</span>
                  <span className="font-medium text-primary">{formatCurrency(car.pricePerMonth)}</span>
                </div>
              </div>
              
              {priceInfo && (
                <div className="space-y-3 mb-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Tạm tính ({priceInfo.days} ngày)</span>
                    <span className="font-medium">{formatCurrency(priceInfo.subtotal)}</span>
                  </div>
                  {priceInfo.discount > 0 && (
                    <div className="flex justify-between text-sm text-success">
                      <span>Giảm giá</span>
                      <span>-{formatCurrency(priceInfo.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Thuế (9%)</span>
                    <span className="font-medium">{formatCurrency(priceInfo.tax)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-lg font-bold text-primary">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(priceInfo.total)}</span>
                  </div>
                </div>
              )}
              
              <Button 
                className="w-full" 
                size="lg" 
                onClick={() => setShowBookingModal(true)}
                disabled={bookingLoading}
              >
                {bookingLoading ? 'Đang xử lý...' : 'Đặt xe ngay'}
              </Button>
              
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-primary" /> Bảo hiểm toàn diện</div>
                <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-primary" /> Giao xe tận nơi</div>
                <div className="flex items-center gap-2"><Headphones className="w-4 h-4 text-primary" /> Hỗ trợ 24/7</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-success" /> Hủy miễn phí 24h trước</div>
              </div>
            </div>
            
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Nhà cung cấp</h3>
              {provider && (
                <Link to={`/providers/${provider.id}`} className="block">
                  <div className="flex items-center gap-4">
                    <Avatar src={provider.avatar} name={provider.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary truncate">{provider.name}</p>
                      <p className="text-sm text-tertiary truncate">{provider.address}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Rating value={provider.rating} size="sm" showValue />
                        <span className="text-xs text-tertiary">({provider.reviewCount} đánh giá)</span>
                        {provider.verified && <Badge variant="primary" className="text-xs">Đã xác minh</Badge>}
                      </div>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Modal 
        isOpen={showBookingModal} 
        onClose={() => setShowBookingModal(false)} 
        title="Đặt xe" 
        size="lg"
      >
        <form onSubmit={handleBookingSubmit} className="space-y-6">
          <div className="grid grid-2 gap-4">
            <div>
              <label htmlFor="startDate" className="input-label">Ngày nhận <span className="text-error">*</span></label>
              <input
                type="date"
                id="startDate"
                className="input-field"
                value={bookingData.startDate}
                onChange={(e) => setBookingData(d => ({ ...d, startDate: e.target.value }))}
                min={today}
                required
              />
            </div>
            <div>
              <label htmlFor="startTime" className="input-label">Giờ nhận <span className="text-error">*</span></label>
              <input
                type="time"
                id="startTime"
                className="input-field"
                value={bookingData.startTime}
                onChange={(e) => setBookingData(d => ({ ...d, startTime: e.target.value }))}
                required
              />
            </div>
            <div>
              <label htmlFor="endDate" className="input-label">Ngày trả <span className="text-error">*</span></label>
              <input
                type="date"
                id="endDate"
                className="input-field"
                value={bookingData.endDate}
                onChange={(e) => setBookingData(d => ({ ...d, endDate: e.target.value }))}
                min={bookingData.startDate || today}
                required
              />
            </div>
            <div>
              <label htmlFor="endTime" className="input-label">Giờ trả <span className="text-error">*</span></label>
              <input
                type="time"
                id="endTime"
                className="input-field"
                value={bookingData.endTime}
                onChange={(e) => setBookingData(d => ({ ...d, endTime: e.target.value }))}
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="pickupLocation" className="input-label">Địa điểm nhận xe <span className="text-error">*</span></label>
            <input
              type="text"
              id="pickupLocation"
              className="input-field"
              value={bookingData.pickupLocation}
              onChange={(e) => setBookingData(d => ({ ...d, pickupLocation: e.target.value }))}
              placeholder="VD: Sân bay Nội Bài, Khách sạn Furama..."
              required
            />
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="sameLocation"
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-primary"
              checked={bookingData.sameLocation}
              onChange={(e) => setBookingData(d => ({ ...d, sameLocation: e.target.checked }))}
            />
            <label htmlFor="sameLocation" className="text-sm text-secondary cursor-pointer">Trả xe tại cùng địa điểm</label>
          </div>
          
          {!bookingData.sameLocation && (
            <div>
              <label htmlFor="dropoffLocation" className="input-label">Địa điểm trả xe <span className="text-error">*</span></label>
              <input
                type="text"
                id="dropoffLocation"
                className="input-field"
                value={bookingData.dropoffLocation}
                onChange={(e) => setBookingData(d => ({ ...d, dropoffLocation: e.target.value }))}
                placeholder="VD: Sân bay Đà Nẵng, Khách sạn Hoi An..."
                required
              />
            </div>
          )}
          
          <div>
            <label htmlFor="notes" className="input-label">Ghi chú</label>
            <textarea
              id="notes"
              rows="3"
              className="input-field"
              value={bookingData.notes}
              onChange={(e) => setBookingData(d => ({ ...d, notes: e.target.value }))}
              placeholder="Yêu cầu đặc biệt (ghế trẻ em, người lái xe, giao xe sớm...)"
            />
          </div>
          
          {priceInfo && (
            <div className="p-4 bg-bg-secondary rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary">Tạm tính ({priceInfo.days} ngày)</span>
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
                <span>Tổng cộng</span>
                <span>{formatCurrency(priceInfo.total)}</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="secondary" type="button" onClick={() => setShowBookingModal(false)}>Hủy</Button>
            <Button type="submit" loading={bookingLoading}>Xác nhận đặt xe</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
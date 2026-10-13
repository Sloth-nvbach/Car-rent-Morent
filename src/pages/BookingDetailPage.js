import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { formatCurrency, formatDate, formatRelativeTime, getStatusConfig } from '../utils/helpers';
import { 
  ChevronLeft, MapPin, Calendar, Clock, User, Shield, CheckCircle, Truck, Headphones, 
  Car, CreditCard, AlertCircle, XCircle, MessageCircle, FileText, Download, Share2, 
  ArrowLeft, Star, Settings, Loader2
} from 'lucide-react';
import { mockCars, mockProviders, mockBookings, mockReviews } from '../data/mockData';
import { Button } from '../ui/Button';
import { Badge, StatusBadge, Avatar, Card, StepIndicator, Rating, Modal } from '../ui/DataDisplay';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';

export function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getBookingById, cancelBooking } = useBooking();
  const { success, error: showError } = useNotification();
  
  const [booking, setBooking] = useState(null);
  const [car, setCar] = useState(null);
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  
  useEffect(() => {
    const foundBooking = mockBookings.find(b => b.id === id);
    if (foundBooking) {
      setBooking(foundBooking);
      const foundCar = mockCars.find(c => c.id === foundBooking.carId);
      const foundProvider = mockProviders.find(p => p.id === foundBooking.providerId);
      setCar(foundCar);
      setProvider(foundProvider);
    }
    setLoading(false);
  }, [id]);
  
  const handleCancel = async () => {
    if (!cancelReason.trim()) return;
    setCancelling(true);
    try {
      await cancelBooking(booking.id, cancelReason);
      setBooking(prev => ({ ...prev, status: 'cancelled', paymentStatus: 'refunded' }));
      setShowCancelModal(false);
      success('Đã hủy đơn hàng', 'Tiền sẽ được hoàn về trong 3-5 ngày làm việc');
    } catch (err) {
      showError('Lỗi', err.message);
    } finally {
      setCancelling(false);
    }
  };
  
  const canCancel = booking && ['pending', 'confirmed'].includes(booking.status);
  
  if (loading) {
    return (
      <div className="container py-16">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="animate-spin w-8 h-8 border-3 border-primary border-t-transparent rounded-full mb-4" />
          <p className="text-secondary">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="container py-16 text-center">
        <AlertCircle className="w-16 h-16 text-tertiary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-secondary mb-6">Đơn đặt xe không tồn tại hoặc đã bị xóa</p>
        <Link to="/account/bookings" className="btn btn-primary">Quay lại danh sách</Link>
      </div>
    );
  }
  
  const statusConfig = getStatusConfig(booking.status);
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <nav className="bg-surface border-b border-border" aria-label="Breadcrumb">
        <div className="container py-4">
          <ol className="flex items-center gap-2 text-sm text-tertiary">
            <li><Link to="/" className="hover:text-primary">Trang chủ</Link></li>
            <li><ChevronLeft className="w-4 h-4" /></li>
            <li><Link to="/account/bookings" className="hover:text-primary">Đơn đặt xe</Link></li>
            <li><ChevronLeft className="w-4 h-4" /></li>
            <li className="text-primary truncate max-w-[200px]">{booking.id}</li>
          </ol>
        </div>
      </nav>
      
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-primary">Chi tiết đơn hàng</h1>
            <p className="text-secondary">Mã đơn: <span className="font-mono">{booking.id}</span></p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={booking.status} />
            {booking.paymentStatus === 'paid' && <Badge variant="success"><CreditCard className="w-3 h-3 mr-1" />Đã thanh toán</Badge>}
            {booking.paymentStatus === 'pending' && <Badge variant="warning"><CreditCard className="w-3 h-3 mr-1" />Chờ thanh toán</Badge>}
            {booking.paymentStatus === 'refunded' && <Badge variant="info"><CreditCard className="w-3 h-3 mr-1" />Đã hoàn tiền</Badge>}
          </div>
        </div>
        
        <div className="grid lg:grid-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Tiến trình đơn hàng</h3>
              <StepIndicator 
                steps={[
                  { id: 'pending', label: 'Tạo đơn' },
                  { id: 'confirmed', label: 'Xác nhận' },
                  { id: 'paid', label: 'Thanh toán' },
                  { id: 'active', label: 'Nhận xe' },
                  { id: 'completed', label: 'Hoàn tất' },
                ]} 
                currentStep={['pending', 'confirmed', 'paid', 'active', 'completed'].findIndex(s => s === booking.status)}
                className="mb-6"
              />
              
              <div className="space-y-4">
                {booking.timeline.map((event, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={classNames('w-8 h-8 rounded-full flex items-center justify-center', 
                        index < booking.timeline.length - 1 ? 'bg-primary text-white' : 'bg-bg-tertiary text-tertiary')}>
                        {event.status === 'cancelled' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>
                      {index < booking.timeline.length - 1 && <div className="w-0.5 h-12 bg-primary mt-1" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-primary">{event.note}</p>
                      <p className="text-sm text-tertiary">{formatRelativeTime(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Thông tin xe</h3>
              {car && (
                <div className="flex items-center gap-4">
                  <img src={car.images[0]} alt={car.name} className="w-24 h-24 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-primary truncate">{car.name}</h4>
                    <p className="text-sm text-secondary">{car.brand} {car.model} ({car.year}) · {car.seats} chỗ · {car.transmission === 'auto' ? 'Tự động' : 'Số sàn'}</p>
                    <p className="text-sm text-secondary">{car.fuel === 'electric' ? '⚡ Điện' : car.fuel === 'hybrid' ? '⛽ Hybrid' : car.fuel === 'diesel' ? '🛢️ Dầu' : '⛽ Xăng'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatCurrency(car.pricePerDay)}</p>
                    <p className="text-xs text-tertiary">/ ngày</p>
                  </div>
                </div>
              )}
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Thông tin chuyến đi</h3>
              <div className="grid grid-2 gap-4">
                <div className="p-4 bg-bg-secondary rounded-lg">
                  <p className="text-sm text-tertiary mb-1">Nhận xe</p>
                  <p className="font-medium text-primary flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.pickupLocation}</p>
                  <p className="text-sm text-secondary flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(booking.startDate)}</p>
                  <p className="text-sm text-secondary flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.startTime}</p>
                </div>
                <div className="p-4 bg-bg-secondary rounded-lg">
                  <p className="text-sm text-tertiary mb-1">Trả xe</p>
                  <p className="font-medium text-primary flex items-center gap-1"><MapPin className="w-4 h-4" /> {booking.dropoffLocation}</p>
                  <p className="text-sm text-secondary flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(booking.endDate)}</p>
                  <p className="text-sm text-secondary flex items-center gap-1"><Clock className="w-4 h-4" /> {booking.endTime}</p>
                </div>
                <div className="p-4 bg-bg-secondary rounded-lg">
                  <p className="text-sm text-tertiary mb-1">Thời gian thuê</p>
                  <p className="font-bold text-primary text-xl">{booking.totalDays} ngày</p>
                </div>
                <div className="p-4 bg-bg-secondary rounded-lg">
                  <p className="text-sm text-tertiary mb-1">Giá thuê/ngày</p>
                  <p className="font-bold text-primary text-xl">{formatCurrency(booking.pricePerDay)}</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Người thuê xe</h3>
              <div className="flex items-center gap-4">
                <Avatar name={user?.name} size="lg" />
                <div>
                  <p className="font-semibold text-primary">{user?.name}</p>
                  <p className="text-sm text-secondary">{user?.email}</p>
                  <p className="text-sm text-secondary">{user?.phone}</p>
                </div>
              </div>
            </Card>
            
            {booking.notes && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Ghi chú</h3>
                <p className="text-secondary">{booking.notes}</p>
              </Card>
            )}
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Chính sách & Hỗ trợ</h3>
              <div className="grid grid-2 md:grid-4 gap-4">
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Shield className="w-5 h-5" /></div>
                  <div><p className="font-medium">Bảo hiểm toàn diện</p><p className="text-sm text-secondary">Tai nạn, hỏa hoạn, thiên tai</p></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Truck className="w-5 h-5" /></div>
                  <div><p className="font-medium">Giao xe tận nơi</p><p className="text-sm text-secondary">Sân bay, khách sạn, nhà riêng</p></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Headphones className="w-5 h-5" /></div>
                  <div><p className="font-medium">Hỗ trợ 24/7</p><p className="text-sm text-secondary">Hotline: 1900 123 456</p></div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><CheckCircle className="w-5 h-5 text-success" /></div>
                  <div><p className="font-medium">Hủy miễn phí</p><p className="text-sm text-secondary">Trước 24h hoàn 100%</p></div>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-primary mb-4">Chi tiết thanh toán</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm"><span className="text-secondary">Tiền xe ({booking.totalDays} ngày)</span><span>{formatCurrency(booking.subtotal)}</span></div>
                {booking.discount > 0 && <div className="flex justify-between text-sm text-success"><span>Giảm giá</span><span>-{formatCurrency(booking.discount)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-secondary">Thuế (9%)</span><span>{formatCurrency(booking.tax)}</span></div>
                <div className="border-t border-border pt-2 flex justify-between text-lg font-bold text-primary"><span>Tổng cộng</span><span>{formatCurrency(booking.total)}</span></div>
              </div>
              
              <div className="p-4 bg-bg-secondary rounded-lg mb-4">
                <p className="font-medium text-primary mb-2">Phương thức thanh toán</p>
                <p className="text-sm text-secondary capitalize">{booking.paymentMethod?.replace('_', ' ') || 'Chưa chọn'}</p>
              </div>
              
              {booking.paymentStatus === 'pending' && (
                <Button className="w-full" size="lg" onClick={() => alert('Mở thanh toán')}>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Thanh toán ngay
                </Button>
              )}
              
              {booking.paymentStatus === 'paid' && (
                <Button variant="outline" className="w-full" onClick={() => alert('Tải hóa đơn')}>
                  <FileText className="w-5 h-5 mr-2" />
                  Tải hóa đơn
                </Button>
              )}
              
              {canCancel && (
                <Button variant="danger" className="w-full mt-2" onClick={() => setShowCancelModal(true)}>
                  <XCircle className="w-5 h-5 mr-2" />
                  Hủy đơn hàng
                </Button>
              )}
              
              <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm text-secondary">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Đặt: {formatRelativeTime(booking.createdAt)}</div>
                <div className="flex items-center gap-2"><CreditCard className="w-4 h-4" /> {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}</div>
              </div>
            </Card>
            
            {provider && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Nhà cung cấp</h3>
                <Link to={`/providers/${provider.id}`} className="block">
                  <div className="flex items-center gap-3">
                    <Avatar src={provider.avatar} name={provider.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary truncate">{provider.name}</p>
                      <p className="text-sm text-tertiary truncate">{provider.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Rating value={provider.rating} size="sm" showValue />
                        <Badge variant={provider.verified ? 'success' : 'warning'} className="text-xs">
                          {provider.verified ? 'Đã xác minh' : 'Chờ xác minh'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Modal 
        isOpen={showCancelModal} 
        onClose={() => setShowCancelModal(false)} 
        title="Hủy đơn đặt xe" 
        size="md"
      >
        <p className="text-secondary mb-4">Bạn có chắc chắn muốn hủy đơn đặt xe <strong>{booking.id}</strong>?</p>
        <p className="text-sm text-warning mb-4">
          <AlertCircle className="w-4 h-4 inline mr-1" />
          Hủy trước 24h được hoàn 100% tiền cọc. Hủy trong 24h trừ 50% tiền cọc.
        </p>
        <div className="space-y-4">
          <label className="block">
            <span className="input-label">Lý do hủy *</span>
            <textarea
              rows={3}
              className="input-field"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Vui lòng cho biết lý do hủy..."
              required
            />
          </label>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Giữ đơn</Button>
          <Button variant="danger" onClick={handleCancel} loading={cancelling}>Xác nhận hủy</Button>
        </div>
      </Modal>
    </div>
  );
}
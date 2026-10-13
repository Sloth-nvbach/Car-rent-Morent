import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { formatCurrency, formatDate, formatRelativeTime, getStatusConfig } from '../utils/helpers';
import { 
  User, Car, Calendar, CreditCard, Star, Settings, Bell, LogOut, Menu, X, ChevronRight,
  Edit, Shield, CheckCircle, Clock, Truck, Headphones, MessageCircle, Heart, FileText
} from 'lucide-react';
import { mockBookings, mockReviews, mockNotifications } from '../data/mockData';
import { Button } from '../ui/Button';
import { Badge, StatusBadge, Avatar, Tabs, TabPanel, Table, Pagination, Modal, Input } from '../ui/DataDisplay';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';

const TABS = [
  { id: 'bookings', label: 'Đơn đặt xe', icon: Calendar },
  { id: 'reviews', label: 'Đánh giá', icon: Star },
  { id: 'profile', label: 'Hồ sơ', icon: User },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

export function AccountPage() {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const { getUserBookings, cancelBooking } = useBooking();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [profileEditing, setProfileEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    phone: '',
    avatar: '',
  });
  
  useEffect(() => {
    if (isAuthenticated && user) {
      setBookings(getUserBookings(user.id));
      setReviews(mockReviews.filter(r => r.userId === user.id));
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
      });
    }
    setLoading(false);
  }, [user, isAuthenticated, getUserBookings]);
  
  const handleCancelBooking = async (bookingId) => {
    setCancellingBooking(bookingId);
    setCancelReason('');
    setShowCancelModal(true);
  };
  
  const confirmCancel = async () => {
    if (!cancellingBooking || !cancelReason.trim()) return;
    
    try {
      await cancelBooking(cancellingBooking, cancelReason);
      setBookings(prev => prev.filter(b => b.id !== cancellingBooking));
      setShowCancelModal(false);
    } catch (err) {
      alert(err.message);
    }
  };
  
  const handleProfileSave = async () => {
    try {
      await updateProfile(profileForm);
      setProfileEditing(false);
    } catch (err) {
      alert('Không thể cập nhật hồ sơ');
    }
  };
  
  const ITEMS_PER_PAGE = 5;
  const paginatedBookings = bookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(bookings.length / ITEMS_PER_PAGE);
  
  if (!isAuthenticated) {
    return (
      <div className="container py-16 text-center">
        <User className="w-16 h-16 text-tertiary mx-auto mb-4" />
        <h2 className="text-xl font-bold text-primary mb-2">Bạn chưa đăng nhập</h2>
        <p className="text-secondary mb-6">Đăng nhập để quản lý đơn đặt xe, hồ sơ và cài đặt</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate('/login')}>Đăng nhập</Button>
          <Button onClick={() => navigate('/register')}>Đăng ký</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-6 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar src={user.avatar} name={user.name} size="xl" />
                <div>
                  <h3 className="font-semibold text-primary">{user.name}</h3>
                  <p className="text-sm text-tertiary">{user.email}</p>
                  <Badge variant="primary" className="mt-1 capitalize">{user.role}</Badge>
                </div>
              </div>
              
              <nav className="space-y-1" aria-label="Menu tài khoản">
                {TABS.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      className={classNames(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition',
                        activeTab === tab.id 
                          ? 'bg-primary text-white' 
                          : 'text-secondary hover:bg-primary/10 hover:text-primary'
                      )}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              
              <div className="pt-4 border-t border-border">
                <Button variant="ghost" className="w-full justify-start text-error" onClick={logout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>
          </aside>
          
          <main className="flex-1 min-w-0">
            {activeTab === 'bookings' && (
              <BookingsTab 
                bookings={paginatedBookings}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                onCancel={handleCancelBooking}
              />
            )}
            
            {activeTab === 'reviews' && (
              <ReviewsTab reviews={reviews} />
            )}
            
            {activeTab === 'profile' && (
              <ProfileTab 
                user={user}
                editing={profileEditing}
                form={profileForm}
                onEdit={() => setProfileEditing(true)}
                onSave={handleProfileSave}
                onCancel={() => setProfileEditing(false)}
                onChange={setProfileForm}
              />
            )}
            
            {activeTab === 'settings' && (
              <SettingsTab user={user} />
            )}
          </main>
        </div>
      </div>
      
      <Modal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} title="Hủy đơn đặt xe" size="md">
        <p className="text-secondary mb-4">Bạn có chắc chắn muốn hủy đơn đặt xe này?</p>
        <Input
          label="Lý do hủy *"
          as="textarea"
          rows={3}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Vui lòng cho biết lý do hủy..."
          required
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>Giữ đơn</Button>
          <Button variant="danger" onClick={confirmCancel}>Xác nhận hủy</Button>
        </div>
      </Modal>
    </div>
  );
}

function BookingsTab({ bookings, currentPage, totalPages, onPageChange, onCancel }) {
  if (bookings.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Calendar className="w-16 h-16 text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary mb-2">Chưa có đơn đặt xe nào</h3>
        <p className="text-secondary mb-6">Bắt đầu tìm kiếm và đặt xe ngay hôm nay</p>
        <Button onClick={() => window.location.href = '/search'}>Tìm xe ngay</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary">Đơn đặt xe của bạn</h2>
        <Badge variant="primary">{bookings.length} đơn hàng</Badge>
      </div>
      
      <div className="space-y-4">
        {bookings.map(booking => {
          const car = mockCars.find(c => c.id === booking.carId);
          const statusConfig = getStatusConfig(booking.status);
          return (
            <div key={booking.id} className="card p-4 hover:shadow-md transition">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img src={car?.images[0]} alt={car?.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <h3 className="font-medium text-primary truncate">{car?.name}</h3>
                    <p className="text-sm text-secondary">{car?.brand} {car?.model} · {booking.totalDays} ngày</p>
                    <p className="text-sm text-tertiary">{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 md:ml-auto">
                  <div className="text-right">
                    <p className="font-bold text-primary">{formatCurrency(booking.total)}</p>
                    <p className="text-xs text-tertiary">Tổng cộng</p>
                  </div>
                  
                  <StatusBadge status={booking.status} className="whitespace-nowrap" />
                  
                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' || booking.status === 'confirmed' ? (
                      <Button variant="outline" size="sm" onClick={() => onCancel(booking.id)}>
                        Hủy đơn
                      </Button>
                    ) : booking.status === 'active' ? (
                      <Button variant="primary" size="sm" onClick={() => window.location.href = `/account/bookings/${booking.id}`}>
                        Xem chi tiết
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => window.location.href = `/account/bookings/${booking.id}`}>
                        Chi tiết
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-sm text-secondary">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Đặt: {formatRelativeTime(booking.createdAt)}</span>
                  <span className="flex items-center gap-1"><CreditCard className="w-4 h-4" /> {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => window.location.href = `/account/bookings/${booking.id}`}>
                  Xem tiến trình <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="mt-8 justify-center"
        />
      )}
    </div>
  );
}

function ReviewsTab({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="card p-12 text-center">
        <Star className="w-16 h-16 text-tertiary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary mb-2">Chưa có đánh giá nào</h3>
        <p className="text-secondary mb-6">Đánh giá xe sau khi hoàn tất chuyến đi</p>
        <Button onClick={() => window.location.href = '/account/bookings?filter=completed'}>Xem đơn đã hoàn tất</Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-primary">Đánh giá của bạn</h2>
      <div className="space-y-4">
        {reviews.map(review => {
          const car = mockCars.find(c => c.id === review.carId);
          return (
            <div key={review.id} className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <img src={car?.images[0]} alt={car?.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium text-primary">{car?.name}</h3>
                  <p className="text-sm text-secondary">{car?.brand} {car?.model}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Rating value={review.rating} size="sm" showValue />
                    <span className="text-sm text-tertiary">{formatRelativeTime(review.createdAt)}</span>
                  </div>
                </div>
              </div>
              <p className="text-secondary mb-4">{review.comment}</p>
              {review.providerReply && (
                <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">Phản hồi từ nhà cung cấp:</p>
                  <p className="text-sm text-secondary">{review.providerReply.content}</p>
                  <p className="text-xs text-tertiary mt-1">{formatRelativeTime(review.providerReply.createdAt)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProfileTab({ user, editing, form, onEdit, onSave, onCancel, onChange }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-primary">Hồ sơ cá nhân</h2>
        {editing ? (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onCancel}>Hủy</Button>
            <Button onClick={onSave}>Lưu thay đổi</Button>
          </div>
        ) : (
          <Button variant="outline" onClick={onEdit}>
            <Edit className="w-4 h-4 mr-1" />
            Chỉnh sửa
          </Button>
        )}
      </div>
      
      <div className="grid grid-2 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-6">
            <Avatar src={form.avatar} name={form.name} size="xl" />
            <div>
              <h3 className="font-semibold text-primary">{form.name || user.name}</h3>
              <p className="text-secondary">{user.email}</p>
              <p className="text-tertiary text-sm">Thành viên kể từ {formatDate(user.createdAt)}</p>
            </div>
          </div>
        </div>
        
        {editing ? (
          <>
            <Input
              label="Họ tên *"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
            <Input
              label="Số điện thoại"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={onChange}
              placeholder="09xxxxxxxx"
            />
            <Input
              label="Ảnh đại diện (URL)"
              name="avatar"
              value={form.avatar}
              onChange={onChange}
              placeholder="https://..."
            />
          </>
        ) : (
          <>
            <div>
              <p className="text-tertiary text-sm mb-1">Họ tên</p>
              <p className="text-primary">{form.name || user.name}</p>
            </div>
            <div>
              <p className="text-tertiary text-sm mb-1">Số điện thoại</p>
              <p className="text-primary">{form.phone || user.phone || 'Chưa cập nhật'}</p>
            </div>
            <div>
              <p className="text-tertiary text-sm mb-1">Email</p>
              <p className="text-primary">{user.email}</p>
            </div>
            <div>
              <p className="text-tertiary text-sm mb-1">Vai trò</p>
              <Badge variant="primary" className="capitalize">{user.role}</Badge>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-8 pt-8 border-t border-border">
        <h3 className="font-semibold text-primary mb-4">Bảo mật</h3>
        <div className="grid grid-2 gap-4">
          <Button variant="outline" className="justify-start">
            <Shield className="w-4 h-4 mr-2" />
            Đổi mật khẩu
          </Button>
          <Button variant="outline" className="justify-start">
            <CheckCircle className="w-4 h-4 mr-2" />
            Xác thực 2 yếu tố
          </Button>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ user }) {
  return (
    <div className="card p-6 space-y-8">
      <h2 className="text-xl font-bold text-primary">Cài đặt</h2>
      
      <div className="space-y-4">
        <h3 className="font-medium text-primary">Thông báo</h3>
        <div className="space-y-3">
          <SettingRow 
            icon={Bell} 
            title="Thông báo email" 
            desc="Nhận thông báo đặt xe, thanh toán, khuyến mãi qua email"
            checked={true}
          />
          <SettingRow 
            icon={MessageCircle} 
            title="Thông báo đẩy" 
            desc="Nhận thông báo real-time trên trình duyệt/ứng dụng"
            checked={true}
          />
          <SettingRow 
            icon={Heart} 
            title="Khuyến mãi" 
            desc="Nhận thông tin ưu đãi, mã giảm giá định kỳ"
            checked={false}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium text-primary">Quyền riêng tư</h3>
        <div className="space-y-3">
          <SettingRow 
            icon={Shield} 
            title="Hồ sơ công khai" 
            desc="Cho phép người khác xem hồ sơ và đánh giá của bạn"
            checked={true}
          />
          <SettingRow 
            icon={FileText} 
            title="Lịch sử hoạt động" 
            desc="Lưu lịch sử tìm kiếm, xem xe để cá nhân hóa trải nghiệm"
            checked={true}
          />
        </div>
      </div>
      
      <div className="pt-4 border-t border-border">
        <h3 className="font-medium text-primary mb-4">Khu vực nguy hiểm</h3>
        <Button variant="danger" className="w-full sm:w-auto">
          <Trash className="w-4 h-4 mr-2" />
          Xóa tài khoản
        </Button>
      </div>
    </div>
  );
}

function SettingRow({ icon: Icon, title, desc, checked }) {
  const [value, setValue] = useState(checked);
  
  return (
    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-primary">{title}</p>
          <p className="text-sm text-secondary">{desc}</p>
        </div>
      </div>
      <button
        className={classNames('relative w-11 h-6 rounded-full transition', value ? 'bg-primary' : 'bg-border')}
        onClick={() => setValue(!value)}
        role="switch"
        aria-checked={value}
      >
        <span className={classNames('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition', value ? 'right-0.5' : 'left-0.5')} />
      </button>
    </div>
  );
}

function Trash({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}
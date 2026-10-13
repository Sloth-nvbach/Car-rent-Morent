import React, { useState, useEffect, useMemo } from 'react';
import { classNames } from '../utils/helpers';
import { formatCurrency, formatDate, formatRelativeTime, getStatusConfig } from '../utils/helpers';
import { 
  LayoutDashboard, Car, Calendar, Users, CreditCard, Star, Headphones, BarChart, Settings,
  Plus, Edit, Trash2, Eye, Filter, ChevronDown, ChevronUp, Download, Clock, MapPin, DollarSign,
  TrendingUp, TrendingDown, Minus, CheckCircle, XCircle, AlertTriangle, MessageCircle
} from 'lucide-react';
import { mockCars, mockBookings, mockReviews, mockProviders } from '../data/mockData';
import { Button } from '../ui/Button';
import { Badge, StatusBadge, Avatar, Table, Pagination, Modal, Input, Select, Tabs, TabPanel } from '../ui/DataDisplay';
import { Card } from '../ui/Card';

const PROVIDER_TABS = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'cars', label: 'Quản lý xe', icon: Car },
  { id: 'bookings', label: 'Đơn đặt xe', icon: Calendar },
  { id: 'customers', label: 'Khách hàng', icon: Users },
  { id: 'payments', label: 'Thanh toán', icon: CreditCard },
  { id: 'reviews', label: 'Đánh giá', icon: Star },
  { id: 'support', label: 'Hỗ trợ', icon: Headphones },
  { id: 'reports', label: 'Báo cáo', icon: BarChart },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

const mockProvider = mockProviders[0];

export function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCarModal, setShowCarModal] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [carForm, setCarForm] = useState(initialCarForm());
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({ status: '', search: '' });
  
  const providerBookings = useMemo(() => 
    mockBookings.filter(b => b.providerId === mockProvider.id), 
  []);
  
  const providerCars = useMemo(() => 
    mockCars.filter(c => c.providerId === mockProvider.id), 
  []);
  
  const providerReviews = useMemo(() => 
    mockReviews.filter(r => r.providerId === mockProvider.id), 
  []);
  
  useEffect(() => {
    setCars(providerCars);
    setBookings(providerBookings);
    setReviews(providerReviews);
  }, [providerCars, providerBookings, providerReviews]);
  
  const filteredCars = cars.filter(car => {
    if (filters.status && car.status !== filters.status) return false;
    if (filters.search && !car.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
  
  const ITEMS_PER_PAGE = 10;
  const paginatedCars = filteredCars.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  
  const stats = {
    totalCars: cars.length,
    availableCars: cars.filter(c => c.status === 'available').length,
    activeBookings: bookings.filter(b => ['confirmed', 'active'].includes(b.status)).length,
    monthlyRevenue: bookings
      .filter(b => b.status === 'completed' && new Date(b.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, b) => sum + b.total, 0),
    avgRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0,
    totalReviews: reviews.length,
  };
  
  const handleCarSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (editingCar) {
      setCars(prev => prev.map(c => c.id === editingCar.id ? { ...c, ...carForm, updatedAt: new Date().toISOString() } : c));
    } else {
      const newCar = { ...carForm, id: `car-${Date.now()}`, providerId: mockProvider.id, rating: 0, reviewCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setCars(prev => [newCar, ...prev]);
    }
    setShowCarModal(false);
    setEditingCar(null);
    setCarForm(initialCarForm());
    setLoading(false);
  };
  
  const handleEditCar = (car) => {
    setEditingCar(car);
    setCarForm({
      name: car.name,
      brand: car.brand,
      model: car.model,
      year: car.year,
      type: car.type,
      transmission: car.transmission,
      fuel: car.fuel,
      seats: car.seats,
      doors: car.doors,
      pricePerDay: car.pricePerDay,
      pricePerWeek: car.pricePerWeek,
      pricePerMonth: car.pricePerMonth,
      location: car.location,
      address: car.address,
      features: car.features,
      policies: car.policies,
      description: car.description,
      specs: car.specs,
      status: car.status,
    });
    setShowCarModal(true);
  };
  
  const handleDeleteCar = (carId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa xe này?')) {
      setCars(prev => prev.filter(c => c.id !== carId));
    }
  };
  
  const handleBookingAction = async (bookingId, action) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    let newStatus = booking.status;
    let note = '';
    
    switch (action) {
      case 'confirm': newStatus = 'confirmed'; note = 'Nhà cung cấp xác nhận'; break;
      case 'reject': newStatus = 'rejected'; note = 'Nhà cung cấp từ chối'; break;
      case 'start': newStatus = 'active'; note = 'Khách nhận xe'; break;
      case 'complete': newStatus = 'completed'; note = 'Khách trả xe, hoàn tất'; break;
    }
    
    setBookings(prev => prev.map(b => 
      b.id === bookingId 
        ? { ...b, status: newStatus, timeline: [...b.timeline, { status: newStatus, timestamp: new Date().toISOString(), note }] }
        : b
    ));
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-4 space-y-1">
              {PROVIDER_TABS.map(tab => {
                const Icon = tab.icon;
                const count = tab.id === 'bookings' ? providerBookings.filter(b => b.status === 'pending').length : 
                              tab.id === 'reviews' ? providerReviews.filter(r => !r.providerReply).length : 0;
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
                    {count > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            
            <div className="mt-4 card p-4">
              <div className="flex items-center gap-3">
                <Avatar src={mockProvider.avatar} name={mockProvider.name} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-primary truncate">{mockProvider.name}</p>
                  <p className="text-xs text-tertiary truncate">{mockProvider.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-warning text-warning" />
                    <span className="text-xs text-secondary">{mockProvider.rating}</span>
                    <Badge variant="primary" className="text-xs">Đã xác minh</Badge>
                  </div>
                </div>
              </div>
            </div>
          </aside>
          
          <main className="flex-1 min-w-0">
            {activeTab === 'overview' && <OverviewTab stats={stats} bookings={providerBookings} cars={cars} />}
            {activeTab === 'cars' && <CarsTab 
              cars={paginatedCars}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              filters={filters}
              onFiltersChange={setFilters}
              onAdd={() => { setEditingCar(null); setCarForm(initialCarForm()); setShowCarModal(true); }}
              onEdit={handleEditCar}
              onDelete={handleDeleteCar}
              loading={loading}
            />}
            {activeTab === 'bookings' && <BookingsTab 
              bookings={providerBookings}
              onAction={handleBookingAction}
            />}
            {activeTab === 'reviews' && <ReviewsTab reviews={providerReviews} />}
            {activeTab === 'reports' && <ReportsTab stats={stats} />}
            {activeTab === 'settings' && <SettingsTab provider={mockProvider} />}
            {['customers', 'payments', 'support'].includes(activeTab) && (
              <ComingSoonTab title={PROVIDER_TABS.find(t => t.id === activeTab)?.label} />
            )}
          </main>
        </div>
      </div>
      
      <CarModal
        isOpen={showCarModal}
        onClose={() => { setShowCarModal(false); setEditingCar(null); setCarForm(initialCarForm()); }}
        title={editingCar ? 'Chỉnh sửa xe' : 'Thêm xe mới'}
        form={carForm}
        onChange={setCarForm}
        onSubmit={handleCarSubmit}
        loading={loading}
      />
    </div>
  );
}

function initialCarForm() {
  return {
    name: '', brand: '', model: '', year: new Date().getFullYear(),
    type: 'sedan', transmission: 'auto', fuel: 'gasoline',
    seats: 5, doors: 4,
    pricePerDay: 0, pricePerWeek: 0, pricePerMonth: 0,
    location: 'hn', address: '',
    features: [], policies: ['cancel_free', 'insurance', 'roadside'],
    description: '', specs: {},
    status: 'available',
  };
}

function OverviewTab({ stats, bookings, cars }) {
  const recentBookings = bookings.slice(0, 5);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Tổng quan</h2>
          <p className="text-secondary">Chào mừng trở lại, {mockProvider.name}!</p>
        </div>
        <Button onClick={() => setActiveTab('cars')}><Plus className="w-4 h-4 mr-2" />Thêm xe mới</Button>
      </div>
      
      <div className="grid grid-2 lg:grid-3 xl:grid-6 gap-4">
        <StatCard icon={Car} title="Tổng xe" value={stats.totalCars} color="primary" />
        <StatCard icon={CheckCircle} title="Sẵn có" value={stats.availableCars} color="success" />
        <StatCard icon={Calendar} title="Đơn đang xử lý" value={stats.activeBookings} color="warning" />
        <StatCard icon={DollarSign} title="Doanh thu tháng" value={formatCurrency(stats.monthlyRevenue)} color="info" />
        <StatCard icon={Star} title="Đánh giá TB" value={stats.avgRating} color="warning" />
        <StatCard icon={MessageCircle} title="Tổng đánh giá" value={stats.totalReviews} color="secondary" />
      </div>
      
      <div className="grid lg:grid-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-primary mb-4">Đơn đặt xe gần đây</h3>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map(booking => {
                const car = mockCars.find(c => c.id === booking.carId);
                return (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                    <div className="flex items-center gap-3">
                      <img src={car?.images[0]} alt={car?.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-primary truncate max-w-[200px]">{car?.name}</p>
                        <p className="text-sm text-tertiary">{formatRelativeTime(booking.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={booking.status} />
                      <span className="font-medium text-primary">{formatCurrency(booking.total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-secondary text-center py-8">Chưa có đơn đặt xe nào</p>
          )}
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-primary mb-4">Xe cần chú ý</h3>
          <div className="space-y-3">
            {cars.filter(c => c.status !== 'available').slice(0, 5).map(car => (
              <div key={car.id} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                <img src={car.images[0]} alt={car.name} className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary truncate">{car.name}</p>
                  <StatusBadge status={car.status} className="text-xs" />
                </div>
              </div>
            ))}
            {cars.every(c => c.status === 'available') && (
              <p className="text-secondary text-center py-8">Tất cả xe đang sẵn sàng cho thuê</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
    secondary: 'bg-secondary/10 text-secondary',
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-secondary">{title}</p>
          <p className="text-2xl font-bold text-primary mt-1">{value}</p>
        </div>
        <div className={classNames('w-12 h-12 rounded-xl flex items-center justify-center', colorClasses[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}

function CarsTab({ cars, totalPages, currentPage, onPageChange, filters, onFiltersChange, onAdd, onEdit, onDelete, loading }) {
  const carTypeOptions = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'mpv', label: 'MPV' },
    { value: 'luxury', label: 'Xe sang' },
    { value: 'electric', label: 'Xe điện' },
  ];
  
  const statusOptions = [
    { value: 'available', label: 'Sẵn có' },
    { value: 'unavailable', label: 'Không sẵn có' },
    { value: 'maintenance', label: 'Bảo trì' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Quản lý xe</h2>
        <Button onClick={onAdd}><Plus className="w-4 h-4 mr-2" />Thêm xe</Button>
      </div>
      
      <div className="card p-4">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Tìm kiếm theo tên, biển số..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="flex-1 min-w-[200px]"
            leftIcon="search"
          />
          <Select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            options={[{ value: '', label: 'Tất cả trạng thái' }, ...statusOptions]}
            className="w-[180px]"
          />
          <Select
            value={filters.type}
            onChange={(e) => onFiltersChange({ ...filters, type: e.target.value })}
            options={[{ value: '', label: 'Tất cả loại xe' }, ...carTypeOptions]}
            className="w-[180px]"
          />
        </div>
      </div>
      
      {cars.length > 0 ? (
        <>
          <Table
            columns={[
              { key: 'image', header: 'Xe', render: (_, car) => (
                <div className="flex items-center gap-3">
                  <img src={car.images[0]} alt={car.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-medium text-primary">{car.name}</p>
                    <p className="text-xs text-tertiary">{car.brand} {car.model} ({car.year})</p>
                  </div>
                </div>
              )},
              { key: 'type', header: 'Loại', render: (_, car) => (
                <Badge variant="gray">{carTypeOptions.find(t => t.value === car.type)?.label || car.type}</Badge>
              )},
              { key: 'transmission', header: 'Hộp số', render: (_, car) => car.transmission === 'auto' ? 'Tự động' : 'Số sàn' },
              { key: 'fuel', header: 'Nhiên liệu', render: (_, car) => car.fuel === 'electric' ? 'Điện' : car.fuel === 'hybrid' ? 'Hybrid' : car.fuel === 'diesel' ? 'Dầu' : 'Xăng' },
              { key: 'pricePerDay', header: 'Giá/ngày', render: (_, car) => formatCurrency(car.pricePerDay) },
              { key: 'status', header: 'Trạng thái', render: (_, car) => <StatusBadge status={car.status} /> },
              { key: 'actions', header: 'Thao tác', render: (_, car) => (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(car)}><Edit className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm" variant="danger" onClick={() => onDelete(car.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              )},
            ]}
            data={cars}
            keyField="id"
          />
          
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-6 justify-center" />
          )}
        </>
      ) : (
        <div className="card p-12 text-center">
          <Car className="w-16 h-16 text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">Chưa có xe nào</h3>
          <p className="text-secondary mb-6">Thêm xe đầu tiên để bắt đầu kinh doanh</p>
          <Button onClick={onAdd}><Plus className="w-4 h-4 mr-2" />Thêm xe ngay</Button>
        </div>
      )}
    </div>
  );
}

function BookingsTab({ bookings, onAction }) {
  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'active', label: 'Đang thuê' },
    { value: 'completed', label: 'Hoàn tất' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];
  
  const [filter, setFilter] = useState('');
  
  const filteredBookings = bookings.filter(b => !filter || b.status === filter);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Đơn đặt xe</h2>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          options={statusOptions}
          className="w-[200px]"
        />
      </div>
      
      <Table
        columns={[
          { key: 'id', header: 'Mã đơn', width: '120px' },
          { key: 'car', header: 'Xe', render: (_, booking) => {
            const car = mockCars.find(c => c.id === booking.carId);
            return car ? (
              <div className="flex items-center gap-2">
                <img src={car.images[0]} alt={car.name} className="w-10 h-10 rounded object-cover" />
                <span>{car.name}</span>
              </div>
            ) : '—';
          }},
          { key: 'customer', header: 'Khách hàng', render: (_, booking) => {
            const user = mockUsers.find(u => u.id === booking.userId);
            return user ? (
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-tertiary">{user.email}</p>
              </div>
            ) : '—';
          }},
          { key: 'dates', header: 'Thời gian', render: (_, booking) => (
            <div className="text-sm">
              <p>{formatDate(booking.startDate)} {booking.startTime}</p>
              <p className="text-tertiary">{formatDate(booking.endDate)} {booking.endTime}</p>
            </div>
          )},
          { key: 'total', header: 'Tổng tiền', render: (_, booking) => (
            <span className="font-medium text-primary">{formatCurrency(booking.total)}</span>
          )},
          { key: 'status', header: 'Trạng thái', render: (_, booking) => <StatusBadge status={booking.status} /> },
          { key: 'payment', header: 'Thanh toán', render: (_, booking) => (
            <Badge variant={booking.paymentStatus === 'paid' ? 'success' : 'warning'}>
              {booking.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chờ thanh toán'}
            </Badge>
          )},
          { key: 'actions', header: 'Thao tác', render: (_, booking) => (
            <div className="flex items-center gap-1">
              {booking.status === 'pending' && (
                <>
                  <Button variant="ghost" size="sm" onClick={() => onAction(booking.id, 'confirm')}><CheckCircle className="w-4 h-4 text-success" /></Button>
                  <Button variant="ghost" size="sm" onClick={() => onAction(booking.id, 'reject')}><XCircle className="w-4 h-4 text-error" /></Button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <Button variant="ghost" size="sm" onClick={() => onAction(booking.id, 'start')}>
                  <Truck className="w-4 h-4 text-primary" />
                </Button>
              )}
              {booking.status === 'active' && (
                <Button variant="ghost" size="sm" onClick={() => onAction(booking.id, 'complete')}>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => window.location.href = `/provider/bookings/${booking.id}`}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )},
        ]}
        data={filteredBookings}
        keyField="id"
      />
    </div>
  );
}

function ReviewsTab({ reviews }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Đánh giá khách hàng</h2>
      
      <div className="space-y-4">
        {reviews.map(review => {
          const car = mockCars.find(c => c.id === review.carId);
          const user = mockUsers.find(u => u.id === review.userId);
          return (
            <Card key={review.id} className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img src={car?.images[0]} alt={car?.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">{car?.name}</h3>
                    <span className="text-sm text-tertiary">{formatRelativeTime(review.createdAt)}</span>
                  </div>
                  <p className="text-sm text-secondary">{car?.brand} {car?.model}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Rating value={review.rating} size="sm" showValue />
                    <span className="text-sm text-tertiary">Khách: {user?.name}</span>
                  </div>
                </div>
              </div>
              <p className="text-secondary mb-4">{review.comment}</p>
              {review.providerReply ? (
                <div className="p-4 bg-primary/5 rounded-lg border-l-4 border-primary">
                  <p className="text-sm font-medium text-primary mb-1">Đã phản hồi:</p>
                  <p className="text-sm text-secondary">{review.providerReply.content}</p>
                  <p className="text-xs text-tertiary mt-1">{formatRelativeTime(review.providerReply.createdAt)}</p>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => alert('Mở modal phản hồi')}>
                  <MessageCircle className="w-4 h-4 mr-1" />
                  Phản hồi
                </Button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function ReportsTab({ stats }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Báo cáo hoạt động</h2>
      
      <div className="grid grid-2 lg:grid-4 gap-4">
        <StatCard icon={TrendingUp} title="Doanh thu tháng này" value={formatCurrency(stats.monthlyRevenue)} color="success" />
        <StatCard icon={Calendar} title="Số đơn hoàn tất" value={mockBookings.filter(b => b.providerId === mockProvider.id && b.status === 'completed').length} color="info" />
        <StatCard icon={Star} title="Đánh giá trung bình" value={stats.avgRating} color="warning" />
        <StatCard icon={Car} title="Xe đang hoạt động" value={stats.availableCars} color="primary" />
      </div>
      
      <Card className="p-6">
        <h3 className="font-semibold text-primary mb-4">Doanh thu theo tháng (giả lập)</h3>
        <div className="space-y-3">
          {['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'].map((month, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="w-24 text-sm text-secondary">{month}</span>
              <div className="flex-1 h-8 bg-bg-tertiary rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${30 + i * 10}%` }} />
              </div>
              <span className="w-24 text-right font-medium text-primary">{formatCurrency((30 + i * 10) * 1000000)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function SettingsTab({ provider }) {
  return (
    <div className="card p-6 space-y-8">
      <h2 className="text-2xl font-bold text-primary">Cài đặt nhà cung cấp</h2>
      
      <div className="space-y-6">
        <h3 className="font-semibold text-primary">Thông tin cơ bản</h3>
        <div className="grid grid-2 gap-4">
          <Input label="Tên công ty" value={provider.name} />
          <Input label="Email" type="email" value={provider.email} />
          <Input label="Số điện thoại" value={provider.phone} />
          <Input label="Địa chỉ" value={provider.address} />
          <Input label="Mô tả" as="textarea" rows={3} value={provider.description} />
        </div>
      </div>
      
      <div className="pt-6 border-t border-border">
        <h3 className="font-semibold text-primary mb-4">Tài khoản ngân hàng</h3>
        <div className="grid grid-2 gap-4">
          <Input label="Ngân hàng" placeholder="Ví dụ: Vietcombank" />
          <Input label="Số tài khoản" placeholder="1234567890" />
          <Input label="Chủ tài khoản" placeholder="CÔNG TY TNHH MORENT" />
          <Input label="Chi nhánh" placeholder="Chi nhánh TP.HCM" />
        </div>
      </div>
      
      <div className="pt-6 border-t border-border">
        <Button variant="primary">Lưu cài đặt</Button>
      </div>
    </div>
  );
}

function ComingSoonTab({ title }) {
  return (
    <div className="card p-12 text-center">
      <AlertTriangle className="w-16 h-16 text-tertiary mx-auto mb-4" />
      <h3 className="text-lg font-medium text-primary mb-2">{title}</h3>
      <p className="text-secondary">Tính năng này đang được phát triển. Sẽ sớm có mặt trong phiên bản tiếp theo.</p>
    </div>
  );
}

function CarModal({ isOpen, onClose, title, form, onChange, onSubmit, loading }) {
  const carTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'mpv', label: 'MPV' },
    { value: 'luxury', label: 'Xe sang' },
    { value: 'electric', label: 'Xe điện' },
  ];
  
  const locations = [
    { value: 'hn', label: 'Hà Nội' },
    { value: 'hcm', label: 'TP. Hồ Chí Minh' },
    { value: 'dn', label: 'Đà Nẵng' },
    { value: 'nt', label: 'Nha Trang' },
    { value: 'hp', label: 'Hải Phòng' },
    { value: 'ct', label: 'Cần Thơ' },
  ];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-2 gap-4">
          <Input label="Tên xe *" name="name" value={form.name} onChange={onChange} required />
          <Input label="Hãng xe *" name="brand" value={form.brand} onChange={onChange} required />
        </div>
        <div className="grid grid-3 gap-4">
          <Input label="Dòng xe *" name="model" value={form.model} onChange={onChange} required />
          <Input label="Năm *" type="number" name="year" value={form.year} onChange={onChange} min={2015} max={new Date().getFullYear()} required />
          <Select name="type" label="Loại xe *" value={form.type} onChange={onChange} options={carTypes} required />
        </div>
        <div className="grid grid-3 gap-4">
          <Select name="transmission" label="Hộp số *" value={form.transmission} onChange={onChange} options={[
            { value: 'auto', label: 'Tự động' },
            { value: 'manual', label: 'Số sàn' },
          ]} required />
          <Select name="fuel" label="Nhiên liệu *" value={form.fuel} onChange={onChange} options={[
            { value: 'gasoline', label: 'Xăng' },
            { value: 'diesel', label: 'Dầu' },
            { value: 'electric', label: 'Điện' },
            { value: 'hybrid', label: 'Hybrid' },
          ]} required />
          <Select name="status" label="Trạng thái *" value={form.status} onChange={onChange} options={[
            { value: 'available', label: 'Sẵn có' },
            { value: 'unavailable', label: 'Không sẵn có' },
            { value: 'maintenance', label: 'Bảo trì' },
          ]} required />
        </div>
        <div className="grid grid-3 gap-4">
          <Input label="Số chỗ *" type="number" name="seats" value={form.seats} onChange={onChange} min={2} max={12} required />
          <Input label="Số cửa *" type="number" name="doors" value={form.doors} onChange={onChange} min={2} max={5} required />
          <Select name="location" label="Địa điểm *" value={form.location} onChange={onChange} options={locations} required />
        </div>
        <Input label="Địa chỉ chi tiết *" name="address" value={form.address} onChange={onChange} required placeholder="Ví dụ: 789 Láng Hạ, Đống Đa, Hà Nội" />
        
        <div className="grid grid-3 gap-4">
          <Input label="Giá/ngày (VNĐ) *" type="number" name="pricePerDay" value={form.pricePerDay} onChange={onChange} step={10000} required />
          <Input label="Giá/tuần (VNĐ) *" type="number" name="pricePerWeek" value={form.pricePerWeek} onChange={onChange} step={10000} required />
          <Input label="Giá/tháng (VNĐ) *" type="number" name="pricePerMonth" value={form.pricePerMonth} onChange={onChange} step={10000} required />
        </div>
        
        <div>
          <label className="input-label">Tiện ích</label>
          <div className="flex flex-wrap gap-2">
            {carFeatures.map(f => (
              <label key={f.id} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.features.includes(f.id)}
                  onChange={(e) => onChange({ 
                    ...form, 
                    features: e.target.checked 
                      ? [...form.features, f.id] 
                      : form.features.filter(id => id !== f.id)
                  })}
                  className="w-4 h-4 rounded border-border text-primary"
                />
                <span className="text-sm">{f.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div>
          <label className="input-label">Chính sách</label>
          <div className="flex flex-wrap gap-2">
            {policies.map(p => (
              <label key={p.id} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.policies.includes(p.id)}
                  onChange={(e) => onChange({ 
                    ...form, 
                    policies: e.target.checked 
                      ? [...form.policies, p.id] 
                      : form.policies.filter(id => id !== p.id)
                  })}
                  className="w-4 h-4 rounded border-border text-primary"
                />
                <span className="text-sm">{p.name}</span>
              </label>
            ))}
          </div>
        </div>
        
        <Input label="Mô tả xe" as="textarea" rows={4} name="description" value={form.description} onChange={onChange} placeholder="Mô tả chi tiết về xe, điều kiện sử dụng..." />
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit" loading={loading}>{loading ? 'Đang lưu...' : 'Lưu xe'}</Button>
        </div>
      </form>
    </Modal>
  );
}
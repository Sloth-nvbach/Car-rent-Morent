import React, { useState, useMemo } from 'react';
import { classNames } from '../utils/helpers';
import { formatCurrency, formatDate, formatRelativeTime, getStatusConfig } from '../utils/helpers';
import { 
  LayoutDashboard, Users, Building, Car, Calendar, CreditCard, Headphones, Star, Settings,
  Filter, ChevronDown, ChevronUp, Download, Clock, MapPin, DollarSign, TrendingUp,
  CheckCircle, XCircle, AlertTriangle, MessageCircle, Eye, Edit, Trash2, Shield, Search
} from 'lucide-react';
import { mockUsers, mockProviders, mockCars, mockBookings, mockReviews, mockSupportTickets } from '../data/mockData';
import { Button } from '../ui/Button';
import { Badge, StatusBadge, Avatar, Table, Pagination, Modal, Input, Select, Tabs, TabPanel } from '../ui/DataDisplay';
import { Card } from '../ui/Card';

const ADMIN_TABS = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'users', label: 'Người dùng', icon: Users },
  { id: 'providers', label: 'Nhà cung cấp', icon: Building },
  { id: 'cars', label: 'Quản lý xe', icon: Car },
  { id: 'bookings', label: 'Đơn đặt xe', icon: Calendar },
  { id: 'payments', label: 'Thanh toán', icon: CreditCard },
  { id: 'support', label: 'Hỗ trợ', icon: Headphones },
  { id: 'reviews', label: 'Đánh giá', icon: Star },
  { id: 'settings', label: 'Cài đặt', icon: Settings },
];

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState({ status: '', search: '', role: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', phone: '', role: 'customer' });
  
  const ITEMS_PER_PAGE = 10;
  
  const stats = {
    totalUsers: mockUsers.length,
    totalProviders: mockProviders.length,
    totalCars: mockCars.length,
    activeBookings: mockBookings.filter(b => ['confirmed', 'active'].includes(b.status)).length,
    monthlyRevenue: mockBookings
      .filter(b => b.status === 'completed' && new Date(b.createdAt).getMonth() === new Date().getMonth())
      .reduce((sum, b) => sum + b.total, 0),
    pendingSupport: mockSupportTickets.filter(t => t.status !== 'resolved').length,
    avgRating: mockReviews.length > 0 ? (mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length).toFixed(1) : 0,
  };
  
  const filteredUsers = mockUsers.filter(user => {
    if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) && !user.email.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.role && user.role !== filters.role) return false;
    return true;
  });
  
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  
  const filteredBookings = mockBookings.filter(b => {
    if (filters.status && b.status !== filters.status) return false;
    if (filters.search && !b.id.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });
  
  const paginatedBookings = filteredBookings.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const bookingTotalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  
  const handleUserAction = (userId, action) => {
    if (action === 'delete') {
      if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
        // In real app: delete user
      }
    } else if (action === 'edit') {
      const user = mockUsers.find(u => u.id === userId);
      if (user) {
        setEditingUser(user);
        setUserForm({ name: user.name, email: user.email, phone: user.phone || '', role: user.role });
        setShowUserModal(true);
      }
    }
  };
  
  const handleProviderAction = (providerId, action) => {
    if (action === 'verify') {
      // In real app: verify provider
    } else if (action === 'suspend') {
      // In real app: suspend provider
    }
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="card p-4 space-y-1">
              {ADMIN_TABS.map(tab => {
                const Icon = tab.icon;
                const count = tab.id === 'support' ? mockSupportTickets.filter(t => t.status !== 'resolved').length :
                              tab.id === 'users' ? mockUsers.filter(u => u.role === 'customer').length :
                              tab.id === 'providers' ? mockProviders.filter(p => !p.verified).length : 0;
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
              <h3 className="font-semibold text-primary mb-3">Thao tác nhanh</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('users')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm người dùng
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('providers')}>
                  <Building className="w-4 h-4 mr-2" />
                  Thêm nhà cung cấp
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('cars')}>
                  <Car className="w-4 h-4 mr-2" />
                  Thêm xe
                </Button>
              </div>
            </div>
          </aside>
          
          <main className="flex-1 min-w-0">
            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'users' && <UsersTab 
              users={paginatedUsers}
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              filters={filters}
              onFiltersChange={setFilters}
              onAction={handleUserAction}
              showModal={showUserModal}
              onCloseModal={() => setShowUserModal(false)}
              editingUser={editingUser}
              userForm={userForm}
              setUserForm={setUserForm}
            />}
            {activeTab === 'providers' && <ProvidersTab providers={mockProviders} onAction={handleProviderAction} />}
            {activeTab === 'cars' && <AdminCarsTab cars={mockCars} />}
            {activeTab === 'bookings' && <AdminBookingsTab 
              bookings={paginatedBookings}
              totalPages={bookingTotalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
              filters={filters}
              onFiltersChange={setFilters}
            />}
            {activeTab === 'reviews' && <AdminReviewsTab reviews={mockReviews} />}
            {activeTab === 'support' && <SupportTab tickets={mockSupportTickets} />}
            {['payments', 'settings'].includes(activeTab) && (
              <ComingSoonTab title={ADMIN_TABS.find(t => t.id === activeTab)?.label} />
            )}
          </main>
        </div>
      </div>
      
      <UserModal
        isOpen={showUserModal}
        onClose={() => { setShowUserModal(false); setEditingUser(null); }}
        title={editingUser ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
        form={userForm}
        onChange={setUserForm}
        onSubmit={() => { setShowUserModal(false); setEditingUser(null); }}
      />
    </div>
  );
}

function OverviewTab({ stats }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Tổng quan hệ thống</h2>
      
      <div className="grid grid-2 lg:grid-4 xl:grid-7 gap-4">
        <StatCard icon={Users} title="Khách hàng" value={stats.totalUsers} color="primary" />
        <StatCard icon={Building} title="Nhà cung cấp" value={stats.totalProviders} color="info" />
        <StatCard icon={Car} title="Tổng xe" value={stats.totalCars} color="success" />
        <StatCard icon={Calendar} title="Đơn đang xử lý" value={stats.activeBookings} color="warning" />
        <StatCard icon={DollarSign} title="Doanh thu tháng" value={formatCurrency(stats.monthlyRevenue)} color="success" />
        <StatCard icon={Headphones} title="Hỗ trợ chờ" value={stats.pendingSupport} color="error" />
        <StatCard icon={Star} title="Đánh giá TB" value={stats.avgRating} color="warning" />
      </div>
      
      <div className="grid lg:grid-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold text-primary mb-4">Đơn đặt xe gần đây</h3>
          <div className="space-y-3">
            {mockBookings.slice(0, 5).map(booking => {
              const car = mockCars.find(c => c.id === booking.carId);
              const user = mockUsers.find(u => u.id === booking.userId);
              return (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <img src={car?.images[0]} alt={car?.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <p className="font-medium text-primary truncate max-w-[200px]">{car?.name}</p>
                      <p className="text-xs text-tertiary">{user?.name} · {formatRelativeTime(booking.createdAt)}</p>
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
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold text-primary mb-4">Nhà cung cấp mới</h3>
          <div className="space-y-3">
            {mockProviders.slice(0, 5).map(provider => (
              <div key={provider.id} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                <Avatar src={provider.avatar} name={provider.name} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-primary truncate">{provider.name}</p>
                  <p className="text-xs text-tertiary">{provider.city?.toUpperCase()} · {provider.carCount} xe</p>
                </div>
                <Badge variant={provider.verified ? 'success' : 'warning'}>
                  {provider.verified ? 'Đã xác minh' : 'Chờ xác minh'}
                </Badge>
              </div>
            ))}
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
    error: 'bg-error/10 text-error',
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

function UsersTab({ users, totalPages, currentPage, onPageChange, filters, onFiltersChange, onAction, showModal, onCloseModal, editingUser, userForm, setUserForm }) {
  const roleOptions = [
    { value: 'customer', label: 'Khách hàng' },
    { value: 'provider', label: 'Nhà cung cấp' },
    { value: 'admin', label: 'Quản trị viên' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Quản lý người dùng</h2>
        <Button onClick={() => { setUserForm({ name: '', email: '', phone: '', role: 'customer' }); setShowUserModal(true); }}>
          <Plus className="w-4 h-4 mr-2" />Thêm người dùng
        </Button>
      </div>
      
      <div className="card p-4">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Tìm kiếm tên, email..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="flex-1 min-w-[200px]"
            leftIcon="search"
          />
          <Select
            value={filters.role}
            onChange={(e) => onFiltersChange({ ...filters, role: e.target.value })}
            options={[{ value: '', label: 'Tất cả vai trò' }, ...roleOptions]}
            className="w-[180px]"
          />
        </div>
      </div>
      
      {users.length > 0 ? (
        <>
          <Table
            columns={[
              { key: 'avatar', header: '', width: '50px', render: (_, user) => <Avatar src={user.avatar} name={user.name} size="sm" /> },
              { key: 'name', header: 'Tên', render: (_, user) => (
                <div>
                  <p className="font-medium text-primary">{user.name}</p>
                  <p className="text-xs text-tertiary">{user.email}</p>
                </div>
              )},
              { key: 'phone', header: 'SĐT', render: (_, user) => user.phone || '—' },
              { key: 'role', header: 'Vai trò', render: (_, user) => <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'provider' ? 'info' : 'gray'} className="capitalize">{user.role}</Badge> },
              { key: 'verified', header: 'Xác thực', render: (_, user) => user.verified ? (
                <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Đã xác thực</Badge>
              ) : (
                <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" />Chưa xác thực</Badge>
              )},
              { key: 'createdAt', header: 'Tham gia', render: (_, user) => formatDate(user.createdAt) },
              { key: 'actions', header: 'Thao tác', render: (_, user) => (
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onAction(user.id, 'edit')}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" variant="danger" onClick={() => onAction(user.id, 'delete')}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )},
            ]}
            data={users}
            keyField="id"
          />
          
          {totalPages > 1 && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-6 justify-center" />
          )}
        </>
      ) : (
        <div className="card p-12 text-center">
          <Users className="w-16 h-16 text-tertiary mx-auto mb-4" />
          <h3 className="text-lg font-medium text-primary mb-2">Không tìm thấy người dùng</h3>
        </div>
      )}
    </div>
  );
}

function ProvidersTab({ providers, onAction }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Quản lý nhà cung cấp</h2>
      
      <Table
        columns={[
          { key: 'avatar', header: '', width: '50px', render: (_, p) => <Avatar src={p.avatar} name={p.name} size="sm" /> },
          { key: 'name', header: 'Tên/Nhà cung cấp', render: (_, p) => (
            <div>
              <p className="font-medium text-primary">{p.name}</p>
              <p className="text-xs text-tertiary">{p.email}</p>
            </div>
          )},
          { key: 'city', header: 'Địa điểm', render: (_, p) => {
            const city = cities.find(c => c.id === p.city);
            return city ? city.name : p.city;
          }},
          { key: 'cars', header: 'Số xe', render: (_, p) => p.carCount },
          { key: 'rating', header: 'Đánh giá', render: (_, p) => (
            <div className="flex items-center gap-1">
              <Rating value={p.rating} size="sm" showValue />
            </div>
          )},
          { key: 'verified', header: 'Trạng thái', render: (_, p) => p.verified ? (
            <Badge variant="success"><Shield className="w-3 h-3 mr-1" />Đã xác minh</Badge>
          ) : (
            <Badge variant="warning"><AlertTriangle className="w-3 h-3 mr-1" />Chờ xác minh</Badge>
          )},
          { key: 'joined', header: 'Tham gia', render: (_, p) => formatDate(p.joinedAt) },
          { key: 'actions', header: 'Thao tác', render: (_, p) => (
            <div className="flex items-center gap-1">
              {!p.verified && (
                <Button variant="ghost" size="sm" onClick={() => onAction(p.id, 'verify')}>
                  <Shield className="w-4 h-4" /> Xác minh
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => onAction(p.id, 'suspend')}>
                <AlertTriangle className="w-4 h-4" /> Tạm khóa
              </Button>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/providers/${p.id}`}>
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          )},
        ]}
        data={providers}
        keyField="id"
      />
    </div>
  );
}

function AdminCarsTab({ cars }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Quản lý xe (Admin)</h2>
      
      <Table
        columns={[
          { key: 'image', header: 'Xe', width: '100px', render: (_, car) => (
            <img src={car.images[0]} alt={car.name} className="w-20 h-14 rounded object-cover" />
          )},
          { key: 'name', header: 'Xe', render: (_, car) => (
            <div>
              <p className="font-medium text-primary">{car.name}</p>
              <p className="text-xs text-tertiary">{car.brand} {car.model} ({car.year})</p>
            </div>
          )},
          { key: 'provider', header: 'Nhà cung cấp', render: (_, car) => {
            const provider = mockProviders.find(p => p.id === car.providerId);
            return provider ? provider.name : '—';
          }},
          { key: 'type', header: 'Loại', render: (_, car) => <Badge variant="gray">{car.type}</Badge> },
          { key: 'pricePerDay', header: 'Giá/ngày', render: (_, car) => formatCurrency(car.pricePerDay) },
          { key: 'status', header: 'Trạng thái', render: (_, car) => <StatusBadge status={car.status} /> },
          { key: 'verified', header: 'Xác minh', render: (_, car) => car.verified ? (
            <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Đã xác minh</Badge>
          ) : (
            <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Chờ duyệt</Badge>
          )},
        ]}
        data={cars}
        keyField="id"
      />
    </div>
  );
}

function AdminBookingsTab({ bookings, totalPages, currentPage, onPageChange, filters, onFiltersChange }) {
  const statusOptions = [
    { value: '', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xác nhận' },
    { value: 'confirmed', label: 'Đã xác nhận' },
    { value: 'active', label: 'Đang thuê' },
    { value: 'completed', label: 'Hoàn tất' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">Tất cả đơn đặt xe</h2>
        <div className="flex gap-2">
          <Select
            value={filters.status}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
            options={statusOptions}
            className="w-[180px]"
          />
          <Input
            placeholder="Mã đơn, tên xe..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="w-[200px]"
            leftIcon="search"
          />
        </div>
      </div>
      
      <Table
        columns={[
          { key: 'id', header: 'Mã đơn', width: '130px' },
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
          { key: 'provider', header: 'Nhà cung cấp', render: (_, booking) => {
            const provider = mockProviders.find(p => p.id === booking.providerId);
            return provider ? provider.name : '—';
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
        ]}
        data={bookings}
        keyField="id"
      />
      
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} className="mt-6 justify-center" />
      )}
    </div>
  );
}

function AdminReviewsTab({ reviews }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Quản lý đánh giá</h2>
      
      <Table
        columns={[
          { key: 'car', header: 'Xe', render: (_, review) => {
            const car = mockCars.find(c => c.id === review.carId);
            return car ? car.name : '—';
          }},
          { key: 'user', header: 'Khách hàng', render: (_, review) => {
            const user = mockUsers.find(u => u.id === review.userId);
            return user ? user.name : '—';
          }},
          { key: 'provider', header: 'Nhà cung cấp', render: (_, review) => {
            const provider = mockProviders.find(p => p.id === review.providerId);
            return provider ? provider.name : '—';
          }},
          { key: 'rating', header: 'Đánh giá', render: (_, review) => <Rating value={review.rating} size="sm" showValue /> },
          { key: 'comment', header: 'Nội dung', render: (_, review) => (
            <p className="max-w-xs truncate">{review.comment}</p>
          )},
          { key: 'reply', header: 'Phản hồi', render: (_, review) => review.providerReply ? (
            <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Đã phản hồi</Badge>
          ) : (
            <Badge variant="warning"><MessageCircle className="w-3 h-3 mr-1" />Chưa phản hồi</Badge>
          )},
          { key: 'date', header: 'Ngày', render: (_, review) => formatDate(review.createdAt) },
        ]}
        data={reviews}
        keyField="id"
      />
    </div>
  );
}

function SupportTab({ tickets }) {
  const priorityColors = { high: 'error', medium: 'warning', low: 'info' };
  const statusColors = { open: 'info', in_progress: 'warning', resolved: 'success', closed: 'gray' };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-primary">Hỗ trợ khách hàng</h2>
      
      <Table
        columns={[
          { key: 'id', header: 'Mã ticket', width: '120px' },
          { key: 'subject', header: 'Chủ đề', render: (_, ticket) => (
            <div>
              <p className="font-medium text-primary">{ticket.subject}</p>
              <p className="text-xs text-tertiary">Khách: {mockUsers.find(u => u.id === ticket.userId)?.name}</p>
            </div>
          )},
          { key: 'category', header: 'Danh mục', render: (_, ticket) => (
            <Badge variant="gray">{ticket.category.replace('_', ' ')}</Badge>
          )},
          { key: 'priority', header: 'Ưu tiên', render: (_, ticket) => (
            <Badge variant={priorityColors[ticket.priority] || 'gray'} className="capitalize">{ticket.priority}</Badge>
          )},
          { key: 'status', header: 'Trạng thái', render: (_, ticket) => (
            <Badge variant={statusColors[ticket.status] || 'gray'} className="capitalize">{ticket.status.replace('_', ' ')}</Badge>
          )},
          { key: 'createdAt', header: 'Ngày tạo', render: (_, ticket) => formatDate(ticket.createdAt) },
          { key: 'actions', header: 'Thao tác', render: (_, ticket) => (
            <Button variant="ghost" size="sm" onClick={() => window.location.href = `/admin/support/${ticket.id}`}>
              <Eye className="w-4 h-4" /> Xem
            </Button>
          )},
        ]}
        data={tickets}
        keyField="id"
      />
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

function UserModal({ isOpen, onClose, title, form, onChange, onSubmit }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-2 gap-4">
          <Input label="Họ tên *" name="name" value={form.name} onChange={onChange} required />
          <Input label="Email *" type="email" name="email" value={form.email} onChange={onChange} required />
        </div>
        <Input label="Số điện thoại" type="tel" name="phone" value={form.phone} onChange={onChange} />
        <Select
          label="Vai trò *"
          name="role"
          value={form.role}
          onChange={onChange}
          options={[
            { value: 'customer', label: 'Khách hàng' },
            { value: 'provider', label: 'Nhà cung cấp' },
            { value: 'admin', label: 'Quản trị viên' },
          ]}
          required
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-border">
          <Button variant="secondary" type="button" onClick={onClose}>Hủy</Button>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </Modal>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Building, Car, Users, Shield, CheckCircle, MapPin, Clock, Phone, Mail, ArrowRight, Star, TrendingUp, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge, Card, Avatar, Rating } from '../ui/DataDisplay';

const mockProvider = {
  id: 'provider-001',
  name: 'Morent Auto Hà Nội',
  email: 'hanoi@morentauto.vn',
  phone: '024 3974 1234',
  address: '789 Láng Hạ, Đống Đa, Hà Nội',
  city: 'hn',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  rating: 4.8,
  reviewCount: 456,
  carCount: 25,
  joinedAt: '2023-01-15',
  verified: true,
  description: 'Đơn vị cho thuê xe uy tín hàng đầu tại Hà Nội, đội xe đa dạng từ tiết kiệm đến hạng sang. Cam kết xe mới, sạch đẹp, bảo dưỡng định kỳ, bảo hiểm toàn diện.',
  services: [
    'Cho thuê xe tự lái (Self-drive)',
    'Cho thuê xe có người lái',
    'Giao nhận xe tận nơi (Sân bay, khách sạn, nhà riêng)',
    'Thuê xe theo ngày, tuần, tháng',
    'Thuê xe dài hạn cho doanh nghiệp',
    'Xe dịch vụ cưới hỏi, sự kiện',
    'Tour du lịch có người lái',
    'Hỗ trợ 24/7, cứu hộ trên đường',
  ],
  certifications: [
    { name: 'ISO 9001:2015', desc: 'Hệ thống quản lý chất lượng' },
    { name: 'Bộ GTVT', desc: 'Giấy phép kinh doanh vận tải' },
    { name: 'PCI DSS', desc: 'Chuẩn bảo mật thanh toán' },
  ],
};

const mockCars = [
  { id: 'car-001', name: 'VinFast VF 8', brand: 'VinFast', model: 'VF 8', year: 2024, type: 'suv', pricePerDay: 1200000, images: ['https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'], seats: 5, transmission: 'auto', fuel: 'electric', rating: 4.9, reviewCount: 127, verified: true },
  { id: 'car-002', name: 'Toyota Camry 2024', brand: 'Toyota', model: 'Camry', year: 2024, type: 'sedan', pricePerDay: 850000, images: ['https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800'], seats: 5, transmission: 'auto', fuel: 'hybrid', rating: 4.8, reviewCount: 203, verified: true },
  { id: 'car-003', name: 'Kia Carnival 2024', brand: 'Kia', model: 'Carnival', year: 2024, type: 'mpv', pricePerDay: 950000, images: ['https://images.unsplash.com/photo-1606664515524-edb6257065b1?w=800'], seats: 7, transmission: 'auto', fuel: 'gasoline', rating: 4.7, reviewCount: 89, verified: true },
  { id: 'car-004', name: 'Mazda CX-5 2024', brand: 'Mazda', model: 'CX-5', year: 2024, type: 'suv', pricePerDay: 750000, images: ['https://images.unsplash.com/photo-1606664515524-edb6257065b1?w=800'], seats: 5, transmission: 'auto', fuel: 'gasoline', rating: 4.6, reviewCount: 156, verified: true },
  { id: 'car-005', name: 'Mercedes-Benz C200', brand: 'Mercedes-Benz', model: 'C200', year: 2023, type: 'luxury', pricePerDay: 1800000, images: ['https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800'], seats: 5, transmission: 'auto', fuel: 'gasoline', rating: 4.9, reviewCount: 67, verified: true },
  { id: 'car-006', name: 'Hyundai Accent 2024', brand: 'Hyundai', model: 'Accent', year: 2024, type: 'sedan', pricePerDay: 450000, images: ['https://images.unsplash.com/photo-1606664515524-edb6257065b1?w=800'], seats: 5, transmission: 'auto', fuel: 'gasoline', rating: 4.5, reviewCount: 234, verified: true },
];

const mockReviews = [
  { id: 'review-001', userId: 'user-001', carId: 'car-001', rating: 5, comment: 'Xe mới, sạch đẹp, nhân viên giao xe tận răng, hỗ trợ nhiệt tình. Quy trình nhanh gọn, app dễ dùng. Sẽ dùng lại lần sau!', createdAt: '2024-07-05T16:00:00Z', providerReply: { content: 'Cảm ơn anh/chị đã tin dùng dịch vụ. Rất vui vì anh/chị hài lòng!', createdAt: '2024-07-05T17:00:00Z' } },
  { id: 'review-002', userId: 'user-002', carId: 'car-002', rating: 5, comment: 'Camry Hybrid chạy êm, tiết kiệm xăng. Nội thất sang trọng. Nhân viên hỗ trợ tốt, giải đáp mọi thắc mắc.', createdAt: '2024-06-20T10:00:00Z', providerReply: null },
  { id: 'review-003', userId: 'user-001', carId: 'car-004', rating: 4, comment: 'Xe đẹp, nội thất sang. Chút tiếc là ghế hơi cứng khi đi đường xa. Tổng thể vẫn ổn.', createdAt: '2024-05-20T11:00:00Z', providerReply: { content: 'Cảm ơn phản hồi. Chúng tôi sẽ cải thiện trải nghiệm ghế ngồi.', createdAt: '2024-05-21T09:00:00Z' } },
];

const mockUsers = [
  { id: 'user-001', name: 'Nguyễn Văn An', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { id: 'user-002', name: 'Trần Thị Bình', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
];

export function ProviderDetailPage({ match }) {
  const { id } = match.params;
  const provider = mockProvider;
  
  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (date) => new Date(date).toLocaleDateString('vi-VN');
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <nav className="bg-surface border-b border-border" aria-label="Breadcrumb">
        <div className="container py-4">
          <ol className="flex items-center gap-2 text-sm text-tertiary">
            <li><Link to="/" className="hover:text-primary">Trang chủ</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li><Link to="/search" className="hover:text-primary">Tìm xe</Link></li>
            <li><ChevronRight className="w-4 h-4" /></li>
            <li className="text-primary truncate max-w-[200px]">{provider.name}</li>
          </ol>
        </div>
      </nav>
      
      <div className="container py-8">
        <div className="grid lg:grid-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-start gap-6">
                <Avatar src={provider.avatar} name={provider.name} size="xl" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-primary">{provider.name}</h1>
                    {provider.verified && <Badge variant="primary" className="gap-1"><Shield className="w-3 h-3" />Đã xác minh</Badge>}
                  </div>
                  <p className="text-secondary mb-2">{provider.description}</p>
                  <div className="flex flex-wrap items-center gap-4 mt-4">
                    <div className="flex items-center gap-1">
                      <Rating value={provider.rating} size="md" showValue />
                      <span className="text-sm text-tertiary">({provider.reviewCount} đánh giá)</span>
                    </div>
                    <span className="text-border">·</span>
                    <span className="text-sm text-tertiary flex items-center gap-1"><Car className="w-4 h-4" /> {provider.carCount} xe</span>
                    <span className="text-border">·</span>
                    <span className="text-sm text-tertiary flex items-center gap-1"><Award className="w-4 h-4" /> Từ {formatDate(provider.joinedAt).split('/')[2]}</span>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Dịch vụ cung cấp</h2>
              <div className="grid grid-2 gap-3">
                {provider.services.map((service, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm text-secondary">{service}</span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Chứng nhận & Giải thưởng</h2>
              <div className="space-y-3">
                {provider.certifications.map((cert, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-bg-secondary rounded-lg">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-primary">{cert.name}</p>
                      <p className="text-sm text-secondary">{cert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-bold text-primary mb-4">Đánh giá khách hàng ({mockReviews.length})</h2>
              <div className="space-y-4">
                {mockReviews.map(review => {
                  const car = mockCars.find(c => c.id === review.carId);
                  const user = mockUsers.find(u => u.id === review.userId);
                  return (
                    <div key={review.id} className="border-b border-border pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar src={user?.avatar} name={user?.name} size="md" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-primary">{user?.name}</p>
                            <p className="text-sm text-tertiary">{formatDate(review.createdAt)}</p>
                          </div>
                          <Rating value={review.rating} size="sm" className="mt-1" />
                        </div>
                      </div>
                      <p className="text-secondary ml-10">{review.comment}</p>
                      {review.providerReply && (
                        <div className="mt-3 ml-10 p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
                          <p className="text-sm font-medium text-primary mb-1">Phản hồi từ {provider.name}:</p>
                          <p className="text-sm text-secondary">{review.providerReply.content}</p>
                          <p className="text-xs text-tertiary mt-1">{formatDate(review.providerReply.createdAt)}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-primary mb-4">Thông tin liên hệ</h3>
              <div className="space-y-4">
                <a href={`tel:${provider.phone.replace(/\s/g, '')}`} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-tertiary">Hotline</p>
                    <p className="font-medium text-primary">{provider.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${provider.email}`} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg group">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-tertiary">Email</p>
                    <p className="font-medium text-primary truncate">{provider.email}</p>
                  </div>
                </a>
                <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-tertiary">Địa chỉ</p>
                    <p className="font-medium text-primary truncate">{provider.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-tertiary">Giờ làm việc</p>
                    <p className="font-medium text-primary">7:00 - 22:00 (kể cả T7, CN)</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Link to="/search" className="btn btn-primary w-full" style={{ '--provider-id': provider.id }}>
                  <Search className="w-5 h-5 mr-2" />
                  Xem xe của đối tác này
                </Link>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Xe phổ biến</h3>
              <div className="space-y-3">
                {mockCars.slice(0, 3).map(car => (
                  <Link key={car.id} to={`/cars/${car.id}`} className="flex items-center gap-3 p-3 bg-bg-secondary rounded-lg hover:bg-border/50 transition group">
                    <img src={car.images[0]} alt={car.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-primary truncate group-hover:text-primary/80">{car.name}</p>
                      <p className="text-xs text-tertiary">{car.brand} {car.model} · {car.seats} chỗ</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{formatCurrency(car.pricePerDay)}</p>
                      <p className="text-xs text-tertiary">/ ngày</p>
                    </div>
                  </Link>
                ))}
                <Link to="/search" className="btn btn-outline w-full text-sm justify-center">Xem tất cả {mockCars.length} xe</Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChevronRight({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
}

function Search({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
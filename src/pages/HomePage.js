import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { formatCurrency } from '../utils/helpers';
import { Car, MapPin, Calendar, Clock, Shield, CheckCircle, Truck, Headphones, Star, ArrowRight, Zap, Leaf, Award, Users, Car as CarIcon, MapPin as MapPinIcon, Clock as ClockIcon, Shield as ShieldIcon } from 'lucide-react';
import { mockCars, mockProviders, cities, carTypes, policies } from '../data/mockData';
import { CarCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/DataDisplay';

const featuredCars = mockCars.slice(0, 4);
const featuredProviders = mockProviders.slice(0, 3);

const trustFactors = [
  { icon: Shield, title: 'Xe đã xác minh', desc: '100% xe được kiểm định kỹ thuật, xác thực giấy tờ trước khi cho thuê' },
  { icon: CheckCircle, title: 'Bảo hiểm toàn diện', desc: 'Bảo hiểm tai nạn, hỏa hoạn, thiên tai, trách nhiệm dân sự' },
  { icon: Truck, title: 'Giao xe tận nơi', desc: 'Nhận/trả xe tại sân bay, khách sạn, văn phòng, nhà riêng' },
  { icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ hỗ trợ sẵn sàng giải quyết sự cố bất kỳ lúc nào' },
];

const steps = [
  { icon: Search, title: 'Tìm kiếm', desc: 'Chọn địa điểm, thời gian và loại xe phù hợp' },
  { icon: CarIcon, title: 'Chọn xe', desc: 'So sánh giá, xem chi tiết, đánh giá từ khách hàng trước' },
  { icon: Calendar, title: 'Đặt xe', desc: 'Điền thông tin, chọn thanh toán, xác nhận đơn hàng' },
  { icon: MapPinIcon, title: 'Nhận xe', desc: 'Gặp nhân viên, kiểm tra xe, ký biên bản giao nhận' },
  { icon: ShieldIcon, title: 'Đi an tâm', desc: 'Hỗ trợ đường dây 24/7, bảo hiểm toàn diện' },
  { icon: ClockIcon, title: 'Trả xe', desc: 'Kiểm tra xe, hoàn tất đơn, để lại đánh giá' },
];

const stats = [
  { value: '500+', label: 'Chiếc xe sẵn sàng' },
  { value: '50+', label: 'Đối tác uy tín' },
  { value: '10,000+', label: 'Khách hàng hài lòng' },
  { value: '98%', label: 'Tỷ lệ hài lòng' },
];

export function HomePage() {
  const [searchParams, setSearchParams] = useState({
    pickup: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '18:00',
  });
  
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  
  useEffect(() => {
    if (!searchParams.startDate) setSearchParams(s => ({ ...s, startDate: today }));
    if (!searchParams.endDate) setSearchParams(s => ({ ...s, endDate: tomorrow }));
  }, []);
  
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.pickup) params.set('pickup', searchParams.pickup);
    if (searchParams.startDate) params.set('startDate', searchParams.startDate);
    if (searchParams.startTime) params.set('startTime', searchParams.startTime);
    if (searchParams.endDate) params.set('endDate', searchParams.endDate);
    if (searchParams.endTime) params.set('endTime', searchParams.endTime);
    window.location.href = `/search?${params.toString()}`;
  };
  
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Mới: Thuê xe điện VinFast từ 650.000đ/ngày
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6 leading-tight">
              Cho thuê ô tô <span className="text-primary">dễ dàng, an tâm, tiết kiệm</span>
            </h1>
            <p className="text-lg text-secondary mb-8 max-w-2xl mx-auto">
              Nền tảng cho thuê xe hàng đầu Việt Nam với 500+ xe đa dạng, quy trình minh bạch, 
              thanh toán an toàn và hỗ trợ 24/7. Đặt xe trong 3 phút.
            </p>
            
            <form onSubmit={handleSearch} className="bg-surface border border-border rounded-xl p-4 shadow-lg space-y-4 md:space-y-0 md:flex md:items-end md:gap-4">
              <div className="md:flex-1">
                <label htmlFor="pickup" className="input-label">Địa điểm nhận xe <span className="text-error">*</span></label>
                <select
                  id="pickup"
                  className="input-field"
                  value={searchParams.pickup}
                  onChange={(e) => setSearchParams(s => ({ ...s, pickup: e.target.value }))}
                  required
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.id}>{city.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-2 gap-3 md:grid-cols-4">
                <div>
                  <label htmlFor="startDate" className="input-label">Ngày nhận <span className="text-error">*</span></label>
                  <input
                    type="date"
                    id="startDate"
                    className="input-field"
                    value={searchParams.startDate}
                    onChange={(e) => setSearchParams(s => ({ ...s, startDate: e.target.value }))}
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
                    value={searchParams.startTime}
                    onChange={(e) => setSearchParams(s => ({ ...s, startTime: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="input-label">Ngày trả <span className="text-error">*</span></label>
                  <input
                    type="date"
                    id="endDate"
                    className="input-field"
                    value={searchParams.endDate}
                    onChange={(e) => setSearchParams(s => ({ ...s, endDate: e.target.value }))}
                    min={searchParams.startDate || today}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="endTime" className="input-label">Giờ trả <span className="text-error">*</span></label>
                  <input
                    type="time"
                    id="endTime"
                    className="input-field"
                    value={searchParams.endTime}
                    onChange={(e) => setSearchParams(s => ({ ...s, endTime: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="btn btn-primary btn-lg w-full md:w-auto md:flex-shrink-0">
                <Search className="w-5 h-5 mr-2" />
                Tìm xe ngay
              </button>
            </form>
          </div>
          
          <div className="grid grid-4 gap-6 md:gap-8 mt-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-4">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-bg-secondary">
        <div className="container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-primary">Xe nổi bật</h2>
              <p className="text-secondary mt-1">Các xe được khách hàng yêu thích và đánh giá cao nhất</p>
            </div>
            <Link to="/search" className="btn btn-outline hidden sm:flex items-center gap-2">
              Xem tất cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-2 lg:grid-4 gap-6">
            {featuredCars.map(car => (
              <Link key={car.id} to={`/cars/${car.id}`} className="block">
                <CarCard car={car} />
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/search" className="btn btn-outline btn-lg">Xem tất cả xe</Link>
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">Tại sao chọn Morent?</h2>
            <p className="text-secondary mt-2 max-w-2xl mx-auto">
              Cam kết mang lại trải nghiệm thuê xe tốt nhất với quy trình minh bạch, 
              xe chất lượng và dịch vụ tận tâm.
            </p>
          </div>
          
          <div className="grid grid-2 lg:grid-4 gap-6">
            {trustFactors.map((factor, i) => (
              <div key={i} className="card p-6 h-full">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <factor.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{factor.title}</h3>
                <p className="text-secondary">{factor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">Quy trình thuê xe 6 bước</h2>
            <p className="text-secondary mt-2">Đơn giản, nhanh chóng, hoàn toàn trực tuyến</p>
          </div>
          
          <div className="grid grid-2 lg:grid-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-primary/30">{i + 1}</span>
                      <h3 className="text-lg font-semibold text-primary">{step.title}</h3>
                    </div>
                    <p className="text-secondary">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">Đối tác cung cấp xe uy tín</h2>
            <p className="text-secondary mt-2">Hợp tác với các đơn vị cho thuê xe lớn, đảm bảo chất lượng dịch vụ</p>
          </div>
          
          <div className="grid grid-2 lg:grid-3 gap-6">
            {featuredProviders.map(provider => (
              <Link key={provider.id} to={`/providers/${provider.id}`} className="card p-6 hover:shadow-lg transition group">
                <div className="flex items-start gap-4">
                  <Avatar src={provider.avatar} name={provider.name} size="lg" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-primary group-hover:text-primary/80 transition">{provider.name}</h3>
                    <p className="text-sm text-tertiary mt-1">{provider.address}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-1 text-sm text-secondary">
                        <Star className="w-4 h-4 fill-current text-warning" />
                        <span>{provider.rating}</span>
                        <span className="text-tertiary">({provider.reviewCount})</span>
                      </div>
                      <span className="badge badge-primary text-xs">Đã xác minh</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Sẵn sàng bắt đầu chuyến đi?</h2>
          <p className="text-primary-light mb-8 max-w-2xl mx-auto">
            Đặt xe ngay hôm nay và tận hưởng trải nghiệm thuê xe dễ dàng, an tâm nhất.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/search" className="btn btn-lg bg-white text-primary hover:bg-primary/5 px-8">
              Tìm xe ngay
            </Link>
            <Link to="/partner" className="btn btn-lg border-2 border-white text-white hover:bg-white/10 px-8">
              Trở thành đối tác
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
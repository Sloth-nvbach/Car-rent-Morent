import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Tag, Clock, Calendar, Users, Zap, Gift, Percent, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge, Card } from '../ui/DataDisplay';

const promotions = [
  {
    id: 'summer20',
    title: 'Mùa hè sôi động - Giảm 20%',
    desc: 'Thuê xe từ 7 ngày trở lên giảm 20% cho tất cả dòng xe. Áp dụng cho chuyến đi biển, du lịch nghỉ hè.',
    code: 'SUMMER20',
    validUntil: '2024-08-31',
    discount: '20%',
    minDays: 7,
    icon: '☀️',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 'welcome10',
    title: 'Chào mừng thành viên mới - Giảm 10%',
    desc: 'Đơn đặt xe đầu tiên giảm 10% (tối đa 500.000đ). Không giới hạn loại xe, thời gian thuê.',
    code: 'WELCOME10',
    validUntil: '2024-12-31',
    discount: '10%',
    maxDiscount: 500000,
    icon: '🎁',
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 'longterm',
    title: 'Thuê dài hạn - Giảm đến 30%',
    desc: 'Thuê từ 30 ngày giảm 20%, từ 90 ngày giảm 30%. Phù hợp doanh nghiệp, expat, du lịch dài ngày.',
    code: 'AUTO',
    validUntil: '2024-12-31',
    discount: '20-30%',
    minDays: 30,
    autoApply: true,
    icon: '📅',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 'weekend',
    title: 'Cuối tuần rủ bạn - Giảm 15%',
    desc: 'Đặt xe thứ 6, 7, CN giảm 15% cho xe Sedan, Hatchback. Tối đa 1.000.000đ/đơn.',
    code: 'WEEKEND15',
    validUntil: '2024-12-31',
    discount: '15%',
    maxDiscount: 1000000,
    daysOfWeek: [5, 6, 0],
    carTypes: ['sedan', 'hatchback'],
    icon: '🎉',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 'electric',
    title: 'Thử nghiệm xe điện - Giảm 25%',
    desc: 'Thuê xe điện VinFast VF e34, VF 8 giảm 25%. Tặng sạc miễn phí tại trạm VinFast.',
    code: 'EV25',
    validUntil: '2024-09-30',
    discount: '25%',
    carTypes: ['electric'],
    bonus: 'Sạc miễn phí',
    icon: '⚡',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    id: 'referral',
    title: 'Giới thiệu bạn bè - Nhận 200K',
    desc: 'Mời bạn bè đăng ký, bạn nhận 200.000đ, bạn bè giảm 50.000đ đơn đầu. Không giới hạn số lượng mời.',
    code: 'REFERRAL',
    validUntil: '2024-12-31',
    reward: '200.000đ/người',
    friendDiscount: '50.000đ',
    icon: '🤝',
    color: 'from-indigo-500 to-purple-500',
  },
];

const loyaltyTiers = [
  { name: 'Đồng', icon: '🥉', color: 'from-amber-600 to-orange-600', benefits: ['Tích 1đ/1.000đ chi tiêu', 'Giảm 5% đơn sinh nhật', 'Hỗ trợ tiêu chuẩn'] },
  { name: 'Bạc', icon: '🥈', color: 'from-gray-400 to-gray-500', condition: '5 chuyến hoặc 5 triệu', benefits: ['Tích 1.2đ/1.000đ', 'Giảm 10% đơn sinh nhật', 'Ưu tiên hỗ trợ', 'Miễn phí giao xe < 10km'] },
  { name: 'Vàng', icon: '🥇', color: 'from-yellow-400 to-amber-500', condition: '15 chuyến hoặc 15 triệu', benefits: ['Tích 1.5đ/1.000đ', 'Giảm 15% đơn sinh nhật', 'Hỗ trợ VIP 24/7', 'Miễn phí giao xe < 30km', 'Xe dự phòng miễn phí'] },
  { name: 'Kim cương', icon: '💎', color: 'from-blue-400 to-cyan-400', condition: '30 chuyến hoặc 30 triệu', benefits: ['Tích 2đ/1.000đ', 'Giảm 20% đơn sinh nhật', 'Quản lý tài khoản riêng', 'Miễn phí mọi giao xe', 'Xe hạng sang ưu tiên', 'Tặng voucher 500K/năm'] },
];

export function OffersPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container text-center">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <Tag className="w-3 h-3" /> Ưu đãi & Khuyến mãi
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Ưu đãi hấp dẫn từ Morent</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">Tiết kiệm tối đa cho mọi chuyến đi với các chương trình khuyến mãi độc quyền, cập nhật liên tục.</p>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 container">
        <h2 className="text-2xl lg:text-3xl font-bold text-primary mb-8">Mã khuyến mãi đang hoạt động</h2>
        
        <div className="grid grid-2 lg:grid-3 gap-6">
          {promotions.map(promo => (
            <Card key={promo.id} className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl transparent 50%, currentColor rounded-full opacity-10" style={{ color: promo.color.split(' ')[1] }} />
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{promo.icon}</span>
                  <Badge variant="warning">{promo.discount}</Badge>
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{promo.title}</h3>
                <p className="text-secondary mb-4">{promo.desc}</p>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center gap-2 text-tertiary">
                    <Code className="w-4 h-4" /> Mã: <code className="bg-bg-tertiary px-2 py-0.5 rounded font-mono text-primary">{promo.code}</code>
                  </div>
                  <div className="flex items-center gap-2 text-tertiary">
                    <Calendar className="w-4 h-4" /> HSD: {new Date(promo.validUntil).toLocaleDateString('vi-VN')}
                  </div>
                  {promo.minDays && (
                    <div className="flex items-center gap-2 text-tertiary">
                      <Calendar className="w-4 h-4" /> Tối thiểu: {promo.minDays} ngày
                    </div>
                  )}
                  {promo.maxDiscount && (
                    <div className="flex items-center gap-2 text-tertiary">
                      <Percent className="w-4 h-4" /> Giảm tối đa: {promo.maxDiscount.toLocaleString('vi-VN')}đ
                    </div>
                  )}
                  {promo.autoApply && (
                    <Badge variant="success" className="text-xs"><Zap className="w-3 h-3 mr-1" />Tự động áp dụng</Badge>
                  )}
                  {promo.bonus && (
                    <Badge variant="info" className="text-xs"><Gift className="w-3 h-3 mr-1" />{promo.bonus}</Badge>
                  )}
                </div>
                
                <Button variant={promo.autoApply ? 'outline' : 'primary'} className="w-full" onClick={() => window.location.href = `/search?promo=${promo.code}`}>
                  {promo.autoApply ? 'Xem xe áp dụng' : 'Áp dụng mã này'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">Chương trình thành viên Morent Club</h2>
            <p className="text-secondary mt-2">Được thưởng cho sự trung thành - Càng đi nhiều, càng hưởng lợi</p>
          </div>
          
          <div className="grid grid-2 lg:grid-4 gap-6">
            {loyaltyTiers.map((tier, i) => (
              <Card key={i} className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl transparent 50%, currentColor rounded-full opacity-10" style={{ color: tier.color.split(' ')[1] }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{tier.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-primary">{tier.name}</h3>
                      {tier.condition && <p className="text-sm text-tertiary">Điều kiện: {tier.condition}</p>}
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {tier.benefits.map((benefit, bi) => (
                      <li key={bi} className="flex items-start gap-2 text-sm text-secondary">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 container">
        <div className="max-w-3xl mx-auto">
          <div className="card p-8 text-center">
            <h2 className="text-2xl font-bold text-primary mb-4">Cách sử dụng mã khuyến mãi</h2>
            <div className="grid grid-2 md:grid-4 gap-6 mb-8 text-left">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">1</div>
                <div><p className="font-medium">Chọn xe & thời gian</p><p className="text-sm text-secondary">Tìm xe phù hợp, chọn ngày nhận/trả</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">2</div>
                <div><p className="font-medium">Vào trang đặt xe</p><p className="text-sm text-secondary">Điền thông tin, chọn thanh toán</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">3</div>
                <div><p className="font-medium">Nhập mã giảm giá</p><p className="text-sm text-secondary">Ở ô "Mã khuyến mãi", nhập mã</p></div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">4</div>
                <div><p className="font-medium">Xác nhận & thanh toán</p><p className="text-sm text-secondary">Giá đã trừ khuyến mãi, thanh toán</p></div>
              </div>
            </div>
            <div className="p-4 bg-bg-secondary rounded-lg text-sm text-secondary">
              <p className="font-medium mb-2">Lưu ý:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Mỗi đơn chỉ áp dụng 1 mã khuyến mãi</li>
                <li>Mã không áp dụng đồng thời với chương trình khác</li>
                <li>Một số mã chỉ dành cho khách hàng mới/xe đặc biệt</li>
                <li>Morent bảo lưu quyền thay đổi điều kiện mà không báo trước</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Đừng bỏ lỡ ưu đãi!</h2>
          <p className="text-primary-light mb-8 max-w-2xl mx-auto">Đăng ký nhận tin để cập nhật mã giảm giá mới nhất, ưu đãi độc quyền chỉ dành cho thành viên.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input type="email" placeholder="Email của bạn" className="input-field flex-1" />
            <Button size="lg">Đăng ký nhận tin</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Code({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
}

function CheckCircle({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}

function Percent({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>;
}

function Gift({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/></svg>;
}

function Zap({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
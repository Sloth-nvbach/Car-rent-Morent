import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Car, Users, Shield, Award, TrendingUp, Target, Heart, Leaf, Zap, Building, Clock, MapPin, Phone, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, Badge, Avatar, Rating } from '../ui/DataDisplay';

const stats = [
  { icon: Car, value: '500+', label: 'Xe sẵn sàng' },
  { icon: Users, value: '50,000+', label: 'Khách hàng' },
  { icon: Building, value: '50+', label: 'Đối tác' },
  { icon: Award, value: '98%', label: 'Hài lòng' },
];

const values = [
  { icon: Target, title: 'Khách hàng trung tâm', desc: 'Mọi quyết định đều xuất phát từ trải nghiệm khách hàng' },
  { icon: Shield, title: 'Minh bạch & Uy tín', desc: 'Giá công khai, hợp đồng rõ ràng, không phát sinh chi phí ẩn' },
  { icon: TrendingUp, title: 'Đổi mới không ngừng', desc: 'Công nghệ tiên tiến, quy trình số hóa, cải tiến liên tục' },
  { icon: Heart, title: 'Trách nhiệm xã hội', desc: 'Xe điện, giảm carbon, hỗ trợ cộng đồng, bền vững' },
];

const milestones = [
  { year: '2023', month: '01', title: 'Khởi động Morent', desc: 'Ra mắt phiên bản beta tại Hà Nội với 10 đối tác, 50 xe' },
  { year: '2023', month: '06', title: 'Mở rộng TP.HCM', desc: 'Triển khai tại TP.HCM, đạt 1000 đơn/tháng' },
  { year: '2023', month: '12', title: 'Ra mắt App Mobile', desc: 'Ứng dụng iOS/Android, tính năng theo dõi xe real-time' },
  { year: '2024', month: '03', title: 'Xe điện VinFast', desc: 'Đối tác chiến lược VinFast, đội xe điện 100+' },
  { year: '2024', month: '06', title: '50,000 khách hàng', desc: 'Mốc quan trọng, mở rộng ra Đà Nẵng, Nha Trang, Hải Phòng, Cần Thơ' },
  { year: '2024', month: '12', title: 'Dự kiến: 1000 xe', desc: 'Mở rộng ra 20 tỉnh/thành, ra mắt Morent Business cho doanh nghiệp' },
];

const team = [
  { name: 'Nguyễn Văn An', role: 'CEO & Co-founder', bio: '10+ năm kinh nghiệm công nghệ, trước đây CTO tại startup giao hàng hàng đầu Việt Nam', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
  { name: 'Trần Thị Bình', role: 'COO & Co-founder', bio: 'Chuyên gia vận tải, trước đây Giám đốc vận hành tại công ty cho thuê xe lớn nhất miền Bắc', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { name: 'Lê Văn Cường', role: 'CTO', bio: 'Kiến trúc sư hệ thống, 8+ năm xây dựng nền tảng công nghệ quy mô lớn, chuyên gia bảo mật', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Phạm Thị Dung', role: 'CMO', bio: 'Chuyên gia marketing số, trước đây Trưởng phòng Marketing tại unicorn fintech Việt Nam', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200' },
];

const certifications = [
  { name: 'ISO 9001:2015', issuer: 'SGS Vietnam', desc: 'Hệ thống quản lý chất lượng', icon: Award },
  { name: 'ISO 27001:2022', issuer: 'Bureau Veritas', desc: 'Quản lý an ninh thông tin', icon: Shield },
  { name: 'PCI DSS Level 1', issuer: 'Trustwave', desc: 'Bảo mật dữ liệu thẻ thanh toán', icon: Lock },
  { name: 'Top 10 Startup Việt Nam 2024', issuer: 'VnExpress', desc: 'Giải thưởng khởi nghiệp nổi bật', icon: TrendingUp },
  { name: 'Chứng chỉ Đổi số', issuer: 'Bộ TT&TT', desc: 'Chương trình chuyển đổi số quốc gia', icon: Zap },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container text-center">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <Target className="w-3 h-3" /> Về Morent
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Sứ mệnh: <span className="text-primary">Đưa cho thuê xe đến mọi người</span></h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">Nền tảng cho thuê xe hàng đầu Việt Nam - Kết nối, minh bạch, bền vững</p>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 container">
        <div className="grid grid-2 lg:grid-4 gap-6 mb-16">
          {stats.map((stat, i) => (
            <Card key={i} className="p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-secondary">{stat.label}</div>
            </Card>
          ))}
        </div>
        
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold text-primary mb-6">Giá trị cốt lõi</h2>
          <p className="text-lg text-secondary mb-12">4 trụ cột định hình văn hóa và cách làm việc của Morent</p>
          <div className="grid grid-2 lg:grid-4 gap-6">
            {values.map((value, i) => (
              <Card key={i} className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{value.title}</h3>
                <p className="text-secondary">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Hành trình phát triển</h2>
            <p className="text-secondary">Các mốc quan trọng từ ý tưởng đến nền tảng hàng đầu</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, i) => (
              <div key={i} className="relative pl-8 pb-12 last:pb-0">
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-primary border-4 border-surface" />
                {i < milestones.length - 1 && <div className="absolute left-1.5 top-4 bottom-0 w-0.5 bg-border" />}
                <div className="flex items-start gap-4">
                  <div className="text-right w-20 flex-shrink-0">
                    <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                    <div className="text-sm text-tertiary">Tháng {milestone.month}</div>
                  </div>
                  <div className="flex-1 p-4 bg-surface rounded-xl border border-border">
                    <h3 className="font-semibold text-primary mb-1">{milestone.title}</h3>
                    <p className="text-secondary">{milestone.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Đội ngũ lãnh đạo</h2>
          <p className="text-secondary">Những người dẫn dắt Morent tới phía trước</p>
        </div>
        
        <div className="grid grid-2 lg:grid-4 gap-6">
          {team.map((member, i) => (
            <Card key={i} className="p-6 text-center">
              <Avatar src={member.avatar} name={member.name} size="xl" className="mx-auto mb-4" />
              <h3 className="text-lg font-bold text-primary">{member.name}</h3>
              <p className="text-primary/80 text-sm mb-2">{member.role}</p>
              <p className="text-secondary text-sm">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Chứng nhận & Giải thưởng</h2>
            <p className="text-secondary">Cam kết chất lượng quốc tế</p>
          </div>
          
          <div className="grid grid-2 lg:grid-3 gap-6">
            {certifications.map((cert, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <cert.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary">{cert.name}</h3>
                    <p className="text-sm text-tertiary">{cert.issuer}</p>
                    <p className="text-sm text-secondary mt-1">{cert.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Cùng Morent xây dựng tương lai di chuyển</h2>
            <p className="text-primary-light mb-8 text-lg">Đối tác, nhà đầu tư, nhân tài - Hãy cùng chúng tôi thay đổi cách mọi người thuê xe</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/partner" className="btn btn-lg bg-white text-primary hover:bg-primary/5 px-8">Trở thành đối tác</Link>
              <Link to="/careers" className="btn btn-lg border-2 border-white text-white hover:bg-white/10 px-8">Cơ hội việc làm</Link>
              <Link to="/press" className="btn btn-lg border-2 border-white text-white hover:bg-white/10 px-8">Báo chí & Media</Link>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 container">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-3 gap-8 mb-12">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Building className="w-5 h-5" />Thông tin công ty</h3>
              <div className="space-y-3 text-secondary">
                <p><span className="font-medium text-primary">Tên pháp lý:</span> Công ty TNHH Morent</p>
                <p><span className="font-medium text-primary">Mã số thuế:</span> 0109876543</p>
                <p><span className="font-medium text-primary">Ngày cấp:</span> 15/01/2023</p>
                <p><span className="font-medium text-primary">Nơi cấp:</span> Sở KH&ĐT TP.HCM</p>
                <p><span className="font-medium text-primary">Địa chỉ:</span> 123 Nguyễn Văn Linh, Quận 7, TP.HCM</p>
                <p><span className="font-medium text-primary">Đại diện pháp luật:</span> Nguyễn Văn An - Giám đốc</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Mail className="w-5 h-5" />Liên hệ</h3>
              <div className="space-y-3 text-secondary">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" />contact@morent.vn</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4" />1900 123 456</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" />partner@morent.vn (Đối tác)</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" />hr@morent.vn (Tuyển dụng)</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" />legal@morent.vn (Pháp lý)</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4" />privacy@morent.vn (Bảo mật)</p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4 flex items-center gap-2"><Clock className="w-5 h-5" />Giờ làm việc</h3>
              <div className="space-y-2 text-secondary">
                <p>Thứ 2 - Thứ 6: 8:00 - 18:00</p>
                <p>Thứ 7: 8:00 - 17:00</p>
                <p>Chủ Nhật: Nghỉ (Hỗ trợ online 24/7)</p>
                <div className="pt-2 border-t border-border">
                  <p className="font-medium text-primary">Hỗ trợ khách hàng: 24/7</p>
                  <p className="text-sm">Hotline: 1900 123 456</p>
                </div>
              </div>
            </Card>
          </div>
          
          <div className="text-center pt-8 border-t border-border">
            <Link to="/" className="btn btn-primary"><ArrowRight className="w-4 h-4 mr-2" />Quay lại trang chủ</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

function Lock({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
}
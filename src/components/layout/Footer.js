import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Car, MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, Shield, CheckCircle, Truck, Headphones, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    company: [
      { label: 'Về chúng tôi', to: '/about' },
      { label: 'Cách thuê xe', to: '/how-it-works' },
      { label: 'Trở thành đối tác', to: '/partner' },
      { label: 'Tuyển dụng', to: '/careers' },
      { label: 'Báo chí', to: '/press' },
    ],
    support: [
      { label: 'Trung tâm trợ giúp', to: '/support' },
      { label: 'Chính sách hủy đơn', to: '/cancellation-policy' },
      { label: 'Điều khoản sử dụng', to: '/terms' },
      { label: 'Chính sách bảo mật', to: '/privacy' },
      { label: 'Liên hệ', to: '/contact' },
    ],
    customer: [
      { label: 'Đăng ký thành viên', to: '/register' },
      { label: 'Quản lý đặt xe', to: '/account/bookings' },
      { label: 'Chương trình thân thiết', to: '/loyalty' },
      { label: 'Blog du lịch', to: '/blog' },
      { label: 'Đánh giá xe', to: '/reviews' },
    ],
    provider: [
      { label: 'Đăng ký cung cấp xe', to: '/provider/register' },
      { label: 'Bảng điều khiển', to: '/provider' },
      { label: 'Hướng dẫn đăng xe', to: '/provider/guide' },
      { label: 'Chính sách giá', to: '/provider/pricing' },
      { label: 'Hỗ trợ đối tác', to: '/provider/support' },
    ],
  };
  
  const trustBadges = [
    { icon: Shield, label: 'Xe đã xác minh', desc: 'Kiểm định 100% trước khi cho thuê' },
    { icon: CheckCircle, label: 'Bảo hiểm toàn diện', desc: 'Bảo vệ tối đa cho chuyến đi' },
    { icon: Truck, label: 'Giao xe tận nơi', desc: 'Sân bay, khách sạn, nhà riêng' },
    { icon: Headphones, label: 'Hỗ trợ 24/7', desc: 'Đội ngũ sẵn sàng phục vụ' },
  ];
  
  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/morent' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/morent' },
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/morent' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/morent' },
  ];
  
  const contactInfo = {
    address: 'Tầng 12, Tòa nhà Morent, 123 Nguyễn Văn Linh, Quận 7, TP.HCM',
    phone: '1900 123 456',
    email: 'support@morent.vn',
    hours: '7:00 - 22:00 hàng ngày (kể cả T7, CN)',
  };
  
  const paymentMethods = [
    { label: 'Visa', icon: <svg viewBox="0 0 24 24" className="w-6 h-4"><path fill="currentColor" d="M20.944 10.595l-5.889 10.667H4.16l3.287-5.852h8.906l3.167 5.852h-8.825l5.96-10.667h8.244z"/></svg> },
    { label: 'Mastercard', icon: <svg viewBox="0 0 24 24" className="w-6 h-4"><path fill="currentColor" d="M21.39 10.083c0-5.486-4.425-9.938-9.88-9.938-5.453 0-9.878 4.452-9.878 9.938 0 1.567.386 3.042 1.032 4.377.723 1.5 1.673 3.072 2.864 4.385 1.104 1.235 2.574 2.237 4.058 2.808 1.418.568 2.938.852 4.479.852 1.62 0 3.162-.33 4.579-.935l-.998-3.556c-.863.26-1.93.393-3.176.393-2.335 0-4.286-1.376-4.972-3.455-.655-1.964-.97-4.168-.97-6.438 0-4.065 2.944-7.17 7.463-7.17 2.305 0 4.343.714 6.002 1.935l.988-3.582C22.842 4.084 21.39 7.138 21.39 10.083z"/></svg> },
    { label: 'MoMo', icon: <span className="font-bold text-pink-500">MoMo</span> },
    { label: 'ZaloPay', icon: <span className="font-bold text-blue-500">ZaloPay</span> },
    { label: 'VNPAY', icon: <span className="font-bold text-blue-600">VNPAY</span> },
    { label: 'Chuyển khoản', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-4"><rect x="2" y="3" width="20" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/><line x1="2" y1="10" x2="22" y2="10"/></svg> },
  ];
  
  const certifications = [
    { label: 'Bộ GTVT', desc: 'Cấp phép kinh doanh' },
    { label: 'ISO 9001:2015', desc: 'Quản lý chất lượng' },
    { label: 'PCI DSS', desc: 'Bảo mật thanh toán' },
  ];
  
  return (
    <footer className="bg-secondary-light border-t border-border" role="contentinfo">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-4 gap-8 lg:gap-12 mb-12">
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl" aria-label="Car rent Morent - Trang chủ">
              <Car className="w-8 h-8 text-primary" aria-hidden="true" />
              <span>Morent</span>
            </Link>
            <p className="text-tertiary text-base leading-relaxed max-w-md">
              Nền tảng cho thuê ô tô hàng đầu Việt Nam, kết nối khách hàng với đội xe đa dạng, 
              quy trình minh bạch, thanh toán an toàn và hỗ trợ 24/7.
            </p>
            
            <div className="flex flex-wrap gap-3">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-bg-tertiary text-tertiary hover:bg-primary/20 hover:text-primary transition"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {paymentMethods.map((method, i) => (
                <span key={i} className="px-3 py-1.5 bg-bg-tertiary border border-border rounded-lg text-xs text-tertiary flex items-center gap-1">
                  {method.icon}
                  {method.label}
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
            <address className="not-italic space-y-3 text-tertiary">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-medium text-white">Văn phòng chính</p>
                  <p>{contactInfo.address}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-primary transition">{contactInfo.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition">{contactInfo.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                <span>{contactInfo.hours}</span>
              </div>
            </address>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Chứng nhận & Giải thưởng</h4>
            <div className="space-y-3">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-bg-tertiary rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{cert.label}</p>
                    <p className="text-tertiary text-xs">{cert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([key, links]) => (
            <nav key={key} aria-label={key === 'company' ? 'Về Morent' : key === 'support' ? 'Hỗ trợ' : key === 'customer' ? 'Khách hàng' : 'Đối tác'}>
              <h4 className="font-semibold text-white mb-4">{key === 'company' ? 'Về Morent' : key === 'support' ? 'Hỗ trợ' : key === 'customer' ? 'Khách hàng' : 'Đối tác'}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-tertiary hover:text-primary transition text-sm">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-tertiary text-sm">
              © {currentYear} Car rent Morent. Mọi quyền được bảo lưu.
            </p>
            <div className="flex items-center gap-4 text-xs text-tertiary">
              <span>Địa chỉ: {contactInfo.address}</span>
              <span>Hotline: {contactInfo.phone}</span>
              <span>Email: {contactInfo.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="#top" className="flex items-center gap-1 text-tertiary hover:text-primary transition text-sm">
                <ArrowUpRight className="w-4 h-4" />
                Lên đầu trang
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Award({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><path d="M8.21 13.89 7 23l5-4.5 5 4.5-1.21-9.11"/></svg>;
}
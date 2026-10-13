import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle, Loader2, MessageSquare, User, Building, Car, Headphones, MapPin as MapPinIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Textarea, Select, Checkbox } from '../ui/Input';
import { Card, Badge, Avatar } from '../ui/DataDisplay';
import { useNotification } from '../context/NotificationContext';

const contactChannels = [
  { icon: Phone, title: 'Hotline 24/7', desc: '1900 123 456', action: 'Gọi ngay', href: 'tel:1900123456', color: 'from-green-500 to-emerald-500', available: 'Luôn sẵn sàng' },
  { icon: Mail, title: 'Email hỗ trợ', desc: 'support@morent.vn', action: 'Gửi email', href: 'mailto:support@morent.vn', color: 'from-blue-500 to-indigo-500', available: 'Phản hồi < 2h' },
  { icon: MessageSquare, title: 'Chat trực tuyến', desc: 'Trên website/app', action: 'Mở chat', onClick: () => alert('Mở chat hỗ trợ'), color: 'from-purple-500 to-pink-500', available: '7:00 - 22:00' },
  { icon: MapPinIcon, title: 'Văn phòng chính', desc: '123 Nguyễn Văn Linh, Q7, TP.HCM', action: 'Chỉ đường', href: 'https://maps.google.com/?q=123+Nguyen+Van+Linh+Q7+TPHCM', color: 'from-orange-500 to-red-500', available: 'T2-T6: 8-18h' },
];

const faqs = [
  { q: 'Làm sao để liên hệ nhanh nhất?', a: 'Gọi hotline 1900 123 456 (24/7) hoặc chat trực tuyến trên website/app (7-22h) để được hỗ trợ ngay lập tức.' },
  { q: 'Email hỗ trợ phản hồi trong bao lâu?', a: 'Chúng tôi cam kết phản hồi email trong 2 giờ làm việc. Các yêu cầu khẩn cấp vui lòng gọi hotline.' },
  { q: 'Có hỗ trợ tiếng Anh không?', a: 'Có, đội ngũ hỗ trợ có nhân viên nói tiếng Anh fluently. Có thể yêu cầu khi gọi hoặc chat.' },
  { q: 'Khiếu nại dịch vụ gửi đâu?', a: 'Gửi email complaints@morent.vn hoặc gọi hotline nhánh 2. Chúng tôi xử lý trong 48h và phản hồi kết quả.' },
  { q: 'Đề xuất tính năng mới gửi đâu?', a: 'Gửi email feedback@morent.vn. Mọi ý kiến đóng góp đều được xem xét cho các phiên bản cập nhật.' },
  { q: 'Làm sao để hợp tác kinh doanh?', a: 'Liên hệ partner@morent.vn hoặc điền form "Trở thành đối tác" trên website. Đội ngũ BD sẽ liên hệ trong 1 ngày.' },
];

export function ContactPage() {
  const [activeTab, setActiveTab] = useState('contact');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'support',
    message: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { success, error: showError } = useNotification();
  
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Họ tên không được để trống';
    if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
    else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) newErrors.phone = 'SĐT không hợp lệ';
    if (!formData.message.trim()) newErrors.message = 'Nội dung không được để trống';
    else if (formData.message.trim().length < 20) newErrors.message = 'Nội dung phải có ít nhất 20 ký tự';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'Bạn phải đồng ý với chính sách bảo mật';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    
    success('Gửi thành công!', 'Mã ticket: CT-' + Date.now().toString().slice(-6) + '. Chúng tôi sẽ phản hồi qua email trong 2h.');
    setSubmitted(true);
    setFormData({ name: '', email: '', phone: '', subject: 'support', message: '', agreeTerms: false });
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container text-center">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <Headphones className="w-3 h-3" /> Liên hệ & Hỗ trợ
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Cần hỗ trợ?</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">Chúng tôi luôn sẵn sàng lắng nghe. Chọn kênh phù hợp hoặc điền form bên dưới.</p>
        </div>
      </section>
      
      <section className="py-8 lg:py-12 container">
        <div className="grid grid-2 lg:grid-4 gap-4 mb-12">
          {contactChannels.map((channel, i) => (
            <Card key={i} className="p-6 h-full group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4" style={{ background: channel.color }}>
                <channel.icon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-1">{channel.title}</h3>
              <p className="text-secondary text-sm mb-2">{channel.desc}</p>
              <p className="text-xs text-tertiary mb-4 flex items-center gap-1"><Clock className="w-3 h-3" /> {channel.available}</p>
              <button 
                className="btn btn-primary text-sm w-full"
                onClick={channel.onClick ? () => channel.onClick() : undefined}
              >
                {channel.action}
              </button>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="py-8 lg:py-12 bg-bg-secondary">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="md:w-72 flex-shrink-0">
              <nav className="space-y-2" aria-label="Menu liên hệ">
                <button
                  className={classNames('w-full text-left px-4 py-3 rounded-lg font-medium transition', activeTab === 'contact' ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10')}
                  onClick={() => setActiveTab('contact')}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Gửi tin nhắn
                </button>
                <button
                  className={classNames('w-full text-left px-4 py-3 rounded-lg font-medium transition', activeTab === 'faq' ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10')}
                  onClick={() => setActiveTab('faq')}
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Câu hỏi thường gặp
                </button>
                <button
                  className={classNames('w-full text-left px-4 py-3 rounded-lg font-medium transition', activeTab === 'offices' ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10')}
                  onClick={() => setActiveTab('offices')}
                >
                  <Building className="w-5 h-5 mr-2" />
                  Văn phòng & Địa chỉ
                </button>
              </nav>
            </aside>
            
            <main className="flex-1 min-w-0">
              {activeTab === 'contact' && (
                <Card className="p-6">
                  {submitted ? (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-primary mb-2">Đã gửi thành công!</h3>
                      <p className="text-secondary mb-6">Cảm ơn bạn đã liên hệ. Mã ticket: <strong>CT-{Date.now().toString().slice(-6)}</strong></p>
                      <p className="text-secondary mb-6">Chúng tôi sẽ phản hồi qua email trong 2 giờ làm việc.</p>
                      <Button onClick={() => setSubmitted(false)}>Gửi tin nhắn khác</Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <h3 className="text-xl font-bold text-primary mb-6">Gửi tin nhắn cho chúng tôi</h3>
                      <div className="grid grid-2 gap-4">
                        <Input label="Họ tên *" name="name" value={formData.name} onChange={handleChange} error={errors.name} required placeholder="Nguyễn Văn An" />
                        <Input label="Email *" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required placeholder="nguyenvanan@email.com" />
                      </div>
                      <div className="grid grid-2 gap-4">
                        <Input label="Số điện thoại *" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required placeholder="09xxxxxxxx" />
                        <Select label="Chủ đề *" name="subject" value={formData.subject} onChange={handleChange} options={[
                          { value: 'support', label: 'Hỗ trợ kỹ thuật' },
                          { value: 'booking', label: 'Đặt xe / Thanh toán' },
                          { value: 'vehicle', label: 'Xe / Trang thiết bị' },
                          { value: 'insurance', label: 'Bảo hiểm / Sự cố' },
                          { value: 'complaint', label: 'Khiếu nại' },
                          { value: 'partnership', label: 'Hợp tác / Đối tác' },
                          { value: 'career', label: 'Tuyển dụng' },
                          { value: 'press', label: 'Báo chí / Media' },
                          { value: 'other', label: 'Khác' },
                        ]} required />
                      </div>
                      <Textarea label="Nội dung *" name="message" value={formData.message} onChange={handleChange} error={errors.message} rows={5} required placeholder="Mô tả chi tiết vấn đề, yêu cầu hoặc ý kiến của bạn..." />
                      
                      <Checkbox
                        label="Tôi đồng ý với Chính sách bảo mật và cho phép Morent xử lý thông tin để liên hệ hỗ trợ"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        error={errors.agreeTerms}
                        required
                      />
                      
                      <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <Button variant="secondary" type="button" onClick={() => { setFormData({ name: '', email: '', phone: '', subject: 'support', message: '', agreeTerms: false }); }}>Nhập lại</Button>
                        <Button type="submit" loading={loading} size="lg">
                          <Send className="w-5 h-5 mr-2" />
                          Gửi tin nhắn
                        </Button>
                      </div>
                    </form>
                  )}
                </Card>
              )}
              
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  <Accordion items={faqs.map((faq, i) => ({ id: `faq-${i}`, title: faq.q, content: faq.a }))} allowMultiple />
                </div>
              )}
              
              {activeTab === 'offices' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Văn phòng chính (Headquarters)</h3>
                    <div className="grid grid-2 gap-6">
                      <div>
                        <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><MapPinIcon className="w-5 h-5" /></div>
                          <div>
                            <p className="font-medium text-primary">Địa chỉ</p>
                            <p className="text-secondary">123 Nguyễn Văn Linh, Quận 7, TP.HCM</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg mb-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Phone className="w-5 h-5" /></div>
                          <div>
                            <p className="font-medium text-primary">Tổng đài</p>
                            <p className="text-secondary">1900 123 456 (24/7)</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-bg-secondary rounded-lg">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary"><Mail className="w-5 h-5" /></div>
                          <div>
                            <p className="font-medium text-primary">Email</p>
                            <p className="text-secondary">contact@morent.vn</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="aspect-video bg-tertiary rounded-xl flex items-center justify-center">
                          <MapPinIcon className="w-12 h-12 text-tertiary" />
                          <span className="text-tertiary">Bản đồ (Google Maps embed)</span>
                        </div>
                        <p className="text-sm text-tertiary text-center mt-2">Nhấn "Chỉ đường" trên thẻ liên hệ ở trên để mở Google Maps</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Văn phòng đại diện khu vực</h3>
                    <div className="grid grid-2 lg:grid-4 gap-4">
                      {[
                        { city: 'Hà Nội', address: '789 Láng Hạ, Đống Đa', phone: '024 3974 1234', manager: 'Nguyễn Văn An' },
                        { city: 'Đà Nẵng', address: '456 Trần Phú, Hải Châu', phone: '0236 3825 678', manager: 'Trần Thị Bình' },
                        { city: 'Nha Trang', address: '123 Trần Phú, Lộc Thọ', phone: '0258 3830 999', manager: 'Lê Văn Cường' },
                        { city: 'Hải Phòng', address: '345 Lạch Tray, Ngô Quyền', phone: '0225 3890 123', manager: 'Phạm Thị Dung' },
                      ].map((office, i) => (
                        <div key={i} className="p-4 bg-bg-secondary rounded-lg">
                          <h4 className="font-semibold text-primary mb-2">{office.city}</h4>
                          <p className="text-sm text-secondary mb-1"><MapPinIcon className="w-4 h-4 inline mr-1" /> {office.address}</p>
                          <p className="text-sm text-secondary mb-1"><Phone className="w-4 h-4 inline mr-1" /> {office.phone}</p>
                          <p className="text-sm text-secondary"><User className="w-4 h-4 inline mr-1" /> Quản lý: {office.manager}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Điểm giao/nhận xe phổ biến</h3>
                    <div className="grid grid-2 lg:grid-3 gap-4">
                      {[
                        { name: 'Sân bay Nội Bài (Hà Nội)', type: 'airport', address: 'Số 1 đường Võ Nguyên Giáp, Sóc Sơn' },
                        { name: 'Sân bay Tân Sơn Nhất (TP.HCM)', type: 'airport', address: 'Số 1 đường Trường Sơn, Phường 2, Tân Bình' },
                        { name: 'Sân bay Đà Nẵng', type: 'airport', address: 'Đường Hòa Bắc, Hòa Vang' },
                        { name: 'Ga Hà Nội', type: 'station', address: '120 phố Lê Duẩn, Hoàn Kiếm' },
                        { name: 'Ga Sài Gòn', type: 'station', address: '01 đường Nguyễn Thông, Võ Thị Sáu, Quận 3' },
                        { name: 'Bến xe Miền Đông', type: 'station', address: 'Đường Trường Chinh, Phú Nhuận, TP.HCM' },
                      ].map((location, i) => (
                        <div key={i} className="p-4 bg-bg-secondary rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={location.type === 'airport' ? 'info' : 'warning'} className="text-xs">
                              {location.type === 'airport' ? '✈️ Sân bay' : '🚉 Ga/Bến xe'}
                            </Badge>
                            <h4 className="font-medium text-primary">{location.name}</h4>
                          </div>
                          <p className="text-sm text-secondary"><MapPinIcon className="w-4 h-4 inline mr-1" /> {location.address}</p>
                          <p className="text-xs text-tertiary">Hỗ trợ giao nhận 24/7</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Chưa tìm thấy câu trả lời?</h2>
          <p className="text-primary-light mb-8 max-w-2xl mx-auto">Đội ngũ hỗ trợ Morent sẵn sàng giúp đỡ bạn 24/7. Đừng ngần ngại liên hệ!</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:1900123456" className="btn btn-lg bg-white text-primary hover:bg-primary/5 px-8">
              <Phone className="w-5 h-5 mr-2" />
              Gọi hotline ngay
            </a>
            <a href="mailto:support@morent.vn" className="btn btn-lg border-2 border-white text-white hover:bg-white/10 px-8">
              <Mail className="w-5 h-5 mr-2" />
              Gửi email
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function Headphones({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
}

function Send({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
}

function MessageSquare({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}

function MapPinIcon({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}

function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
}
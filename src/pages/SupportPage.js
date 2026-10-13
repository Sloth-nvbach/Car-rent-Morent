import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Headphones, Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle, AlertCircle, Loader2, User, Building, Car, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, Textarea } from '../ui/Input';
import { Badge, Card, Avatar, Rating } from '../ui/DataDisplay';
import { useNotification } from '../context/NotificationContext';

const faqs = [
  { q: 'Cần giấy tờ gì để thuê xe?', a: 'Cần CCCD/CMND gốc, bằng lái xe hạng B1/B2 còn hiệu lực. Người nước ngoài cần hộ chiếu và bằng lái xe quốc tế (IDP).' },
  { q: 'Có thuê xe không người lái không?', a: 'Có, Morent cho thuê xe tự lái (self-drive) cho khách đủ điều kiện. Cần bằng lái xe phù hợp, thẻ tín dụng để đặt cọc.' },
  { q: 'Quy trình hủy đơn như thế nào?', a: 'Hủy trước 24h được hoàn 100% tiền cọc. Hủy trong 24h trừ 50% tiền cọc. Xem chi tiết tại Chính sách hủy.' },
  { q: 'Xe bị hỏng trên đường thì sao?', a: 'Gọi hotline 1900 123 456 (24/7). Đội ngũ hỗ trợ cứu hộ, thay xe dự phòng miễn phí nếu lỗi từ nhà cung cấp.' },
  { q: 'Có cho thuê xe theo giờ không?', a: 'Hiện tại Morent cho thuê theo ngày (tối thiểu 1 ngày). Giá thuê dài hạn (7/30 ngày) có giảm giá sâu.' },
  { q: 'Có giao xe tận nơi không?', a: 'Có, giao/nhận xe tại sân bay, khách sạn, văn phòng, nhà riêng. Phí tùy thuộc vào khoảng cách.' },
  { q: 'Bảo hiểm bao gồm gì?', a: 'Bảo hiểm tai nạn, hỏa hoạn, thiên tai, trách nhiệm dân sự. Mức bồi thường lên đến 500 triệu đồng.' },
  { q: 'Thanh toán bằng cách nào?', a: 'VNPAY, MoMo, ZaloPay, chuyển khoản ngân hàng, tiền mặt khi nhận xe (một số xe).' },
];

const categories = [
  { value: 'booking', label: 'Đặt xe & Thanh toán', icon: CreditCard },
  { value: 'vehicle', label: 'Xe & Trang thiết bị', icon: Car },
  { value: 'insurance', label: 'Bảo hiểm & Sự cố', icon: Shield },
  { value: 'delivery', label: 'Giao nhận xe', icon: Truck },
  { value: 'account', label: 'Tài khoản & Hồ sơ', icon: User },
  { value: 'provider', label: 'Đối tác & Nhà cung cấp', icon: Building },
  { value: 'other', label: 'Khác', icon: MessageCircle },
];

const supportChannels = [
  { icon: Phone, title: 'Hotline 24/7', desc: '1900 123 456', action: 'Gọi ngay', href: 'tel:1900123456', color: 'from-green-500 to-emerald-500' },
  { icon: Mail, title: 'Email hỗ trợ', desc: 'support@morent.vn', action: 'Gửi email', href: 'mailto:support@morent.vn', color: 'from-blue-500 to-indigo-500' },
  { icon: MessageCircle, title: 'Chat trực tuyến', desc: 'Phản hồi < 5 phút', action: 'Mở chat', onClick: () => alert('Mở chat hỗ trợ'), color: 'from-purple-500 to-pink-500' },
  { icon: MapPin, title: 'Văn phòng chính', desc: '123 Nguyễn Văn Linh, Q7, TP.HCM', action: 'Chỉ đường', href: 'https://maps.google.com', color: 'from-orange-500 to-red-500' },
];

export function SupportPage() {
  const [activeTab, setActiveTab] = useState('faq');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'booking',
    priority: 'medium',
    message: '',
    email: '',
    phone: '',
    bookingId: '',
  });
  const [ticketErrors, setTicketErrors] = useState({});
  const [ticketLoading, setTicketLoading] = useState(false);
  const { success, error: showError } = useNotification();
  
  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const validateTicket = () => {
    const errors = {};
    if (!ticketForm.subject.trim()) errors.subject = 'Chủ đề không được để trống';
    if (!ticketForm.category) errors.category = 'Vui lòng chọn danh mục';
    if (!ticketForm.message.trim()) errors.message = 'Nội dung không được để trống';
    else if (ticketForm.message.trim().length < 20) errors.message = 'Nội dung phải có ít nhất 20 ký tự';
    if (!ticketForm.email.trim()) errors.email = 'Email không được để trống';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ticketForm.email)) errors.email = 'Email không hợp lệ';
    if (!ticketForm.phone.trim()) errors.phone = 'Số điện thoại không được để trống';
    setTicketErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!validateTicket()) return;
    
    setTicketLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setTicketLoading(false);
    
    success('Gửi yêu cầu thành công!', 'Mã ticket: TKT-' + Date.now().toString().slice(-6) + '. Chúng tôi sẽ liên hệ trong 30 phút.');
    setShowTicketForm(false);
    setTicketForm({ subject: '', category: 'booking', priority: 'medium', message: '', email: '', phone: '', bookingId: '' });
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container text-center">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <Headphones className="w-3 h-3" /> Trung tâm hỗ trợ
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Cần hỗ trợ?</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">Chúng tôi sẵn sàng hỗ trợ bạn 24/7. Tìm câu trả lời nhanh hoặc liên hệ trực tiếp.</p>
        </div>
      </section>
      
      <section className="py-8 lg:py-12 container">
        <div className="grid grid-2 lg:grid-4 gap-4 mb-12">
          {supportChannels.map((channel, i) => (
            <Card key={i} className="p-6 h-full group">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4" style={{ background: channel.color }}>
                <channel.icon className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-semibold text-primary mb-1">{channel.title}</h3>
              <p className="text-secondary text-sm mb-4">{channel.desc}</p>
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
              <nav className="space-y-2" aria-label="Menu hỗ trợ">
                <button
                  className={classNames('w-full text-left px-4 py-3 rounded-lg font-medium transition', activeTab === 'faq' ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10')}
                  onClick={() => setActiveTab('faq')}
                >
                  <Headphones className="w-5 h-5 mr-2" />
                  Câu hỏi thường gặp
                </button>
                <button
                  className={classNames('w-full text-left px-4 py-3 rounded-lg font-medium transition', activeTab === 'ticket' ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10')}
                  onClick={() => setActiveTab('ticket')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Tạo yêu cầu hỗ trợ
                </button>
                <button
                  className={classNames('w-full text-left px-4 py-3 rounded-lg font-medium transition', activeTab === 'contact' ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10')}
                  onClick={() => setActiveTab('contact')}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Thông tin liên hệ
                </button>
              </nav>
            </aside>
            
            <main className="flex-1 min-w-0">
              {activeTab === 'faq' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-6">
                    <Search className="w-5 h-5 text-tertiary" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm câu hỏi..."
                      className="input-field flex-1"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <Accordion items={filteredFaqs.map((faq, i) => ({
                    id: `faq-${i}`,
                    title: faq.q,
                    content: faq.a,
                  }))} allowMultiple />
                  
                  {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                      <AlertCircle className="w-12 h-12 text-tertiary mx-auto mb-4" />
                      <p className="text-secondary">Không tìm thấy câu hỏi phù hợp</p>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === 'ticket' && (
                <div className="space-y-6">
                  {!showTicketForm ? (
                    <Card className="p-8 text-center">
                      <MessageCircle className="w-16 h-16 text-tertiary mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-primary mb-2">Không tìm thấy câu trả lời?</h3>
                      <p className="text-secondary mb-6">Tạo yêu cầu hỗ trợ, đội ngũ sẽ phản hồi trong 30 phút.</p>
                      <Button onClick={() => setShowTicketForm(true)} size="lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo yêu cầu mới
                      </Button>
                    </Card>
                  ) : (
                    <Card className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-primary">Tạo yêu cầu hỗ trợ</h3>
                        <Button variant="ghost" onClick={() => setShowTicketForm(false)}>
                          <X className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <form onSubmit={handleSubmitTicket} className="space-y-4">
                        <Input label="Chủ đề *" name="subject" value={ticketForm.subject} onChange={(e) => setTicketForm(d => ({ ...d, [e.target.name]: e.target.value }))} error={ticketErrors.subject} placeholder="VD: Không nhận được email xác nhận" required />
                        
                        <Select label="Danh mục *" name="category" value={ticketForm.category} onChange={(e) => setTicketForm(d => ({ ...d, [e.target.name]: e.target.value }))} error={ticketErrors.category} options={categories} required />
                        
                        <Select label="Mức độ ưu tiên" name="priority" value={ticketForm.priority} onChange={(e) => setTicketForm(d => ({ ...d, [e.target.name]: e.target.value }))} options={[
                          { value: 'low', label: 'Thấp - Câu hỏi chung' },
                          { value: 'medium', label: 'Trung bình - Vấn đề đặt xe' },
                          { value: 'high', label: 'Cao - Sự cố xe, thanh toán' },
                          { value: 'urgent', label: 'Khẩn cấp - An toàn, khiếu nại' },
                        ]} />
                        
                        <Input label="Mã đơn đặt xe (nếu có)" name="bookingId" value={ticketForm.bookingId} onChange={(e) => setTicketForm(d => ({ ...d, [e.target.name]: e.target.value }))} placeholder="VD: BK-20240715-001" />
                        
                        <Textarea label="Mô tả chi tiết *" name="message" value={ticketForm.message} onChange={(e) => setTicketForm(d => ({ ...d, [e.target.name]: e.target.value }))} error={ticketErrors.message} rows={5} required placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." />
                        
                        <div className="grid grid-2 gap-4 pt-4 border-t border-border">
                          <Input label="Email *" type="email" name="email" value={ticketForm.email} onChange={(e) => setTicketForm(d => ({ ...d, [e.target.name]: e.target.value }))} error={ticketErrors.email} required />
                          <Input label="Số điện thoại *" type="tel" name="phone" value={ticketForm.phone} onChange={(e) => setTicketForm(d => ({ ...d, [e.target.name]: e.target.value }))} error={ticketErrors.phone} required />
                        </div>
                        
                        <div className="flex justify-end gap-3 pt-4 border-t border-border">
                          <Button variant="secondary" type="button" onClick={() => setShowTicketForm(false)}>Hủy</Button>
                          <Button type="submit" loading={ticketLoading}>Gửi yêu cầu</Button>
                        </div>
                      </form>
                    </Card>
                  )}
                </div>
              )}
              
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Thông tin liên hệ Morent</h3>
                    <div className="space-y-4">
                      <ContactItem icon={MapPin} title="Văn phòng chính" value="123 Nguyễn Văn Linh, Quận 7, TP.HCM" />
                      <ContactItem icon={Phone} title="Hotline 24/7" value="1900 123 456" action="Gọi ngay" href="tel:1900123456" />
                      <ContactItem icon={Mail} title="Email hỗ trợ" value="support@morent.vn" action="Gửi email" href="mailto:support@morent.vn" />
                      <ContactItem icon={Mail} title="Email đối tác" value="partner@morent.vn" action="Gửi email" href="mailto:partner@morent.vn" />
                      <ContactItem icon={Mail} title="Email tuyển dụng" value="hr@morent.vn" action="Gửi email" href="mailto:hr@morent.vn" />
                      <ContactItem icon={Clock} title="Giờ làm việc" value="7:00 - 22:00 hàng ngày (kể cả T7, CN)" />
                    </div>
                  </Card>
                  
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-primary mb-4">Mạng xã hội</h3>
                    <div className="flex flex-wrap gap-3">
                      <a href="https://facebook.com/morent" target="_blank" rel="noopener" className="btn btn-outline"><Facebook className="w-5 h-5 mr-2" />Facebook</a>
                      <a href="https://instagram.com/morent" target="_blank" rel="noopener" className="btn btn-outline"><Instagram className="w-5 h-5 mr-2" />Instagram</a>
                      <a href="https://youtube.com/morent" target="_blank" rel="noopener" className="btn btn-outline"><Youtube className="w-5 h-5 mr-2" />YouTube</a>
                      <a href="https://tiktok.com/@morent" target="_blank" rel="noopener" className="btn btn-outline"><Music className="w-5 h-5 mr-2" />TikTok</a>
                    </div>
                  </Card>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}

function ContactItem({ icon: Icon, title, value, action, href }) {
  return (
    <div className="flex items-center justify-between p-4 bg-bg-secondary rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-medium text-primary">{title}</p>
          <p className="text-secondary">{value}</p>
        </div>
      </div>
      {action && (
        <a href={href} className="btn btn-primary text-sm" target="_blank" rel="noopener">{action}</a>
      )}
    </div>
  );
}

function Accordion({ items, allowMultiple = false }) {
  const [openItems, setOpenItems] = React.useState(
    allowMultiple ? [] : items.findIndex(i => i.defaultOpen) >= 0 ? [items.findIndex(i => i.defaultOpen)] : []
  );
  
  const toggle = (index) => {
    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index];
      }
      return prev.includes(index) ? [] : [index];
    });
  };
  
  return (
    <div className="accordion">
      {items.map((item, index) => (
        <div key={item.id || index} className="accordion-item">
          <button
            className={classNames('accordion-header', openItems.includes(index) && 'open')}
            onClick={() => toggle(index)}
            aria-expanded={openItems.includes(index)}
            aria-controls={`accordion-content-${index}`}
            id={`accordion-header-${index}`}
          >
            <span>{item.title}</span>
            <svg className="accordion-icon w-5 h-5 text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <div 
            id={`accordion-content-${index}`}
            className="accordion-content"
            role="region"
            aria-labelledby={`accordion-header-${index}`}
          >
            <div className="accordion-body">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Facebook({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>;
}

function Instagram({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
}

function Youtube({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="white" d="M14.017 10.394l-5.017 3.67a.69.69 0 0 0 0 1.27l5.017 3.67a1.365 1.365 0 0 0 1.322 0 1.236 1.236 0 0 0 .002-1.149L10.976 12l4.365-3.184a.696.696 0 0 0 .005-1.27A1.303 1.303 0 0 0 14.017 10.394z"/></svg>;
}

function Music({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
}

function Truck({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
}

function X({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

function Plus({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function Search({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
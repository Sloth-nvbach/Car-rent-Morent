import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Search, Car, Calendar, MapPin, Shield, Clock, CheckCircle, ArrowRight, Truck, Headphones, Star, CreditCard, Smartphone } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge, StepIndicator, Card } from '../ui/DataDisplay';

const steps = [
  { id: 'search', icon: Search, title: 'Tìm kiếm xe', desc: 'Chọn địa điểm nhận/trả xe, ngày giờ, loại xe phù hợp. Bộ lọc thông minh giúp bạn tìm xe nhanh chóng.' },
  { id: 'select', icon: Car, title: 'Chọn xe ưng ý', desc: 'Xem chi tiết xe: hình ảnh, thông số, giá cả, chính sách, đánh giá từ khách hàng trước. So sánh dễ dàng.' },
  { id: 'book', icon: Calendar, title: 'Đặt xe online', desc: 'Điền thông tin người thuê, chọn phương thức thanh toán (VNPAY, MoMo, ZaloPay, chuyển khoản, tiền mặt).' },
  { id: 'confirm', icon: CheckCircle, title: 'Xác nhận đơn', desc: 'Nhà cung cấp xác nhận trong 30 phút. Bạn nhận email/SMS xác nhận với mã đặt xe.' },
  { id: 'pickup', icon: MapPin, title: 'Nhận xe', desc: 'Gặp nhân viên tại địa điểm约定, kiểm tra xe, chụp ảnh, ký biên bản giao nhận điện tử.' },
  { id: 'drive', icon: Shield, title: 'Đi an tâm', desc: 'Bảo hiểm toàn diện, hỗ trợ đường dây 24/7, GPS theo dõi, cứu hộ miễn phí.' },
  { id: 'return', icon: Clock, title: 'Trả xe', desc: 'Trả xe đúng giờ, kiểm tra lại, hoàn tất đơn hàng. Để lại đánh giá để giúp người khác.' },
];

const features = [
  { icon: Truck, title: 'Giao xe tận nơi', desc: 'Nhận/trả xe tại sân bay, khách sạn, văn phòng, nhà riêng. Linh hoạt theo lịch trình của bạn.' },
  { icon: Shield, title: 'Bảo hiểm toàn diện', desc: 'Bảo hiểm tai nạn, hỏa hoạn, thiên tai, trách nhiệm dân sự. Đi xa an tâm tuyệt đối.' },
  { icon: Headphones, title: 'Hỗ trợ 24/7', desc: 'Đội ngũ hỗ trợ sẵn sàng giải quyết sự cố bất kỳ lúc nào. Hotline: 1900 123 456.' },
  { icon: CreditCard, title: 'Thanh toán đa dạng', desc: 'VNPAY, MoMo, ZaloPay, chuyển khoản, tiền mặt. An toàn, nhanh chóng, minh bạch.' },
  { icon: Smartphone, title: 'Quản lý trên app', desc: 'Theo dõi đơn hàng, liên hệ tài xế, xem hóa đơn, gia hạn xe - tất cả trên điện thoại.' },
  { icon: Star, title: 'Chương trình thân thiết', desc: 'Tích điểm mỗi chuyến đi, đổi ưu đãi, giảm giá đơn tiếp theo, ưu tiên hỗ trợ.' },
];

const faqs = [
  { q: 'Cần những giấy tờ gì để thuê xe?', a: 'Cần CCCD/CMND gốc, bằng lái xe hạng B1/B2 còn hiệu lực, thẻ tín dụng/ghi nợ để đặt cọc (nếu có).' },
  { q: 'Có thể thuê xe không có người lái không?', a: 'Có, Morent cho thuê xe tự lái (self-drive) cho khách có bằng lái xe phù hợp và đủ điều kiện.' },
  { q: 'Quy trình hủy đơn như thế nào?', a: 'Hủy trước 24h được hoàn 100% tiền cọc. Hủy trong 24h trừ 50% tiền cọc. Xem chi tiết tại Chính sách hủy.' },
  { q: 'Xe có bị hỏng trên đường thì sao?', a: 'Gọi hotline 24/7, đội ngũ sẽ hỗ trợ cứu hộ, thay xe dự phòng miễn phí nếu lỗi từ nhà cung cấp.' },
  { q: 'Có cho thuê xe theo giờ không?', a: 'Hiện tại Morent cho thuê theo ngày (tối thiểu 1 ngày). Giá thuê dài hạn (7/30 ngày) có giảm giá sâu.' },
  { q: 'Người nước ngoài có thuê xe được không?', a: 'Được, cần hộ chiếu, bằng lái xe quốc tế (IDP) hoặc bằng lái xe Việt Nam còn hiệu lực.' },
];

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container text-center">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <Info className="w-3 h-3" /> Quy trình thuê xe 7 bước - Đơn giản, minh bạch
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Cách thuê xe tại Morent</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">Từ tìm kiếm đến trả xe, mọi thứ chỉ trong vài phút. Quy trình số hóa hoàn toàn, không giấy tờ phức tạp.</p>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 container">
        <StepIndicator steps={steps.map(s => ({ id: s.id, label: s.title }))} currentStep={0} className="mb-12" />
        
        <div className="space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className={classNames('grid lg:grid-3 gap-8 items-center', index % 2 === 1 && 'lg:row-reverse')}>
              <div className="lg:col-span-1 flex justify-center">
                <div className="relative w-64 h-64 lg:w-72 lg:h-72">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl flex items-center justify-center">
                    <step.icon className="w-24 h-24 text-primary" aria-hidden="true" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {index + 1}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-primary mb-3">Bước {index + 1}: {step.title}</h2>
                <p className="text-secondary text-lg mb-4">{step.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {index === 0 && <Badge variant="primary">Tìm kiếm thông minh</Badge>}
                  {index === 1 && <Badge variant="info">Xem chi tiết, so sánh</Badge>}
                  {index === 2 && <Badge variant="warning">Thanh toán an toàn</Badge>}
                  {index === 3 && <Badge variant="success">Xác nhận nhanh</Badge>}
                  {index === 4 && <Badge variant="primary">Kiểm tra xe thực tế</Badge>}
                  {index === 5 && <Badge variant="info">Bảo hiểm, hỗ trợ 24/7</Badge>}
                  {index === 6 && <Badge variant="warning">Đánh giá, tích điểm</Badge>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-bg-secondary">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-primary">Tại sao chọn Morent?</h2>
            <p className="text-secondary mt-2">Các tính năng đặc biệt làm nên sự khác biệt</p>
          </div>
          
          <div className="grid grid-2 lg:grid-3 gap-6">
            {features.map((feature, i) => (
              <Card key={i} className="p-6 h-full">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                <p className="text-secondary">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="py-16 lg:py-24 container">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-primary">Câu hỏi thường gặp</h2>
          <p className="text-secondary mt-2">Giải đáp thắc mắc trước khi đặt xe</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqs.map((faq, i) => ({
            id: `faq-${i}`,
            title: faq.q,
            content: faq.a,
          }))} />
        </div>
      </section>
      
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">Sẵn sàng cho chuyến đi đầu tiên?</h2>
          <p className="text-primary-light mb-8 max-w-2xl mx-auto">Đặt xe ngay hôm nay và trải nghiệm dịch vụ thuê xe tốt nhất Việt Nam.</p>
          <Link to="/search" className="btn btn-lg bg-white text-primary hover:bg-primary/5 px-8">Tìm xe ngay</Link>
        </div>
      </section>
    </div>
  );
}

function Info({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>;
}
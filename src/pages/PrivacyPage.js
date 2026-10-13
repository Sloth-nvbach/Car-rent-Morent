import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { FileText, ChevronRight, Shield, CheckCircle, AlertCircle, Database, Eye, Lock, User, Globe, Mail, Phone, Truck, CreditCard, Settings, Trash2, Calendar, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, Accordion } from '../ui/DataDisplay';

const lastUpdated = '01/01/2024';
const effectiveDate = '01/01/2024';

export function PrivacyPage() {
  const sections = [
    {
      title: '1. Cam kết bảo mật',
      content: `Morent (Công ty TNHH Morent) cam kết bảo vệ quyền riêng tư của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng, chia sẻ và bảo vệ thông tin cá nhân của bạn khi sử dụng website morent.vn và các dịch vụ liên quan.`,
    },
    {
      title: '2. Thông tin chúng tôi thu thập',
      content: `Chúng tôi thu thập các loại thông tin sau:
      • Thông tin nhận dạng: Họ tên, email, số điện thoại, CCCD/CMND, bằng lái xe, ảnh chân dung
      • Thông tin thanh toán: Số tài khoản ngân hàng, lịch sử giao dịch, hóa đơn
      • Thông tin sử dụng: Lịch sử tìm kiếm, xem xe, đặt xe, đánh giá, thiết bị, địa chỉ IP, cookie
      • Thông tin vị trí: Địa điểm nhận/trả xe (khi bạn cho phép)
      • Thông tin liên lạc: Tin nhắn, email, cuộc gọi với hỗ trợ`,
    },
    {
      title: '3. Cách chúng tôi sử dụng thông tin',
      content: `Thông tin được sử dụng cho:
      • Cung cấp, vận hành, cải thiện dịch vụ cho thuê xe
      • Xử lý đặt xe, thanh toán, giao nhận, hỗ trợ khách hàng
      • Gửi thông báo: xác nhận đơn, nhắc nhở, khuyến mãi (chỉ khi bạn đồng ý)
      • Phát hiện gian lận, bảo vệ an ninh, tuân thủ pháp luật
      • Phân tích xu hướng, cá nhân hóa trải nghiệm
      • Liên hệ tuyển dụng, đối tác (nếu bạn cung cấp)`,
    },
    {
      title: '4. Chia sẻ thông tin',
      content: `Chúng tôi KHÔNG bán thông tin cá nhân. Chỉ chia sẻ trong các trường hợp:
      • Với Nhà cung cấp xe: Thông tin cần thiết để thực hiện đơn đặt xe (tên, SĐT, địa điểm, thời gian)
      • Với đối tác thanh toán: VNPAY, MoMo, ZaloPay, ngân hàng (theo yêu cầu xử lý giao dịch)
      • Với đơn vị vận chuyển/cứu hộ: Khi có sự cố xe trên đường
      • Theo yêu cầu pháp luật: Cơ quan nhà nước, tòa án, cơ quan điều tra
      • Trong hợp nhất, mua lại công ty: Thông báo trước 30 ngày`,
    },
    {
      title: '5. Cookie & Công nghệ theo dõi',
      content: `Chúng tôi sử dụng cookie và công nghệ tương tự để:
      • Cookie bắt buộc: Hoạt động website, bảo mật, giỏ hàng, phiên đăng nhập
      • Cookie phân tích: Google Analytics, Mixpanel - hiểu hành vi người dùng
      • Cookie quảng cáo: Facebook Pixel, Google Ads - hiển thị quảng cáo liên quan
      • Bạn có thể tắt cookie trong cài đặt trình duyệt, nhưng một số tính năng có thể không hoạt động.`,
    },
    {
      title: '6. Bảo mật dữ liệu',
      content: `• Mã hóa TLS 1.2+ cho mọi truyền dữ liệu
      • Mã hóa AES-256 cho dữ liệu nhạy cảm tại rest
      • PCI DSS Level 1 cho xử lý thẻ tín dụng
      • Kiểm tra bảo mật định kỳ, pentest hàng năm
      • Quy trình ứng phó sự cố dữ liệu (72h báo cáo vi phạm)
      • Hạn chế truy cập: Chỉ nhân viên được ủy quyền mới xem dữ liệu`,
    },
    {
      title: '7. Quyền của bạn (Theo Luật Bảo vệ dữ liệu cá nhân Việt Nam)',
      content: `Bạn có quyền:
      • Truy cập: Yêu cầu bản sao dữ liệu chúng tôi giữ về bạn
      • Chỉnh sửa: Cập nhật thông tin sai sót, không chính xác
      • Xóa: Yêu cầu xóa dữ liệu (trừ khi pháp luật yêu cầu giữ lại)
      • Hạn chế xử lý: Yêu cầu ngưng xử lý một số mục đích
      • Chuyển dữ liệu: Nhận dữ liệu định dạng có cấu trúc, phổ biến
      • Phản đối: Từ chối xử lý cho marketing, profiling
      • Khiếu nại: Gửi khiếu nại đến Bộ Công Thương hoặc cơ quan chức năng
      • Gửi yêu cầu đến: privacy@morent.vn - Xử lý trong 30 ngày`,
    },
    {
      title: '8. Thời gian lưu giữ',
      content: `• Tài khoản hoạt động: Cho đến khi bạn xóa tài khoản
      • Lịch sử đặt xe, thanh toán: 10 năm (theo Luật Kế toán, Luật Thuế)
      • Tin nhắn hỗ trợ: 3 năm
      • Log truy cập, bảo mật: 12 tháng
      • Dữ liệu marketing (nếu đồng ý): Cho đến khi rút lại sự đồng ý
      • Sau thời hạn: Dữ liệu được ẩn danh hóa hoặc xóa vĩnh viễn`,
    },
    {
      title: '9. Thông tin trẻ em',
      content: `Dịch vụ của Morent không dành cho người dưới 18 tuổi. Chúng tôi không cố ý thu thập thông tin từ trẻ em. Nếu phát hiện, chúng tôi sẽ xóa ngay lập tức. Phụ huynh vui lòng liên hệ privacy@morent.vn nếu phát hiện con em cung cấp thông tin.`,
    },
    {
      title: '10. Truyền dữ liệu quốc tế',
      content: `Dữ liệu được lưu trữ tại trung tâm dữ liệu tại Việt Nam (Viettel IDC, FPT Telecom). Một số nhà cung cấp dịch vụ phụ trợ (AWS, Google Cloud, SendGrid) có thể xử lý dữ liệu tại Singapore, Mỹ. Chúng tôi đảm bảo các bảo vệ phù hợp theo chuẩn quốc tế (SCC, BCR).`,
    },
    {
      title: '11. Liên kết bên thứ ba',
      content: `Website có thể chứa liên kết đến website khác (Facebook, Google Maps, ngân hàng...). Chính sách này không áp dụng cho các trang đó. Vui lòng đọc chính sách riêng của họ.`,
    },
    {
      title: '12. Thay đổi chính sách',
      content: `Chúng tôi có thể cập nhật chính sách này. Phiên bản mới có hiệu lực ngay khi đăng tải. Thay đổi trọng yếu sẽ được thông báo qua email/đẩy notification trước 30 ngày. Việc tiếp tục sử dụng即视为 chấp nhận.`,
    },
    {
      title: '13. Liên hệ Cục bảo vệ dữ liệu (DPO)',
      content: `Mọi câu hỏi, yêu cầu hành使 quyền, khiếu nại về bảo mật:
      • Email: privacy@morent.vn
      • Địa chỉ: 123 Nguyễn Văn Linh, Quận 7, TP.HCM
      • Hotline: 1900 123 456 (chuyển tổng đài 3)
      • Thời gian phản hồi: Trong 30 ngày làm việc`,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container text-center">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <Shield className="w-3 h-3" /> Chính sách bảo mật
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Chính sách bảo mật Morent</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">Cập nhật lần cuối: {lastUpdated} · Có hiệu lực từ: {effectiveDate}</p>
        </div>
      </section>
      
      <div className="container py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary mb-2">Cam kết của Morent</p>
                <p className="text-secondary">Chúng tôi tôn trọng quyền riêng tư của bạn. Dữ liệu chỉ được dùng để cung cấp dịch vụ tốt hơn, không bao giờ được bán cho bên thứ ba nhằm mục đích thương mại.</p>
              </div>
            </div>
          </Card>
          
          <Accordion items={sections.map((s, i) => ({ id: `privacy-${i}`, title: s.title, content: s.content }))} />
          
          <div className="mt-12 pt-8 border-t border-border">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-primary mb-4">Tóm tắt quyền của bạn</h3>
              <div className="grid grid-2 md:grid-4 gap-4 text-sm">
                <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg"><CheckCircle className="w-5 h-5 text-success" /><span>Truy cập dữ liệu</span></div>
                <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg"><CheckCircle className="w-5 h-5 text-success" /><span>Chỉnh sửa/Xóa</span></div>
                <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg"><CheckCircle className="w-5 h-5 text-success" /><span>Hạn chế xử lý</span></div>
                <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg"><CheckCircle className="w-5 h-5 text-success" /><span>Chuyển dữ liệu</span></div>
                <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg"><CheckCircle className="w-5 h-5 text-success" /><span>Phản đối marketing</span></div>
                <div className="flex items-center gap-2 p-3 bg-bg-secondary rounded-lg"><CheckCircle className="w-5 h-5 text-success" /><span>Khiếu nại</span></div>
              </div>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-secondary mb-4">Câu hỏi về bảo mật? Liên hệ <a href="mailto:privacy@morent.vn" className="text-primary hover:underline">privacy@morent.vn</a></p>
            <Link to="/" className="btn btn-primary"><ChevronRight className="w-4 h-4 mr-2" />Quay lại trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
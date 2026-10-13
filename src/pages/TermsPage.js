import React from 'react';
import { Link } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { FileText, ChevronRight, Shield, CheckCircle, Clock, Truck, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, Accordion } from '../ui/DataDisplay';

const lastUpdated = '01/01/2024';
const effectiveDate = '01/01/2024';

export function TermsPage() {
  const sections = [
    {
      title: '1. Chấp nhận điều khoản',
      content: `Bằng cách truy cập và sử dụng website Morent (morent.vn) và dịch vụ liên quan, bạn đồng ý tuân thủ các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng dịch vụ của chúng tôi.`,
    },
    {
      title: '2. Mô tả dịch vụ',
      content: `Morent cung cấp nền tảng kết nối người cho thuê xe (Nhà cung cấp) với người thuê xe (Khách hàng). Chúng tôi không sở hữu xe, không là bên trong hợp đồng thuê xe giữa Khách hàng và Nhà cung cấp. Morent chỉ đóng vai trò trung gian công nghệ, hỗ trợ quy trình tìm kiếm, đặt xe, thanh toán và quản lý.`,
    },
    {
      title: '3. Điều kiện sử dụng',
      content: `Để sử dụng dịch vụ, bạn phải:
      • Trên 18 tuổi và có năng lực hành vi dân sự đầy đủ
      • Cung cấp thông tin chính xác, cập nhật khi đăng ký
      • Có CCCD/CMND hợp pháp, bằng lái xe phù hợp (hạng B1/B2 trở lên)
      • Không bị cấm sử dụng dịch vụ theo pháp luật hoặc quyết định của Morent
      • Tuân thủ luật giao thông đường bộ và các quy định liên quan`,
    },
    {
      title: '4. Đăng ký tài khoản',
      content: `Bạn chịu trách nhiệm bảo mật thông tin đăng nhập. Mọi hoạt động dưới tài khoản của bạn đều được coi là do bạn thực hiện. Thông báo ngay cho Morent nếu phát hiện truy cập trái phép. Morent có quyền khóa tài khoản vi phạm điều khoản.`,
    },
    {
      title: '5. Quy trình đặt xe',
      content: `• Khách hàng tìm kiếm, chọn xe, điền thông tin, thanh toán
      • Nhà cung cấp xác nhận trong 30 phút (giờ hành chính)
      • Sau khi xác nhận, đơn hàng chuyển sang trạng thái "Đã xác nhận"
      • Khách hàng nhận xe tại địa điểm, thời gian约定, kiểm tra xe, ký biên bản
      • Trả xe đúng hạn, kiểm tra lại, hoàn tất đơn hàng`,
    },
    {
      title: '6. Giá cả & Thanh toán',
      content: `• Giá hiển thị đã bao gồm thuế (nếu có), không bao gồm phí phát sinh (phạt giao thông, xăng, phí đỗ xe...)
      • Thanh toán: VNPAY, MoMo, ZaloPay, chuyển khoản, tiền mặt (tùy xe)
      • Đặt cọc: Theo chính sách của từng xe (thường 10-20% giá trị đơn)
      • Hóa đơn điện tử được gửi qua email sau khi thanh toán`,
    },
    {
      title: '7. Chính sách hủy & Đổi',
      content: `• Hủy trước 24h giờ nhận xe: Hoàn 100% tiền cọc
      • Hủy trong 24h: Trừ 50% tiền cọc
      • Hủy sau giờ nhận xe: Không hoàn tiền
      • Đổi xe/đổi ngày: Phụ thuộc vào sự sẵn có và sự đồng ý của Nhà cung cấp
      • Morent hỗ trợ xử lý tranh chấp, quyết định cuối cùng thuộc về Morent`,
    },
    {
      title: '8. Bảo hiểm & Trách nhiệm',
      content: `• Tất cả xe trên Morent có bảo hiểm toàn diện (tai nạn, hỏa hoạn, thiên tai, TNDS)
      • Mức bồi thường tối đa: 500 triệu đồng/sự cố
      • Khách hàng chịu trách nhiệm: Phạt giao thông, hư hỏng do chủ quan, mất chìa khóa, tài liệu xe
      • Nhà cung cấp chịu trách nhiệm: Sự cố kỹ thuật do bảo dưỡng không đúng, xe không đúng mô tả`,
    },
    {
      title: '9. Đánh giá & Nội dung người dùng',
      content: `• Khách hàng có thể đánh giá sau khi hoàn tất chuyến đi
      • Nội dung không được chứa: lời sỉ vả, kích động bạo lực, vi phạm pháp luật, spam, quảng cáo
      • Morent có quyền xóa, chỉnh sửa đánh giá vi phạm
      • Nhà cung cấp có quyền phản hồi đánh giá`,
    },
    {
      title: '10. Quyền sở hữu trí tuệ',
      content: `Mọi nội dung trên Morent (logo, hình ảnh, mã nguồn, thiết kế, thương hiệu) đều thuộc sở hữu của Morent hoặc được cấp phép. Không được sao chép, phân phối, sửa đổi tanpa sự cho phép bằng văn bản.`,
    },
    {
      title: '11. Hạn chế trách nhiệm',
      content: `Morent không chịu trách nhiệm về: Gián đoạn dịch vụ do bảo trì, thiên tai, sự cố kỹ thuật bên thứ ba; Thiệt hại gián tiếp, mất lợi nhuận, dữ liệu; Hành vi của Nhà cung cấp/Khách hàng vi phạm điều khoản.`,
    },
    {
      title: '12. Chấm dứt dịch vụ',
      content: `Morent có quyền tạm ngưng, chấm dứt tài khoản hoặc dịch vụ bất kỳ lúc nào do: Vi phạm điều khoản; Gian lận, gian dối; Yêu cầu của cơ quan nhà nước; Bảo vệ an ninh, an toàn người dùng.`,
    },
    {
      title: '13. Luật áp dụng & Giải quyết tranh chấp',
      content: `Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Tranh chấp được giải quyết qua thương lượng, điều giải tại Trung tâm Điều giải Thương mại Việt Nam (VIAC) hoặc Tòa án nhân dân có thẩm quyền.`,
    },
    {
      title: '14. Thay đổi điều khoản',
      content: `Morent có quyền cập nhật điều khoản bất kỳ lúc nào. Phiên bản mới có hiệu lực ngay khi đăng tải. Việc tiếp tục sử dụng dịch vụ sau thay đổi即视为 chấp nhận.`,
    },
    {
      title: '15. Liên hệ',
      content: `Mọi thắc mắc về Điều khoản, vui lòng liên hệ:
      • Email: legal@morent.vn
      • Địa chỉ: 123 Nguyễn Văn Linh, Quận 7, TP.HCM
      • Hotline: 1900 123 456`,
    },
  ];

  return (
    <div className="min-h-screen bg-bg-secondary">
      <section className="bg-gradient-to-b from-primary/5 via-white to-white py-16 lg:py-24">
        <div className="container text-center">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <FileText className="w-3 h-3" /> Điều khoản sử dụng
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-6">Điều khoản sử dụng Morent</h1>
          <p className="text-lg text-secondary max-w-2xl mx-auto">Cập nhật lần cuối: {lastUpdated} · Có hiệu lực từ: {effectiveDate}</p>
        </div>
      </section>
      
      <div className="container py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-8 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary mb-2">Lưu ý quan trọng</p>
                <p className="text-secondary">Vui lòng đọc kỹ điều khoản trước khi sử dụng dịch vụ. Việc đăng ký tài khoản và đặt xe即视为 bạn đã đọc, hiểu và đồng ý tuân thủ toàn bộ nội dung này.</p>
              </div>
            </div>
          </Card>
          
          <Accordion items={sections.map((s, i) => ({ id: `term-${i}`, title: s.title, content: s.content }))} />
          
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-secondary mb-4">Câu hỏi về điều khoản? Liên hệ <a href="mailto:legal@morent.vn" className="text-primary hover:underline">legal@morent.vn</a></p>
            <Link to="/" className="btn btn-primary"><ChevronRight className="w-4 h-4 mr-2" />Quay lại trang chủ</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
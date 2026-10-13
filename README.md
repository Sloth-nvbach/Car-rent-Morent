# Car rent Morent - Nền tảng cho thuê ô tô

Một website cho thuê ô tô hiện đại, chuyên nghiệp được xây dựng bằng React 18, React Router v6, với thiết kế responsive, accessibility (a11y) và trải nghiệm người dùng tối ưu.

## 🚀 Tính năng chính

### 🏠 Trang chủ (HomePage)
- Thanh tìm kiếm xe nổi bật với bộ lọc địa điểm, ngày giờ
- Xe nổi bật với card hiển thị hình ảnh, giá, đánh giá
- 4 yếu tố tạo niềm tin: Xe xác minh, Bảo hiểm toàn diện, Giao xe tận nơi, Hỗ trợ 24/7
- Quy trình thuê xe 6 bước trực quan
- Đối tác cung cấp xe uy tín
- Thống kê thực tế: 500+ xe, 50+ đối tác, 10,000+ khách hàng

### 🔍 Tìm kiếm xe (SearchPage)
- Bộ lọc nâng cao: Loại xe, hộp số, nhiên liệu, khoảng giá, tiện ích
- Sắp xếp: Khuyên dùng, giá thấp/cao, đánh giá, mới nhất
- Chế độ xem: Lưới (grid) / Danh sách (list)
- Phân trang
- Modal bộ lọc trên mobile
- URL params để chia sẻ link tìm kiếm

### 🚗 Chi tiết xe (CarDetailPage)
- Gallery hình ảnh với navigation
- Thông số kỹ thuật chi tiết
- Tiện ích & trang thiết bị
- Chính sách & đảm bảo
- Đánh giá khách hàng với phản hồi nhà cung cấp
- Modal đặt xe tích hợp với tính giá real-time
- Thông tin nhà cung cấp

### 💳 Đặt xe & Thanh toán (BookingPage)
- Quy trình 3 bước: Thông tin → Thanh toán → Xác nhận
- Validation form real-time
- 5 phương thức thanh toán: VNPAY, MoMo, ZaloPay, Chuyển khoản, Tiền mặt
- Tóm tắt đơn hàng sticky
- Tính giá tự động theo ngày/tuần/tháng
- Mã khuyến mãi (SUMMER20, WELCOME10, auto long-term)

### 👤 Tài khoản khách hàng (AccountPage)
- Tab: Đơn đặt xe, Đánh giá, Hồ sơ, Cài đặt
- Quản lý đơn hàng: Xem tiến trình, hủy đơn, chi tiết
- Đánh giá xe đã thuê
- Chỉnh sửa hồ sơ, bảo mật, 2FA
- Thông báo real-time

### 🏢 Bảng điều khiển Nhà cung cấp (ProviderDashboard)
- 9 tab: Tổng quan, Quản lý xe, Đơn đặt xe, Khách hàng, Thanh toán, Đánh giá, Hỗ trợ, Báo cáo, Cài đặt
- Thêm/sửa/xóa xe với form chi tiết
- Xử lý đơn hàng: Xác nhận, Từ chối, Bắt đầu, Hoàn tất
- Phản hồi đánh giá khách hàng
- Báo cáo doanh thu, tỷ lệ điền xe
- Cài đặt tài khoản ngân hàng, thông tin công ty

### ⚙️ Bảng điều khiển Quản trị (AdminDashboard)
- 9 tab: Tổng quan, Người dùng, Nhà cung cấp, Xe, Đơn hàng, Thanh toán, Hỗ trợ, Đánh giá, Cài đặt
- Quản lý người dùng: Thêm, sửa, xóa, phân quyền
- Duyệt nhà cung cấp, xe
- Theo dõi đơn hàng toàn hệ thống
- Quản lý ticket hỗ trợ
- Thống kê real-time

### 📄 Các trang thông tin
- **Cách thuê xe** (HowItWorksPage): 7 bước chi tiết, FAQ accordion
- **Ưu đãi** (OffersPage): 6 chương trình khuyến mãi, Morent Club 4 cấp độ
- **Hỗ trợ** (SupportPage): 4 kênh liên hệ, FAQ, Tạo ticket hỗ trợ
- **Về chúng tôi** (AboutPage): Stats, giá trị cốt lõi, hành trình, đội ngũ, chứng nhận
- **Liên hệ** (ContactPage): Form liên hệ, FAQ, Văn phòng, Điểm giao nhận xe
- **Điều khoản** (TermsPage): 15 điều khoản chi tiết
- **Bảo mật** (PrivacyPage): 13 mục tuân thủ Luật Bảo vệ dữ liệu cá nhân
- **Quên mật khẩu** (ForgotPasswordPage): 3 bước email → mã → mật khẩu mới
- **Đăng ký đối tác** (ProviderRegisterPage): 4 bước wizard

## 🛠 Công nghệ sử dụng

| Công nghệ | Phiên bản | Mô tả |
|-----------|-----------|-------|
| React | 18.2.0 | UI library |
| React Router | 6.20.0 | Routing SPA |
| React Scripts | 5.0.1 | Build tool (CRA) |
| date-fns | 2.30.0 | Xử lý ngày tháng |
| lucide-react | 0.294.0 | Icon SVG |
| CSS Variables | - | Design system (màu, spacing, typography) |

## 📁 Cấu trúc dự án

```
car-rent-morent/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.js          # Header với search, auth, notification
│   │   │   ├── Footer.js          # Footer đầy đủ
│   │   │   └── Layout.js          # MainLayout, AuthLayout, AdminLayout, ProviderLayout
│   │   └── ui/
│   │       ├── Button.js          # Button variants, sizes, loading
│   │       ├── Card.js            # Card, CarCard
│   │       ├── DataDisplay.js     # Badge, StatusBadge, Table, Pagination, Modal, Tab, Accordion, Rating, Avatar, Skeleton...
│   │       ├── Input.js           # Input, Textarea, Select, Checkbox, RadioGroup, InputGroup
│   │       └── Modal.js           # Modal, ConfirmDialog, Toast, ToastContainer
│   ├── context/
│   │   ├── AuthContext.js         # Authentication state, login/register/logout
│   │   ├── BookingContext.js      # Booking CRUD, price calculation, availability
│   │   └── NotificationContext.js # Toast, in-app notifications
│   ├── data/
│   │   └── mockData.js            # 8 xe, 5 nhà cung cấp, 2 user, 4 booking, 3 review, ticket, notifications
│   ├── hooks/
│   │   └── useIndex.js            # useMediaQuery, useLocalStorage, useDebounce, useForm, useAsync...
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── SearchPage.js
│   │   ├── CarDetailPage.js
│   │   ├── BookingPage.js
│   │   ├── AccountPage.js
│   │   ├── ProviderDashboard.js
│   │   ├── AdminDashboard.js
│   │   ├── LoginPage.js
│   │   ├── RegisterPage.js
│   │   ├── ForgotPasswordPage.js
│   │   ├── HowItWorksPage.js
│   │   ├── OffersPage.js
│   │   ├── SupportPage.js
│   │   ├── ProviderDetailPage.js
│   │   ├── BookingDetailPage.js
│   │   ├── ProviderRegisterPage.js
│   │   ├── TermsPage.js
│   │   ├── PrivacyPage.js
│   │   ├── AboutPage.js
│   │   └── ContactPage.js
│   ├── styles/
│   │   └── index.css              # Design system CSS variables, utilities, components
│   ├── utils/
│   │   └── helpers.js             # formatCurrency, formatDate, validation, debounce...
│   ├── App.js                     # Routes với ProtectedRoute, lazy loading
│   └── index.js                   # Entry point với Providers
├── package.json
└── README.md
```

## 🎨 Design System

### Màu sắc (CSS Variables)
```css
--color-primary: #1a56db;        /* Primary blue */
--color-success: #10b981;        /* Green */
--color-warning: #f59e0b;        /* Amber */
--color-error: #ef4444;          /* Red */
--color-info: #3b82f6;           /* Blue */
--color-bg: #ffffff;             /* Background */
--color-surface: #ffffff;        /* Card surface */
--color-text-primary: #0f172a;   /* Primary text */
--color-text-secondary: #475569; /* Secondary text */
```

### Typography
- Font: Inter (Google Fonts)
- Scale: xs(0.75rem) → sm(0.875rem) → base(1rem) → lg(1.125rem) → xl(1.25rem) → 2xl(1.5rem) → 3xl(1.875rem) → 4xl(2.25rem) → 5xl(3rem)

### Spacing
- Scale: 1(0.25rem) → 2(0.5rem) → 3(0.75rem) → 4(1rem) → 5(1.25rem) → 6(1.5rem) → 8(2rem) → 10(2.5rem) → 12(3rem) → 16(4rem) → 20(5rem)

### Border Radius
- sm(4px) → md(8px) → lg(12px) → xl(16px) → full(9999px)

### Shadows
- sm → md → lg → xl

### Dark Mode
Tự động theo `prefers-color-scheme: dark`

## ♿ Accessibility (a11y)

- Semantic HTML5 (header, main, nav, aside, footer, section, article)
- ARIA labels, roles, attributes
- Keyboard navigation (Tab, Enter, Escape, Arrow keys)
- Focus management (skip link, modal trap, focus restore)
- Color contrast WCAG AA
- Screen reader support (sr-only, live regions)
- Reduced motion support

## 📱 Responsive Breakpoints

| Breakpoint | Width | Columns |
|------------|-------|---------|
| Mobile | < 640px | 1 |
| Tablet | 640px - 1023px | 2 |
| Desktop | 1024px - 1279px | 3-4 |
| Large | ≥ 1280px | 4-6 |

## 🔐 Authentication & Authorization

### 3 Roles
- **Customer** (Khách hàng): Tìm xe, đặt xe, quản lý đơn, đánh giá
- **Provider** (Nhà cung cấp): Quản lý xe, đơn hàng, khách hàng, báo cáo
- **Admin** (Quản trị): Quản trị toàn hệ thống

### Protected Routes
```jsx
<ProtectedRoute allowedRoles={['customer']}>  // Customer only
<ProtectedRoute allowedRoles={['provider', 'admin']}>  // Provider + Admin
<ProtectedRoute allowedRoles={['admin']}>  // Admin only
```

## 📦 Dữ liệu mẫu (mockData.js)

- **8 xe**: VinFast VF8, Toyota Camry Hybrid, Kia Carnival, Mazda CX-5, Mercedes C200, Hyundai Accent, Toyota Fortuner, VinFast VF e34
- **5 nhà cung cấp**: Morent Auto HN, Morent Auto ĐN, Morent Premium, Morent Budget NT, Morent Electric CT
- **2 users**: Nguyễn Văn An, Trần Thị Bình
- **4 booking**: confirmed, pending, completed, cancelled
- **3 reviews**: Với phản hồi nhà cung cấp
- **1 support ticket**: Với timeline messages
- **4 notifications**: booking_confirmed, payment_success, reminder, promo

## 🚀 Cài đặt & Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Build production
npm run build

# Chạy test
npm test
```

### Yêu cầu
- Node.js 16+
- npm 8+

## 🌐 Deployment

### Vercel/Netlify
```bash
npm run build
# Deploy thư mục build/
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
```

## 🔧 Tùy biến

### Thêm loại xe mới
1. Cập nhật `carTypes` trong `mockData.js`
2. Thêm icon mapping trong `CarDetailPage.js` và `ProviderDashboard.js`

### Thêm phương thức thanh toán
1. Cập nhật `PAYMENT_METHODS` trong `BookingPage.js`
2. Xử lý logic trong `handleSubmit`

### Thêm trường form
1. Cập nhật `formData` state
2. Thêm validation trong `validateStep`
3. Render Input component

## 📝 License

MIT License - Xem file LICENSE để biết chi tiết.

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/tinh-nang-moi`)
3. Commit changes (`git commit -am 'Thêm tính năng mới'`)
4. Push branch (`git push origin feature/tinh-nang-moi`)
5. Tạo Pull Request

## 📞 Hỗ trợ

- Email: support@morent.vn
- Hotline: 1900 123 456
- GitHub Issues: Tạo issue trên repository

---

**Car rent Morent** - Nền tảng cho thuê ô tô hàng đầu Việt Nam 🇻🇳
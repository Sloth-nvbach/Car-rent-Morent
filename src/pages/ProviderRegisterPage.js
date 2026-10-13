import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { classNames } from '../utils/helpers';
import { Car, Building, Mail, Phone, MapPin, Shield, CheckCircle, Loader2, ArrowLeft, User, CreditCard } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input, Select, Textarea, Checkbox } from '../ui/Input';
import { Badge, Card, StepIndicator } from '../ui/DataDisplay';
import { useNotification } from '../context/NotificationContext';

const STEPS = [
  { id: 'info', label: 'Thông tin cơ bản' },
  { id: 'cars', label: 'Đội xe' },
  { id: 'bank', label: 'Tài khoản ngân hàng' },
  { id: 'verify', label: 'Xác thực' },
];

const carTypes = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'mpv', label: 'MPV' },
  { value: 'luxury', label: 'Xe sang' },
  { value: 'electric', label: 'Xe điện' },
];

const cities = [
  { value: 'hn', label: 'Hà Nội' },
  { value: 'hcm', label: 'TP. Hồ Chí Minh' },
  { value: 'dn', label: 'Đà Nẵng' },
  { value: 'nt', label: 'Nha Trang' },
  { value: 'hp', label: 'Hải Phòng' },
  { value: 'ct', label: 'Cần Thơ' },
];

export function ProviderRegisterPage() {
  const navigate = useNavigate();
  const { success, error: showError } = useNotification();
  
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    taxCode: '',
    representativeName: '',
    representativePhone: '',
    email: '',
    phone: '',
    address: '',
    city: 'hn',
    description: '',
    website: '',
    cars: [],
    bankName: '',
    bankAccount: '',
    accountHolder: '',
    bankBranch: '',
    documents: {
      businessLicense: '',
      idCardFront: '',
      idCardBack: '',
      insurance: '',
    },
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.companyName.trim()) newErrors.companyName = 'Tên công ty không được để trống';
      if (!formData.taxCode.trim()) newErrors.taxCode = 'Mã số thuế không được để trống';
      else if (!/^[0-9]{10}-[0-9]{3}$/.test(formData.taxCode)) newErrors.taxCode = 'Mã số thuế không hợp lệ (VD: 0123456789-001)';
      if (!formData.representativeName.trim()) newErrors.representativeName = 'Tên đại diện không được để trống';
      if (!formData.representativePhone.trim()) newErrors.representativePhone = 'SĐT đại diện không được để trống';
      else if (!/^(0|\+84)[3|5|7|8|9][0-9]{8}$/.test(formData.representativePhone.replace(/\s/g, ''))) newErrors.representativePhone = 'SĐT không hợp lệ';
      if (!formData.email.trim()) newErrors.email = 'Email không được để trống';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
      if (!formData.phone.trim()) newErrors.phone = 'SĐT công ty không được để trống';
      if (!formData.address.trim()) newErrors.address = 'Địa chỉ không được để trống';
    }
    
    if (step === 1) {
      if (formData.cars.length === 0) newErrors.cars = 'Vui lòng thêm ít nhất 1 xe';
      formData.cars.forEach((car, i) => {
        if (!car.name) newErrors[`car_${i}_name`] = 'Tên xe không được để trống';
        if (!car.brand) newErrors[`car_${i}_brand`] = 'Hãng xe không được để trống';
        if (!car.pricePerDay) newErrors[`car_${i}_price`] = 'Giá thuê không được để trống';
      });
    }
    
    if (step === 2) {
      if (!formData.bankName.trim()) newErrors.bankName = 'Tên ngân hàng không được để trống';
      if (!formData.bankAccount.trim()) newErrors.bankAccount = 'Số tài khoản không được để trống';
      if (!formData.accountHolder.trim()) newErrors.accountHolder = 'Chủ tài khoản không được để trống';
      if (!formData.bankBranch.trim()) newErrors.bankBranch = 'Chi nhánh không được để trống';
    }
    
    if (step === 3) {
      if (!formData.agreeTerms) newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep()) setStep(s => Math.min(s + 1, STEPS.length - 1));
  };
  
  const handleBack = () => setStep(s => Math.max(s - 1, 0));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    
    setLoading(true);
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    
    success('Đăng ký thành công!', 'Hồ sơ của bạn đang được xem duyệt. Chúng tôi sẽ liên hệ trong 24h.');
    navigate('/provider');
  };
  
  const addCar = () => {
    setFormData(prev => ({
      ...prev,
      cars: [...prev.cars, { name: '', brand: '', model: '', year: new Date().getFullYear(), type: 'sedan', transmission: 'auto', fuel: 'gasoline', seats: 5, doors: 4, pricePerDay: 0, pricePerWeek: 0, pricePerMonth: 0, features: [], policies: ['cancel_free', 'insurance', 'roadside'], description: '' }]
    }));
  };
  
  const removeCar = (index) => {
    setFormData(prev => ({ ...prev, cars: prev.cars.filter((_, i) => i !== index) }));
  };
  
  const updateCar = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      cars: prev.cars.map((car, i) => i === index ? { ...car, [field]: value } : car)
    }));
  };
  
  return (
    <div className="min-h-screen bg-bg-secondary">
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bold text-xl mb-6">
              <Car className="w-8 h-8" /> <span>Morent</span>
            </Link>
            <button className="absolute left-0 top-0 p-2 text-tertiary hover:text-primary" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary">Đăng ký trở thành đối tác Morent</h1>
            <p className="text-secondary mt-2">Tham gia mạng lưới cho thuê xe lớn nhất Việt Nam</p>
          </div>
          
          <StepIndicator steps={STEPS} currentStep={step} className="mb-8" />
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 0 && (
              <Card className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-primary">Thông tin công ty</h3>
                <div className="grid grid-2 gap-4">
                  <Input label="Tên công ty *" name="companyName" value={formData.companyName} onChange={handleChange} error={errors.companyName} required placeholder="CÔNG TY TNHH MORENT AUTO" />
                  <Input label="Mã số thuế *" name="taxCode" value={formData.taxCode} onChange={handleChange} error={errors.taxCode} required placeholder="0123456789-001" />
                </div>
                <div className="grid grid-2 gap-4">
                  <Input label="Tên đại diện *" name="representativeName" value={formData.representativeName} onChange={handleChange} error={errors.representativeName} required placeholder="Nguyễn Văn An" />
                  <Input label="SĐT đại diện *" type="tel" name="representativePhone" value={formData.representativePhone} onChange={handleChange} error={errors.representativePhone} required placeholder="09xxxxxxxx" />
                </div>
                <div className="grid grid-2 gap-4">
                  <Input label="Email công ty *" type="email" name="email" value={formData.email} onChange={handleChange} error={errors.email} required placeholder="contact@morentauto.vn" />
                  <Input label="SĐT công ty *" type="tel" name="phone" value={formData.phone} onChange={handleChange} error={errors.phone} required placeholder="024 3974 1234" />
                </div>
                <Select label="Tỉnh/Thành phố *" name="city" value={formData.city} onChange={handleChange} options={cities} required />
                <Input label="Địa chỉ chi tiết *" name="address" value={formData.address} onChange={handleChange} error={errors.address} required placeholder="789 Láng Hạ, Đống Đa, Hà Nội" />
                <Textarea label="Mô tả công ty" name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Giới thiệu về công ty, kinh nghiệm, điểm mạnh..." />
                <Input label="Website (nếu có)" type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://morentauto.vn" />
              </Card>
            )}
            
            {step === 1 && (
              <Card className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-primary">Đội xe của bạn</h3>
                  <Button variant="outline" size="sm" type="button" onClick={addCar}><Plus className="w-4 h-4 mr-1" />Thêm xe</Button>
                </div>
                
                {formData.cars.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="w-16 h-16 text-tertiary mx-auto mb-4" />
                    <p className="text-secondary mb-4">Chưa có xe nào. Thêm xe đầu tiên để bắt đầu.</p>
                    <Button type="button" onClick={addCar}><Plus className="w-4 h-4 mr-2" />Thêm xe đầu tiên</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.cars.map((car, index) => (
                      <div key={index} className="border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-primary">Xe #{index + 1}</h4>
                          <Button variant="ghost" size="sm" variant="danger" type="button" onClick={() => removeCar(index)}><Trash2 className="w-4 h-4" /></Button>
                        </div>
                        <div className="grid grid-2 gap-4">
                          <Input label="Tên xe *" name="name" value={car.name} onChange={(e) => updateCar(index, 'name', e.target.value)} error={errors[`car_${index}_name`]} required placeholder="VinFast VF 8" />
                          <Input label="Hãng xe *" name="brand" value={car.brand} onChange={(e) => updateCar(index, 'brand', e.target.value)} required placeholder="VinFast" />
                        </div>
                        <div className="grid grid-3 gap-4">
                          <Input label="Dòng xe *" name="model" value={car.model} onChange={(e) => updateCar(index, 'model', e.target.value)} required placeholder="VF 8" />
                          <Input label="Năm *" type="number" name="year" value={car.year} onChange={(e) => updateCar(index, 'year', e.target.value)} min={2015} max={new Date().getFullYear()} required />
                          <Select name="type" label="Loại xe *" value={car.type} onChange={(e) => updateCar(index, 'type', e.target.value)} options={carTypes} required />
                        </div>
                        <div className="grid grid-3 gap-4">
                          <Select name="transmission" label="Hộp số *" value={car.transmission} onChange={(e) => updateCar(index, 'transmission', e.target.value)} options={[{value:'auto',label:'Tự động'},{value:'manual',label:'Số sàn'}]} required />
                          <Select name="fuel" label="Nhiên liệu *" value={car.fuel} onChange={(e) => updateCar(index, 'fuel', e.target.value)} options={[{value:'gasoline',label:'Xăng'},{value:'diesel',label:'Dầu'},{value:'electric',label:'Điện'},{value:'hybrid',label:'Hybrid'}]} required />
                          <Input label="Số chỗ *" type="number" name="seats" value={car.seats} onChange={(e) => updateCar(index, 'seats', parseInt(e.target.value) || 0)} min={2} max={12} required />
                        </div>
                        <div className="grid grid-3 gap-4">
                          <Input label="Giá/ngày (VNĐ) *" type="number" name="pricePerDay" value={car.pricePerDay} onChange={(e) => updateCar(index, 'pricePerDay', parseInt(e.target.value) || 0)} step={10000} required error={errors[`car_${index}_price`]} />
                          <Input label="Giá/tuần (VNĐ) *" type="number" name="pricePerWeek" value={car.pricePerWeek} onChange={(e) => updateCar(index, 'pricePerWeek', parseInt(e.target.value) || 0)} step={10000} required />
                          <Input label="Giá/tháng (VNĐ) *" type="number" name="pricePerMonth" value={car.pricePerMonth} onChange={(e) => updateCar(index, 'pricePerMonth', parseInt(e.target.value) || 0)} step={10000} required />
                        </div>
                        <Textarea label="Mô tả xe" name="description" value={car.description} onChange={(e) => updateCar(index, 'description', e.target.value)} rows={2} placeholder="Đặc điểm nổi bật, điều kiện sử dụng..." />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
            
            {step === 2 && (
              <Card className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-primary">Tài khoản ngân hàng nhận thanh toán</h3>
                <div className="grid grid-2 gap-4">
                  <Input label="Ngân hàng *" name="bankName" value={formData.bankName} onChange={handleChange} error={errors.bankName} required placeholder="Ví dụ: Vietcombank, BIDV, Techcombank..." />
                  <Input label="Số tài khoản *" name="bankAccount" value={formData.bankAccount} onChange={handleChange} error={errors.bankAccount} required placeholder="1234567890" />
                </div>
                <div className="grid grid-2 gap-4">
                  <Input label="Chủ tài khoản *" name="accountHolder" value={formData.accountHolder} onChange={handleChange} error={errors.accountHolder} required placeholder="CÔNG TY TNHH MORENT AUTO" />
                  <Input label="Chi nhánh *" name="bankBranch" value={formData.bankBranch} onChange={handleChange} error={errors.bankBranch} required placeholder="Chi nhánh TP.HCM" />
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <p className="font-medium text-primary mb-2">Lưu ý:</p>
                  <ul className="list-disc list-inside text-sm text-secondary space-y-1">
                    <li>Tài khoản phải trùng tên với tên công ty/đại diện pháp luật</li>
                    <li>Thanh toán sẽ được chuyển vào tài khoản này sau mỗi chuyến đi hoàn tất</li>
                    <li>Chu kỳ thanh toán: Hàng tuần (thứ 3 hàng tuần)</li>
                  </ul>
                </div>
              </Card>
            )}
            
            {step === 3 && (
              <Card className="p-6 space-y-6">
                <h3 className="text-xl font-bold text-primary">Xác thực & Hoàn tất</h3>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-primary">Giấy tờ cần thiết</h4>
                  <div className="grid grid-2 gap-4">
                    <DocumentUpload label="Giấy phép kinh doanh" name="businessLicense" value={formData.documents.businessLicense} onChange={(e) => setFormData(d => ({ ...d, documents: { ...d.documents, businessLicense: e.target.value }))} />
                    <DocumentUpload label="CCCD mặt trước" name="idCardFront" value={formData.documents.idCardFront} onChange={(e) => setFormData(d => ({ ...d, documents: { ...d.documents, idCardFront: e.target.value }))} />
                    <DocumentUpload label="CCCD mặt sau" name="idCardBack" value={formData.documents.idCardBack} onChange={(e) => setFormData(d => ({ ...d, documents: { ...d.documents, idCardBack: e.target.value }))} />
                    <DocumentUpload label="Bảo hiểm xe" name="insurance" value={formData.documents.insurance} onChange={(e) => setFormData(d => ({ ...d, documents: { ...d.documents, insurance: e.target.value }))} />
                  </div>
                </div>
                
                <div className="p-4 bg-bg-secondary rounded-lg">
                  <h4 className="font-medium text-primary mb-2">Quy trình sau khi đăng ký</h4>
                  <ol className="list-decimal list-inside text-sm text-secondary space-y-1">
                    <li>Morent kiểm tra hồ sơ trong 24h làm việc</li>
                    <li>Liên hệ xác thực thông qua điện thoại/email</li>
                    <li>Ký hợp đồng điện tử</li>
                    <li>Cấu hình tài khoản, đào tạo sử dụng hệ thống</li>
                    <li>Kích hoạt tài khoản, bắt đầu đăng xe</li>
                  </ol>
                </div>
                
                <Checkbox
                  label="Tôi đồng ý với Điều khoản hợp tác đối tác và Chính sách bảo mật của Morent"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData(d => ({ ...d, agreeTerms: e.target.checked }))}
                  error={errors.agreeTerms}
                  required
                />
              </Card>
            )}
            
            <div className="flex justify-between">
              {step > 0 && <Button variant="secondary" type="button" onClick={handleBack}>Quay lại</Button>}
              {step < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>Tiếp theo</Button>
              ) : (
                <Button type="submit" loading={loading} size="lg">Hoàn tất đăng ký</Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function handleChange(e) {
  const { name, value, type, checked } = e.target;
  setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
}

function DocumentUpload({ label, name, value, onChange }) {
  return (
    <div className="relative">
      <label className="input-label">{label}</label>
      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition">
        <input type="file" accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onChange} />
        <Upload className="w-10 h-10 text-tertiary mx-auto mb-2" />
        <p className="text-sm text-secondary">Kéo thả hoặc nhấn để tải lên</p>
        <p className="text-xs text-tertiary mt-1">JPG, PNG, PDF · Tối đa 5MB</p>
        {value && <p className="text-sm text-success mt-2">Đã tải lên: {value}</p>}
      </div>
    </div>
  );
}

function Plus({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}

function Trash2({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
}

function Upload({ children, ...props }) {
  return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>;
}
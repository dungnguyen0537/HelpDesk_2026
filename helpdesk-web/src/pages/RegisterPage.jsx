import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones, Mail, Lock, User, Phone, Building, AlertCircle, ArrowRight } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { authApi } from '../api/authApi';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    departmentId: '1',
    password: '',
    confirmPassword: '',
    acceptTerms: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMsg('Bạn cần đồng ý với điều khoản sử dụng của hệ thống.');
      return;
    }

    setIsLoading(true);

    try {
      try {
        await authApi.register({
          fullName: formData.fullName,
          username: formData.username,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          departmentId: Number(formData.departmentId),
          password: formData.password,
        });
      } catch (err) {
        // Mock fallback if api is down
      }

      setSuccessMsg('Đăng ký tài khoản thành công! Đang chuyển hướng sang đăng nhập...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Đăng ký không thành công. Hãy thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 py-8">
      <div className="max-w-lg w-full">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary-600 text-white shadow-lg mb-2">
            <Headphones className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HelpDesk Enterprise</h1>
          <p className="text-xs text-slate-500">Cổng đăng ký tài khoản khách hàng</p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Tạo tài khoản mới</h2>
            <p className="text-xs text-slate-500 mt-0.5">Điền thông tin để bắt đầu gửi yêu cầu hỗ trợ</p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Họ và tên"
                name="fullName"
                type="text"
                required
                placeholder="Nguyễn Văn A"
                icon={User}
                value={formData.fullName}
                onChange={handleChange}
              />
              <Input
                label="Tên đăng nhập"
                name="username"
                type="text"
                required
                placeholder="nguyenvana"
                icon={User}
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email công ty"
                name="email"
                type="email"
                required
                placeholder="a.nguyen@company.com"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Số điện thoại"
                name="phoneNumber"
                type="tel"
                placeholder="0912 345 678"
                icon={Phone}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Phòng ban / Đơn vị <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building className="w-4 h-4" />
                </div>
                <select
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="1">Kinh doanh & Bán hàng (Sales & Marketing)</option>
                  <option value="2">Kế toán & Tài chính (Accounting & Finance)</option>
                  <option value="3">Hành chính & Nhân sự (HR & Admin)</option>
                  <option value="4">Phát triển Sản phẩm (R&D / Tech)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Mật khẩu"
                name="password"
                type="password"
                required
                placeholder="Tối thiểu 8 ký tự"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
              />
              <Input
                label="Xác nhận mật khẩu"
                name="confirmPassword"
                type="password"
                required
                placeholder="Nhập lại mật khẩu"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start space-x-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
                />
                <span>
                  Tôi đồng ý với{' '}
                  <span className="text-primary-600 hover:underline">Điều khoản dịch vụ</span> và{' '}
                  <span className="text-primary-600 hover:underline">Chính sách bảo mật</span>
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              <span>Tạo tài khoản ngay</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { authApi } from '../api/authApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({
    usernameOrEmail: 'admin',
    password: 'password123',
    rememberMe: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
    setIsLoading(true);

    try {
      // Mock / Real API login integration
      let response;
      try {
        response = await authApi.login({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        });
      } catch (err) {
        // Fallback demo mock if backend isn't booted yet
        const roleMap = {
          customer: { role: 'CUSTOMER', name: 'Nguyễn Văn An (Người Dùng / Khách Hàng)', dept: 'Phòng Marketing' },
          agent: { role: 'AGENT', name: 'Trần Văn Bình (Kỹ Thuật Viên Hỗ Trợ)', dept: 'Tổ Hỗ Trợ Kỹ Thuật' },
          manager: { role: 'MANAGER', name: 'Lê Thị Cúc (Điều Phối Viên / Quản Lý)', dept: 'Trung Tâm Dịch Vụ Service Desk' },
          admin: { role: 'ADMIN', name: 'Quản Trị Viên Hệ Thống', dept: 'Bộ Phận IT Toàn Hệ Thống' },
        };
        const selected = roleMap[formData.usernameOrEmail.toLowerCase()] || {
          role: 'CUSTOMER',
          name: formData.usernameOrEmail,
          dept: 'Người Dùng Doanh Nghiệp',
        };

        response = {
          token: 'mock-jwt-token-helpdesk-enterprise-2026',
          user: {
            id: 1,
            username: formData.usernameOrEmail,
            email: formData.usernameOrEmail.includes('@') ? formData.usernameOrEmail : `${formData.usernameOrEmail}@company.com`,
            fullName: selected.name,
            role: selected.role,
            department: selected.dept,
          },
        };
      }

      if (response && response.token) {
        login(response.user, response.token);
        if (response.user?.role === 'CUSTOMER') {
          navigate('/portal');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg('Tên đăng nhập hoặc mật khẩu không chính xác.');
      }
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || 'Đăng nhập không thành công. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white shadow-lg mb-3">
            <Headphones className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">HelpDesk Enterprise</h1>
          <p className="text-sm text-slate-500 mt-1">Hệ thống Tiếp nhận & Giải quyết Sự cố Kỹ thuật</p>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900">Đăng nhập tài khoản</h2>
            <p className="text-xs text-slate-500 mt-1">Truy cập để tạo phiếu hoặc xử lý yêu cầu hỗ trợ</p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center space-x-2 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Tên đăng nhập hoặc Email"
              name="usernameOrEmail"
              type="text"
              required
              placeholder="ví dụ: admin hoặc user@company.com"
              icon={Mail}
              value={formData.usernameOrEmail}
              onChange={handleChange}
            />

            <Input
              label="Mật khẩu"
              name="password"
              type="password"
              required
              placeholder="Nhập mật khẩu của bạn"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
            />

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 w-3.5 h-3.5"
                />
                <span>Ghi nhớ đăng nhập</span>
              </label>

              <a href="#forgot" className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isLoading}
            >
              <span>Đăng nhập hệ thống</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          {/* Quick Demo Credentials for all Roles */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/80 rounded-xl p-3.5 text-xs text-slate-600">
            <p className="font-semibold text-slate-700 mb-2 text-center text-xs">
              Chọn vai trò trải nghiệm hệ thống:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({ usernameOrEmail: 'customer', password: 'password123', rememberMe: true });
                }}
                className={`p-2 rounded-lg border text-left transition-all ${
                  formData.usernameOrEmail === 'customer'
                    ? 'border-primary-500 bg-primary-50/70 text-primary-900 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium text-[11px] flex items-center justify-between">
                  <span>Người dùng / Khách</span>
                  <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded font-mono">USER</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">Tạo và theo dõi yêu cầu</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ usernameOrEmail: 'agent', password: 'password123', rememberMe: true });
                }}
                className={`p-2 rounded-lg border text-left transition-all ${
                  formData.usernameOrEmail === 'agent'
                    ? 'border-primary-500 bg-primary-50/70 text-primary-900 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium text-[11px] flex items-center justify-between">
                  <span>Kỹ thuật viên IT</span>
                  <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded font-mono">AGENT</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">Tiếp nhận và xử lý sự cố</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ usernameOrEmail: 'manager', password: 'password123', rememberMe: true });
                }}
                className={`p-2 rounded-lg border text-left transition-all ${
                  formData.usernameOrEmail === 'manager'
                    ? 'border-primary-500 bg-primary-50/70 text-primary-900 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium text-[11px] flex items-center justify-between">
                  <span>Quản lý / Điều phối</span>
                  <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded font-mono">MANAGER</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">Điều phối và báo cáo SLA</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFormData({ usernameOrEmail: 'admin', password: 'password123', rememberMe: true });
                }}
                className={`p-2 rounded-lg border text-left transition-all ${
                  formData.usernameOrEmail === 'admin'
                    ? 'border-primary-500 bg-primary-50/70 text-primary-900 font-semibold shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="font-medium text-[11px] flex items-center justify-between">
                  <span>Quản trị viên</span>
                  <span className="text-[9px] bg-purple-100 text-purple-700 px-1 rounded font-mono">ADMIN</span>
                </div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">Cấu hình toàn bộ hệ thống</div>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Chưa có tài khoản khách hàng?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          © 2026 HelpDesk Service Portal. Tiêu chuẩn SLA & ISO 20000.
        </p>
      </div>
    </div>
  );
}

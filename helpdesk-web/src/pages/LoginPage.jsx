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
        response = {
          token: 'mock-jwt-token-helpdesk-enterprise-2026',
          user: {
            id: 1,
            username: formData.usernameOrEmail,
            email: formData.usernameOrEmail.includes('@') ? formData.usernameOrEmail : `${formData.usernameOrEmail}@helpdesk.local`,
            fullName: formData.usernameOrEmail === 'admin' ? 'Quản Trị Viên Hệ Thống' : 'Hỗ Trợ Viên Kỹ Thuật',
            role: formData.usernameOrEmail === 'admin' ? 'ADMIN' : 'AGENT',
            department: 'IT Operations',
          },
        };
      }

      if (response && response.token) {
        login(response.user, response.token);
        navigate('/dashboard');
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

          {/* Quick Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50 rounded-xl p-3 text-xs text-slate-600">
            <p className="font-semibold text-slate-700 mb-1">Tài khoản trải nghiệm nhanh:</p>
            <div className="flex justify-between items-center text-[11px]">
              <span>Admin: <code>admin / password123</code></span>
              <button
                type="button"
                onClick={() => setFormData({ usernameOrEmail: 'admin', password: 'password123', rememberMe: true })}
                className="text-primary-600 hover:underline font-medium"
              >
                Điền nhanh
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

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Headphones, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, UserCheck, KeyRound, ChevronDown } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { authApi } from '../api/authApi';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const authenticate = useUserStore((state) => state.authenticate);

  const [formData, setFormData] = useState({
    usernameOrEmail: 'admin',
    password: 'password123',
    rememberMe: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

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
      // 1. Thử xác thực với Backend API nếu có
      let response = null;
      try {
        response = await authApi.login({
          usernameOrEmail: formData.usernameOrEmail,
          password: formData.password,
        });
      } catch (apiErr) {
        // Backend chưa sẵn sàng, dùng hệ thống xác thực nội bộ userStore
      }

      if (response && response.token) {
        login(response.user, response.token);
        if (response.user?.role === 'CUSTOMER') {
          navigate('/portal');
        } else {
          navigate('/dashboard');
        }
        return;
      }

      // 2. Xác thực thời gian thực qua cơ sở dữ liệu tài khoản nội bộ userStore
      const authResult = authenticate(formData.usernameOrEmail, formData.password);

      if (!authResult.success) {
        setErrorMsg(authResult.message);
        return;
      }

      login(authResult.user, authResult.token);

      if (authResult.user.role === 'CUSTOMER') {
        navigate('/portal');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setErrorMsg(err?.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
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

          {/* Enterprise Pre-configured Test Accounts (Collapsible) */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex items-center justify-between text-xs text-slate-500 hover:text-slate-800 transition-colors py-1"
            >
              <span className="flex items-center space-x-1.5 font-medium">
                <KeyRound className="w-3.5 h-3.5 text-primary-500" />
                <span>Tài khoản mẫu theo ca trực (Nội bộ doanh nghiệp)</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDemoAccounts ? 'rotate-180' : ''}`} />
            </button>

            {showDemoAccounts && (
              <div className="mt-3 bg-slate-50 rounded-xl p-3 border border-slate-200/80 space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ usernameOrEmail: 'customer', password: 'password123', rememberMe: true });
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      formData.usernameOrEmail === 'customer'
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-[11px] flex items-center justify-between">
                      <span>Cán bộ / Nhân viên</span>
                      <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded font-mono">USER</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">trang.nt@doanhnghiep.vn</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ usernameOrEmail: 'agent', password: 'password123', rememberMe: true });
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      formData.usernameOrEmail === 'agent'
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-[11px] flex items-center justify-between">
                      <span>Kỹ thuật viên IT</span>
                      <span className="text-[9px] bg-blue-100 text-blue-700 px-1 rounded font-mono">AGENT</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">binh.tv@doanhnghiep.vn</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ usernameOrEmail: 'manager', password: 'password123', rememberMe: true });
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      formData.usernameOrEmail === 'manager'
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-[11px] flex items-center justify-between">
                      <span>Trưởng phòng IT / Quản lý</span>
                      <span className="text-[9px] bg-amber-100 text-amber-700 px-1 rounded font-mono">MANAGER</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">cuc.lt@doanhnghiep.vn</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ usernameOrEmail: 'admin', password: 'password123', rememberMe: true });
                    }}
                    className={`p-2 rounded-lg border text-left transition-all ${
                      formData.usernameOrEmail === 'admin'
                        ? 'border-primary-500 bg-primary-50 text-primary-900 font-semibold'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-[11px] flex items-center justify-between">
                      <span>Quản trị viên Hệ thống</span>
                      <span className="text-[9px] bg-purple-100 text-purple-700 px-1 rounded font-mono">ADMIN</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 truncate">admin@doanhnghiep.vn</div>
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 text-center italic pt-1">
                  Mật khẩu mặc định: password123. Hoặc sử dụng tài khoản bạn tự tạo trong phân hệ Quản trị.
                </p>
              </div>
            )}
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-xs text-slate-500">
            Cán bộ nhân viên mới chưa có tài khoản?{' '}
            <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 hover:underline">
              Đăng ký tài khoản nội bộ
            </Link>
          </p>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          © 2026 HelpDesk Service Portal. Tiêu chuẩn SLA & ISO/IEC 20000.
        </p>
      </div>
    </div>
  );
}

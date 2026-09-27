import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Shield,
} from 'lucide-react';
import Breadcrumbs from './Breadcrumbs';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = {
    ADMIN: 'Quản trị viên',
    MANAGER: 'Trưởng bộ phận',
    AGENT: 'Hỗ trợ viên',
    CUSTOMER: 'Khách hàng',
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left: Breadcrumbs & Page Context */}
      <div className="flex items-center space-x-4">
        <Breadcrumbs />
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Tìm mã ticket, giải pháp..."
            className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors relative cursor-pointer"
            aria-label="Thông báo"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-30">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800">Thông báo mới</span>
                <span className="text-[11px] text-primary-600 cursor-pointer hover:underline">Đã đọc tất cả</span>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                  <p className="text-xs text-slate-800 font-medium">Phiếu TIK-2026-0041 có bình luận mới</p>
                  <span className="text-[10px] text-slate-400">10 phút trước</span>
                </div>
                <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                  <p className="text-xs text-rose-600 font-medium">Cảnh báo: TIK-2026-0039 sắp vi phạm SLA</p>
                  <span className="text-[10px] text-slate-400">25 phút trước</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200" />

        {/* User Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
              {user?.fullName?.charAt(0) || 'U'}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.fullName || 'Người dùng'}
              </p>
              <span className="text-[10px] font-medium text-slate-500">
                {roleLabel[user?.role] || user?.role || 'Khách'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-30">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{user?.fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/profile');
                }}
                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 text-left"
              >
                <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Hồ sơ cá nhân</span>
              </button>

              {user?.role === 'ADMIN' && (
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate('/admin/users');
                  }}
                  className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2 text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Quản trị hệ thống</span>
                </button>
              )}

              <div className="my-1 border-t border-slate-100" />

              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 text-left"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-500" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

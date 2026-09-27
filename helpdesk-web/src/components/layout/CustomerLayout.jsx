import React from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Headphones,
  PlusCircle,
  Ticket,
  BookOpen,
  Bell,
  LogOut,
  User,
  Search,
  PhoneCall,
  Clock,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ChatbotWidget from '../chat/ChatbotWidget';

export default function CustomerLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Notification / Hotline Banner */}
      <div className="bg-primary-900 text-primary-100 text-xs py-1.5 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cổng Tiếp Nhận Hỗ Trợ Kỹ Thuật Trực Tuyến 24/7 — Hỗ trợ tức thì</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-primary-200">
            <span className="flex items-center space-x-1">
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>Hotline Nội bộ: <strong>8888</strong> / Di động: <strong>0901.234.567</strong></span>
            </span>
            <span className="hidden md:flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Cam kết SLA: Phản hồi dưới 15 phút</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-8">
            <Link to="/portal" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900 tracking-tight block leading-tight">
                  HelpDesk <span className="text-primary-600 font-extrabold text-sm">PORTAL</span>
                </span>
                <span className="text-[11px] text-slate-500 block leading-none">Trung Tâm Hỗ Trợ Người Dùng</span>
              </div>
            </Link>

            {/* Nav Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              <NavLink
                to="/portal"
                end
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                Trang chủ Portal
              </NavLink>

              <NavLink
                to="/portal/my-tickets"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <Ticket className="w-4 h-4" />
                <span>Yêu cầu của tôi</span>
              </NavLink>

              <NavLink
                to="/portal/faq"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <BookOpen className="w-4 h-4" />
                <span>Hướng dẫn & FAQ</span>
              </NavLink>
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            {/* Primary Action Button */}
            <Link
              to="/portal/create-ticket"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm shadow-primary-600/30 transition-all hover:shadow-md"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Gửi Yêu Cầu Mới</span>
            </Link>

            {/* User Profile dropdown */}
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {user?.fullName || 'Người Dùng'}
                </span>
                <span className="block text-[10px] text-emerald-600 font-medium leading-none mt-0.5">
                  Khách Hàng / Nhân Viên
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm border border-primary-200">
                {user?.fullName?.charAt(0) || 'U'}
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 pb-16">
        <Outlet />
      </main>

      {/* Customer Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                  <Headphones className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 text-sm">HelpDesk Portal</span>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed">
                Hệ thống tiếp nhận và số hóa quy trình xử lý sự cố dịch vụ dành riêng cho cán bộ nhân viên và khách hàng.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Kênh Hỗ Trợ Nhanh</h4>
              <ul className="space-y-2">
                <li>Hotline kỹ thuật: <strong>0901.234.567</strong></li>
                <li>Email hỗ trợ: <strong>support@helpdesk.local</strong></li>
                <li>Thời gian làm việc: 24/7/365</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Tra Cứu Nhanh</h4>
              <ul className="space-y-2">
                <li><Link to="/portal/faq" className="hover:text-primary-600">Cách đổi mật khẩu máy tính</Link></li>
                <li><Link to="/portal/faq" className="hover:text-primary-600">Cài đặt máy in mạng LAN</Link></li>
                <li><Link to="/portal/faq" className="hover:text-primary-600">Hướng dẫn kết nối VPN từ xa</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Chính Sách Cam Kết</h4>
              <p className="text-slate-500 mb-2">
                Mọi sự cố khẩn cấp (P1) được tiếp nhận xử lý trong vòng 15 phút.
              </p>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tiêu chuẩn quản lý ITIL v4</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
            <p>© 2026 HelpDesk Service Portal. Bản quyền thuộc Đồ án chuyên ngành CNTT.</p>
            <p>Phiên bản Dịch Vụ: 2.4.0 (Enterprise)</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

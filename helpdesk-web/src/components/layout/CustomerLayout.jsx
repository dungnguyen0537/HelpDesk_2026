import React from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Headphones,
  PlusCircle,
  Ticket,
  BookOpen,
  LogOut,
  Home,
  PhoneCall,
  Clock,
  ShieldCheck,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import ChatbotWidget from '../chat/ChatbotWidget';

export default function CustomerLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Trang chủ', path: '/portal', icon: Home, exact: true },
    { label: 'Yêu cầu của tôi', path: '/portal/my-tickets', icon: Ticket },
    { label: 'Hướng dẫn & FAQ', path: '/portal/faq', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Notification / Hotline Banner (Compact on mobile) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-[11px]">
          <div className="flex items-center space-x-2 truncate">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="truncate">Cổng Tiếp Nhận Hỗ Trợ IT 24/7</span>
          </div>
          <div className="flex items-center space-x-3 text-slate-300 flex-shrink-0">
            <span className="flex items-center space-x-1">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Hotline: <strong className="text-white">8888</strong></span>
            </span>
            <span className="hidden sm:inline-block text-slate-400">|</span>
            <span className="hidden sm:flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Phản hồi dưới 15p</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          {/* Logo & Portal Identity */}
          <div className="flex items-center space-x-8">
            <Link to="/portal" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
                <Headphones className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-slate-900 tracking-tight block leading-tight">
                  HelpDesk <span className="text-primary-600 font-extrabold text-xs sm:text-sm">PORTAL</span>
                </span>
                <span className="text-[10px] text-slate-500 block leading-none hidden sm:block">Trung Tâm Hỗ Trợ Kỹ Thuật</span>
              </div>
            </Link>

            {/* Desktop Nav Menu */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.exact}
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`
                  }
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user?.role && user.role !== 'CUSTOMER' && (
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-medium transition-colors"
                title="Quay lại Bảng điều hành quản trị kỹ thuật"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Quản Trị</span>
              </Link>
            )}

            {/* Primary Action Button (Desktop) */}
            <Link
              to="/portal/create-ticket"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Gửi Yêu Cầu Mới</span>
            </Link>

            {/* User Profile dropdown */}
            <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {user?.fullName || 'Người Dùng'}
                </span>
                <span className="block text-[10px] text-emerald-600 font-medium leading-none mt-0.5">
                  {user?.role === 'CUSTOMER' ? 'Khách Hàng' : user?.role}
                </span>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">
                {user?.fullName?.charAt(0) || 'U'}
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Đăng xuất"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Page Content (with mobile bottom bar padding) */}
      <main className="flex-1 pb-24 md:pb-16">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Sticky, Fast, Thumb-friendly) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200/90 z-40 pb-safe shadow-lg flex items-center justify-around h-14">
        <NavLink
          to="/portal"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary-600 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span>Trang chủ</span>
        </NavLink>

        <NavLink
          to="/portal/my-tickets"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary-600 font-bold' : 'text-slate-500'
            }`
          }
        >
          <Ticket className="w-5 h-5 mb-0.5" />
          <span>Yêu cầu</span>
        </NavLink>

        {/* Center Prominent Create Ticket Button */}
        <Link
          to="/portal/create-ticket"
          className="flex flex-col items-center justify-center flex-1 -mt-4"
        >
          <div className="w-11 h-11 rounded-full bg-primary-600 text-white flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-primary-700 mt-0.5">Tạo mới</span>
        </Link>

        <NavLink
          to="/portal/faq"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-primary-600 font-bold' : 'text-slate-500'
            }`
          }
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span>Hỏi đáp</span>
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 py-1 text-[10px] font-medium text-slate-500 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mb-0.5" />
          <span>Thoát</span>
        </button>
      </nav>

      {/* Customer Footer (Desktop & Tablet) */}
      <footer className="hidden sm:block bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-700">HelpDesk Enterprise Portal</span>
              <span>•</span>
              <span>Hotline hỗ trợ: 0901.234.567</span>
            </div>
            <p>© 2026 Design By DShinee — All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}

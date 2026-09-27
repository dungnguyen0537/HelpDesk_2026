import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  BookOpen,
  BarChart3,
  Users,
  Building2,
  ClockAlert,
  ChevronLeft,
  ChevronRight,
  Headphones,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthStore();
  const role = user?.role || 'CUSTOMER';

  const navItems = [
    {
      title: 'TỔNG QUAN',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'YÊU CẦU & SỰ CỐ',
      items: [
        { label: 'Danh sách phiếu', path: '/tickets', icon: Ticket, badge: 18 },
        { label: 'Tạo phiếu mới', path: '/tickets/new', icon: PlusCircle },
        { label: 'Cơ sở tri thức', path: '/knowledge-base', icon: BookOpen },
      ],
    },
    ...(role === 'ADMIN' || role === 'MANAGER'
      ? [
          {
            title: 'BÁO CÁO & ĐO LƯỜNG',
            items: [
              { label: 'Báo cáo & SLA', path: '/reports', icon: BarChart3 },
            ],
          },
        ]
      : []),
    ...(role === 'ADMIN'
      ? [
          {
            title: 'QUẢN TRỊ HỆ THỐNG',
            items: [
              { label: 'Người dùng', path: '/admin/users', icon: Users },
              { label: 'Phòng ban & Mục', path: '/admin/departments', icon: Building2 },
              { label: 'Chính sách SLA', path: '/admin/sla-policies', icon: ClockAlert },
            ],
          },
        ]
      : []),
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 relative border-r border-slate-800 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <Headphones className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="truncate">
              <span className="font-bold text-base text-white tracking-wide block">HelpDesk</span>
              <span className="text-[10px] text-slate-400 font-medium block">Enterprise Suite</span>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto px-3 space-y-6">
        {navItems.map((group, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="bg-primary-500/30 text-primary-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </div>

      {/* Current Agent Status Bar (if Agent/Manager) */}
      {(role === 'AGENT' || role === 'MANAGER') && !collapsed && (
        <div className="p-3 mx-3 mb-4 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Trạng thái ca trực:</span>
            <span className="inline-flex items-center text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
              Sẵn sàng
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Đang nhận: <strong className="text-white">3/5 phiếu</strong></p>
        </div>
      )}
    </aside>
  );
}

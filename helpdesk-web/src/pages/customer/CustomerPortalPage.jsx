import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Laptop,
  Wifi,
  FileCode2,
  KeyRound,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  PhoneCall,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function CustomerPortalPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Service Catalog Categories
  const categories = [
    {
      id: 1,
      title: 'Phần cứng & Thiết bị',
      desc: 'Máy tính, màn hình, bàn phím, máy in, máy scan văn phòng',
      icon: Laptop,
      color: 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400',
      badge: 'Phản hồi: 15p',
    },
    {
      id: 2,
      title: 'Mạng LAN, Wi-Fi & VPN',
      desc: 'Mất kết nối mạng nội bộ, Wi-Fi chập chờn, kết nối VPN từ xa',
      icon: Wifi,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:border-emerald-400',
      badge: 'Phản hồi: 10p',
    },
    {
      id: 3,
      title: 'Phần mềm & Hệ thống',
      desc: 'Lỗi phần mềm kế toán, ERP, Office 365, Outlook, Google Workspace',
      icon: FileCode2,
      color: 'bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400',
      badge: 'Phản hồi: 20p',
    },
    {
      id: 4,
      title: 'Tài khoản & Phân quyền',
      desc: 'Quên mật khẩu, cấp mới tài khoản, xin quyền truy cập thư mục',
      icon: KeyRound,
      color: 'bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400',
      badge: 'Tự động hóa',
    },
  ];

  // User's Active Tickets
  const [myTickets] = useState([
    {
      id: 'TK-20260327-0012',
      title: 'Màn hình máy tính Dell 24 inch tại bàn làm việc bị sọc ngang',
      category: 'Phần cứng',
      createdAt: 'Hôm nay, 14:15',
      status: 'IN_PROGRESS',
      statusLabel: 'Đang xử lý',
      statusColor: 'bg-blue-50 text-blue-700 border-blue-200',
      agent: 'Trần Văn Bình (Kỹ Thuật Viên)',
      eta: 'Dự kiến xong trong 45 phút',
    },
    {
      id: 'TK-20260325-0089',
      title: 'Xin cấp quyền truy cập thư mục Báo cáo Tài chính Q1/2026',
      category: 'Tài khoản',
      createdAt: '2 ngày trước',
      status: 'RESOLVED',
      statusLabel: 'Đã hoàn thành',
      statusColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      agent: 'Lê Thị Cúc (Quản Lý)',
      eta: 'Đã hoàn tất lúc 16:30 hôm qua',
    },
  ]);

  // Quick Help articles
  const quickFaqs = [
    { title: 'Cách khắc phục sự cố máy in không nhận lệnh in trong mạng LAN', views: 342, tag: 'Phần cứng' },
    { title: 'Hướng dẫn cài đặt và đăng nhập VPN FortiClient để làm việc từ xa', views: 890, tag: 'Mạng' },
    { title: 'Quy trình xin cấp quyền tài khoản phần mềm kế toán ERP Misa', views: 215, tag: 'Tài khoản' },
    { title: 'Cách đồng bộ lại hòm thư Outlook khi không nhận được email mới', views: 460, tag: 'Phần mềm' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/portal/faq?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-10">
      {/* Hero Welcome & Search Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-800 to-indigo-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl mx-4 sm:mx-6 mt-6">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-200 text-xs font-medium border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Cổng Dịch Vụ Khách Hàng & Người Dùng Nội Bộ</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Xin chào, {user?.fullName || 'bạn'}! <br />
            <span className="text-primary-200 font-normal text-xl sm:text-2xl">
              Chúng tôi có thể hỗ trợ gì cho bạn hôm nay?
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-primary-100 max-w-xl mx-auto leading-relaxed">
            Tra cứu giải pháp tức thì trong kho dữ liệu hoặc gửi phiếu yêu cầu cho đội ngũ IT HelpDesk chỉ trong vài giây.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearch} className="pt-2 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-2xl rounded-2xl overflow-hidden bg-white p-1.5 border-2 border-white/20">
              <Search className="w-5 h-5 text-slate-400 ml-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Nhập vấn đề bạn gặp phải (ví dụ: máy in kẹt giấy, mất wifi, quên mật khẩu...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2.5 text-slate-800 text-sm focus:outline-none placeholder:text-slate-400 font-normal"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex-shrink-0"
              >
                Tìm Giải Pháp
              </button>
            </div>
          </form>
        </div>

        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-400/20 blur-3xl pointer-events-none"></div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
        {/* Service Catalog Categories */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Danh Mục Dịch Vụ Hỗ Trợ</h2>
              <p className="text-xs text-slate-500 mt-0.5">Chọn loại vấn đề để gửi yêu cầu đến đúng nhóm kỹ thuật viên</p>
            </div>
            <Link
              to="/portal/create-ticket"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline"
            >
              <span>Xem tất cả loại sự cố</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/portal/create-ticket?category=${cat.id}`)}
                  className="group bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cat.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm group-hover:text-primary-600 transition-colors">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {cat.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary-600">
                    <span>Gửi yêu cầu</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* User Active Tickets Section */}
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Yêu Cầu Hỗ Trợ Gần Đây Của Bạn</h2>
              <p className="text-xs text-slate-500 mt-0.5">Theo dõi tiến độ giải quyết trực tiếp từ đội ngũ kỹ thuật</p>
            </div>
            <Link
              to="/portal/my-tickets"
              className="text-xs font-semibold text-primary-600 hover:text-primary-700 hover:underline flex items-center space-x-1"
            >
              <span>Xem tất cả ({myTickets.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3">
            {myTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => navigate(`/tickets/${t.id}`)}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-primary-300 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="font-mono font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                      {t.id}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{t.category}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-400">{t.createdAt}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm hover:text-primary-600 transition-colors">
                    {t.title}
                  </h3>

                  <div className="flex items-center space-x-3 text-xs text-slate-500">
                    <span className="flex items-center space-x-1">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Người phụ trách: <strong>{t.agent}</strong></span>
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="flex items-center space-x-1 text-slate-600 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t.eta}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end space-x-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${t.statusColor}`}>
                    {t.statusLabel}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Self-Service & FAQ Section */}
        <section className="bg-slate-100/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Giải Pháp Tự Xử Lý Nhanh (Self-Service)</h2>
              <p className="text-xs text-slate-500 mt-0.5">Tiết kiệm thời gian với các bài hướng dẫn chi tiết từng bước</p>
            </div>
            <Link
              to="/portal/faq"
              className="text-xs font-semibold text-primary-600 hover:underline flex items-center space-x-1"
            >
              <span>Tra cứu toàn bộ</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickFaqs.map((faq, idx) => (
              <Link
                key={idx}
                to="/portal/faq"
                className="bg-white p-4 rounded-xl border border-slate-200 hover:border-primary-300 shadow-xs hover:shadow-sm transition-all flex items-start space-x-3 group"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mb-1">
                    <span className="font-semibold text-primary-600">{faq.tag}</span>
                    <span>•</span>
                    <span>{faq.views} lượt xem</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {faq.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

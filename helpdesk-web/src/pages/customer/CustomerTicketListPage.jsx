import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ticket,
  PlusCircle,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  FileText,
  User,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function CustomerTicketListPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const tickets = [
    {
      id: 'TK-20260327-0012',
      title: 'Màn hình máy tính Dell 24 inch tại bàn làm việc bị sọc ngang',
      category: 'Phần cứng & Thiết bị',
      priority: 'HIGH',
      priorityLabel: 'Ưu tiên cao',
      status: 'IN_PROGRESS',
      statusLabel: 'Đang sửa chữa',
      statusClass: 'bg-blue-50 text-blue-700 border-blue-200',
      createdAt: '27/03/2026 14:15',
      updatedAt: '27/03/2026 14:30',
      assignedTo: 'Trần Văn Bình (Kỹ Thuật Viên IT)',
      commentsCount: 3,
      slaNotice: 'Cam kết SLA: Phản hồi trong 15p - Hoàn thành trong 2h',
    },
    {
      id: 'TK-20260325-0089',
      title: 'Xin cấp quyền truy cập thư mục Báo cáo Tài chính Q1/2026',
      category: 'Tài khoản & Phân quyền',
      priority: 'MEDIUM',
      priorityLabel: 'Bình thường',
      status: 'RESOLVED',
      statusLabel: 'Đã hoàn thành',
      statusClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      createdAt: '25/03/2026 09:00',
      updatedAt: '25/03/2026 16:30',
      assignedTo: 'Lê Thị Cúc (Quản Lý Dịch Vụ)',
      commentsCount: 2,
      slaNotice: 'Đã xử lý đúng hạn cam kết SLA',
    },
    {
      id: 'TK-20260320-0045',
      title: 'Cài đặt phần mềm đọc file CAD và máy in văn phòng lầu 2',
      category: 'Phần mềm & Hệ thống',
      priority: 'LOW',
      priorityLabel: 'Thấp',
      status: 'CLOSED',
      statusLabel: 'Đã đóng phiếu',
      statusClass: 'bg-slate-100 text-slate-700 border-slate-200',
      createdAt: '20/03/2026 10:20',
      updatedAt: '21/03/2026 11:00',
      assignedTo: 'Trần Văn Bình (Kỹ Thuật Viên IT)',
      commentsCount: 4,
      slaNotice: 'Khách hàng đã đánh giá 5 sao ★★★★★',
    },
  ];

  const filteredTickets = tickets.filter((t) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'ACTIVE' && (t.status === 'NEW' || t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED')) ||
      (activeTab === 'RESOLVED' && (t.status === 'RESOLVED' || t.status === 'CLOSED'));

    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Yêu Cầu Hỗ Trợ Của Tôi</h1>
          <p className="text-xs text-slate-500 mt-1">
            Theo dõi tất cả sự cố và yêu cầu dịch vụ bạn đã gửi đến bộ phận IT HelpDesk
          </p>
        </div>

        <Link
          to="/portal/create-ticket"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo Yêu Cầu Mới</span>
        </Link>
      </div>

      {/* Tabs & Search Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tab Filters */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tất cả ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang xử lý (1)
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'RESOLVED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã hoàn thành (2)
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo mã hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Ticket Cards List */}
      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/tickets/${ticket.id}`)}
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-primary-400 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-primary-600 bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-100">
                    {ticket.id}
                  </span>
                  <span className="text-slate-500 font-medium">{ticket.category}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400 text-[11px]">Tạo lúc: {ticket.createdAt}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-primary-600 transition-colors">
                  {ticket.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kỹ thuật viên: <strong className="text-slate-700">{ticket.assignedTo}</strong></span>
                  </span>

                  <span className="flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>{ticket.commentsCount} phản hồi</span>
                  </span>

                  <span className="text-emerald-600 text-[11px] font-medium bg-emerald-50 px-2 py-0.5 rounded">
                    {ticket.slaNotice}
                  </span>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex items-center justify-between md:justify-end space-x-4 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${ticket.statusClass}`}>
                  {ticket.statusLabel}
                </span>

                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-xs">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-slate-300 space-y-3">
            <Ticket className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">Không tìm thấy yêu cầu hỗ trợ nào</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Bạn chưa có yêu cầu nào trong danh mục này hoặc từ khóa tìm kiếm không khớp.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

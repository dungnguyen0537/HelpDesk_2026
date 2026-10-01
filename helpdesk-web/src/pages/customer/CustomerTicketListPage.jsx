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
  Star,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useTicketStore } from '../../store/ticketStore';
import { TICKET_STATUS, TICKET_PRIORITY } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

export default function CustomerTicketListPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const allTickets = useTicketStore((state) => state.tickets);
  const reopenTicket = useTicketStore((state) => state.reopenTicket);
  const rateTicket = useTicketStore((state) => state.rateTicket);

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [csatModalTicket, setCsatModalTicket] = useState(null); // ticket being rated/closed
  const [starRating, setStarRating] = useState(5);
  const [csatFeedback, setCsatFeedback] = useState('');

  const [reopenModalTicket, setReopenModalTicket] = useState(null); // ticket being reopened
  const [reopenReason, setReopenReason] = useState('');

  // Show user's tickets if any match, or all tickets for portal demo
  const userTickets = user
    ? allTickets.filter(
        (t) =>
          (t.creatorEmail && user.email && t.creatorEmail.toLowerCase() === user.email.toLowerCase()) ||
          (t.creator && user.fullName && t.creator.toLowerCase().includes(user.fullName.toLowerCase()))
      )
    : [];

  const displayTickets = userTickets.length > 0 ? userTickets : allTickets;

  const activeTicketsCount = displayTickets.filter(
    (t) => t.status !== 'RESOLVED' && t.status !== 'CLOSED'
  ).length;
  const resolvedTicketsCount = displayTickets.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'CLOSED'
  ).length;

  const filteredTickets = displayTickets.filter((t) => {
    const matchesTab =
      activeTab === 'ALL' ||
      (activeTab === 'ACTIVE' && t.status !== 'RESOLVED' && t.status !== 'CLOSED') ||
      (activeTab === 'RESOLVED' && (t.status === 'RESOLVED' || t.status === 'CLOSED'));

    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()));

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
            Tất cả ({displayTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ACTIVE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đang xử lý ({activeTicketsCount})
          </button>
          <button
            onClick={() => setActiveTab('RESOLVED')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'RESOLVED'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đã hoàn thành ({resolvedTicketsCount})
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
          filteredTickets.map((ticket) => {
            const statusInfo = TICKET_STATUS[ticket.status] || {
              label: ticket.status,
              color: 'bg-slate-100 text-slate-700 border-slate-300',
            };
            const assignedName = ticket.assignedTo || ticket.assignee || 'Đang chờ phân công';
            const commentsNum = ticket.comments?.length || 0;
            const notice = ticket.slaNotice || ticket.slaResolution || 'Cam kết hỗ trợ theo SLA';

            return (
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
                    <span className="text-slate-400 text-[11px]">Tạo lúc: {formatDate(ticket.createdAt)}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base group-hover:text-primary-600 transition-colors">
                    {ticket.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        Kỹ thuật viên: <strong className="text-slate-700">{assignedName}</strong>
                      </span>
                    </span>

                    <span className="flex items-center space-x-1">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                      <span>{commentsNum} phản hồi</span>
                    </span>

                    <span className="text-emerald-600 text-[11px] font-medium bg-emerald-50 px-2 py-0.5 rounded">
                      {notice}
                    </span>
                  </div>
                </div>

                {/* Status and Action Buttons according to ITSM Step 7 & 8 */}
                <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-center ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>

                  {/* Customer Confirm Close or Reopen if ticket is RESOLVED */}
                  {ticket.status === 'RESOLVED' && (
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setCsatModalTicket(ticket);
                          setStarRating(5);
                          setCsatFeedback('');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors flex items-center space-x-1"
                        title="Đã khắc phục ổn, tiến hành đóng phiếu và đánh giá dịch vụ"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Đã ổn, đóng phiếu</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReopenModalTicket(ticket);
                          setReopenReason('');
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors flex items-center space-x-1"
                        title="Sự cố chưa khắc phục triệt để, yêu cầu xử lý lại"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Chưa ổn, mở lại</span>
                      </button>
                    </div>
                  )}

                  {ticket.status === 'CLOSED' && ticket.rating && (
                    <div className="flex items-center space-x-1 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-amber-700 text-xs font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{ticket.rating}/5 sao</span>
                    </div>
                  )}

                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-xs">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
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

      {/* CSAT Modal: Confirm Close & Rate Ticket (Step 7 & 8) */}
      {csatModalTicket && (
        <div
          onClick={() => setCsatModalTicket(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Xác Nhận Đóng Phiếu & Đánh Giá</h3>
                  <span className="text-[11px] text-slate-500">{csatModalTicket.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCsatModalTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Bạn xác nhận sự cố <strong className="text-slate-800">"{csatModalTicket.title}"</strong> đã được kỹ thuật viên xử lý thỏa đáng.
              </div>

              {/* Star Rating Selector */}
              <div className="space-y-2 text-center py-2">
                <span className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Mức độ hài lòng của bạn (1 - 5 sao):
                </span>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStarRating(star)}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= starRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-semibold text-amber-700 block">
                  {starRating === 5 && 'Rất hài lòng - Xử lý xuất sắc!'}
                  {starRating === 4 && 'Hài lòng - Dịch vụ tốt'}
                  {starRating === 3 && 'Bình thường - Chấp nhận được'}
                  {starRating === 2 && 'Chưa hài lòng - Còn chậm'}
                  {starRating === 1 && 'Rất không hài lòng'}
                </span>
              </div>

              {/* Feedback text */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Nhận xét đóng góp ý kiến (Tùy chọn):
                </label>
                <textarea
                  rows={3}
                  value={csatFeedback}
                  onChange={(e) => setCsatFeedback(e.target.value)}
                  placeholder="Ý kiến khen ngợi hoặc phản ánh để nâng cao chất lượng hỗ trợ..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setCsatModalTicket(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    rateTicket(csatModalTicket.id, starRating, csatFeedback);
                    setCsatModalTicket(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                >
                  Xác nhận & Đóng phiếu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reopen Ticket Modal (Max 2 times safeguard) */}
      {reopenModalTicket && (
        <div
          onClick={() => setReopenModalTicket(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Mở Lại Phiếu Hỗ Trợ</h3>
                  <span className="text-[11px] text-slate-500">{reopenModalTicket.id}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReopenModalTicket(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Quy định mở lại phiếu (ITSM Step 7):</span>
                </div>
                <p>
                  Mỗi phiếu chỉ được mở lại tối đa <strong>2 lần</strong> trong vòng 7 ngày kể từ khi giải quyết. 
                  Lần mở lại hiện tại: <strong>{(reopenModalTicket.reopenCount || 0) + 1}/2</strong>.
                </p>
                {(reopenModalTicket.reopenCount || 0) >= 2 && (
                  <p className="text-rose-700 font-bold pt-1">
                    Lưu ý: Mở lại lần thứ 3 sẽ tự động chuyển cảnh báo thẳng lên Quản lý bộ phận!
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Lý do chưa hài lòng / Vấn đề phát sinh <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reopenReason}
                  onChange={(e) => setReopenReason(e.target.value)}
                  placeholder="Mô tả cụ thể tại sao sự cố chưa được khắc phục triệt để..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setReopenModalTicket(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!reopenReason.trim()}
                  onClick={() => {
                    reopenTicket(reopenModalTicket.id, reopenReason.trim());
                    setReopenModalTicket(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white shadow-xs"
                >
                  Xác nhận mở lại phiếu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

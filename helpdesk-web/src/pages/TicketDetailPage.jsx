import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Send,
  Lock,
  User,
  Paperclip,
  CheckCircle,
  AlertTriangle,
  History,
  ShieldAlert,
  RotateCcw,
  ExternalLink,
  Eye,
  X,
  Download,
  FileText,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useTicketStore } from '../store/ticketStore';
import { useAuthStore } from '../store/authStore';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants';
import { formatDate } from '../utils/formatters';

const TECHNICIAN_OPTIONS = [
  { value: 'Lê Văn Cường', label: 'Lê Văn Cường (Senior Network)' },
  { value: 'Trần Thị Bích', label: 'Trần Thị Bích (System Admin)' },
  { value: 'Trần Văn Bình', label: 'Trần Văn Bình (Desktop Support)' },
  { value: 'Phạm Thị Lan', label: 'Phạm Thị Lan (ERP Specialist)' },
  { value: 'Lê Thị Cúc', label: 'Lê Thị Cúc (Quản Lý Dịch Vụ)' },
  { value: 'Nguyễn Văn Hùng', label: 'Nguyễn Văn Hùng (Kỹ Thuật Viên IT)' },
];

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { tickets, updateTicketStatus, assignTicket, addComment } = useTicketStore();
  const { user } = useAuthStore();

  const [activeCommentTab, setActiveCommentTab] = useState('PUBLIC'); // 'PUBLIC' or 'INTERNAL'
  const [commentText, setCommentText] = useState('');
  const [previewModal, setPreviewModal] = useState(null); // { url, name }

  // Find ticket from store by ID or fallback to first
  const ticket = tickets.find((t) => t.id === id) || tickets[0];

  if (!ticket) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Không tìm thấy phiếu hỗ trợ</h2>
        <p className="text-xs text-slate-500">Mã phiếu yêu cầu không tồn tại hoặc đã bị xóa.</p>
        <Button variant="primary" onClick={() => navigate('/tickets')}>
          Về danh sách phiếu
        </Button>
      </div>
    );
  }

  const statusInfo = TICKET_STATUS[ticket.status] || {
    label: ticket.status,
    color: 'bg-slate-100 text-slate-700 border-slate-300',
  };

  const priorityInfo = TICKET_PRIORITY[ticket.priority] || {
    label: ticket.priority,
    color: 'text-slate-600 bg-slate-50 border-slate-200',
  };

  const handleStatusChange = (newStatus) => {
    updateTicketStatus(ticket.id, newStatus);
  };

  const handleAssigneeChange = (newAssignee) => {
    assignTicket(ticket.id, newAssignee);
  };

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const authorName = user ? `${user.fullName}` : 'Bạn (Quản Trị / Kỹ Thuật)';
    const authorRole = user?.role || 'AGENT';

    addComment(ticket.id, {
      author: authorName,
      role: authorRole,
      content: commentText.trim(),
      isInternal: activeCommentTab === 'INTERNAL',
    });

    setCommentText('');
  };

  const visibleComments = (ticket.comments || []).filter((cmt) => {
    if (activeCommentTab === 'INTERNAL') return true; // Show all or internal
    return !cmt.isInternal; // Public view hides internal comments
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/tickets')}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-primary-600">{ticket.id}</span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${priorityInfo.color}`}
              >
                {priorityInfo.label}
              </span>
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">
              {ticket.title}
            </h1>
          </div>
        </div>

        {/* Quick Resolution Controls */}
        <div className="flex items-center space-x-2">
          {ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('RESOLVED')}
              className="text-emerald-700 hover:bg-emerald-50 border-emerald-300"
            >
              <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />
              Đánh dấu giải quyết
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusChange('IN_PROGRESS')}
              className="text-amber-700 hover:bg-amber-50 border-amber-300"
            >
              <RotateCcw className="w-4 h-4 mr-1 text-amber-600" />
              Mở lại phiếu (Đang xử lý)
            </Button>
          )}

          <Button
            variant="danger"
            size="sm"
            onClick={() => handleStatusChange('IN_PROGRESS')}
          >
            <ShieldAlert className="w-4 h-4 mr-1" />
            Tiếp nhận xử lý
          </Button>
        </div>
      </div>

      {/* Main Grid: Left 70% conversation, Right 30% metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Content Card */}
          <Card title="Nội dung sự cố ban đầu">
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {ticket.description || 'Không có mô tả chi tiết cho sự cố này.'}
            </p>

            {ticket.attachments && ticket.attachments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-700 block mb-2.5">
                  Tệp & Hình ảnh đính kèm ({ticket.attachments.length}):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {ticket.attachments.map((file, idx) => {
                    const isImg = file.isImage || (file.dataUrl && file.dataUrl.startsWith('data:image')) || (file.name && /\.(png|jpe?g|gif|webp|bmp)$/i.test(file.name));
                    return (
                      <div
                        key={idx}
                        className="flex items-center space-x-2.5 p-2 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all text-xs group"
                      >
                        {isImg && file.dataUrl ? (
                          <div
                            onClick={() => setPreviewModal({ url: file.dataUrl, name: file.name })}
                            className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 cursor-pointer flex-shrink-0 group/img"
                            title="Bấm để xem ảnh phóng to"
                          >
                            <img
                              src={file.dataUrl}
                              alt={file.name}
                              className="w-full h-full object-cover group-hover/img:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <Eye className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-primary-100/70 flex items-center justify-center flex-shrink-0 text-primary-600">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-slate-800 block truncate" title={file.name}>
                            {file.name}
                          </span>
                          <span className="text-[10px] text-slate-400 block">{file.size || 'Tệp đính kèm'}</span>
                          {file.dataUrl && (
                            <a
                              href={file.dataUrl}
                              download={file.name}
                              className="text-[10px] text-primary-600 hover:underline font-medium inline-flex items-center space-x-0.5 mt-0.5"
                            >
                              <Download className="w-2.5 h-2.5 mr-0.5" />
                              <span>Tải về</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </Card>

          {/* Comment Stream */}
          <Card bodyClassName="p-0">
            {/* Tabs for comment mode */}
            <div className="border-b border-slate-200 px-5 pt-3 flex space-x-4">
              <button
                type="button"
                onClick={() => setActiveCommentTab('PUBLIC')}
                className={`pb-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                  activeCommentTab === 'PUBLIC'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Trao đổi công khai (Khách hàng thấy)
              </button>
              <button
                type="button"
                onClick={() => setActiveCommentTab('INTERNAL')}
                className={`pb-3 text-xs font-semibold border-b-2 flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  activeCommentTab === 'INTERNAL'
                    ? 'border-amber-600 text-amber-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Ghi chú nội bộ (Chỉ Kỹ thuật)</span>
              </button>
            </div>

            {/* Conversation Feed */}
            <div className="p-5 space-y-4 max-h-[450px] overflow-y-auto">
              {visibleComments.length > 0 ? (
                visibleComments.map((cmt) => (
                  <div
                    key={cmt.id}
                    className={`p-3.5 rounded-xl border ${
                      cmt.isInternal
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                        : 'bg-white border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] text-slate-700">
                          {cmt.author ? cmt.author.charAt(0) : 'U'}
                        </div>
                        <span className="text-xs font-bold text-slate-900">{cmt.author}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold">
                          {cmt.role}
                        </span>
                        {cmt.isInternal && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-200 text-amber-800 font-semibold flex items-center space-x-1">
                            <Lock className="w-2.5 h-2.5 mr-0.5" />
                            Nội bộ
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{cmt.time}</span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line">{cmt.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs italic">
                  Chưa có trao đổi nào trong mục này. Hãy gửi tin nhắn đầu tiên.
                </div>
              )}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendComment} className="p-4 border-t border-slate-200 bg-slate-50/50">
              <textarea
                rows={3}
                placeholder={
                  activeCommentTab === 'INTERNAL'
                    ? 'Nhập ghi chú kỹ thuật bảo mật (chỉ nhân viên IT đọc được)...'
                    : 'Gửi phản hồi cho khách hàng...'
                }
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
              />
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] text-slate-400">
                  {activeCommentTab === 'INTERNAL'
                    ? 'Ghi chú nội bộ (Khách hàng không nhìn thấy nội dung này)'
                    : 'Tin nhắn công khai gửi đến khách hàng'}
                </span>
                <Button
                  type="submit"
                  size="sm"
                  variant={activeCommentTab === 'INTERNAL' ? 'secondary' : 'primary'}
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  Gửi phản hồi
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Ticket Meta & SLA Policy */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card title="Thông Tin Quản Trị">
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Trạng thái phiếu:</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="NEW">Mới tạo (NEW)</option>
                  <option value="ASSIGNED">Đã gán (ASSIGNED)</option>
                  <option value="IN_PROGRESS">Đang xử lý (IN_PROGRESS)</option>
                  <option value="PENDING">Chờ khách (PENDING)</option>
                  <option value="RESOLVED">Đã giải quyết (RESOLVED)</option>
                  <option value="CLOSED">Đóng phiếu (CLOSED)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Kỹ thuật viên phụ trách:</label>
                <select
                  value={ticket.assignee || ''}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value="">-- Chưa phân công --</option>
                  {TECHNICIAN_OPTIONS.map((tech) => (
                    <option key={tech.value} value={tech.value}>
                      {tech.label}
                    </option>
                  ))}
                  {ticket.assignee &&
                    !TECHNICIAN_OPTIONS.some((t) => t.value === ticket.assignee) && (
                      <option value={ticket.assignee}>{ticket.assignee}</option>
                    )}
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block">Phòng ban phụ trách:</span>
                <span className="font-semibold text-slate-800 block mt-0.5">
                  {ticket.department || 'IT Operations & Mạng'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block">Người yêu cầu:</span>
                <span className="font-semibold text-slate-800 block mt-0.5">{ticket.creator}</span>
                {ticket.creatorEmail && (
                  <span className="text-[11px] text-slate-400 block">Email: {ticket.creatorEmail}</span>
                )}
                {ticket.location && (
                  <span className="text-[11px] text-slate-400 block">Vị trí: {ticket.location}</span>
                )}
                {ticket.phone && (
                  <span className="text-[11px] text-slate-400 block">SĐT: {ticket.phone}</span>
                )}
                <span className="text-[11px] text-slate-400 block mt-1">
                  Khởi tạo: {formatDate(ticket.createdAt)}
                </span>
              </div>
            </div>
          </Card>

          {/* SLA Tracking Countdown */}
          <Card title="Cam Kết Dịch Vụ (SLA Matrix)">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                <div className="flex items-center justify-between text-emerald-800 font-semibold mb-1">
                  <span>Phản hồi lần đầu (MTTA):</span>
                  <span>ĐẠT CHỈ TIÊU</span>
                </div>
                <p className="text-[11px] text-emerald-700">Tiếp nhận xử lý đúng quy định cam kết dịch vụ</p>
              </div>

              <div
                className={`p-3 rounded-lg border ${
                  ticket.isBreached
                    ? 'bg-rose-50 border-rose-200'
                    : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between font-semibold mb-1">
                  <span
                    className={
                      ticket.isBreached
                        ? 'text-rose-800'
                        : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                        ? 'text-emerald-800'
                        : 'text-amber-800'
                    }
                  >
                    Thời hạn xử lý (MTTR):
                  </span>
                  <span
                    className={`font-bold ${
                      ticket.isBreached
                        ? 'text-rose-600'
                        : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {ticket.slaResolution || ticket.slaRemaining || 'Đạt SLA'}
                  </span>
                </div>
                <p
                  className={`text-[11px] ${
                    ticket.isBreached
                      ? 'text-rose-600'
                      : ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
                      ? 'text-emerald-700'
                      : 'text-amber-700'
                  }`}
                >
                  {ticket.slaNotice || 'Cam kết SLA hệ thống vận hành'}
                </p>
              </div>
            </div>
          </Card>

          {/* Timeline History */}
          <Card title="Nhật Ký Kiểm Toán (Audit)">
            <div className="space-y-3 text-[11px] text-slate-600">
              {ticket.history && ticket.history.length > 0 ? (
                ticket.history.map((h, idx) => (
                  <div key={h.id || idx} className="flex items-start space-x-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        h.type === 'status'
                          ? 'bg-amber-500'
                          : h.type === 'assign'
                          ? 'bg-primary-500'
                          : h.type === 'comment'
                          ? 'bg-sky-500'
                          : 'bg-slate-400'
                      }`}
                    />
                    <div>
                      <span className="font-semibold text-slate-800">{h.time || h.date}</span> -{' '}
                      {h.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 italic">Chưa có nhật ký ghi nhận</div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Lightbox Modal for Image Preview */}
      {previewModal && (
        <div
          onClick={() => setPreviewModal(null)}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col"
          >
            <div className="flex items-center justify-between p-3.5 bg-slate-950 text-white border-b border-slate-800">
              <span className="text-xs font-semibold truncate max-w-md">{previewModal.name}</span>
              <div className="flex items-center space-x-2">
                <a
                  href={previewModal.url}
                  download={previewModal.name}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Tải ảnh về máy"
                >
                  <Download className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                  title="Đóng xem trước"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2 flex items-center justify-center overflow-auto max-h-[calc(90vh-60px)]">
              <img
                src={previewModal.url}
                alt={previewModal.name}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

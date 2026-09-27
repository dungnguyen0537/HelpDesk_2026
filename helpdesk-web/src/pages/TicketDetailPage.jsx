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
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function TicketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeCommentTab, setActiveCommentTab] = useState('PUBLIC'); // 'PUBLIC' or 'INTERNAL'
  const [commentText, setCommentText] = useState('');
  const [ticketStatus, setTicketStatus] = useState('IN_PROGRESS');
  const [assignee, setAssignee] = useState('Lê Văn Cường');

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Nguyễn Thu Trang',
      role: 'CUSTOMER',
      time: '14:00 (2 giờ trước)',
      content: 'Chào IT, hiện tại cả dãy phòng Marketing tầng 3 đều không thể truy cập mạng LAN nội bộ và máy in mạng.',
      isInternal: false,
    },
    {
      id: 2,
      author: 'Lê Văn Cường',
      role: 'AGENT',
      time: '14:15 (1 giờ 45 phút trước)',
      content: 'Ghi chú kỹ thuật: Đã kiểm tra cổng switch SW-FL03-01 có dấu hiệu loopback hoặc mất nguồn PoE.',
      isInternal: true,
    },
    {
      id: 3,
      author: 'Lê Văn Cường',
      role: 'AGENT',
      time: '14:20 (1 giờ 40 phút trước)',
      content: 'Chào chị Trang, đội kỹ thuật đang trực tiếp lên phòng máy tầng 3 kiểm tra thiết bị Switch. Dự kiến khắc phục trong 30 phút.',
      isInternal: false,
    },
  ]);

  const handleSendComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: Date.now(),
      author: 'Bạn (Quản Trị / Kỹ Thuật)',
      role: 'AGENT',
      time: 'Vừa xong',
      content: commentText,
      isInternal: activeCommentTab === 'INTERNAL',
    };

    setComments([...comments, newComment]);
    setCommentText('');
  };

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
              <span className="text-sm font-bold text-primary-600">{id || 'TIK-2026-0041'}</span>
              <Badge variant="danger" dot>URGENT</Badge>
              <Badge variant="warning">Đang xử lý</Badge>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-900 mt-0.5">
              Mất kết nối Switch tầng 3 tòa nhà trung tâm
            </h1>
          </div>
        </div>

        {/* Quick Resolution Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTicketStatus('RESOLVED')}
            className="text-emerald-700 hover:bg-emerald-50 border-emerald-300"
          >
            <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" />
            Đánh dấu giải quyết
          </Button>
          <Button variant="danger" size="sm">
            <ShieldAlert className="w-4 h-4 mr-1" />
            Báo cáo Leo thang
          </Button>
        </div>
      </div>

      {/* Main Grid: Left 70% conversation, Right 30% metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Comments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Issue Content Card */}
          <Card title="Nội dung sự cố ban đầu">
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
              Toàn bộ phòng Marketing tầng 3 mất mạng dây từ lúc 13h55. Đèn trên các cổng Switch nhấp nháy đỏ liên tục. 
              Các máy trạm bị ngắt kết nối vào hệ thống ERP và không thể in tài liệu hợp đồng gấp gửi đối tác.
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-600 block mb-2">Tệp đính kèm (1):</span>
              <div className="inline-flex items-center space-x-2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs">
                <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-medium text-slate-700">switch_error_light.jpg</span>
                <span className="text-slate-400">(1.4 MB)</span>
              </div>
            </div>
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
              {comments.map((cmt) => (
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
                        {cmt.author.charAt(0)}
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
                  <p className="text-xs leading-relaxed">{cmt.content}</p>
                </div>
              ))}
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendComment} className="p-4 border-t border-slate-200 bg-slate-50/50">
              <textarea
                rows={3}
                placeholder={
                  activeCommentTab === 'INTERNAL'
                    ? 'Nhập ghi chú kỹ thuật bảo mật...'
                    : 'Gửi phản hồi cho khách hàng...'
                }
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
              />
              <div className="flex items-center justify-between mt-2.5">
                <span className="text-[11px] text-slate-400">
                  {activeCommentTab === 'INTERNAL' ? 'Ghi chú nội bộ (Khách hàng không nhìn thấy nội dung này)' : 'Tin nhắn công khai gửi đến email khách'}
                </span>
                <Button type="submit" size="sm" variant={activeCommentTab === 'INTERNAL' ? 'secondary' : 'primary'}>
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
                  value={ticketStatus}
                  onChange={(e) => setTicketStatus(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
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
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-2.5 py-2 border border-slate-300 rounded-lg bg-white font-medium text-slate-800"
                >
                  <option value="Lê Văn Cường">Lê Văn Cường (Senior Network)</option>
                  <option value="Trần Thị Bích">Trần Thị Bích (System Admin)</option>
                  <option value="Nguyễn Văn Hùng">Nguyễn Văn Hùng (Desktop Support)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-500 block">Người yêu cầu:</span>
                <span className="font-semibold text-slate-800 block mt-0.5">Nguyễn Thu Trang</span>
                <span className="text-[11px] text-slate-400 block">Phòng Marketing & Truyền thông</span>
                <span className="text-[11px] text-slate-400 block">Email: trang.nt@company.com</span>
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
                <p className="text-[11px] text-emerald-700">Phản hồi sau 15 phút (Quy định: 30 phút)</p>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center justify-between text-amber-800 font-semibold mb-1">
                  <span>Thời hạn xử lý (MTTR):</span>
                  <span className="text-rose-600 font-bold">CÒN 14 PHÚT</span>
                </div>
                <p className="text-[11px] text-amber-700">Hạn chót: 16:00:00 hôm nay (2 giờ kể từ khi mở)</p>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Timeline History */}
          <Card title="Nhật Ký Kiểm Toán (Audit)">
            <div className="space-y-3 text-[11px] text-slate-600">
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">14:00</span> - Tạo phiếu hỗ trợ bởi Nguyễn Thu Trang
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">14:05</span> - Hệ thống gán tự động cho Lê Văn Cường
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-800">14:15</span> - Chuyển trạng thái sang IN_PROGRESS
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

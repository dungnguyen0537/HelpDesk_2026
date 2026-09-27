import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  AlertCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { TICKET_STATUS, TICKET_PRIORITY } from '../utils/constants';
import { useTicketStore } from '../store/ticketStore';

export default function TicketListPage() {
  const navigate = useNavigate();
  const tickets = useTicketStore((state) => state.tickets);

  const [activeTab, setActiveTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // Dynamic tab counts
  const tabCounts = {
    ALL: tickets.length,
    UNASSIGNED: tickets.filter((t) => !t.assignee).length,
    BREACHED: tickets.filter((t) => t.isBreached).length,
    RESOLVED: tickets.filter((t) => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
  };

  // Filtering
  const filteredTickets = tickets.filter((t) => {
    const matchSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.creator && t.creator.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.department && t.department.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.assignee && t.assignee.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'UNASSIGNED'
        ? !t.assignee
        : activeTab === 'BREACHED'
        ? t.isBreached
        : activeTab === 'RESOLVED'
        ? t.status === 'RESOLVED' || t.status === 'CLOSED'
        : true;

    const matchStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;

    return matchSearch && matchTab && matchStatus && matchPriority;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Danh Sách Phiếu Hỗ Trợ</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý, phân công và kiểm soát tiến độ xử lý sự cố toàn hệ thống
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="md" icon={Download}>
            Xuất dữ liệu
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => navigate('/tickets/new')}
          >
            Tạo Phiếu Mới
          </Button>
        </div>
      </div>

      {/* Tabs Filter */}
      <div className="flex space-x-1 border-b border-slate-200">
        {[
          { key: 'ALL', label: 'Tất cả phiếu', count: tabCounts.ALL },
          { key: 'UNASSIGNED', label: 'Chưa phân công', count: tabCounts.UNASSIGNED },
          { key: 'BREACHED', label: 'Vi phạm SLA', count: tabCounts.BREACHED },
          { key: 'RESOLVED', label: 'Đã giải quyết', count: tabCounts.RESOLVED },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-3 px-4 text-xs font-semibold flex items-center space-x-2 border-b-2 transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === tab.key
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters Bar */}
      <Card bodyClassName="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã, tiêu đề, người tạo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="NEW">Mới tạo (NEW)</option>
            <option value="ASSIGNED">Đã phân công (ASSIGNED)</option>
            <option value="IN_PROGRESS">Đang xử lý (IN_PROGRESS)</option>
            <option value="RESOLVED">Đã giải quyết (RESOLVED)</option>
            <option value="CLOSED">Đã đóng (CLOSED)</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
          >
            <option value="ALL">Tất cả mức ưu tiên</option>
            <option value="URGENT">Khẩn cấp (URGENT)</option>
            <option value="HIGH">Cao (HIGH)</option>
            <option value="MEDIUM">Trung bình (MEDIUM)</option>
            <option value="LOW">Thấp (LOW)</option>
          </select>

          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setSearchQuery('');
              setSelectedStatus('ALL');
              setSelectedPriority('ALL');
              setActiveTab('ALL');
            }}
          >
            Đặt lại bộ lọc
          </Button>
        </div>
      </Card>

      {/* Ticket Table */}
      <Card bodyClassName="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-primary-600" />
                </th>
                <th className="py-3 px-4">Mã Phiếu & Tiêu Đề</th>
                <th className="py-3 px-4">Phòng Ban / Người Tạo</th>
                <th className="py-3 px-4">Độ Ưu Tiên</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4">Kỹ Thuật Viên</th>
                <th className="py-3 px-4">Cam Kết SLA</th>
                <th className="py-3 px-4 text-right">Chi Tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => {
                const statusInfo = TICKET_STATUS[ticket.status] || { label: ticket.status, color: 'bg-slate-100' };
                const priorityInfo = TICKET_PRIORITY[ticket.priority] || { label: ticket.priority, color: 'text-slate-600' };

                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded border-slate-300 text-primary-600" />
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-primary-600 block">{ticket.id}</span>
                      <span className="font-medium text-slate-900 block max-w-sm truncate mt-0.5">
                        {ticket.title}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-slate-700 block font-medium">{ticket.department}</span>
                      <span className="text-[11px] text-slate-400 block">{ticket.creator}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${priorityInfo.color}`}>
                        {priorityInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {ticket.assignee ? (
                        <div className="flex items-center space-x-1.5 text-slate-800">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{ticket.assignee}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Chưa phân công</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1">
                        <Clock className={`w-3.5 h-3.5 ${ticket.isBreached ? 'text-rose-500' : 'text-slate-400'}`} />
                        <span className={`font-semibold ${ticket.isBreached ? 'text-rose-600' : 'text-slate-700'}`}>
                          {ticket.slaResolution}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tickets/${ticket.id}`);
                        }}
                      >
                        Mở phiếu
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Hiển thị 1 - {filteredTickets.length} trong tổng số {tickets.length} phiếu</span>
          <div className="flex items-center space-x-1">
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Trước</button>
            <button className="px-3 py-1 bg-primary-600 text-white rounded font-medium">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Sau</button>
          </div>
        </div>
      </Card>
    </div>
  );
}

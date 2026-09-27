import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowUpRight,
  Plus,
  ShieldAlert,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useTicketStore } from '../store/ticketStore';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export default function DashboardPage() {
  const navigate = useNavigate();
  const tickets = useTicketStore((state) => state.tickets);

  // Dynamic KPI Metrics
  const totalTickets = tickets.length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED'
  ).length;
  const pendingTickets = tickets.filter((t) => t.status === 'PENDING').length;
  const resolvedTickets = tickets.filter(
    (t) => t.status === 'RESOLVED' || t.status === 'CLOSED'
  ).length;
  const urgentTicketsCount = tickets.filter(
    (t) => (t.priority === 'URGENT' || t.isBreached) && t.status !== 'RESOLVED' && t.status !== 'CLOSED'
  ).length;
  const resolutionRate = totalTickets ? Math.round((resolvedTickets / totalTickets) * 100) : 100;

  // Mock Trend Data
  const trendData = [
    { day: 'T2', created: 24, resolved: 20 },
    { day: 'T3', created: 30, resolved: 28 },
    { day: 'T4', created: 45, resolved: 39 },
    { day: 'T5', created: 38, resolved: 42 },
    { day: 'T6', created: 52, resolved: 48 },
    { day: 'T7', created: 18, resolved: 22 },
    { day: 'CN', created: totalTickets > 0 ? totalTickets : 12, resolved: resolvedTickets > 0 ? resolvedTickets : 14 },
  ];

  // Dynamic Category Distribution
  const categoryPalette = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];
  const categoryCounts = tickets.reduce((acc, t) => {
    const cat = t.category || 'Khác';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.keys(categoryCounts).map((catName, idx) => ({
    name: catName,
    value: categoryCounts[catName],
    color: categoryPalette[idx % categoryPalette.length],
  }));

  // Urgent tickets list from store (tickets needing immediate action)
  const urgentTickets = tickets
    .filter(
      (t) =>
        (t.priority === 'URGENT' || t.priority === 'HIGH' || t.isBreached) &&
        t.status !== 'RESOLVED' &&
        t.status !== 'CLOSED'
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full bg-primary-700/60 text-primary-200 text-xs font-semibold mb-2">
            Hệ Thống Đang Trực Tuyến 24/7
          </span>
          <h1 className="text-xl md:text-2xl font-bold">Chào mừng trở lại bảng điều hành HelpDesk</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Tất cả dịch vụ hỗ trợ đang vận hành ổn định. Tỷ lệ cam kết SLA toàn hệ thống hôm nay đạt 96.8%.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="light"
            size="md"
            onClick={() => navigate('/tickets')}
          >
            Xem danh sách phiếu
          </Button>
          <Button
            variant="white"
            size="md"
            icon={Plus}
            onClick={() => navigate('/tickets/new')}
          >
            Tạo Ticket Mới
          </Button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Tổng Số Phiếu</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-800">{totalTickets}</span>
            <div className="flex items-center text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              <span>Đồng bộ từ hệ thống</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Phiếu Đang Xử Lý</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-800">{inProgressTickets}</span>
            <div className="flex items-center text-xs text-slate-500 font-medium mt-1">
              <span>{pendingTickets} phiếu chờ khách phản hồi</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Phiếu Khẩn Cấp / SLA</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-rose-600">{urgentTicketsCount}</span>
            <div className="flex items-center text-xs text-rose-600 font-medium mt-1">
              <AlertTriangle className="w-3.5 h-3.5 mr-1" />
              <span>Cần phân công can thiệp ngay</span>
            </div>
          </div>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase">Phiếu Hoàn Thành</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-600">{resolvedTickets}</span>
            <div className="flex items-center text-xs text-emerald-600 font-medium mt-1">
              <span>Tỷ lệ hoàn thành: {resolutionRate}%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart: Trend */}
        <Card
          title="Xu Hướng Tiếp Nhận & Giải Quyết (7 Ngày)"
          subtitle="Biểu đồ so sánh số lượng phiếu tạo mới và phiếu đã xử lý"
          className="lg:col-span-2"
        >
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    border: 'none',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="created"
                  name="Tạo mới"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCreated)"
                />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  name="Đã xử lý"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorResolved)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Pie Chart: Categories */}
        <Card
          title="Phân Bổ Theo Danh Mục"
          subtitle="Tỷ lệ sự cố phát sinh theo lĩnh vực kỹ thuật"
        >
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Urgent Tickets Priority Table */}
      <Card
        title="Phiếu Cần Can Thiệp Khẩn Cấp / Sắp Vi Phạm SLA"
        subtitle="Danh sách các phiếu ưu tiên cao hoặc có nguy cơ trễ hạn cam kết"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/tickets')}
            className="text-xs text-primary-600 font-semibold"
          >
            Xem tất cả
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Mã Phiếu</th>
                <th className="py-2.5 px-3">Tiêu Đề</th>
                <th className="py-2.5 px-3">Danh Mục</th>
                <th className="py-2.5 px-3">Độ Ưu Tiên</th>
                <th className="py-2.5 px-3">Người Phụ Trách</th>
                <th className="py-2.5 px-3">Thời Hạn SLA</th>
                <th className="py-2.5 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {urgentTickets.length > 0 ? (
                urgentTickets.map((tik) => (
                  <tr key={tik.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-primary-600">{tik.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-800 max-w-xs truncate">{tik.title}</td>
                    <td className="py-3 px-3">{tik.category}</td>
                    <td className="py-3 px-3">
                      <Badge variant={tik.priority === 'URGENT' ? 'danger' : 'warning'} dot>
                        {tik.priority}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      {tik.assignee ? (
                        <span className="text-slate-800">{tik.assignee}</span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa gán</span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          tik.isBreached ? 'text-rose-600' : 'text-amber-600'
                        }`}
                      >
                        {tik.slaRemaining || tik.slaResolution || 'Còn hạn'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/tickets/${tik.id}`)}
                      >
                        Chi tiết
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-400 italic">
                    Không có phiếu khẩn cấp hoặc vi phạm SLA nào cần xử lý.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

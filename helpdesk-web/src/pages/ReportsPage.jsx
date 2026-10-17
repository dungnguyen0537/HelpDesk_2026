import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Calendar,
  Filter,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  FileSpreadsheet,
} from 'lucide-react';
import { useTicketStore } from '../store/ticketStore';

export default function ReportsPage() {
  const tickets = useTicketStore((state) => state.tickets);

  const [activeTab, setActiveTab] = useState('OVERVIEW'); // 'OVERVIEW' | 'STAFF'
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-10-31');
  const [dateError, setDateError] = useState('');

  // Validate dates as per UC 2.6.7 Step 2.1
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    if (new Date(start) > new Date(end)) {
      setDateError('Ngày bắt đầu không được lớn hơn ngày kết thúc.');
    } else {
      setDateError('');
    }
  };

  const departmentSlaData = [
    { department: 'IT Ops & Mạng', met: 94, breached: 6 },
    { department: 'Phần Mềm / ERP', met: 90, breached: 10 },
    { department: 'Kế Toán - TC', met: 96, breached: 4 },
    { department: 'Hành Chính - NS', met: 92, breached: 8 },
  ];

  const categoryIssuesData = [
    { name: 'Mạng & Wi-Fi', value: 38, color: '#3b82f6' },
    { name: 'Phần Cứng & Thiết Bị', value: 26, color: '#10b981' },
    { name: 'Phần Mềm & ERP', value: 22, color: '#f59e0b' },
    { name: 'Tài Khoản & Mật Khẩu', value: 14, color: '#8b5cf6' },
  ];

  const agentLeaderboard = [
    { rank: 1, name: 'Lê Văn Cường', role: 'Senior Network', resolved: 42, avgTime: '1.8 giờ', csat: '4.9/5', onTimeRate: '98%' },
    { rank: 2, name: 'Trần Thị Bích', role: 'System Admin', resolved: 38, avgTime: '2.1 giờ', csat: '4.8/5', onTimeRate: '96%' },
    { rank: 3, name: 'Phạm Thị Lan', role: 'ERP Specialist', resolved: 31, avgTime: '2.4 giờ', csat: '4.7/5', onTimeRate: '94%' },
    { rank: 4, name: 'Nguyễn Văn Hùng', role: 'IT Support L1', resolved: 27, avgTime: '2.9 giờ', csat: '4.6/5', onTimeRate: '92%' },
  ];

  // Export to Excel / CSV as per UC 2.6.7 Step 1.4
  const handleExportExcel = () => {
    const headers = ['Mã Phiếu', 'Tiêu Đề', 'Phòng Ban', 'Mức Ưu Tiên', 'Trạng Thái', 'Kỹ Thuật Viên', 'Cam Kết SLA', 'Ngày Tạo'];
    const rows = tickets.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.department || ''}"`,
      t.priority,
      t.status,
      `"${t.assignee || 'Chưa gán'}"`,
      `"${t.slaResolution || ''}"`,
      t.createdAt || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BaoCao_HelpDesk_${startDate}_den_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Báo Cáo Thống Kê & Hiệu Suất Dịch Vụ</h1>
          <p className="text-xs text-slate-500 mt-1">
            Đo lường thời gian xử lý, tỷ lệ cam kết SLA, nhóm vấn đề thường gặp và chất lượng hỗ trợ (FR8 / UC8)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="md"
            icon={FileSpreadsheet}
            onClick={handleExportExcel}
            className="shadow-sm"
          >
            Xuất Báo Cáo Excel
          </Button>
        </div>
      </div>

      {/* Date Range Selector & View Tabs (UC 2.6.7 Steps 1.2, 1.3, 1.5) */}
      <Card bodyClassName="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs: Tổng quan vs Hiệu suất nhân viên */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === 'OVERVIEW' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tổng Quan Cam Kết SLA & Sự Cố
            </button>
            <button
              onClick={() => setActiveTab('STAFF')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
                activeTab === 'STAFF' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Hiệu Suất Nhân Viên Phụ Trách</span>
            </button>
          </div>

          {/* Date Range Inputs */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Từ:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e.target.value, endDate)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none"
              />
            </div>
            <div className="flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Đến:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange(startDate, e.target.value)}
                className="bg-transparent text-slate-800 font-semibold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Date Validation Alert */}
        {dateError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>{dateError}</span>
          </div>
        )}
      </Card>

      {/* KPI Highlight Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Thời Gian Phản Hồi (MTTA)</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">13.8 phút</div>
          <p className="text-xs text-emerald-600 mt-1">Đạt chỉ tiêu SLA (&lt; 15 phút)</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Thời Gian Xử Lý (MTTR)</span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-2">2.2 giờ</div>
          <p className="text-xs text-emerald-600 mt-1">Nhanh hơn 15% so với cam kết</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Tỷ Lệ Đúng Hạn SLA</span>
            <CheckCircle className="w-4 h-4 text-primary-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-2">97.2%</div>
          <p className="text-xs text-slate-500 mt-1">Mục tiêu toàn cơ quan: &gt; 95%</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase">
            <span>Đánh Giá Hài Lòng (CSAT)</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-2">4.85 / 5.0</div>
          <p className="text-xs text-emerald-600 mt-1">98.4% người dùng hài lòng</p>
        </Card>
      </div>

      {/* Conditional View: Overview vs Staff Performance (UC 2.6.7 Step 1.5) */}
      {activeTab === 'OVERVIEW' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card
            title="Tỷ Lệ Cam Kết SLA Theo Phòng Ban (%)"
            subtitle="Tỷ lệ phần trăm phiếu đạt chuẩn SLA so với phiếu vi phạm"
          >
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentSlaData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="department" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="met" name="Đạt SLA (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="breached" name="Vi Phạm SLA (%)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card
            title="Phân Bổ Nhóm Vấn Đề Thường Gặp"
            subtitle="Thống kê tỷ trọng các danh mục sự cố phát sinh nhiều nhất"
          >
            <div className="h-72 w-full flex items-center justify-center pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryIssuesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {categoryIssuesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      ) : (
        /* Staff Performance Table View (UC 2.6.7 Step 1.5) */
        <Card
          title="Bảng Thống Kê Hiệu Suất Nhân Viên Phụ Trách"
          subtitle="Đo lường thời gian xử lý trung bình, tỷ lệ hoàn thành đúng hạn và đánh giá người dùng"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Thứ Hạng</th>
                  <th className="py-3 px-4">Họ Và Tên</th>
                  <th className="py-3 px-4">Chức Vụ</th>
                  <th className="py-3 px-4">Số Phiếu Đã Xử Lý</th>
                  <th className="py-3 px-4">Thời Gian TB (MTTR)</th>
                  <th className="py-3 px-4">Tỷ Lệ Đúng Hạn</th>
                  <th className="py-3 px-4">Điểm Đánh Giá CSAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentLeaderboard.map((agent) => (
                  <tr key={agent.rank} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-700">#{agent.rank}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{agent.name}</td>
                    <td className="py-3.5 px-4 text-slate-500">{agent.role}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{agent.resolved} phiếu</td>
                    <td className="py-3.5 px-4 text-slate-700">{agent.avgTime}</td>
                    <td className="py-3.5 px-4 font-bold text-emerald-600">{agent.onTimeRate}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{agent.csat}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}


import React from 'react';
import Card from '../components/common/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function ReportsPage() {
  const departmentSlaData = [
    { department: 'IT Ops', met: 92, breached: 8 },
    { department: 'Kế toán', met: 88, breached: 12 },
    { department: 'Nhân sự', met: 96, breached: 4 },
    { department: 'Kinh doanh', met: 85, breached: 15 },
  ];

  const agentLeaderboard = [
    { rank: 1, name: 'Nguyễn Văn Hùng', resolved: 84, avgTime: '1.8 giờ', csat: '4.9/5' },
    { rank: 2, name: 'Lê Văn Cường', resolved: 76, avgTime: '2.1 giờ', csat: '4.8/5' },
    { rank: 3, name: 'Trần Thị Bích', resolved: 68, avgTime: '2.4 giờ', csat: '4.7/5' },
    { rank: 4, name: 'Phạm Thị Lan', resolved: 55, avgTime: '2.9 giờ', csat: '4.6/5' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Báo Cáo Hiệu Suất & Cam Kết SLA</h1>
        <p className="text-xs text-slate-500 mt-1">
          Theo dõi và đo lường tỷ lệ hoàn thành cam kết dịch vụ theo phòng ban và kỹ thuật viên
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase">Phản hồi TB (MTTA)</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">14.2 phút</div>
          <p className="text-xs text-emerald-600 mt-1">Nhanh hơn 20% so với cam kết</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase">Giải quyết TB (MTTR)</span>
          <div className="text-2xl font-bold text-slate-900 mt-2">2.4 giờ</div>
          <p className="text-xs text-emerald-600 mt-1">Đạt tiêu chuẩn cấp độ High</p>
        </Card>

        <Card>
          <span className="text-xs font-semibold text-slate-500 uppercase">Tỷ Lệ Đạt SLA Toàn Hệ Thống</span>
          <div className="text-2xl font-bold text-emerald-600 mt-2">96.4%</div>
          <p className="text-xs text-slate-500 mt-1">Mục tiêu quý: &gt; 95.0%</p>
        </Card>
      </div>

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
          title="Bảng Xếp Hạng Năng Suất Kỹ Thuật Viên"
          subtitle="Đánh giá dựa trên số phiếu xử lý và điểm hài lòng CSAT"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Thứ hạng</th>
                  <th className="py-2.5 px-3">Họ và Tên</th>
                  <th className="py-2.5 px-3">Đã Xử Lý</th>
                  <th className="py-2.5 px-3">Thời gian TB</th>
                  <th className="py-2.5 px-3">CSAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {agentLeaderboard.map((agent) => (
                  <tr key={agent.rank} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-700">#{agent.rank}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{agent.name}</td>
                    <td className="py-3 px-3">{agent.resolved} phiếu</td>
                    <td className="py-3 px-3">{agent.avgTime}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-600">{agent.csat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

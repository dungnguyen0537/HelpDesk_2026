import React, { useState } from 'react';
import {
  ClockAlert,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  ShieldCheck,
  TrendingUp,
  X,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function AdminSlaPoliciesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Initial SLA Policies Matrix
  const [slaPolicies, setSlaPolicies] = useState([
    {
      id: 1,
      name: 'Chính Sách Khẩn Cấp P1 (Urgent Outage)',
      priority: 'URGENT',
      priorityColor: 'bg-rose-50 text-rose-700 border-rose-200',
      firstResponseMinutes: 15,
      resolutionMinutes: 120, // 2h
      escalationThreshold: '15% thời gian còn lại (18 phút)',
      applicableCategory: 'Toàn bộ sự cố sập mạng, lỗi máy chủ, hỏng thiết bị lõi',
      targetCompliance: '99.5%',
      actualCompliance: '98.8%',
      isActive: true,
    },
    {
      id: 2,
      name: 'Chính Sách Ưu Tiên Cao P2 (High Critical)',
      priority: 'HIGH',
      priorityColor: 'bg-amber-50 text-amber-700 border-amber-200',
      firstResponseMinutes: 30,
      resolutionMinutes: 240, // 4h
      escalationThreshold: '20% thời gian còn lại (48 phút)',
      applicableCategory: 'Lỗi phần mềm ERP kế toán, hỏng máy trạm nhân viên chủ chốt',
      targetCompliance: '98.0%',
      actualCompliance: '99.1%',
      isActive: true,
    },
    {
      id: 3,
      name: 'Chính Sách Bình Thường P3 (Standard Medium)',
      priority: 'MEDIUM',
      priorityColor: 'bg-blue-50 text-blue-700 border-blue-200',
      firstResponseMinutes: 60,
      resolutionMinutes: 480, // 8h
      escalationThreshold: '25% thời gian còn lại (2 giờ)',
      applicableCategory: 'Phần mềm chạy chậm, xin cấp quyền truy cập tài liệu dùng chung',
      targetCompliance: '95.0%',
      actualCompliance: '97.4%',
      isActive: true,
    },
    {
      id: 4,
      name: 'Chính Sách Tiêu Chuẩn P4 (Low Support)',
      priority: 'LOW',
      priorityColor: 'bg-slate-50 text-slate-700 border-slate-200',
      firstResponseMinutes: 120,
      resolutionMinutes: 1440, // 24h
      escalationThreshold: '30% thời gian còn lại (7.2 giờ)',
      applicableCategory: 'Cài đặt phần mềm mới, mượn thiết bị máy chiếu, khảo sát ý kiến',
      targetCompliance: '95.0%',
      actualCompliance: '98.9%',
      isActive: true,
    },
  ]);

  const [formData, setFormData] = useState({
    name: '',
    priority: 'MEDIUM',
    firstResponseMinutes: 30,
    resolutionHours: 4,
    escalationThreshold: '20% thời hạn còn lại',
    applicableCategory: '',
  });

  const togglePolicyStatus = (id) => {
    setSlaPolicies(
      slaPolicies.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
  };

  const handleCreatePolicy = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newPolicy = {
      id: Date.now(),
      name: formData.name,
      priority: formData.priority,
      priorityColor:
        formData.priority === 'URGENT'
          ? 'bg-rose-50 text-rose-700 border-rose-200'
          : formData.priority === 'HIGH'
          ? 'bg-amber-50 text-amber-700 border-amber-200'
          : 'bg-blue-50 text-blue-700 border-blue-200',
      firstResponseMinutes: parseInt(formData.firstResponseMinutes) || 30,
      resolutionMinutes: (parseFloat(formData.resolutionHours) || 4) * 60,
      escalationThreshold: formData.escalationThreshold || '15% thời gian',
      applicableCategory: formData.applicableCategory || 'Tất cả các loại sự cố',
      targetCompliance: '98.0%',
      actualCompliance: '100%',
      isActive: true,
    };

    setSlaPolicies([...slaPolicies, newPolicy]);
    setFormData({
      name: '',
      priority: 'MEDIUM',
      firstResponseMinutes: 30,
      resolutionHours: 4,
      escalationThreshold: '20% thời hạn còn lại',
      applicableCategory: '',
    });
    setShowModal(false);
  };

  const filteredPolicies = slaPolicies.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.priority.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.applicableCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Chính Sách Cam Kết Dịch Vụ (SLA)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quy định ngưỡng thời gian phản hồi, thời hạn xử lý dứt điểm và quy tắc tự động leo thang sự cố
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setShowModal(true)}
        >
          Tạo Chính Sách Mới
        </Button>
      </div>

      {/* SLA Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Tỷ Lệ Đạt SLA Toàn Cơ Quan</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">98.4%</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vượt 1.4% so với KPI tháng trước</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Thời Gian Phản Hồi TB</span>
            <ClockAlert className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">11.8 phút</div>
          <div className="text-[11px] text-slate-500">Mục tiêu quy định: &lt; 30 phút</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Thời Gian Xử Lý TB</span>
            <CheckCircle2 className="w-4 h-4 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">2.4 giờ</div>
          <div className="text-[11px] text-slate-500">Áp dụng cho 94% các sự cố</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Quy Tắc Leo Thang (Escalation)</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">Đang bật (Active)</div>
          <div className="text-[11px] text-amber-600 font-semibold">Báo động khi còn 15% thời gian</div>
        </div>
      </div>

      {/* Policies List Card */}
      <Card bodyClassName="p-0 overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên chính sách, cấp độ ưu tiên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Có {filteredPolicies.length} chính sách cam kết đang áp dụng
          </span>
        </div>

        {/* Policies Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Tên Chính Sách SLA</th>
                <th className="py-3.5 px-4 text-center">Mức Ưu Tiên</th>
                <th className="py-3.5 px-4 text-center">Phản Hồi Ban Đầu</th>
                <th className="py-3.5 px-4 text-center">Thời Hạn Xử Lý</th>
                <th className="py-3.5 px-4">Quy Tắc Leo Thang</th>
                <th className="py-3.5 px-4 text-center">Tỷ Lệ Thực Tế</th>
                <th className="py-3.5 px-4">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPolicies.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-[11px] text-slate-400 max-w-sm truncate">{p.applicableCategory}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${p.priorityColor}`}
                    >
                      {p.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold text-slate-800">{p.firstResponseMinutes} phút</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-slate-900">
                      {p.resolutionMinutes >= 60
                        ? `${(p.resolutionMinutes / 60).toFixed(0)} giờ`
                        : `${p.resolutionMinutes} phút`}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-medium">
                    {p.escalationThreshold}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      {p.actualCompliance}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.isActive ? (
                      <span className="inline-flex items-center text-emerald-600 font-semibold space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Áp dụng</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-slate-400 font-semibold space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Tạm tắt</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => togglePolicyStatus(p.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        p.isActive
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {p.isActive ? 'Tắt' : 'Bật lại'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Create SLA Policy */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="font-bold text-sm text-slate-900">Cấu Hình Chính Sách Cam Kết SLA Mới</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePolicy} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tên Chính Sách Cam Kết *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: SLA Ưu Tiên Cao Cho Hệ Thống Kế Toán"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mức Độ Ưu Tiên Áp Dụng</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="URGENT">URGENT (Khẩn cấp)</option>
                    <option value="HIGH">HIGH (Ưu tiên cao)</option>
                    <option value="MEDIUM">MEDIUM (Bình thường)</option>
                    <option value="LOW">LOW (Tiêu chuẩn)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời Hạn Phản Hồi (Phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    value={formData.firstResponseMinutes}
                    onChange={(e) => setFormData({ ...formData, firstResponseMinutes: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thời Hạn Giải Quyết (Giờ)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="72"
                    value={formData.resolutionHours}
                    onChange={(e) => setFormData({ ...formData, resolutionHours: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngưỡng Leo Thang (Escalation)</label>
                  <input
                    type="text"
                    placeholder="VD: Còn 15% thời gian"
                    value={formData.escalationThreshold}
                    onChange={(e) => setFormData({ ...formData, escalationThreshold: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phạm Vi Sự Cố Áp Dụng</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả các tiêu chí sự cố áp dụng chính sách này..."
                  value={formData.applicableCategory}
                  onChange={(e) => setFormData({ ...formData, applicableCategory: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  Hủy
                </Button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu Chính Sách
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

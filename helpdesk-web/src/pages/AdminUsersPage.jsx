import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Shield,
  Building,
  CheckCircle,
  Ban,
  KeyRound,
  Edit2,
  Lock,
  UserCheck,
  UserX,
  Mail,
  Phone,
  BadgeCheck,
  Filter,
  X,
  RotateCcw,
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useUserStore } from '../store/userStore';

const DEPARTMENTS_LIST = [
  'IT Operations & Hạ Tầng Mạng',
  'Phát Triển Phần Mềm & ERP',
  'Hành Chính & Nhân Sự (HR)',
  'Kế Toán & Tài Chính',
  'Marketing & Phát Triển Thị Trường',
];

const ROLES_LIST = [
  { value: 'CUSTOMER', label: 'Cán bộ / Người dùng (CUSTOMER)', desc: 'Tạo phiếu và theo dõi tiến độ sự cố' },
  { value: 'AGENT', label: 'Kỹ thuật viên (AGENT)', desc: 'Tiếp nhận, xử lý sự cố và ghi nhận giải pháp' },
  { value: 'MANAGER', label: 'Trưởng phòng / Quản lý (MANAGER)', desc: 'Điều phối nhân sự, giám sát SLA và xem báo cáo' },
  { value: 'ADMIN', label: 'Quản trị viên Hệ thống (ADMIN)', desc: 'Toàn quyền cấu hình tài khoản, SLA và hệ thống' },
];

export default function AdminUsersPage() {
  const { users, addUser, updateUser, toggleUserStatus, resetPassword } = useUserStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [resettingUser, setResettingUser] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Form states
  const [addForm, setAddForm] = useState({
    fullName: '',
    employeeId: '',
    username: '',
    email: '',
    phone: '',
    role: 'CUSTOMER',
    department: 'IT Operations & Hạ Tầng Mạng',
    password: 'password123',
  });

  const [editForm, setEditForm] = useState({
    fullName: '',
    employeeId: '',
    phone: '',
    role: 'CUSTOMER',
    department: 'IT Operations & Hạ Tầng Mạng',
    isActive: true,
  });

  const [newPasswordInput, setNewPasswordInput] = useState('password123');

  // KPI Counts
  const totalCount = users.length;
  const activeCount = users.filter((u) => u.isActive).length;
  const agentCount = users.filter((u) => u.role === 'AGENT').length;
  const managerAdminCount = users.filter((u) => u.role === 'ADMIN' || u.role === 'MANAGER').length;
  const lockedCount = users.filter((u) => !u.isActive).length;

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !searchTerm ||
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.employeeId && u.employeeId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesDept = deptFilter === 'ALL' || u.department === deptFilter;
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && u.isActive) ||
      (statusFilter === 'LOCKED' && !u.isActive);

    return matchesSearch && matchesRole && matchesDept && matchesStatus;
  });

  const showNotification = (text, type = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  // Add User submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    const result = addUser(addForm);
    if (!result.success) {
      showNotification(result.message, 'error');
      return;
    }
    showNotification(`Đã thêm thành công tài khoản "${addForm.fullName}" (${addForm.username})`);
    setIsAddModalOpen(false);
    setAddForm({
      fullName: '',
      employeeId: '',
      username: '',
      email: '',
      phone: '',
      role: 'CUSTOMER',
      department: 'IT Operations & Hạ Tầng Mạng',
      password: 'password123',
    });
  };

  // Edit User submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingUser) return;
    updateUser(editingUser.id, editForm);
    showNotification(`Đã cập nhật thông tin tài khoản "${editingUser.username}"`);
    setEditingUser(null);
  };

  // Reset Password submit
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    if (!resettingUser) return;
    resetPassword(resettingUser.id, newPasswordInput);
    showNotification(`Đã đặt lại mật khẩu cho tài khoản "${resettingUser.username}" thành công`);
    setResettingUser(null);
    setNewPasswordInput('password123');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Quản Trị Người Dùng & Phân Quyền Nhân Sự
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tài khoản doanh nghiệp, phân bổ phòng ban, gán vai trò vận hành và kiểm soát truy cập
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsAddModalOpen(true)}
        >
          Thêm Tài Khoản Mới
        </Button>
      </div>

      {/* Floating Alert */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center space-x-2 transition-all ${
            feedbackMsg.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Tổng nhân sự
          </span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{totalCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Đang hoạt động
          </span>
          <span className="text-xl font-bold text-emerald-700 mt-1 block">{activeCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider block">
            Kỹ thuật viên (Agent)
          </span>
          <span className="text-xl font-bold text-blue-700 mt-1 block">{agentCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block">
            Quản lý & Admin
          </span>
          <span className="text-xl font-bold text-purple-700 mt-1 block">{managerAdminCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
            Đã khóa
          </span>
          <span className="text-xl font-bold text-rose-700 mt-1 block">{lockedCount}</span>
        </div>
      </div>

      {/* Main Table Card */}
      <Card bodyClassName="p-0 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, username, email, mã NV..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter by Role */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="ALL">Tất cả vai trò</option>
              <option value="ADMIN">Quản trị viên (ADMIN)</option>
              <option value="MANAGER">Quản lý (MANAGER)</option>
              <option value="AGENT">Kỹ thuật viên (AGENT)</option>
              <option value="CUSTOMER">Người dùng (CUSTOMER)</option>
            </select>

            {/* Filter by Department */}
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="ALL">Tất cả phòng ban</option>
              {DEPARTMENTS_LIST.map((dept, idx) => (
                <option key={idx} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Filter by Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="ACTIVE">Đang hoạt động</option>
              <option value="LOCKED">Đã khóa</option>
            </select>

            {(searchTerm || roleFilter !== 'ALL' || deptFilter !== 'ALL' || statusFilter !== 'ALL') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('ALL');
                  setDeptFilter('ALL');
                  setStatusFilter('ALL');
                }}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                title="Xóa bộ lọc"
              >
                Đặt lại
              </button>
            )}
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nhân sự / Mã NV</th>
                <th className="py-3 px-4">Tài khoản & Email</th>
                <th className="py-3 px-4">Vai Trò (Role)</th>
                <th className="py-3 px-4">Phòng Ban Trực Thuộc</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">{u.fullName}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {u.employeeId || `EMP-${String(u.id).padStart(4, '0')}`}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-700">{u.username}</div>
                      <div className="text-[11px] text-slate-400">{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={
                          u.role === 'ADMIN'
                            ? 'danger'
                            : u.role === 'MANAGER'
                            ? 'purple'
                            : u.role === 'AGENT'
                            ? 'primary'
                            : 'default'
                        }
                      >
                        {u.role === 'ADMIN'
                          ? 'Quản trị viên'
                          : u.role === 'MANAGER'
                          ? 'Quản lý'
                          : u.role === 'AGENT'
                          ? 'Kỹ thuật viên'
                          : 'Người dùng'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-700 block">{u.department}</span>
                      {u.phone && <span className="text-[11px] text-slate-400">{u.phone}</span>}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {u.isActive ? 'Đang hoạt động' : 'Tạm khóa'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setEditForm({
                            fullName: u.fullName,
                            employeeId: u.employeeId || '',
                            phone: u.phone || '',
                            role: u.role,
                            department: u.department,
                            isActive: u.isActive,
                          });
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100 transition-colors"
                        title="Chỉnh sửa thông tin"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Reset Password Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setResettingUser(u);
                          setNewPasswordInput('password123');
                        }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Đặt lại mật khẩu"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>

                      {/* Lock / Unlock Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const res = toggleUserStatus(u.id);
                          showNotification(res.message);
                        }}
                        className={`p-1.5 rounded-lg transition-colors ${
                          u.isActive
                            ? 'text-rose-500 hover:bg-rose-50'
                            : 'text-emerald-600 hover:bg-emerald-50'
                        }`}
                        title={u.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                      >
                        {u.isActive ? <Ban className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Không tìm thấy tài khoản nhân sự nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal: Thêm Tài Khoản Mới */}
      {isAddModalOpen && (
        <div
          onClick={() => setIsAddModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Thêm Tài Khoản Nhân Sự Mới</h3>
                  <span className="text-[11px] text-slate-400">Cấp tài khoản vận hành vào hệ thống nội bộ</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Hoàng Minh Trí"
                    value={addForm.fullName}
                    onChange={(e) => setAddForm({ ...addForm, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã nhân viên (ID)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: EMP-0345"
                    value={addForm.employeeId}
                    onChange={(e) => setAddForm({ ...addForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tên đăng nhập (Username) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="tri.hm"
                    value={addForm.username}
                    onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email công ty <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tri.hm@doanhnghiep.vn"
                    value={addForm.email}
                    onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    placeholder="0912 888 999"
                    value={addForm.phone}
                    onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu khởi tạo</label>
                  <input
                    type="text"
                    required
                    value={addForm.password}
                    onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vai trò phân quyền (Role) <span className="text-rose-500">*</span>
                </label>
                <select
                  value={addForm.role}
                  onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phòng ban trực thuộc <span className="text-rose-500">*</span>
                </label>
                <select
                  value={addForm.department}
                  onChange={(e) => setAddForm({ ...addForm, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                >
                  {DEPARTMENTS_LIST.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <Button type="submit" variant="primary" size="sm">
                  Lưu & Cấp Tài Khoản
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Chỉnh Sửa Tài Khoản */}
      {editingUser && (
        <div
          onClick={() => setEditingUser(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Chỉnh Sửa Thông Tin Tài Khoản</h3>
                  <span className="text-[11px] text-slate-400">Tài khoản: {editingUser.username}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Họ và tên</label>
                <input
                  type="text"
                  required
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã nhân viên</label>
                  <input
                    type="text"
                    value={editForm.employeeId}
                    onChange={(e) => setEditForm({ ...editForm, employeeId: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Vai trò phân quyền</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                >
                  {ROLES_LIST.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phòng ban trực thuộc</label>
                <select
                  value={editForm.department}
                  onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 bg-white"
                >
                  {DEPARTMENTS_LIST.map((dept, idx) => (
                    <option key={idx} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span>Tài khoản đang hoạt động (Active)</span>
                </label>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy bỏ
                </button>
                <Button type="submit" variant="primary" size="sm">
                  Cập Nhật Thay Đổi
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Đặt Lại Mật Khẩu */}
      {resettingUser && (
        <div
          onClick={() => setResettingUser(null)}
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Đặt Lại Mật Khẩu</h3>
                  <span className="text-[11px] text-slate-400">{resettingUser.fullName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setResettingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
                Mật khẩu mới sẽ có hiệu lực ngay lập tức. Nhân sự có thể dùng mật khẩu này để đăng nhập vào hệ thống.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mật khẩu mới</label>
                <input
                  type="text"
                  required
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResettingUser(null)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <Button type="submit" variant="primary" size="sm">
                  Xác Nhận Đổi Mật Khẩu
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { Users, Plus, Search, Shield, Building, CheckCircle, Ban } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: 'Quản Trị Viên Hệ Thống',
      username: 'admin',
      email: 'admin@helpdesk.local',
      role: 'ADMIN',
      department: 'IT Operations',
      isActive: true,
    },
    {
      id: 2,
      fullName: 'Lê Văn Cường',
      username: 'cuong.lv',
      email: 'cuong.lv@company.com',
      role: 'AGENT',
      department: 'IT Operations',
      isActive: true,
    },
    {
      id: 3,
      fullName: 'Trần Thị Bích',
      username: 'bich.tt',
      email: 'bich.tt@company.com',
      role: 'MANAGER',
      department: 'Phát triển Sản phẩm',
      isActive: true,
    },
    {
      id: 4,
      fullName: 'Nguyễn Thu Trang',
      username: 'trang.nt',
      email: 'trang.nt@company.com',
      role: 'CUSTOMER',
      department: 'Marketing & Sales',
      isActive: true,
    },
    {
      id: 5,
      fullName: 'Hoàng Văn Khóa',
      username: 'khoa.hv',
      email: 'khoa.hv@company.com',
      role: 'CUSTOMER',
      department: 'Hành chính',
      isActive: false,
    },
  ]);

  const toggleUserStatus = (userId) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isActive: !u.isActive } : u))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900">Quản Trị Người Dùng & Phân Quyền</h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý tài khoản, gán quyền vai trò và phân bổ phòng ban trực thuộc
          </p>
        </div>
        <Button variant="primary" size="md" icon={Plus}>
          Thêm Tài Khoản
        </Button>
      </div>

      <Card bodyClassName="p-0 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo họ tên, email, username..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="text-xs text-slate-500">
            Tổng cộng: <strong>{users.length}</strong> tài khoản
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Họ và Tên</th>
                <th className="py-3 px-4">Tên đăng nhập</th>
                <th className="py-3 px-4">Vai Trò (Role)</th>
                <th className="py-3 px-4">Phòng Ban</th>
                <th className="py-3 px-4">Trạng Thái</th>
                <th className="py-3 px-4 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{u.fullName}</td>
                  <td className="py-3.5 px-4 text-slate-500">{u.username}</td>
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
                      {u.role}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">{u.department}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center text-[11px] font-semibold ${
                        u.isActive ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    >
                      {u.isActive ? 'Đang hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
                        u.isActive
                          ? 'text-rose-600 hover:bg-rose-50'
                          : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.isActive ? 'Khóa' : 'Kích hoạt'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

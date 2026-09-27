import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Quản Trị Viên',
    email: user?.email || 'admin@helpdesk.local',
    phoneNumber: '0988 123 456',
    department: 'IT Operations',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Hồ Sơ Cá Nhân & Cài Đặt</h1>
        <p className="text-xs text-slate-500 mt-1">Cập nhật thông tin tài khoản và mật khẩu bảo mật</p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>Thông tin hồ sơ cá nhân đã được lưu thành công!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Thông Tin Cơ Bản">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ và tên"
              name="fullName"
              icon={User}
              value={formData.fullName}
              onChange={handleChange}
            />
            <Input
              label="Email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Số điện thoại"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phòng ban</label>
              <input
                type="text"
                disabled
                value={formData.department}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </Card>

        <Card title="Đổi Mật Khẩu">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            <Input
              label="Mật khẩu mới"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <Input
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md">
            Lưu Thay Đổi
          </Button>
        </div>
      </form>
    </div>
  );
}

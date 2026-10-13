import React, { useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { User, Mail, Shield, CheckCircle, AlertCircle, KeyRound, Building, Phone } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { users, updateUser, changePassword } = useUserStore();

  const currentUserData = users.find((u) => u.id === user?.id) || user;

  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }

  const [profileForm, setProfileForm] = useState({
    fullName: currentUserData?.fullName || '',
    email: currentUserData?.email || '',
    phone: currentUserData?.phone || currentUserData?.phoneNumber || '',
    department: currentUserData?.department || 'IT Operations',
    employeeId: currentUserData?.employeeId || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const showNotification = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      showNotification('Họ và tên không được để trống.', 'error');
      return;
    }

    if (user?.id) {
      updateUser(user.id, {
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        email: profileForm.email,
        employeeId: profileForm.employeeId,
      });

      const updatedUser = {
        ...user,
        fullName: profileForm.fullName,
        phone: profileForm.phone,
        email: profileForm.email,
        employeeId: profileForm.employeeId,
      };
      setUser(updatedUser);
    }

    showNotification('Thông tin hồ sơ cá nhân đã được lưu thành công!');
  };

  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showNotification('Vui lòng nhập mật khẩu hiện tại.', 'error');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showNotification('Mật khẩu mới phải có ít nhất 6 ký tự.', 'error');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('Xác nhận mật khẩu mới không khớp.', 'error');
      return;
    }

    if (!user?.id) return;

    const res = changePassword(user.id, passwordForm.currentPassword, passwordForm.newPassword);
    if (!res.success) {
      showNotification(res.message, 'error');
      return;
    }

    showNotification('Mật khẩu của bạn đã được thay đổi thành công!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Hồ Sơ Cá Nhân & Thiết Lập Tài Khoản
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Quản lý thông tin liên hệ nội bộ và mật khẩu bảo mật tài khoản
        </p>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center space-x-2 transition-all ${
            feedback.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Form Thông Tin Cơ Bản */}
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <Card title="Thông Tin Cán Bộ / Nhân Sự">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ và tên"
              name="fullName"
              icon={User}
              required
              value={profileForm.fullName}
              onChange={handleProfileChange}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Mã nhân viên (ID)</label>
              <input
                type="text"
                disabled
                value={profileForm.employeeId || `EMP-${String(user?.id || 1).padStart(4, '0')}`}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-mono cursor-not-allowed"
              />
            </div>

            <Input
              label="Email công ty / Đơn vị"
              name="email"
              icon={Mail}
              type="email"
              required
              value={profileForm.email}
              onChange={handleProfileChange}
            />

            <Input
              label="Số điện thoại di động / Máy nhánh"
              name="phone"
              icon={Phone}
              value={profileForm.phone}
              onChange={handleProfileChange}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phòng ban trực thuộc</label>
              <input
                type="text"
                disabled
                value={profileForm.department}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-slate-600 cursor-not-allowed font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vai trò hệ thống (Role)</label>
              <input
                type="text"
                disabled
                value={
                  user?.role === 'ADMIN'
                    ? 'Quản trị viên Hệ thống (ADMIN)'
                    : user?.role === 'MANAGER'
                    ? 'Trưởng phòng / Điều phối (MANAGER)'
                    : user?.role === 'AGENT'
                    ? 'Kỹ thuật viên IT (AGENT)'
                    : 'Cán bộ / Người dùng (CUSTOMER)'
                }
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-100 text-primary-700 cursor-not-allowed font-bold"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" size="sm">
              Lưu Thông Tin Cá Nhân
            </Button>
          </div>
        </Card>
      </form>

      {/* Form Đổi Mật Khẩu Bảo Mật */}
      <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
        <Card title="Thay Đổi Mật Khẩu Bảo Mật">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Mật khẩu hiện tại"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              required
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
            <Input
              label="Mật khẩu mới (Tối thiểu 6 ký tự)"
              name="newPassword"
              type="password"
              placeholder="••••••••"
              required
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
            <Input
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="outline" size="sm">
              <KeyRound className="w-3.5 h-3.5 mr-1 text-slate-600" />
              Cập Nhật Mật Khẩu Mới
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}

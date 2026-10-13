import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Danh sách tài khoản nội bộ doanh nghiệp ban đầu chuẩn hóa
export const INITIAL_USERS = [
  {
    id: 1,
    employeeId: 'EMP-0001',
    fullName: 'Nguyễn Quang Dũng',
    username: 'admin',
    email: 'admin@doanhnghiep.vn',
    password: 'password123',
    role: 'ADMIN',
    department: 'IT Operations & Hạ Tầng Mạng',
    departmentId: 1,
    phone: '0901.234.567',
    avatar: '',
    isActive: true,
    createdAt: '2026-01-15T08:00:00Z',
    lastLoginAt: '2026-10-13T08:30:00Z',
  },
  {
    id: 2,
    employeeId: 'EMP-0012',
    fullName: 'Lê Thị Cúc',
    username: 'manager',
    email: 'cuc.lt@doanhnghiep.vn',
    password: 'password123',
    role: 'MANAGER',
    department: 'IT Operations & Hạ Tầng Mạng',
    departmentId: 1,
    phone: '0902.345.678',
    avatar: '',
    isActive: true,
    createdAt: '2026-02-01T08:00:00Z',
    lastLoginAt: '2026-10-12T14:15:00Z',
  },
  {
    id: 3,
    employeeId: 'EMP-0045',
    fullName: 'Lê Văn Cường',
    username: 'cuong.lv',
    email: 'cuong.lv@doanhnghiep.vn',
    password: 'password123',
    role: 'AGENT',
    department: 'IT Operations & Hạ Tầng Mạng',
    departmentId: 1,
    phone: '0903.456.789',
    avatar: '',
    isActive: true,
    createdAt: '2026-02-10T08:00:00Z',
    lastLoginAt: '2026-10-13T07:45:00Z',
  },
  {
    id: 4,
    employeeId: 'EMP-0046',
    fullName: 'Trần Văn Bình',
    username: 'agent',
    email: 'binh.tv@doanhnghiep.vn',
    password: 'password123',
    role: 'AGENT',
    department: 'IT Operations & Hạ Tầng Mạng',
    departmentId: 1,
    phone: '0904.567.890',
    avatar: '',
    isActive: true,
    createdAt: '2026-02-15T08:00:00Z',
    lastLoginAt: '2026-10-13T09:10:00Z',
  },
  {
    id: 5,
    employeeId: 'EMP-0088',
    fullName: 'Trần Thị Bích',
    username: 'bich.tt',
    email: 'bich.tt@doanhnghiep.vn',
    password: 'password123',
    role: 'AGENT',
    department: 'Phát Triển Phần Mềm & ERP',
    departmentId: 2,
    phone: '0905.678.901',
    avatar: '',
    isActive: true,
    createdAt: '2026-03-01T08:00:00Z',
    lastLoginAt: '2026-10-11T16:20:00Z',
  },
  {
    id: 6,
    employeeId: 'EMP-0120',
    fullName: 'Nguyễn Thu Trang',
    username: 'customer',
    email: 'trang.nt@doanhnghiep.vn',
    password: 'password123',
    role: 'CUSTOMER',
    department: 'Marketing & Phát Triển Thị Trường',
    departmentId: 5,
    phone: '0912.345.678',
    avatar: '',
    isActive: true,
    createdAt: '2026-03-15T08:00:00Z',
    lastLoginAt: '2026-10-13T10:00:00Z',
  },
  {
    id: 7,
    employeeId: 'EMP-0155',
    fullName: 'Trần Văn Mạnh',
    username: 'manh.tv',
    email: 'manh.tv@doanhnghiep.vn',
    password: 'password123',
    role: 'CUSTOMER',
    department: 'Kế Toán & Tài Chính',
    departmentId: 4,
    phone: '0908.123.456',
    avatar: '',
    isActive: true,
    createdAt: '2026-04-01T08:00:00Z',
    lastLoginAt: '2026-10-10T11:30:00Z',
  },
  {
    id: 8,
    employeeId: 'EMP-0199',
    fullName: 'Hoàng Văn Khóa',
    username: 'khoa.hv',
    email: 'khoa.hv@doanhnghiep.vn',
    password: 'password123',
    role: 'CUSTOMER',
    department: 'Hành Chính & Nhân Sự (HR)',
    departmentId: 3,
    phone: '0977.112.233',
    avatar: '',
    isActive: false, // Tài khoản đã khóa
    createdAt: '2026-04-10T08:00:00Z',
    lastLoginAt: '2026-08-20T09:00:00Z',
  },
];

export const useUserStore = create(
  persist(
    (set, get) => ({
      users: INITIAL_USERS,

      // Xác thực đăng nhập thời gian thực
      authenticate: (usernameOrEmail, password) => {
        const { users } = get();
        const input = (usernameOrEmail || '').trim().toLowerCase();

        const foundUser = users.find(
          (u) =>
            u.username.toLowerCase() === input ||
            u.email.toLowerCase() === input ||
            (u.employeeId && u.employeeId.toLowerCase() === input)
        );

        if (!foundUser) {
          return {
            success: false,
            message: 'Tài khoản hoặc email không tồn tại trong hệ thống doanh nghiệp.',
          };
        }

        if (foundUser.password !== password) {
          return {
            success: false,
            message: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.',
          };
        }

        if (!foundUser.isActive) {
          return {
            success: false,
            message: 'Tài khoản này hiện đang bị tạm khóa. Vui lòng liên hệ Quản trị viên IT.',
          };
        }

        // Cập nhật thời điểm đăng nhập gần nhất
        const nowIso = new Date().toISOString();
        set((state) => ({
          users: state.users.map((u) =>
            u.id === foundUser.id ? { ...u, lastLoginAt: nowIso } : u
          ),
        }));

        const safeUser = { ...foundUser, lastLoginAt: nowIso };
        delete safeUser.password;

        const token = `jwt-token-helpdesk-${safeUser.id}-${Date.now()}`;

        return {
          success: true,
          user: safeUser,
          token,
          message: 'Đăng nhập thành công.',
        };
      },

      // Tạo tài khoản nhân sự mới
      addUser: (userData) => {
        const { users } = get();
        const emailLower = (userData.email || '').trim().toLowerCase();
        const usernameLower = (userData.username || '').trim().toLowerCase();

        // Kiểm tra trùng lặp email hoặc username
        if (users.some((u) => u.email.toLowerCase() === emailLower)) {
          return { success: false, message: 'Email này đã được sử dụng trong hệ thống.' };
        }
        if (users.some((u) => u.username.toLowerCase() === usernameLower)) {
          return { success: false, message: 'Tên đăng nhập này đã tồn tại.' };
        }

        const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
        const employeeId = userData.employeeId || `EMP-${String(newId).padStart(4, '0')}`;

        const newUser = {
          id: newId,
          employeeId,
          fullName: userData.fullName.trim(),
          username: usernameLower,
          email: emailLower,
          password: userData.password || 'password123',
          role: userData.role || 'CUSTOMER',
          department: userData.department || 'Phòng Ban Chung',
          departmentId: userData.departmentId || 1,
          phone: userData.phone || userData.phoneNumber || '',
          avatar: '',
          isActive: userData.isActive !== undefined ? userData.isActive : true,
          createdAt: new Date().toISOString(),
          lastLoginAt: null,
        };

        set((state) => ({
          users: [newUser, ...state.users],
        }));

        const safeUser = { ...newUser };
        delete safeUser.password;

        return { success: true, user: safeUser, message: 'Tạo tài khoản thành công.' };
      },

      // Cập nhật thông tin tài khoản
      updateUser: (userId, updateData) => {
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id !== userId) return u;
            return {
              ...u,
              ...updateData,
              fullName: updateData.fullName !== undefined ? updateData.fullName.trim() : u.fullName,
              department: updateData.department || u.department,
              role: updateData.role || u.role,
              phone: updateData.phone || updateData.phoneNumber || u.phone,
            };
          }),
        }));
        return { success: true, message: 'Cập nhật tài khoản thành công.' };
      },

      // Khóa hoặc mở khóa tài khoản
      toggleUserStatus: (userId) => {
        let newStatus = false;
        set((state) => ({
          users: state.users.map((u) => {
            if (u.id === userId) {
              newStatus = !u.isActive;
              return { ...u, isActive: newStatus };
            }
            return u;
          }),
        }));
        return {
          success: true,
          newStatus,
          message: newStatus ? 'Đã kích hoạt tài khoản.' : 'Đã khóa tài khoản.',
        };
      },

      // Đặt lại mật khẩu (Admin/Manager thao tác)
      resetPassword: (userId, newPassword = 'password123') => {
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, password: newPassword } : u
          ),
        }));
        return { success: true, message: `Mật khẩu đã được đặt lại thành: ${newPassword}` };
      },

      // Người dùng tự đổi mật khẩu
      changePassword: (userId, currentPassword, newPassword) => {
        const { users } = get();
        const found = users.find((u) => u.id === userId);
        if (!found) {
          return { success: false, message: 'Tài khoản không tồn tại.' };
        }
        if (found.password !== currentPassword) {
          return { success: false, message: 'Mật khẩu hiện tại không đúng.' };
        }
        if (!newPassword || newPassword.length < 6) {
          return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
        }

        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, password: newPassword } : u
          ),
        }));
        return { success: true, message: 'Đổi mật khẩu thành công.' };
      },

      // Khôi phục danh sách ban đầu
      resetUsers: () => {
        set({ users: INITIAL_USERS });
      },
    }),
    {
      name: 'helpdesk_users_store',
    }
  )
);

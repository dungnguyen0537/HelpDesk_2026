export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  AGENT: 'AGENT',
  CUSTOMER: 'CUSTOMER',
};

export const TICKET_STATUS = {
  NEW: { label: 'Mới tiếp nhận', color: 'bg-slate-100 text-slate-700 border-slate-300' },
  ASSIGNED: { label: 'Đã phân công', color: 'bg-sky-50 text-sky-700 border-sky-300' },
  IN_PROGRESS: { label: 'Đang xử lý', color: 'bg-amber-50 text-amber-700 border-amber-300' },
  WAITING_USER: { label: 'Chờ người dùng', color: 'bg-purple-50 text-purple-700 border-purple-300' },
  PENDING: { label: 'Chờ phản hồi', color: 'bg-indigo-50 text-indigo-700 border-indigo-300' },
  RESOLVED: { label: 'Đã giải quyết', color: 'bg-emerald-50 text-emerald-700 border-emerald-300' },
  CLOSED: { label: 'Đã đóng phiếu', color: 'bg-gray-100 text-gray-700 border-gray-300' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-rose-50 text-rose-700 border-rose-300' },
};

export const TICKET_PRIORITY = {
  LOW: { label: 'Thấp', color: 'text-blue-600 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
  MEDIUM: { label: 'Trung bình', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  HIGH: { label: 'Cao', color: 'text-amber-600 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
  URGENT: { label: 'Khẩn cấp', color: 'text-rose-600 bg-rose-50 border-rose-200', dot: 'bg-rose-500 animate-pulse' },
};

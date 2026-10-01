import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 8 Realistic Seed Tickets for HelpDesk Management System
export const initialTickets = [
  {
    id: 'TIK-2026-0041',
    title: 'Mất kết nối Switch tầng 3 tòa nhà trung tâm',
    department: 'IT Operations & Mạng',
    category: 'Hạ tầng Mạng & Wifi',
    creator: 'Nguyễn Thu Trang (Marketing)',
    creatorEmail: 'trang.nt@company.com',
    assignee: 'Lê Văn Cường',
    assignedTo: 'Lê Văn Cường (Senior Network)',
    status: 'IN_PROGRESS',
    priority: 'URGENT',
    createdAt: '2026-09-27T08:30:00Z',
    updatedAt: '2026-09-27T08:45:00Z',
    slaResolution: 'Còn 14 phút',
    slaRemaining: 'Còn 14 phút',
    slaNotice: 'Cam kết SLA: Phản hồi trong 15p - Hoàn thành trong 2h',
    isBreached: false,
    description:
      'Toàn bộ phòng Marketing tầng 3 mất mạng dây từ lúc 13h55. Đèn trên các cổng Switch nhấp nháy đỏ liên tục. Các máy trạm bị ngắt kết nối vào hệ thống ERP và không thể in tài liệu hợp đồng gấp gửi đối tác.',
    location: 'Tòa nhà trung tâm, Tầng 3',
    phone: '0912.345.678',
    attachments: [{ name: 'switch_error_light.jpg', size: '1.4 MB' }],
    comments: [
      {
        id: 1,
        author: 'Nguyễn Thu Trang',
        role: 'CUSTOMER',
        time: '14:00 (2 giờ trước)',
        createdAt: '2026-09-27T07:00:00Z',
        content:
          'Chào IT, hiện tại cả dãy phòng Marketing tầng 3 đều không thể truy cập mạng LAN nội bộ và máy in mạng.',
        isInternal: false,
      },
      {
        id: 2,
        author: 'Lê Văn Cường',
        role: 'AGENT',
        time: '14:15 (1 giờ 45 phút trước)',
        createdAt: '2026-09-27T07:15:00Z',
        content:
          'Ghi chú kỹ thuật: Đã kiểm tra cổng switch SW-FL03-01 có dấu hiệu loopback hoặc mất nguồn PoE.',
        isInternal: true,
      },
      {
        id: 3,
        author: 'Lê Văn Cường',
        role: 'AGENT',
        time: '14:20 (1 giờ 40 phút trước)',
        createdAt: '2026-09-27T07:20:00Z',
        content:
          'Chào chị Trang, đội kỹ thuật đang trực tiếp lên phòng máy tầng 3 kiểm tra thiết bị Switch. Dự kiến khắc phục trong 30 phút.',
        isInternal: false,
      },
    ],
    history: [
      { id: 1, time: '14:00', date: '27/09/2026', content: 'Tạo phiếu hỗ trợ bởi Nguyễn Thu Trang', type: 'create' },
      { id: 2, time: '14:05', date: '27/09/2026', content: 'Hệ thống gán tự động cho Lê Văn Cường', type: 'assign' },
      { id: 3, time: '14:15', date: '27/09/2026', content: 'Chuyển trạng thái sang IN_PROGRESS', type: 'status' },
    ],
  },
  {
    id: 'TIK-2026-0040',
    title: 'Yêu cầu cấp tài khoản phần mềm kế toán MISA',
    department: 'Phần mềm Kế toán / ERP',
    category: 'Cấp quyền & Reset Mật khẩu',
    creator: 'Trần Văn Mạnh (Kế toán)',
    creatorEmail: 'manh.tv@company.com',
    assignee: 'Phạm Thị Lan',
    assignedTo: 'Phạm Thị Lan (ERP Specialist)',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    createdAt: '2026-09-26T14:15:00Z',
    updatedAt: '2026-09-26T16:30:00Z',
    slaResolution: 'Đạt SLA',
    slaRemaining: 'Đạt SLA',
    slaNotice: 'Đã xử lý đúng hạn cam kết SLA',
    isBreached: false,
    description:
      'Nhân viên mới cần cấp quyền vào phân hệ kho và bán hàng trên MISA SME 2026 để làm việc ca sáng.',
    location: 'Phòng Kế toán, Tầng 2',
    phone: '0908.123.456',
    attachments: [{ name: 'form_cap_quyen.pdf', size: '540 KB' }],
    comments: [
      {
        id: 1,
        author: 'Trần Văn Mạnh',
        role: 'CUSTOMER',
        time: 'Hôm qua',
        createdAt: '2026-09-26T14:15:00Z',
        content: 'Đã đính kèm phiếu đề xuất đã có chữ ký duyệt của Kế toán trưởng.',
        isInternal: false,
      },
      {
        id: 2,
        author: 'Phạm Thị Lan',
        role: 'AGENT',
        time: 'Hôm qua',
        createdAt: '2026-09-26T16:25:00Z',
        content:
          'Đã tạo tài khoản manh.tv và phân quyền nhóm Kế toán kho. Vui lòng kiểm tra email để nhận mật khẩu khởi tạo.',
        isInternal: false,
      },
    ],
    history: [
      { id: 1, time: '14:15', date: '26/09/2026', content: 'Tạo phiếu hỗ trợ bởi Trần Văn Mạnh', type: 'create' },
      { id: 2, time: '14:30', date: '26/09/2026', content: 'Phân công cho Phạm Thị Lan', type: 'assign' },
      { id: 3, time: '16:30', date: '26/09/2026', content: 'Chuyển trạng thái sang RESOLVED', type: 'status' },
    ],
  },
  {
    id: 'TIK-2026-0039',
    title: 'Lỗi phân quyền hệ thống thanh toán hóa đơn ERP',
    department: 'Phát triển Sản phẩm',
    category: 'Phần mềm & Hệ thống',
    creator: 'Đặng Tuấn Anh (Tài chính)',
    creatorEmail: 'anh.dt@company.com',
    assignee: 'Trần Thị Bích',
    assignedTo: 'Trần Thị Bích (System Admin)',
    status: 'ASSIGNED',
    priority: 'HIGH',
    createdAt: '2026-09-27T07:45:00Z',
    updatedAt: '2026-09-27T08:10:00Z',
    slaResolution: 'Còn 42 phút',
    slaRemaining: 'Còn 42 phút',
    slaNotice: 'Cam kết SLA: Phản hồi trong 30p - Hoàn thành trong 4h',
    isBreached: false,
    description:
      'Khi phê duyệt lệnh chuyển tiền thanh toán cho nhà cung cấp, hệ thống báo lỗi 403 Forbidden Access Violation.',
    location: 'Phòng Tài chính, Tầng 4',
    phone: '0977.888.999',
    attachments: [{ name: 'error_log_403.png', size: '820 KB' }],
    comments: [
      {
        id: 1,
        author: 'Đặng Tuấn Anh',
        role: 'CUSTOMER',
        time: '07:45 sáng nay',
        createdAt: '2026-09-27T07:45:00Z',
        content: 'Các lệnh chuyển tiền gấp cần duyệt trước 10h sáng.',
        isInternal: false,
      },
    ],
    history: [
      { id: 1, time: '07:45', date: '27/09/2026', content: 'Tạo phiếu hỗ trợ bởi Đặng Tuấn Anh', type: 'create' },
      { id: 2, time: '08:00', date: '27/09/2026', content: 'Phân công cho Trần Thị Bích', type: 'assign' },
    ],
  },
  {
    id: 'TIK-2026-0038',
    title: 'Không thể in tài liệu từ máy in tầng 2 qua Wifi',
    department: 'IT Operations & Mạng',
    category: 'Máy in & Thiết bị số',
    creator: 'Lê Mai Anh (Nhân sự)',
    creatorEmail: 'anh.lm@company.com',
    assignee: null,
    assignedTo: null,
    status: 'NEW',
    priority: 'MEDIUM',
    createdAt: '2026-09-27T09:10:00Z',
    updatedAt: '2026-09-27T09:10:00Z',
    slaResolution: 'Còn 1 giờ 15 phút',
    slaRemaining: 'Còn 1 giờ 15 phút',
    slaNotice: 'Cam kết SLA: Phản hồi trong 1h - Hoàn thành trong 8h',
    isBreached: false,
    description:
      'Máy in Canon LBP2900 trên mạng LAN văn phòng tầng 2 báo offline trên máy tính Windows mặc dù đèn nguồn vẫn sáng xanh.',
    location: 'Phòng Hành chính Nhân sự, Tầng 2',
    phone: '0933.444.555',
    attachments: [],
    comments: [],
    history: [
      { id: 1, time: '09:10', date: '27/09/2026', content: 'Tạo phiếu hỗ trợ bởi Lê Mai Anh', type: 'create' },
    ],
  },
  {
    id: 'TIK-2026-0035',
    title: 'Máy in hóa đơn xuất khẩu kẹt giấy không in được',
    department: 'Hành chính & Thiết bị VP',
    category: 'Máy in & Thiết bị số',
    creator: 'Hoàng Quốc Việt (Kho vận)',
    creatorEmail: 'viet.hq@company.com',
    assignee: null,
    assignedTo: null,
    status: 'NEW',
    priority: 'URGENT',
    createdAt: '2026-09-26T16:00:00Z',
    updatedAt: '2026-09-26T16:00:00Z',
    slaResolution: 'Quá hạn 2 giờ',
    slaRemaining: 'Quá hạn 2 giờ',
    slaNotice: 'Vi phạm SLA: Đã trễ hạn xử lý quy định',
    isBreached: true,
    description:
      'Máy in tem mã vạch Zebra ở kho hàng xuất khẩu bị kẹt trục lăn giấy, xe tải đang chờ lấy hàng xuất bến gấp.',
    location: 'Kho tổng Logistic, Khu B',
    phone: '0944.555.666',
    attachments: [{ name: 'zebra_printer_jam.jpg', size: '2.1 MB' }],
    comments: [],
    history: [
      { id: 1, time: '16:00', date: '26/09/2026', content: 'Tạo phiếu hỗ trợ bởi Hoàng Quốc Việt', type: 'create' },
    ],
  },
  {
    id: 'TIK-2026-0032',
    title: 'Màn hình máy tính Dell 24 inch tại bàn làm việc bị sọc ngang',
    department: 'IT Operations & Mạng',
    category: 'Phần cứng & Thiết bị',
    creator: 'Nguyễn Thu Trang (Marketing)',
    creatorEmail: 'trang.nt@company.com',
    assignee: 'Trần Văn Bình',
    assignedTo: 'Trần Văn Bình (Kỹ Thuật Viên IT)',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    createdAt: '2026-09-27T06:15:00Z',
    updatedAt: '2026-09-27T06:45:00Z',
    slaResolution: 'Còn 35 phút',
    slaRemaining: 'Còn 35 phút',
    slaNotice: 'Cam kết SLA: Phản hồi trong 15p - Hoàn thành trong 2h',
    isBreached: false,
    description:
      'Màn hình Dell P2419H bị chớp nháy và xuất hiện các sọc ngang màu xanh lá cây khi mở các file đồ họa nặng.',
    location: 'Tòa nhà A, Tầng 3, Bàn Marketing 12',
    phone: '0912.345.678',
    attachments: [{ name: 'screen_glitch.png', size: '3.1 MB' }],
    comments: [
      {
        id: 1,
        author: 'Nguyễn Thu Trang',
        role: 'CUSTOMER',
        time: '06:15 sáng',
        createdAt: '2026-09-27T06:15:00Z',
        content: 'Đã thử cắm lại cáp HDMI nhưng vẫn bị hiện tượng tương tự.',
        isInternal: false,
      },
      {
        id: 2,
        author: 'Trần Văn Bình',
        role: 'AGENT',
        time: '06:40 sáng',
        createdAt: '2026-09-27T06:40:00Z',
        content: 'Kỹ thuật sẽ mang cáp DisplayPort và màn hình dự phòng lên thay thế kiểm tra.',
        isInternal: false,
      },
    ],
    history: [
      { id: 1, time: '06:15', date: '27/09/2026', content: 'Tạo phiếu hỗ trợ bởi Nguyễn Thu Trang', type: 'create' },
      { id: 2, time: '06:30', date: '27/09/2026', content: 'Phân công cho Trần Văn Bình', type: 'assign' },
      { id: 3, time: '06:45', date: '27/09/2026', content: 'Chuyển trạng thái sang IN_PROGRESS', type: 'status' },
    ],
  },
  {
    id: 'TIK-2026-0028',
    title: 'Xin cấp quyền truy cập thư mục Báo cáo Tài chính Q1/2026',
    department: 'Phần mềm Kế toán / ERP',
    category: 'Tài khoản & Phân quyền',
    creator: 'Đặng Tuấn Anh (Tài chính)',
    creatorEmail: 'anh.dt@company.com',
    assignee: 'Lê Thị Cúc',
    assignedTo: 'Lê Thị Cúc (Quản Lý Dịch Vụ)',
    status: 'RESOLVED',
    priority: 'MEDIUM',
    createdAt: '2026-09-25T09:00:00Z',
    updatedAt: '2026-09-25T16:30:00Z',
    slaResolution: 'Đạt SLA',
    slaRemaining: 'Đạt SLA',
    slaNotice: 'Đã xử lý đúng hạn cam kết SLA',
    isBreached: false,
    description:
      'Cần phân quyền Read/Write trên shared folder \\\\nas01\\Finance\\Reports\\2026 để tổng hợp báo cáo kiểm toán.',
    location: 'Tòa nhà A, Tầng 4',
    phone: '0977.888.999',
    attachments: [],
    comments: [
      {
        id: 1,
        author: 'Lê Thị Cúc',
        role: 'AGENT',
        time: '2 ngày trước',
        createdAt: '2026-09-25T16:20:00Z',
        content: 'Đã thêm tài khoản vào Security Group Finance_Auditors trên Active Directory.',
        isInternal: false,
      },
    ],
    history: [
      { id: 1, time: '09:00', date: '25/09/2026', content: 'Tạo phiếu hỗ trợ bởi Đặng Tuấn Anh', type: 'create' },
      { id: 2, time: '16:30', date: '25/09/2026', content: 'Chuyển trạng thái sang RESOLVED', type: 'status' },
    ],
  },
  {
    id: 'TIK-2026-0021',
    title: 'Cài đặt phần mềm đọc file CAD và máy in văn phòng lầu 2',
    department: 'IT Operations & Mạng',
    category: 'Phần mềm & Hệ thống',
    creator: 'Trần Văn Mạnh (Kế toán)',
    creatorEmail: 'manh.tv@company.com',
    assignee: 'Trần Văn Bình',
    assignedTo: 'Trần Văn Bình (Kỹ Thuật Viên IT)',
    status: 'CLOSED',
    priority: 'LOW',
    createdAt: '2026-09-20T10:20:00Z',
    updatedAt: '2026-09-21T11:00:00Z',
    slaResolution: 'Đạt SLA',
    slaRemaining: 'Đạt SLA',
    slaNotice: 'Khách hàng đã đánh giá 5 sao ★★★★★',
    isBreached: false,
    description:
      'Hỗ trợ cài đặt phần mềm xem bản vẽ AutoCAD DWG TrueView và kết nối driver máy in đa chức năng.',
    location: 'Tòa nhà A, Tầng 2',
    phone: '0908.123.456',
    attachments: [],
    comments: [
      {
        id: 1,
        author: 'Trần Văn Bình',
        role: 'AGENT',
        time: 'Tuần trước',
        createdAt: '2026-09-21T10:45:00Z',
        content: 'Đã cài đặt xong phần mềm bản quyền miễn phí của Autodesk và in test thành công.',
        isInternal: false,
      },
    ],
    history: [
      { id: 1, time: '10:20', date: '20/09/2026', content: 'Tạo phiếu hỗ trợ bởi Trần Văn Mạnh', type: 'create' },
      { id: 2, time: '11:00', date: '21/09/2026', content: 'Chuyển trạng thái sang CLOSED', type: 'status' },
    ],
  },
];

// Helper to format current time for history
const getCurrentTimestamp = () => {
  const now = new Date();
  const time = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return { time, date, iso: now.toISOString() };
};

// Helper for Department resolution
const resolveDepartment = (dept) => {
  const map = {
    '1': 'IT Operations & Mạng',
    '2': 'Hành chính & Thiết bị VP',
    '3': 'Phần mềm Kế toán / ERP',
    '4': 'Phát triển Sản phẩm',
  };
  return map[dept] || dept || 'IT Operations & Mạng';
};

// Helper for Category resolution
const resolveCategory = (cat) => {
  const map = {
    '1': 'Phần cứng & Thiết bị',
    '2': 'Mạng LAN, Wi-Fi & VPN',
    '3': 'Phần mềm & Hệ thống',
    '4': 'Tài khoản & Phân quyền',
  };
  return map[cat] || cat || 'Hỗ trợ kỹ thuật';
};

// Priority Calculation Matrix according to University ITSM Specification (Section III.3)
// Impact: BROAD (Rộng), GROUP (Nhóm), PERSONAL (Cá nhân)
// Urgency: HIGH (Cao), MEDIUM (Trung bình), LOW (Thấp)
export const calculatePriorityMatrix = (impact = 'PERSONAL', urgency = 'MEDIUM') => {
  const imp = (impact || 'PERSONAL').toUpperCase();
  const urg = (urgency || 'MEDIUM').toUpperCase();

  if (imp === 'BROAD' || imp === 'WIDE' || imp === 'ALL') {
    if (urg === 'HIGH' || urg === 'URGENT') return 'URGENT'; // P1
    if (urg === 'MEDIUM') return 'HIGH'; // P2
    return 'MEDIUM'; // P3
  }
  if (imp === 'GROUP' || imp === 'ROOM') {
    if (urg === 'HIGH' || urg === 'URGENT') return 'HIGH'; // P2
    if (urg === 'MEDIUM') return 'MEDIUM'; // P3
    return 'LOW'; // P4
  }
  // PERSONAL / INDIVIDUAL
  if (urg === 'HIGH' || urg === 'URGENT') return 'MEDIUM'; // P3
  return 'LOW'; // P4
};

// Helper for Priority resolution
const resolvePriority = (p, impact, urgency) => {
  if (impact && urgency) {
    return calculatePriorityMatrix(impact, urgency);
  }
  const map = {
    '1': 'LOW',
    '2': 'MEDIUM',
    '3': 'HIGH',
    '4': 'URGENT',
    'P1': 'URGENT',
    'P2': 'HIGH',
    'P3': 'MEDIUM',
    'P4': 'LOW',
    'LOW': 'LOW',
    'MEDIUM': 'MEDIUM',
    'HIGH': 'HIGH',
    'URGENT': 'URGENT',
  };
  return map[p] || 'MEDIUM';
};

// SLA Calculation according to ITSM Specification
// P1: Phản hồi 15m, Giải quyết 4h
// P2: Phản hồi 30m, Giải quyết 8h làm việc
// P3: Phản hồi 2h làm việc, Giải quyết 3 ngày làm việc
// P4: Phản hồi 1 ngày làm việc, Giải quyết 5 ngày làm việc
const calculateSLA = (priority) => {
  switch (priority) {
    case 'URGENT': // P1
      return {
        priorityCode: 'P1',
        slaResolution: 'Còn 4 giờ',
        slaRemaining: 'Còn 4 giờ',
        slaNotice: 'Cam kết P1: Phản hồi trong 15p - Giải quyết trong 4h',
        firstResponseSLA: '15 phút',
        resolutionSLA: '4 giờ',
        eta: '15 - 30 phút',
      };
    case 'HIGH': // P2
      return {
        priorityCode: 'P2',
        slaResolution: 'Còn 8 giờ làm việc',
        slaRemaining: 'Còn 8 giờ làm việc',
        slaNotice: 'Cam kết P2: Phản hồi trong 30p - Giải quyết trong 8h làm việc',
        firstResponseSLA: '30 phút',
        resolutionSLA: '8 giờ làm việc',
        eta: '1 - 2 giờ',
      };
    case 'LOW': // P4
      return {
        priorityCode: 'P4',
        slaResolution: 'Còn 5 ngày làm việc',
        slaRemaining: 'Còn 5 ngày làm việc',
        slaNotice: 'Cam kết P4: Phản hồi trong 1 ngày - Giải quyết trong 5 ngày làm việc',
        firstResponseSLA: '1 ngày làm việc',
        resolutionSLA: '5 ngày làm việc',
        eta: 'Trong 5 ngày',
      };
    case 'MEDIUM': // P3
    default:
      return {
        priorityCode: 'P3',
        slaResolution: 'Còn 3 ngày làm việc',
        slaRemaining: 'Còn 3 ngày làm việc',
        slaNotice: 'Cam kết P3: Phản hồi trong 2h làm việc - Giải quyết trong 3 ngày làm việc',
        firstResponseSLA: '2 giờ làm việc',
        resolutionSLA: '3 ngày làm việc',
        eta: '2 - 4 giờ làm việc',
      };
  }
};

export const useTicketStore = create(
  persist(
    (set, get) => ({
      tickets: initialTickets,

      // Create a new ticket
      createTicket: (ticketData) => {
        const { time, date, iso } = getCurrentTimestamp();
        const impact = ticketData.impact || 'PERSONAL';
        const urgency = ticketData.urgency || ticketData.priority || 'MEDIUM';
        const priority = ticketData.isClassroomEmergency
          ? 'URGENT' // Classroom Emergency elevated immediately to P1
          : resolvePriority(ticketData.priority || ticketData.urgency, impact, urgency);
        const sla = calculateSLA(priority);

        // Generate Ticket ID: HD-2026-XXXX
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const generatedId = `HD-2026-00${randomNum}`;

        const newTicket = {
          id: generatedId,
          title: ticketData.title || 'Yêu cầu hỗ trợ kỹ thuật',
          ticketType: ticketData.ticketType || 'INCIDENT', // INCIDENT (Sự cố), SERVICE_REQUEST, QUESTION
          impact: impact,
          urgencyLevel: urgency,
          isClassroomEmergency: Boolean(ticketData.isClassroomEmergency),
          department: resolveDepartment(ticketData.department || ticketData.departmentId),
          category: resolveCategory(ticketData.category || ticketData.categoryId),
          subCategory: ticketData.subCategory || '',
          creator: ticketData.creator || 'Người dùng hệ thống',
          creatorEmail: ticketData.creatorEmail || 'user@company.com',
          assignee: null,
          assignedTo: null,
          status: 'NEW',
          priority: priority,
          priorityCode: sla.priorityCode,
          createdAt: iso,
          updatedAt: iso,
          slaResolution: sla.slaResolution,
          slaRemaining: sla.slaRemaining,
          slaNotice: sla.slaNotice,
          firstResponseSLA: sla.firstResponseSLA,
          resolutionSLA: sla.resolutionSLA,
          eta: sla.eta,
          isBreached: false,
          reopenCount: 0,
          resolutionReason: '',
          solutionText: '',
          rating: null,
          feedback: '',
          description: ticketData.description || '',
          location: ticketData.location || 'Văn phòng làm việc',
          phone: ticketData.phone || '0912.345.678',
          attachments: ticketData.attachments || [],
          comments: [],
          history: [
            {
              id: Date.now(),
              time,
              date,
              content: `Tạo phiếu hỗ trợ bởi ${ticketData.creator || 'Người dùng'}`,
              type: 'create',
            },
          ],
        };

        set((state) => ({
          tickets: [newTicket, ...state.tickets],
        }));

        return newTicket;
      },

      // Update ticket status
      updateTicketStatus: (ticketId, newStatus) => {
        const { time, date, iso } = getCurrentTimestamp();

        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId) return ticket;

            const isResolved = newStatus === 'RESOLVED' || newStatus === 'CLOSED';
            const updatedHistory = [
              ...(ticket.history || []),
              {
                id: Date.now(),
                time,
                date,
                content: `Chuyển trạng thái sang ${newStatus}`,
                type: 'status',
              },
            ];

            return {
              ...ticket,
              status: newStatus,
              updatedAt: iso,
              slaResolution: isResolved ? 'Đạt SLA' : ticket.slaResolution,
              slaRemaining: isResolved ? 'Đạt SLA' : ticket.slaRemaining,
              isBreached: isResolved ? false : ticket.isBreached,
              history: updatedHistory,
            };
          }),
        }));
      },

      // Assign technician
      assignTicket: (ticketId, assigneeName) => {
        const { time, date, iso } = getCurrentTimestamp();

        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId) return ticket;

            const updatedHistory = [
              ...(ticket.history || []),
              {
                id: Date.now(),
                time,
                date,
                content: `Phân công kỹ thuật viên phụ trách: ${assigneeName}`,
                type: 'assign',
              },
            ];

            // Auto-advance status to ASSIGNED if previously NEW
            const nextStatus = ticket.status === 'NEW' ? 'ASSIGNED' : ticket.status;

            return {
              ...ticket,
              assignee: assigneeName,
              assignedTo: assigneeName,
              status: nextStatus,
              updatedAt: iso,
              history: updatedHistory,
            };
          }),
        }));
      },

      // Add comment to a ticket
      addComment: (ticketId, comment) => {
        const { time, date, iso } = getCurrentTimestamp();

        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId) return ticket;

            const isCustomer = comment.role === 'CUSTOMER';
            // Auto resume clock: If ticket was WAITING_USER and customer replies, switch back to IN_PROGRESS
            const nextStatus =
              ticket.status === 'WAITING_USER' && isCustomer ? 'IN_PROGRESS' : ticket.status;

            const newComment = {
              id: Date.now(),
              author: comment.author || 'Bạn (Quản Trị / Kỹ Thuật)',
              role: comment.role || 'AGENT',
              time: 'Vừa xong',
              createdAt: iso,
              content: comment.content,
              isInternal: Boolean(comment.isInternal),
            };

            const updatedHistory = [
              ...(ticket.history || []),
              {
                id: Date.now(),
                time,
                date,
                content: `${comment.isInternal ? 'Thêm ghi chú nội bộ' : 'Thêm phản hồi'} bởi ${newComment.author}${
                  ticket.status === 'WAITING_USER' && isCustomer ? ' (Đã mở lại đồng hồ xử lý -> Đang xử lý)' : ''
                }`,
                type: 'comment',
              },
            ];

            return {
              ...ticket,
              status: nextStatus,
              updatedAt: iso,
              comments: [...(ticket.comments || []), newComment],
              history: updatedHistory,
            };
          }),
        }));
      },

      // Resolve ticket with mandatory cause and solution
      resolveTicket: (ticketId, resolutionReason, solutionText) => {
        const { time, date, iso } = getCurrentTimestamp();

        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId) return ticket;

            const updatedHistory = [
              ...(ticket.history || []),
              {
                id: Date.now(),
                time,
                date,
                content: `Đánh dấu đã giải quyết. Nguyên nhân: ${resolutionReason || 'Đã kiểm tra'}. Giải pháp: ${solutionText || 'Đã khắc phục'}`,
                type: 'status',
              },
            ];

            return {
              ...ticket,
              status: 'RESOLVED',
              resolutionReason: resolutionReason || ticket.resolutionReason,
              solutionText: solutionText || ticket.solutionText,
              updatedAt: iso,
              slaResolution: 'Đạt SLA',
              slaRemaining: 'Đạt SLA',
              isBreached: false,
              history: updatedHistory,
            };
          }),
        }));
      },

      // Customer Reopen Ticket (Max 2 times, on 3rd escalate to Manager)
      reopenTicket: (ticketId, reason) => {
        const { time, date, iso } = getCurrentTimestamp();

        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId) return ticket;

            const currentReopenCount = (ticket.reopenCount || 0) + 1;
            const isEscalated = currentReopenCount >= 3;

            const contentLog = isEscalated
              ? `Khách hàng mở lại lần ${currentReopenCount}. Vượt giới hạn 2 lần! Hệ thống tự động chuyển lên Quản lý can thiệp. Lý do: ${reason}`
              : `Khách hàng mở lại phiếu lần ${currentReopenCount}/2. Lý do: ${reason}`;

            const updatedHistory = [
              ...(ticket.history || []),
              {
                id: Date.now(),
                time,
                date,
                content: contentLog,
                type: 'status',
              },
            ];

            return {
              ...ticket,
              status: 'IN_PROGRESS',
              reopenCount: currentReopenCount,
              priority: isEscalated ? 'URGENT' : ticket.priority,
              priorityCode: isEscalated ? 'P1' : ticket.priorityCode,
              isEscalatedToManager: isEscalated,
              updatedAt: iso,
              slaResolution: 'Đã tính lại hạn xử lý',
              slaRemaining: 'Đang theo dõi',
              history: updatedHistory,
            };
          }),
        }));
      },

      // Rate ticket and submit CSAT feedback
      rateTicket: (ticketId, rating, feedback) => {
        const { time, date, iso } = getCurrentTimestamp();

        set((state) => ({
          tickets: state.tickets.map((ticket) => {
            if (ticket.id !== ticketId) return ticket;

            const updatedHistory = [
              ...(ticket.history || []),
              {
                id: Date.now(),
                time,
                date,
                content: `Khách hàng đánh giá chất lượng ${rating} sao: "${feedback || 'Không có nhận xét'}"`,
                type: 'rating',
              },
            ];

            return {
              ...ticket,
              status: 'CLOSED',
              rating: rating,
              feedback: feedback || '',
              updatedAt: iso,
              history: updatedHistory,
            };
          }),
        }));
      },

      // Reset tickets back to initial seed
      resetTickets: () => {
        set({ tickets: initialTickets });
      },

      // Filter tickets selector helper
      filterTickets: (filters = {}) => {
        const { tickets } = get();
        const { search = '', status = 'ALL', priority = 'ALL', department = 'ALL', tab = 'ALL' } = filters;

        return tickets.filter((ticket) => {
          // Search
          const matchesSearch =
            !search ||
            ticket.id.toLowerCase().includes(search.toLowerCase()) ||
            ticket.title.toLowerCase().includes(search.toLowerCase()) ||
            (ticket.creator && ticket.creator.toLowerCase().includes(search.toLowerCase())) ||
            (ticket.assignee && ticket.assignee.toLowerCase().includes(search.toLowerCase()));

          // Tab
          const matchesTab =
            tab === 'ALL'
              ? true
              : tab === 'UNASSIGNED'
              ? !ticket.assignee
              : tab === 'BREACHED'
              ? ticket.isBreached
              : tab === 'RESOLVED'
              ? ticket.status === 'RESOLVED' || ticket.status === 'CLOSED'
              : tab === 'ACTIVE'
              ? ticket.status !== 'RESOLVED' && ticket.status !== 'CLOSED'
              : true;

          // Status & Priority & Dept
          const matchesStatus = status === 'ALL' || ticket.status === status;
          const matchesPriority = priority === 'ALL' || ticket.priority === priority;
          const matchesDept = department === 'ALL' || ticket.department === department;

          return matchesSearch && matchesTab && matchesStatus && matchesPriority && matchesDept;
        });
      },
    }),
    {
      name: 'helpdesk_tickets_store',
    }
  )
);

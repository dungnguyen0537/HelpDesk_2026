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

// Helper for Priority resolution
const resolvePriority = (p) => {
  const map = {
    '1': 'LOW',
    '2': 'MEDIUM',
    '3': 'HIGH',
    '4': 'URGENT',
    'LOW': 'LOW',
    'MEDIUM': 'MEDIUM',
    'HIGH': 'HIGH',
    'URGENT': 'URGENT',
  };
  return map[p] || 'MEDIUM';
};

// Helper to calculate SLA information based on priority
const calculateSLA = (priority) => {
  switch (priority) {
    case 'URGENT':
      return {
        slaResolution: 'Còn 2 giờ',
        slaRemaining: 'Còn 2 giờ',
        slaNotice: 'Cam kết SLA: Phản hồi trong 15p - Hoàn thành trong 2h',
        eta: '15 - 30 phút',
      };
    case 'HIGH':
      return {
        slaResolution: 'Còn 4 giờ',
        slaRemaining: 'Còn 4 giờ',
        slaNotice: 'Cam kết SLA: Phản hồi trong 30p - Hoàn thành trong 4h',
        eta: '1 - 2 giờ',
      };
    case 'LOW':
      return {
        slaResolution: 'Còn 24 giờ',
        slaRemaining: 'Còn 24 giờ',
        slaNotice: 'Cam kết SLA: Phản hồi trong 2h - Hoàn thành trong 24h',
        eta: 'Trong 24 giờ',
      };
    case 'MEDIUM':
    default:
      return {
        slaResolution: 'Còn 8 giờ',
        slaRemaining: 'Còn 8 giờ',
        slaNotice: 'Cam kết SLA: Phản hồi trong 1h - Hoàn thành trong 8h',
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
        const priority = resolvePriority(ticketData.priority || ticketData.priorityId || ticketData.urgency);
        const sla = calculateSLA(priority);

        // Generate Ticket ID: TIK-2026-XXXX
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const generatedId = `TIK-2026-${randomNum}`;

        const newTicket = {
          id: generatedId,
          title: ticketData.title || 'Yêu cầu hỗ trợ kỹ thuật',
          department: resolveDepartment(ticketData.department || ticketData.departmentId),
          category: resolveCategory(ticketData.category || ticketData.categoryId),
          creator: ticketData.creator || 'Người dùng hệ thống',
          creatorEmail: ticketData.creatorEmail || 'user@company.com',
          assignee: null,
          assignedTo: null,
          status: 'NEW',
          priority: priority,
          createdAt: iso,
          updatedAt: iso,
          slaResolution: sla.slaResolution,
          slaRemaining: sla.slaRemaining,
          slaNotice: sla.slaNotice,
          eta: sla.eta,
          isBreached: false,
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
                content: `${comment.isInternal ? 'Thêm ghi chú nội bộ' : 'Thêm phản hồi'} bởi ${newComment.author}`,
                type: 'comment',
              },
            ];

            return {
              ...ticket,
              updatedAt: iso,
              comments: [...(ticket.comments || []), newComment],
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

# UI/UX Wireframe & Sitemap - HelpDesk Enterprise System

> **Tác giả:** TV4 (Frontend Lead Developer)  
> **Công nghệ:** React 18, Vite, Tailwind CSS, Zustand, React Router Dom v6, Lucide React, Recharts, Axios  
> **Đối tượng sử dụng:** CUSTOMER, AGENT, MANAGER, ADMIN  

---

## 1. Thông Tin Kiến Trúc & Phân Quyền (RBAC Matrix)

Hệ thống HelpDesk được thiết kế chuẩn Enterprise, tuân thủ mô hình phân quyền chặt chẽ dựa trên 4 Roles:
- **CUSTOMER (Khách hàng / Nhân viên nội bộ gửi yêu cầu):** Tạo phiếu, theo dõi tiến độ phiếu của mình, trao đổi qua comment công khai, đính kèm tệp, đánh giá CSAT sau khi ticket đóng, tra cứu FAQ/Knowledge Base.
- **AGENT (Hỗ trợ viên / Kỹ thuật viên):** Tiếp nhận ticket (Claim), lọc ticket theo trạng thái/SLA, cập nhật trạng thái (In Progress, Pending, Resolved), thêm ghi chú nội bộ (Internal Notes) hoặc phản hồi cho khách, tạo bài viết tri thức mới.
- **MANAGER (Trưởng bộ phận / Quản lý):** Toàn quyền xem và điều phối ticket của bộ phận, phân công thủ công (Assign/Reassign), quản lý quy tắc leo thang SLA, xem báo cáo năng suất làm việc của Agent, chỉ số CSAT & SLA breach rate.
- **ADMIN (Quản trị viên hệ thống):** Quản lý toàn bộ danh mục hệ thống (Users, Departments, Categories, Priorities, SLA Policies, System Audit Logs, System Settings).

### Bảng Phân Quyền Theo Màn Hình

| STT | Mã Màn Hình | Tên Màn Hình | Đường Dẫn (Route) | Customer | Agent | Manager | Admin |
|:---:|:---|:---|:---|:---:|:---:|:---:|:---:|
| 1 | SCR-AUTH-01 | Đăng nhập (Sign In) | `/login` |  |  |  |  |
| 2 | SCR-AUTH-02 | Đăng ký (Register) | `/register` |  | - | - | - |
| 3 | SCR-DASH-01 | Dashboard Tổng quan | `/dashboard` |  (User View) |  (Agent View) |  (Manager View) |  (Admin View) |
| 4 | SCR-TIK-01 | Danh sách Ticket | `/tickets` |  (Của tôi) |  (Phân công/Bộ phận) |  (Tất cả bộ phận) |  (Toàn hệ thống) |
| 5 | SCR-TIK-02 | Chi tiết Ticket & Trao đổi | `/tickets/:id` |  (Xem/Bình luận) |  (Xử lý/Ghi chú) |  (Điều phối/Escalate) |  (Toàn quyền) |
| 6 | SCR-TIK-03 | Tạo mới Ticket | `/tickets/new` |  |  |  |  |
| 7 | SCR-KB-01 | Tra cứu Knowledge Base / FAQ | `/knowledge-base` |  (Đọc/Tìm kiếm) |  (Đọc/Đề xuất) |  (Đọc/Duyệt) |  (Quản trị bài viết) |
| 8 | SCR-KB-02 | Chi tiết bài viết tri thức | `/knowledge-base/:id` |  |  |  |  |
| 9 | SCR-RPT-01 | Báo cáo & Thống kê SLA | `/reports` | - | - |  |  |
| 10 | SCR-ADM-01 | Quản lý Người dùng (Users) | `/admin/users` | - | - | - |  |
| 11 | SCR-ADM-02 | Quản lý Phòng ban & Danh mục | `/admin/departments` | - | - | - |  |
| 12 | SCR-ADM-03 | Cấu hình SLA & Escalation Rules | `/admin/sla-policies` | - | - |  |  |
| 13 | SCR-USR-01 | Hồ sơ cá nhân & Cài đặt | `/profile` |  |  |  |  |

---

## 2. Bản Đồ Trang Web (Sitemap Architecture)

```
[HelpDesk Web Application]
│
├── /login ---------------------------- (SCR-AUTH-01: Đăng nhập)
├── /register ------------------------- (SCR-AUTH-02: Đăng ký tài khoản)
├── /forgot-password ------------------ (Khôi phục mật khẩu)
│
└── [Main Layout: Sidebar + Header + Breadcrumb + Global Alert Container]
    │
    ├── /dashboard -------------------- (SCR-DASH-01: Dashboard thông minh theo Role)
    │
    ├── /tickets ---------------------- (SCR-TIK-01: Danh sách Ticket đa bộ lọc & phân trang)
    ├── /tickets/new ------------------ (SCR-TIK-03: Mẫu tạo Ticket kéo thả đính kèm tệp)
    ├── /tickets/:id ------------------ (SCR-TIK-02: Chi tiết xử lý Ticket, Timeline, SLA Countdown)
    │
    ├── /knowledge-base --------------- (SCR-KB-01: Tìm kiếm cứu trợ, chuyên mục FAQ)
    ├── /knowledge-base/:id ----------- (SCR-KB-02: Chi tiết bài viết, đánh giá hữu ích)
    │
    ├── /reports ---------------------- (SCR-RPT-01: Biểu đồ Recharts, Phân tích SLA, CSAT, Tỷ lệ Breach)
    │
    ├── /admin
    │   ├── /admin/users -------------- (SCR-ADM-01: Danh sách tài khoản, gán phòng ban, kích hoạt/khóa)
    │   ├── /admin/departments -------- (SCR-ADM-02: Quản lý Phòng ban & Cây danh mục Categories)
    │   └── /admin/sla-policies ------- (SCR-ADM-03: Cấu hình ma trận SLA & Quy tắc Escalation tự động)
    │
    ├── /profile ---------------------- (SCR-USR-01: Thông tin cá nhân, ca trực, đổi mật khẩu)
    └── /notifications ---------------- (Trung tâm thông báo thời gian thực)
```

---

## 3. Hệ Thống Design System & Layout Master

### 3.1. Tone Màu & Typography
- **Primary Color Palette:**
  - `primary-50`: `#eff6ff` (Light background)
  - `primary-500`: `#3b82f6` (Brand Blue)
  - `primary-600`: `#2563eb` (Button hover, active)
  - `primary-900`: `#1e3a8a` (Deep text, Header accent)
- **Status Colors (Tuân thủ trạng thái Ticket):**
  - `NEW`: Slate (`#64748b` - `bg-slate-100 text-slate-700 border-slate-300`)
  - `ASSIGNED`: Sky (`#0284c7` - `bg-sky-50 text-sky-700 border-sky-300`)
  - `IN_PROGRESS`: Amber (`#d97706` - `bg-amber-50 text-amber-700 border-amber-300`)
  - `PENDING`: Purple (`#9333ea` - `bg-purple-50 text-purple-700 border-purple-300`)
  - `RESOLVED`: Emerald (`#059669` - `bg-emerald-50 text-emerald-700 border-emerald-300`)
  - `CLOSED`: Gray (`#4b5563` - `bg-gray-100 text-gray-700 border-gray-300`)
  - `CANCELLED`: Rose (`#e11d48` - `bg-rose-50 text-rose-700 border-rose-300`)
- **Priority Indicators:**
  - `LOW`: Blue dot (`#3b82f6`)
  - `MEDIUM`: Green dot (`#10b981`)
  - `HIGH`: Amber dot (`#f59e0b`)
  - `URGENT`: Red pulsing badge (`#ef4444`, `animate-pulse`)
- **Typography:** Inter, sans-serif font stack.

### 3.2. Cấu Trúc Master Layout (`AppLayout`)
```
+-----------------------------------------------------------------------------------+
| [Sidebar: 260px]          | [Header: h-16 sticky top-0]                           |
|  - Logo HelpDesk          |  - Breadcrumb: Home > Tickets > TIK-2026-001          |
|  - Navigation Links:      |  - Global Search Input (Ctrl + K)                     |
|    * Dashboard            |  - Notification Bell (Unread Badge + Dropdown)        |
|    * Tickets              |  - User Avatar, Fullname, Role Badge, Profile Menu    |
|    * Knowledge Base       +-------------------------------------------------------+
|    * Reports              | [Main Content Area: p-6 min-h-[calc(100vh-64px)]]     |
|    * Admin Settings       |                                                       |
|  - Collapse Button        |  {children} Page Components                           |
|  - Current Agent Status   |                                                       |
|    (Online/Busy/Offline)  |                                                       |
+-----------------------------------------------------------------------------------+
```

---

## 4. Đặc Tả Chi Tiết 13 Màn Hình & Wireframe

---

### Màn hình 1: SCR-AUTH-01 - Đăng Nhập (Login)
- **Mục đích:** Xác thực người dùng bằng Username/Email và Password, nhận JWT token & phân quyền.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
|                                                                             |
|                           [ LOGO: HELPDESK SUITE ]                          |
|                       Hệ thống Quản lý Yêu cầu & Sự cố                      |
|                                                                             |
|      +---------------------------------------------------------------+      |
|      | ĐĂNG NHẬP HỆ THỐNG                                            |      |
|      | Vui lòng điền thông tin xác thực để truy cập bảng điều khiển  |      |
|      |                                                               |      |
|      | Tên người dùng hoặc Email                                     |      |
|      | [ user@helpdesk.local / admin                           ]     |      |
|      |                                                               |      |
|      | Mật khẩu                                                      |      |
|      | [ •••••••••••••••••••••••••                           (eye) ] |      |
|      |                                                               |      |
|      | [X] Ghi nhớ đăng nhập                 [Quên mật khẩu?]        |      |
|      |                                                               |      |
|      | [============ ĐĂNG NHẬP VÀO HỆ THỐNG ============]           |      |
|      |                                                               |      |
|      | Chưa có tài khoản? [Đăng ký tài khoản Khách hàng]             |      |
|      +---------------------------------------------------------------+      |
|                                                                             |
|                 © 2026 HelpDesk Service. All rights reserved.               |
+-----------------------------------------------------------------------------+
```
- **Components cần dựng:**
  - `Card`, `Input`, `Button`, `Checkbox`, `AlertBanner` hiển thị thông báo lỗi xác thực từ backend.
  - Form validation qua React Hook Form / Zustand Store.

---

### Màn hình 2: SCR-AUTH-02 - Đăng Ký Tài Khoản Khách Hàng (Register)
- **Mục đích:** Cho phép người dùng mới tạo tài khoản khách hàng thuộc phòng ban hoặc tổ chức liên quan.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
|                                                                             |
|      +---------------------------------------------------------------+      |
|      | TẠO TÀI KHOẢN MỚI                                             |      |
|      | Đăng ký để gửi và theo dõi yêu cầu hỗ trợ kỹ thuật            |      |
|      |                                                               |      |
|      | Họ và tên đầy đủ                 Tên đăng nhập                |      |
|      | [ Nguyễn Văn A            ]      [ nguyenvana           ]     |      |
|      |                                                               |      |
|      | Địa chỉ Email                    Số điện thoại                |      |
|      | [ a.nguyen@company.com    ]      [ 0901234567           ]     |      |
|      |                                                               |      |
|      | Mật khẩu                         Xác nhận mật khẩu            |      |
|      | [ •••••••••••••••• (eye)  ]      [ •••••••••••••••• (eye)]    |      |
|      | (Thanh đo độ mạnh mật khẩu: [========--] Khá an toàn)         |      |
|      |                                                               |      |
|      | Phòng ban / Bộ phận                                           |      |
|      | [ Chọn phòng ban (Kinh doanh, Nhân sự, Tài chính...)    [v] ] |      |
|      |                                                               |      |
|      | [X] Tôi đồng ý với Điều khoản dịch vụ và Chính sách bảo mật   |      |
|      |                                                               |      |
|      | [================== ĐĂNG KÝ TÀI KHOẢN ==================]     |      |
|      |                                                               |      |
|      | Đã có tài khoản? [Quay lại Đăng nhập]                         |      |
|      +---------------------------------------------------------------+      |
+-----------------------------------------------------------------------------+
```
- **Components:** `Input`, `Select`, `PasswordStrengthMeter`, `Button`.

---

### Màn hình 3: SCR-DASH-01 - Dashboard Tổng Quan Đa Năng (Dashboard)
- **Mục đích:** Cung cấp số liệu thống kê thời gian thực phù hợp theo từng vai trò (KPIs, Biểu đồ Ticket, Trạng thái SLA, Ticket cần xử lý gấp).
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| DASHBOARD TỔNG QUAN                                    [+ Tạo Ticket Mới]   |
| Chào buổi chiều, Quản trị viên! Dưới đây là tình hình hỗ trợ hôm nay.       |
|                                                                             |
| [ 245 TỔNG PHIẾU ] [ 18 ĐANG MỞ ] [ 6 VI PHẠM SLA ] [ 98.4% ĐẠT CSAT ]      |
|  +12% so với tuần   -4 chờ xử lý     Cần can thiệp gấp    Đánh giá 5 sao    |
|                                                                             |
| +------------------------------------+ +----------------------------------+ |
| | BIỂU ĐỒ XU HƯỚNG TICKET THEO NGÀY  | | PHÂN BỔ THEO DANH MỤC SỰ CỐ      | |
| | (Recharts AreaChart 7 ngày qua)    | | (Recharts Donut / PieChart)      | |
| |                                    | |   - Phần mềm & Bản quyền: 45%    | |
| |   /\    /\                         | |   - Thiết bị mạng/LAN:    30%    | |
| |  /  \  /  \    /\                  | |   - Phần cứng máy trạm:   15%    | |
| | /    \/    \__/  \                 | |   - Khác:                 10%    | |
| +------------------------------------+ +----------------------------------+ |
|                                                                             |
| +-------------------------------------------------------------------------+ |
| | PHIẾU CẦN XỬ LÝ KHẨN CẤP / SẮP HẾT HẠN SLA                              | |
| | Mã phiếu      Tiêu đề                 Độ ưu tiên   Hạn SLA      Người gán| |
| | TIK-2026-0041 Mất kết nối Switch T3   [URGENT]     Còn 14 phút  Lê Văn C | |
| | TIK-2026-0039 Lỗi phân quyền SAP      [HIGH]       Còn 42 phút  Trần Thị B| |
| +-------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------+
```
- **Components:** `StatCard`, `AreaChart`, `PieChart`, `PriorityBadge`, `SLATimerBadge`, `DataTableSimple`.

---

### Màn hình 4: SCR-TIK-01 - Danh Sách Ticket (Ticket List)
- **Mục đích:** Tra cứu, tìm kiếm, lọc theo nhiều tiêu chí (Status, Priority, Department, Assignee, SLA Breach), phân trang và thao tác hàng loạt.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| QUẢN LÝ DANH SÁCH PHIẾU YÊU CẦU                       [+ Tạo Mới] [Xuất CSV]|
|                                                                             |
| [ Tìm theo mã, tiêu đề, người tạo... ] [Phòng ban v] [Trạng thái v] [Lọc khác]|
|                                                                             |
| Tab: [Tất cả (142)] [Phiếu của tôi (8)] [Chưa phân công (15)] [Vi phạm SLA (4)]
|                                                                             |
| +-------------------------------------------------------------------------+ |
| | [ ] Mã Phiếu     Tiêu Đề             Danh Mục   Ưu Tiên  Trạng Thái SLA | |
| |-------------------------------------------------------------------------| |
| | [ ] TIK-2026-081 Máy in văn phòng kẹt Phần cứng  [MEDIUM] [IN_PROGRESS] | |
| |     Tạo: 10 phút trước bởi Nguyễn A | Phụ trách: Agent Nam | SLA: 2h còn| |
| |                                                                         | |
| | [ ] TIK-2026-079 VPN không xác thực   Mạng      [URGENT] [NEW]     [BREACH]
| |     Tạo: 1h trước bởi Hoàng Lan     | Chưa phân công       | SLA: Trễ 5p| |
| +-------------------------------------------------------------------------+ |
| Hiển thị 1 - 10 trong tổng số 142 phiếu               [< Trang 1, 2, 3... >]|
+-----------------------------------------------------------------------------+
```
- **Components:** `SearchFilterBar`, `TabGroup`, `TicketTableRow`, `PaginationControl`, `Badge`, `BulkActionToolbar`.

---

### Màn hình 5: SCR-TIK-02 - Chi Tiết Ticket & Trao Đổi (Ticket Detail)
- **Mục đích:** Xem toàn bộ nội dung sự cố, timeline lịch sử, trao đổi khách hàng/nội bộ, quản lý tệp đính kèm, cập nhật trạng thái và gán kỹ thuật viên.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| <- Quay lại  TIK-2026-0041: Mất kết nối Switch tầng 3           [Chỉnh sửa] |
| Trạng thái: [IN_PROGRESS v]   Ưu tiên: [URGENT]    SLA Xử lý: [Còn 35 phút] |
+-----------------------------------------------+-----------------------------+
| [CỘT TRÁI: NỘI DUNG & TRAO ĐỔI (70%)]         | [CỘT PHẢI: THÔNG TIN (30%)] |
|                                               |                             |
| Mô tả chi tiết:                               | Thông tin người tạo:        |
| Toàn bộ phòng Marketing tầng 3 mất mạng dây...| - Họ tên: Nguyễn Thu Trang  |
|                                               | - Email: trang.nt@co.com    |
| Tệp đính kèm (2):                             | - SĐT: 0912.888.999         |
| [switch_log.txt (14KB)] [photo_panel.png (2MB)]| - Phòng ban: Marketing     |
|                                               |                             |
| --------------------------------------------- | Phụ trách xử lý:            |
| Tab trao đổi: [Bình luận công khai] [Ghi chú nội bộ *] | [Trần Kỹ Thuật  [v]]|
|                                               |                             |
| [Avatar] Agent Minh: Đang kiểm tra cổng số 4  | Cam kết SLA:                |
| (14:15 - Nội bộ)                              | - Phản hồi: Đạt (10 phút)   |
|                                               | - Giải quyết: Hạn 16:00     |
| [Avatar] Khách hàng: Cảm ơn bên anh hỗ trợ.   |                             |
| (14:20 - Công khai)                           | Lịch sử thay đổi:           |
|                                               | - 14:00 Tạo mới (Trang NT)  |
| [ Viết nội dung phản hồi hoặc kéo thả file...] | - 14:05 Phân công cho Minh  |
| [ ] Đánh dấu hoàn tất xử lý   [GỬI PHẢN HỒI]  | - 14:10 Chuyển IN_PROGRESS  |
+-----------------------------------------------+-----------------------------+
```
- **Components:** `TicketHeader`, `CommentThread`, `InternalNoteToggle`, `AttachmentUploader`, `AssigneeSelector`, `StatusDropdown`, `AuditHistoryTimeline`.

---

### Màn hình 6: SCR-TIK-03 - Tạo Mới Ticket (Create Ticket)
- **Mục đích:** Form chuẩn hóa để người dùng gửi yêu cầu hỗ trợ mới với validation chi tiết.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| TẠO PHIẾU YÊU CẦU HỖ TRỢ MỚI                                                |
| Hãy cung cấp thông tin chi tiết để bộ phận kỹ thuật hỗ trợ nhanh nhất       |
|                                                                             |
| Tiêu đề sự cố / yêu cầu (*)                                                 |
| [ Không thể đăng nhập vào hệ thống ERP kế toán                            ] |
|                                                                             |
| Danh mục chính (*)                     Mức độ ưu tiên đề xuất (*)           |
| [ Phần mềm ứng dụng (ERP/CRM)   [v] ]  [ Trung bình (Medium)         [v] ]  |
|                                                                             |
| Phòng ban tiếp nhận                                                         |
| [ IT Operations & Infrastructure                                      [v] ] |
|                                                                             |
| Chi tiết mô tả lỗi & các bước tái hiện (*)                                  |
| +-------------------------------------------------------------------------+ |
| | Khi nhập mã nhân viên và mật khẩu thì màn hình báo lỗi Connection Reset | |
| | Đã thử khởi động lại máy nhưng vẫn bị...                                | |
| +-------------------------------------------------------------------------+ |
|                                                                             |
| Tệp tin đính kèm (Ảnh chụp màn hình, file log, tài liệu liên quan)          |
| +-------------------------------------------------------------------------+ |
| |   (Cloud Upload Icon) Kéo và thả tệp vào đây, hoặc [Duyệt tệp máy tính] | |
| |   Hỗ trợ PNG, JPG, PDF, TXT, LOG lên đến 20MB                           | |
| +-------------------------------------------------------------------------+ |
|                                                                             |
| [Hủy bỏ]                                          [GỬI YÊU CẦU HỖ TRỢ]      |
+-----------------------------------------------------------------------------+
```
- **Components:** `FormInput`, `CategorySelect`, `RichTextArea`, `DropzoneFileUploader`, `SubmitButtonGroup`.

---

### Màn hình 7: SCR-KB-01 - Tra Cứu Tri Thức & FAQ (Knowledge Base Hub)
- **Mục đích:** Thư viện bài viết hướng dẫn giúp người dùng tự khắc phục sự cố thông thường mà không cần mở ticket.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| TRUNG TÂM TRI THỨC & HƯỚNG DẪN KỸ THUẬT                                     |
|                                                                             |
|   +---------------------------------------------------------------------+   |
|   | (Search Icon) Tìm kiếm câu hỏi, mã lỗi hoặc từ khóa hướng dẫn...    |   |
|   +---------------------------------------------------------------------+   |
|                                                                             |
| DANH MỤC PHỔ BIẾN:                                                          |
| [ Mạng & VPN (18) ]  [ Email & Outlook (12) ]  [ Máy in & Scan (8) ]        |
| [ Tài khoản & Pass (24) ] [ Phần mềm kế toán (15) ] [ Bảo mật thiết bị (7) ]|
|                                                                             |
| BÀI VIẾT ĐƯỢC XEM NHIỀU NHẤT                   BÀI MỚI CẬP NHẬT             |
| * Hướng dẫn cấu hình VPN từ xa cho Windows 11  * Khắc phục lỗi SSL Chrome   |
| * Đổi mật khẩu tài khoản Domain nội bộ         * Cài đặt máy in đa năng IP  |
| * Khắc phục Outlook báo lỗi 'Disconnected'     * Hướng dẫn backup dữ liệu   |
+-----------------------------------------------------------------------------+
```
- **Components:** `KbSearchBar`, `CategoryChipGroup`, `ArticleCardGrid`, `PopularList`.

---

### Màn hình 8: SCR-KB-02 - Chi Tiết Bài Viết Tri Thức (KB Article View)
- **Mục đích:** Trình bày nội dung chi tiết bài viết kỹ thuật, đánh giá hữu ích (CSAT) và liên kết tạo ticket nếu chưa giải quyết được.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| <- Danh mục: Mạng & VPN / Hướng dẫn cấu hình OpenVPN cá nhân                |
| Cập nhật lần cuối: 25/09/2026 | Tác giả: IT Security Team | 1,420 lượt đọc  |
|                                                                             |
| # Hướng dẫn cài đặt và đăng nhập OpenVPN trên máy tính công ty              |
|                                                                             |
| 1. Bước 1: Tải bộ cài đặt chính thức tại cổng nội bộ...                    |
| 2. Bước 2: Import file cấu hình client.ovpn được IT cấp...                  |
| [Ảnh minh họa giao diện kết nối]                                            |
|                                                                             |
| --------------------------------------------------------------------------- |
| Bài viết này có giúp ích cho bạn không?                                     |
| [ (Thumps Up) Có, rất hữu ích (142) ]    [ (Thumbs Down) Chưa rõ ràng (3) ] |
|                                                                             |
| Vẫn chưa giải quyết được sự cố? [Tạo phiếu yêu cầu gửi IT ngay]             |
+-----------------------------------------------------------------------------+
```
- **Components:** `MarkdownViewer`, `FeedbackThumbButtons`, `ArticleMetadataBar`, `RelatedTicketAction`.

---

### Màn hình 9: SCR-RPT-01 - Báo Cáo & Phân Tích SLA (Reports & Analytics)
- **Mục đích:** Thống kê chuyên sâu tỷ lệ hoàn thành SLA, thời gian phản hồi trung bình (MTTA), thời gian giải quyết (MTTR), hiệu suất Agent.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| BÁO CÁO HIỆU SUẤT & ĐO LƯỜNG SLA                      [Khoảng ngày: 30 ngày]|
|                                                                             |
| [ MTTA (Phản hồi TB): 14m ] [ MTTR (Xử lý TB): 2.4h ] [ Tỷ lệ Đạt SLA: 96.2%]|
|                                                                             |
| +------------------------------------+ +----------------------------------+ |
| | TỶ LỆ VI PHẠM SLA THEO PHÒNG BAN   | | HIỆU SUẤT XỬ LÝ THEO KỸ THUẬT VIÊN| |
| | (Biểu đồ cột chồng - Recharts)     | | (Bảng xếp hạng năng suất)        | |
| | IT Ops:     [===== 97% Đạt ===][!] | | 1. Nguyễn Văn Hùng: 84 phiếu     | |
| | Kế toán:    [==== 94% Đạt ====][!] | | 2. Lê Thị Mai:      76 phiếu     | |
| | Nhân sự:    [======= 99% =====]    | | 3. Phạm Quang:      62 phiếu     | |
| +------------------------------------+ +----------------------------------+ |
|                                                                             |
| XU HƯỚNG TICKET ĐƯỢC TẠO VÀ ĐÓNG THEO TUẦN (LineChart Recharts)             |
| [==== Tạo mới: Xanh lá ==== Đã hoàn thành: Xanh dương =====================]|
+-----------------------------------------------------------------------------+
```
- **Components:** `KpiIndicatorRow`, `BarChart`, `LineChart`, `AgentPerformanceTable`, `DateRangePicker`.

---

### Màn hình 10: SCR-ADM-01 - Quản Lý Người Dùng & Phân Quyền (User Management)
- **Mục đích:** Quản trị viên duyệt, cấp quyền vai trò (Admin, Manager, Agent, Customer), gán phòng ban và khóa tài khoản.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| QUẢN TRỊ NGƯỜI DÙNG & TÀI KHOẢN                           [+ Thêm Tài Khoản]|
|                                                                             |
| [ Tìm họ tên, email... ] [Lọc theo Role v] [Lọc theo Phòng ban v]           |
|                                                                             |
| +-------------------------------------------------------------------------+ |
| | Họ và Tên       Email                Vai Trò   Phòng Ban   Trạng Thái   | |
| |-------------------------------------------------------------------------| |
| | Trần Minh Tâm   tam.tm@company.com   [ADMIN]   IT Sys      [Hoạt động]  | |
| | Hoàng Quốc Việt viet.hq@company.com  [AGENT]   IT Support  [Hoạt động]  | |
| | Lê Thanh Thảo   thao.lt@company.com  [CUSTOMER]Marketing   [Đã khóa]    | |
| +-------------------------------------------------------------------------+ |
| [Phân quyền nhanh]  [Đặt lại mật khẩu]  [Khóa tài khoản]                    |
+-----------------------------------------------------------------------------+
```
- **Components:** `UserTable`, `RoleBadgeDropdown`, `UserModalForm`, `StatusToggle`.

---

### Màn hình 11: SCR-ADM-02 - Quản Lý Phòng Ban & Danh Mục Sự Cố (Departments & Categories)
- **Mục đích:** Quản lý cơ cấu phòng ban và cây phân cấp danh mục lỗi (Hardware, Software, Network).
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| PHÒNG BAN & DANH MỤC SỰ CỐ                     [+ Phòng Ban] [+ Danh Mục]   |
|                                                                             |
| [ CỘT TRÁI: DANH SÁCH PHÒNG BAN ]     | [ CỘT PHẢI: CÂY DANH MỤC LỖI ]      |
|                                       |                                     |
| * IT Operations & Network             | [IT Operations & Network]           |
|   Mã: IT_OPS | Trưởng: Trần Hải       |  ├── Mạng & Kết nối LAN/Wifi        |
|                                       |  │    ├── Sự cố Switch/Router       |
| * Human Resources (Nhân sự)           |  │    └── Cấu hình VPN              |
|   Mã: HR_DEPT | Trưởng: Lan Phương    |  ├── Phần cứng máy tính & Ngoại vi  |
|                                       |  │    ├── Máy in / Scanner          |
| * Kế toán & Tài chính                 |  │    └── Hư hỏng nguồn / Ram       |
|   Mã: ACC_DEPT | Trưởng: Tuấn Anh     |  └── Tài khoản & Quyền truy cập     |
+---------------------------------------+-------------------------------------+
```
- **Components:** `DepartmentListPanel`, `CategoryTreeView`, `CreateCategoryModal`.

---

### Màn hình 12: SCR-ADM-03 - Cấu Hình Chính Sách SLA & Escalation Rules (SLA Policies)
- **Mục đích:** Cấu hình ma trận thời hạn phản hồi/giải quyết theo Danh mục + Mức ưu tiên, và quy tắc tự động leo thang (Escalate) khi chậm trễ.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| CẤU HÌNH CHÍNH SÁCH SLA & QUY TẮC LEO THANG                 [+ Thêm Quy Tắc]|
|                                                                             |
| MA TRẬN CAM KẾT MỨC DỊCH VỤ (SLA MATRIX):                                   |
| Danh mục            Ưu tiên    Phản hồi đầu (MTTA)   Thời hạn giải quyết     |
| [Mạng LAN/Switch ]  [URGENT ]  15 phút               2 giờ                   |
| [Mạng LAN/Switch ]  [HIGH   ]  30 phút               4 giờ                   |
| [Phần mềm văn phòng][MEDIUM ]  2 giờ                 8 giờ                   |
| [Cấp phát thiết bị] [LOW    ]  4 giờ                 24 giờ                  |
|                                                                             |
| QUY TẮC TỰ ĐỘNG LEO THANG (ESCALATION TRIGGERS):                            |
| 1. Nếu ticket URGENT chưa có Agent tiếp nhận sau 10 phút:                   |
|    -> Bắn thông báo khẩn cấp đến Trưởng bộ phận & Slack channel #it-alerts  |
| 2. Nếu ticket quá 80% thời hạn SLA xử lý mà chưa xong:                      |
|    -> Tự động nâng cờ Escalation và gán thêm Senior Support                 |
+-----------------------------------------------------------------------------+
```
- **Components:** `SlaMatrixGrid`, `EscalationRuleCard`, `TimeInputUnit`, `TriggerConditionBuilder`.

---

### Màn hình 13: SCR-USR-01 - Hồ Sơ Cá Nhân & Cài Đặt (User Profile)
- **Mục đích:** Cập nhật thông tin liên hệ, đổi mật khẩu, xem lịch sử phân công và trạng thái ca trực của Agent.
- **Wireframe Text:**
```
+-----------------------------------------------------------------------------+
| HỒ SƠ TÀI KHOẢN & CÀI ĐẶT                                   [Lưu Thay Đổi]  |
|                                                                             |
| +-------------------------+ +---------------------------------------------+ |
| | [Ảnh đại diện / Avatar] | | Họ và tên đầy đủ: [Trần Minh Kỹ Thuật     ] | |
| | [Thay đổi ảnh...]       | | Tên đăng nhập:    [minh.it] (Không thay đổi)| |
| |                         | | Email:            [minh.it@company.com    ] | |
| | Vai trò: AGENT KỸ THUẬT | | Số điện thoại:    [0987.654.321           ] | |
| | Phòng ban: IT Support   | | Phòng ban:        [IT Operations          ] | |
| |                         | +---------------------------------------------+ |
| | TRẠNG THÁI TIẾP NHẬN:   |                                                 |
| | [X] Sẵn sàng nhận phiếu | ĐỔI MẬT KHẨU BẢO MẬT:                           |
| | Giới hạn tối đa: [5]    | Mật khẩu hiện tại: [ ••••••••••••••••         ] |
| | Điểm đánh giá: 4.85/5 * | Mật khẩu mới:      [ ••••••••••••••••         ] |
| +-------------------------+ Xác nhận mật khẩu: [ ••••••••••••••••         ] |
+-----------------------------------------------------------------------------+
```
- **Components:** `AvatarUploader`, `ProfileForm`, `AgentCapacitySlider`, `PasswordChangeSection`.

---

## 5. Danh Sách Components Frontend Cần Xây Dựng

1. **Common Components (`src/components/common/`):**
   - `Button.jsx`: Các biến thể primary, secondary, outline, danger, size sm/md/lg, icon support, loading spinner.
   - `Input.jsx`: Field text, password kèm eye-toggle, search icon, error message validation.
   - `Select.jsx`: Dropdown đơn và đa chọn với custom styling.
   - `Badge.jsx`: Hiển thị status (NEW, RESOLVED...), priority (URGENT, HIGH...) với chuẩn màu hệ thống.
   - `Card.jsx`: Container bóng đổ, viền bo góc, header/body/footer chia khối rõ ràng.
   - `Modal.jsx`: Hộp thoại popup có backdrop blur, phím Esc để đóng, nút xác nhận/hủy.
   - `Pagination.jsx`: Phân trang dữ liệu linh hoạt kèm chọn page size (10, 25, 50).
   - `LoadingSpinner.jsx`: Hiệu ứng tải trang thanh lịch.
   - `ToastAlert.jsx`: Thông báo nổi góc màn hình (Success, Error, Info, Warning).

2. **Layout Components (`src/components/layout/`):**
   - `AppLayout.jsx`: Khung chính chứa Sidebar, Header và Content outlet.
   - `Sidebar.jsx`: Thanh điều hướng bên trái có thể thu gọn (Collapsible), badge số lượng ticket, menu role-based.
   - `Header.jsx`: Thanh tiêu đề trên cùng, thanh tìm kiếm nhanh, icon chuông thông báo, menu người dùng.
   - `Breadcrumbs.jsx`: Điều hướng đường dẫn trang hiện tại tự động theo route.

3. **Ticket Components (`src/components/ticket/`):**
   - `TicketCard.jsx`: Thẻ tóm tắt thông tin ticket hiển thị trên bảng Kanban / danh sách thẻ.
   - `TicketStatusBadge.jsx`: Badge trạng thái chuẩn màu RBAC.
   - `TicketPriorityBadge.jsx`: Badge độ ưu tiên kèm biểu tượng trực quan.
   - `TicketCommentBox.jsx`: Khung chat và gửi ghi chú nội bộ (Internal Notes) kèm tệp đính kèm.
   - `TicketTimeline.jsx`: Dòng thời gian lịch sử cập nhật trạng thái phiếu.
   - `SlaCountdown.jsx`: Bộ đếm ngược thời gian phản hồi/giải quyết vi phạm SLA.

4. **Dashboard Components (`src/components/dashboard/`):**
   - `MetricCard.jsx`: Thẻ số liệu KPI chính (Tổng phiếu, Chờ xử lý, Quá hạn SLA, CSAT).
   - `TicketChart.jsx`: Biểu đồ diện tích xu hướng ticket theo thời gian (Recharts AreaChart).
   - `CategoryDistributionChart.jsx`: Biểu đồ tròn phân bổ danh mục sự cố (Recharts PieChart).
   - `UrgentTicketsTable.jsx`: Bảng các sự cố khẩn cấp cần can thiệp tức thì.

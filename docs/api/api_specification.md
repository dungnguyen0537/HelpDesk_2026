# Tài Liệu Đặc Tả API RESTful - Hệ Thống HelpDesk Enterprise

> **Tài liệu:** RESTful API Design Specification  
> **Phiên bản:** 1.0.0  
> **Base URL:** `http://localhost:8080/api` (hoặc `https://helpdesk.company.com/api`)  
> **Chuẩn dữ liệu:** JSON (UTF-8)  
> **Kiến trúc bảo mật:** JWT (HMAC-SHA256) qua Header `Authorization: Bearer <token>`  
> **Người biên soạn:** TV3 (Backend Support + Test + Docs)  

---

## 1. TIÊU CHUẨN THIẾT KẾ VÀ QUY ƯỚC TOÀN CỤC

### 1.1. HTTP Methods
- `GET`: Lấy danh sách hoặc chi tiết tài nguyên (Idempotent, Safe).
- `POST`: Tạo mới tài nguyên hoặc kích hoạt tác vụ nghiệp vụ phức tạp.
- `PUT`: Cập nhật toàn bộ thực thể tài nguyên (Idempotent).
- `PATCH`: Cập nhật một phần thuộc tính (ví dụ: đổi trạng thái, kích hoạt tài khoản).
- `DELETE`: Xóa mềm hoặc xóa vật lý tài nguyên.

### 1.2. Headers Tiêu Chuẩn
- `Content-Type: application/json` (cho các request có body JSON).
- `Authorization: Bearer <JWT_TOKEN>` (bắt buộc với các endpoint bảo mật).
- `Accept: application/json`.
- `X-Request-Id: <UUID>` (tùy chọn: phục vụ truy vết phân tán và logging).

### 1.3. Cấu Trúc Response Chuẩn Toàn Hệ Thống (`ApiResponse<T>`)

Mọi response trả về từ máy chủ đều tuân theo envelope thống nhất:

#### Response Thành công (HTTP 200 OK / 201 Created):
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Thao tác thành công",
  "data": { ... },
  "errors": null,
  "timestamp": "2026-09-27T08:00:00Z"
}
```

#### Response Thất bại / Lỗi (HTTP 400, 401, 403, 404, 409, 500):
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Dữ liệu đầu vào không hợp lệ",
  "data": null,
  "errors": {
    "email": "Email không đúng định dạng",
    "password": "Mật khẩu phải chứa ít nhất 8 ký tự"
  },
  "timestamp": "2026-09-27T08:00:00Z"
}
```

### 1.4. Bảng Mã Lỗi HTTP Phổ Biến

| Mã HTTP | Tên Mã | Ý Nghĩa / Tình Huống Kích Hoạt |
|:---:|:---|:---|
| **200** | OK | Yêu cầu xử lý thành công, có dữ liệu trả về |
| **201** | Created | Tạo mới tài nguyên thành công (Ticket, User, Comment, Category) |
| **204** | No Content | Xóa tài nguyên thành công, không có nội dung trả về |
| **400** | Bad Request | Dữ liệu đầu vào không hợp lệ (sai validation, vượt quá dung lượng file...) |
| **401** | Unauthorized | Token bị thiếu, hết hạn, hoặc chữ ký JWT không hợp lệ |
| **403** | Forbidden | Người dùng đã đăng nhập nhưng không đủ quyền hạn vai trò (Role-based) |
| **404** | Not Found | Không tìm thấy tài nguyên theo ID hoặc tham số truy vấn |
| **409** | Conflict | Xung đột dữ liệu độc nhất (trùng username, email, mã phòng ban, mã danh mục) |
| **500** | Internal Server Error | Lỗi hệ thống nội bộ máy chủ chưa được kiểm soát |

---

## 2. NHÓM API AUTHENTICATION & PHÂN QUYỀN (`/api/auth`)

### 2.1. Đăng nhập hệ thống (Login)
- **Endpoint:** `POST /api/auth/login`
- **Quyền hạn:** Public
- **Request Body:**
```json
{
  "username": "agent_lan",
  "password": "Password@123"
}
```
- **Responses:**
  - **200 OK:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Đăng nhập thành công",
      "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "d8f43a9e-648b-4a55-bb7c-9189b2ce8f41",
        "tokenType": "Bearer",
        "expiresIn": 3600,
        "userId": 2,
        "username": "agent_lan",
        "email": "lan.nguyen@company.com",
        "fullName": "Nguyễn Thị Lan",
        "role": "AGENT"
      },
      "errors": null,
      "timestamp": "2026-09-27T08:00:00Z"
    }
    ```
  - **400 Bad Request:** Thiếu username hoặc password.
  - **401 Unauthorized:** Tên đăng nhập hoặc mật khẩu không chính xác.
  - **403 Forbidden:** Tài khoản đã bị vô hiệu hóa (`is_active = false`).

---

### 2.2. Đăng ký tài khoản khách hàng (Register)
- **Endpoint:** `POST /api/auth/register`
- **Quyền hạn:** Public
- **Request Body:**
```json
{
  "username": "customer_minh",
  "email": "minh.tran@client.com",
  "password": "SecurePassword123!",
  "fullName": "Trần Tuấn Minh",
  "phoneNumber": "0987654321"
}
```
- **Responses:**
  - **201 Created:** Trả về đối tượng người dùng vừa tạo (loại bỏ trường mật khẩu).
  - **400 Bad Request:** Định dạng email không đúng, mật khẩu quá yếu.
  - **409 Conflict:** `username` hoặc `email` đã tồn tại trong hệ thống.

---

### 2.3. Làm mới Access Token (Refresh Token)
- **Endpoint:** `POST /api/auth/refresh-token`
- **Quyền hạn:** Public
- **Request Body:**
```json
{
  "refreshToken": "d8f43a9e-648b-4a55-bb7c-9189b2ce8f41"
}
```
- **Responses:**
  - **200 OK:** Trả về `accessToken` mới và `refreshToken` mới.
  - **401 Unauthorized:** Refresh token không tồn tại, hết hạn, hoặc đã bị thu hồi.

---

### 2.4. Đổi mật khẩu (Change Password)
- **Endpoint:** `POST /api/auth/change-password`
- **Quyền hạn:** Authenticated
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "oldPassword": "Password@123",
  "newPassword": "NewSecurePassword456!"
}
```
- **Responses:**
  - **200 OK:** Đổi mật khẩu thành công.
  - **400 Bad Request:** Mật khẩu cũ không chính xác hoặc mật khẩu mới trùng mật khẩu cũ.
  - **401 Unauthorized:** Chưa xác thực.

---

## 3. NHÓM API QUẢN LÝ NGƯỜI DÙNG & HỒ SƠ (`/api/users`, `/api/agent-profiles`)

### 3.1. Lấy danh sách người dùng phân trang & tìm kiếm
- **Endpoint:** `GET /api/users`
- **Quyền hạn:** `ADMIN`, `MANAGER`
- **Query Parameters:**
  - `page` (int, default: 0)
  - `size` (int, default: 10)
  - `role` (string, optional: `ADMIN`, `MANAGER`, `AGENT`, `CUSTOMER`)
  - `departmentId` (long, optional)
  - `search` (string, optional: tìm kiếm theo username, email, fullName)
  - `isActive` (boolean, optional)
- **Responses:**
  - **200 OK:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "message": "Lấy danh sách người dùng thành công",
      "data": {
        "content": [
          {
            "id": 2,
            "username": "agent_lan",
            "email": "lan.nguyen@company.com",
            "fullName": "Nguyễn Thị Lan",
            "phoneNumber": "0912345678",
            "role": "AGENT",
            "departmentId": 1,
            "departmentName": "Bộ phận Hỗ trợ CNTT",
            "isActive": true,
            "avatarUrl": "https://cdn.company.com/avatars/user2.png",
            "lastLoginAt": "2026-09-27T07:45:00Z",
            "createdAt": "2026-01-15T02:30:00Z"
          }
        ],
        "pageNumber": 0,
        "pageSize": 10,
        "totalElements": 45,
        "totalPages": 5,
        "isLast": false
      },
      "errors": null,
      "timestamp": "2026-09-27T08:00:00Z"
    }
    ```
  - **401 Unauthorized:** Token không hợp lệ.
  - **403 Forbidden:** Không có quyền (CUSTOMER/AGENT không được xem danh sách này).

---

### 3.2. Lấy thông tin chi tiết một người dùng
- **Endpoint:** `GET /api/users/{id}`
- **Quyền hạn:** `ADMIN`, `MANAGER`, hoặc chính người dùng sở hữu ID.
- **Responses:**
  - **200 OK:** Thông tin chi tiết user (kèm hồ sơ agent_profile nếu role là AGENT).
  - **404 Not Found:** Không tìm thấy người dùng với ID cung cấp.

---

### 3.3. Tạo người dùng mới (Dành cho Quản trị viên)
- **Endpoint:** `POST /api/users`
- **Quyền hạn:** `ADMIN`
- **Request Body:**
```json
{
  "username": "agent_tung",
  "email": "tung.pham@company.com",
  "password": "DefaultPassword123!",
  "fullName": "Phạm Thanh Tùng",
  "phoneNumber": "0933221100",
  "role": "AGENT",
  "departmentId": 1
}
```
- **Responses:**
  - **201 Created:** Người dùng được tạo thành công.
  - **400 Bad Request:** Thiếu trường bắt buộc.
  - **409 Conflict:** Trùng username hoặc email.

---

### 3.4. Cập nhật trạng thái kích hoạt tài khoản
- **Endpoint:** `PATCH /api/users/{id}/status`
- **Quyền hạn:** `ADMIN`
- **Query Parameters:** `active=true` hoặc `active=false`
- **Responses:**
  - **200 OK:** Trả về thông tin user đã cập nhật.
  - **404 Not Found:** User không tồn tại.

---

### 3.5. Cập nhật hồ sơ kỹ thuật viên (Agent Profile)
- **Endpoint:** `PUT /api/agent-profiles/{userId}`
- **Quyền hạn:** `ADMIN`, `MANAGER`
- **Request Body:**
```json
{
  "skills": "Network, Windows Server, PostgreSQL, VPN Setup",
  "maxActiveTickets": 8,
  "isAvailable": true
}
```
- **Responses:**
  - **200 OK:** Cập nhật thành công.
  - **400 Bad Request:** `maxActiveTickets < 0`.

---

## 4. NHÓM API QUẢN LÝ PHÒNG BAN (`/api/departments`)

### 4.1. Lấy danh sách tất cả phòng ban
- **Endpoint:** `GET /api/departments`
- **Quyền hạn:** Authenticated
- **Responses:**
  - **200 OK:** Danh sách phòng ban kèm thông tin Trưởng phòng (`manager`).

### 4.2. Tạo phòng ban mới
- **Endpoint:** `POST /api/departments`
- **Quyền hạn:** `ADMIN`
- **Request Body:**
```json
{
  "code": "IT_NETWORK",
  "name": "Phòng Hạ tầng Mạng & Viễn thông",
  "description": "Quản lý hệ thống máy chủ nội bộ, đường truyền Internet và VPN",
  "managerId": 3
}
```
- **Responses:**
  - **201 Created:** Tạo phòng ban thành công.
  - **409 Conflict:** Mã `code` đã tồn tại.

---

## 5. NHÓM API QUẢN LÝ DANH MỤC & ĐỘ ƯU TIÊN (`/api/categories`, `/api/priorities`)

### 5.1. Lấy cây danh mục sự cố
- **Endpoint:** `GET /api/categories`
- **Quyền hạn:** Authenticated
- **Query Parameters:** `departmentId` (tùy chọn)
- **Responses:**
  - **200 OK:** Danh sách danh mục, bao gồm quan hệ phân cấp cha-con (`children`).

### 5.2. Tạo mới danh mục sự cố
- **Endpoint:** `POST /api/categories`
- **Quyền hạn:** `ADMIN`
- **Request Body:**
```json
{
  "code": "SW_EMAIL",
  "name": "Lỗi phần mềm Thư điện tử",
  "description": "Không gửi nhận được email hoặc lỗi xác thực Outlook",
  "departmentId": 1,
  "parentId": null
}
```
- **Responses:**
  - **201 Created:** Tạo thành công.
  - **409 Conflict:** Mã danh mục đã tồn tại.

### 5.3. Lấy danh sách mức độ ưu tiên
- **Endpoint:** `GET /api/priorities`
- **Quyền hạn:** Authenticated
- **Responses:**
  - **200 OK:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "data": [
        { "id": 1, "code": "LOW", "name": "Thấp", "levelWeight": 1, "colorHex": "#10B981" },
        { "id": 2, "code": "MEDIUM", "name": "Trung bình", "levelWeight": 2, "colorHex": "#3B82F6" },
        { "id": 3, "code": "HIGH", "name": "Cao", "levelWeight": 3, "colorHex": "#F59E0B" },
        { "id": 4, "code": "CRITICAL", "name": "Khẩn cấp", "levelWeight": 4, "colorHex": "#EF4444" }
      ]
    }
    ```

---

## 6. NHÓM API CHÍNH SÁCH SLA (`/api/sla-policies`)

### 6.1. Lấy danh sách chính sách SLA
- **Endpoint:** `GET /api/sla-policies`
- **Quyền hạn:** `ADMIN`, `MANAGER`
- **Responses:**
  - **200 OK:** Danh sách chính sách SLA kèm thời hạn tính theo phút.

### 6.2. Thiết lập chính sách SLA
- **Endpoint:** `POST /api/sla-policies`
- **Quyền hạn:** `ADMIN`
- **Request Body:**
```json
{
  "name": "SLA Khẩn cấp - Hạ tầng mạng",
  "description": "Cam kết xử lý tức thì cho sự cố sập hệ thống mạng nội bộ",
  "categoryId": 4,
  "priorityId": 4,
  "firstResponseTimeMinutes": 15,
  "resolutionTimeMinutes": 120,
  "isActive": true
}
```
- **Responses:**
  - **201 Created:** Tạo thành công chính sách SLA.
  - **400 Bad Request:** Thời gian <= 0.

---

## 7. NHÓM API QUẢN LÝ PHIẾU HỖ TRỢ TICKETS (`/api/tickets`)

### 7.1. Tạo mới phiếu hỗ trợ (Create Ticket)
- **Endpoint:** `POST /api/tickets`
- **Quyền hạn:** Authenticated (Thường là `CUSTOMER`)
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "title": "Mất kết nối mạng Internet tầng 3",
  "description": "Toàn bộ khu vực phòng Kế toán không thể truy cập Internet từ 8h30 sáng nay, đèn router nhấp nháy đỏ.",
  "categoryId": 4,
  "priorityId": 3,
  "departmentId": 1
}
```
- **Responses:**
  - **201 Created:**
    ```json
    {
      "success": true,
      "statusCode": 201,
      "message": "Tạo ticket thành công",
      "data": {
        "id": 105,
        "ticketNumber": "TK-20260927-0042",
        "title": "Mất kết nối mạng Internet tầng 3",
        "description": "Toàn bộ khu vực phòng Kế toán không thể truy cập Internet...",
        "status": "NEW",
        "creator": { "id": 5, "fullName": "Trần Tuấn Minh", "email": "minh.tran@client.com" },
        "assignee": null,
        "department": { "id": 1, "name": "Bộ phận Hỗ trợ CNTT" },
        "category": { "id": 4, "name": "Lỗi kết nối Mạng" },
        "priority": { "id": 3, "code": "HIGH", "levelWeight": 3 },
        "slaPolicy": { "id": 2, "name": "SLA Mạng Cao" },
        "slaResponseDeadline": "2026-09-27T08:30:00Z",
        "slaResolutionDeadline": "2026-09-27T12:00:00Z",
        "slaResponseBreached": false,
        "slaResolutionBreached": false,
        "firstRespondedAt": null,
        "resolvedAt": null,
        "closedAt": null,
        "createdAt": "2026-09-27T08:00:00Z",
        "updatedAt": "2026-09-27T08:00:00Z"
      },
      "errors": null,
      "timestamp": "2026-09-27T08:00:00Z"
    }
    ```
  - **400 Bad Request:** Thiếu tiêu đề hoặc danh mục không tồn tại.
  - **401 Unauthorized:** Chưa đăng nhập.

---

### 7.2. Lấy danh sách Ticket (Bộ lọc đa năng & Phân trang)
- **Endpoint:** `GET /api/tickets`
- **Quyền hạn:** Authenticated (CUSTOMER chỉ thấy ticket của mình; AGENT/MANAGER thấy ticket phòng ban; ADMIN thấy toàn bộ).
- **Query Parameters:**
  - `page` (int, default: 0)
  - `size` (int, default: 10)
  - `status` (string, ví dụ: `NEW`, `IN_PROGRESS`, `RESOLVED`)
  - `priorityId` (long)
  - `categoryId` (long)
  - `departmentId` (long)
  - `assigneeId` (long)
  - `creatorId` (long)
  - `isBreached` (boolean: lọc các ticket đã vi phạm SLA)
  - `search` (string: tìm kiếm theo số ticket hoặc tiêu đề)
  - `sortBy` (string, default: `createdAt`)
  - `sortDir` (string, default: `desc`)
- **Responses:**
  - **200 OK:** Danh sách Ticket phân trang (Spring Data Page).

---

### 7.3. Lấy chi tiết một Ticket
- **Endpoint:** `GET /api/tickets/{id}`
- **Quyền hạn:** Người tạo, Người được phân công, Quản lý phòng ban, hoặc ADMIN.
- **Responses:**
  - **200 OK:** Toàn bộ thông tin ticket, danh sách tệp đính kèm, danh sách bình luận (lọc bỏ internal note nếu là Customer), và lịch sử thay đổi `history`.
  - **403 Forbidden:** Người dùng không có quyền xem ticket của người khác.
  - **404 Not Found:** Ticket không tồn tại.

---

### 7.4. Phân công xử lý Ticket (Assign Ticket)
- **Endpoint:** `PUT /api/tickets/{id}/assign`
- **Quyền hạn:** `MANAGER`, `ADMIN` (hoặc `AGENT` tự nhận claim ticket cho chính mình).
- **Request Body:**
```json
{
  "assigneeId": 2,
  "note": "Giao kỹ thuật viên Lan xử lý khẩn cấp sự cố mạng tầng 3"
}
```
- **Responses:**
  - **200 OK:** Phân công thành công, trạng thái ticket chuyển sang `ASSIGNED`.
  - **400 Bad Request:** Kỹ thuật viên đã vượt quá `max_active_tickets` hoặc không sẵn sàng (`is_available = false`).
  - **404 Not Found:** Ticket hoặc Kỹ thuật viên không tồn tại.

---

### 7.5. Cập nhật trạng thái vòng đời Ticket (Update Status)
- **Endpoint:** `PATCH /api/tickets/{id}/status`
- **Quyền hạn:** `AGENT`, `MANAGER`, `ADMIN` (hoặc `CUSTOMER` khi đóng hoặc hủy ticket).
- **Request Body:**
```json
{
  "status": "RESOLVED",
  "solutionNote": "Đã bấm lại đầu jack RJ45 và thay thế dây nhảy mạng tại patch panel tủ rack tầng 3. Tín hiệu đã phục hồi bình thường."
}
```
- **Responses:**
  - **200 OK:** Cập nhật trạng thái thành công. Tự động ghi mốc thời gian và kiểm tra vi phạm SLA.
  - **400 Bad Request:** Luồng chuyển đổi trạng thái không hợp lệ (ví dụ: chuyển từ `CLOSED` sang `NEW`).

---

## 8. NHÓM API BÌNH LUẬN & ĐÍNH KÈM TỆP (`/api/tickets/{id}/comments`, `/api/tickets/{id}/attachments`)

### 8.1. Thêm bình luận vào Ticket
- **Endpoint:** `POST /api/tickets/{id}/comments`
- **Quyền hạn:** Người liên quan tới Ticket.
- **Request Body:**
```json
{
  "content": "Kỹ thuật viên đang di chuyển đến tầng 3 để đo kiểm đường dây.",
  "isInternal": true
}
```
- **Responses:**
  - **201 Created:** Bình luận được lưu thành công.
  - **403 Forbidden:** Customer cố tình gửi cờ `isInternal = true`.

---

### 8.2. Tải lên tệp đính kèm (Upload Attachment)
- **Endpoint:** `POST /api/tickets/{id}/attachments`
- **Quyền hạn:** Authenticated
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `file`: Binary file (tối đa 10MB)
  - `commentId`: Long (tùy chọn: nếu đính kèm vào bình luận cụ thể)
- **Responses:**
  - **201 Created:**
    ```json
    {
      "success": true,
      "statusCode": 201,
      "data": {
        "id": 18,
        "fileName": "network_switch_error.png",
        "fileSize": 1548200,
        "fileType": "image/png",
        "downloadUrl": "/api/attachments/18/download",
        "createdAt": "2026-09-27T08:15:00Z"
      }
    }
    ```
  - **400 Bad Request:** Dung lượng file vượt quá 10MB hoặc phần mở rộng file bị chặn (.exe, .sh, .bat).

---

## 9. NHÓM API ĐÁNH GIÁ HÀI LÒNG CSAT (`/api/tickets/{id}/feedback`)

### 9.1. Gửi đánh giá cho Ticket đã hoàn thành
- **Endpoint:** `POST /api/tickets/{id}/feedback`
- **Quyền hạn:** `CUSTOMER` (chính người tạo ticket).
- **Request Body:**
```json
{
  "rating": 5,
  "comment": "Kỹ thuật viên Lan hỗ trợ rất nhanh nhẹn và nhiệt tình. Sự cố được giải quyết triệt để!",
  "isSatisfied": true
}
```
- **Responses:**
  - **201 Created:** Ghi nhận đánh giá thành công; tự động cập nhật điểm CSAT trung bình của Agent.
  - **400 Bad Request:** Điểm rating ngoài khoảng 1-5; hoặc ticket chưa ở trạng thái `RESOLVED`/`CLOSED`.
  - **409 Conflict:** Ticket này đã được đánh giá trước đó.

---

## 10. NHÓM API CƠ SỞ TRI THỨC KNOWLEDGE BASE (`/api/knowledge-base`)

### 10.1. Tìm kiếm và đọc bài viết tri thức
- **Endpoint:** `GET /api/knowledge-base`
- **Quyền hạn:** Authenticated
- **Query Parameters:** `search`, `categoryId`, `page`, `size`
- **Responses:**
  - **200 OK:** Danh sách bài viết tri thức trạng thái `PUBLISHED`.

### 10.2. Tạo bài viết tri thức mới
- **Endpoint:** `POST /api/knowledge-base`
- **Quyền hạn:** `AGENT`, `MANAGER`, `ADMIN`
- **Request Body:**
```json
{
  "title": "Hướng dẫn cấu hình kết nối VPN nội bộ công ty",
  "categoryId": 4,
  "content": "### Các bước thực hiện:\n1. Tải phần mềm OpenVPN Client...\n2. Import file profile .ovpn...\n3. Đăng nhập bằng tài khoản nội bộ.",
  "status": "PUBLISHED"
}
```
- **Responses:**
  - **201 Created:** Bài viết được tạo thành công kèm slug URL tự động.

---

## 11. NHÓM API BÁO CÁO THỐNG KÊ & KPIS (`/api/reports`)

### 11.1. Báo cáo tổng quan hiệu suất SLA & Ticket
- **Endpoint:** `GET /api/reports/dashboard-stats`
- **Quyền hạn:** `MANAGER`, `ADMIN`
- **Query Parameters:** `from` (ISO Date), `to` (ISO Date), `departmentId`
- **Responses:**
  - **200 OK:**
    ```json
    {
      "success": true,
      "statusCode": 200,
      "data": {
        "totalTickets": 1280,
        "openTickets": 142,
        "resolvedTickets": 1050,
        "closedTickets": 88,
        "slaComplianceRate": 94.6,
        "slaResponseBreachedCount": 32,
        "slaResolutionBreachedCount": 69,
        "avgCsatRating": 4.72,
        "avgResolutionTimeMinutes": 185
      }
    }
    ```

---

## 12. DANH MỤC THÔNG BÁO THỜI GIAN THỰC (WEBSOCKET / STOMP)

- **WebSocket Endpoint:** `ws://localhost:8080/ws`
- **Giao thức:** STOMP qua SockJS
- **Kênh lắng nghe (Subscribe Channels):**
  - `/topic/tickets/{ticketId}`: Cập nhật thay đổi trạng thái, bình luận mới trong ticket.
  - `/topic/departments/{departmentId}`: Thông báo ticket mới phát sinh cho kỹ thuật viên trong phòng ban.
  - `/user/queue/notifications`: Thông báo cá nhân hóa (được phân công, ticket bị quá hạn, nhắc việc).

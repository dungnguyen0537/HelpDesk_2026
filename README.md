# HelpDesk Enterprise 2026

> **Hệ thống Quản lý Yêu cầu Hỗ trợ & Xử lý Sự cố Dịch vụ Toàn diện (IT Service Desk & Incident Management System)**  
> Đề tài Đồ án Chuyên ngành Công nghệ Thông tin — Tiêu chuẩn Quản lý Dịch vụ ITIL v4 & ISO/IEC 20000.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-helpdesk.dshinee.site-blue?style=for-the-badge&logo=googlechrome&logoColor=white)](https://helpdesk.dshinee.site)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.0-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2.0-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## 📌 1. Giới Thiệu Dự Án

**HelpDesk Enterprise** là giải pháp số hóa toàn diện quy trình tiếp nhận, phân công, giám sát và giải quyết các yêu cầu hỗ trợ kỹ thuật, sự cố công nghệ thông tin trong cơ quan và doanh nghiệp. Hệ thống giải quyết triệt để các tồn đọng của phương thức hỗ trợ thủ công (Excel, Zalo, Email cá nhân) bằng cách chuẩn hóa vòng đời sự cố, tự động hóa điều phối công việc và đo lường chỉ số cam kết chất lượng dịch vụ (SLA).

### 🌟 Điểm Nhấn Kiến Trúc & Tính Năng Nổi Bật:
1. **Phân hệ Giao diện Kép Độc lập (Dual-Portal Architecture)**:
   - **Customer Portal (`/portal`)**: Giao diện dịch vụ người dùng hiện đại, tối giản, thân thiện; cung cấp Catalog danh mục sự cố, danh sách yêu cầu cá nhân, tra cứu cơ sở tri thức (FAQ) và form gửi yêu cầu trực quan.
   - **Admin & Staff Console (`/dashboard`)**: Giao diện bảng điều khiển kỹ thuật chuyên sâu dành cho Kỹ thuật viên (Agent), Trưởng nhóm điều phối (Manager) và Quản trị viên (Admin); tích hợp biểu đồ phân tích thời gian thực, bảng cảnh báo sự cố khẩn cấp và công cụ phân quyền tài khoản.
2. **Bảo Mật & Phân Quyền Đa Tầng (Strict RBAC)**:
   - Cơ chế bảo vệ Route đa lớp (`guards.jsx`, `AppLayout.jsx`) ngăn chặn tuyệt đối người dùng khách hàng truy cập trái phép vào trang điều hành kỹ thuật.
   - Xác thực phi trạng thái (Stateless Authentication) bằng JSON Web Token (JWT), mã hóa mật khẩu một chiều BCrypt.
3. **Trợ Lý Kỹ Thuật Thông Minh (AI Support Assistant)**:
   - Tích hợp mô hình AI từ Google AI Studio (Gemini Engine) trực tiếp trên giao diện để giải đáp lỗi 24/7 và hướng dẫn người dùng tự khắc phục sự cố phần cứng, mạng, tài khoản.
   - Khoanh vùng tri thức nghiêm ngặt (Strict Grounding & Guardrails): Chỉ phục vụ các vấn đề kỹ thuật thuộc phạm vi dự án, loại bỏ hoàn toàn các yếu tố ảo giác.
4. **Hạ Tầng Sẵn Sàng Triển Khai (Production-Ready)**:
   - Đóng gói toàn bộ hệ thống bằng Docker Compose, tương thích hoàn hảo với môi trường VPS aaPanel, Nginx Reverse Proxy và bảo mật SSL HTTPS.

---

## 🛠️ 2. Công Nghệ Sử Dụng (Tech Stack)

### Backend Service (`helpdesk-api`)
- **Ngôn ngữ & Nền tảng**: Java 17 LTS, Spring Boot 3.2.0
- **Bảo mật**: Spring Security 6, JWT (jjwt 0.11.5)
- **Truy xuất dữ liệu**: Spring Data JPA, Hibernate ORM
- **Quản lý Schema CSDL**: Flyway Migration (`V1__init_schema.sql`, `V2__seed_data.sql`)
- **Tài liệu API**: SpringDoc OpenAPI 2.3.0 (Swagger UI)
- **Giao tiếp Real-time**: Spring WebSocket STOMP
- **Tiện ích**: Project Lombok, Java Mail Sender

### Frontend Web (`helpdesk-web`)
- **Nền tảng**: React 18, Vite 6, JavaScript (ESNext)
- **Giao diện & Styling**: Tailwind CSS, PostCSS, Lucide React Icons
- **Quản lý Trạng thái**: Zustand Store
- **Điều hướng & Định tuyến**: React Router Dom v6
- **Trực quan hóa Dữ liệu**: Recharts (AreaChart, PieChart, ResponsiveContainer)
- **HTTP Client**: Axios (với JWT Request & Response Interceptors)

### Cơ Sở Dữ Liệu & Bộ Nhớ Đệm
- **PostgreSQL 15**: Lưu trữ dữ liệu quan hệ, hỗ trợ ràng buộc toàn vẹn và chỉ mục B-Tree.
- **Redis 7**: Caching session, giới hạn tần suất truy cập (Rate Limiting).

---

## 📂 3. Cấu Trúc Dự Án (Repository Structure)

```
HelpDesk_2026/
├── .env.example                     # Mẫu biến môi trường chuẩn
├── .gitignore                       # Quy chuẩn bỏ qua tệp nhạy cảm và build cache
├── docker-compose.yml               # Cấu hình khởi chạy trọn bộ Full-Stack
├── docs/                            # Toàn bộ tài liệu thiết kế (Chương 2 Báo cáo)
│   ├── architecture.md              # Thiết kế kiến trúc tổng thể & Deployment Diagram
│   ├── api/api_specification.md     # Đặc tả chi tiết hơn 50 RESTful API endpoints
│   ├── database/schema_design.md    # Thiết kế CSDL chi tiết 14 bảng quan hệ
│   ├── deployment/aapanel_deploy_guide.md # Hướng dẫn deploy lên aaPanel và kết nối Domain
│   ├── ui/sitemap_and_wireframes.md # Sitemap và wireframe 13 màn hình
│   └── usecases/usecase_specifications.md # Đặc tả Use Case 10 nhóm yêu cầu YC1 - YC10
├── helpdesk-api/                    # Mã nguồn Backend (Spring Boot 3)
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/helpdesk/
│       │   ├── config/              # SecurityConfig, WebSocketConfig, CorsConfig
│       │   ├── dto/                 # DTOs cho Auth, Ticket, User, Response wrappers
│       │   ├── entity/              # 14 JPA Entities (User, Ticket, SlaPolicy...)
│       │   ├── enums/               # UserRole, TicketStatus, NotificationType...
│       │   ├── exception/           # GlobalExceptionHandler, Custom Exceptions
│       │   └── security/            # JwtTokenProvider, JwtAuthenticationFilter
│       └── resources/
│           ├── application.yml      # Cấu hình đa môi trường (dev / prod)
│           └── db/migration/        # Flyway DDL & Seed Data scripts
├── helpdesk-web/                    # Mã nguồn Frontend (React + Vite + Tailwind CSS)
│   ├── Dockerfile
│   ├── nginx.conf                   # Cấu hình Nginx phục vụ Single Page App (SPA)
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── api/                     # Axios instance & API caller modules
│       ├── components/              # Buttons, Cards, Badges, Layouts, Chatbot
│       ├── pages/                   # Màn hình Admin Console & Customer Portal
│       ├── routes/                  # guards.jsx (Kiểm soát phân quyền RBAC)
│       ├── services/                # geminiService.js (Trợ lý kỹ thuật AI)
│       └── store/                   # authStore.js (Zustand session state)
└── nginx/
    └── nginx.conf                   # Cấu hình Reverse Proxy Gateway
```

---

## 👥 4. Ma Trận Phân Quyền & Tài Khoản Trải Nghiệm (Demo Credentials)

Hệ thống thiết lập sẵn 4 vai trò người dùng chuẩn hóa theo quy trình vận hành dịch vụ:

| Vai trò | Mã Phân Quyền | Phạm vi Truy cập | Mô tả nhiệm vụ |
| :--- | :---: | :--- | :--- |
| **Khách Hàng / Nhân Viên** | `CUSTOMER` | Chỉ truy cập Cổng Dịch Vụ (`/portal`) | Gửi yêu cầu hỗ trợ, theo dõi tiến độ, chat trên phiếu, tra cứu FAQ, đánh giá CSAT |
| **Kỹ Thuật Viên** | `AGENT` | Truy cập Admin & Staff Console | Tiếp nhận phiếu được gán, cập nhật trạng thái xử lý, trao đổi nội bộ, ghi nhận giải pháp |
| **Quản Lý / Điều Phối** | `MANAGER` | Truy cập Admin & Staff Console | Giám sát vi phạm SLA, điều phối phiếu thủ công, xem báo cáo hiệu suất kỹ thuật viên |
| **Quản Trị Viên** | `ADMIN` | Toàn quyền hệ thống | Quản trị tài khoản nhân sự, cơ cấu phòng ban, cấu hình chính sách SLA và quy tắc leo thang |

> **Thông tin tài khoản kiểm thử nhanh trên trang Đăng nhập:**
> - **Mật khẩu chung:** `password123`
> - **Tài khoản User:** `customer`
> - **Tài khoản Kỹ thuật viên:** `agent`
> - **Tài khoản Quản lý:** `manager`
> - **Tài khoản Quản trị:** `admin`  
> *(Tại trang đăng nhập có sẵn bộ nút chuyển đổi vai trò nhanh để trải nghiệm tức thì)*

---

## 🚀 5. Hướng Dẫn Cài Đặt & Khởi Chạy (Quick Start)

### Cách 1: Khởi Chạy Bằng Docker Compose (Khuyên dùng cho Production & Server)
```bash
# 1. Sao chép mã nguồn từ repository
git clone https://github.com/dungnguyen0537/HelpDesk_2026.git
cd HelpDesk_2026

# 2. Khởi tạo tệp môi trường
cp .env.example .env

# 3. Khởi chạy toàn bộ hệ thống
docker compose up -d --build
```
Hệ thống sẽ tự động khởi tạo:
- **Cổng Dịch Vụ Web**: `http://localhost:3000`
- **Cổng API Backend**: `http://localhost:8080/api`
- **Cơ sở dữ liệu PostgreSQL**: Cổng `5432`
- **Bộ nhớ đệm Redis**: Cổng `6379`

### Cách 2: Chạy Môi Trường Phát Triển Cục Bộ (Frontend Local Dev)
```bash
cd helpdesk-web
npm install
npm run dev
```
Truy cập giao diện phát triển tại: `http://localhost:3000`

---

## 📄 6. Giấy Phép & Bản Quyền

Dự án được xây dựng phục vụ học phần **Đồ án chuyên ngành Công nghệ Thông tin**, áp dụng các tiêu chuẩn công nghệ phần mềm và kiến trúc micro-service doanh nghiệp hiện đại.

---

© 2026 Design By [DShinee](https://zalo.me/0833685262) — All rights reserved.

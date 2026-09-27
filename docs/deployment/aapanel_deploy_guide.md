# Hướng Dẫn Triển Khai HelpDesk Lên aaPanel & Trỏ Domain

Tài liệu này hướng dẫn chi tiết từng bước đưa hệ thống **HelpDesk Enterprise 2026** lên VPS/Server chạy **aaPanel** và kết nối với tên miền (Domain) có chứng chỉ bảo mật SSL miễn phí (Let's Encrypt).

---

## MỤC LỤC
1. [Chuẩn bị trước khi triển khai](#1-chuẩn-bị-trước-khi-triển-khai)
2. [Cách 1: Triển khai bằng Docker trên aaPanel (Khuyên Dùng - Tối ưu nhất)](#2-cách-1-triển-khai-bằng-docker-trên-aapanel-khuyên-dùng)
3. [Cách 2: Triển khai thủ công (Nginx Static + Java Manager)](#3-cách-2-triển-khai-thủ-công)
4. [Trỏ Domain & Cấu hình Reverse Proxy](#4-trỏ-domain--cấu-hình-reverse-proxy)
5. [Cài đặt SSL miễn phí (HTTPS)](#5-cài-đặt-ssl-miễn-phí-https)
6. [Xử lý sự cố thường gặp (Troubleshooting)](#6-xử-lý-sự-cố-thường-gặp)

---

## 1. Chuẩn Bị Trước Khi Triển Khai

1. **VPS / Cloud Server**:
   - Hệ điều hành: Ubuntu 20.04/22.04 LTS hoặc Debian 11/12, AlmaLinux 9.
   - Cấu hình khuyến nghị: Tối thiểu 1 vCPU, 2GB RAM (hoặc 1GB RAM nếu bật Swap 2GB).
2. **aaPanel đã cài đặt**:
   - Truy cập vào trang quản trị aaPanel qua cổng mặc định (ví dụ: `http://IP_VPS:8888`).
3. **Tên miền (Domain)**:
   - Truy cập vào trang quản lý DNS của nhà cung cấp tên miền (Cloudflare, Namecheap, MatBao, PA Vietnam...).
   - Tạo bản ghi **A record**:
     - **Host / Name**: `@` (hoặc subdomain như `helpdesk`)
     - **Value / IPv4**: Điền địa chỉ IP của VPS aaPanel.
     - Ví dụ: `helpdesk.yourcompany.com` $\rightarrow$ `103.x.x.x`.

---

## 2. Cách 1: Triển khai bằng Docker trên aaPanel (Khuyên Dùng)

Phương pháp này cô lập toàn bộ môi trường (Java 17, PostgreSQL 15, Redis 7, React build), không gây xung đột với các website khác trên aaPanel.

### Bước 2.1: Cài đặt Docker trên aaPanel
1. Trong menu bên trái aaPanel, chọn **App Store**.
2. Tìm kiếm **Docker Manager** $\rightarrow$ Nhấn **Install**.
3. Sau khi cài xong, chuyển sang tab **Docker** trên menu của aaPanel.

### Bước 2.2: Kéo mã nguồn từ GitHub về VPS
1. Mở mục **Terminal** trong aaPanel (hoặc SSH bằng PuTTY/Terminal từ máy tính):
   ```bash
   # Tạo thư mục chứa dự án
   mkdir -p /www/wwwroot/helpdesk
   cd /www/wwwroot/helpdesk

   # Clone mã nguồn từ GitHub
   git clone https://github.com/dungnguyen0537/HelpDesk_2026.git .
   ```

2. Tạo file cấu hình môi trường `.env`:
   ```bash
   cp .env.example .env
   nano .env
   ```
   *(Điền các thông tin mật khẩu DB, JWT Secret hoặc giữ mặc định).*

### Bước 2.3: Khởi chạy toàn bộ hệ thống bằng Docker Compose
Trong Terminal tại thư mục `/www/wwwroot/helpdesk`:
```bash
docker compose up -d --build
```
Kiểm tra trạng thái các container đang chạy:
```bash
docker compose ps
```
Hệ thống sẽ chạy các container:
- `helpdesk-postgres`: Cổng 5432
- `helpdesk-redis`: Cổng 6379
- `helpdesk-api`: Cổng 8080
- `helpdesk-web`: Cổng 3000

---

## 3. Trỏ Domain & Cấu hình Reverse Proxy Trên aaPanel

Sau khi các container chạy thành công, chúng ta sử dụng Nginx của aaPanel để điều hướng tên miền vào hệ thống:

### Bước 3.1: Tạo Website mới trên aaPanel
1. Trong menu bên trái aaPanel, chọn **Website** $\rightarrow$ Bấm **Add site**.
2. Điền thông tin:
   - **Domain name**: Nhập domain của bạn (ví dụ: `helpdesk.yourcompany.com`).
   - **Description**: Hệ thống HelpDesk Enterprise.
   - **Root directory**: Giữ mặc định `/www/wwwroot/helpdesk.yourcompany.com`.
   - **FTP / Database / PHP**: Chọn **No PHP** (vì ta dùng Reverse Proxy).
3. Nhấn **Submit**.

### Bước 3.2: Cấu hình Reverse Proxy
1. Tại danh sách website vừa tạo, nhấn vào **tên miền** hoặc chọn **Conf**.
2. Chọn mục **Reverse Proxy** trong cột bên trái $\rightarrow$ Nhấn **Add reverse proxy**.
3. Thiết lập thông số:
   - **Proxy name**: `helpdesk_proxy`
   - **Target URL**: `http://127.0.0.1:3000` (hoặc cổng Nginx của container).
   - **Sent Domain**: `$host`
4. Bấm **Save**.

### Bước 3.3: Hỗ trợ WebSocket (Real-time Notification)
Để tính năng thông báo và cập nhật ticket thời gian thực hoạt động qua Nginx, vào mục **Config** của website đó trên aaPanel, tìm đoạn `location /` hoặc thêm cấu hình sau vào trong khối `server { ... }`:

```nginx
# Proxy API Backend
location /api {
    proxy_pass http://127.0.0.1:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

# Proxy WebSocket
location /ws {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```
Nhấn **Save** để áp dụng.

---

## 4. Cài Đặt SSL Miễn Phí (HTTPS)

1. Trong cửa sổ cấu hình website trên aaPanel, chọn mục **SSL**.
2. Chọn tab **Let's Encrypt**.
3. Tích chọn vào tên miền của bạn $\rightarrow$ Chọn phương thức xác thực:
   - **File verification** (Khuyên dùng).
4. Nhấn nút **Apply**.
5. Sau khi cấp phát thành công, gạt bật công tắc **Force HTTPS** để tự động chuyển hướng toàn bộ truy cập từ `http://` sang `https://`.

---

## 5. Mở Cổng Tường Lửa (Security / Firewall)

Trên aaPanel, vào mục **Security**:
- Đảm bảo các cổng sau đang ở trạng thái **Open / Accept**:
  - `80` (HTTP)
  - `443` (HTTPS)
- Không cần mở cổng `8080`, `5432`, `6379` ra ngoài Internet vì các cổng này chỉ giao tiếp nội bộ thông qua Nginx Reverse Proxy, giúp bảo mật tối đa cho cơ sở dữ liệu.

---

## 6. Xử Lý Sự Cố Thường Gặp (Troubleshooting)

1. **Domain không truy cập được (DNS chưa nhận)**:
   - Mở Command Prompt trên máy tính, gõ: `ping helpdesk.yourcompany.com`.
   - Nếu kết quả trả về đúng địa chỉ IP VPS của bạn là DNS đã hoạt động. Nếu chưa, hãy đợi từ 5 - 15 phút để DNS quốc tế phân giải.

2. **Lỗi 502 Bad Gateway**:
   - Container frontend hoặc backend chưa khởi động xong.
   - Kiểm tra log bằng lệnh: `docker compose logs -f helpdesk-api` hoặc `docker compose logs -f helpdesk-web`.

3. **VPS bị tràn RAM khi build**:
   - Nếu VPS chỉ có 1GB RAM, hãy bật Swap 2GB trong aaPanel:
     - Vào **App Store** $\rightarrow$ Cài đặt plugin **Linux Tools** $\rightarrow$ Mục **Swap** $\rightarrow$ Đặt dung lượng `2048 MB` $\rightarrow$ Apply.

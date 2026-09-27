# Tài Liệu Thiết Kế Cơ Sở Dữ Liệu HelpDesk (PostgreSQL)

## 1. Tổng quan kiến trúc
Hệ thống HelpDesk sử dụng PostgreSQL làm hệ quản trị cơ sở dữ liệu chính, hỗ trợ quản lý vòng đời yêu cầu hỗ trợ (tickets), phân quyền theo vai trò (RBAC), cam kết mức dịch vụ (SLA), quy tắc leo thang (escalation), khảo sát chất lượng (feedback), cơ sở tri thức (knowledge base) và thông báo thời gian thực (notifications).

Hệ thống bao gồm **14 bảng**:
1. `departments`: Phòng ban / đơn vị
2. `users`: Tài khoản người dùng trong hệ thống
3. `agent_profiles`: Hồ sơ mở rộng và kỹ năng của nhân viên hỗ trợ
4. `categories`: Danh mục sự cố / yêu cầu
5. `priorities`: Mức độ ưu tiên
6. `sla_policies`: Chính sách SLA áp dụng theo danh mục và mức độ ưu tiên
7. `tickets`: Phiếu yêu cầu hỗ trợ
8. `ticket_comments`: Bình luận trao đổi trong ticket (nội bộ hoặc công khai)
9. `ticket_attachments`: Tệp tin đính kèm trong ticket hoặc comment
10. `ticket_history`: Lịch sử kiểm toán và thay đổi trạng thái ticket
11. `escalation_rules`: Quy tắc tự động leo thang khi vi phạm thời gian SLA
12. `feedback`: Đánh giá phản hồi và CSAT từ khách hàng
13. `knowledge_base`: Bài viết hướng dẫn giải pháp / FAQ
14. `notifications`: Thông báo cho người dùng qua ứng dụng / web

---

## 2. Chi tiết 14 Bảng, Ràng buộc và Indexes

### 2.1. `departments` (Phòng ban)
- **Mục đích**: Quản lý các phòng ban chức năng (IT Support, HR, Kế toán, Khách hàng...).
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `code`: VARCHAR(50) UNIQUE NOT NULL (Mã phòng ban, ví dụ: IT_OPS, HR_DEPT)
  - `name`: VARCHAR(150) NOT NULL (Tên phòng ban)
  - `description`: TEXT
  - `manager_id`: BIGINT (Người phụ trách phòng ban, FK đến users.id)
  - `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`code`)
  - FK `manager_id` REFERENCES `users(id)` ON DELETE SET NULL
- **Indexes**:
  - `idx_departments_code`: B-Tree trên `code`
  - `idx_departments_is_active`: B-Tree trên `is_active`

---

### 2.2. `users` (Người dùng)
- **Mục đích**: Quản lý tài khoản đăng nhập và phân quyền hệ thống.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `username`: VARCHAR(50) UNIQUE NOT NULL
  - `email`: VARCHAR(150) UNIQUE NOT NULL
  - `password_hash`: VARCHAR(255) NOT NULL
  - `full_name`: VARCHAR(150) NOT NULL
  - `phone_number`: VARCHAR(20)
  - `role`: VARCHAR(30) NOT NULL (ADMIN, MANAGER, AGENT, CUSTOMER)
  - `department_id`: BIGINT (FK -> departments.id)
  - `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
  - `avatar_url`: VARCHAR(500)
  - `last_login_at`: TIMESTAMP WITH TIME ZONE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`username`), UNIQUE(`email`)
  - FK `department_id` REFERENCES `departments(id)` ON DELETE SET NULL
  - CHECK (`role` IN ('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER'))
- **Indexes**:
  - `idx_users_username`: B-Tree trên `username`
  - `idx_users_email`: B-Tree trên `email`
  - `idx_users_role`: B-Tree trên `role`
  - `idx_users_department`: B-Tree trên `department_id`

---

### 2.3. `agent_profiles` (Hồ sơ hỗ trợ viên)
- **Mục đích**: Thông tin nghiệp vụ cho kỹ thuật viên/agent (kỹ năng, giới hạn ticket, trạng thái tiếp nhận).
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `user_id`: BIGINT UNIQUE NOT NULL (FK -> users.id)
  - `skills`: TEXT (Danh sách kỹ năng, phân cách bởi dấu phẩy hoặc JSON string)
  - `max_active_tickets`: INTEGER NOT NULL DEFAULT 5
  - `current_ticket_count`: INTEGER NOT NULL DEFAULT 0
  - `is_available`: BOOLEAN NOT NULL DEFAULT TRUE
  - `rating_avg`: NUMERIC(3,2) DEFAULT 0.00
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`user_id`)
  - FK `user_id` REFERENCES `users(id)` ON DELETE CASCADE
  - CHECK (`max_active_tickets` >= 0 AND `current_ticket_count` >= 0)
- **Indexes**:
  - `idx_agent_profiles_user_id`: B-Tree trên `user_id`
  - `idx_agent_profiles_available`: B-Tree trên `is_available`, `current_ticket_count`

---

### 2.4. `categories` (Danh mục sự cố / yêu cầu)
- **Mục đích**: Phân loại ticket và phân bổ đến phòng ban phụ trách.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `code`: VARCHAR(50) UNIQUE NOT NULL
  - `name`: VARCHAR(150) NOT NULL
  - `description`: TEXT
  - `department_id`: BIGINT (FK -> departments.id, phòng ban chuyên trách)
  - `parent_id`: BIGINT (Hỗ trợ phân cấp cha - con)
  - `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`code`)
  - FK `department_id` REFERENCES `departments(id)` ON DELETE SET NULL
  - FK `parent_id` REFERENCES `categories(id)` ON DELETE CASCADE
- **Indexes**:
  - `idx_categories_code`: B-Tree trên `code`
  - `idx_categories_parent_id`: B-Tree trên `parent_id`
  - `idx_categories_department_id`: B-Tree trên `department_id`

---

### 2.5. `priorities` (Mức độ ưu tiên)
- **Mục đích**: Quy định cấp độ ưu tiên (LOW, MEDIUM, HIGH, URGENT) với trọng số và màu sắc hiển thị.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `code`: VARCHAR(30) UNIQUE NOT NULL
  - `name`: VARCHAR(50) NOT NULL
  - `level_weight`: INTEGER NOT NULL (Trọng số ưu tiên, ví dụ: 10, 20, 30, 40)
  - `color_hex`: VARCHAR(10) DEFAULT '#707070'
  - `description`: TEXT
  - `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`code`), UNIQUE(`level_weight`)
- **Indexes**:
  - `idx_priorities_code`: B-Tree trên `code`
  - `idx_priorities_weight`: B-Tree trên `level_weight`

---

### 2.6. `sla_policies` (Chính sách cam kết mức độ dịch vụ)
- **Mục đích**: Xác định thời hạn phản hồi đầu tiên (first response) và thời hạn xử lý dứt điểm (resolution).
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `name`: VARCHAR(150) NOT NULL
  - `description`: TEXT
  - `category_id`: BIGINT (FK -> categories.id)
  - `priority_id`: BIGINT (FK -> priorities.id)
  - `first_response_time_minutes`: INTEGER NOT NULL (Thời gian tối đa để phản hồi lần đầu)
  - `resolution_time_minutes`: INTEGER NOT NULL (Thời gian tối đa để xử lý)
  - `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - FK `category_id` REFERENCES `categories(id)` ON DELETE SET NULL
  - FK `priority_id` REFERENCES `priorities(id)` ON DELETE SET NULL
  - CHECK (`first_response_time_minutes` > 0 AND `resolution_time_minutes` > 0)
- **Indexes**:
  - `idx_sla_policies_category_priority`: B-Tree trên `category_id`, `priority_id`
  - `idx_sla_policies_is_active`: B-Tree trên `is_active`

---

### 2.7. `tickets` (Phiếu yêu cầu hỗ trợ)
- **Mục đích**: Lưu trữ thông tin chi tiết của từng sự cố/yêu cầu.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `ticket_number`: VARCHAR(50) UNIQUE NOT NULL (Định dạng: TIK-YYYYMMDD-XXXX)
  - `title`: VARCHAR(255) NOT NULL
  - `description`: TEXT NOT NULL
  - `status`: VARCHAR(30) NOT NULL (NEW, ASSIGNED, IN_PROGRESS, PENDING, RESOLVED, CLOSED, CANCELLED)
  - `creator_id`: BIGINT NOT NULL (FK -> users.id)
  - `assignee_id`: BIGINT (FK -> users.id)
  - `department_id`: BIGINT (FK -> departments.id)
  - `category_id`: BIGINT (FK -> categories.id)
  - `priority_id`: BIGINT (FK -> priorities.id)
  - `sla_policy_id`: BIGINT (FK -> sla_policies.id)
  - `first_responded_at`: TIMESTAMP WITH TIME ZONE
  - `resolved_at`: TIMESTAMP WITH TIME ZONE
  - `closed_at`: TIMESTAMP WITH TIME ZONE
  - `sla_response_deadline`: TIMESTAMP WITH TIME ZONE
  - `sla_resolution_deadline`: TIMESTAMP WITH TIME ZONE
  - `sla_response_breached`: BOOLEAN NOT NULL DEFAULT FALSE
  - `sla_resolution_breached`: BOOLEAN NOT NULL DEFAULT FALSE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`ticket_number`)
  - FK `creator_id` REFERENCES `users(id)`
  - FK `assignee_id` REFERENCES `users(id)` ON DELETE SET NULL
  - FK `department_id` REFERENCES `departments(id)` ON DELETE SET NULL
  - FK `category_id` REFERENCES `categories(id)` ON DELETE SET NULL
  - FK `priority_id` REFERENCES `priorities(id)` ON DELETE SET NULL
  - FK `sla_policy_id` REFERENCES `sla_policies(id)` ON DELETE SET NULL
- **Indexes**:
  - `idx_tickets_number`: B-Tree trên `ticket_number`
  - `idx_tickets_status`: B-Tree trên `status`
  - `idx_tickets_creator`: B-Tree trên `creator_id`
  - `idx_tickets_assignee`: B-Tree trên `assignee_id`
  - `idx_tickets_created_at`: B-Tree trên `created_at` DESC
  - `idx_tickets_sla_resolution_deadline`: B-Tree trên `sla_resolution_deadline` WHERE status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')

---

### 2.8. `ticket_comments` (Bình luận / Phản hồi)
- **Mục đích**: Trao đổi giữa người dùng và nhân viên, hỗ trợ ghi chú nội bộ (internal note).
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `ticket_id`: BIGINT NOT NULL (FK -> tickets.id)
  - `user_id`: BIGINT NOT NULL (FK -> users.id)
  - `content`: TEXT NOT NULL
  - `is_internal`: BOOLEAN NOT NULL DEFAULT FALSE (Chỉ agent và manager thấy)
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - FK `ticket_id` REFERENCES `tickets(id)` ON DELETE CASCADE
  - FK `user_id` REFERENCES `users(id)`
- **Indexes**:
  - `idx_ticket_comments_ticket`: B-Tree trên `ticket_id`, `created_at`
  - `idx_ticket_comments_user`: B-Tree trên `user_id`

---

### 2.9. `ticket_attachments` (Tệp đính kèm)
- **Mục đích**: Lưu tệp hình ảnh, tài liệu đính kèm theo ticket hoặc theo comment.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `ticket_id`: BIGINT NOT NULL (FK -> tickets.id)
  - `comment_id`: BIGINT (FK -> ticket_comments.id, nullable nếu đính kèm vào ticket ban đầu)
  - `uploader_id`: BIGINT NOT NULL (FK -> users.id)
  - `file_name`: VARCHAR(255) NOT NULL
  - `file_path`: VARCHAR(500) NOT NULL
  - `file_size`: BIGINT NOT NULL (bytes)
  - `file_type`: VARCHAR(100) NOT NULL (MIME type)
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - FK `ticket_id` REFERENCES `tickets(id)` ON DELETE CASCADE
  - FK `comment_id` REFERENCES `ticket_comments(id)` ON DELETE CASCADE
  - FK `uploader_id` REFERENCES `users(id)`
- **Indexes**:
  - `idx_ticket_attachments_ticket`: B-Tree trên `ticket_id`
  - `idx_ticket_attachments_comment`: B-Tree trên `comment_id`

---

### 2.10. `ticket_history` (Nhật ký kiểm toán ticket)
- **Mục đích**: Theo dõi toàn bộ thay đổi của ticket (trạng thái, người phân công, độ ưu tiên, v.v.).
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `ticket_id`: BIGINT NOT NULL (FK -> tickets.id)
  - `changed_by`: BIGINT (FK -> users.id)
  - `field_name`: VARCHAR(100) NOT NULL (Ví dụ: status, priority, assignee)
  - `old_value`: TEXT
  - `new_value`: TEXT
  - `action`: VARCHAR(50) NOT NULL (CREATED, STATUS_CHANGED, ASSIGNED, ESCALATED, UPDATED)
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - FK `ticket_id` REFERENCES `tickets(id)` ON DELETE CASCADE
  - FK `changed_by` REFERENCES `users(id)` ON DELETE SET NULL
- **Indexes**:
  - `idx_ticket_history_ticket`: B-Tree trên `ticket_id`, `created_at`
  - `idx_ticket_history_action`: B-Tree trên `action`

---

### 2.11. `escalation_rules` (Quy tắc leo thang)
- **Mục đích**: Tự động chuyển giao ticket cấp cao hơn hoặc gửi cảnh báo khi vi phạm SLA.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `name`: VARCHAR(150) NOT NULL
  - `description`: TEXT
  - `category_id`: BIGINT (FK -> categories.id)
  - `priority_id`: BIGINT (FK -> priorities.id)
  - `trigger_type`: VARCHAR(50) NOT NULL (SLA_RESPONSE_NEAR_BREACH, SLA_RESPONSE_BREACHED, SLA_RESOLUTION_NEAR_BREACH, SLA_RESOLUTION_BREACHED)
  - `trigger_after_minutes`: INTEGER NOT NULL DEFAULT 0
  - `target_role`: VARCHAR(30) NOT NULL (MANAGER, ADMIN)
  - `escalate_to_user_id`: BIGINT (FK -> users.id)
  - `is_active`: BOOLEAN NOT NULL DEFAULT TRUE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - FK `category_id` REFERENCES `categories(id)` ON DELETE CASCADE
  - FK `priority_id` REFERENCES `priorities(id)` ON DELETE CASCADE
  - FK `escalate_to_user_id` REFERENCES `users(id)` ON DELETE SET NULL
- **Indexes**:
  - `idx_escalation_rules_trigger`: B-Tree trên `trigger_type`, `is_active`

---

### 2.12. `feedback` (Khảo sát đánh giá khách hàng)
- **Mục đích**: Thu thập chỉ số CSAT và đánh giá sau khi ticket đóng/giải quyết.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `ticket_id`: BIGINT UNIQUE NOT NULL (FK -> tickets.id)
  - `customer_id`: BIGINT NOT NULL (FK -> users.id)
  - `rating`: INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5)
  - `comment`: TEXT
  - `is_satisfied`: BOOLEAN NOT NULL DEFAULT TRUE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`ticket_id`)
  - FK `ticket_id` REFERENCES `tickets(id)` ON DELETE CASCADE
  - FK `customer_id` REFERENCES `users(id)`
- **Indexes**:
  - `idx_feedback_ticket_id`: B-Tree trên `ticket_id`
  - `idx_feedback_rating`: B-Tree trên `rating`

---

### 2.13. `knowledge_base` (Cơ sở tri thức / FAQ)
- **Mục đích**: Lưu bài viết giải pháp, tài liệu hỗ trợ người dùng tự giải quyết vấn đề.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `title`: VARCHAR(255) NOT NULL
  - `slug`: VARCHAR(255) UNIQUE NOT NULL
  - `category_id`: BIGINT (FK -> categories.id)
  - `author_id`: BIGINT NOT NULL (FK -> users.id)
  - `content`: TEXT NOT NULL
  - `status`: VARCHAR(30) NOT NULL DEFAULT 'DRAFT' (DRAFT, PUBLISHED, ARCHIVED)
  - `view_count`: INTEGER NOT NULL DEFAULT 0
  - `useful_count`: INTEGER NOT NULL DEFAULT 0
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
  - `updated_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - UNIQUE(`slug`)
  - FK `category_id` REFERENCES `categories(id)` ON DELETE SET NULL
  - FK `author_id` REFERENCES `users(id)`
- **Indexes**:
  - `idx_kb_slug`: B-Tree trên `slug`
  - `idx_kb_category_status`: B-Tree trên `category_id`, `status`
  - `idx_kb_title_trgm`: Hỗ trợ Full-text/gin search (hoặc B-Tree title)

---

### 2.14. `notifications` (Thông báo người dùng)
- **Mục đích**: Gửi thông báo trong ứng dụng khi có cập nhật ticket, vi phạm SLA hoặc bình luận mới.
- **Cấu trúc**:
  - `id`: BIGSERIAL PRIMARY KEY
  - `recipient_id`: BIGINT NOT NULL (FK -> users.id)
  - `title`: VARCHAR(255) NOT NULL
  - `content`: TEXT NOT NULL
  - `type`: VARCHAR(50) NOT NULL (TICKET_CREATED, TICKET_ASSIGNED, TICKET_UPDATED, COMMENT_ADDED, SLA_WARNING, SLA_BREACHED, ESCALATION)
  - `reference_id`: BIGINT (ID của entity liên kết như ticket_id)
  - `reference_type`: VARCHAR(50) (Loại đối tượng liên kết, ví dụ: 'TICKET')
  - `is_read`: BOOLEAN NOT NULL DEFAULT FALSE
  - `read_at`: TIMESTAMP WITH TIME ZONE
  - `created_at`: TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
- **Ràng buộc**:
  - FK `recipient_id` REFERENCES `users(id)` ON DELETE CASCADE
- **Indexes**:
  - `idx_notifications_recipient_read`: B-Tree trên `recipient_id`, `is_read`
  - `idx_notifications_created_at`: B-Tree trên `created_at` DESC

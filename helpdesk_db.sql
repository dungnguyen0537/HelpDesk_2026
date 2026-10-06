-- ==============================================================================
-- Flyway Migration: V1__init_schema.sql
-- Mô tả: Khởi tạo cấu trúc 14 bảng, ràng buộc và indexes cho hệ thống HelpDesk
-- ==============================================================================

-- 1. BẢNG DEPARTMENTS (Phòng ban)
CREATE TABLE IF NOT EXISTS departments (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    manager_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_departments_code UNIQUE (code)
);

-- 2. BẢNG USERS (Người dùng)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(30) NOT NULL,
    department_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    avatar_url VARCHAR(500),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_username UNIQUE (username),
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')),
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- Bổ sung FK manager_id cho departments tham chiếu đến users
ALTER TABLE departments 
    ADD CONSTRAINT fk_departments_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- 3. BẢNG AGENT_PROFILES (Hồ sơ hỗ trợ viên)
CREATE TABLE IF NOT EXISTS agent_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    skills TEXT,
    max_active_tickets INTEGER NOT NULL DEFAULT 5,
    current_ticket_count INTEGER NOT NULL DEFAULT 0,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    rating_avg NUMERIC(3,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_agent_profiles_user UNIQUE (user_id),
    CONSTRAINT fk_agent_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_agent_profiles_counts CHECK (max_active_tickets >= 0 AND current_ticket_count >= 0)
);

-- 4. BẢNG CATEGORIES (Danh mục sự cố / yêu cầu)
CREATE TABLE IF NOT EXISTS categories (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    department_id BIGINT,
    parent_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_categories_code UNIQUE (code),
    CONSTRAINT fk_categories_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- 5. BẢNG PRIORITIES (Mức độ ưu tiên)
CREATE TABLE IF NOT EXISTS priorities (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(30) NOT NULL,
    name VARCHAR(50) NOT NULL,
    level_weight INTEGER NOT NULL,
    color_hex VARCHAR(10) DEFAULT '#707070',
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_priorities_code UNIQUE (code),
    CONSTRAINT uq_priorities_weight UNIQUE (level_weight)
);

-- 6. BẢNG SLA_POLICIES (Chính sách cam kết mức độ dịch vụ)
CREATE TABLE IF NOT EXISTS sla_policies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category_id BIGINT,
    priority_id BIGINT,
    first_response_time_minutes INTEGER NOT NULL,
    resolution_time_minutes INTEGER NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sla_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_sla_priority FOREIGN KEY (priority_id) REFERENCES priorities(id) ON DELETE SET NULL,
    CONSTRAINT chk_sla_times CHECK (first_response_time_minutes > 0 AND resolution_time_minutes > 0)
);

-- 7. BẢNG TICKETS (Phiếu yêu cầu hỗ trợ)
CREATE TABLE IF NOT EXISTS tickets (
    id BIGSERIAL PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    creator_id BIGINT NOT NULL,
    assignee_id BIGINT,
    department_id BIGINT,
    category_id BIGINT,
    priority_id BIGINT,
    sla_policy_id BIGINT,
    first_responded_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    sla_response_deadline TIMESTAMP WITH TIME ZONE,
    sla_resolution_deadline TIMESTAMP WITH TIME ZONE,
    sla_response_breached BOOLEAN NOT NULL DEFAULT FALSE,
    sla_resolution_breached BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tickets_number UNIQUE (ticket_number),
    CONSTRAINT chk_tickets_status CHECK (status IN ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'PENDING', 'RESOLVED', 'CLOSED', 'CANCELLED')),
    CONSTRAINT fk_tickets_creator FOREIGN KEY (creator_id) REFERENCES users(id),
    CONSTRAINT fk_tickets_assignee FOREIGN KEY (assignee_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_priority FOREIGN KEY (priority_id) REFERENCES priorities(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_sla_policy FOREIGN KEY (sla_policy_id) REFERENCES sla_policies(id) ON DELETE SET NULL
);

-- 8. BẢNG TICKET_COMMENTS (Bình luận / trao đổi)
CREATE TABLE IF NOT EXISTS ticket_comments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    is_internal BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 9. BẢNG TICKET_ATTACHMENTS (Tệp tin đính kèm)
CREATE TABLE IF NOT EXISTS ticket_attachments (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    comment_id BIGINT,
    uploader_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_attachments_comment FOREIGN KEY (comment_id) REFERENCES ticket_comments(id) ON DELETE CASCADE,
    CONSTRAINT fk_attachments_uploader FOREIGN KEY (uploader_id) REFERENCES users(id)
);

-- 10. BẢNG TICKET_HISTORY (Lịch sử kiểm toán ticket)
CREATE TABLE IF NOT EXISTS ticket_history (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    changed_by BIGINT,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    action VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_history_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_history_user FOREIGN KEY (changed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 11. BẢNG ESCALATION_RULES (Quy tắc leo thang)
CREATE TABLE IF NOT EXISTS escalation_rules (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    category_id BIGINT,
    priority_id BIGINT,
    trigger_type VARCHAR(50) NOT NULL,
    trigger_after_minutes INTEGER NOT NULL DEFAULT 0,
    target_role VARCHAR(30) NOT NULL,
    escalate_to_user_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_escalation_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    CONSTRAINT fk_escalation_priority FOREIGN KEY (priority_id) REFERENCES priorities(id) ON DELETE CASCADE,
    CONSTRAINT fk_escalation_user FOREIGN KEY (escalate_to_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 12. BẢNG FEEDBACK (Khảo sát đánh giá khách hàng)
CREATE TABLE IF NOT EXISTS feedback (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    is_satisfied BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_feedback_ticket UNIQUE (ticket_id),
    CONSTRAINT chk_feedback_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT fk_feedback_ticket FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
    CONSTRAINT fk_feedback_customer FOREIGN KEY (customer_id) REFERENCES users(id)
);

-- 13. BẢNG KNOWLEDGE_BASE (Cơ sở tri thức / FAQ)
CREATE TABLE IF NOT EXISTS knowledge_base (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    category_id BIGINT,
    author_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    view_count INTEGER NOT NULL DEFAULT 0,
    useful_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_kb_slug UNIQUE (slug),
    CONSTRAINT chk_kb_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    CONSTRAINT fk_kb_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT fk_kb_author FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 14. BẢNG NOTIFICATIONS (Thông báo)
CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    recipient_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    reference_id BIGINT,
    reference_type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_recipient FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================================
-- INDEXES
-- ==============================================================================

-- Departments
CREATE INDEX IF NOT EXISTS idx_departments_code ON departments(code);
CREATE INDEX IF NOT EXISTS idx_departments_is_active ON departments(is_active);

-- Users
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department_id);

-- Agent Profiles
CREATE INDEX IF NOT EXISTS idx_agent_profiles_user_id ON agent_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_profiles_available ON agent_profiles(is_available, current_ticket_count);

-- Categories
CREATE INDEX IF NOT EXISTS idx_categories_code ON categories(code);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_department_id ON categories(department_id);

-- Priorities
CREATE INDEX IF NOT EXISTS idx_priorities_code ON priorities(code);
CREATE INDEX IF NOT EXISTS idx_priorities_weight ON priorities(level_weight);

-- SLA Policies
CREATE INDEX IF NOT EXISTS idx_sla_policies_category_priority ON sla_policies(category_id, priority_id);
CREATE INDEX IF NOT EXISTS idx_sla_policies_is_active ON sla_policies(is_active);

-- Tickets
CREATE INDEX IF NOT EXISTS idx_tickets_number ON tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_creator ON tickets(creator_id);
CREATE INDEX IF NOT EXISTS idx_tickets_assignee ON tickets(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_deadline ON tickets(sla_resolution_deadline) WHERE status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED');

-- Ticket Comments
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket ON ticket_comments(ticket_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_user ON ticket_comments(user_id);

-- Ticket Attachments
CREATE INDEX IF NOT EXISTS idx_ticket_attachments_ticket ON ticket_attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_attachments_comment ON ticket_attachments(comment_id);

-- Ticket History
CREATE INDEX IF NOT EXISTS idx_ticket_history_ticket ON ticket_history(ticket_id, created_at);
CREATE INDEX IF NOT EXISTS idx_ticket_history_action ON ticket_history(action);

-- Escalation Rules
CREATE INDEX IF NOT EXISTS idx_escalation_rules_trigger ON escalation_rules(trigger_type, is_active);

-- Feedback
CREATE INDEX IF NOT EXISTS idx_feedback_ticket_id ON feedback(ticket_id);
CREATE INDEX IF NOT EXISTS idx_feedback_rating ON feedback(rating);

-- Knowledge Base
CREATE INDEX IF NOT EXISTS idx_kb_slug ON knowledge_base(slug);
CREATE INDEX IF NOT EXISTS idx_kb_category_status ON knowledge_base(category_id, status);

-- Notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_read ON notifications(recipient_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
-- ==============================================================================
-- Flyway Migration: V2__seed_data.sql
-- Mô tả: Dữ liệu mẫu chuẩn hóa cho hệ thống HelpDesk
-- ==============================================================================

-- 1. DEPARTMENTS
INSERT INTO departments (id, code, name, description, is_active) VALUES
(1, 'IT_SUPPORT', 'Phòng Hỗ trợ Kỹ thuật & Hạ tầng', 'Chịu trách nhiệm phần cứng, phần mềm, mạng và tài khoản', true),
(2, 'CUSTOMER_CARE', 'Phòng Chăm sóc Khách hàng', 'Tiếp nhận các yêu cầu dịch vụ và phản hồi trải nghiệm', true),
(3, 'HR_ADMIN', 'Phòng Nhân sự & Hành chính', 'Giải quyết thắc mắc quyền lợi nhân viên, hồ sơ, chế độ', true),
(4, 'FINANCE_ACC', 'Phòng Kế toán & Tài chính', 'Hóa đơn, thanh toán, hoàn tiền và đối soát', true)
ON CONFLICT (code) DO NOTHING;

-- 2. USERS (Mật khẩu mẫu đã hash BCrypt: 'Password@123' -> '$2a$10$e8Z4wZ8hL4yDq1XoN.b68OUf91nJ7YF24Uf8d75eLzZ5K9U5hV6kO')
INSERT INTO users (id, username, email, password_hash, full_name, phone_number, role, department_id, is_active) VALUES
(1, 'admin', 'admin@helpdesk.com', '$2a$10$e8Z4wZ8hL4yDq1XoN.b68OUf91nJ7YF24Uf8d75eLzZ5K9U5hV6kO', 'Quản trị viên Hệ thống', '0901234567', 'ADMIN', 1, true),
(2, 'manager_it', 'it.manager@helpdesk.com', '$2a$10$e8Z4wZ8hL4yDq1XoN.b68OUf91nJ7YF24Uf8d75eLzZ5K9U5hV6kO', 'Trưởng phòng Kỹ thuật', '0902345678', 'MANAGER', 1, true),
(3, 'agent_nam', 'nam.agent@helpdesk.com', '$2a$10$e8Z4wZ8hL4yDq1XoN.b68OUf91nJ7YF24Uf8d75eLzZ5K9U5hV6kO', 'Nguyễn Văn Nam (Kỹ thuật viên)', '0903456789', 'AGENT', 1, true),
(4, 'agent_hoa', 'hoa.agent@helpdesk.com', '$2a$10$e8Z4wZ8hL4yDq1XoN.b68OUf91nJ7YF24Uf8d75eLzZ5K9U5hV6kO', 'Lê Thị Hoa (Chăm sóc KH)', '0904567890', 'AGENT', 2, true),
(5, 'cust_minh', 'minh.customer@gmail.com', '$2a$10$e8Z4wZ8hL4yDq1XoN.b68OUf91nJ7YF24Uf8d75eLzZ5K9U5hV6kO', 'Trần Quang Minh (Khách hàng)', '0915678901', 'CUSTOMER', NULL, true),
(6, 'cust_lan', 'lan.customer@gmail.com', '$2a$10$e8Z4wZ8hL4yDq1XoN.b68OUf91nJ7YF24Uf8d75eLzZ5K9U5hV6kO', 'Hoàng Hương Lan (Khách hàng)', '0916789012', 'CUSTOMER', NULL, true)
ON CONFLICT (username) DO NOTHING;

-- Gán Manager cho phòng IT
UPDATE departments SET manager_id = 2 WHERE id = 1;

-- 3. AGENT PROFILES
INSERT INTO agent_profiles (id, user_id, skills, max_active_tickets, current_ticket_count, is_available, rating_avg) VALUES
(1, 3, 'Network, Hardware, VPN, Windows Server, Database', 10, 2, true, 4.85),
(2, 4, 'Customer Support, Billing, Account Access, Service Consultation', 12, 1, true, 4.90)
ON CONFLICT (user_id) DO NOTHING;

-- 4. PRIORITIES
INSERT INTO priorities (id, code, name, level_weight, color_hex, description, is_active) VALUES
(1, 'LOW', 'Thấp', 10, '#28A745', 'Vấn đề nhỏ, không ảnh hưởng đến hoạt động chung', true),
(2, 'MEDIUM', 'Trung bình', 20, '#17A2B8', 'Vấn đề thông thường, ảnh hưởng một vài chức năng phụ', true),
(3, 'HIGH', 'Cao', 30, '#FFC107', 'Vấn đề ảnh hưởng nghiêm trọng tới công việc cá nhân/bộ phận', true),
(4, 'URGENT', 'Khẩn cấp', 40, '#DC3545', 'Hệ thống ngừng trệ, ảnh hưởng toàn bộ tổ chức hoặc khách hàng lớn', true)
ON CONFLICT (code) DO NOTHING;

-- 5. CATEGORIES
INSERT INTO categories (id, code, name, description, department_id, parent_id, is_active) VALUES
(1, 'HARDWARE', 'Sự cố Phần cứng', 'Hỏng hóc máy tính, máy in, thiết bị ngoại vi', 1, NULL, true),
(2, 'SOFTWARE', 'Sự cố Phần mềm & Ứng dụng', 'Lỗi ứng dụng nội bộ, office, bản quyền', 1, NULL, true),
(3, 'NETWORK', 'Mạng & Truy cập', 'Mạng LAN, Wifi, VPN, truy cập từ xa', 1, NULL, true),
(4, 'ACCOUNT', 'Tài khoản & Phân quyền', 'Quên mật khẩu, cấp mới tài khoản, phân quyền', 1, NULL, true),
(5, 'BILLING', 'Hóa đơn & Thanh toán', 'Thắc mắc cước phí, hóa đơn, thanh toán', 4, NULL, true)
ON CONFLICT (code) DO NOTHING;

-- 6. SLA POLICIES
INSERT INTO sla_policies (id, name, description, category_id, priority_id, first_response_time_minutes, resolution_time_minutes, is_active) VALUES
(1, 'SLA Khẩn cấp - Mạng / Hạ tầng', 'Áp dụng cho sự cố mạng mức độ khẩn cấp', 3, 4, 15, 120, true),
(2, 'SLA Cao - Phần cứng & Ứng dụng', 'Áp dụng cho sự cố phần cứng hoặc phần mềm ưu tiên cao', 1, 3, 30, 240, true),
(3, 'SLA Chuẩn - Tài khoản', 'Áp dụng cho yêu cầu hỗ trợ tài khoản thông thường', 4, 2, 60, 480, true),
(4, 'SLA Mặc định - Thấp', 'Áp dụng cho các yêu cầu chung không khẩn cấp', NULL, 1, 120, 1440, true)
ON CONFLICT DO NOTHING;

-- 7. ESCALATION RULES
INSERT INTO escalation_rules (id, name, description, category_id, priority_id, trigger_type, trigger_after_minutes, target_role, escalate_to_user_id, is_active) VALUES
(1, 'Leo thang vi phạm phản hồi khẩn cấp', 'Tự động báo cáo Trưởng phòng IT khi ticket khẩn cấp chưa có phản hồi sau 15 phút', 3, 4, 'SLA_RESPONSE_BREACHED', 15, 'MANAGER', 2, true),
(2, 'Cảnh báo sắp hết hạn xử lý mức Cao', 'Thông báo quản trị viên khi ticket mức cao còn 30 phút là hết hạn', 1, 3, 'SLA_RESOLUTION_NEAR_BREACH', 30, 'MANAGER', 2, true)
ON CONFLICT DO NOTHING;

-- 8. TICKETS MẪU
INSERT INTO tickets (id, ticket_number, title, description, status, creator_id, assignee_id, department_id, category_id, priority_id, sla_policy_id, sla_response_deadline, sla_resolution_deadline, sla_response_breached, sla_resolution_breached, created_at) VALUES
(1, 'TIK-20260927-0001', 'Không thể kết nối VPN công ty từ nhà', 'Khi đăng nhập VPN báo lỗi xác thực chứng chỉ số (Certificate expired).', 'IN_PROGRESS', 5, 3, 1, 3, 3, 2, CURRENT_TIMESTAMP + INTERVAL '30 MINUTE', CURRENT_TIMESTAMP + INTERVAL '4 HOUR', false, false, CURRENT_TIMESTAMP),
(2, 'TIK-20260927-0002', 'Cần cấp quyền truy cập thư mục Kế toán', 'Nhân viên mới cần quyền đọc/ghi trên thư mục Shared_Finance.', 'NEW', 6, NULL, 1, 4, 2, 3, CURRENT_TIMESTAMP + INTERVAL '60 MINUTE', CURRENT_TIMESTAMP + INTERVAL '8 HOUR', false, false, CURRENT_TIMESTAMP)
ON CONFLICT (ticket_number) DO NOTHING;

-- 9. TICKET COMMENTS
INSERT INTO ticket_comments (id, ticket_id, user_id, content, is_internal, created_at) VALUES
(1, 1, 3, 'Chào bạn, kỹ thuật đã nhận thông tin và đang kiểm tra lại VPN Gateway.', false, CURRENT_TIMESTAMP),
(2, 1, 3, 'Ghi chú kỹ thuật: Cần gia hạn Certificate trên Firewall Fortinet.', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- 10. TICKET HISTORY
INSERT INTO ticket_history (id, ticket_id, changed_by, field_name, old_value, new_value, action, created_at) VALUES
(1, 1, 5, 'status', NULL, 'NEW', 'CREATED', CURRENT_TIMESTAMP - INTERVAL '15 MINUTE'),
(2, 1, 2, 'assignee_id', NULL, '3', 'ASSIGNED', CURRENT_TIMESTAMP - INTERVAL '10 MINUTE'),
(3, 1, 3, 'status', 'NEW', 'IN_PROGRESS', 'STATUS_CHANGED', CURRENT_TIMESTAMP - INTERVAL '5 MINUTE')
ON CONFLICT DO NOTHING;

-- 11. KNOWLEDGE BASE
INSERT INTO knowledge_base (id, title, slug, category_id, author_id, content, status, view_count, useful_count) VALUES
(1, 'Hướng dẫn kết nối VPN nội bộ an toàn', 'huong-dan-ket-noi-vpn-noi-bo-an-toan', 3, 2, '### Các bước cấu hình VPN:\n1. Tải phần mềm VPN Client từ cổng nội bộ.\n2. Nhập Host Gateway: `vpn.company.com`.\n3. Đăng nhập bằng tài khoản và mã OTP Google Authenticator.', 'PUBLISHED', 45, 12),
(2, 'Quy trình yêu cầu cấp tài khoản phần mềm', 'quy-trinh-yeu-cau-cap-tai-khoan-phan-mem', 4, 2, '### Quy trình:\n1. Điền biểu mẫu yêu cầu có xác nhận của trưởng bộ phận.\n2. Tạo ticket trong danh mục Tài khoản & Phân quyền.', 'PUBLISHED', 30, 8)
ON CONFLICT (slug) DO NOTHING;

-- 12. NOTIFICATIONS
INSERT INTO notifications (id, recipient_id, title, content, type, reference_id, reference_type, is_read) VALUES
(1, 3, 'Ticket mới được giao', 'Bạn vừa được chỉ định xử lý ticket TIK-20260927-0001', 'TICKET_ASSIGNED', 1, 'TICKET', false),
(2, 5, 'Ticket đã có phản hồi', 'Kỹ thuật viên Nguyễn Văn Nam đã phản hồi ticket của bạn.', 'COMMENT_ADDED', 1, 'TICKET', false)
ON CONFLICT DO NOTHING;

-- ĐỒNG BỘ SEQUENCES SAU KHI INSERT DỮ LIỆU CỐ ĐỊNH ID
SELECT setval('departments_id_seq', (SELECT MAX(id) FROM departments));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('agent_profiles_id_seq', (SELECT MAX(id) FROM agent_profiles));
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('priorities_id_seq', (SELECT MAX(id) FROM priorities));
SELECT setval('sla_policies_id_seq', (SELECT MAX(id) FROM sla_policies));
SELECT setval('escalation_rules_id_seq', (SELECT MAX(id) FROM escalation_rules));
SELECT setval('tickets_id_seq', (SELECT MAX(id) FROM tickets));
SELECT setval('ticket_comments_id_seq', (SELECT MAX(id) FROM ticket_comments));
SELECT setval('ticket_history_id_seq', (SELECT MAX(id) FROM ticket_history));
SELECT setval('knowledge_base_id_seq', (SELECT MAX(id) FROM knowledge_base));
SELECT setval('notifications_id_seq', (SELECT MAX(id) FROM notifications));

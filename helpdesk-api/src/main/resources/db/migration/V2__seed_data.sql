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

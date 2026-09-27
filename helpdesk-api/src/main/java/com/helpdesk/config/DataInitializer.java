package com.helpdesk.config;

import com.helpdesk.entity.AgentProfile;
import com.helpdesk.entity.Category;
import com.helpdesk.entity.Department;
import com.helpdesk.entity.Priority;
import com.helpdesk.entity.SlaPolicy;
import com.helpdesk.entity.Ticket;
import com.helpdesk.entity.TicketComment;
import com.helpdesk.entity.TicketHistory;
import com.helpdesk.entity.User;
import com.helpdesk.enums.TicketHistoryAction;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.enums.UserRole;
import com.helpdesk.repository.AgentProfileRepository;
import com.helpdesk.repository.CategoryRepository;
import com.helpdesk.repository.DepartmentRepository;
import com.helpdesk.repository.PriorityRepository;
import com.helpdesk.repository.SlaPolicyRepository;
import com.helpdesk.repository.TicketCommentRepository;
import com.helpdesk.repository.TicketHistoryRepository;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final PriorityRepository priorityRepository;
    private final SlaPolicyRepository slaPolicyRepository;
    private final TicketRepository ticketRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final AgentProfileRepository agentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0 && departmentRepository.count() > 0) {
            log.info("Dữ liệu hệ thống HelpDesk đã tồn tại. Bỏ qua bước khởi tạo mẫu.");
            return;
        }

        log.info("Bắt đầu khởi tạo dữ liệu mẫu cho hệ thống HelpDesk...");

        // 1. Departments
        Department itDept = createDepartmentIfNotFound("IT_OPS", "IT Operations", "Hạ tầng kỹ thuật, IT HelpDesk, phần cứng và mạng");
        Department prodDept = createDepartmentIfNotFound("PROD_DEV", "Phát triển Sản phẩm", "Bộ phận nghiên cứu và phát triển phần mềm công nghệ");
        Department finDept = createDepartmentIfNotFound("FINANCE", "Kế toán - Tài chính", "Quản lý tài chính, hóa đơn, thanh toán");
        Department hrDept = createDepartmentIfNotFound("HR_ADMIN", "Hành chính - Nhân sự", "Quản lý nhân sự, hồ sơ, phúc lợi nhân viên");

        // 2. Priorities
        Priority priLow = createPriorityIfNotFound("LOW", "Thấp", 10, "#28A745", "Vấn đề nhỏ, ít ảnh hưởng công việc");
        Priority priMedium = createPriorityIfNotFound("MEDIUM", "Trung bình", 20, "#17A2B8", "Vấn đề thông thường, ảnh hưởng một số tính năng");
        Priority priHigh = createPriorityIfNotFound("HIGH", "Cao", 30, "#FFC107", "Vấn đề nghiêm trọng, gián đoạn công việc");
        Priority priUrgent = createPriorityIfNotFound("URGENT", "Khẩn cấp", 40, "#DC3545", "Hệ thống dừng hoạt động, tê liệt quy trình kinh doanh");

        // 3. Categories
        Category catHardware = createCategoryIfNotFound("HARDWARE", "Phần cứng", "Hỏng hóc máy tính, máy in, phụ kiện ngoại vi", itDept);
        Category catNetwork = createCategoryIfNotFound("NETWORK_VPN", "Mạng & VPN", "Sự cố Wifi, mạng LAN, kết nối VPN từ xa", itDept);
        Category catSoftware = createCategoryIfNotFound("SOFTWARE", "Phần mềm", "Lỗi phần mềm nghiệp vụ, bản quyền, hệ điều hành", prodDept);
        Category catAccount = createCategoryIfNotFound("ACCOUNT", "Tài khoản", "Cấp mới, reset mật khẩu, phân quyền tài khoản", itDept);

        // 4. SLA Policies
        SlaPolicy slaUrgent = createSlaPolicyIfNotFound("SLA Khẩn cấp", "Phản hồi trong 15 phút, giải quyết trong 2 giờ", null, priUrgent, 15, 120);
        SlaPolicy slaHigh = createSlaPolicyIfNotFound("SLA Mức độ Cao", "Phản hồi trong 30 phút, giải quyết trong 4 giờ", null, priHigh, 30, 240);
        SlaPolicy slaMedium = createSlaPolicyIfNotFound("SLA Trung bình", "Phản hồi trong 60 phút, giải quyết trong 8 giờ", null, priMedium, 60, 480);
        SlaPolicy slaLow = createSlaPolicyIfNotFound("SLA Thấp", "Phản hồi trong 2 giờ, giải quyết trong 24 giờ", null, priLow, 120, 1440);

        // 5. Users (admin/password123, agent/password123, manager/password123, customer/password123)
        String encodedPass = passwordEncoder.encode("password123");

        User adminUser = createUserIfNotFound("admin", "admin@helpdesk.vn", encodedPass, "Quản trị viên Hệ thống", "0901234567", UserRole.ADMIN, itDept);
        User managerUser = createUserIfNotFound("manager", "manager@helpdesk.vn", encodedPass, "Trưởng phòng IT", "0902345678", UserRole.MANAGER, itDept);
        User agentUser = createUserIfNotFound("agent", "agent@helpdesk.vn", encodedPass, "Chuyên viên Kỹ thuật", "0903456789", UserRole.AGENT, itDept);
        User customerUser = createUserIfNotFound("customer", "customer@helpdesk.vn", encodedPass, "Khách hàng Doanh nghiệp", "0904567890", UserRole.CUSTOMER, hrDept);

        // Set manager for itDept
        itDept.setManager(managerUser);
        departmentRepository.save(itDept);

        // Agent Profile
        if (agentProfileRepository.findByUserId(agentUser.getId()).isEmpty()) {
            AgentProfile profile = AgentProfile.builder()
                    .user(agentUser)
                    .skills("Mạng LAN, VPN, Windows Server, Cài đặt phần mềm, Khắc phục phần cứng")
                    .maxActiveTickets(10)
                    .currentTicketCount(2)
                    .isAvailable(true)
                    .ratingAvg(BigDecimal.valueOf(4.90))
                    .build();
            agentProfileRepository.save(profile);
        }

        // 6. Tickets mẫu
        if (ticketRepository.count() == 0) {
            OffsetDateTime now = OffsetDateTime.now();

            // Ticket 1: VPN issue (IN_PROGRESS)
            Ticket ticket1 = Ticket.builder()
                    .ticketNumber("TIK-20260927-1001")
                    .title("Không thể kết nối vào mạng VPN nội bộ công ty")
                    .description("Khi kết nối VPN từ nhà qua client báo lỗi TLS certificate expired. Cần kết nối để xử lý công việc gấp.")
                    .status(TicketStatus.IN_PROGRESS)
                    .creator(customerUser)
                    .assignee(agentUser)
                    .department(itDept)
                    .category(catNetwork)
                    .priority(priHigh)
                    .slaPolicy(slaHigh)
                    .slaResponseDeadline(now.plusMinutes(30))
                    .slaResolutionDeadline(now.plusMinutes(240))
                    .firstRespondedAt(now.minusMinutes(10))
                    .slaResponseBreached(false)
                    .slaResolutionBreached(false)
                    .build();
            ticketRepository.save(ticket1);

            ticketHistoryRepository.save(TicketHistory.builder()
                    .ticket(ticket1)
                    .changedBy(customerUser)
                    .fieldName("status")
                    .newValue("NEW")
                    .action(TicketHistoryAction.CREATED)
                    .build());
            ticketHistoryRepository.save(TicketHistory.builder()
                    .ticket(ticket1)
                    .changedBy(managerUser)
                    .fieldName("assignee_id")
                    .newValue(agentUser.getFullName())
                    .action(TicketHistoryAction.ASSIGNED)
                    .build());
            ticketHistoryRepository.save(TicketHistory.builder()
                    .ticket(ticket1)
                    .changedBy(agentUser)
                    .fieldName("status")
                    .oldValue("ASSIGNED")
                    .newValue("IN_PROGRESS")
                    .action(TicketHistoryAction.STATUS_CHANGED)
                    .build());

            ticketCommentRepository.save(TicketComment.builder()
                    .ticket(ticket1)
                    .user(customerUser)
                    .content("Nhờ bộ phận IT hỗ trợ sớm giúp tôi, tôi cần truy cập server để cập nhật báo cáo.")
                    .isInternal(false)
                    .build());
            ticketCommentRepository.save(TicketComment.builder()
                    .ticket(ticket1)
                    .user(agentUser)
                    .content("Chào bạn, IT đã tiếp nhận và đang cập nhật chứng chỉ SSL trên Gateway VPN.")
                    .isInternal(false)
                    .build());
            ticketCommentRepository.save(TicketComment.builder()
                    .ticket(ticket1)
                    .user(agentUser)
                    .content("Ghi chú nội bộ: Cần reload nginx và gia hạn cert bot trên vpn-gw-01.")
                    .isInternal(true)
                    .build());

            // Ticket 2: Account creation (NEW)
            Ticket ticket2 = Ticket.builder()
                    .ticketNumber("TIK-20260927-1002")
                    .title("Cấp tài khoản mới cho nhân sự phòng Kế toán")
                    .description("Nhân viên mới Nguyễn Thị Mai nhận việc vào thứ Hai tuần tới. Cần cấp email @helpdesk.vn và phần mềm kế toán.")
                    .status(TicketStatus.NEW)
                    .creator(customerUser)
                    .assignee(null)
                    .department(itDept)
                    .category(catAccount)
                    .priority(priMedium)
                    .slaPolicy(slaMedium)
                    .slaResponseDeadline(now.plusMinutes(60))
                    .slaResolutionDeadline(now.plusMinutes(480))
                    .slaResponseBreached(false)
                    .slaResolutionBreached(false)
                    .build();
            ticketRepository.save(ticket2);

            ticketHistoryRepository.save(TicketHistory.builder()
                    .ticket(ticket2)
                    .changedBy(customerUser)
                    .fieldName("status")
                    .newValue("NEW")
                    .action(TicketHistoryAction.CREATED)
                    .build());

            // Ticket 3: Database failure (URGENT)
            Ticket ticket3 = Ticket.builder()
                    .ticketNumber("TIK-20260927-1003")
                    .title("Sự cố khẩn cấp: Gián đoạn kết nối hệ thống dữ liệu trung tâm")
                    .description("Hệ thống database chính gặp tình trạng connection pool timeout, các dịch vụ web nội bộ không ghi nhận được yêu cầu.")
                    .status(TicketStatus.IN_PROGRESS)
                    .creator(managerUser)
                    .assignee(agentUser)
                    .department(itDept)
                    .category(catSoftware)
                    .priority(priUrgent)
                    .slaPolicy(slaUrgent)
                    .slaResponseDeadline(now.plusMinutes(15))
                    .slaResolutionDeadline(now.plusMinutes(120))
                    .firstRespondedAt(now.minusMinutes(5))
                    .slaResponseBreached(false)
                    .slaResolutionBreached(false)
                    .build();
            ticketRepository.save(ticket3);

            ticketHistoryRepository.save(TicketHistory.builder()
                    .ticket(ticket3)
                    .changedBy(managerUser)
                    .fieldName("status")
                    .newValue("NEW")
                    .action(TicketHistoryAction.CREATED)
                    .build());
            ticketHistoryRepository.save(TicketHistory.builder()
                    .ticket(ticket3)
                    .changedBy(managerUser)
                    .fieldName("assignee_id")
                    .newValue(agentUser.getFullName())
                    .action(TicketHistoryAction.ASSIGNED)
                    .build());

            ticketCommentRepository.save(TicketComment.builder()
                    .ticket(ticket3)
                    .user(agentUser)
                    .content("Đang phân tích heap dump và kích hoạt node database dự phòng failover.")
                    .isInternal(true)
                    .build());

            // Ticket 4: Broken hardware (RESOLVED)
            Ticket ticket4 = Ticket.builder()
                    .ticketNumber("TIK-20260927-1004")
                    .title("Bàn phím máy tính bàn phòng Nhân sự bị kẹt phím Enter")
                    .description("Bàn phím Dell tại máy làm việc số 12 bị kẹt phím, cần thay thế hoặc vệ sinh.")
                    .status(TicketStatus.RESOLVED)
                    .creator(customerUser)
                    .assignee(agentUser)
                    .department(itDept)
                    .category(catHardware)
                    .priority(priLow)
                    .slaPolicy(slaLow)
                    .firstRespondedAt(now.minusHours(3))
                    .resolvedAt(now.minusHours(1))
                    .slaResponseBreached(false)
                    .slaResolutionBreached(false)
                    .build();
            ticketRepository.save(ticket4);

            ticketCommentRepository.save(TicketComment.builder()
                    .ticket(ticket4)
                    .user(agentUser)
                    .content("Đã cấp phát bàn phím mới và thu hồi bàn phím cũ về kho kỹ thuật.")
                    .isInternal(false)
                    .build());

            ticketHistoryRepository.save(TicketHistory.builder()
                    .ticket(ticket4)
                    .changedBy(agentUser)
                    .fieldName("status")
                    .oldValue("IN_PROGRESS")
                    .newValue("RESOLVED")
                    .action(TicketHistoryAction.STATUS_CHANGED)
                    .build());
        }

        log.info("Khởi tạo dữ liệu mẫu hoàn tất thành công! Sẵn sàng sử dụng.");
    }

    private Department createDepartmentIfNotFound(String code, String name, String description) {
        return departmentRepository.findByCode(code)
                .orElseGet(() -> departmentRepository.save(Department.builder()
                        .code(code)
                        .name(name)
                        .description(description)
                        .isActive(true)
                        .build()));
    }

    private Priority createPriorityIfNotFound(String code, String name, int levelWeight, String colorHex, String description) {
        return priorityRepository.findByCode(code)
                .orElseGet(() -> priorityRepository.save(Priority.builder()
                        .code(code)
                        .name(name)
                        .levelWeight(levelWeight)
                        .colorHex(colorHex)
                        .description(description)
                        .isActive(true)
                        .build()));
    }

    private Category createCategoryIfNotFound(String code, String name, String description, Department department) {
        return categoryRepository.findByCode(code)
                .orElseGet(() -> categoryRepository.save(Category.builder()
                        .code(code)
                        .name(name)
                        .description(description)
                        .department(department)
                        .isActive(true)
                        .build()));
    }

    private SlaPolicy createSlaPolicyIfNotFound(String name, String description, Category category, Priority priority,
                                                int responseMin, int resolutionMin) {
        return slaPolicyRepository.findByPriorityAndCategoryIsNull(priority)
                .orElseGet(() -> slaPolicyRepository.save(SlaPolicy.builder()
                        .name(name)
                        .description(description)
                        .category(category)
                        .priority(priority)
                        .firstResponseTimeMinutes(responseMin)
                        .resolutionTimeMinutes(resolutionMin)
                        .isActive(true)
                        .build()));
    }

    private User createUserIfNotFound(String username, String email, String passwordHash, String fullName,
                                      String phone, UserRole role, Department department) {
        return userRepository.findByUsername(username)
                .orElseGet(() -> userRepository.save(User.builder()
                        .username(username)
                        .email(email)
                        .passwordHash(passwordHash)
                        .fullName(fullName)
                        .phoneNumber(phone)
                        .role(role)
                        .department(department)
                        .isActive(true)
                        .build()));
    }
}

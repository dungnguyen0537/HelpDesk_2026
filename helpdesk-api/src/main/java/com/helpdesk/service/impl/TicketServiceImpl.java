package com.helpdesk.service.impl;

import com.helpdesk.dto.ticket.AssignTicketRequest;
import com.helpdesk.dto.ticket.CreateTicketRequest;
import com.helpdesk.dto.ticket.TicketCommentRequest;
import com.helpdesk.dto.ticket.TicketCommentResponse;
import com.helpdesk.dto.ticket.TicketFilterCriteria;
import com.helpdesk.dto.ticket.TicketResponse;
import com.helpdesk.dto.ticket.UpdateTicketStatusRequest;
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
import com.helpdesk.exception.ForbiddenException;
import com.helpdesk.exception.ResourceNotFoundException;
import com.helpdesk.repository.AgentProfileRepository;
import com.helpdesk.repository.CategoryRepository;
import com.helpdesk.repository.DepartmentRepository;
import com.helpdesk.repository.PriorityRepository;
import com.helpdesk.repository.SlaPolicyRepository;
import com.helpdesk.repository.TicketCommentRepository;
import com.helpdesk.repository.TicketHistoryRepository;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.service.TicketService;
import com.helpdesk.util.DtoMapper;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final PriorityRepository priorityRepository;
    private final SlaPolicyRepository slaPolicyRepository;
    private final TicketCommentRepository ticketCommentRepository;
    private final TicketHistoryRepository ticketHistoryRepository;
    private final AgentProfileRepository agentProfileRepository;

    @Override
    @Transactional
    public TicketResponse createTicket(CreateTicketRequest request, String currentUsername) {
        User creator = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục", "id", request.getCategoryId()));

        Priority priority = priorityRepository.findById(request.getPriorityId())
                .orElseThrow(() -> new ResourceNotFoundException("Mức độ ưu tiên", "id", request.getPriorityId()));

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phòng ban", "id", request.getDepartmentId()));
        } else if (category.getDepartment() != null) {
            department = category.getDepartment();
        }

        // Determine SLA policy
        SlaPolicy slaPolicy = slaPolicyRepository.findByCategoryAndPriority(category, priority)
                .or(() -> slaPolicyRepository.findByPriorityAndCategoryIsNull(priority))
                .orElse(null);

        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime responseDeadline = null;
        OffsetDateTime resolutionDeadline = null;

        if (slaPolicy != null) {
            if (slaPolicy.getFirstResponseTimeMinutes() != null && slaPolicy.getFirstResponseTimeMinutes() > 0) {
                responseDeadline = now.plusMinutes(slaPolicy.getFirstResponseTimeMinutes());
            }
            if (slaPolicy.getResolutionTimeMinutes() != null && slaPolicy.getResolutionTimeMinutes() > 0) {
                resolutionDeadline = now.plusMinutes(slaPolicy.getResolutionTimeMinutes());
            }
        }

        String ticketNumber = generateTicketNumber();

        Ticket ticket = Ticket.builder()
                .ticketNumber(ticketNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .status(TicketStatus.NEW)
                .creator(creator)
                .department(department)
                .category(category)
                .priority(priority)
                .slaPolicy(slaPolicy)
                .slaResponseDeadline(responseDeadline)
                .slaResolutionDeadline(resolutionDeadline)
                .slaResponseBreached(false)
                .slaResolutionBreached(false)
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        // Record history
        TicketHistory history = TicketHistory.builder()
                .ticket(savedTicket)
                .changedBy(creator)
                .fieldName("status")
                .oldValue(null)
                .newValue(TicketStatus.NEW.name())
                .action(TicketHistoryAction.CREATED)
                .build();
        ticketHistoryRepository.save(history);

        return DtoMapper.toTicketResponse(savedTicket);
    }

    @Override
    @Transactional(readOnly = true)
    public TicketResponse getTicketById(Long id, String currentUsername) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        validateAccess(ticket, currentUser);

        return DtoMapper.toTicketResponse(ticket);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TicketResponse> getAllTickets(TicketFilterCriteria criteria, Pageable pageable, String currentUsername) {
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        // Use custom pageable if criteria has paging specified and pageable is default
        Pageable effectivePageable = pageable;
        if (criteria != null) {
            Sort sort = Sort.by(
                    "ASC".equalsIgnoreCase(criteria.getSortDirection()) ? Sort.Direction.ASC : Sort.Direction.DESC,
                    StringUtils.hasText(criteria.getSortBy()) ? criteria.getSortBy() : "createdAt"
            );
            effectivePageable = PageRequest.of(criteria.getPage(), criteria.getSize(), sort);
        }

        Specification<Ticket> spec = createTicketSpecification(criteria, currentUser);
        Page<Ticket> page = ticketRepository.findAll(spec, effectivePageable);

        return page.map(DtoMapper::toTicketResponse);
    }

    @Override
    @Transactional
    public TicketResponse updateStatus(Long id, UpdateTicketStatusRequest request, String currentUsername) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        // Role check: Customers can only cancel their own ticket if still NEW or mark RESOLVED if satisfied
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            if (!ticket.getCreator().getId().equals(currentUser.getId())) {
                throw new ForbiddenException("Bạn không có quyền cập nhật ticket này");
            }
            if (request.getStatus() != TicketStatus.CANCELLED && request.getStatus() != TicketStatus.CLOSED) {
                throw new ForbiddenException("Khách hàng chỉ có quyền hủy hoặc đóng ticket của mình");
            }
        }

        TicketStatus oldStatus = ticket.getStatus();
        TicketStatus newStatus = request.getStatus();

        if (oldStatus != newStatus) {
            ticket.setStatus(newStatus);
            OffsetDateTime now = OffsetDateTime.now();

            if (newStatus == TicketStatus.RESOLVED && ticket.getResolvedAt() == null) {
                ticket.setResolvedAt(now);
                if (ticket.getSlaResolutionDeadline() != null && now.isAfter(ticket.getSlaResolutionDeadline())) {
                    ticket.setSlaResolutionBreached(true);
                }
            } else if (newStatus == TicketStatus.CLOSED && ticket.getClosedAt() == null) {
                ticket.setClosedAt(now);
            } else if (newStatus == TicketStatus.IN_PROGRESS && ticket.getFirstRespondedAt() == null) {
                ticket.setFirstRespondedAt(now);
                if (ticket.getSlaResponseDeadline() != null && now.isAfter(ticket.getSlaResponseDeadline())) {
                    ticket.setSlaResponseBreached(true);
                }
            }

            // Save history
            TicketHistory history = TicketHistory.builder()
                    .ticket(ticket)
                    .changedBy(currentUser)
                    .fieldName("status")
                    .oldValue(oldStatus.name())
                    .newValue(newStatus.name())
                    .action(TicketHistoryAction.STATUS_CHANGED)
                    .build();
            ticketHistoryRepository.save(history);

            // If note provided, add comment
            if (StringUtils.hasText(request.getSolutionNote())) {
                TicketComment comment = TicketComment.builder()
                        .ticket(ticket)
                        .user(currentUser)
                        .content("[Cập nhật trạng thái sang " + newStatus.name() + "]: " + request.getSolutionNote())
                        .isInternal(false)
                        .build();
                ticketCommentRepository.save(comment);
            }
        }

        Ticket updatedTicket = ticketRepository.save(ticket);
        return DtoMapper.toTicketResponse(updatedTicket);
    }

    @Override
    @Transactional
    public TicketResponse assignTicket(Long id, AssignTicketRequest request, String currentUsername) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        if (currentUser.getRole() == UserRole.CUSTOMER) {
            throw new ForbiddenException("Khách hàng không có quyền phân công ticket");
        }

        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() -> new ResourceNotFoundException("Kỹ thuật viên", "id", request.getAssigneeId()));

        User oldAssignee = ticket.getAssignee();
        ticket.setAssignee(assignee);

        if (ticket.getStatus() == TicketStatus.NEW) {
            ticket.setStatus(TicketStatus.ASSIGNED);
        }

        // Update agent profile current ticket count
        Optional<AgentProfile> profileOpt = agentProfileRepository.findByUserId(assignee.getId());
        profileOpt.ifPresent(profile -> {
            profile.setCurrentTicketCount(profile.getCurrentTicketCount() + 1);
            agentProfileRepository.save(profile);
        });

        // Record history
        TicketHistory history = TicketHistory.builder()
                .ticket(ticket)
                .changedBy(currentUser)
                .fieldName("assignee_id")
                .oldValue(oldAssignee != null ? oldAssignee.getFullName() : "Chưa phân công")
                .newValue(assignee.getFullName())
                .action(TicketHistoryAction.ASSIGNED)
                .build();
        ticketHistoryRepository.save(history);

        if (StringUtils.hasText(request.getNote())) {
            TicketComment comment = TicketComment.builder()
                    .ticket(ticket)
                    .user(currentUser)
                    .content("[Phân công xử lý]: " + request.getNote())
                    .isInternal(true)
                    .build();
            ticketCommentRepository.save(comment);
        }

        Ticket savedTicket = ticketRepository.save(ticket);
        return DtoMapper.toTicketResponse(savedTicket);
    }

    @Override
    @Transactional
    public TicketCommentResponse addComment(Long id, TicketCommentRequest request, String currentUsername) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        validateAccess(ticket, currentUser);

        boolean isInternal = Boolean.TRUE.equals(request.getIsInternal());
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            isInternal = false;
        }

        // If agent responded for first time, update firstRespondedAt
        if (currentUser.getRole() != UserRole.CUSTOMER && ticket.getFirstRespondedAt() == null) {
            ticket.setFirstRespondedAt(OffsetDateTime.now());
            if (ticket.getSlaResponseDeadline() != null && ticket.getFirstRespondedAt().isAfter(ticket.getSlaResponseDeadline())) {
                ticket.setSlaResponseBreached(true);
            }
            ticketRepository.save(ticket);
        }

        TicketComment comment = TicketComment.builder()
                .ticket(ticket)
                .user(currentUser)
                .content(request.getContent())
                .isInternal(isInternal)
                .build();

        TicketComment savedComment = ticketCommentRepository.save(comment);
        return DtoMapper.toTicketCommentResponse(savedComment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TicketCommentResponse> getCommentsByTicketId(Long id, String currentUsername) {
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket", "id", id));

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        validateAccess(ticket, currentUser);

        List<TicketComment> comments;
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            comments = ticketCommentRepository.findByTicketIdAndIsInternalFalseOrderByCreatedAtAsc(id);
        } else {
            comments = ticketCommentRepository.findByTicketIdOrderByCreatedAtAsc(id);
        }

        return comments.stream()
                .map(DtoMapper::toTicketCommentResponse)
                .collect(Collectors.toList());
    }

    private void validateAccess(Ticket ticket, User currentUser) {
        if (currentUser.getRole() == UserRole.CUSTOMER) {
            if (!ticket.getCreator().getId().equals(currentUser.getId())) {
                throw new ForbiddenException("Bạn không có quyền truy cập ticket này");
            }
        }
    }

    private Specification<Ticket> createTicketSpecification(TicketFilterCriteria criteria, User currentUser) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Role based filtering
            if (currentUser.getRole() == UserRole.CUSTOMER) {
                predicates.add(cb.equal(root.get("creator").get("id"), currentUser.getId()));
            }

            if (criteria == null) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            if (StringUtils.hasText(criteria.getSearch())) {
                String pattern = "%" + criteria.getSearch().trim().toLowerCase() + "%";
                Predicate searchPred = cb.or(
                        cb.like(cb.lower(root.get("ticketNumber")), pattern),
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                );
                predicates.add(searchPred);
            }

            if (criteria.getStatus() != null) {
                predicates.add(cb.equal(root.get("status"), criteria.getStatus()));
            }

            if (criteria.getPriorityId() != null) {
                predicates.add(cb.equal(root.get("priority").get("id"), criteria.getPriorityId()));
            }

            if (criteria.getCategoryId() != null) {
                predicates.add(cb.equal(root.get("category").get("id"), criteria.getCategoryId()));
            }

            if (criteria.getDepartmentId() != null) {
                predicates.add(cb.equal(root.get("department").get("id"), criteria.getDepartmentId()));
            }

            if (criteria.getCreatorId() != null && currentUser.getRole() != UserRole.CUSTOMER) {
                predicates.add(cb.equal(root.get("creator").get("id"), criteria.getCreatorId()));
            }

            if (criteria.getAssigneeId() != null) {
                predicates.add(cb.equal(root.get("assignee").get("id"), criteria.getAssigneeId()));
            }

            if (Boolean.TRUE.equals(criteria.getIsBreached())) {
                predicates.add(cb.or(
                        cb.isTrue(root.get("slaResponseBreached")),
                        cb.isTrue(root.get("slaResolutionBreached"))
                ));
            }

            if (criteria.getCreatedFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createdAt"), criteria.getCreatedFrom()));
            }

            if (criteria.getCreatedTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createdAt"), criteria.getCreatedTo()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private synchronized String generateTicketNumber() {
        String datePrefix = OffsetDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String prefix = "TIK-" + datePrefix + "-";

        for (int i = 0; i < 10; i++) {
            int randomNum = ThreadLocalRandom.current().nextInt(1000, 9999);
            String candidate = prefix + randomNum;
            if (!ticketRepository.existsByTicketNumber(candidate)) {
                return candidate;
            }
        }
        return prefix + System.currentTimeMillis() % 10000;
    }
}

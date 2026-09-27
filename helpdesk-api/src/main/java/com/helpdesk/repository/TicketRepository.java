package com.helpdesk.repository;

import com.helpdesk.entity.Category;
import com.helpdesk.entity.Department;
import com.helpdesk.entity.Priority;
import com.helpdesk.entity.Ticket;
import com.helpdesk.entity.User;
import com.helpdesk.enums.TicketStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, JpaSpecificationExecutor<Ticket> {

    Optional<Ticket> findByTicketNumber(String ticketNumber);

    boolean existsByTicketNumber(String ticketNumber);

    Page<Ticket> findByStatus(TicketStatus status, Pageable pageable);

    Page<Ticket> findByCreator(User creator, Pageable pageable);

    Page<Ticket> findByCreatorId(Long creatorId, Pageable pageable);

    Page<Ticket> findByAssignee(User assignee, Pageable pageable);

    Page<Ticket> findByAssigneeId(Long assigneeId, Pageable pageable);

    Page<Ticket> findByDepartment(Department department, Pageable pageable);

    Page<Ticket> findByDepartmentId(Long departmentId, Pageable pageable);

    Page<Ticket> findByPriority(Priority priority, Pageable pageable);

    Page<Ticket> findByPriorityId(Long priorityId, Pageable pageable);

    Page<Ticket> findByCategory(Category category, Pageable pageable);

    Page<Ticket> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Ticket> findByStatusAndAssignee(TicketStatus status, User assignee, Pageable pageable);

    Page<Ticket> findByStatusAndCreator(TicketStatus status, User creator, Pageable pageable);

    Page<Ticket> findByStatusAndDepartment(TicketStatus status, Department department, Pageable pageable);

    long countByStatus(TicketStatus status);

    long countByStatusIn(Collection<TicketStatus> statuses);

    long countByPriority(Priority priority);

    long countByPriorityCode(String priorityCode);

    long countBySlaResolutionBreachedTrue();

    long countBySlaResponseBreachedTrue();

    @Query("SELECT t.status, COUNT(t) FROM Ticket t GROUP BY t.status")
    List<Object[]> countTicketsGroupedByStatus();

    @Query("SELECT t.priority.name, COUNT(t) FROM Ticket t GROUP BY t.priority.name")
    List<Object[]> countTicketsGroupedByPriority();

    @Query("SELECT t.category.name, COUNT(t) FROM Ticket t GROUP BY t.category.name")
    List<Object[]> countTicketsGroupedByCategory();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.assignee.id = :assigneeId AND t.status IN :activeStatuses")
    int countActiveTicketsForAssignee(@Param("assigneeId") Long assigneeId, @Param("activeStatuses") Collection<TicketStatus> activeStatuses);
}

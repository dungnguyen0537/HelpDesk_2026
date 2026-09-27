package com.helpdesk.repository;

import com.helpdesk.entity.Category;
import com.helpdesk.entity.Priority;
import com.helpdesk.entity.SlaPolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SlaPolicyRepository extends JpaRepository<SlaPolicy, Long> {

    Optional<SlaPolicy> findByCategoryAndPriority(Category category, Priority priority);

    Optional<SlaPolicy> findByCategoryIdAndPriorityId(Long categoryId, Long priorityId);

    Optional<SlaPolicy> findByPriorityAndCategoryIsNull(Priority priority);

    Optional<SlaPolicy> findByPriorityIdAndCategoryIsNull(Long priorityId);

    List<SlaPolicy> findByIsActiveTrue();
}

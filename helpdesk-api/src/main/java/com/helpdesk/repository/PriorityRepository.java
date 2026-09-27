package com.helpdesk.repository;

import com.helpdesk.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriorityRepository extends JpaRepository<Priority, Long> {

    Optional<Priority> findByCode(String code);

    boolean existsByCode(String code);

    List<Priority> findByIsActiveTrueOrderByLevelWeightAsc();

    Optional<Priority> findByLevelWeight(Integer levelWeight);
}

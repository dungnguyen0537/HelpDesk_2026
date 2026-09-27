package com.helpdesk.repository;

import com.helpdesk.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByCode(String code);

    boolean existsByCode(String code);

    List<Category> findByDepartmentId(Long departmentId);

    List<Category> findByIsActiveTrue();

    List<Category> findByParentIsNullAndIsActiveTrue();
}

package com.helpdesk.repository;

import com.helpdesk.entity.User;
import com.helpdesk.enums.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    Optional<User> findByUsernameOrEmail(String username, String email);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    List<User> findByRole(UserRole role);

    Page<User> findByRole(UserRole role, Pageable pageable);

    List<User> findByDepartmentId(Long departmentId);

    Page<User> findByDepartmentId(Long departmentId, Pageable pageable);

    List<User> findByRoleAndIsActiveTrue(UserRole role);

    long countByRole(UserRole role);

    long countByIsActiveTrue();
}

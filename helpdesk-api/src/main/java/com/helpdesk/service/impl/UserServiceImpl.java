package com.helpdesk.service.impl;

import com.helpdesk.dto.user.CreateUserRequest;
import com.helpdesk.dto.user.UpdateUserRequest;
import com.helpdesk.dto.user.UserResponse;
import com.helpdesk.entity.AgentProfile;
import com.helpdesk.entity.Department;
import com.helpdesk.entity.User;
import com.helpdesk.enums.UserRole;
import com.helpdesk.exception.ConflictException;
import com.helpdesk.exception.ResourceNotFoundException;
import com.helpdesk.repository.AgentProfileRepository;
import com.helpdesk.repository.DepartmentRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.service.UserService;
import com.helpdesk.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AgentProfileRepository agentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable).map(DtoMapper::toUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsersList() {
        return userRepository.findAll().stream()
                .map(DtoMapper::toUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse createUser(CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Tên tài khoản '" + request.getUsername() + "' đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email '" + request.getEmail() + "' đã được sử dụng");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phòng ban", "id", request.getDepartmentId()));
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(request.getRole() != null ? request.getRole() : UserRole.CUSTOMER)
                .department(department)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // If creating an agent, auto create agent profile
        if (savedUser.getRole() == UserRole.AGENT) {
            AgentProfile profile = AgentProfile.builder()
                    .user(savedUser)
                    .skills("Hỗ trợ kỹ thuật chung")
                    .maxActiveTickets(5)
                    .currentTicketCount(0)
                    .isAvailable(true)
                    .ratingAvg(BigDecimal.ZERO)
                    .build();
            agentProfileRepository.save(profile);
            savedUser.setAgentProfile(profile);
        }

        return DtoMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getAvatarUrl() != null) {
            user.setAvatarUrl(request.getAvatarUrl());
        }

        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Phòng ban", "id", request.getDepartmentId()));
            user.setDepartment(department);
        }

        User updatedUser = userRepository.save(user);
        return DtoMapper.toUserResponse(updatedUser);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
        return DtoMapper.toUserResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", username));
        return DtoMapper.toUserResponse(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "id", id));
        user.setIsActive(false);
        userRepository.save(user);
    }
}

package com.helpdesk.service;

import com.helpdesk.dto.user.CreateUserRequest;
import com.helpdesk.dto.user.UpdateUserRequest;
import com.helpdesk.dto.user.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {

    Page<UserResponse> getAllUsers(Pageable pageable);

    List<UserResponse> getAllUsersList();

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUser(Long id, UpdateUserRequest request);

    UserResponse getUserById(Long id);

    UserResponse getUserByUsername(String username);

    void deleteUser(Long id);
}

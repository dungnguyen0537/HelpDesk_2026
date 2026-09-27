package com.helpdesk.service;

import com.helpdesk.dto.auth.AuthResponse;
import com.helpdesk.dto.auth.ChangePasswordRequest;
import com.helpdesk.dto.auth.LoginRequest;
import com.helpdesk.dto.auth.RefreshTokenRequest;
import com.helpdesk.dto.auth.RegisterRequest;
import com.helpdesk.dto.user.UserResponse;

public interface AuthService {

    AuthResponse login(LoginRequest request);

    AuthResponse register(RegisterRequest request);

    void changePassword(String currentUsername, ChangePasswordRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    UserResponse getCurrentUser(String currentUsername);
}

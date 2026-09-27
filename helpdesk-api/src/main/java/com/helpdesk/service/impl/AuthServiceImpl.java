package com.helpdesk.service.impl;

import com.helpdesk.dto.auth.AuthResponse;
import com.helpdesk.dto.auth.ChangePasswordRequest;
import com.helpdesk.dto.auth.LoginRequest;
import com.helpdesk.dto.auth.RefreshTokenRequest;
import com.helpdesk.dto.auth.RegisterRequest;
import com.helpdesk.dto.user.UserResponse;
import com.helpdesk.entity.User;
import com.helpdesk.enums.UserRole;
import com.helpdesk.exception.BadRequestException;
import com.helpdesk.exception.ConflictException;
import com.helpdesk.exception.ResourceNotFoundException;
import com.helpdesk.exception.UnauthorizedException;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.security.JwtTokenProvider;
import com.helpdesk.service.AuthService;
import com.helpdesk.util.DtoMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        // Support login by either username or email
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không chính xác"));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BadRequestException("Tài khoản đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên.");
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getUsername(), request.getPassword())
        );

        String accessToken = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getUsername());

        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);

        return buildAuthResponse(user, accessToken, refreshToken);
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new ConflictException("Tên tài khoản '" + request.getUsername() + "' đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email '" + request.getEmail() + "' đã được sử dụng");
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phoneNumber(request.getPhoneNumber())
                .role(UserRole.CUSTOMER)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        String accessToken = tokenProvider.generateTokenFromUsername(savedUser.getUsername());
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getUsername());

        return buildAuthResponse(savedUser, accessToken, refreshToken);
    }

    @Override
    @Transactional
    public void changePassword(String currentUsername, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu hiện tại không chính xác");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Mật khẩu mới không được trùng với mật khẩu hiện tại");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String token = request.getRefreshToken();
        if (!tokenProvider.validateToken(token)) {
            throw new UnauthorizedException("Refresh token không hợp lệ hoặc đã hết hạn");
        }

        String username = tokenProvider.getUsernameFromJWT(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", username));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new UnauthorizedException("Tài khoản người dùng đã bị khóa");
        }

        String newAccessToken = tokenProvider.generateTokenFromUsername(username);
        String newRefreshToken = tokenProvider.generateRefreshToken(username);

        return buildAuthResponse(user, newAccessToken, newRefreshToken);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResourceNotFoundException("Người dùng", "username", currentUsername));
        return DtoMapper.toUserResponse(user);
    }

    private AuthResponse buildAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationInMs())
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .build();
    }
}

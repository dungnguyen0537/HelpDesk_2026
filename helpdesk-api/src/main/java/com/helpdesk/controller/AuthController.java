package com.helpdesk.controller;

import com.helpdesk.dto.auth.AuthResponse;
import com.helpdesk.dto.auth.ChangePasswordRequest;
import com.helpdesk.dto.auth.LoginRequest;
import com.helpdesk.dto.auth.RefreshTokenRequest;
import com.helpdesk.dto.auth.RegisterRequest;
import com.helpdesk.dto.common.ApiResponse;
import com.helpdesk.dto.user.UserResponse;
import com.helpdesk.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/auth", "/auth"})
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints xác thực và phân quyền tài khoản")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập hệ thống bằng username hoặc email")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản khách hàng mới")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Đăng ký tài khoản thành công", response));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Đổi mật khẩu tài khoản hiện tại")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Làm mới Access Token bằng Refresh Token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin người dùng đang đăng nhập")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        UserResponse response = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất khỏi hệ thống")
    public ResponseEntity<ApiResponse<Void>> logout() {
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }
}

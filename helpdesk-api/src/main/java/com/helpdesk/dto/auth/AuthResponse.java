package com.helpdesk.dto.auth;

import com.helpdesk.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String accessToken;

    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private long expiresIn;

    private Long userId;

    private String username;

    private String email;

    private String fullName;

    private UserRole role;

    private Long departmentId;

    private String departmentName;
}

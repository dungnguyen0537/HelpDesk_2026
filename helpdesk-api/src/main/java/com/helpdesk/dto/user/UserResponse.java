package com.helpdesk.dto.user;

import com.helpdesk.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;

    private String username;

    private String email;

    private String fullName;

    private String phoneNumber;

    private UserRole role;

    private Long departmentId;

    private String departmentName;

    private Boolean isActive;

    private String avatarUrl;

    private OffsetDateTime lastLoginAt;

    private OffsetDateTime createdAt;

    private AgentProfileDto agentProfile;
}

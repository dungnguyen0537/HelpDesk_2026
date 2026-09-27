package com.helpdesk.dto.user;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {

    @Size(max = 150, message = "Họ và tên tối đa 150 ký tự")
    private String fullName;

    private String phoneNumber;

    private Long departmentId;

    private Boolean isActive;

    private String avatarUrl;
}

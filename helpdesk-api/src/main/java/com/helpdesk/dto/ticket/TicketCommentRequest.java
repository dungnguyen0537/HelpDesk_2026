package com.helpdesk.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentRequest {

    @NotBlank(message = "Nội dung bình luận không được để trống")
    private String content;

    @Builder.Default
    private Boolean isInternal = false;
}

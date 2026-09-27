package com.helpdesk.dto.ticket;

import com.helpdesk.dto.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketCommentResponse {

    private Long id;

    private Long ticketId;

    private UserResponse user;

    private String content;

    private Boolean isInternal;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;
}

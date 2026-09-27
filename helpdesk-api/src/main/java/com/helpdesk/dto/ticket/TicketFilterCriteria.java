package com.helpdesk.dto.ticket;

import com.helpdesk.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketFilterCriteria {

    private String search;

    private TicketStatus status;

    private Long priorityId;

    private Long categoryId;

    private Long departmentId;

    private Long creatorId;

    private Long assigneeId;

    private Boolean isBreached;

    private OffsetDateTime createdFrom;

    private OffsetDateTime createdTo;

    @Builder.Default
    private int page = 0;

    @Builder.Default
    private int size = 10;

    @Builder.Default
    private String sortBy = "createdAt";

    @Builder.Default
    private String sortDirection = "DESC";
}

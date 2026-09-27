package com.helpdesk.dto.ticket;

import com.helpdesk.dto.user.UserResponse;
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
public class TicketResponse {

    private Long id;

    private String ticketNumber;

    private String title;

    private String description;

    private TicketStatus status;

    private UserResponse creator;

    private UserResponse assignee;

    private DepartmentSummary department;

    private CategorySummary category;

    private PrioritySummary priority;

    private SlaPolicySummary slaPolicy;

    private OffsetDateTime firstRespondedAt;

    private OffsetDateTime resolvedAt;

    private OffsetDateTime closedAt;

    private OffsetDateTime slaResponseDeadline;

    private OffsetDateTime slaResolutionDeadline;

    private Boolean slaResponseBreached;

    private Boolean slaResolutionBreached;

    private OffsetDateTime createdAt;

    private OffsetDateTime updatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentSummary {
        private Long id;
        private String code;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategorySummary {
        private Long id;
        private String code;
        private String name;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PrioritySummary {
        private Long id;
        private String code;
        private String name;
        private Integer levelWeight;
        private String colorHex;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SlaPolicySummary {
        private Long id;
        private String name;
        private Integer firstResponseTimeMinutes;
        private Integer resolutionTimeMinutes;
    }
}

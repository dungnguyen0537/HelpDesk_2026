package com.helpdesk.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentProfileDto {

    private Long id;

    private Long userId;

    private String skills;

    private Integer maxActiveTickets;

    private Integer currentTicketCount;

    private Boolean isAvailable;

    private BigDecimal ratingAvg;
}

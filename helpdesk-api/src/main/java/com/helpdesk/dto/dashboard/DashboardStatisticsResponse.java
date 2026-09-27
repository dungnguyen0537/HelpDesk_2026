package com.helpdesk.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatisticsResponse {

    private long totalTickets;

    private long pendingTickets;

    private long inProgressTickets;

    private long resolvedTickets;

    private long closedTickets;

    private long urgentTickets;

    private long highPriorityTickets;

    private long breachedTickets;

    private long totalUsers;

    private long totalAgents;

    private Map<String, Long> ticketsByStatus;

    private Map<String, Long> ticketsByPriority;

    private Map<String, Long> ticketsByCategory;
}

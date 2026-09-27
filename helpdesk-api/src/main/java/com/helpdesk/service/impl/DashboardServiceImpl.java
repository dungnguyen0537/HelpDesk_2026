package com.helpdesk.service.impl;

import com.helpdesk.dto.dashboard.DashboardStatisticsResponse;
import com.helpdesk.enums.TicketStatus;
import com.helpdesk.enums.UserRole;
import com.helpdesk.repository.TicketRepository;
import com.helpdesk.repository.UserRepository;
import com.helpdesk.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatisticsResponse getStatistics() {
        long totalTickets = ticketRepository.count();
        long pendingTickets = ticketRepository.countByStatus(TicketStatus.PENDING);
        long inProgressTickets = ticketRepository.countByStatus(TicketStatus.IN_PROGRESS);
        long resolvedTickets = ticketRepository.countByStatus(TicketStatus.RESOLVED);
        long closedTickets = ticketRepository.countByStatus(TicketStatus.CLOSED);
        long urgentTickets = ticketRepository.countByPriorityCode("URGENT");
        long highPriorityTickets = ticketRepository.countByPriorityCode("HIGH");
        long breachedTickets = ticketRepository.countBySlaResolutionBreachedTrue();

        long totalUsers = userRepository.count();
        long totalAgents = userRepository.countByRole(UserRole.AGENT);

        Map<String, Long> statusMap = new HashMap<>();
        List<Object[]> statusCounts = ticketRepository.countTicketsGroupedByStatus();
        for (Object[] row : statusCounts) {
            if (row[0] != null) {
                statusMap.put(row[0].toString(), (Long) row[1]);
            }
        }

        Map<String, Long> priorityMap = new HashMap<>();
        List<Object[]> priorityCounts = ticketRepository.countTicketsGroupedByPriority();
        for (Object[] row : priorityCounts) {
            if (row[0] != null) {
                priorityMap.put(row[0].toString(), (Long) row[1]);
            }
        }

        Map<String, Long> categoryMap = new HashMap<>();
        List<Object[]> categoryCounts = ticketRepository.countTicketsGroupedByCategory();
        for (Object[] row : categoryCounts) {
            if (row[0] != null) {
                categoryMap.put(row[0].toString(), (Long) row[1]);
            }
        }

        return DashboardStatisticsResponse.builder()
                .totalTickets(totalTickets)
                .pendingTickets(pendingTickets)
                .inProgressTickets(inProgressTickets)
                .resolvedTickets(resolvedTickets)
                .closedTickets(closedTickets)
                .urgentTickets(urgentTickets)
                .highPriorityTickets(highPriorityTickets)
                .breachedTickets(breachedTickets)
                .totalUsers(totalUsers)
                .totalAgents(totalAgents)
                .ticketsByStatus(statusMap)
                .ticketsByPriority(priorityMap)
                .ticketsByCategory(categoryMap)
                .build();
    }
}

package com.helpdesk.util;

import com.helpdesk.dto.ticket.TicketCommentResponse;
import com.helpdesk.dto.ticket.TicketResponse;
import com.helpdesk.dto.user.AgentProfileDto;
import com.helpdesk.dto.user.UserResponse;
import com.helpdesk.entity.AgentProfile;
import com.helpdesk.entity.Ticket;
import com.helpdesk.entity.TicketComment;
import com.helpdesk.entity.User;

public final class DtoMapper {

    private DtoMapper() {
    }

    public static UserResponse toUserResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .role(user.getRole())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .isActive(user.getIsActive())
                .avatarUrl(user.getAvatarUrl())
                .lastLoginAt(user.getLastLoginAt())
                .createdAt(user.getCreatedAt())
                .agentProfile(toAgentProfileDto(user.getAgentProfile()))
                .build();
    }

    public static AgentProfileDto toAgentProfileDto(AgentProfile profile) {
        if (profile == null) {
            return null;
        }

        return AgentProfileDto.builder()
                .id(profile.getId())
                .userId(profile.getUser() != null ? profile.getUser().getId() : null)
                .skills(profile.getSkills())
                .maxActiveTickets(profile.getMaxActiveTickets())
                .currentTicketCount(profile.getCurrentTicketCount())
                .isAvailable(profile.getIsAvailable())
                .ratingAvg(profile.getRatingAvg())
                .build();
    }

    public static TicketResponse toTicketResponse(Ticket ticket) {
        if (ticket == null) {
            return null;
        }

        TicketResponse.DepartmentSummary departmentSummary = null;
        if (ticket.getDepartment() != null) {
            departmentSummary = TicketResponse.DepartmentSummary.builder()
                    .id(ticket.getDepartment().getId())
                    .code(ticket.getDepartment().getCode())
                    .name(ticket.getDepartment().getName())
                    .build();
        }

        TicketResponse.CategorySummary categorySummary = null;
        if (ticket.getCategory() != null) {
            categorySummary = TicketResponse.CategorySummary.builder()
                    .id(ticket.getCategory().getId())
                    .code(ticket.getCategory().getCode())
                    .name(ticket.getCategory().getName())
                    .build();
        }

        TicketResponse.PrioritySummary prioritySummary = null;
        if (ticket.getPriority() != null) {
            prioritySummary = TicketResponse.PrioritySummary.builder()
                    .id(ticket.getPriority().getId())
                    .code(ticket.getPriority().getCode())
                    .name(ticket.getPriority().getName())
                    .levelWeight(ticket.getPriority().getLevelWeight())
                    .colorHex(ticket.getPriority().getColorHex())
                    .build();
        }

        TicketResponse.SlaPolicySummary slaPolicySummary = null;
        if (ticket.getSlaPolicy() != null) {
            slaPolicySummary = TicketResponse.SlaPolicySummary.builder()
                    .id(ticket.getSlaPolicy().getId())
                    .name(ticket.getSlaPolicy().getName())
                    .firstResponseTimeMinutes(ticket.getSlaPolicy().getFirstResponseTimeMinutes())
                    .resolutionTimeMinutes(ticket.getSlaPolicy().getResolutionTimeMinutes())
                    .build();
        }

        return TicketResponse.builder()
                .id(ticket.getId())
                .ticketNumber(ticket.getTicketNumber())
                .title(ticket.getTitle())
                .description(ticket.getDescription())
                .status(ticket.getStatus())
                .creator(toUserResponse(ticket.getCreator()))
                .assignee(toUserResponse(ticket.getAssignee()))
                .department(departmentSummary)
                .category(categorySummary)
                .priority(prioritySummary)
                .slaPolicy(slaPolicySummary)
                .firstRespondedAt(ticket.getFirstRespondedAt())
                .resolvedAt(ticket.getResolvedAt())
                .closedAt(ticket.getClosedAt())
                .slaResponseDeadline(ticket.getSlaResponseDeadline())
                .slaResolutionDeadline(ticket.getSlaResolutionDeadline())
                .slaResponseBreached(ticket.getSlaResponseBreached())
                .slaResolutionBreached(ticket.getSlaResolutionBreached())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }

    public static TicketCommentResponse toTicketCommentResponse(TicketComment comment) {
        if (comment == null) {
            return null;
        }

        return TicketCommentResponse.builder()
                .id(comment.getId())
                .ticketId(comment.getTicket() != null ? comment.getTicket().getId() : null)
                .user(toUserResponse(comment.getUser()))
                .content(comment.getContent())
                .isInternal(comment.getIsInternal())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}

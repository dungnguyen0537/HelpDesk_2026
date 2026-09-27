package com.helpdesk.service;

import com.helpdesk.dto.ticket.AssignTicketRequest;
import com.helpdesk.dto.ticket.CreateTicketRequest;
import com.helpdesk.dto.ticket.TicketCommentRequest;
import com.helpdesk.dto.ticket.TicketCommentResponse;
import com.helpdesk.dto.ticket.TicketFilterCriteria;
import com.helpdesk.dto.ticket.TicketResponse;
import com.helpdesk.dto.ticket.UpdateTicketStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface TicketService {

    TicketResponse createTicket(CreateTicketRequest request, String currentUsername);

    TicketResponse getTicketById(Long id, String currentUsername);

    Page<TicketResponse> getAllTickets(TicketFilterCriteria criteria, Pageable pageable, String currentUsername);

    TicketResponse updateStatus(Long id, UpdateTicketStatusRequest request, String currentUsername);

    TicketResponse assignTicket(Long id, AssignTicketRequest request, String currentUsername);

    TicketCommentResponse addComment(Long id, TicketCommentRequest request, String currentUsername);

    List<TicketCommentResponse> getCommentsByTicketId(Long id, String currentUsername);
}

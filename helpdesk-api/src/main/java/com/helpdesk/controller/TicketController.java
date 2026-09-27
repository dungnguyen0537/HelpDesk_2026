package com.helpdesk.controller;

import com.helpdesk.dto.common.ApiResponse;
import com.helpdesk.dto.dashboard.DashboardStatisticsResponse;
import com.helpdesk.dto.ticket.AssignTicketRequest;
import com.helpdesk.dto.ticket.CreateTicketRequest;
import com.helpdesk.dto.ticket.TicketCommentRequest;
import com.helpdesk.dto.ticket.TicketCommentResponse;
import com.helpdesk.dto.ticket.TicketFilterCriteria;
import com.helpdesk.dto.ticket.TicketResponse;
import com.helpdesk.dto.ticket.UpdateTicketStatusRequest;
import com.helpdesk.service.DashboardService;
import com.helpdesk.service.TicketService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping({"/api/tickets", "/tickets"})
@RequiredArgsConstructor
@Tag(name = "Tickets", description = "Quản lý phiếu yêu cầu hỗ trợ (Tickets)")
public class TicketController {

    private final TicketService ticketService;
    private final DashboardService dashboardService;

    @PostMapping
    @Operation(summary = "Tạo mới ticket yêu cầu hỗ trợ")
    public ResponseEntity<ApiResponse<TicketResponse>> createTicket(
            @Valid @RequestBody CreateTicketRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketResponse response = ticketService.createTicket(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Tạo yêu cầu hỗ trợ thành công", response));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tickets phân trang có lọc theo tiêu chí")
    public ResponseEntity<ApiResponse<Page<TicketResponse>>> getAllTickets(
            @ModelAttribute TicketFilterCriteria criteria,
            @PageableDefault(size = 10) Pageable pageable,
            @AuthenticationPrincipal UserDetails userDetails) {
        Page<TicketResponse> response = ticketService.getAllTickets(criteria, pageable, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/stats")
    @Operation(summary = "Thống kê tổng quan số liệu ticket")
    public ResponseEntity<ApiResponse<DashboardStatisticsResponse>> getTicketStats() {
        DashboardStatisticsResponse response = dashboardService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết ticket theo ID")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicketById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketResponse response = ticketService.getTicketById(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái ticket")
    public ResponseEntity<ApiResponse<TicketResponse>> updateStatusPatch(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketResponse response = ticketService.updateStatus(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công", response));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái ticket (PUT)")
    public ResponseEntity<ApiResponse<TicketResponse>> updateStatusPut(
            @PathVariable Long id,
            @Valid @RequestBody UpdateTicketStatusRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return updateStatusPatch(id, request, userDetails);
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Phân công người xử lý ticket")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTicketPatch(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketResponse response = ticketService.assignTicket(id, request, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Phân công ticket thành công", response));
    }

    @PutMapping("/{id}/assign")
    @Operation(summary = "Phân công người xử lý ticket (PUT)")
    public ResponseEntity<ApiResponse<TicketResponse>> assignTicketPut(
            @PathVariable Long id,
            @Valid @RequestBody AssignTicketRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return assignTicketPatch(id, request, userDetails);
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Thêm trao đổi / bình luận vào ticket")
    public ResponseEntity<ApiResponse<TicketCommentResponse>> addComment(
            @PathVariable Long id,
            @Valid @RequestBody TicketCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        TicketCommentResponse response = ticketService.addComment(id, request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("Thêm bình luận thành công", response));
    }

    @GetMapping("/{id}/comments")
    @Operation(summary = "Lấy danh sách bình luận của ticket")
    public ResponseEntity<ApiResponse<List<TicketCommentResponse>>> getComments(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        List<TicketCommentResponse> response = ticketService.getCommentsByTicketId(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

package com.helpdesk.controller;

import com.helpdesk.dto.common.ApiResponse;
import com.helpdesk.dto.dashboard.DashboardStatisticsResponse;
import com.helpdesk.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/dashboard", "/dashboard"})
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Bảng điều khiển và báo cáo thống kê")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @Operation(summary = "Lấy dữ liệu thống kê tổng quan của hệ thống")
    public ResponseEntity<ApiResponse<DashboardStatisticsResponse>> getDashboard() {
        DashboardStatisticsResponse statistics = dashboardService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success("Lấy dữ liệu bảng điều khiển thành công", statistics));
    }

    @GetMapping("/stats")
    @Operation(summary = "Lấy dữ liệu thống kê tổng quan (alias /stats)")
    public ResponseEntity<ApiResponse<DashboardStatisticsResponse>> getStats() {
        DashboardStatisticsResponse statistics = dashboardService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
}

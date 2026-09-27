package com.helpdesk.dto.ticket;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateTicketRequest {

    @NotBlank(message = "Tiêu đề yêu cầu không được để trống")
    @Size(max = 255, message = "Tiêu đề tối đa 255 ký tự")
    private String title;

    @NotBlank(message = "Nội dung mô tả không được để trống")
    private String description;

    @NotNull(message = "Danh mục sự cố không được để trống")
    private Long categoryId;

    @NotNull(message = "Mức độ ưu tiên không được để trống")
    private Long priorityId;

    private Long departmentId;
}

package com.helpdesk.dto.ticket;

import com.helpdesk.enums.TicketStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateTicketStatusRequest {

    @NotNull(message = "Trạng thái mới không được để trống")
    private TicketStatus status;

    private String solutionNote;
}

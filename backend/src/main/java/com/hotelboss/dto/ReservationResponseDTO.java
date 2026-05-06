package com.hotelboss.dto;

import com.hotelboss.model.ReservationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationResponseDTO {
    private Long id;
    private String guestId;
    private String guestEmail;
    private RoomDTO room;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private ReservationStatus status;
    private LocalDateTime createdAt;
}

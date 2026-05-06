package com.hotelboss.controller;

import com.hotelboss.dto.ReservationRequestDTO;
import com.hotelboss.dto.ReservationResponseDTO;
import com.hotelboss.service.ReservationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponseDTO> createReservation(
            @Valid @RequestBody ReservationRequestDTO request,
            @AuthenticationPrincipal Jwt jwt) {
        String guestId = jwt.getSubject();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(reservationService.createReservation(request, guestId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<ReservationResponseDTO>> getMyReservations(
            @AuthenticationPrincipal Jwt jwt) {
        String guestId = jwt.getSubject();
        return ResponseEntity.ok(reservationService.getReservationsByGuestId(guestId));
    }
}

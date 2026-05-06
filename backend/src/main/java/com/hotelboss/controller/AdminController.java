package com.hotelboss.controller;

import com.hotelboss.dto.ReservationResponseDTO;
import com.hotelboss.dto.RoomDTO;
import com.hotelboss.model.ReservationStatus;
import com.hotelboss.service.ReservationService;
import com.hotelboss.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RoomService roomService;
    private final ReservationService reservationService;

    @GetMapping("/rooms")
    public ResponseEntity<List<RoomDTO>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PostMapping("/rooms")
    public ResponseEntity<RoomDTO> createRoom(@RequestBody RoomDTO roomDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(roomService.createRoom(roomDTO));
    }

    @PutMapping("/rooms/{id}")
    public ResponseEntity<RoomDTO> updateRoom(@PathVariable Long id, @RequestBody RoomDTO roomDTO) {
        return ResponseEntity.ok(roomService.updateRoom(id, roomDTO));
    }

    @GetMapping("/reservations")
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations() {
        return ResponseEntity.ok(reservationService.getAllReservations());
    }

    @PutMapping("/reservations/{id}/status")
    public ResponseEntity<ReservationResponseDTO> updateReservationStatus(
            @PathVariable Long id,
            @RequestParam ReservationStatus status) {
        return ResponseEntity.ok(reservationService.updateReservationStatus(id, status));
    }
}

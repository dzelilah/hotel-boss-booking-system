package com.hotelboss.controller;

import com.hotelboss.dto.RoomDTO;
import com.hotelboss.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    /**
     * With checkIn + checkOut: rooms free for that stay (optionally with capacity >= guests).
     * With available=true only: rooms currently in service. Otherwise: all rooms.
     */
    @GetMapping
    public ResponseEntity<List<RoomDTO>> getRooms(
            @RequestParam(required = false) Boolean available,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) Integer guests) {
        if (checkIn != null && checkOut != null) {
            return ResponseEntity.ok(roomService.getAvailableRooms(checkIn, checkOut, guests));
        }
        if (Boolean.TRUE.equals(available)) {
            return ResponseEntity.ok(roomService.getAvailableRooms());
        }
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/{id}/availability")
    public ResponseEntity<Map<String, Boolean>> getRoomAvailability(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ResponseEntity.ok(Map.of("available", roomService.isRoomFree(id, checkIn, checkOut)));
    }
}

package com.hotelboss.controller;

import com.hotelboss.dto.RoomDTO;
import com.hotelboss.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    @GetMapping
    public ResponseEntity<List<RoomDTO>> getAllRooms(@RequestParam(required = false) Boolean available) {
        if (Boolean.TRUE.equals(available)) {
            return ResponseEntity.ok(roomService.getAvailableRooms());
        }
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDTO> getRoomById(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }
}

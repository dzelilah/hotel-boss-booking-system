package com.hotelboss.service;

import com.hotelboss.dto.RoomDTO;
import com.hotelboss.exception.ResourceNotFoundException;
import com.hotelboss.model.Room;
import com.hotelboss.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<RoomDTO> getAvailableRooms() {
        return roomRepository.findByAvailable(true).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public RoomDTO getRoomById(Long id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        return toDTO(room);
    }

    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + id));
        room.setName(roomDTO.getName());
        room.setType(roomDTO.getType());
        room.setCapacity(roomDTO.getCapacity());
        room.setPricePerNight(roomDTO.getPricePerNight());
        room.setAvailable(roomDTO.getAvailable());
        room.setDescription(roomDTO.getDescription());
        return toDTO(roomRepository.save(room));
    }

    public RoomDTO createRoom(RoomDTO roomDTO) {
        Room room = Room.builder()
                .name(roomDTO.getName())
                .type(roomDTO.getType())
                .capacity(roomDTO.getCapacity())
                .pricePerNight(roomDTO.getPricePerNight())
                .available(roomDTO.getAvailable() != null ? roomDTO.getAvailable() : true)
                .description(roomDTO.getDescription())
                .build();
        return toDTO(roomRepository.save(room));
    }

    public RoomDTO toDTO(Room room) {
        return RoomDTO.builder()
                .id(room.getId())
                .name(room.getName())
                .type(room.getType())
                .capacity(room.getCapacity())
                .pricePerNight(room.getPricePerNight())
                .available(room.getAvailable())
                .description(room.getDescription())
                .build();
    }
}

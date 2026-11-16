package com.hotelboss.service;

import com.hotelboss.dto.RoomDTO;
import com.hotelboss.exception.InvalidReservationException;
import com.hotelboss.exception.ResourceNotFoundException;
import com.hotelboss.model.Room;
import com.hotelboss.repository.ReservationRepository;
import com.hotelboss.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final ReservationRepository reservationRepository;

    public List<RoomDTO> getAllRooms() {
        return roomRepository.findAllByOrderByIdAsc().stream()
                .map(this::toDTO)
                .toList();
    }

    /** Rooms that are in service (the admin "available" flag), regardless of bookings. */
    public List<RoomDTO> getAvailableRooms() {
        return roomRepository.findByAvailableOrderByIdAsc(true).stream()
                .map(this::toDTO)
                .toList();
    }

    /** Rooms in service, free for the whole [checkIn, checkOut) stay, that fit the party size. */
    @Transactional(readOnly = true)
    public List<RoomDTO> getAvailableRooms(LocalDate checkIn, LocalDate checkOut, Integer guests) {
        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidReservationException("Datum odlaska mora biti nakon datuma dolaska.");
        }
        Set<Long> booked = reservationRepository.findBookedRoomIds(checkIn, checkOut);
        int minCapacity = guests == null ? 1 : guests;
        return roomRepository.findByAvailableOrderByIdAsc(true).stream()
                .filter(room -> !booked.contains(room.getId()))
                .filter(room -> room.getCapacity() >= minCapacity)
                .map(this::toDTO)
                .toList();
    }

    public RoomDTO getRoomById(Long id) {
        return toDTO(findRoom(id));
    }

    /** Whether a specific room can be booked for the stay. */
    @Transactional(readOnly = true)
    public boolean isRoomFree(Long id, LocalDate checkIn, LocalDate checkOut) {
        Room room = findRoom(id);
        return Boolean.TRUE.equals(room.getAvailable())
                && !reservationRepository.existsOverlapping(id, checkIn, checkOut);
    }

    public RoomDTO updateRoom(Long id, RoomDTO roomDTO) {
        Room room = findRoom(id);
        room.setName(roomDTO.getName());
        room.setType(roomDTO.getType());
        room.setCapacity(roomDTO.getCapacity());
        room.setPricePerNight(roomDTO.getPricePerNight());
        if (roomDTO.getAvailable() != null) {
            room.setAvailable(roomDTO.getAvailable());
        }
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

    private Room findRoom(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Soba nije pronađena (id " + id + ")"));
    }
}

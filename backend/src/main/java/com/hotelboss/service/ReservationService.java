package com.hotelboss.service;

import com.hotelboss.dto.ReservationRequestDTO;
import com.hotelboss.dto.ReservationResponseDTO;
import com.hotelboss.exception.ResourceNotFoundException;
import com.hotelboss.exception.RoomNotAvailableException;
import com.hotelboss.model.Reservation;
import com.hotelboss.model.ReservationStatus;
import com.hotelboss.model.Room;
import com.hotelboss.repository.ReservationRepository;
import com.hotelboss.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final RoomService roomService;
    private final AzureQueueService azureQueueService;

    @Transactional
    public ReservationResponseDTO createReservation(ReservationRequestDTO request, String guestId) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with id: " + request.getRoomId()));

        if (!room.getAvailable()) {
            throw new RoomNotAvailableException("Room " + room.getName() + " is not available for booking");
        }

        room.setAvailable(false);
        roomRepository.save(room);

        Reservation reservation = Reservation.builder()
                .guestId(guestId)
                .guestEmail(request.getGuestEmail())
                .room(room)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .status(ReservationStatus.CONFIRMED)
                .build();

        Reservation saved = reservationRepository.save(reservation);

        azureQueueService.sendBookingConfirmation(saved);

        return toDTO(saved);
    }

    public List<ReservationResponseDTO> getReservationsByGuestId(String guestId) {
        return reservationRepository.findByGuestId(guestId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationResponseDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReservationResponseDTO updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reservation not found with id: " + id));
        reservation.setStatus(status);
        if (status == ReservationStatus.CANCELLED) {
            reservation.getRoom().setAvailable(true);
            roomRepository.save(reservation.getRoom());
        }
        return toDTO(reservationRepository.save(reservation));
    }

    private ReservationResponseDTO toDTO(Reservation reservation) {
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .guestId(reservation.getGuestId())
                .guestEmail(reservation.getGuestEmail())
                .room(roomService.toDTO(reservation.getRoom()))
                .checkIn(reservation.getCheckIn())
                .checkOut(reservation.getCheckOut())
                .status(reservation.getStatus())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}

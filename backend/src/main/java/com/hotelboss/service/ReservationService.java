package com.hotelboss.service;

import com.hotelboss.dto.ReservationRequestDTO;
import com.hotelboss.dto.ReservationResponseDTO;
import com.hotelboss.exception.InvalidReservationException;
import com.hotelboss.exception.ResourceNotFoundException;
import com.hotelboss.exception.RoomNotAvailableException;
import com.hotelboss.model.Reservation;
import com.hotelboss.model.ReservationStatus;
import com.hotelboss.model.Room;
import com.hotelboss.repository.ReservationRepository;
import com.hotelboss.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReservationService {

    public static final int MAX_NIGHTS = 30;
    public static final int MAX_DAYS_AHEAD = 365;

    private final ReservationRepository reservationRepository;
    private final RoomRepository roomRepository;
    private final RoomService roomService;
    private final ApplicationEventPublisher eventPublisher;
    private final Clock clock;

    /** Published on booking; the queue message is sent only after the transaction commits. */
    public record ReservationConfirmedEvent(Reservation reservation) {}

    @Transactional
    public ReservationResponseDTO createReservation(ReservationRequestDTO request, String guestId) {
        validateStay(request.getCheckIn(), request.getCheckOut());

        // Lock the room row so two guests booking the same room at once cannot both pass the overlap check.
        Room room = roomRepository.findByIdForUpdate(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Soba nije pronađena (id " + request.getRoomId() + ")"));

        if (!Boolean.TRUE.equals(room.getAvailable())) {
            throw new RoomNotAvailableException(room.getName() + " trenutno nije u ponudi.");
        }
        if (reservationRepository.existsOverlapping(room.getId(), request.getCheckIn(), request.getCheckOut())) {
            throw new RoomNotAvailableException(room.getName() + " je već rezervisana za odabrane datume.");
        }

        Reservation reservation = Reservation.builder()
                .guestId(guestId)
                .guestEmail(request.getGuestEmail())
                .room(room)
                .checkIn(request.getCheckIn())
                .checkOut(request.getCheckOut())
                .status(ReservationStatus.CONFIRMED)
                .build();

        Reservation saved = reservationRepository.save(reservation);
        eventPublisher.publishEvent(new ReservationConfirmedEvent(saved));
        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getReservationsByGuestId(String guestId) {
        return reservationRepository.findByGuestIdOrderByCheckInDesc(guestId).stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ReservationResponseDTO> getAllReservations() {
        return reservationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .toList();
    }

    /** A guest cancels their own reservation. Allowed until the day before check-in. */
    @Transactional
    public ReservationResponseDTO cancelByGuest(Long id, String guestId) {
        Reservation reservation = reservationRepository.findById(id)
                // Same response for "doesn't exist" and "not yours", so IDs can't be probed.
                .filter(r -> r.getGuestId().equals(guestId))
                .orElseThrow(() -> new ResourceNotFoundException("Rezervacija nije pronađena (id " + id + ")"));

        if (reservation.getStatus() == ReservationStatus.CANCELLED) {
            throw new InvalidReservationException("Rezervacija je već otkazana.");
        }
        if (!LocalDate.now(clock).isBefore(reservation.getCheckIn())) {
            throw new InvalidReservationException(
                    "Rezervaciju je moguće otkazati najkasnije dan prije dolaska. Kontaktirajte recepciju.");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        return toDTO(reservationRepository.save(reservation));
    }

    @Transactional
    public ReservationResponseDTO updateReservationStatus(Long id, ReservationStatus status) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Rezervacija nije pronađena (id " + id + ")"));

        // Re-activating a cancelled booking must not double-book the room.
        if (reservation.getStatus() == ReservationStatus.CANCELLED && status != ReservationStatus.CANCELLED) {
            roomRepository.findByIdForUpdate(reservation.getRoom().getId());
            if (reservationRepository.existsOverlapping(
                    reservation.getRoom().getId(), reservation.getCheckIn(), reservation.getCheckOut())) {
                throw new RoomNotAvailableException(
                        reservation.getRoom().getName() + " je u međuvremenu rezervisana za te datume.");
            }
        }

        reservation.setStatus(status);
        return toDTO(reservationRepository.save(reservation));
    }

    private void validateStay(LocalDate checkIn, LocalDate checkOut) {
        LocalDate today = LocalDate.now(clock);
        if (checkIn.isBefore(today)) {
            throw new InvalidReservationException("Datum dolaska ne može biti u prošlosti.");
        }
        if (!checkOut.isAfter(checkIn)) {
            throw new InvalidReservationException("Datum odlaska mora biti nakon datuma dolaska.");
        }
        if (ChronoUnit.DAYS.between(checkIn, checkOut) > MAX_NIGHTS) {
            throw new InvalidReservationException("Najduži boravak je " + MAX_NIGHTS + " noći.");
        }
        if (checkIn.isAfter(today.plusDays(MAX_DAYS_AHEAD))) {
            throw new InvalidReservationException("Rezervacije su moguće najviše godinu dana unaprijed.");
        }
    }

    private ReservationResponseDTO toDTO(Reservation reservation) {
        Room room = reservation.getRoom();
        long nights = ChronoUnit.DAYS.between(reservation.getCheckIn(), reservation.getCheckOut());
        return ReservationResponseDTO.builder()
                .id(reservation.getId())
                .guestId(reservation.getGuestId())
                .guestEmail(reservation.getGuestEmail())
                .room(roomService.toDTO(room))
                .checkIn(reservation.getCheckIn())
                .checkOut(reservation.getCheckOut())
                .nights(nights)
                .totalPrice(room.getPricePerNight().multiply(BigDecimal.valueOf(nights)))
                .status(reservation.getStatus())
                .createdAt(reservation.getCreatedAt())
                .build();
    }
}

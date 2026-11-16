package com.hotelboss.service;

import com.hotelboss.dto.ReservationRequestDTO;
import com.hotelboss.dto.ReservationResponseDTO;
import com.hotelboss.exception.InvalidReservationException;
import com.hotelboss.exception.ResourceNotFoundException;
import com.hotelboss.exception.RoomNotAvailableException;
import com.hotelboss.model.Reservation;
import com.hotelboss.model.ReservationStatus;
import com.hotelboss.model.Room;
import com.hotelboss.model.RoomType;
import com.hotelboss.repository.ReservationRepository;
import com.hotelboss.repository.RoomRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReservationServiceTest {

    private static final ZoneId ZONE = ZoneId.of("Europe/Sarajevo");
    private static final LocalDate TODAY = LocalDate.of(2030, 6, 1);

    @Mock ReservationRepository reservationRepository;
    @Mock RoomRepository roomRepository;
    @Mock ApplicationEventPublisher eventPublisher;

    private ReservationService service;
    private Room room;

    @BeforeEach
    void setUp() {
        Clock clock = Clock.fixed(TODAY.atStartOfDay(ZONE).toInstant(), ZONE);
        RoomService roomService = new RoomService(roomRepository, reservationRepository);
        service = new ReservationService(reservationRepository, roomRepository, roomService, eventPublisher, clock);
        room = Room.builder()
                .id(7L).name("Deluxe Soba 201").type(RoomType.DOUBLE).capacity(2)
                .pricePerNight(new BigDecimal("110.00")).available(true).build();
    }

    @Test
    void createsReservationAndComputesTotal() {
        when(roomRepository.findByIdForUpdate(7L)).thenReturn(Optional.of(room));
        when(reservationRepository.existsOverlapping(7L, TODAY.plusDays(5), TODAY.plusDays(8))).thenReturn(false);
        when(reservationRepository.save(any())).thenAnswer(inv -> {
            Reservation r = inv.getArgument(0);
            r.setId(42L);
            return r;
        });

        ReservationResponseDTO result = service.createReservation(request(TODAY.plusDays(5), TODAY.plusDays(8)), "guest-1");

        assertThat(result.getId()).isEqualTo(42L);
        assertThat(result.getStatus()).isEqualTo(ReservationStatus.CONFIRMED);
        assertThat(result.getNights()).isEqualTo(3);
        assertThat(result.getTotalPrice()).isEqualByComparingTo("330.00");
        verify(eventPublisher).publishEvent(any(ReservationService.ReservationConfirmedEvent.class));
        // Booking must not take the room out of service for all other dates.
        assertThat(room.getAvailable()).isTrue();
    }

    @Test
    void allowsCheckInToday() {
        when(roomRepository.findByIdForUpdate(7L)).thenReturn(Optional.of(room));
        when(reservationRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        service.createReservation(request(TODAY, TODAY.plusDays(1)), "guest-1");

        verify(reservationRepository).save(any());
    }

    @Test
    void rejectsOverlappingStay() {
        when(roomRepository.findByIdForUpdate(7L)).thenReturn(Optional.of(room));
        when(reservationRepository.existsOverlapping(7L, TODAY.plusDays(5), TODAY.plusDays(8))).thenReturn(true);

        assertThatThrownBy(() -> service.createReservation(request(TODAY.plusDays(5), TODAY.plusDays(8)), "guest-1"))
                .isInstanceOf(RoomNotAvailableException.class);
        verify(reservationRepository, never()).save(any());
        verify(eventPublisher, never()).publishEvent(any());
    }

    @Test
    void rejectsRoomTakenOutOfService() {
        room.setAvailable(false);
        when(roomRepository.findByIdForUpdate(7L)).thenReturn(Optional.of(room));

        assertThatThrownBy(() -> service.createReservation(request(TODAY.plusDays(5), TODAY.plusDays(8)), "guest-1"))
                .isInstanceOf(RoomNotAvailableException.class);
    }

    @Test
    void rejectsInvalidDates() {
        assertThatThrownBy(() -> service.createReservation(request(TODAY.minusDays(1), TODAY.plusDays(2)), "g"))
                .isInstanceOf(InvalidReservationException.class);
        assertThatThrownBy(() -> service.createReservation(request(TODAY.plusDays(3), TODAY.plusDays(3)), "g"))
                .isInstanceOf(InvalidReservationException.class);
        assertThatThrownBy(() -> service.createReservation(request(TODAY.plusDays(4), TODAY.plusDays(2)), "g"))
                .isInstanceOf(InvalidReservationException.class);
        assertThatThrownBy(() -> service.createReservation(request(TODAY, TODAY.plusDays(31)), "g"))
                .isInstanceOf(InvalidReservationException.class);
        assertThatThrownBy(() -> service.createReservation(request(TODAY.plusDays(400), TODAY.plusDays(402)), "g"))
                .isInstanceOf(InvalidReservationException.class);
        verify(roomRepository, never()).findByIdForUpdate(any());
    }

    @Test
    void guestCanCancelOwnFutureReservation() {
        Reservation existing = existing("guest-1", TODAY.plusDays(2), ReservationStatus.CONFIRMED);
        when(reservationRepository.findById(5L)).thenReturn(Optional.of(existing));
        when(reservationRepository.save(existing)).thenReturn(existing);

        assertThat(service.cancelByGuest(5L, "guest-1").getStatus()).isEqualTo(ReservationStatus.CANCELLED);
    }

    @Test
    void guestCannotCancelSomeoneElsesReservation() {
        when(reservationRepository.findById(5L))
                .thenReturn(Optional.of(existing("guest-2", TODAY.plusDays(2), ReservationStatus.CONFIRMED)));

        assertThatThrownBy(() -> service.cancelByGuest(5L, "guest-1"))
                .isInstanceOf(ResourceNotFoundException.class);
        verify(reservationRepository, never()).save(any());
    }

    @Test
    void guestCannotCancelOnArrivalDayOrTwice() {
        when(reservationRepository.findById(5L))
                .thenReturn(Optional.of(existing("guest-1", TODAY, ReservationStatus.CONFIRMED)));
        assertThatThrownBy(() -> service.cancelByGuest(5L, "guest-1"))
                .isInstanceOf(InvalidReservationException.class);

        when(reservationRepository.findById(6L))
                .thenReturn(Optional.of(existing("guest-1", TODAY.plusDays(5), ReservationStatus.CANCELLED)));
        assertThatThrownBy(() -> service.cancelByGuest(6L, "guest-1"))
                .isInstanceOf(InvalidReservationException.class);
    }

    @Test
    void adminCannotReactivateCancelledBookingOverAnother() {
        Reservation cancelled = existing("guest-1", TODAY.plusDays(2), ReservationStatus.CANCELLED);
        when(reservationRepository.findById(5L)).thenReturn(Optional.of(cancelled));
        when(reservationRepository.existsOverlapping(7L, cancelled.getCheckIn(), cancelled.getCheckOut()))
                .thenReturn(true);

        assertThatThrownBy(() -> service.updateReservationStatus(5L, ReservationStatus.CONFIRMED))
                .isInstanceOf(RoomNotAvailableException.class);
    }

    private ReservationRequestDTO request(LocalDate in, LocalDate out) {
        return new ReservationRequestDTO(7L, in, out, "guest@hotel.com");
    }

    private Reservation existing(String guestId, LocalDate checkIn, ReservationStatus status) {
        return Reservation.builder()
                .id(5L).guestId(guestId).guestEmail("guest@hotel.com").room(room)
                .checkIn(checkIn).checkOut(checkIn.plusDays(2)).status(status).build();
    }
}

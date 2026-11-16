package com.hotelboss.repository;

import com.hotelboss.model.Reservation;
import com.hotelboss.model.ReservationStatus;
import com.hotelboss.model.Room;
import com.hotelboss.model.RoomType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ReservationRepositoryTest {

    private static final LocalDate D = LocalDate.of(2030, 6, 10);

    @Autowired RoomRepository roomRepository;
    @Autowired ReservationRepository reservationRepository;

    private Room room;
    private Room otherRoom;

    @BeforeEach
    void setUp() {
        room = roomRepository.save(room("Standard Soba 101"));
        otherRoom = roomRepository.save(room("Standard Soba 102"));
        // Existing stay: nights of the 10th, 11th, 12th (check-out on the 13th).
        reservationRepository.save(reservation(room, D, D.plusDays(3), ReservationStatus.CONFIRMED));
    }

    @Test
    void detectsOverlapWithExistingStay() {
        assertThat(reservationRepository.existsOverlapping(room.getId(), D.plusDays(1), D.plusDays(2))).isTrue();
        assertThat(reservationRepository.existsOverlapping(room.getId(), D.minusDays(2), D.plusDays(1))).isTrue();
        assertThat(reservationRepository.existsOverlapping(room.getId(), D.plusDays(2), D.plusDays(6))).isTrue();
        assertThat(reservationRepository.existsOverlapping(room.getId(), D.minusDays(1), D.plusDays(5))).isTrue();
    }

    @Test
    void backToBackStaysDoNotOverlap() {
        // Checking in the day the previous guest checks out is fine, and vice versa.
        assertThat(reservationRepository.existsOverlapping(room.getId(), D.plusDays(3), D.plusDays(5))).isFalse();
        assertThat(reservationRepository.existsOverlapping(room.getId(), D.minusDays(2), D)).isFalse();
    }

    @Test
    void ignoresCancelledReservationsAndOtherRooms() {
        reservationRepository.save(reservation(otherRoom, D, D.plusDays(3), ReservationStatus.CANCELLED));

        assertThat(reservationRepository.existsOverlapping(otherRoom.getId(), D, D.plusDays(3))).isFalse();
        assertThat(reservationRepository.findBookedRoomIds(D, D.plusDays(3))).containsExactly(room.getId());
    }

    @Test
    void findBookedRoomIdsIsEmptyOutsideAnyStay() {
        assertThat(reservationRepository.findBookedRoomIds(D.plusDays(3), D.plusDays(4))).isEmpty();
    }

    private static Room room(String name) {
        return Room.builder()
                .name(name)
                .type(RoomType.SINGLE)
                .capacity(2)
                .pricePerNight(new BigDecimal("80.00"))
                .available(true)
                .build();
    }

    private static Reservation reservation(Room room, LocalDate in, LocalDate out, ReservationStatus status) {
        return Reservation.builder()
                .guestId("guest-1")
                .guestEmail("guest@hotel.com")
                .room(room)
                .checkIn(in)
                .checkOut(out)
                .status(status)
                .build();
    }
}

package com.hotelboss.repository;

import com.hotelboss.model.Reservation;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @EntityGraph(attributePaths = "room")
    List<Reservation> findByGuestIdOrderByCheckInDesc(String guestId);

    @EntityGraph(attributePaths = "room")
    List<Reservation> findAllByOrderByCreatedAtDesc();

    /**
     * True if the room has a non-cancelled reservation overlapping [checkIn, checkOut).
     * Stays are half-open: a guest checking out on day X does not block a check-in on day X.
     */
    @Query("""
            select case when count(r) > 0 then true else false end
            from Reservation r
            where r.room.id = :roomId
              and r.status <> com.hotelboss.model.ReservationStatus.CANCELLED
              and r.checkIn < :checkOut
              and r.checkOut > :checkIn
            """)
    boolean existsOverlapping(@Param("roomId") Long roomId,
                              @Param("checkIn") LocalDate checkIn,
                              @Param("checkOut") LocalDate checkOut);

    /** IDs of all rooms with a non-cancelled reservation overlapping [checkIn, checkOut). */
    @Query("""
            select distinct r.room.id from Reservation r
            where r.status <> com.hotelboss.model.ReservationStatus.CANCELLED
              and r.checkIn < :checkOut
              and r.checkOut > :checkIn
            """)
    Set<Long> findBookedRoomIds(@Param("checkIn") LocalDate checkIn,
                                @Param("checkOut") LocalDate checkOut);
}

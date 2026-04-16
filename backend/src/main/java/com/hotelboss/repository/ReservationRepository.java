package com.hotelboss.repository;

import com.hotelboss.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByGuestId(String guestId);
    List<Reservation> findByGuestEmail(String guestEmail);
}

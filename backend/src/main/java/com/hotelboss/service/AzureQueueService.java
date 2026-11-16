package com.hotelboss.service;

import com.azure.storage.queue.QueueClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hotelboss.model.Reservation;
import com.hotelboss.service.ReservationService.ReservationConfirmedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AzureQueueService {

    private final QueueClient queueClient;
    private final ObjectMapper objectMapper;

    /** Runs only once the booking is committed, so a rolled-back booking never triggers an email. */
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onReservationConfirmed(ReservationConfirmedEvent event) {
        sendBookingConfirmation(event.reservation());
    }

    public void sendBookingConfirmation(Reservation reservation) {
        try {
            ensureQueueExists();
            Map<String, Object> payload = new LinkedHashMap<>();
            payload.put("type", "BOOKING_CONFIRMATION");
            payload.put("reservationId", reservation.getId());
            payload.put("guestEmail", reservation.getGuestEmail());
            payload.put("roomName", reservation.getRoom().getName());
            payload.put("checkIn", reservation.getCheckIn().toString());
            payload.put("checkOut", reservation.getCheckOut().toString());
            // Azure SDK handles Base64 encoding internally; send plain JSON text.
            // Serialized with Jackson so user-supplied values (e.g. email) are escaped properly.
            queueClient.sendMessage(objectMapper.writeValueAsString(payload));
            log.info("Booking confirmation message sent for reservation ID: {}", reservation.getId());
        } catch (Exception e) {
            log.error("Failed to send booking confirmation message for reservation ID: {}", reservation.getId(), e);
        }
    }

    private void ensureQueueExists() {
        try {
            queueClient.createIfNotExists();
        } catch (Exception e) {
            log.warn("Could not ensure queue exists: {}", e.getMessage());
        }
    }
}

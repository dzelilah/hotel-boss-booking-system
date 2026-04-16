package com.hotelboss.service;

import com.azure.storage.queue.QueueClient;
import com.hotelboss.model.Reservation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AzureQueueService {

    private final QueueClient queueClient;

    public void sendBookingConfirmation(Reservation reservation) {
        try {
            ensureQueueExists();
            // Azure SDK handles Base64 encoding internally; send plain JSON text
            String message = String.format(
                "{\"type\":\"BOOKING_CONFIRMATION\",\"reservationId\":%d,\"guestEmail\":\"%s\",\"checkIn\":\"%s\",\"checkOut\":\"%s\"}",
                reservation.getId(),
                reservation.getGuestEmail(),
                reservation.getCheckIn().toString(),
                reservation.getCheckOut().toString()
            );
            queueClient.sendMessage(message);
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

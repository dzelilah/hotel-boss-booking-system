package com.hotelboss.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/** Date rules (not in the past, check-out after check-in, max stay) live in ReservationService. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationRequestDTO {

    @NotNull(message = "Soba je obavezna.")
    private Long roomId;

    @NotNull(message = "Datum dolaska je obavezan.")
    private LocalDate checkIn;

    @NotNull(message = "Datum odlaska je obavezan.")
    private LocalDate checkOut;

    @NotNull(message = "Email je obavezan.")
    @Email(message = "Neispravna email adresa.")
    private String guestEmail;
}

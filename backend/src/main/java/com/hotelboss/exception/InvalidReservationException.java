package com.hotelboss.exception;

/** The request is well-formed but breaks a booking rule (bad dates, cancelling too late, ...). */
public class InvalidReservationException extends RuntimeException {
    public InvalidReservationException(String message) {
        super(message);
    }
}

package com.hotelboss.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

/** Every error response has the same shape: timestamp, status, error, message (+ errors for validation). */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(RoomNotAvailableException.class)
    public ResponseEntity<Map<String, Object>> handleRoomNotAvailable(RoomNotAvailableException ex) {
        return error(HttpStatus.CONFLICT, "Room Not Available", ex.getMessage());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        return error(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
    }

    @ExceptionHandler(InvalidReservationException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidReservation(InvalidReservationException ex) {
        return error(HttpStatus.BAD_REQUEST, "Invalid Reservation", ex.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach((FieldError e) -> errors.putIfAbsent(e.getField(), e.getDefaultMessage()));
        ResponseEntity<Map<String, Object>> response =
                error(HttpStatus.BAD_REQUEST, "Validation Failed", String.join(" ", errors.values()));
        response.getBody().put("errors", errors);
        return response;
    }

    @ExceptionHandler({
            MethodArgumentTypeMismatchException.class,
            MissingServletRequestParameterException.class,
            HttpMessageNotReadableException.class,
    })
    public ResponseEntity<Map<String, Object>> handleBadRequest(Exception ex) {
        return error(HttpStatus.BAD_REQUEST, "Bad Request", "Neispravan zahtjev: provjerite unesene podatke.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneral(Exception ex) {
        // Spring's own exceptions (unknown route, wrong HTTP method, ...) keep their intended status
        // instead of all becoming 500s.
        if (ex instanceof ErrorResponse errorResponse) {
            HttpStatusCode code = errorResponse.getStatusCode();
            HttpStatus status = HttpStatus.resolve(code.value());
            if (status != null && !status.is5xxServerError()) {
                return error(status, status.getReasonPhrase(), errorResponse.getBody().getDetail());
            }
        }
        log.error("Unhandled exception", ex);
        // Don't echo internal exception messages (SQL, stack details) to clients.
        return error(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error",
                "Došlo je do greške na serveru. Pokušajte ponovo.");
    }

    private static ResponseEntity<Map<String, Object>> error(HttpStatus status, String error, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("message", message);
        return ResponseEntity.status(status).body(body);
    }
}

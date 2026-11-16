package com.hotelboss.dto;

import com.hotelboss.model.RoomType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Long id;

    @NotBlank(message = "Naziv sobe je obavezan.")
    @Size(max = 255)
    private String name;

    @NotNull(message = "Tip sobe je obavezan.")
    private RoomType type;

    @NotNull(message = "Kapacitet je obavezan.")
    @Min(value = 1, message = "Kapacitet mora biti najmanje 1.")
    @Max(value = 10, message = "Kapacitet može biti najviše 10.")
    private Integer capacity;

    @NotNull(message = "Cijena je obavezna.")
    @DecimalMin(value = "0.01", message = "Cijena mora biti veća od 0.")
    private BigDecimal pricePerNight;

    private Boolean available;

    @Size(max = 1000, message = "Opis može imati najviše 1000 znakova.")
    private String description;
}

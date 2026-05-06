package com.hotelboss.dto;

import com.hotelboss.model.RoomType;
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
    private String name;
    private RoomType type;
    private Integer capacity;
    private BigDecimal pricePerNight;
    private Boolean available;
    private String description;
}

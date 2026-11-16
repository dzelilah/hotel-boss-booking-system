package com.hotelboss.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Clock;
import java.time.ZoneId;

@Configuration
public class ClockConfig {

    /**
     * "Today" for booking rules is the hotel's local date, not the server's (containers run in UTC).
     * Injected rather than calling LocalDate.now() directly so tests can pin the date.
     */
    @Bean
    public Clock clock(@Value("${hotel.timezone:Europe/Sarajevo}") String timezone) {
        return Clock.system(ZoneId.of(timezone));
    }
}

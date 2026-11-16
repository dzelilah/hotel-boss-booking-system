package com.hotelboss.config;

import com.hotelboss.model.Room;
import com.hotelboss.model.RoomType;
import com.hotelboss.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeds the hotel's 16 rooms on first startup so the site is usable out of the box.
 * Does nothing if any rooms already exist, so admin edits are never overwritten.
 */
@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private static final String STANDARD_DESC =
            "Dvokrevetna soba sa bračnim krevetom. Soba pored ostalog sadrži i mini-bar, klima uređaj i LED TV.";
    private static final String DELUXE_DESC =
            "Prostrana dvokrevetna soba sa 1+1 dva kreveta i pogledom na grad. Sadrži mini-bar, klima uređaj i LED TV.";
    private static final String SUITE_DESC =
            "Spojene dvije dvokrevetne sobe, idealno za porodice. Sadrži mini-bar, klima uređaj i LED TV.";

    private final RoomRepository roomRepository;

    @Override
    public void run(String... args) {
        if (roomRepository.count() > 0) {
            return;
        }

        List<Room> rooms = new ArrayList<>();
        // Floor 1: standard rooms
        for (int n = 101; n <= 108; n++) {
            rooms.add(room("Standard Soba " + n, RoomType.SINGLE, 2, "80.00", STANDARD_DESC));
        }
        // Floor 2: deluxe rooms
        for (int n = 201; n <= 205; n++) {
            rooms.add(room("Deluxe Soba " + n, RoomType.DOUBLE, 2, "110.00", DELUXE_DESC));
        }
        // Floor 3: family suites
        for (int n = 301; n <= 303; n++) {
            rooms.add(room("Family Suite " + n, RoomType.SUITE, 4, "160.00", SUITE_DESC));
        }

        roomRepository.saveAll(rooms);
        log.info("Seeded {} rooms", rooms.size());
    }

    private static Room room(String name, RoomType type, int capacity, String price, String description) {
        return Room.builder()
                .name(name)
                .type(type)
                .capacity(capacity)
                .pricePerNight(new BigDecimal(price))
                .available(true)
                .description(description)
                .build();
    }
}

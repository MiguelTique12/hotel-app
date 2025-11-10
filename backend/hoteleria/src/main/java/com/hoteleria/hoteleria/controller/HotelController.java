package com.hoteleria.hoteleria.controller;

import com.hoteleria.hoteleria.model.Hotel;
import com.hoteleria.hoteleria.service.interfaces.IHotelService;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.service.GenericResponseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
public class HotelController {

  private final IHotelService hotelService;
  private final GenericResponseService responseBuilder;

  @GetMapping("/{id}")
  public ResponseEntity<Hotel> getHotelById(@PathVariable UUID id) {
    Optional<Hotel> hotel = hotelService.findHotelById(id);
    return hotel.map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<Hotel>> getAllHotels() {
    return ResponseEntity.ok(hotelService.findAllHotels());
  }

  @PostMapping
  public ResponseEntity<?> createHotel(@RequestBody Hotel hotel) {
    try {
      Hotel savedHotel = hotelService.save(hotel);
      return ResponseEntity.ok(savedHotel);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    } catch (Exception e) {
      return ResponseEntity.internalServerError().body("Error al guardar el hotel");
    }
  }

  @GetMapping("/search")
  public ResponseEntity<List<Hotel>> searchHotels(@RequestParam String query) {
    return ResponseEntity.ok(hotelService.findByNameOrCity(query));
  }
}

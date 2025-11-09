package com.hoteleria.hoteleria.controller;

import com.hoteleria.hoteleria.model.HotelRoom;
import com.hoteleria.hoteleria.model.request.HotelRoomRequestDTO;
import com.hoteleria.hoteleria.service.interfaces.IHotelRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/hotel-rooms")
@RequiredArgsConstructor
public class HotelRoomController {

  private final IHotelRoomService hotelRoomService;

  @GetMapping("/{id}")
  public ResponseEntity<HotelRoom> getHotelRoomById(@PathVariable UUID id) {
    Optional<HotelRoom> hotelRoom = hotelRoomService.findHotelRoomById(id);
    return hotelRoom.map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<HotelRoom>> getAllHotelRooms() {
    return ResponseEntity.ok(hotelRoomService.findAllHotelRooms());
  }

  @PostMapping("/asignar")
  public ResponseEntity<?> asignarHabitaciones(@RequestBody HotelRoomRequestDTO requestDTO) {
    try {
      hotelRoomService.saveMultipleHotelRooms(requestDTO);
      return ResponseEntity.ok("Habitaciones asignadas correctamente.");
    } catch (IllegalArgumentException e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }
}

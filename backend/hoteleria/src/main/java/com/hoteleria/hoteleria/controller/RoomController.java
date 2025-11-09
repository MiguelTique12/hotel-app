package com.hoteleria.hoteleria.controller;

import com.hoteleria.hoteleria.model.Room;
import com.hoteleria.hoteleria.service.interfaces.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {

  private final IRoomService roomService;

  @GetMapping("/{id}")
  public ResponseEntity<Room> getRoomById(@PathVariable UUID id) {
    Optional<Room> room = roomService.findRoomById(id);
    return room.map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<Room>> getAllRooms() {
    return ResponseEntity.ok(roomService.findAllRooms());
  }

  @PostMapping
  public ResponseEntity<Room> createRoom(@RequestBody Room room) {
    Room saved = roomService.saveRoom(room);
    return ResponseEntity.ok(saved);
  }
}

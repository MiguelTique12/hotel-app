package com.hoteleria.hoteleria.service.interfaces;

import com.hoteleria.hoteleria.model.Room;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IRoomService {

  Optional<Room> findRoomById(UUID id);
  List<Room> findAllRooms();
  Room saveRoom(Room room);

}

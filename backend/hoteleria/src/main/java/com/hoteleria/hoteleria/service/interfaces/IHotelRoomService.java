package com.hoteleria.hoteleria.service.interfaces;

import com.hoteleria.hoteleria.model.HotelRoom;
import com.hoteleria.hoteleria.model.request.HotelRoomRequestDTO;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IHotelRoomService {

  Optional<HotelRoom> findHotelRoomById(UUID id);
  List<HotelRoom> findAllHotelRooms();
  List<HotelRoom> saveMultipleHotelRooms(HotelRoomRequestDTO hotelRoom);


}

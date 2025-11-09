package com.hoteleria.hoteleria.service.interfaces;

import com.hoteleria.hoteleria.model.Hotel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IHotelService {

  Optional<Hotel> findHotelById(UUID id);
  List<Hotel> findAllHotels();
  Hotel save(Hotel hotel);

}

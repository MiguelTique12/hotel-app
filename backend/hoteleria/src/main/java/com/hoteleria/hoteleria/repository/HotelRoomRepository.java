package com.hoteleria.hoteleria.repository;

import com.hoteleria.hoteleria.model.Hotel;
import com.hoteleria.hoteleria.model.HotelRoom;
import com.hoteleria.hoteleria.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface HotelRoomRepository extends JpaRepository<HotelRoom, UUID> {

  Optional<HotelRoom> findByHotelAndRoom(Hotel hotel, Room room);

  Optional<HotelRoom> findById(UUID id);

  @Query("SELECT COALESCE(SUM(hr.quantity), 0) FROM HotelRoom hr WHERE hr.hotel = :hotel")
  int sumCantidadByHotel(Hotel hotel);

}

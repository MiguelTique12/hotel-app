package com.hoteleria.hoteleria.repository;

import com.hoteleria.hoteleria.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HotelRepository extends JpaRepository<Hotel, UUID> {

    boolean existsByNit(String nit);

}

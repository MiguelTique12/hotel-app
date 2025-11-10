package com.hoteleria.hoteleria.repository;

import com.hoteleria.hoteleria.model.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface HotelRepository extends JpaRepository<Hotel, UUID> {

    boolean existsByNit(String nit);

    @Query("SELECT h FROM Hotel h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(h.city) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<Hotel> findByNameOrCity(String search);

}

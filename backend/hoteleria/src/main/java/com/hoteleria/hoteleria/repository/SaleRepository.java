package com.hoteleria.hoteleria.repository;

import com.hoteleria.hoteleria.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SaleRepository extends JpaRepository<Sale, UUID> {
}

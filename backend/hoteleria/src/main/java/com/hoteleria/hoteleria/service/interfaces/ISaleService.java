package com.hoteleria.hoteleria.service.interfaces;

import com.hoteleria.hoteleria.model.Sale;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ISaleService {

  Optional<Sale> findById(UUID id);
  List<Sale> findAll();
  Sale save(Sale sale);

}

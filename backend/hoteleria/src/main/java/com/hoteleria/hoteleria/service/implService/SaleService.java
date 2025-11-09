package com.hoteleria.hoteleria.service.implService;

import com.hoteleria.hoteleria.model.HotelRoom;
import com.hoteleria.hoteleria.model.Sale;
import com.hoteleria.hoteleria.repository.HotelRoomRepository;
import com.hoteleria.hoteleria.repository.SaleRepository;
import com.hoteleria.hoteleria.service.interfaces.ISaleService;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class SaleService implements ISaleService {

  private final SaleRepository saleRepository;
  private final HotelRoomRepository hotelRoomRepository;

  @Override
  public Optional<Sale> findById(UUID id) {
    return saleRepository.findById(id);
  }

  @Override
  public List<Sale> findAll() {
    return saleRepository.findAll();
  }

  @Transactional
  @Override
  public Sale save(Sale sale) {
    HotelRoom hotelRoom = hotelRoomRepository.findById(sale.getHotelRoom().getId())
        .orElseThrow(() -> new IllegalArgumentException("No se encontró la habitación en el hotel o habitación especificada"));

    if (hotelRoom.getQuantity() <= 0) {
      throw new IllegalStateException("No hay habitaciones disponibles para este hotel y habitación.");
    }

    hotelRoom.setQuantity(hotelRoom.getQuantity() - 1);
    hotelRoomRepository.save(hotelRoom);

    return saleRepository.save(sale);
  }

}

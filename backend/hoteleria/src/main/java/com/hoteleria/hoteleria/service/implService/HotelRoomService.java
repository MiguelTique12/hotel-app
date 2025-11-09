package com.hoteleria.hoteleria.service.implService;

import com.hoteleria.hoteleria.model.Enum.RoomCategory;
import com.hoteleria.hoteleria.model.Enum.RoomType;
import com.hoteleria.hoteleria.model.Hotel;
import com.hoteleria.hoteleria.model.HotelRoom;
import com.hoteleria.hoteleria.model.Room;
import com.hoteleria.hoteleria.model.request.HotelRoomRequestDTO;
import com.hoteleria.hoteleria.model.request.RoomQuantityDTO;
import com.hoteleria.hoteleria.repository.HotelRepository;
import com.hoteleria.hoteleria.repository.HotelRoomRepository;
import com.hoteleria.hoteleria.repository.RoomRepository;
import com.hoteleria.hoteleria.service.interfaces.IHotelRoomService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class HotelRoomService implements IHotelRoomService {

  private final HotelRoomRepository hotelRoomRepository;
  private final HotelRepository hotelRepository;
  private final RoomRepository roomRepository;

  @Override
  public Optional<HotelRoom> findHotelRoomById(UUID id) {
    return hotelRoomRepository.findById(id);
  }

  @Override
  public List<HotelRoom> findAllHotelRooms() {
    return hotelRoomRepository.findAll();
  }

  @Override
  @Transactional(rollbackFor = Exception.class)
  public List<HotelRoom> saveMultipleHotelRooms(HotelRoomRequestDTO requestDTO) {
    // Buscar hotel
    Hotel hotel = hotelRepository.findById(requestDTO.getHotelId())
            .orElseThrow(() -> new IllegalArgumentException("Hotel no encontrado"));

    // Calcular el total existente ANTES de agregar las nuevas
    int totalExistente = sumRoomsByHotel(hotel);

    // Calcular el total de nuevas habitaciones
    int totalNuevas = 0;
    for (RoomQuantityDTO dto : requestDTO.getRooms()) {
      totalNuevas += dto.getQuantity();
    }

    // VALIDAR PRIMERO el límite ANTES de guardar cualquier cosa
    if ((totalExistente + totalNuevas) > hotel.getMaxRooms()) {
      throw new IllegalArgumentException(
              String.format("La suma total de habitaciones excede el límite del hotel (%d).",
                      totalExistente, totalNuevas, totalExistente + totalNuevas, hotel.getMaxRooms())
      );
    }

    List<HotelRoom> savedRooms = new ArrayList<>();

    // Iterar y validar TODAS las habitaciones antes de guardar
    for (RoomQuantityDTO dto : requestDTO.getRooms()) {
      Room room = roomRepository.findById(dto.getId())
              .orElseThrow(() -> new IllegalArgumentException(
                      "Tipo de habitación no encontrado con ID: " + dto.getId()
              ));

      // Validar combinación tipo-acomodación
      if (!validarAcomodacion(room.getType(), room.getAccommodation())) {
        throw new IllegalArgumentException(
                String.format("Combinación inválida: %s con %s",
                        room.getType(), room.getAccommodation())
        );
      }

      // Verificar si ya existe la combinación hotel-habitación
      Optional<HotelRoom> existente = hotelRoomRepository.findByHotelAndRoom(hotel, room);
      if (existente.isPresent()) {
        throw new IllegalArgumentException(
                String.format("Ya existe la combinación hotel '%s' + habitación '%s-%s'",
                        hotel.getName(), room.getType(), room.getAccommodation())
        );
      }

      // Crear y guardar HotelRoom
      HotelRoom hotelRoom = new HotelRoom();
      hotelRoom.setHotel(hotel);
      hotelRoom.setRoom(room);
      hotelRoom.setQuantity(dto.getQuantity());

      HotelRoom saved = hotelRoomRepository.save(hotelRoom);
      savedRooms.add(saved);
    }

    return savedRooms;
  }

  private int sumRoomsByHotel(Hotel hotel) {
    return hotelRoomRepository.sumCantidadByHotel(hotel);
  }

  private boolean validarAcomodacion(RoomCategory category, RoomType type) {
    return switch (category) {
      case ESTANDAR -> type == RoomType.SENCILLA || type == RoomType.DOBLE;
      case JUNIOR -> type == RoomType.TRIPLE || type == RoomType.CUADRUPLE;
      case SUITE -> type == RoomType.SENCILLA || type == RoomType.DOBLE || type == RoomType.TRIPLE;
    };
  }
}

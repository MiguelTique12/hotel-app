package com.hoteleria.hoteleria.service.implService;

import com.hoteleria.hoteleria.model.Enum.RoomType;
import com.hoteleria.hoteleria.model.Room;
import com.hoteleria.hoteleria.repository.RoomRepository;
import com.hoteleria.hoteleria.service.interfaces.IRoomService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class RoomService implements IRoomService {

  private final RoomRepository roomRepository;

  @Override
  public Optional<Room> findRoomById(UUID id) {
    return roomRepository.findById(id);
  }

  @Override
  public List<Room> findAllRooms() {
    return roomRepository.findAll();
  }

  @Override
  public Room saveRoom(Room room) {
    // Validar combinaciones permitidas de tipo de habitación y acomodación
    validateRoomTypeAndAccommodation(room);

    // Guardar la habitación en la base de datos
    return roomRepository.save(room);
  }

  /**
   * Valida que la combinación de tipo de habitación y acomodación sea válida.
   * @param room La habitación a validar
   * @throws IllegalArgumentException Si la combinación no es válida
   */
  private void validateRoomTypeAndAccommodation(Room room) {
    switch (room.getType()) {
      case ESTANDAR:
        // Si es Estándar: la acomodación debe ser Sencilla o Doble
        if (room.getAccommodation() != RoomType.SENCILLA &&
            room.getAccommodation() != RoomType.DOBLE) {
          throw new IllegalArgumentException(
              "Las habitaciones Estándar solo pueden tener acomodación Sencilla o Doble."
          );
        }
        break;

      case JUNIOR:
        // Si es Junior: la acomodación debe ser Triple o Cuádruple
        if (room.getAccommodation() != RoomType.TRIPLE &&
            room.getAccommodation() != RoomType.CUADRUPLE) {
          throw new IllegalArgumentException(
              "Las habitaciones Junior solo pueden tener acomodación Triple o Cuádruple."
          );
        }
        break;

      case SUITE:
        // Si es Suite: la acomodación debe ser Sencilla, Doble o Triple
        if (room.getAccommodation() != RoomType.SENCILLA &&
            room.getAccommodation() != RoomType.DOBLE &&
            room.getAccommodation() != RoomType.TRIPLE) {
          throw new IllegalArgumentException(
              "Las habitaciones Suite solo pueden tener acomodación Sencilla, Doble o Triple."
          );
        }
        break;

      default:
        throw new IllegalArgumentException("Tipo de habitación no reconocido.");
    }
  }
}

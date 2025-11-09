package com.hoteleria.hoteleria.model.request;

import lombok.Data;
import java.util.List;
import java.util.UUID;

@Data
public class HotelRoomRequestDTO {

  private UUID hotelId;
  private List<RoomQuantityDTO> rooms;

}

package com.hoteleria.hoteleria.model.request;

import lombok.Data;

import java.util.UUID;

@Data
public class RoomQuantityDTO {

  private UUID id;
  private int quantity;

}

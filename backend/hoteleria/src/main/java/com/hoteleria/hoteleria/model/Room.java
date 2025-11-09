package com.hoteleria.hoteleria.model;

import com.hoteleria.hoteleria.model.Enum.RoomCategory;
import com.hoteleria.hoteleria.model.Enum.RoomType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

  @Id
  @GeneratedValue
  private UUID id;

  @Enumerated(EnumType.STRING)
  @Column(name = "type", nullable = false)
  private RoomCategory type;

  @Enumerated(EnumType.STRING)
  @Column(name = "accommodation", nullable = false)
  private RoomType accommodation;
}

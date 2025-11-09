package com.hoteleria.hoteleria.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "hotels")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(name = "name", nullable = false,  unique = true)
  private String name;

  @Column(name = "city", nullable = false)
  private String city;

  @Column(name = "address", nullable = false)
  private String address;

  @Column(name = "nit", nullable = false, unique = true)
  private String nit;

  @Column(name = "max_rooms", nullable = false)
  private int maxRooms;
}

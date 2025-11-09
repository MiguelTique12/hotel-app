package com.hoteleria.hoteleria.service.interfaces;

import com.hoteleria.hoteleria.model.User;
import com.hoteleria.hoteleria.model.request.AuthResponse;
import com.hoteleria.hoteleria.model.request.LoginRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IUserService {

  Optional<User> findUserById(UUID id);
  List<User> findAllUsers();

  //Security
  AuthResponse login(LoginRequest request);
  User register(User request);

}

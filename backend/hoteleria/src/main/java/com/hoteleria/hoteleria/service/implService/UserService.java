package com.hoteleria.hoteleria.service.implService;

import com.hoteleria.hoteleria.model.User;
import com.hoteleria.hoteleria.model.request.AuthResponse;
import com.hoteleria.hoteleria.model.request.LoginRequest;
import com.hoteleria.hoteleria.repository.UserRepository;
import com.hoteleria.hoteleria.service.interfaces.IUserService;
import com.hoteleria.hoteleria.service.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@AllArgsConstructor
@Service
public class UserService implements IUserService {

  private final UserRepository userRepository;
  private final JwtService jwtService;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;

  @Override
  public Optional<User> findUserById(UUID id) {
    return userRepository.findById(id);
  }

  @Override
  public List<User> findAllUsers() {
    return userRepository.findAll();
  }

  @Override
  public AuthResponse login(LoginRequest request) {

    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
    );

    User user = userRepository.findByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("No se encontró el usuario"));

    String token = jwtService.getToken(user);

    return AuthResponse.builder()
        .token(token)
        .build();
  }

  @Override
  public User register(User request) {
    try {
      Optional<User> existingUser = userRepository.findByEmail(request.getEmail());
      if (existingUser.isPresent()) {
        throw new IllegalArgumentException("El correo ya está registrado. Debe ser único.");
      }

      User newUser = User.builder()
          .fullName(request.getFullName())
          .documentNumber(request.getDocumentNumber())
          .documentType(request.getDocumentType())
          .email(request.getEmail())
          .phone(request.getPhone())
          .password(passwordEncoder.encode(request.getPassword()))
          .build();

      return userRepository.save(newUser);
    } catch (IllegalArgumentException e) {
      throw e;
    } catch (Exception e) {
      throw new RuntimeException("Ocurrió un error al registrar el usuario.", e);
    }
  }

}

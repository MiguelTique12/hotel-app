package com.hoteleria.hoteleria.config.defaults;

import com.hoteleria.hoteleria.model.User;
import com.hoteleria.hoteleria.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.boot.CommandLineRunner;

@AllArgsConstructor
@Configuration
public class DataInitializer {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @Bean
  public CommandLineRunner initData() {
    return args -> {
      boolean userExists = userRepository.findByEmail("admin@gmail.com").isPresent() ||
          userRepository.findByDocumentNumber("1234567890").isPresent();

      if (!userExists) {
        try {
          User adminUser = User.builder()
              .fullName("Administrador")
              .documentNumber("1234567890")
              .documentType("CC")
              .email("admin@gmail.com")
              .phone("3001234567")
              .password(passwordEncoder.encode("admin123"))
              .build();

          userRepository.save(adminUser);
          System.out.println("Usuario administrador por defecto creado");
        } catch (Exception e) {
          System.err.println("Error al crear usuario administrador: " + e.getMessage());
        }
      } else {
        System.out.println("El usuario administrador ya existe, no se creó uno nuevo");
      }
    };
  }
}
package com.hoteleria.hoteleria.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
@Table(name = "users")
public class User implements UserDetails {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(name = "full_name", nullable = false)
  private String fullName;

  @Column(name = "document_number", nullable = false, unique = true)
  private String documentNumber;

  @Column(name = "document_type", nullable = false)
  private String documentType;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "phone", nullable = false)
  private String phone;

  /**
   * Obtiene las autoridades concedidas al usuario.
   *
   * @return una colección vacía ya que no se han definido roles.
   */
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.emptyList();
  }

  @Override
  public String getUsername() {
    return "";
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

}

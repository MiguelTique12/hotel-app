package com.hoteleria.hoteleria.controller;

import com.hoteleria.hoteleria.model.Sale;
import com.hoteleria.hoteleria.service.interfaces.ISaleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

  private final ISaleService saleService;

  @GetMapping("/{id}")
  public ResponseEntity<Sale> getSaleById(@PathVariable UUID id) {
    Optional<Sale> sale = saleService.findById(id);
    return sale.map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<Sale>> getAllSales() {
    return ResponseEntity.ok(saleService.findAll());
  }

  @PostMapping
  public ResponseEntity<Sale> createSale(@RequestBody Sale sale) {
    Sale saved = saleService.save(sale);
    return ResponseEntity.ok(saved);
  }
}

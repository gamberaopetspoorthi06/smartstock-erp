package com.nexus.erp.repository;

import com.nexus.erp.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Week 2: Spring Data JPA Repository Layer
 * Provides automatic CRUD methods (save, findById, findAll, delete)
 */
@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {

    Optional<Item> findBySku(String sku);

    List<Item> findByCategory(String category);

    // Custom query method for low stock warning
    List<Item> findByCurrentStockLessThanEqual(Integer reorderPoint);
}

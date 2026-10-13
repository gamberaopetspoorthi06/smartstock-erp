package com.nexus.erp.controller;

import com.nexus.erp.dto.ItemDTO;
import com.nexus.erp.model.Item;
import com.nexus.erp.service.ItemService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Week 1 & 2: REST Controller Layer & CRUD Endpoints
 * Demonstrates: @RestController, HTTP Methods (GET, POST, PUT, DELETE),
 * ResponseEntity with proper Status Codes (200, 201, 204), and @Valid DTO mapping.
 */
@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*") // Allows React frontend to communicate smoothly
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // GET /api/items -> List all inventory items (HTTP 200 OK)
    @GetMapping
    public ResponseEntity<List<Item>> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return ResponseEntity.ok(items);
    }

    // GET /api/items/{id} -> Retrieve single item (HTTP 200 OK)
    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable Long id) {
        Item item = itemService.getItemById(id);
        return ResponseEntity.ok(item);
    }

    // POST /api/items -> Create item (HTTP 201 Created)
    // Week 3: @Valid triggers Bean Validation; Week 6: @PreAuthorize checks ROLE_ADMIN
    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Item> createItem(@Valid @RequestBody ItemDTO itemDTO) {
        Item created = itemService.createItem(itemDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/items/{id} -> Update existing item (HTTP 200 OK)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Item> updateItem(@PathVariable Long id, @Valid @RequestBody ItemDTO itemDTO) {
        Item updated = itemService.updateItem(id, itemDTO);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/items/{id} -> Remove item (HTTP 204 No Content)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteItem(@PathVariable Long id) {
        itemService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}

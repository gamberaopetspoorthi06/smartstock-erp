package com.nexus.erp.controller;

import com.nexus.erp.model.PurchaseOrder;
import com.nexus.erp.service.PurchaseOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Week 4: Procurement REST Controller for Master-Detail PO lifecycle
 */
@RestController
@RequestMapping("/api/purchase-orders")
@CrossOrigin(origins = "*")
public class PurchaseOrderController {

    private final PurchaseOrderService poService;

    @Autowired
    public PurchaseOrderController(PurchaseOrderService poService) {
        this.poService = poService;
    }

    @GetMapping
    public ResponseEntity<List<PurchaseOrder>> getAllOrders() {
        return ResponseEntity.ok(poService.getAllPurchaseOrders());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PurchaseOrder> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(poService.getPOById(id));
    }

    @PostMapping
    public ResponseEntity<PurchaseOrder> createOrder(@RequestBody PurchaseOrder po) {
        PurchaseOrder created = poService.createPurchaseOrder(po);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}/issue")
    public ResponseEntity<PurchaseOrder> issueOrder(@PathVariable Long id) {
        return ResponseEntity.ok(poService.issuePurchaseOrder(id));
    }

    @PutMapping("/{id}/receive")
    public ResponseEntity<PurchaseOrder> receiveOrder(@PathVariable Long id) {
        // Inter-module transaction: marks received, bumps stock, dispatches to ledger!
        return ResponseEntity.ok(poService.receivePurchaseOrder(id));
    }
}

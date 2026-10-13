package com.nexus.erp.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Week 4: JPA Mapping (@OneToMany)
 * Demonstrates Master-Detail relationship: One Purchase Order contains Many Line Items
 */
@Entity
@Table(name = "purchase_orders")
public class PurchaseOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String poNumber; // e.g. PO-2026-0042

    @Column(nullable = false)
    private String vendorName;

    @Column(nullable = false)
    private String status; // DRAFT, ISSUED, RECEIVED

    @Column(nullable = false)
    private Double totalAmount;

    @Column(nullable = false)
    private String paymentStatus; // UNPAID, PAID

    // Week 4: @OneToMany JPA mapping with cascade and orphanRemoval
    @OneToMany(mappedBy = "purchaseOrder", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<POLineItem> items = new ArrayList<>();

    public PurchaseOrder() {
    }

    public PurchaseOrder(String poNumber, String vendorName, String status, Double totalAmount, String paymentStatus) {
        this.poNumber = poNumber;
        this.vendorName = vendorName;
        this.status = status;
        this.totalAmount = totalAmount;
        this.paymentStatus = paymentStatus;
    }

    public void addItem(POLineItem item) {
        items.add(item);
        item.setPurchaseOrder(this);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPoNumber() {
        return poNumber;
    }

    public void setPoNumber(String poNumber) {
        this.poNumber = poNumber;
    }

    public String getVendorName() {
        return vendorName;
    }

    public void setVendorName(String vendorName) {
        this.vendorName = vendorName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public List<POLineItem> getItems() {
        return items;
    }

    public void setItems(List<POLineItem> items) {
        this.items = items;
    }
}

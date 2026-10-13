package com.nexus.erp.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

/**
 * Week 4: JPA Mapping (@ManyToOne)
 * Represents individual line items inside a Purchase Order
 */
@Entity
@Table(name = "po_line_items")
public class POLineItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sku;

    @Column(nullable = false)
    private String itemName;

    @Column(nullable = false)
    private Integer orderedQty;

    @Column(nullable = false)
    private Double unitCost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    @JsonIgnore // Prevents circular JSON serialization
    private PurchaseOrder purchaseOrder;

    public POLineItem() {
    }

    public POLineItem(String sku, String itemName, Integer orderedQty, Double unitCost, PurchaseOrder purchaseOrder) {
        this.sku = sku;
        this.itemName = itemName;
        this.orderedQty = orderedQty;
        this.unitCost = unitCost;
        this.purchaseOrder = purchaseOrder;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public Integer getOrderedQty() {
        return orderedQty;
    }

    public void setOrderedQty(Integer orderedQty) {
        this.orderedQty = orderedQty;
    }

    public Double getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(Double unitCost) {
        this.unitCost = unitCost;
    }

    public PurchaseOrder getPurchaseOrder() {
        return purchaseOrder;
    }

    public void setPurchaseOrder(PurchaseOrder purchaseOrder) {
        this.purchaseOrder = purchaseOrder;
    }
}

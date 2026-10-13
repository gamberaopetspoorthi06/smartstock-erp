package com.nexus.erp.model;

import jakarta.persistence.*;

/**
 * Week 2 & 4: Inventory Item Entity
 * Maps directly to MySQL 'items' table
 */
@Entity
@Table(name = "items")
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String sku; // e.g. SKU-MOTOR-01

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // ELECTRONICS, ROBOTICS, MECHANICAL, RAW_MATERIALS

    @Column(nullable = false)
    private Integer currentStock;

    @Column(nullable = false)
    private Double unitCost;

    @Column(nullable = false)
    private Integer reorderPoint;

    @Version
    private Integer version = 1; // Optimistic Concurrency Control (OCC)

    public Item() {
    }

    public Item(String sku, String name, String category, Integer currentStock, Double unitCost, Integer reorderPoint) {
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.currentStock = currentStock;
        this.unitCost = unitCost;
        this.reorderPoint = reorderPoint;
        this.version = 1;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }

    public Double getUnitCost() {
        return unitCost;
    }

    public void setUnitCost(Double unitCost) {
        this.unitCost = unitCost;
    }

    public Integer getReorderPoint() {
        return reorderPoint;
    }

    public void setReorderPoint(Integer reorderPoint) {
        this.reorderPoint = reorderPoint;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }
}

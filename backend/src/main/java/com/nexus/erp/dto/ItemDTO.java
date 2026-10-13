package com.nexus.erp.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Week 3: Data Transfer Object (DTO) with Validation annotations (@Valid)
 * Separates API request payload from database Entity model
 */
public class ItemDTO {

    @NotBlank(message = "SKU code cannot be blank")
    private String sku;

    @NotBlank(message = "Item name cannot be blank")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Current stock is required")
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer currentStock;

    @NotNull(message = "Unit cost is required")
    @Min(value = 0, message = "Unit cost cannot be negative")
    private Double unitCost;

    @NotNull(message = "Reorder point is required")
    @Min(value = 0, message = "Reorder point must be at least 0")
    private Integer reorderPoint;

    public ItemDTO() {
    }

    public ItemDTO(String sku, String name, String category, Integer currentStock, Double unitCost, Integer reorderPoint) {
        this.sku = sku;
        this.name = name;
        this.category = category;
        this.currentStock = currentStock;
        this.unitCost = unitCost;
        this.reorderPoint = reorderPoint;
    }

    // Getters and Setters
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
}

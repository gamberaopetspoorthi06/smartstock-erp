package com.nexus.erp.service;

import com.nexus.erp.dto.ItemDTO;
import com.nexus.erp.exception.ResourceNotFoundException;
import com.nexus.erp.model.Item;
import com.nexus.erp.repository.ItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Week 2: Service Layer with Dependency Injection (@Autowired)
 * Week 9: Performance Optimization with Spring Caching (@Cacheable, @CacheEvict)
 */
@Service
public class ItemService {

    private final ItemRepository itemRepository;

    // Week 2: Constructor Dependency Injection
    @Autowired
    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    // Week 9: @Cacheable caches results in memory to reduce database queries
    @Cacheable("items")
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Item with ID " + id + " not found"));
    }

    public Item getItemBySku(String sku) {
        return itemRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Item with SKU " + sku + " not found"));
    }

    // Week 9: @CacheEvict clears the cache when data is modified
    @CacheEvict(value = "items", allEntries = true)
    @Transactional
    public Item createItem(ItemDTO itemDTO) {
        Item item = new Item(
                itemDTO.getSku(),
                itemDTO.getName(),
                itemDTO.getCategory(),
                itemDTO.getCurrentStock(),
                itemDTO.getUnitCost(),
                itemDTO.getReorderPoint()
        );
        return itemRepository.save(item);
    }

    @CacheEvict(value = "items", allEntries = true)
    @Transactional
    public Item updateItem(Long id, ItemDTO itemDTO) {
        Item existingItem = getItemById(id);

        existingItem.setName(itemDTO.getName());
        existingItem.setCategory(itemDTO.getCategory());
        existingItem.setCurrentStock(itemDTO.getCurrentStock());
        existingItem.setUnitCost(itemDTO.getUnitCost());
        existingItem.setReorderPoint(itemDTO.getReorderPoint());

        return itemRepository.save(existingItem);
    }

    @CacheEvict(value = "items", allEntries = true)
    @Transactional
    public void deleteItem(Long id) {
        Item existingItem = getItemById(id);
        itemRepository.delete(existingItem);
    }
}

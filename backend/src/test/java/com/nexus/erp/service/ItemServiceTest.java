package com.nexus.erp.service;

import com.nexus.erp.dto.ItemDTO;
import com.nexus.erp.model.Item;
import com.nexus.erp.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Week 11-12: Unit Testing with JUnit 5 and Mockito
 * Tests Service Layer business logic with Mocked Repository dependency
 */
@ExtendWith(MockitoExtension.class)
public class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @InjectMocks
    private ItemService itemService;

    private Item sampleItem;

    @BeforeEach
    void setUp() {
        sampleItem = new Item("SKU-TEST-01", "Brushless DC Motor", "ROBOTICS", 50, 25.0, 10);
        sampleItem.setId(1L);
    }

    @Test
    void testGetAllItems_ReturnsList() {
        // Arrange
        when(itemRepository.findAll()).thenReturn(Arrays.asList(sampleItem));

        // Act
        List<Item> result = itemService.getAllItems();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("SKU-TEST-01", result.get(0).getSku());
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    void testGetItemById_Success() {
        // Arrange
        when(itemRepository.findById(1L)).thenReturn(Optional.of(sampleItem));

        // Act
        Item result = itemService.getItemById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("SKU-TEST-01", result.getSku());
        assertEquals(50, result.getCurrentStock());
    }

    @Test
    void testCreateItem_Success() {
        // Arrange
        ItemDTO dto = new ItemDTO("SKU-NEW-02", "LiDAR Sensor", "ELECTRONICS", 20, 150.0, 5);
        when(itemRepository.save(any(Item.class))).thenReturn(sampleItem);

        // Act
        Item created = itemService.createItem(dto);

        // Assert
        assertNotNull(created);
        verify(itemRepository, times(1)).save(any(Item.class));
    }
}

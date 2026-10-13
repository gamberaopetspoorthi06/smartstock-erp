package com.nexus.erp.service;

import com.nexus.erp.exception.ResourceNotFoundException;
import com.nexus.erp.model.*;
import com.nexus.erp.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Week 4: Service managing Master-Detail JPA entities (@OneToMany PurchaseOrder)
 * Inter-Module Bridge: Receiving goods updates inventory and posts to General Ledger
 */
@Service
public class PurchaseOrderService {

    private final PurchaseOrderRepository poRepository;
    private final ItemRepository itemRepository;
    private final LedgerRepository ledgerRepository;

    @Autowired
    public PurchaseOrderService(PurchaseOrderRepository poRepository, ItemRepository itemRepository, LedgerRepository ledgerRepository) {
        this.poRepository = poRepository;
        this.itemRepository = itemRepository;
        this.ledgerRepository = ledgerRepository;
    }

    public List<PurchaseOrder> getAllPurchaseOrders() {
        return poRepository.findAll();
    }

    public PurchaseOrder getPOById(Long id) {
        return poRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase Order " + id + " not found"));
    }

    @Transactional
    public PurchaseOrder createPurchaseOrder(PurchaseOrder po) {
        po.setStatus("DRAFT");
        po.setPaymentStatus("UNPAID");
        return poRepository.save(po);
    }

    @Transactional
    public PurchaseOrder issuePurchaseOrder(Long id) {
        PurchaseOrder po = getPOById(id);
        po.setStatus("ISSUED");
        return poRepository.save(po);
    }

    /**
     * Inter-Module Core Trigger:
     * 1. Marks PO as RECEIVED
     * 2. Increments stock in Item table
     * 3. Posts balanced Double-Entry record to General Ledger (Debit 1300 / Credit 2000)
     */
    @Transactional
    public PurchaseOrder receivePurchaseOrder(Long id) {
        PurchaseOrder po = getPOById(id);
        po.setStatus("RECEIVED");

        // 1. Update stock levels for each line item
        for (POLineItem line : po.getItems()) {
            Optional<Item> itemOpt = itemRepository.findBySku(line.getSku());
            if (itemOpt.isPresent()) {
                Item item = itemOpt.get();
                item.setCurrentStock(item.getCurrentStock() + line.getOrderedQty());
                itemRepository.save(item);
            }
        }

        // 2. Post financial ledger entry (Debit Asset / Credit Accounts Payable)
        String entryNumber = "JRNL-" + System.currentTimeMillis() % 100000;
        LedgerEntry ledger = new LedgerEntry(
                entryNumber,
                "Goods Receipt Note (GRN) under " + po.getPoNumber() + " from " + po.getVendorName(),
                "1300 - Inventory Asset",
                po.getTotalAmount(),
                "2000 - Accounts Payable",
                po.getTotalAmount()
        );
        ledgerRepository.save(ledger);

        return poRepository.save(po);
    }
}

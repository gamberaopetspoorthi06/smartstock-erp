package com.nexus.erp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Week 2 & 4: General Ledger Double-Entry Entity
 * Dispatched automatically when goods are received or invoices settled
 */
@Entity
@Table(name = "ledger_entries")
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String entryNumber; // e.g. JRNL-2026-0312

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String debitAccount; // e.g. "1300 - Inventory Asset"

    @Column(nullable = false)
    private Double debitAmount;

    @Column(nullable = false)
    private String creditAccount; // e.g. "2000 - Accounts Payable"

    @Column(nullable = false)
    private Double creditAmount;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    public LedgerEntry() {
        this.timestamp = LocalDateTime.now();
    }

    public LedgerEntry(String entryNumber, String description, String debitAccount, Double debitAmount, String creditAccount, Double creditAmount) {
        this.entryNumber = entryNumber;
        this.description = description;
        this.debitAccount = debitAccount;
        this.debitAmount = debitAmount;
        this.creditAccount = creditAccount;
        this.creditAmount = creditAmount;
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEntryNumber() {
        return entryNumber;
    }

    public void setEntryNumber(String entryNumber) {
        this.entryNumber = entryNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDebitAccount() {
        return debitAccount;
    }

    public void setDebitAccount(String debitAccount) {
        this.debitAccount = debitAccount;
    }

    public Double getDebitAmount() {
        return debitAmount;
    }

    public void setDebitAmount(Double debitAmount) {
        this.debitAmount = debitAmount;
    }

    public String getCreditAccount() {
        return creditAccount;
    }

    public void setCreditAccount(String creditAccount) {
        this.creditAccount = creditAccount;
    }

    public Double getCreditAmount() {
        return creditAmount;
    }

    public void setCreditAmount(Double creditAmount) {
        this.creditAmount = creditAmount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}

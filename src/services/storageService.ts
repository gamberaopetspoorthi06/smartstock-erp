import { 
  Item, Warehouse, Supplier, PurchaseOrder, StockMovement, LedgerEntry, AuditLogEntry, Sale 
} from '../types/erp';
import { 
  INITIAL_ITEMS, INITIAL_WAREHOUSES, INITIAL_SUPPLIERS, 
  INITIAL_PURCHASE_ORDERS, INITIAL_STOCK_MOVEMENTS, 
  INITIAL_LEDGER_ENTRIES, INITIAL_AUDIT_LOGS, INITIAL_SALES 
} from './seedData';

const STORAGE_KEYS = {
  ITEMS: 'smartstock_items_v3',
  WAREHOUSES: 'smartstock_warehouses_v3',
  SUPPLIERS: 'smartstock_suppliers_v3',
  PURCHASE_ORDERS: 'smartstock_purchase_orders_v3',
  SALES: 'smartstock_sales_v3',
  STOCK_MOVEMENTS: 'smartstock_stock_movements_v3',
  LEDGER_ENTRIES: 'smartstock_ledger_entries_v3',
  AUDIT_LOGS: 'smartstock_audit_logs_v3',
};

export const storageService = {
  getItems(): Item[] {
    const raw = localStorage.getItem(STORAGE_KEYS.ITEMS);
    if (!raw) {
      this.saveItems(INITIAL_ITEMS);
      return INITIAL_ITEMS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_ITEMS;
    }
  },

  saveItems(items: Item[]): void {
    localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  },

  getWarehouses(): Warehouse[] {
    const raw = localStorage.getItem(STORAGE_KEYS.WAREHOUSES);
    if (!raw) {
      this.saveWarehouses(INITIAL_WAREHOUSES);
      return INITIAL_WAREHOUSES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_WAREHOUSES;
    }
  },

  saveWarehouses(warehouses: Warehouse[]): void {
    localStorage.setItem(STORAGE_KEYS.WAREHOUSES, JSON.stringify(warehouses));
  },

  getSuppliers(): Supplier[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    if (!raw) {
      this.saveSuppliers(INITIAL_SUPPLIERS);
      return INITIAL_SUPPLIERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SUPPLIERS;
    }
  },

  saveSuppliers(suppliers: Supplier[]): void {
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers));
  },

  getPurchaseOrders(): PurchaseOrder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PURCHASE_ORDERS);
    if (!raw) {
      this.savePurchaseOrders(INITIAL_PURCHASE_ORDERS);
      return INITIAL_PURCHASE_ORDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PURCHASE_ORDERS;
    }
  },

  savePurchaseOrders(pos: PurchaseOrder[]): void {
    localStorage.setItem(STORAGE_KEYS.PURCHASE_ORDERS, JSON.stringify(pos));
  },

  getSales(): Sale[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) {
      this.saveSales(INITIAL_SALES);
      return INITIAL_SALES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SALES;
    }
  },

  saveSales(sales: Sale[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  },

  getStockMovements(): StockMovement[] {
    const raw = localStorage.getItem(STORAGE_KEYS.STOCK_MOVEMENTS);
    if (!raw) {
      this.saveStockMovements(INITIAL_STOCK_MOVEMENTS);
      return INITIAL_STOCK_MOVEMENTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_STOCK_MOVEMENTS;
    }
  },

  saveStockMovements(movements: StockMovement[]): void {
    localStorage.setItem(STORAGE_KEYS.STOCK_MOVEMENTS, JSON.stringify(movements));
  },

  getLedgerEntries(): LedgerEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LEDGER_ENTRIES);
    if (!raw) {
      this.saveLedgerEntries(INITIAL_LEDGER_ENTRIES);
      return INITIAL_LEDGER_ENTRIES;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_LEDGER_ENTRIES;
    }
  },

  saveLedgerEntries(entries: LedgerEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.LEDGER_ENTRIES, JSON.stringify(entries));
  },

  getAuditLogs(): AuditLogEntry[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      this.saveAuditLogs(INITIAL_AUDIT_LOGS);
      return INITIAL_AUDIT_LOGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_AUDIT_LOGS;
    }
  },

  saveAuditLogs(logs: AuditLogEntry[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs));
  },

  resetDatabaseToSeed(): void {
    this.saveItems(INITIAL_ITEMS);
    this.saveWarehouses(INITIAL_WAREHOUSES);
    this.saveSuppliers(INITIAL_SUPPLIERS);
    this.savePurchaseOrders(INITIAL_PURCHASE_ORDERS);
    this.saveSales(INITIAL_SALES);
    this.saveStockMovements(INITIAL_STOCK_MOVEMENTS);
    this.saveLedgerEntries(INITIAL_LEDGER_ENTRIES);
    this.saveAuditLogs(INITIAL_AUDIT_LOGS);
  },

  exportDatabaseDump(): string {
    return JSON.stringify({
      version: '2.0.0',
      currency: 'INR (₹)',
      timestamp: new Date().toISOString(),
      items: this.getItems(),
      warehouses: this.getWarehouses(),
      suppliers: this.getSuppliers(),
      purchaseOrders: this.getPurchaseOrders(),
      sales: this.getSales(),
      stockMovements: this.getStockMovements(),
      ledgerEntries: this.getLedgerEntries(),
      auditLogs: this.getAuditLogs(),
    }, null, 2);
  }
};

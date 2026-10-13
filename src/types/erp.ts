// ============================================================================
// SmartStock ERP – Core Data Types & Models
// Currency: Indian Rupees (₹ - INR)
// ============================================================================

export type ItemCategory = 
  | 'Electrical Supplies'
  | 'Power Tools & Hardware'
  | 'Home Appliances'
  | 'Industrial Fasteners'
  | 'Safety & PPE Equipment';

export type UnitOfMeasure = 'ROLL' | 'PCS' | 'BOX' | 'SET' | 'KG';

export type ItemStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

export interface Item {
  id: string;
  sku: string;                    // Unique Natural Key (e.g. "SKU-HAVL-2.5")
  name: string;
  category: ItemCategory;
  uom: UnitOfMeasure;
  currentStock: number;           // Total on-hand quantity
  allocatedStock: number;         // Reserved for orders
  availableStock: number;         // currentStock - allocatedStock
  reorderPoint: number;           // Minimum stock threshold
  safetyStock: number;            // Min buffer
  unitCost: number;               // Purchase cost in INR (₹)
  sellingPrice: number;           // Sales list price in INR (₹)
  warehouseId: string;
  locationBin: string;            // Aisle/Bin (e.g., "BAY-04-A")
  supplierId: string;
  supplierName: string;
  status: ItemStatus;
  version: number;                // Optimistic Concurrency Control (OCC)
  updatedAt: string;              // ISO timestamp
  createdAt: string;
  description: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  capacityMax: number;
  currentOccupancy: number;
  manager: string;
  status: 'ACTIVE' | 'MAINTENANCE';
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  isActive: boolean;
  leadTimeDays: number;
  rating: number;
}

export type POStatus = 
  | 'DRAFT' 
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'ORDERED'
  | 'PARTIALLY_RECEIVED' 
  | 'RECEIVED' 
  | 'CANCELLED';

export interface POLineItem {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  orderedQty: number;
  receivedQty: number;
  unitCost: number;               // in INR (₹)
  lineTotal: number;              // in INR (₹)
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;              // "PO-2026-IN-XXXX"
  vendorId: string;
  vendorName: string;
  targetWarehouseId: string;
  status: POStatus;
  items: POLineItem[];
  subtotal: number;              // in INR (₹)
  taxAmount: number;             // in INR (₹)
  totalAmount: number;           // in INR (₹)
  issuedDate?: string;
  expectedDate: string;
  receivedDate?: string;
  paymentStatus: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID';
  version: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SaleItem {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  quantity: number;
  unitPrice: number;             // in INR (₹)
  lineTotal: number;             // in INR (₹)
}

export interface Sale {
  id: string;
  invoiceNumber: string;         // "INV-2026-XXXX"
  customerName: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;              // in INR (₹)
  taxAmount: number;             // in INR (₹)
  totalAmount: number;           // in INR (₹)
  paymentMethod: 'UPI' | 'CASH' | 'CARD' | 'NET_BANKING';
  paymentStatus: 'PAID' | 'REFUNDED';
  timestamp: string;
  createdBy: string;
}

export type StockMovementType = 
  | 'PURCHASE_RECEIPT'
  | 'SALE_ISSUE'
  | 'MANUAL_ADJUSTMENT'
  | 'INTERNAL_TRANSFER'
  | 'DAMAGE_WRITE_OFF';

export interface StockMovement {
  id: string;
  movementNumber: string;        // "SM-XXXXX"
  timestamp: string;
  movementType: StockMovementType;
  itemId: string;
  sku: string;
  itemName: string;
  warehouseId: string;
  warehouseName: string;
  quantity: number;              // Positive = Inward, Negative = Outward
  balanceBefore: number;
  balanceAfter: number;
  unitCost: number;              // in INR (₹)
  totalValue: number;            // in INR (₹)
  referenceType: 'PURCHASE_ORDER' | 'SALE_INVOICE' | 'STOCK_ADJUSTMENT';
  referenceId: string;
  reason: string;
  performedBy: string;
}

export interface StockAlert {
  id: string;
  itemId: string;
  sku: string;
  itemName: string;
  alertType: 'LOW_STOCK' | 'OUT_OF_STOCK';
  currentStock: number;
  minStockLevel: number;
  recommendedReorderQty: number;
  estimatedCostINR: number;       // in INR (₹)
  isResolved: boolean;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  entryNumber: string;           // "JRNL-XXXX"
  timestamp: string;
  sourceModule: 'INVENTORY' | 'PROCUREMENT' | 'SALES' | 'FINANCE';
  sourceRef: string;
  description: string;
  debitAccount: string;          // e.g. "1300 - Inventory Asset"
  debitAmount: number;           // in INR (₹)
  creditAccount: string;         // e.g. "2000 - Accounts Payable"
  creditAmount: number;          // in INR (₹)
  isReconciled: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  entityType: 'ITEM' | 'PURCHASE_ORDER' | 'SALE' | 'STOCK_MOVEMENT';
  entityId: string;
  action: 'CREATE' | 'UPDATE' | 'STATUS_TRANSITION' | 'OCC_CONFLICT_DETECTED' | 'STOCK_ADJUST';
  summary: string;
  user: string;
  diff?: {
    field: string;
    oldValue: any;
    newValue: any;
  }[];
}

export interface ConflictState {
  item: Item;
  clientVersion: number;
  serverVersion: number;
  conflictingFields: {
    field: keyof Item;
    clientValue: any;
    serverValue: any;
  }[];
}

export interface ERPStats {
  totalSkus: number;
  totalStockUnits: number;
  totalInventoryValuation: number; // in INR (₹)
  lowStockCount: number;
  outOfStockCount: number;
  openPurchaseOrdersCount: number;
  totalSalesToday: number;         // in INR (₹)
  activeWarehousesCount: number;
}

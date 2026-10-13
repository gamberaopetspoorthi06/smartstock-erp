import { Item, Warehouse, Supplier, PurchaseOrder, StockMovement, LedgerEntry, AuditLogEntry, Sale } from '../types/erp';

export const INITIAL_WAREHOUSES: Warehouse[] = [
  {
    id: 'wh-001',
    code: 'WH-MUMBAI-MAIN',
    name: 'Mumbai Central Automated Depot',
    location: 'Bhiwandi Logistics Hub, Mumbai, Maharashtra',
    capacityMax: 50000,
    currentOccupancy: 31200,
    manager: 'Rajesh Sharma (Logistics Head)',
    status: 'ACTIVE'
  },
  {
    id: 'wh-002',
    code: 'WH-BLR-DEPOT',
    name: 'Bengaluru South Electronics Hub',
    location: 'Electronic City Phase 1, Bengaluru, Karnataka',
    capacityMax: 20000,
    currentOccupancy: 12400,
    manager: 'Priya Patel (Depot Manager)',
    status: 'ACTIVE'
  },
  {
    id: 'wh-003',
    code: 'WH-DELHI-NCR',
    name: 'Delhi-NCR Industrial Yard',
    location: 'Udyog Vihar Phase 4, Gurugram, Haryana',
    capacityMax: 35000,
    currentOccupancy: 18500,
    manager: 'Amitabh Verma (Operations)',
    status: 'ACTIVE'
  }
];

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    code: 'SUP-HAVELLS-01',
    name: 'Havells India Electricals Ltd',
    contactPerson: 'Vikram Malhotra',
    email: 'orders@havells-supply.in',
    phone: '+91 98201 44521',
    address: 'Noida Industrial Area, Phase II, UP - 201305',
    gstin: '09AAACH2241K1ZV',
    isActive: true,
    leadTimeDays: 5,
    rating: 4.9
  },
  {
    id: 'sup-002',
    code: 'SUP-TATA-02',
    name: 'Tata Steel & Fasteners Corp',
    contactPerson: 'Anil Deshmukh',
    email: 'enterprise@tatasteel-fasteners.com',
    phone: '+91 98112 55432',
    address: 'Jamshedpur Works, Jharkhand - 831001',
    gstin: '20AAACT2727Q1ZW',
    isActive: true,
    leadTimeDays: 7,
    rating: 4.8
  },
  {
    id: 'sup-003',
    code: 'SUP-CROMPTON-03',
    name: 'Crompton Greaves Consumer Ltd',
    contactPerson: 'Sunita Rao',
    email: 'distribution@crompton-west.in',
    phone: '+91 98450 33211',
    address: 'Kanjurmarg East, Mumbai, MH - 400042',
    gstin: '27AAACC2034R1ZT',
    isActive: true,
    leadTimeDays: 4,
    rating: 4.7
  },
  {
    id: 'sup-004',
    code: 'SUP-SCHNEIDER-04',
    name: 'Schneider Electric India Pvt Ltd',
    contactPerson: 'Suresh Menon',
    email: 'b2b@se-india.com',
    phone: '+91 98765 11223',
    address: 'Whitefield Cyber Park, Bengaluru, KA - 560066',
    gstin: '29AAACS3948N1ZX',
    isActive: true,
    leadTimeDays: 6,
    rating: 4.9
  }
];

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'item-001',
    sku: 'SKU-HAVL-CABLE-2.5',
    name: 'Havells 2.5 Sq mm Copper FR Cable (90m Roll)',
    category: 'Electrical Supplies',
    uom: 'ROLL',
    currentStock: 45,
    allocatedStock: 5,
    availableStock: 40,
    reorderPoint: 20,
    safetyStock: 10,
    unitCost: 2150.00,
    sellingPrice: 2599.00,
    warehouseId: 'wh-001',
    locationBin: 'BAY-A-01',
    supplierId: 'sup-001',
    supplierName: 'Havells India Electricals Ltd',
    status: 'IN_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
    description: 'Flame retardant 100% pure electrolytic grade copper roll for home wiring.'
  },
  {
    id: 'item-002',
    sku: 'SKU-CROM-FAN-1200',
    name: 'Crompton Silent Pro 1200mm BLDC Ceiling Fan',
    category: 'Home Appliances',
    uom: 'PCS',
    currentStock: 14,
    allocatedStock: 2,
    availableStock: 12,
    reorderPoint: 15,
    safetyStock: 8,
    unitCost: 2200.00,
    sellingPrice: 2899.00,
    warehouseId: 'wh-002',
    locationBin: 'BAY-B-04',
    supplierId: 'sup-003',
    supplierName: 'Crompton Greaves Consumer Ltd',
    status: 'LOW_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 180).toISOString(),
    description: '5-star energy saving smart BLDC motor with RF remote control.'
  },
  {
    id: 'item-003',
    sku: 'SKU-TATA-BOLT-M12',
    name: 'Tata High-Tensile Hex Bolt M12 x 50mm (Pack of 50)',
    category: 'Industrial Fasteners',
    uom: 'BOX',
    currentStock: 180,
    allocatedStock: 20,
    availableStock: 160,
    reorderPoint: 50,
    safetyStock: 25,
    unitCost: 450.00,
    sellingPrice: 650.00,
    warehouseId: 'wh-003',
    locationBin: 'RACK-C-12',
    supplierId: 'sup-002',
    supplierName: 'Tata Steel & Fasteners Corp',
    status: 'IN_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 300).toISOString(),
    description: 'Grade 8.8 zinc plated corrosion resistant structural bolts.'
  },
  {
    id: 'item-004',
    sku: 'SKU-SCHN-MCB-16A',
    name: 'Schneider Acti9 16A Single Pole MCB C-Curve',
    category: 'Electrical Supplies',
    uom: 'PCS',
    currentStock: 85,
    allocatedStock: 15,
    availableStock: 70,
    reorderPoint: 30,
    safetyStock: 15,
    unitCost: 185.00,
    sellingPrice: 245.00,
    warehouseId: 'wh-001',
    locationBin: 'BAY-A-09',
    supplierId: 'sup-004',
    supplierName: 'Schneider Electric India Pvt Ltd',
    status: 'IN_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 200).toISOString(),
    description: '10kA breaking capacity miniature circuit breaker for overload protection.'
  },
  {
    id: 'item-005',
    sku: 'SKU-BAJAJ-GEYSER-25',
    name: 'Bajaj New Shakti Neo 25L Storage Water Heater',
    category: 'Home Appliances',
    uom: 'PCS',
    currentStock: 6,
    allocatedStock: 2,
    availableStock: 4,
    reorderPoint: 10,
    safetyStock: 5,
    unitCost: 6800.00,
    sellingPrice: 8499.00,
    warehouseId: 'wh-002',
    locationBin: 'BAY-B-11',
    supplierId: 'sup-003',
    supplierName: 'Crompton Greaves Consumer Ltd',
    status: 'LOW_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 150).toISOString(),
    description: 'Titanium armor technology inner tank with magnesium anode protection.'
  },
  {
    id: 'item-006',
    sku: 'SKU-BOSCH-GRIND-850',
    name: 'Bosch GWS 850W Heavy-Duty Angle Grinder 100mm',
    category: 'Power Tools & Hardware',
    uom: 'PCS',
    currentStock: 22,
    allocatedStock: 4,
    availableStock: 18,
    reorderPoint: 10,
    safetyStock: 5,
    unitCost: 2650.00,
    sellingPrice: 3250.00,
    warehouseId: 'wh-001',
    locationBin: 'TOOL-T-02',
    supplierId: 'sup-002',
    supplierName: 'Tata Steel & Fasteners Corp',
    status: 'IN_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    description: 'Compact ergonomic metal and concrete cutting power tool with safety guard.'
  },
  {
    id: 'item-007',
    sku: 'SKU-SAFE-HELMET-ISI',
    name: 'Karam ISI Certified Industrial Safety Helmet Ratchet',
    category: 'Safety & PPE Equipment',
    uom: 'PCS',
    currentStock: 0,
    allocatedStock: 0,
    availableStock: 0,
    reorderPoint: 25,
    safetyStock: 15,
    unitCost: 220.00,
    sellingPrice: 360.00,
    warehouseId: 'wh-003',
    locationBin: 'SAFE-S-01',
    supplierId: 'sup-002',
    supplierName: 'Tata Steel & Fasteners Corp',
    status: 'OUT_OF_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 90).toISOString(),
    description: 'High-density polyethylene shell with 6-point textile ratchet suspension.'
  },
  {
    id: 'item-008',
    sku: 'SKU-ANCHOR-SW-6A',
    name: 'Anchor Roma Classic 1-Way Modular Switch 6A (Box of 20)',
    category: 'Electrical Supplies',
    uom: 'BOX',
    currentStock: 110,
    allocatedStock: 10,
    availableStock: 100,
    reorderPoint: 40,
    safetyStock: 20,
    unitCost: 420.00,
    sellingPrice: 580.00,
    warehouseId: 'wh-001',
    locationBin: 'BAY-A-15',
    supplierId: 'sup-001',
    supplierName: 'Havells India Electricals Ltd',
    status: 'IN_STOCK',
    version: 1,
    updatedAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
    description: 'Sleek polycarbonate spark-shielded rocker switches for home interior.'
  }
];

export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-101',
    poNumber: 'PO-2026-IN-0101',
    vendorId: 'sup-001',
    vendorName: 'Havells India Electricals Ltd',
    targetWarehouseId: 'wh-001',
    status: 'RECEIVED',
    items: [
      {
        id: 'poli-101-1',
        itemId: 'item-001',
        sku: 'SKU-HAVL-CABLE-2.5',
        itemName: 'Havells 2.5 Sq mm Copper FR Cable (90m Roll)',
        orderedQty: 20,
        receivedQty: 20,
        unitCost: 2150.00,
        lineTotal: 43000.00
      }
    ],
    subtotal: 43000.00,
    taxAmount: 7740.00,
    totalAmount: 50740.00,
    issuedDate: new Date(Date.now() - 3600000 * 96).toISOString(),
    expectedDate: new Date(Date.now() - 3600000 * 24).toISOString(),
    receivedDate: new Date(Date.now() - 3600000 * 12).toISOString(),
    paymentStatus: 'PAID',
    version: 2,
    notes: 'Inward delivery verified at Mumbai Central Depot. GST invoice attached.',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: 'po-102',
    poNumber: 'PO-2026-IN-0102',
    vendorId: 'sup-003',
    vendorName: 'Crompton Greaves Consumer Ltd',
    targetWarehouseId: 'wh-002',
    status: 'APPROVED',
    items: [
      {
        id: 'poli-102-1',
        itemId: 'item-002',
        sku: 'SKU-CROM-FAN-1200',
        itemName: 'Crompton Silent Pro 1200mm BLDC Ceiling Fan',
        orderedQty: 25,
        receivedQty: 0,
        unitCost: 2200.00,
        lineTotal: 55000.00
      },
      {
        id: 'poli-102-2',
        itemId: 'item-005',
        sku: 'SKU-BAJAJ-GEYSER-25',
        itemName: 'Bajaj New Shakti Neo 25L Storage Water Heater',
        orderedQty: 8,
        receivedQty: 0,
        unitCost: 6800.00,
        lineTotal: 54400.00
      }
    ],
    subtotal: 109400.00,
    taxAmount: 19692.00,
    totalAmount: 129092.00,
    issuedDate: new Date(Date.now() - 3600000 * 20).toISOString(),
    expectedDate: new Date(Date.now() + 3600000 * 72).toISOString(),
    paymentStatus: 'UNPAID',
    version: 1,
    notes: 'Restock order for seasonal cooling and water heating inventory.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'po-103',
    poNumber: 'PO-2026-IN-0103',
    vendorId: 'sup-002',
    vendorName: 'Tata Steel & Fasteners Corp',
    targetWarehouseId: 'wh-003',
    status: 'DRAFT',
    items: [
      {
        id: 'poli-103-1',
        itemId: 'item-007',
        sku: 'SKU-SAFE-HELMET-ISI',
        itemName: 'Karam ISI Certified Industrial Safety Helmet Ratchet',
        orderedQty: 50,
        receivedQty: 0,
        unitCost: 220.00,
        lineTotal: 11000.00
      }
    ],
    subtotal: 11000.00,
    taxAmount: 1980.00,
    totalAmount: 12980.00,
    expectedDate: new Date(Date.now() + 3600000 * 160).toISOString(),
    paymentStatus: 'UNPAID',
    version: 1,
    notes: 'Urgent requisition to replenish depleted safety helmet stock.',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export const INITIAL_SALES: Sale[] = [
  {
    id: 'sale-001',
    invoiceNumber: 'INV-2026-0891',
    customerName: 'Shree Balaji Electrical Contractors',
    customerPhone: '+91 98210 99881',
    items: [
      {
        id: 'si-001-1',
        itemId: 'item-001',
        sku: 'SKU-HAVL-CABLE-2.5',
        itemName: 'Havells 2.5 Sq mm Copper FR Cable (90m Roll)',
        quantity: 5,
        unitPrice: 2599.00,
        lineTotal: 12995.00
      },
      {
        id: 'si-001-2',
        itemId: 'item-004',
        sku: 'SKU-SCHN-MCB-16A',
        itemName: 'Schneider Acti9 16A Single Pole MCB C-Curve',
        quantity: 10,
        unitPrice: 245.00,
        lineTotal: 2450.00
      }
    ],
    subtotal: 15445.00,
    taxAmount: 2780.10,
    totalAmount: 18225.10,
    paymentMethod: 'UPI',
    paymentStatus: 'PAID',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    createdBy: 'Priya Patel'
  },
  {
    id: 'sale-002',
    invoiceNumber: 'INV-2026-0892',
    customerName: 'Patel Engineering & Fabricators',
    customerPhone: '+91 98451 12345',
    items: [
      {
        id: 'si-002-1',
        itemId: 'item-006',
        sku: 'SKU-BOSCH-GRIND-850',
        itemName: 'Bosch GWS 850W Heavy-Duty Angle Grinder 100mm',
        quantity: 2,
        unitPrice: 3250.00,
        lineTotal: 6500.00
      }
    ],
    subtotal: 6500.00,
    taxAmount: 1170.00,
    totalAmount: 7670.00,
    paymentMethod: 'CARD',
    paymentStatus: 'PAID',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    createdBy: 'Priya Patel'
  }
];

export const INITIAL_STOCK_MOVEMENTS: StockMovement[] = [
  {
    id: 'sm-901',
    movementNumber: 'SM-2026-0811',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    movementType: 'PURCHASE_RECEIPT',
    itemId: 'item-001',
    sku: 'SKU-HAVL-CABLE-2.5',
    itemName: 'Havells 2.5 Sq mm Copper FR Cable (90m Roll)',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Automated Depot',
    quantity: 20,
    balanceBefore: 25,
    balanceAfter: 45,
    unitCost: 2150.00,
    totalValue: 43000.00,
    referenceType: 'PURCHASE_ORDER',
    referenceId: 'PO-2026-IN-0101',
    reason: 'Goods Receipt Note (GRN) inward delivery verified against Havells tax invoice',
    performedBy: 'Priya Patel'
  },
  {
    id: 'sm-902',
    movementNumber: 'SM-2026-0812',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    movementType: 'SALE_ISSUE',
    itemId: 'item-001',
    sku: 'SKU-HAVL-CABLE-2.5',
    itemName: 'Havells 2.5 Sq mm Copper FR Cable (90m Roll)',
    warehouseId: 'wh-001',
    warehouseName: 'Mumbai Central Automated Depot',
    quantity: -5,
    balanceBefore: 50,
    balanceAfter: 45,
    unitCost: 2150.00,
    totalValue: 10750.00,
    referenceType: 'SALE_INVOICE',
    referenceId: 'INV-2026-0891',
    reason: 'Sales dispatch to client Shree Balaji Electricals',
    performedBy: 'Priya Patel'
  }
];

export const INITIAL_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'jrnl-701',
    entryNumber: 'JRNL-2026-0312',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    sourceModule: 'PROCUREMENT',
    sourceRef: 'PO-2026-IN-0101',
    description: 'Inventory Receipt - 20x SKU-HAVL-CABLE-2.5 via Havells India',
    debitAccount: '1300 - Inventory Asset',
    debitAmount: 50740.00,
    creditAccount: '2000 - Accounts Payable',
    creditAmount: 50740.00,
    isReconciled: true
  },
  {
    id: 'jrnl-702',
    entryNumber: 'JRNL-2026-0313',
    timestamp: new Date(Date.now() - 3600000 * 11).toISOString(),
    sourceModule: 'FINANCE',
    sourceRef: 'PAY-PO-0101',
    description: 'NEFT Payment Cleared - Havells India (PO-2026-IN-0101)',
    debitAccount: '2000 - Accounts Payable',
    debitAmount: 50740.00,
    creditAccount: '1010 - Operating Current Account (SBI)',
    creditAmount: 50740.00,
    isReconciled: true
  },
  {
    id: 'jrnl-703',
    entryNumber: 'JRNL-2026-0314',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    sourceModule: 'SALES',
    sourceRef: 'INV-2026-0891',
    description: 'Retail Sale Billing - Shree Balaji Electrical Contractors',
    debitAccount: '1020 - UPI Collection Account',
    debitAmount: 18225.10,
    creditAccount: '4000 - Sales Revenue',
    creditAmount: 18225.10,
    isReconciled: true
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
    entityType: 'PURCHASE_ORDER',
    entityId: 'po-101',
    action: 'STATUS_TRANSITION',
    summary: 'PO-2026-IN-0101 received in full. Stock incremented by +20 rolls.',
    user: 'Priya Patel',
    diff: [
      { field: 'status', oldValue: 'ORDERED', newValue: 'RECEIVED' },
      { field: 'receivedQty', oldValue: 0, newValue: 20 }
    ]
  },
  {
    id: 'aud-002',
    timestamp: new Date(Date.now() - 3600000 * 8).toISOString(),
    entityType: 'SALE',
    entityId: 'sale-001',
    action: 'CREATE',
    summary: 'Generated Tax Invoice INV-2026-0891 for ₹18,225.10. Dispatched from Mumbai Depot.',
    user: 'Priya Patel'
  }
];

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import { 
  Item, Warehouse, Supplier, PurchaseOrder, StockMovement, 
  LedgerEntry, AuditLogEntry, ERPStats, ConflictState, ItemStatus, Sale, StockAlert
} from '../types/erp';
import { storageService } from '../services/storageService';

export type ERPView = 
  | 'DASHBOARD'
  | 'PRODUCTS'
  | 'INVENTORY' 
  | 'SUPPLIERS'
  | 'PURCHASE_ORDERS' 
  | 'SALES'
  | 'LOW_STOCK_ALERTS'
  | 'FORECAST'
  | 'REPORTS';


interface ERPContextType {
  // State
  items: Item[];
  warehouses: Warehouse[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  sales: Sale[];
  stockMovements: StockMovement[];
  ledgerEntries: LedgerEntry[];
  auditLogs: AuditLogEntry[];
  stats: ERPStats;
  stockAlerts: StockAlert[];
  activeView: ERPView;
  isLoading: boolean;
  simulatedLatency: number;
  simulatedStaleMode: boolean;
  conflictState: ConflictState | null;

  // Navigation & Settings
  setActiveView: (view: ERPView) => void;
  setSimulatedLatency: (ms: number) => void;
  setSimulatedStaleMode: (enabled: boolean) => void;
  triggerBackgroundEditForItem: (itemId: string) => void;
  resolveConflict: (resolution: 'KEEP_SERVER' | 'FORCE_OVERWRITE') => void;
  dismissConflict: () => void;
  refreshData: () => Promise<void>;
  resetToSeedData: () => void;

  // Product Operations (Module 3)
  createItem: (item: Omit<Item, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'availableStock' | 'status'>) => Promise<boolean>;
  updateItem: (item: Item) => Promise<{ success: boolean; conflict?: boolean }>;
  adjustStock: (itemId: string, deltaQty: number, reason: string, performedBy?: string) => Promise<boolean>;
  deleteItem: (itemId: string) => Promise<boolean>;

  // Supplier Operations (Module 5)
  createSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<boolean>;
  updateSupplier: (supplier: Supplier) => Promise<boolean>;
  deleteSupplier: (supplierId: string) => Promise<boolean>;

  // Purchase Order Operations (Module 6)
  createPurchaseOrder: (po: Omit<PurchaseOrder, 'id' | 'poNumber' | 'version' | 'createdAt' | 'updatedAt' | 'subtotal' | 'taxAmount' | 'totalAmount' | 'paymentStatus'>) => Promise<boolean>;
  approvePurchaseOrder: (poId: string) => Promise<boolean>;
  receivePurchaseOrder: (poId: string) => Promise<boolean>;
  payPurchaseOrder: (poId: string) => Promise<boolean>;

  // Sales Operations (Module 7)
  recordSale: (saleData: {
    customerName: string;
    customerPhone?: string;
    paymentMethod: 'UPI' | 'CASH' | 'CARD' | 'NET_BANKING';
    items: { itemId: string; quantity: number }[];
    performedBy?: string;
  }) => Promise<{ success: boolean; errorMessage?: string }>;

  // AI Chatbot
  isChatOpen: boolean;
  openChatbot: () => void;
  closeChatbot: () => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  const [activeView, setActiveView] = useState<ERPView>('DASHBOARD');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [simulatedLatency, setSimulatedLatency] = useState<number>(200);
  const [simulatedStaleMode, setSimulatedStaleMode] = useState<boolean>(false);
  const [conflictState, setConflictState] = useState<ConflictState | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const openChatbot = () => setIsChatOpen(true);
  const closeChatbot = () => setIsChatOpen(false);

  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const computeItemStatus = (current: number, reorder: number): ItemStatus => {
    if (current <= 0) return 'OUT_OF_STOCK';
    if (current <= reorder) return 'LOW_STOCK';
    return 'IN_STOCK';
  };

  const loadAllData = async (latencyMs = simulatedLatency) => {
    setIsLoading(true);
    if (latencyMs > 0) await delay(latencyMs);

    setItems(storageService.getItems());
    setWarehouses(storageService.getWarehouses());
    setSuppliers(storageService.getSuppliers());
    setPurchaseOrders(storageService.getPurchaseOrders());
    setSales(storageService.getSales());
    setStockMovements(storageService.getStockMovements());
    setLedgerEntries(storageService.getLedgerEntries());
    setAuditLogs(storageService.getAuditLogs());
    setIsLoading(false);
  };

  useEffect(() => {
    loadAllData(simulatedLatency);
  }, []);

  const refreshData = async () => {
    await loadAllData(simulatedLatency);
  };

  const resetToSeedData = () => {
    storageService.resetDatabaseToSeed();
    loadAllData(150);
  };

  // Memoized ERP Statistics (All currency in INR ₹)
  const stats: ERPStats = useMemo(() => {
    const totalSkus = items.length;
    const totalStockUnits = items.reduce((sum, it) => sum + it.currentStock, 0);
    const totalInventoryValuation = items.reduce((sum, it) => sum + (it.currentStock * it.unitCost), 0);
    const lowStockCount = items.filter(it => it.currentStock > 0 && it.currentStock <= it.reorderPoint).length;
    const outOfStockCount = items.filter(it => it.currentStock <= 0).length;
    const openPurchaseOrdersCount = purchaseOrders.filter(po => po.status !== 'RECEIVED' && po.status !== 'CANCELLED').length;
    const totalSalesToday = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const activeWarehousesCount = warehouses.filter(w => w.status === 'ACTIVE').length;

    return {
      totalSkus,
      totalStockUnits,
      totalInventoryValuation,
      lowStockCount,
      outOfStockCount,
      openPurchaseOrdersCount,
      totalSalesToday,
      activeWarehousesCount
    };
  }, [items, purchaseOrders, sales, warehouses]);

  // Dynamic Low Stock Alerts (Module 8)
  const stockAlerts: StockAlert[] = useMemo(() => {
    return items
      .filter(i => i.currentStock <= i.reorderPoint)
      .map(i => {
        const needed = Math.max(10, (i.reorderPoint * 2) - i.currentStock);
        return {
          id: `alert-${i.id}`,
          itemId: i.id,
          sku: i.sku,
          itemName: i.name,
          alertType: i.currentStock <= 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK',
          currentStock: i.currentStock,
          minStockLevel: i.reorderPoint,
          recommendedReorderQty: needed,
          estimatedCostINR: needed * i.unitCost,
          isResolved: false,
          createdAt: i.updatedAt
        };
      });
  }, [items]);

  const recordAudit = (
    entityType: AuditLogEntry['entityType'],
    entityId: string,
    action: AuditLogEntry['action'],
    summary: string,
    user: string = 'Current User (Session)',
    diff?: AuditLogEntry['diff']
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      entityType,
      entityId,
      action,
      summary,
      user,
      diff
    };
    const updated = [newEntry, ...auditLogs];
    setAuditLogs(updated);
    storageService.saveAuditLogs(updated);
  };

  // OCC Simulator
  const triggerBackgroundEditForItem = (itemId: string) => {
    const currentList = storageService.getItems();
    const target = currentList.find(i => i.id === itemId);
    if (!target) return;

    const updatedTarget: Item = {
      ...target,
      currentStock: target.currentStock + 5,
      version: target.version + 1,
      updatedAt: new Date().toISOString(),
      description: `${target.description} [Modified in Background]`
    };

    const nextList = currentList.map(i => i.id === itemId ? updatedTarget : i);
    storageService.saveItems(nextList);
    setItems(nextList);

    recordAudit('ITEM', itemId, 'OCC_CONFLICT_DETECTED', `Background task updated ${target.sku} to Version ${updatedTarget.version}`, 'Concurrent Simulation');
  };

  const resolveConflict = (resolution: 'KEEP_SERVER' | 'FORCE_OVERWRITE') => {
    if (!conflictState) return;
    const { item, serverVersion } = conflictState;

    if (resolution === 'FORCE_OVERWRITE') {
      const nextItem: Item = {
        ...item,
        version: serverVersion + 1,
        updatedAt: new Date().toISOString()
      };
      const updatedList = items.map(i => i.id === nextItem.id ? nextItem : i);
      setItems(updatedList);
      storageService.saveItems(updatedList);
      recordAudit('ITEM', nextItem.id, 'UPDATE', `User resolved OCC conflict on ${nextItem.sku} -> Version ${nextItem.version}`, 'Admin');
    }
    setConflictState(null);
  };

  const dismissConflict = () => setConflictState(null);

  // --------------------------------------------------------------------------
  // Product Operations (Module 3)
  // --------------------------------------------------------------------------
  const createItem = async (
    itemData: Omit<Item, 'id' | 'version' | 'createdAt' | 'updatedAt' | 'availableStock' | 'status'>
  ): Promise<boolean> => {
    if (simulatedLatency > 0) await delay(simulatedLatency);

    // Prevent duplicate SKUs
    if (items.some(i => i.sku.toUpperCase() === itemData.sku.toUpperCase())) {
      alert(`SKU "${itemData.sku}" already exists. Please choose a unique SKU code.`);
      return false;
    }

    const now = new Date().toISOString();
    const available = Math.max(0, itemData.currentStock - itemData.allocatedStock);
    const status = computeItemStatus(itemData.currentStock, itemData.reorderPoint);

    const newItem: Item = {
      ...itemData,
      id: `item-${Date.now().toString(36)}`,
      sku: itemData.sku.toUpperCase(),
      availableStock: available,
      status,
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    const nextItems = [newItem, ...items];
    setItems(nextItems);
    storageService.saveItems(nextItems);
    recordAudit('ITEM', newItem.id, 'CREATE', `Added product ${newItem.sku} (${newItem.name}) with opening stock ${newItem.currentStock}`);
    return true;
  };

  const updateItem = async (incomingItem: Item): Promise<{ success: boolean; conflict?: boolean }> => {
    if (simulatedLatency > 0) await delay(simulatedLatency);

    const freshList = storageService.getItems();
    const freshItem = freshList.find(i => i.id === incomingItem.id);
    if (!freshItem) return { success: false };

    if (simulatedStaleMode || (freshItem.version !== incomingItem.version)) {
      const conflictingFields: ConflictState['conflictingFields'] = [];
      const keys: (keyof Item)[] = ['name', 'currentStock', 'unitCost', 'sellingPrice', 'reorderPoint', 'description'];
      keys.forEach(k => {
        if (incomingItem[k] !== freshItem[k]) {
          conflictingFields.push({ field: k, clientValue: incomingItem[k], serverValue: freshItem[k] });
        }
      });

      setConflictState({
        item: incomingItem,
        clientVersion: incomingItem.version,
        serverVersion: freshItem.version,
        conflictingFields
      });
      return { success: false, conflict: true };
    }

    const now = new Date().toISOString();
    const available = Math.max(0, incomingItem.currentStock - incomingItem.allocatedStock);
    const status = computeItemStatus(incomingItem.currentStock, incomingItem.reorderPoint);

    const updatedItem: Item = {
      ...incomingItem,
      availableStock: available,
      status,
      version: freshItem.version + 1,
      updatedAt: now
    };

    const nextItems = freshList.map(i => i.id === updatedItem.id ? updatedItem : i);
    setItems(nextItems);
    storageService.saveItems(nextItems);
    recordAudit('ITEM', updatedItem.id, 'UPDATE', `Updated product details for ${updatedItem.sku}`);
    return { success: true };
  };

  const adjustStock = async (
    itemId: string, 
    deltaQty: number, 
    reason: string, 
    performedBy: string = 'Inventory Specialist'
  ): Promise<boolean> => {
    if (simulatedLatency > 0) await delay(simulatedLatency);

    const target = items.find(i => i.id === itemId);
    if (!target) return false;

    // Prevent negative stock
    if (target.currentStock + deltaQty < 0) {
      alert(`Cannot reduce stock below zero. Current stock is ${target.currentStock}.`);
      return false;
    }

    const newStock = target.currentStock + deltaQty;
    const oldStock = target.currentStock;
    const totalValAdjustment = Math.abs(deltaQty) * target.unitCost;
    const now = new Date().toISOString();

    const updatedItem: Item = {
      ...target,
      currentStock: newStock,
      availableStock: Math.max(0, newStock - target.allocatedStock),
      status: computeItemStatus(newStock, target.reorderPoint),
      version: target.version + 1,
      updatedAt: now
    };

    const nextItems = items.map(i => i.id === itemId ? updatedItem : i);
    setItems(nextItems);
    storageService.saveItems(nextItems);

    // Record Stock Movement
    const movementNumber = `SM-${Date.now().toString().slice(-6)}`;
    const newMovement: StockMovement = {
      id: `sm-${Date.now().toString(36)}`,
      movementNumber,
      timestamp: now,
      movementType: deltaQty > 0 ? 'MANUAL_ADJUSTMENT' : 'DAMAGE_WRITE_OFF',
      itemId: target.id,
      sku: target.sku,
      itemName: target.name,
      warehouseId: target.warehouseId,
      warehouseName: warehouses.find(w => w.id === target.warehouseId)?.name || 'Central Hub',
      quantity: deltaQty,
      balanceBefore: oldStock,
      balanceAfter: newStock,
      unitCost: target.unitCost,
      totalValue: totalValAdjustment,
      referenceType: 'STOCK_ADJUSTMENT',
      referenceId: movementNumber,
      reason,
      performedBy
    };

    const nextMovements = [newMovement, ...stockMovements];
    setStockMovements(nextMovements);
    storageService.saveStockMovements(nextMovements);

    recordAudit('STOCK_MOVEMENT', newMovement.id, 'STOCK_ADJUST', `Manual stock adjustment of ${deltaQty > 0 ? '+' : ''}${deltaQty} on ${target.sku}. Reason: ${reason}`);
    return true;
  };

  const deleteItem = async (itemId: string): Promise<boolean> => {
    if (simulatedLatency > 0) await delay(simulatedLatency);
    const target = items.find(i => i.id === itemId);
    if (!target) return false;

    const nextItems = items.filter(i => i.id !== itemId);
    setItems(nextItems);
    storageService.saveItems(nextItems);
    recordAudit('ITEM', itemId, 'UPDATE', `Deactivated/Removed product ${target.sku}`);
    return true;
  };

  // --------------------------------------------------------------------------
  // Supplier Operations (Module 5)
  // --------------------------------------------------------------------------
  const createSupplier = async (supplierData: Omit<Supplier, 'id'>): Promise<boolean> => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: `sup-${Date.now().toString(36)}`
    };
    const nextList = [newSupplier, ...suppliers];
    setSuppliers(nextList);
    storageService.saveSuppliers(nextList);
    return true;
  };

  const updateSupplier = async (supplierData: Supplier): Promise<boolean> => {
    const nextList = suppliers.map(s => s.id === supplierData.id ? supplierData : s);
    setSuppliers(nextList);
    storageService.saveSuppliers(nextList);
    return true;
  };

  const deleteSupplier = async (supplierId: string): Promise<boolean> => {
    const nextList = suppliers.filter(s => s.id !== supplierId);
    setSuppliers(nextList);
    storageService.saveSuppliers(nextList);
    return true;
  };

  // --------------------------------------------------------------------------
  // Purchase Order Operations (Module 6)
  // --------------------------------------------------------------------------
  const createPurchaseOrder = async (
    poData: Omit<PurchaseOrder, 'id' | 'poNumber' | 'version' | 'createdAt' | 'updatedAt' | 'subtotal' | 'taxAmount' | 'totalAmount' | 'paymentStatus'>
  ): Promise<boolean> => {
    if (simulatedLatency > 0) await delay(simulatedLatency);

    const subtotal = poData.items.reduce((sum, item) => sum + (item.orderedQty * item.unitCost), 0);
    const taxAmount = subtotal * 0.18; // Standard 18% GST in India
    const totalAmount = subtotal + taxAmount;
    const now = new Date().toISOString();
    const poNumber = `PO-${new Date().getFullYear()}-IN-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPO: PurchaseOrder = {
      ...poData,
      id: `po-${Date.now().toString(36)}`,
      poNumber,
      subtotal,
      taxAmount,
      totalAmount,
      paymentStatus: 'UNPAID',
      version: 1,
      createdAt: now,
      updatedAt: now
    };

    const nextPOs = [newPO, ...purchaseOrders];
    setPurchaseOrders(nextPOs);
    storageService.savePurchaseOrders(nextPOs);
    recordAudit('PURCHASE_ORDER', newPO.id, 'CREATE', `Created Purchase Order ${poNumber} for ₹${totalAmount.toFixed(2)}`);
    return true;
  };

  const approvePurchaseOrder = async (poId: string): Promise<boolean> => {
    const target = purchaseOrders.find(p => p.id === poId);
    if (!target) return false;

    const updatedPO: PurchaseOrder = {
      ...target,
      status: 'APPROVED',
      updatedAt: new Date().toISOString(),
      version: target.version + 1
    };

    const nextPOs = purchaseOrders.map(p => p.id === poId ? updatedPO : p);
    setPurchaseOrders(nextPOs);
    storageService.savePurchaseOrders(nextPOs);
    recordAudit('PURCHASE_ORDER', poId, 'STATUS_TRANSITION', `Approved Purchase Order ${target.poNumber}`);
    return true;
  };

  const receivePurchaseOrder = async (poId: string): Promise<boolean> => {
    if (simulatedLatency > 0) await delay(simulatedLatency);

    const freshPOs = storageService.getPurchaseOrders();
    const target = freshPOs.find(p => p.id === poId);
    if (!target || target.status === 'RECEIVED') {
      alert("This purchase order has already been received or does not exist.");
      return false;
    }

    const now = new Date().toISOString();
    const freshItems = storageService.getItems();
    const newMovements: StockMovement[] = [];

    // Increment inventory and record inward movement
    target.items.forEach(line => {
      const masterItem = freshItems.find(i => i.id === line.itemId);
      if (masterItem) {
        const newStock = masterItem.currentStock + line.orderedQty;
        masterItem.currentStock = newStock;
        masterItem.availableStock = Math.max(0, newStock - masterItem.allocatedStock);
        masterItem.status = computeItemStatus(newStock, masterItem.reorderPoint);
        masterItem.version += 1;
        masterItem.updatedAt = now;

        newMovements.push({
          id: `sm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
          movementNumber: `GRN-${Date.now().toString().slice(-6)}`,
          timestamp: now,
          movementType: 'PURCHASE_RECEIPT',
          itemId: masterItem.id,
          sku: masterItem.sku,
          itemName: masterItem.name,
          warehouseId: target.targetWarehouseId,
          warehouseName: warehouses.find(w => w.id === target.targetWarehouseId)?.name || 'Central Hub',
          quantity: line.orderedQty,
          balanceBefore: newStock - line.orderedQty,
          balanceAfter: newStock,
          unitCost: line.unitCost,
          totalValue: line.orderedQty * line.unitCost,
          referenceType: 'PURCHASE_ORDER',
          referenceId: target.poNumber,
          reason: `Goods Receipt Note (GRN) under ${target.poNumber}`,
          performedBy: 'Receiving Dock Supervisor'
        });
      }
    });

    const updatedPO: PurchaseOrder = {
      ...target,
      status: 'RECEIVED',
      receivedDate: now,
      updatedAt: now,
      version: target.version + 1
    };

    const nextPOs = freshPOs.map(p => p.id === poId ? updatedPO : p);
    setPurchaseOrders(nextPOs);
    storageService.savePurchaseOrders(nextPOs);

    setItems([...freshItems]);
    storageService.saveItems(freshItems);

    const nextMovements = [...newMovements, ...stockMovements];
    setStockMovements(nextMovements);
    storageService.saveStockMovements(nextMovements);

    recordAudit('PURCHASE_ORDER', poId, 'STATUS_TRANSITION', `PO ${target.poNumber} received. Stock incremented for ${target.items.length} items.`);

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}

    return true;
  };

  const payPurchaseOrder = async (poId: string): Promise<boolean> => {
    const target = purchaseOrders.find(p => p.id === poId);
    if (!target) return false;

    const updatedPO: PurchaseOrder = {
      ...target,
      paymentStatus: 'PAID',
      updatedAt: new Date().toISOString()
    };

    const nextPOs = purchaseOrders.map(p => p.id === poId ? updatedPO : p);
    setPurchaseOrders(nextPOs);
    storageService.savePurchaseOrders(nextPOs);
    return true;
  };

  // --------------------------------------------------------------------------
  // Sales Operations (Module 7)
  // --------------------------------------------------------------------------
  const recordSale = async (saleData: {
    customerName: string;
    customerPhone?: string;
    paymentMethod: 'UPI' | 'CASH' | 'CARD' | 'NET_BANKING';
    items: { itemId: string; quantity: number }[];
    performedBy?: string;
  }): Promise<{ success: boolean; errorMessage?: string }> => {
    if (simulatedLatency > 0) await delay(simulatedLatency);

    const freshItems = storageService.getItems();

    // 1. Validate Stock Sufficiency (Prevent Negative Inventory)
    for (const line of saleData.items) {
      const item = freshItems.find(i => i.id === line.itemId);
      if (!item) {
        return { success: false, errorMessage: `Product not found in catalog.` };
      }
      if (item.currentStock < line.quantity) {
        return { 
          success: false, 
          errorMessage: `Insufficient stock for ${item.name} (${item.sku}). Available: ${item.currentStock}, Requested: ${line.quantity}` 
        };
      }
    }

    const now = new Date().toISOString();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newMovements: StockMovement[] = [];
    let subtotal = 0;

    const saleItems = saleData.items.map(line => {
      const item = freshItems.find(i => i.id === line.itemId)!;
      const lineTotal = line.quantity * item.sellingPrice;
      subtotal += lineTotal;

      // Decrement stock
      const oldStock = item.currentStock;
      const newStock = oldStock - line.quantity;
      item.currentStock = newStock;
      item.availableStock = Math.max(0, newStock - item.allocatedStock);
      item.status = computeItemStatus(newStock, item.reorderPoint);
      item.version += 1;
      item.updatedAt = now;

      // Log movement
      newMovements.push({
        id: `sm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        movementNumber: `DISPATCH-${Date.now().toString().slice(-6)}`,
        timestamp: now,
        movementType: 'SALE_ISSUE',
        itemId: item.id,
        sku: item.sku,
        itemName: item.name,
        warehouseId: item.warehouseId,
        warehouseName: warehouses.find(w => w.id === item.warehouseId)?.name || 'Central Hub',
        quantity: -line.quantity,
        balanceBefore: oldStock,
        balanceAfter: newStock,
        unitCost: item.unitCost,
        totalValue: line.quantity * item.unitCost,
        referenceType: 'SALE_INVOICE',
        referenceId: invoiceNumber,
        reason: `Retail customer billing to ${saleData.customerName}`,
        performedBy: saleData.performedBy || 'Billing Executive'
      });

      return {
        id: `si-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        itemId: item.id,
        sku: item.sku,
        itemName: item.name,
        quantity: line.quantity,
        unitPrice: item.sellingPrice,
        lineTotal
      };
    });

    const taxAmount = subtotal * 0.18; // 18% GST
    const totalAmount = subtotal + taxAmount;

    const newSale: Sale = {
      id: `sale-${Date.now().toString(36)}`,
      invoiceNumber,
      customerName: saleData.customerName,
      customerPhone: saleData.customerPhone,
      items: saleItems,
      subtotal,
      taxAmount,
      totalAmount,
      paymentMethod: saleData.paymentMethod,
      paymentStatus: 'PAID',
      timestamp: now,
      createdBy: saleData.performedBy || 'Staff'
    };

    // Update state & persistence
    const nextSales = [newSale, ...sales];
    setSales(nextSales);
    storageService.saveSales(nextSales);

    setItems([...freshItems]);
    storageService.saveItems(freshItems);

    const nextMovements = [...newMovements, ...stockMovements];
    setStockMovements(nextMovements);
    storageService.saveStockMovements(nextMovements);

    recordAudit('SALE', newSale.id, 'CREATE', `Billed Invoice ${invoiceNumber} for ₹${totalAmount.toFixed(2)} (${saleData.paymentMethod})`);

    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
    } catch {}

    return { success: true };
  };

  return (
    <ERPContext.Provider
      value={{
        items,
        warehouses,
        suppliers,
        purchaseOrders,
        sales,
        stockMovements,
        ledgerEntries,
        auditLogs,
        stats,
        stockAlerts,
        activeView,
        isLoading,
        simulatedLatency,
        simulatedStaleMode,
        conflictState,
        setActiveView,
        setSimulatedLatency,
        setSimulatedStaleMode,
        triggerBackgroundEditForItem,
        resolveConflict,
        dismissConflict,
        refreshData,
        resetToSeedData,
        createItem,
        updateItem,
        adjustStock,
        deleteItem,
        createSupplier,
        updateSupplier,
        deleteSupplier,
        createPurchaseOrder,
        approvePurchaseOrder,
        receivePurchaseOrder,
        payPurchaseOrder,
        recordSale,
        isChatOpen,
        openChatbot,
        closeChatbot
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = (): ERPContextType => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};

import React, { useMemo } from 'react';
import { 
  BarChart3, Download, IndianRupee, Package, 
  Receipt, ShoppingCart, ArrowLeftRight, FileSpreadsheet, 
  Warehouse, CheckCircle2 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ReportsView: React.FC = () => {
  const { items, stats, stockMovements, sales, purchaseOrders, warehouses } = useERP();

  // Category Breakdown
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { category: string; count: number; units: number; valuation: number }>();

    items.forEach(item => {
      const cat = item.category || 'Other';
      const prev = map.get(cat) || { category: cat, count: 0, units: 0, valuation: 0 };
      map.set(cat, {
        category: cat,
        count: prev.count + 1,
        units: prev.units + item.currentStock,
        valuation: prev.valuation + (item.currentStock * item.unitCost)
      });
    });

    return Array.from(map.values()).sort((a, b) => b.valuation - a.valuation);
  }, [items]);

  // CSV Exporters
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportProductsCSV = () => {
    const headers = ['ID', 'SKU', 'Name', 'Category', 'UOM', 'Current Stock', 'Safety Min', 'Unit Cost (INR)', 'Selling Price (INR)', 'Total Valuation (INR)', 'Bin Location', 'Status'];
    const rows = items.map(i => [
      i.id,
      i.sku,
      `"${i.name.replace(/"/g, '""')}"`,
      `"${i.category}"`,
      i.uom,
      i.currentStock,
      i.reorderPoint,
      i.unitCost,
      i.sellingPrice,
      (i.currentStock * i.unitCost).toFixed(2),
      i.locationBin,
      i.status
    ]);
    downloadCSV(`smartstock_products_report_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const exportMovementsCSV = () => {
    const headers = ['Movement #', 'Timestamp', 'Type', 'SKU', 'Name', 'Warehouse', 'Quantity', 'Balance Before', 'Balance After', 'Total Value (INR)', 'Reference', 'Performed By'];
    const rows = stockMovements.map(m => [
      m.movementNumber,
      m.timestamp,
      m.movementType,
      m.sku,
      `"${m.itemName.replace(/"/g, '""')}"`,
      m.warehouseName,
      m.quantity,
      m.balanceBefore,
      m.balanceAfter,
      m.totalValue,
      m.referenceId,
      m.performedBy
    ]);
    downloadCSV(`smartstock_ledger_movements_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const exportSalesCSV = () => {
    const headers = ['Invoice #', 'Timestamp', 'Customer Name', 'Phone', 'Payment Mode', 'Subtotal (INR)', 'GST Amount (INR)', 'Grand Total (INR)', 'Items Billed'];
    const rows = sales.map(s => [
      s.invoiceNumber,
      s.timestamp,
      `"${s.customerName.replace(/"/g, '""')}"`,
      s.customerPhone || 'N/A',
      s.paymentMethod,
      s.subtotal,
      s.taxAmount,
      s.totalAmount,
      s.items.reduce((acc, i) => acc + i.quantity, 0)
    ]);
    downloadCSV(`smartstock_sales_register_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const exportPurchaseOrdersCSV = () => {
    const headers = ['PO #', 'Vendor Name', 'Created Date', 'Expected Date', 'Status', 'Payment Status', 'Subtotal (INR)', 'GST Amount (INR)', 'Total Amount (INR)'];
    const rows = purchaseOrders.map(p => [
      p.poNumber,
      `"${p.vendorName.replace(/"/g, '""')}"`,
      p.createdAt,
      p.expectedDate,
      p.status,
      p.paymentStatus,
      p.subtotal,
      p.taxAmount,
      p.totalAmount
    ]);
    downloadCSV(`smartstock_purchase_orders_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const totalPOVolume = purchaseOrders.reduce((sum, p) => sum + p.totalAmount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Analytical KPI Strip */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="kpi-header">
            <span className="kpi-title">Gross Inventory Valuation</span>
            <div className="kpi-icon-box" style={{ color: '#2563eb' }}><IndianRupee size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#0f172a' }}>
            ₹{stats.totalInventoryValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>Asset base across {stats.totalStockUnits} units</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="kpi-header">
            <span className="kpi-title">Realized Sales Revenue</span>
            <div className="kpi-icon-box" style={{ color: '#16a34a' }}><Receipt size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            ₹{stats.totalSalesToday.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>Billed across {sales.length} customer invoices</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #0891b2' }}>
          <div className="kpi-header">
            <span className="kpi-title">Procurement PO Volume</span>
            <div className="kpi-icon-box" style={{ color: '#0891b2' }}><ShoppingCart size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#0891b2' }}>
            ₹{totalPOVolume.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>{purchaseOrders.length} supplier orders processed</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="kpi-header">
            <span className="kpi-title">Stock Ledger Turnover</span>
            <div className="kpi-icon-box" style={{ color: '#d97706' }}><ArrowLeftRight size={16} /></div>
          </div>
          <div className="kpi-value">{stockMovements.length}</div>
          <div className="kpi-subtext">
            <span>Inward / outward movement cycles</span>
          </div>
        </div>
      </div>

      {/* CSV Export Control Panel */}
      <div className="card" style={{ padding: '1.25rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              Data Export & External Audit Tools
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Download clean CSV spreadsheets compatible with Microsoft Excel, Tally ERP, and Google Sheets
            </div>
          </div>
          <span className="badge badge-optimal">Export Format: CSV (UTF-8)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <button 
            className="btn btn-outline" 
            style={{ padding: '0.85rem 1rem', justifyContent: 'flex-start', background: '#f8fafc' }}
            onClick={exportProductsCSV}
          >
            <FileSpreadsheet size={18} color="#2563eb" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Export Products Catalog</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{items.length} SKUs with ₹ valuation</div>
            </div>
          </button>

          <button 
            className="btn btn-outline" 
            style={{ padding: '0.85rem 1rem', justifyContent: 'flex-start', background: '#f8fafc' }}
            onClick={exportMovementsCSV}
          >
            <FileSpreadsheet size={18} color="#16a34a" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Export Stock Movements</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stockMovements.length} ledger transactions</div>
            </div>
          </button>

          <button 
            className="btn btn-outline" 
            style={{ padding: '0.85rem 1rem', justifyContent: 'flex-start', background: '#f8fafc' }}
            onClick={exportSalesCSV}
          >
            <FileSpreadsheet size={18} color="#ea580c" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Export Sales Register</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{sales.length} customer invoices</div>
            </div>
          </button>

          <button 
            className="btn btn-outline" 
            style={{ padding: '0.85rem 1rem', justifyContent: 'flex-start', background: '#f8fafc' }}
            onClick={exportPurchaseOrdersCSV}
          >
            <FileSpreadsheet size={18} color="#0891b2" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Export Purchase Orders</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{purchaseOrders.length} procurement orders</div>
            </div>
          </button>
        </div>
      </div>

      {/* Category Valuation Breakdown Table */}
      <div className="card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>
            Category Asset Valuation & Inventory Distribution
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Financial distribution of capital stock in Indian Rupees (₹)
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th style={{ textAlign: 'right' }}>Active SKUs</th>
                <th style={{ textAlign: 'right' }}>On-Hand Units</th>
                <th style={{ textAlign: 'right' }}>Valuation (₹)</th>
                <th>Share of Total Valuation</th>
              </tr>
            </thead>
            <tbody>
              {categoryBreakdown.map(cat => {
                const percentage = stats.totalInventoryValuation > 0
                  ? ((cat.valuation / stats.totalInventoryValuation) * 100).toFixed(1)
                  : '0';

                return (
                  <tr key={cat.category}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{cat.category}</span>
                    </td>
                    <td style={{ textAlign: 'right' }} className="mono">{cat.count}</td>
                    <td style={{ textAlign: 'right' }} className="mono">{cat.units.toLocaleString('en-IN')}</td>
                    <td style={{ textAlign: 'right' }} className="mono">
                      <strong style={{ color: '#0f172a' }}>
                        ₹{cat.valuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, background: '#e2e8f0', height: 8, borderRadius: 4, overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${percentage}%`, 
                              background: '#2563eb', 
                              height: '100%', 
                              borderRadius: 4 
                            }} 
                          />
                        </div>
                        <span className="mono" style={{ fontSize: '0.78rem', fontWeight: 700, minWidth: '45px' }}>
                          {percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

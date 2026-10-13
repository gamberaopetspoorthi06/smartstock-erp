import React, { useState, useMemo } from 'react';
import { 
  ArrowLeftRight, Search, Filter, ArrowUpRight, ArrowDownRight, 
  IndianRupee, Package, Calendar, Download, RefreshCw 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { StockMovement, StockMovementType } from '../../types/erp';

export const InventoryLedgerView: React.FC = () => {
  const { stockMovements, isLoading, refreshData } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Filter movements
  const filteredMovements = useMemo(() => {
    return stockMovements.filter(m => {
      const matchesSearch = 
        m.movementNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.referenceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.reason.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'ALL' || m.movementType === selectedType;

      return matchesSearch && matchesType;
    });
  }, [stockMovements, searchQuery, selectedType]);

  // Summary Metrics
  const metrics = useMemo(() => {
    let inwardQty = 0;
    let inwardValue = 0;
    let outwardQty = 0;
    let outwardValue = 0;

    stockMovements.forEach(m => {
      if (m.quantity > 0) {
        inwardQty += m.quantity;
        inwardValue += m.totalValue;
      } else {
        outwardQty += Math.abs(m.quantity);
        outwardValue += m.totalValue;
      }
    });

    return { inwardQty, inwardValue, outwardQty, outwardValue };
  }, [stockMovements]);

  const getTypeBadge = (type: StockMovementType) => {
    switch (type) {
      case 'PURCHASE_RECEIPT':
        return <span className="badge badge-optimal">Goods Receipt (GRN)</span>;
      case 'SALE_ISSUE':
        return <span className="badge badge-info">Sales Dispatch</span>;
      case 'MANUAL_ADJUSTMENT':
        return <span className="badge badge-warning">Adjustment</span>;
      case 'DAMAGE_WRITE_OFF':
        return <span className="badge badge-danger">Write-Off</span>;
      default:
        return <span className="badge">{type}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = ['Movement #', 'Timestamp', 'Type', 'SKU', 'Item Name', 'Warehouse', 'Quantity', 'Balance Before', 'Balance After', 'Unit Cost (INR)', 'Total Value (INR)', 'Reference', 'Reason', 'Performed By'];
    const rows = filteredMovements.map(m => [
      m.movementNumber,
      m.timestamp,
      m.movementType,
      m.sku,
      `"${m.itemName.replace(/"/g, '""')}"`,
      m.warehouseName,
      m.quantity,
      m.balanceBefore,
      m.balanceAfter,
      m.unitCost,
      m.totalValue,
      m.referenceId,
      `"${m.reason.replace(/"/g, '""')}"`,
      m.performedBy
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `stock_movements_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Metrics Strip */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Transactions Logged</span>
            <div className="kpi-icon-box" style={{ color: '#2563eb' }}><ArrowLeftRight size={16} /></div>
          </div>
          <div className="kpi-value">{stockMovements.length}</div>
          <div className="kpi-subtext">
            <span>Immutable movement audit entries</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Inward Received</span>
            <div className="kpi-icon-box" style={{ color: '#16a34a' }}><ArrowUpRight size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            +{metrics.inwardQty} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>units</span>
          </div>
          <div className="kpi-subtext">
            <span>Value: ₹{metrics.inwardValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #ea580c' }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Outward Dispatched</span>
            <div className="kpi-icon-box" style={{ color: '#ea580c' }}><ArrowDownRight size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#ea580c' }}>
            -{metrics.outwardQty} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>units</span>
          </div>
          <div className="kpi-subtext">
            <span>Value: ₹{metrics.outwardValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #0891b2' }}>
          <div className="kpi-header">
            <span className="kpi-title">Net Ledger Turnover Value</span>
            <div className="kpi-icon-box" style={{ color: '#0891b2' }}><IndianRupee size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#0f172a' }}>
            ₹{(metrics.inwardValue + metrics.outwardValue).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>Combined gross stock flow</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by Movement #, SKU, component name, reference, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="ALL">All Movement Types</option>
            <option value="PURCHASE_RECEIPT">Goods Receipt (GRN)</option>
            <option value="SALE_ISSUE">Sales Dispatch</option>
            <option value="MANUAL_ADJUSTMENT">Manual Adjustments</option>
            <option value="DAMAGE_WRITE_OFF">Damage Write-Offs</option>
          </select>

          <button className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Movement #</th>
                <th>Timestamp</th>
                <th>Product</th>
                <th>Type</th>
                <th style={{ textAlign: 'right' }}>Qty</th>
                <th style={{ textAlign: 'right' }}>Balance Tracker</th>
                <th style={{ textAlign: 'right' }}>Unit Cost (₹)</th>
                <th style={{ textAlign: 'right' }}>Total Value (₹)</th>
                <th>Reference & Reason</th>
                <th>Performed By</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                    No stock movements matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredMovements.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span className="mono" style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.85rem' }}>
                        {m.movementNumber}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {new Date(m.timestamp).toLocaleString()}
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{m.sku}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.itemName}</div>
                      </div>
                    </td>
                    <td>{getTypeBadge(m.movementType)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className="mono" style={{ 
                        fontWeight: 800, 
                        fontSize: '0.95rem',
                        color: m.quantity > 0 ? '#16a34a' : '#dc2626' 
                      }}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>
                    <td className="mono" style={{ textAlign: 'right', fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--text-muted)' }}>{m.balanceBefore}</span>
                      <span style={{ color: '#2563eb', margin: '0 4px' }}>→</span>
                      <strong style={{ color: '#0f172a' }}>{m.balanceAfter}</strong>
                    </td>
                    <td style={{ textAlign: 'right' }} className="mono">
                      ₹{m.unitCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td style={{ textAlign: 'right' }} className="mono">
                      <strong style={{ color: '#0f172a' }}>
                        ₹{m.totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </strong>
                    </td>
                    <td>
                      <div>
                        <span className="mono" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600 }}>
                          {m.referenceId}
                        </span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          {m.reason}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge" style={{ fontSize: '0.68rem', background: '#f1f5f9', color: '#475569' }}>
                        {m.performedBy}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

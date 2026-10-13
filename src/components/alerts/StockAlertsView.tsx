import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, TrendingDown, IndianRupee, ShoppingCart, 
  CheckCircle2, RefreshCw, ShieldAlert, ArrowRight, Package 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const StockAlertsView: React.FC = () => {
  const { items, stockAlerts, setActiveView } = useERP();
  const [filterType, setFilterType] = useState<'ALL' | 'OUT_OF_STOCK' | 'LOW_STOCK'>('ALL');

  const alerts = useMemo(() => {
    return stockAlerts.filter(a => {
      if (filterType === 'ALL') return true;
      return a.alertType === filterType;
    });
  }, [stockAlerts, filterType]);

  const depletedCount = stockAlerts.filter(a => a.alertType === 'OUT_OF_STOCK').length;
  const lowCount = stockAlerts.filter(a => a.alertType === 'LOW_STOCK').length;
  const totalRestockCapital = stockAlerts.reduce((sum, a) => sum + a.estimatedCostINR, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Advisory Metrics */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #dc2626' }}>
          <div className="kpi-header">
            <span className="kpi-title">Depleted (Zero On-Hand)</span>
            <div className="kpi-icon-box" style={{ color: '#dc2626' }}><TrendingDown size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>{depletedCount}</div>
          <div className="kpi-subtext">
            <span>Critical: Sales blocked for these lines</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="kpi-header">
            <span className="kpi-title">Below Safety Reorder Point</span>
            <div className="kpi-icon-box" style={{ color: '#d97706' }}><AlertTriangle size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#d97706' }}>{lowCount}</div>
          <div className="kpi-subtext">
            <span>Buffer depleted; stockout imminent</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="kpi-header">
            <span className="kpi-title">Total Restocking Capital Needed</span>
            <div className="kpi-icon-box" style={{ color: '#2563eb' }}><IndianRupee size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#0f172a' }}>
            ₹{totalRestockCapital.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>Estimated procurement expenditure</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="kpi-header">
            <span className="kpi-title">Automated Action</span>
            <div className="kpi-icon-box" style={{ color: '#16a34a' }}><ShoppingCart size={16} /></div>
          </div>
          <div className="kpi-value" style={{ fontSize: '1.25rem', color: '#16a34a' }}>
            1-Click PO
          </div>
          <div className="kpi-subtext">
            <span>Pre-fills procurement replenishment</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-bar">
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${filterType === 'ALL' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setFilterType('ALL')}
          >
            All Alerts ({stockAlerts.length})
          </button>
          <button 
            className={`btn ${filterType === 'OUT_OF_STOCK' ? 'btn-danger' : 'btn-outline'} btn-sm`}
            onClick={() => setFilterType('OUT_OF_STOCK')}
          >
            Depleted Lines ({depletedCount})
          </button>
          <button 
            className={`btn ${filterType === 'LOW_STOCK' ? 'btn-secondary' : 'btn-outline'} btn-sm`}
            onClick={() => setFilterType('LOW_STOCK')}
          >
            Low Stock ({lowCount})
          </button>
        </div>

        <button 
          className="btn btn-primary btn-sm"
          onClick={() => setActiveView('PURCHASE_ORDERS')}
        >
          <ShoppingCart size={14} />
          <span>Open Procurement Console</span>
        </button>
      </div>

      {/* Advisory Table */}
      <div className="card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Product / SKU</th>
                <th>Alert Severity</th>
                <th style={{ textAlign: 'right' }}>Current Stock</th>
                <th style={{ textAlign: 'right' }}>Min Threshold</th>
                <th style={{ textAlign: 'right' }}>Recommended Reorder</th>
                <th style={{ textAlign: 'right' }}>Est. Capital Required (₹)</th>
                <th style={{ textAlign: 'center' }}>Replenish Action</th>
              </tr>
            </thead>
            <tbody>
              {alerts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: '#16a34a', padding: '3rem', fontWeight: 600 }}>
                    <CheckCircle2 size={24} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
                    Healthy Stock Inventory! No active depletion alerts at this time.
                  </td>
                </tr>
              ) : (
                alerts.map(a => {
                  const matchingItem = items.find(i => i.id === a.itemId);
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{a.sku}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{a.itemName}</div>
                      </td>
                      <td>
                        {a.alertType === 'OUT_OF_STOCK' ? (
                          <span className="badge badge-danger">✕ Depleted (Zero)</span>
                        ) : (
                          <span className="badge badge-warning">▲ Low Stock</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="mono" style={{ 
                          fontWeight: 800, 
                          color: a.currentStock === 0 ? '#dc2626' : '#d97706',
                          fontSize: '1rem' 
                        }}>
                          {a.currentStock} {matchingItem?.uom || 'units'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="mono">
                        {a.minStockLevel} {matchingItem?.uom || 'units'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="mono" style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.95rem' }}>
                          +{a.recommendedReorderQty} {matchingItem?.uom || 'units'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="mono">
                        <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                          ₹{a.estimatedCostINR.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button 
                          className="btn btn-primary btn-sm"
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                          onClick={() => setActiveView('PURCHASE_ORDERS')}
                        >
                          <ShoppingCart size={13} />
                          <span>Raise PO</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

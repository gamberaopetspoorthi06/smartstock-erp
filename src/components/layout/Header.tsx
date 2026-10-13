import React from 'react';
import { RefreshCw, RotateCcw } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const Header: React.FC = () => {
  const { activeView, isLoading, refreshData, resetToSeedData, stats } = useERP();

  const getViewTitle = () => {
    switch (activeView) {
      case 'DASHBOARD':        return { title: 'Dashboard',          subtitle: 'Overview of inventory, sales, and KPIs' };
      case 'PRODUCTS':         return { title: 'Products',            subtitle: `${stats.totalSkus} SKUs in catalog` };
      case 'INVENTORY':        return { title: 'Stock Ledger',        subtitle: 'Stock movement records — inward, outward, adjustments' };
      case 'SUPPLIERS':        return { title: 'Suppliers',           subtitle: 'Manage vendors, GSTIN records, and procurement channels' };
      case 'PURCHASE_ORDERS':  return { title: 'Purchase Orders',     subtitle: `${stats.openPurchaseOrdersCount} open orders awaiting fulfillment` };
      case 'SALES':            return { title: 'Sales & Billing',     subtitle: 'POS billing with GST calculations in ₹' };
      case 'LOW_STOCK_ALERTS': return { title: 'Low-Stock Alerts',    subtitle: `${stats.lowStockCount + stats.outOfStockCount} items needing replenishment` };
      case 'FORECAST':         return { title: 'Demand Forecast',     subtitle: 'AI-powered inventory demand predictions and reorder suggestions' };
      case 'REPORTS':          return { title: 'Reports & Analytics', subtitle: 'Sales trends, inventory valuation, and revenue charts' };
      default:                 return { title: 'SmartStock ERP',      subtitle: '' };
    }
  };

  const { title, subtitle } = getViewTitle();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div>
          <h1 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-controls">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => refreshData()}
          disabled={isLoading}
          title="Refresh data"
        >
          <RefreshCw size={13} className={isLoading ? 'spin-anim' : ''} />
          <span>{isLoading ? '...' : 'Refresh'}</span>
        </button>

        <button
          className="btn btn-outline btn-sm"
          onClick={() => {
            if (confirm('Reset all data to demo defaults?')) {
              resetToSeedData();
            }
          }}
          title="Reset to demo data"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>
    </header>
  );
};

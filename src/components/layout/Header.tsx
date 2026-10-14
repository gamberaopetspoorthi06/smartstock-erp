import React, { useState } from 'react';
import { RefreshCw, RotateCcw, LogOut, ChevronDown, Shield, Users } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { useAuth } from '../../context/AuthContext';

export const Header: React.FC = () => {
  const { activeView, isLoading, refreshData, resetToSeedData, stats } = useERP();
  const { user, logout, isAdmin } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

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

        {isAdmin && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => { if (confirm('Reset all data to demo defaults?')) resetToSeedData(); }}
            title="Reset to demo data"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}

        {/* User avatar menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'none', border: '1.5px solid var(--border-subtle)',
              borderRadius: '10px', padding: '0.3rem 0.65rem 0.3rem 0.4rem',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              color: 'var(--text-primary)', transition: 'all 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            {/* Avatar circle */}
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: isAdmin ? 'linear-gradient(135deg,#2563eb,#4f46e5)' : 'linear-gradient(135deg,#059669,#0891b2)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 800,
            }}>{initials}</div>
            <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.fullName?.split(' ')[0]}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', fontSize: '0.68rem', color: isAdmin ? '#2563eb' : '#059669' }}>
              {isAdmin ? <Shield size={11} /> : <Users size={11} />}
              {isAdmin ? 'Admin' : 'Staff'}
            </div>
            <ChevronDown size={13} color="var(--text-muted)" />
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 99 }} onClick={() => setUserMenuOpen(false)} />
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                background: '#fff', borderRadius: '12px', boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                border: '1px solid var(--border-subtle)', zIndex: 100,
                minWidth: '210px', overflow: 'hidden',
              }}>
                {/* User info */}
                <div style={{ padding: '0.9rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{user?.fullName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>{user?.email}</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px',
                    background: isAdmin ? '#eff6ff' : '#f0fdf4', color: isAdmin ? '#1d4ed8' : '#15803d',
                    fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: '100px',
                  }}>
                    {isAdmin ? <Shield size={10} /> : <Users size={10} />}
                    {isAdmin ? 'Administrator' : 'Inventory Staff'}
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={() => { setUserMenuOpen(false); logout(); }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
                    padding: '0.75rem 1rem', background: 'none', border: 'none',
                    cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                    color: '#dc2626', textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={15} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

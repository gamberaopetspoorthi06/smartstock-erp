import React from 'react';
import { 
  LayoutDashboard, Package, ArrowLeftRight, Truck, ShoppingCart, 
  Receipt, AlertTriangle, TrendingUp, BarChart3, Boxes, Bot
} from 'lucide-react';
import { useERP, ERPView } from '../../context/ERPContext';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, stats, openChatbot } = useERP();

  const navGroups = [
    {
      title: 'Core',
      items: [
        { id: 'DASHBOARD' as ERPView,       label: 'Dashboard',        icon: <LayoutDashboard size={17} /> },
        { id: 'PRODUCTS'  as ERPView,       label: 'Products',          icon: <Package size={17} /> },
        { id: 'INVENTORY' as ERPView,       label: 'Stock Ledger',      icon: <ArrowLeftRight size={17} /> },
      ]
    },
    {
      title: 'Procurement',
      items: [
        { id: 'SUPPLIERS'       as ERPView, label: 'Suppliers',         icon: <Truck size={17} /> },
        { id: 'PURCHASE_ORDERS' as ERPView, label: 'Purchase Orders',   icon: <ShoppingCart size={17} />, badge: stats.openPurchaseOrdersCount > 0 ? stats.openPurchaseOrdersCount : undefined },
      ]
    },
    {
      title: 'Sales & Reports',
      items: [
        { id: 'SALES'           as ERPView, label: 'Sales & Billing',   icon: <Receipt size={17} /> },
        { id: 'LOW_STOCK_ALERTS'as ERPView, label: 'Low-Stock Alerts',  icon: <AlertTriangle size={17} />, badge: (stats.lowStockCount + stats.outOfStockCount) > 0 ? (stats.lowStockCount + stats.outOfStockCount) : undefined, badgeDanger: true },
        { id: 'REPORTS'         as ERPView, label: 'Reports',            icon: <BarChart3 size={17} /> },
      ]
    },
    {
      title: 'AI & Insights',
      items: [
        { id: 'FORECAST' as ERPView,        label: 'Demand Forecast',   icon: <TrendingUp size={17} /> },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <Boxes size={22} />
        </div>
        <div>
          <div className="brand-title">SmartStock ERP</div>
          <div className="brand-sub">AI Inventory & Supply Chain</div>
        </div>
      </div>

      {/* Grouped Navigation */}
      <div className="nav-section" style={{ overflowY: 'auto', flex: 1 }}>
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="nav-section-title">{group.title}</div>
            {group.items.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => setActiveView(item.id)}
              >
                <div className="nav-item-left">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`nav-badge ${'badgeDanger' in item && item.badgeDanger ? 'danger' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* AI Chatbot Button at bottom */}
      <div className="sidebar-footer">
        <button
          className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', gap: '0.5rem', borderRadius: 'var(--radius-md)', padding: '0.65rem 1rem' }}
          onClick={() => openChatbot()}
        >
          <Bot size={16} />
          <span>AI Assistant</span>
        </button>
      </div>
    </aside>
  );
};

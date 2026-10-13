import React, { useState, useMemo } from 'react';
import { 
  Plus, Search, Filter, AlertTriangle, ArrowUpDown, 
  Package, IndianRupee, Layers, Warehouse, Edit3, Trash2,
  TrendingDown, CheckCircle2, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import { Item, ItemCategory, ItemStatus } from '../../types/erp';
import { useERP } from '../../context/ERPContext';
import { ItemModal } from './ItemModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { SkeletonTable } from '../resilience/SkeletonTable';
import { EmptyState } from '../resilience/EmptyState';

export const ItemCatalog: React.FC = () => {
  const { items, warehouses, isLoading, stats, deleteItem, triggerBackgroundEditForItem } = useERP();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'sku' | 'name' | 'stock' | 'valuation' | 'version'>('sku');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals state
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<Item | null>(null);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        const matchesSearch = 
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.locationBin.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
        const matchesStat = selectedStatus === 'ALL' || item.status === selectedStatus;

        return matchesSearch && matchesCat && matchesStat;
      })
      .sort((a, b) => {
        let valA: any;
        let valB: any;

        if (sortBy === 'stock') {
          valA = a.currentStock;
          valB = b.currentStock;
        } else if (sortBy === 'valuation') {
          valA = a.currentStock * a.unitCost;
          valB = b.currentStock * b.unitCost;
        } else {
          valA = a[sortBy];
          valB = b[sortBy];
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [items, searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const handleSort = (field: 'sku' | 'name' | 'stock' | 'valuation' | 'version') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case 'IN_STOCK':
        return <span className="badge badge-optimal">● In Stock</span>;
      case 'LOW_STOCK':
        return <span className="badge badge-warning">▲ Low Stock</span>;
      case 'OUT_OF_STOCK':
        return <span className="badge badge-danger">✕ Depleted</span>;
      default:
        return <span className="badge badge-draft">{status}</span>;
    }
  };

  const getWarehouseName = (whId: string) => {
    const wh = warehouses.find(w => w.id === whId);
    return wh ? wh.code : whId;
  };

  return (
    <div>
      {/* KPI Overview Strip */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel" style={{ '--kpi-glow': 'rgba(99, 102, 241, 0.25)' } as any}>
          <div className="kpi-header">
            <span className="kpi-title">Total Active SKUs</span>
            <div className="kpi-icon-box"><Package size={16} /></div>
          </div>
          <div className="kpi-value">{stats.totalSkus}</div>
          <div className="kpi-subtext">
            <span>In {warehouses.length} physical facilities</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-title">Inventory Asset Valuation</span>
            <div className="kpi-icon-box" style={{ color: '#15803d' }}><IndianRupee size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#15803d' }}>
            ₹{stats.totalInventoryValuation.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>Balance in General Ledger 1300</span>
          </div>
        </div>

        <div 
          className="kpi-card glass-panel" 
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedStatus(selectedStatus === 'LOW_STOCK' ? 'ALL' : 'LOW_STOCK')}
          title="Click to toggle low stock filter"
        >
          <div className="kpi-header">
            <span className="kpi-title">Low Stock Warnings</span>
            <div className="kpi-icon-box" style={{ color: '#b45309' }}><AlertTriangle size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#b45309' }}>
            {stats.lowStockCount}
          </div>
          <div className="kpi-subtext">
            <span>Below reorder threshold</span>
          </div>
        </div>

        <div 
          className="kpi-card glass-panel" 
          style={{ cursor: 'pointer' }}
          onClick={() => setSelectedStatus(selectedStatus === 'OUT_OF_STOCK' ? 'ALL' : 'OUT_OF_STOCK')}
          title="Click to toggle out of stock filter"
        >
          <div className="kpi-header">
            <span className="kpi-title">Depleted Stock</span>
            <div className="kpi-icon-box" style={{ color: '#b91c1c' }}><TrendingDown size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#b91c1c' }}>
            {stats.outOfStockCount}
          </div>
          <div className="kpi-subtext">
            <span>Zero on-hand units</span>
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
            placeholder="Search by SKU, component name, or bin location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.6rem 0.85rem' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="ALL">All Categories</option>
            <option value="ROBOTICS">Robotics</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="MECHANICAL">Mechanical</option>
            <option value="RAW_MATERIALS">Raw Materials</option>
            <option value="FINISHED_GOODS">Finished Goods</option>
          </select>

          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.6rem 0.85rem' }}
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="OPTIMAL">Optimal</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingItem(null);
              setIsItemModalOpen(true);
            }}
          >
            <Plus size={16} />
            <span>New Item Master</span>
          </button>
        </div>
      </div>

      {/* Loading Skeletons vs Data Table vs Empty State */}
      {isLoading ? (
        <SkeletonTable rows={7} columns={7} />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title="No Inventory Items Found"
          description={searchQuery || selectedCategory !== 'ALL' || selectedStatus !== 'ALL' 
            ? "No records matched your search filters. Try clearing your filters or query."
            : "Your inventory catalog is currently empty. Click below to add your first SKU."}
          actionLabel="Add New Item"
          onAction={() => {
            setEditingItem(null);
            setIsItemModalOpen(true);
          }}
        />
      ) : (
        <div className="table-container glass-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('sku')} style={{ cursor: 'pointer' }}>
                  SKU Code & Status <ArrowUpDown size={12} style={{ display: 'inline', marginLeft: 4 }} />
                </th>
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                  Component Description
                </th>
                <th>Category</th>
                <th>Facility & Bin</th>
                <th onClick={() => handleSort('stock')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                  Stock Levels (On-Hand)
                </th>
                <th style={{ textAlign: 'right' }}>Unit Cost</th>
                <th onClick={() => handleSort('valuation')} style={{ cursor: 'pointer', textAlign: 'right' }}>
                  Valuation
                </th>
                <th onClick={() => handleSort('version')} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  OCC Ver
                </th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const stockValuation = item.currentStock * item.unitCost;
                const percentage = Math.min(100, Math.round((item.currentStock / Math.max(1, item.reorderPoint * 2)) * 100));

                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span className="mono" style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.88rem' }}>
                          {item.sku}
                        </span>
                        <div>{getStatusBadge(item.status)}</div>
                      </div>
                    </td>

                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.description}
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                        {item.category}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontSize: '0.78rem' }}>
                        <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{getWarehouseName(item.warehouseId)}</div>
                        <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Bin: {item.locationBin}</div>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div>
                        <div className="mono" style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                          {item.currentStock} <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{item.uom}</span>
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Avail: <strong style={{ color: '#0f172a' }}>{item.availableStock}</strong> | Reorder: {item.reorderPoint}
                        </div>
                        <div className="stock-bar-wrap">
                          <div 
                            className={`stock-bar-fill ${item.status === 'IN_STOCK' ? 'optimal' : item.status === 'LOW_STOCK' ? 'warning' : 'danger'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }} className="mono">
                      ₹{item.unitCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td style={{ textAlign: 'right' }} className="mono">
                      <strong style={{ color: '#15803d' }}>₹{stockValuation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <span className="mono" style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.2rem 0.5rem', 
                        background: 'var(--bg-surface-3)', 
                        borderRadius: 'var(--radius-xs)',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        v{item.version}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          title="Adjust stock (Inward receipt / Outward deduction with audit reason)"
                          onClick={() => setAdjustingItem(item)}
                        >
                          Adjust
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          title="Edit Item Master"
                          onClick={() => {
                            setEditingItem(item);
                            setIsItemModalOpen(true);
                          }}
                        >
                          <Edit3 size={13} />
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                          title="Simulate background collision (OCC Test)"
                          onClick={() => triggerBackgroundEditForItem(item.id)}
                        >
                          Bump
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'rgba(244, 63, 94, 0.3)', color: '#f87171' }}
                          title="Delete SKU"
                          onClick={() => {
                            if (confirm(`Archive ${item.sku}?`)) {
                              deleteItem(item.id);
                            }
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Item Modal (Create / Edit) */}
      {isItemModalOpen && (
        <ItemModal
          itemToEdit={editingItem}
          onClose={() => {
            setIsItemModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <StockAdjustmentModal
          item={adjustingItem}
          onClose={() => setAdjustingItem(null)}
        />
      )}
    </div>
  );
};

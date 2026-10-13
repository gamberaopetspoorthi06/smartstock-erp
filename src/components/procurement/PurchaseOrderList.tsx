import React, { useState } from 'react';
import { 
  Plus, Search, ShoppingCart, Send, PackageCheck, 
  CreditCard, CheckCircle2, AlertCircle, FileText, Calendar
} from 'lucide-react';
import { PurchaseOrder, POStatus } from '../../types/erp';
import { useERP } from '../../context/ERPContext';
import { CreatePOModal } from './CreatePOModal';
import { ReceivePOModal } from './ReceivePOModal';
import { SkeletonTable } from '../resilience/SkeletonTable';
import { EmptyState } from '../resilience/EmptyState';

export const PurchaseOrderList: React.FC = () => {
  const { 
    purchaseOrders, 
    approvePurchaseOrder, 
    payPurchaseOrder, 
    isLoading,
    warehouses 
  } = useERP();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [receivingPO, setReceivingPO] = useState<PurchaseOrder | null>(null);

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;
    const matchesSearch = 
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: POStatus) => {
    switch (status) {
      case 'DRAFT':
        return <span className="badge badge-draft">Draft</span>;
      case 'PENDING_APPROVAL':
        return <span className="badge badge-warning">Pending Approval</span>;
      case 'APPROVED':
      case 'ORDERED':
        return <span className="badge badge-info">Approved (In Transit)</span>;
      case 'RECEIVED':
        return <span className="badge badge-optimal">✓ Received (GRN)</span>;
      case 'PARTIALLY_RECEIVED':
        return <span className="badge badge-info">Partial</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
    }
  };

  const getWarehouseName = (whId: string) => {
    const wh = warehouses.find(w => w.id === whId);
    return wh ? wh.name : whId;
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by PO number or supplier name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.6rem 0.85rem' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All PO Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="ISSUED">Issued (In Transit)</option>
            <option value="RECEIVED">Received</option>
          </select>

          <button className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
            <Plus size={16} />
            <span>Create Purchase Order</span>
          </button>
        </div>
      </div>

      {/* Loading Skeletons vs Data Table vs Empty State */}
      {isLoading ? (
        <SkeletonTable rows={5} columns={6} />
      ) : filteredPOs.length === 0 ? (
        <EmptyState
          title="No Purchase Orders Found"
          description="No purchase orders match your current filter. Initiate an order to replenish inventory."
          actionLabel="Create Purchase Order"
          onAction={() => setIsCreateOpen(true)}
          icon={<ShoppingCart size={32} />}
        />
      ) : (
        <div className="table-container glass-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>PO Number & State</th>
                <th>Supplier & Destination</th>
                <th>Ordered Components</th>
                <th style={{ textAlign: 'right' }}>Total Value</th>
                <th>Payment Status</th>
                <th style={{ textAlign: 'center' }}>Workflow Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.map((po) => (
                <tr key={po.id}>
                  <td>
                    <div>
                      <span className="mono" style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.9rem' }}>
                        {po.poNumber}
                      </span>
                      <div style={{ marginTop: '0.25rem' }}>{getStatusBadge(po.status)}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Created: {new Date(po.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div>
                      <div style={{ fontWeight: 600 }}>{po.vendorName}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Dest: {getWarehouseName(po.targetWarehouseId)}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {po.items.map((line) => (
                        <div key={line.id} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span className="mono" style={{ color: '#2563eb', fontWeight: 600 }}>{line.sku}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>x {line.orderedQty}</span>
                          {line.receivedQty > 0 && (
                            <span style={{ color: 'var(--status-optimal)', fontSize: '0.68rem', fontWeight: 700 }}>
                              (Rec: {line.receivedQty})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{po.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                      GST Incl. (18%)
                    </div>
                  </td>

                  <td>
                    {po.paymentStatus === 'PAID' ? (
                      <span className="badge badge-optimal">Paid in Full</span>
                    ) : (
                      <span className="badge badge-warning">Unpaid (Accounts Payable)</span>
                    )}
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {(po.status === 'DRAFT' || po.status === 'PENDING_APPROVAL') && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => approvePurchaseOrder(po.id)}
                        title="Approve order for vendor fulfillment"
                      >
                        <Send size={13} />
                        <span>Approve PO</span>
                      </button>
                    )}

                    {(po.status === 'APPROVED' || po.status === 'ORDERED') && (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ background: 'var(--status-optimal)', borderColor: 'var(--status-optimal)' }}
                        onClick={() => setReceivingPO(po)}
                        title="Process Goods Receipt Note (GRN) into Inventory"
                      >
                        <PackageCheck size={14} />
                        <span>Receive Goods (GRN)</span>
                      </button>
                    )}

                    {po.status === 'RECEIVED' && po.paymentStatus === 'UNPAID' && (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => payPurchaseOrder(po.id)}
                        title="Settle payment and clear Accounts Payable in General Ledger"
                      >
                        <CreditCard size={14} />
                        <span>Pay Invoice (₹)</span>
                      </button>
                    )}

                    {po.status === 'RECEIVED' && po.paymentStatus === 'PAID' && (
                      <span style={{ color: 'var(--status-optimal)', fontSize: '0.78rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={15} />
                        <span>Settled & Reconciled</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {isCreateOpen && <CreatePOModal onClose={() => setIsCreateOpen(false)} />}
      {receivingPO && <ReceivePOModal po={receivingPO} onClose={() => setReceivingPO(null)} />}
    </div>
  );
};

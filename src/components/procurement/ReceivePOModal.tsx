import React, { useState } from 'react';
import { X, CheckCircle2, ArrowRight, Package, BookOpen, ShieldCheck, Zap } from 'lucide-react';
import { PurchaseOrder } from '../../types/erp';
import { useERP } from '../../context/ERPContext';

interface ReceivePOModalProps {
  po: PurchaseOrder;
  onClose: () => void;
}

export const ReceivePOModal: React.FC<ReceivePOModalProps> = ({ po, onClose }) => {
  const { receivePurchaseOrder, warehouses, items } = useERP();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const targetWh = warehouses.find(w => w.id === po.targetWarehouseId);

  const handleReceive = async () => {
    setIsSubmitting(true);
    await receivePurchaseOrder(po.id);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <div className="modal-header" style={{ background: 'rgba(16, 185, 129, 0.08)', borderColor: 'var(--status-optimal-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ color: 'var(--status-optimal)' }}>
              <Package size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: 'var(--status-optimal)' }}>
                Process Goods Receipt Note (GRN)
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Order: <span className="mono" style={{ color: '#fff', fontWeight: 700 }}>{po.poNumber}</span> | Vendor: {po.vendorName}
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          {/* Architecture Concept Highlight Callout */}
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(16, 185, 129, 0.12) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.35)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.15rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Zap size={16} color="#818cf8" />
              <strong style={{ fontSize: '0.85rem', color: '#fff' }}>
                Key 3rd-Year Viva Architecture Feature: Cross-Domain Inter-Module Event
              </strong>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Confirming receipt will execute an atomic multi-table transaction across three decoupled business domains:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
              <div style={{ background: 'var(--bg-surface-2)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-info" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>1. Procurement</span>
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Status changes to RECEIVED</div>
              </div>
              <div style={{ background: 'var(--bg-surface-2)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-optimal" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>2. Inventory Core</span>
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Increments stock & logs StockMovement</div>
              </div>
              <div style={{ background: 'var(--bg-surface-2)', padding: '0.65rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span className="badge badge-warning" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>3. Finance Ledger</span>
                <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Auto-dispatches Dr 1300 / Cr 2000</div>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '0.82rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
            Inbound Shipment Verification ({targetWh?.name || 'Destination Facility'}):
          </h4>

          <div className="table-container" style={{ marginBottom: '1.25rem' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item Name</th>
                  <th style={{ textAlign: 'right' }}>Ordered</th>
                  <th style={{ textAlign: 'right' }}>Receiving Now</th>
                  <th style={{ textAlign: 'right' }}>Unit Cost</th>
                  <th style={{ textAlign: 'right' }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {po.items.map((line) => {
                  const currentItem = items.find(i => i.id === line.itemId);
                  return (
                    <tr key={line.id}>
                      <td className="mono" style={{ color: '#818cf8', fontWeight: 700 }}>{line.sku}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{line.itemName}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Current On-hand: {currentItem?.currentStock || 0} → Will become: {(currentItem?.currentStock || 0) + line.orderedQty}
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }} className="mono">{line.orderedQty}</td>
                      <td style={{ textAlign: 'right' }} className="mono">
                        <strong style={{ color: 'var(--status-optimal)' }}>+{line.orderedQty}</strong>
                      </td>
                      <td style={{ textAlign: 'right' }} className="mono">₹{line.unitCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      <td style={{ textAlign: 'right' }} className="mono">₹{line.lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Financial Posting Preview */}
          <div style={{ 
            background: 'var(--bg-surface-2)', 
            padding: '1rem', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-subtle)',
            fontSize: '0.82rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#a5b4fc', fontWeight: 700 }}>
              <BookOpen size={15} />
              <span>General Ledger Double-Entry Posting Preview:</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span>Debit: 1300 - Inventory Asset (Increases Balance Sheet Assets)</span>
              <strong className="mono" style={{ color: '#16a34a' }}>+₹{po.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem 0' }}>
              <span>Credit: 2000 - Accounts Payable (Vendor Liability)</span>
              <strong className="mono" style={{ color: '#dc2626' }}>+₹{po.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-primary" 
            style={{ background: 'var(--status-optimal)', borderColor: 'var(--status-optimal)' }}
            onClick={handleReceive} 
            disabled={isSubmitting}
          >
            <CheckCircle2 size={16} />
            <span>{isSubmitting ? 'Dispatching Across Modules...' : 'Confirm Goods Receipt & Post to Ledger'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

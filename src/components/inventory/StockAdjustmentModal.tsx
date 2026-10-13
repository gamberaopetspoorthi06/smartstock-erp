import React, { useState } from 'react';
import { X, ArrowRightLeft, AlertTriangle, ShieldCheck, BookOpen } from 'lucide-react';
import { Item } from '../../types/erp';
import { useERP } from '../../context/ERPContext';

interface StockAdjustmentModalProps {
  item: Item;
  onClose: () => void;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({ item, onClose }) => {
  const { adjustStock } = useERP();
  const [adjustmentType, setAdjustmentType] = useState<'INCREASE' | 'DECREASE'>('INCREASE');
  const [quantity, setQuantity] = useState<number>(5);
  const [reason, setReason] = useState<string>('Cycle Count Variance Correction');
  const [performer, setPerformer] = useState<string>('Alex Rivera (Inventory Controller)');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const delta = adjustmentType === 'INCREASE' ? Number(quantity) : -Number(quantity);
  const projectedStock = Math.max(0, item.currentStock + delta);
  const monetaryValue = Math.abs(delta) * item.unitCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    setIsSubmitting(true);
    await adjustStock(item.id, delta, reason, performer);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ color: 'var(--accent-primary)' }}>
              <ArrowRightLeft size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Adjust Inventory Stock</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target: <span className="mono" style={{ color: '#fff', fontWeight: 700 }}>{item.sku}</span> ({item.name})
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Stock Impact Visual Card */}
            <div style={{ 
              background: 'var(--bg-surface-2)', 
              padding: '1rem', 
              borderRadius: 'var(--radius-md)', 
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              textAlign: 'center',
              gap: '0.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Current</div>
                <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{item.currentStock} {item.uom}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Delta</div>
                <div className="mono" style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: 800, 
                  color: delta >= 0 ? 'var(--status-optimal)' : 'var(--status-danger)' 
                }}>
                  {delta >= 0 ? `+${delta}` : delta}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Projected</div>
                <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                  {projectedStock} {item.uom}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Adjustment Direction</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  className={`btn ${adjustmentType === 'INCREASE' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setAdjustmentType('INCREASE')}
                >
                  + Inward Stock Receipt / Surplus
                </button>
                <button
                  type="button"
                  className={`btn ${adjustmentType === 'DECREASE' ? 'btn-danger' : 'btn-secondary'}`}
                  onClick={() => setAdjustmentType('DECREASE')}
                >
                  - Outward Deduction / Scrap / Loss
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity to Adjust ({item.uom})</label>
              <input
                type="number"
                className="form-input mono"
                min="1"
                max={adjustmentType === 'DECREASE' ? item.currentStock : 99999}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Audit Justification / Reason</label>
              <select
                className="form-select"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              >
                <option value="Cycle Count Variance Correction">Cycle Count Physical Audit Variance</option>
                <option value="Damaged / QA Reject Write-Off">Damaged / QA Inspection Reject Write-Off</option>
                <option value="Customer Return Restocking">Customer Return (RMA Restocking)</option>
                <option value="Engineering Prototype Sample Issue">Internal Engineering Prototype Issue</option>
                <option value="Supplier Over-Delivery Allowance">Supplier Unbilled Over-Delivery</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Authorized Staff Member</label>
              <input
                type="text"
                className="form-input"
                value={performer}
                onChange={(e) => setPerformer(e.target.value)}
                required
              />
            </div>

            {/* Inter-Module Bridge Notice */}
            <div style={{ 
              background: 'rgba(99, 102, 241, 0.08)', 
              border: '1px solid rgba(99, 102, 241, 0.25)', 
              borderRadius: 'var(--radius-md)', 
              padding: '0.85rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem'
            }}>
              <BookOpen size={18} color="#818cf8" style={{ marginTop: '2px', flexShrink: 0 }} />
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                <strong style={{ color: 'var(--text-primary)' }}>Inter-Module Ledger Bridge:</strong> Submitting will record an immutable <code className="mono">StockMovement</code> log and automatically dispatch a balanced financial journal entry for <strong>₹{monetaryValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong> between <em>Inventory Asset (1300)</em> and <em>Variance Write-Off (5120)</em>.
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Posting Ledger & Stock...' : 'Confirm Stock Adjustment'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

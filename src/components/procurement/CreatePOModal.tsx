import React, { useState } from 'react';
import { X, Plus, Trash2, ShoppingCart, AlertCircle } from 'lucide-react';
import { POLineItem } from '../../types/erp';
import { useERP } from '../../context/ERPContext';

interface CreatePOModalProps {
  onClose: () => void;
}

export const CreatePOModal: React.FC<CreatePOModalProps> = ({ onClose }) => {
  const { suppliers, warehouses, items, createPurchaseOrder } = useERP();

  const [vendorId, setVendorId] = useState(suppliers[0]?.id || '');
  const [targetWarehouseId, setTargetWarehouseId] = useState(warehouses[0]?.id || '');
  const [expectedDays, setExpectedDays] = useState(7);
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<POLineItem[]>([
    {
      id: `line-${Date.now()}-1`,
      itemId: items[0]?.id || '',
      sku: items[0]?.sku || '',
      itemName: items[0]?.name || '',
      orderedQty: 25,
      receivedQty: 0,
      unitCost: items[0]?.unitCost || 50,
      lineTotal: (items[0]?.unitCost || 50) * 25
    }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedSupplier = suppliers.find(s => s.id === vendorId);

  const handleItemSelect = (lineIndex: number, itemId: string) => {
    const selected = items.find(i => i.id === itemId);
    if (!selected) return;

    const updated = [...lineItems];
    updated[lineIndex] = {
      ...updated[lineIndex],
      itemId: selected.id,
      sku: selected.sku,
      itemName: selected.name,
      unitCost: selected.unitCost,
      lineTotal: updated[lineIndex].orderedQty * selected.unitCost
    };
    setLineItems(updated);
  };

  const handleQtyChange = (lineIndex: number, qty: number) => {
    const updated = [...lineItems];
    const validQty = Math.max(1, qty);
    updated[lineIndex] = {
      ...updated[lineIndex],
      orderedQty: validQty,
      lineTotal: validQty * updated[lineIndex].unitCost
    };
    setLineItems(updated);
  };

  const handleCostChange = (lineIndex: number, cost: number) => {
    const updated = [...lineItems];
    const validCost = Math.max(0.01, cost);
    updated[lineIndex] = {
      ...updated[lineIndex],
      unitCost: validCost,
      lineTotal: updated[lineIndex].orderedQty * validCost
    };
    setLineItems(updated);
  };

  const addLine = () => {
    const firstItem = items[0];
    if (!firstItem) return;
    setLineItems([
      ...lineItems,
      {
        id: `line-${Date.now()}-${lineItems.length + 1}`,
        itemId: firstItem.id,
        sku: firstItem.sku,
        itemName: firstItem.name,
        orderedQty: 10,
        receivedQty: 0,
        unitCost: firstItem.unitCost,
        lineTotal: firstItem.unitCost * 10
      }
    ]);
  };

  const removeLine = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const subtotal = lineItems.reduce((acc, curr) => acc + curr.lineTotal, 0);
  const tax = subtotal * 0.18; // 18% GST
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      setErrorMessage('Please include at least one item line.');
      return;
    }

    setIsSubmitting(true);
    const expectedDate = new Date(Date.now() + expectedDays * 86400000).toISOString();

    const success = await createPurchaseOrder({
      vendorId,
      vendorName: selectedSupplier?.name || 'Authorized Supplier',
      targetWarehouseId,
      status: 'DRAFT',
      items: lineItems,
      expectedDate,
      notes
    });

    setIsSubmitting(false);
    if (success) {
      onClose();
    } else {
      setErrorMessage('Failed to create purchase order.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <ShoppingCart size={20} color="#818cf8" />
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>Create Purchase Order (Procurement)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Draft order to replenish stock through authorized supplier network
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {errorMessage && (
              <div style={{ 
                background: 'var(--status-danger-bg)', 
                border: '1px solid var(--status-danger-border)', 
                padding: '0.75rem 1rem', 
                borderRadius: 'var(--radius-md)', 
                color: 'var(--status-danger)', 
                marginBottom: '1rem',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Vendor / Supplier</label>
                <select
                  className="form-select"
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code} - Rating: {s.rating}★)
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Receiving Destination Warehouse</label>
                <select
                  className="form-select"
                  value={targetWarehouseId}
                  onChange={(e) => setTargetWarehouseId(e.target.value)}
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({wh.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Lead Time / Expected Delivery (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  className="form-input mono"
                  value={expectedDays}
                  onChange={(e) => setExpectedDays(Number(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Terms</label>
                <input
                  type="text"
                  className="form-input"
                  value="Net 30 Days (GST Invoice)"
                  disabled
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <span className="form-label" style={{ margin: 0 }}>Procurement Line Items</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>
                  <Plus size={14} />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '40%' }}>Component / SKU</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Ordered Qty</th>
                      <th style={{ width: '20%', textAlign: 'right' }}>Unit Cost (₹)</th>
                      <th style={{ width: '15%', textAlign: 'right' }}>Total (₹)</th>
                      <th style={{ width: '5%' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lineItems.map((line, idx) => (
                      <tr key={line.id}>
                        <td>
                          <select
                            className="form-select"
                            value={line.itemId}
                            onChange={(e) => handleItemSelect(idx, e.target.value)}
                          >
                            {items.map((it) => (
                              <option key={it.id} value={it.id}>
                                {it.sku} - {it.name} (Stock: {it.currentStock})
                              </option>
                            ))}
                          </select>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            min="1"
                            className="form-input mono"
                            style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}
                            value={line.orderedQty}
                            onChange={(e) => handleQtyChange(idx, Number(e.target.value))}
                          />
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <input
                            type="number"
                            step="0.01"
                            className="form-input mono"
                            style={{ textAlign: 'right', padding: '0.4rem 0.6rem' }}
                            value={line.unitCost}
                            onChange={(e) => handleCostChange(idx, Number(e.target.value))}
                          />
                        </td>
                        <td style={{ textAlign: 'right' }} className="mono">
                          <strong>₹{line.lineTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline btn-sm"
                            style={{ color: '#f87171' }}
                            onClick={() => removeLine(idx)}
                            disabled={lineItems.length <= 1}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Subtotal and Notes Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
              <div className="form-group">
                <label className="form-label">Internal PO Notes & Instructions</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Carrier instructions, packaging specs, expedited delivery..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ 
                background: 'var(--bg-surface-2)', 
                padding: '1rem 1.25rem', 
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Lines Subtotal:</span>
                  <span className="mono">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Applicable GST (18%):</span>
                  <span className="mono">₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '0.5rem', 
                  paddingTop: '0.5rem', 
                  borderTop: '1px solid var(--border-medium)',
                  fontSize: '1.05rem',
                  fontWeight: 800
                }}>
                  <span>PO Total:</span>
                  <span className="mono" style={{ color: '#2563eb' }}>₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Creating Draft PO...' : 'Create Purchase Order (Draft)'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

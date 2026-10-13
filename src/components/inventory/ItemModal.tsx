import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, Layers } from 'lucide-react';
import { Item, ItemCategory, UnitOfMeasure } from '../../types/erp';
import { useERP } from '../../context/ERPContext';

interface ItemModalProps {
  itemToEdit?: Item | null;
  onClose: () => void;
}

export const ItemModal: React.FC<ItemModalProps> = ({ itemToEdit, onClose }) => {
  const { warehouses, suppliers, createItem, updateItem, triggerBackgroundEditForItem } = useERP();

  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    category: 'Electrical Supplies' as ItemCategory,
    uom: 'PCS' as UnitOfMeasure,
    currentStock: 0,
    allocatedStock: 0,
    reorderPoint: 20,
    safetyStock: 10,
    unitCost: 10.0,
    sellingPrice: 20.0,
    warehouseId: warehouses[0]?.id || 'wh-delhi-01',
    locationBin: 'BAY-01-A',
    description: '',
    supplierId: suppliers[0]?.id || 'sup-havells-01',
    supplierName: suppliers[0]?.name || 'Havells India Ltd.'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        sku: itemToEdit.sku,
        name: itemToEdit.name,
        category: itemToEdit.category,
        uom: itemToEdit.uom,
        currentStock: itemToEdit.currentStock,
        allocatedStock: itemToEdit.allocatedStock,
        reorderPoint: itemToEdit.reorderPoint,
        safetyStock: itemToEdit.safetyStock,
        unitCost: itemToEdit.unitCost,
        sellingPrice: itemToEdit.sellingPrice,
        warehouseId: itemToEdit.warehouseId,
        locationBin: itemToEdit.locationBin,
        description: itemToEdit.description,
        supplierId: itemToEdit.supplierId,
        supplierName: itemToEdit.supplierName
      });
    }
  }, [itemToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    if (!formData.sku.trim() || !formData.name.trim()) {
      setErrorMessage('SKU and Item Name are required fields.');
      setIsSubmitting(false);
      return;
    }

    if (itemToEdit) {
      // Update with existing version token
      const payload: Item = {
        ...itemToEdit,
        ...formData,
        unitCost: Number(formData.unitCost),
        sellingPrice: Number(formData.sellingPrice),
        currentStock: Number(formData.currentStock),
        allocatedStock: Number(formData.allocatedStock),
        reorderPoint: Number(formData.reorderPoint),
        safetyStock: Number(formData.safetyStock)
      };

      const result = await updateItem(payload);
      setIsSubmitting(false);

      if (result.success) {
        onClose();
      } else if (result.conflict) {
        // Conflict modal is triggered globally in context!
        onClose();
      } else {
        setErrorMessage('Failed to update record. Item may not exist.');
      }
    } else {
      // Create new
      const sup = suppliers.find(s => s.id === formData.supplierId) || suppliers[0];
      const success = await createItem({
        ...formData,
        supplierId: sup ? sup.id : 'sup-havells-01',
        supplierName: sup ? sup.name : 'Havells India Ltd.',
        unitCost: Number(formData.unitCost),
        sellingPrice: Number(formData.sellingPrice),
        currentStock: Number(formData.currentStock),
        allocatedStock: Number(formData.allocatedStock),
        reorderPoint: Number(formData.reorderPoint),
        safetyStock: Number(formData.safetyStock)
      });

      setIsSubmitting(false);
      if (success) {
        onClose();
      } else {
        setErrorMessage('Failed to create item.');
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <div className="modal-header">
          <div>
            <h3 style={{ fontSize: '1.15rem' }}>
              {itemToEdit ? `Edit SKU: ${itemToEdit.sku}` : 'Create New Item Master'}
            </h3>
            {itemToEdit && (
              <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                OCC Version Token: v{itemToEdit.version} | Last Modified: {new Date(itemToEdit.updatedAt).toLocaleTimeString()}
              </span>
            )}
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
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {itemToEdit && (
              <div style={{ 
                background: 'rgba(99, 102, 241, 0.08)', 
                border: '1px dashed var(--accent-primary)', 
                borderRadius: 'var(--radius-md)', 
                padding: '0.65rem 1rem', 
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>
                  💡 <strong>Test Concurrency (Viva Demo):</strong> Trigger a background collision on this item before saving to test Optimistic Locking.
                </span>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => triggerBackgroundEditForItem(itemToEdit.id)}
                >
                  Bump Server v{itemToEdit.version + 1}
                </button>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">SKU Code (Natural Key)</label>
                <input
                  type="text"
                  className="form-input mono"
                  placeholder="e.g. SKU-MOTOR-45"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  disabled={!!itemToEdit}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Item / Component Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Brushless Gimbal Motor 24V"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Domain Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as ItemCategory })}
                >
                  <option value="ROBOTICS">Robotics & Actuators</option>
                  <option value="ELECTRONICS">Electronics & Sensors</option>
                  <option value="MECHANICAL">Mechanical & Reducers</option>
                  <option value="RAW_MATERIALS">Raw Materials & Alloys</option>
                  <option value="FINISHED_GOODS">Finished Assemblies</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Unit of Measure (UOM)</label>
                <select
                  className="form-select"
                  value={formData.uom}
                  onChange={(e) => setFormData({ ...formData, uom: e.target.value as UnitOfMeasure })}
                >
                  <option value="PCS">Pieces (PCS)</option>
                  <option value="KG">Kilograms (KG)</option>
                  <option value="METERS">Meters (M)</option>
                  <option value="SET">Set / Kit</option>
                  <option value="BOX">Box</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Current Stock (On-Hand)</label>
                <input
                  type="number"
                  className="form-input mono"
                  min="0"
                  value={formData.currentStock}
                  onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                  disabled={!!itemToEdit} // Stock modifications on existing items must go through stock adjustment flow
                />
                {itemToEdit && (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    *Use "Stock Adjustment" to change inventory with audit trail
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Allocated / Reserved</label>
                <input
                  type="number"
                  className="form-input mono"
                  min="0"
                  value={formData.allocatedStock}
                  onChange={(e) => setFormData({ ...formData, allocatedStock: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Reorder Threshold</label>
                <input
                  type="number"
                  className="form-input mono"
                  min="0"
                  value={formData.reorderPoint}
                  onChange={(e) => setFormData({ ...formData, reorderPoint: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Safety Stock Buffer</label>
                <input
                  type="number"
                  className="form-input mono"
                  min="0"
                  value={formData.safetyStock}
                  onChange={(e) => setFormData({ ...formData, safetyStock: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Unit Cost (₹ - INR)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input mono"
                  value={formData.unitCost}
                  onChange={(e) => setFormData({ ...formData, unitCost: Number(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Selling List Price (₹ - INR)</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input mono"
                  value={formData.sellingPrice}
                  onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Assigned Warehouse</label>
                <select
                  className="form-select"
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                >
                  {warehouses.map((wh) => (
                    <option key={wh.id} value={wh.id}>
                      {wh.name} ({wh.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Storage Bin / Aisle</label>
                <input
                  type="text"
                  className="form-input mono"
                  placeholder="e.g. CR-03-12"
                  value={formData.locationBin}
                  onChange={(e) => setFormData({ ...formData, locationBin: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Engineering Specifications & Notes</label>
              <textarea
                className="form-textarea"
                rows={2}
                placeholder="Technical description, tolerances, certifications..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              <span>{isSubmitting ? 'Validating & Saving...' : itemToEdit ? 'Save Changes' : 'Create Item Master'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

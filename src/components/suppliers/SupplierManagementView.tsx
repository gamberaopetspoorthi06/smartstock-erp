import React, { useState, useMemo } from 'react';
import { 
  Truck, Plus, Search, Edit3, Trash2, Phone, Mail, 
  MapPin, Clock, Star, CheckCircle2, ShoppingCart, X 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Supplier } from '../../types/erp';

export const SupplierManagementView: React.FC = () => {
  const { suppliers, createSupplier, updateSupplier, deleteSupplier, purchaseOrders, setActiveView } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    gstin: '',
    isActive: true,
    leadTimeDays: 3,
    rating: 4.8
  });

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.gstin.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suppliers, searchQuery]);

  const handleOpenAdd = () => {
    setEditingSupplier(null);
    setFormData({
      code: `VEN-IN-${Math.floor(100 + Math.random() * 900)}`,
      name: '',
      contactPerson: '',
      email: '',
      phone: '+91 ',
      address: '',
      gstin: '27AAAAA0000A1Z5',
      isActive: true,
      leadTimeDays: 3,
      rating: 4.8
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sup: Supplier) => {
    setEditingSupplier(sup);
    setFormData({
      code: sup.code,
      name: sup.name,
      contactPerson: sup.contactPerson,
      email: sup.email,
      phone: sup.phone,
      address: sup.address,
      gstin: sup.gstin,
      isActive: sup.isActive,
      leadTimeDays: sup.leadTimeDays,
      rating: sup.rating
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingSupplier) {
      await updateSupplier({
        ...editingSupplier,
        ...formData
      });
    } else {
      await createSupplier(formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove supplier "${name}"?`)) {
      await deleteSupplier(id);
    }
  };

  const getPOCount = (supplierId: string) => {
    return purchaseOrders.filter(po => po.vendorId === supplierId).length;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Metrics Strip */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #2563eb' }}>
          <div className="kpi-header">
            <span className="kpi-title">Registered Suppliers</span>
            <div className="kpi-icon-box" style={{ color: '#2563eb' }}><Truck size={16} /></div>
          </div>
          <div className="kpi-value">{suppliers.length}</div>
          <div className="kpi-subtext">
            <span>Verified vendor partners</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #16a34a' }}>
          <div className="kpi-header">
            <span className="kpi-title">Active Procurement Channels</span>
            <div className="kpi-icon-box" style={{ color: '#16a34a' }}><CheckCircle2 size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#16a34a' }}>
            {suppliers.filter(s => s.isActive).length}
          </div>
          <div className="kpi-subtext">
            <span>Ready for PO dispatch</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #0891b2' }}>
          <div className="kpi-header">
            <span className="kpi-title">Average Lead Time</span>
            <div className="kpi-icon-box" style={{ color: '#0891b2' }}><Clock size={16} /></div>
          </div>
          <div className="kpi-value">
            {Math.round(suppliers.reduce((acc, s) => acc + s.leadTimeDays, 0) / (suppliers.length || 1))} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>days</span>
          </div>
          <div className="kpi-subtext">
            <span>Order placement to goods arrival</span>
          </div>
        </div>

        <div className="kpi-card glass-panel" style={{ borderLeft: '4px solid #d97706' }}>
          <div className="kpi-header">
            <span className="kpi-title">Average Vendor Rating</span>
            <div className="kpi-icon-box" style={{ color: '#d97706' }}><Star size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: '#d97706' }}>
            {(suppliers.reduce((acc, s) => acc + s.rating, 0) / (suppliers.length || 1)).toFixed(1)} / 5.0
          </div>
          <div className="kpi-subtext">
            <span>Fulfillment quality & SLA score</span>
          </div>
        </div>
      </div>

      {/* Control & Search Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search suppliers by name, code, contact person, or GSTIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
          <Plus size={14} />
          <span>Add New Supplier</span>
        </button>
      </div>

      {/* Supplier Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
        {filteredSuppliers.map(sup => (
          <div key={sup.id} className="card" style={{ padding: '1.25rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="mono" style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 800 }}>
                    {sup.code}
                  </span>
                  <span className={`badge ${sup.isActive ? 'badge-optimal' : 'badge-danger'}`} style={{ fontSize: '0.65rem' }}>
                    {sup.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
                  {sup.name}
                </h3>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ padding: '0.25rem 0.45rem' }}
                  onClick={() => handleOpenEdit(sup)}
                  title="Edit Supplier"
                >
                  <Edit3 size={13} />
                </button>
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ padding: '0.25rem 0.45rem', color: '#dc2626' }}
                  onClick={() => handleDelete(sup.id, sup.name)}
                  title="Delete Supplier"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Contact:</span>
                <span>{sup.contactPerson}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={13} color="#64748b" />
                <span className="mono">{sup.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={13} color="#64748b" />
                <span>{sup.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={13} color="#64748b" />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sup.address}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>GSTIN:</span>
                <span className="mono" style={{ background: '#f1f5f9', padding: '0.1rem 0.4rem', borderRadius: 4, fontWeight: 700, color: '#0f172a' }}>
                  {sup.gstin}
                </span>
              </div>
            </div>

            {/* Performance Strip */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              background: 'var(--bg-surface-2)', 
              padding: '0.6rem 0.85rem', 
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.78rem'
            }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Lead Time: </span>
                <strong style={{ color: '#0f172a' }}>{sup.leadTimeDays} Days</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Star size={13} fill="#d97706" color="#d97706" />
                <strong style={{ color: '#0f172a' }}>{sup.rating}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Orders: </span>
                <strong style={{ color: '#2563eb' }}>{getPOCount(sup.id)}</strong>
              </div>
            </div>

            {/* Quick Action Button */}
            <button 
              className="btn btn-secondary btn-sm" 
              style={{ width: '100%', justifyContent: 'center', marginTop: 'auto' }}
              onClick={() => setActiveView('PURCHASE_ORDERS')}
            >
              <ShoppingCart size={13} />
              <span>Raise PO with {sup.name.split(' ')[0]}</span>
            </button>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                {editingSupplier ? `Edit Supplier: ${editingSupplier.name}` : 'Register New Vendor Partner'}
              </h2>
              <button className="btn btn-outline btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Vendor Code</label>
                    <input 
                      type="text" 
                      className="form-input mono" 
                      value={formData.code} 
                      onChange={e => setFormData({ ...formData, code: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company / Vendor Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Havells India Ltd." 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Contact Person</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Rajesh Sharma" 
                      value={formData.contactPerson} 
                      onChange={e => setFormData({ ...formData, contactPerson: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">GSTIN (India)</label>
                    <input 
                      type="text" 
                      className="form-input mono" 
                      placeholder="e.g. 07AAACH1234A1Z5" 
                      value={formData.gstin} 
                      onChange={e => setFormData({ ...formData, gstin: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input 
                      type="text" 
                      className="form-input mono" 
                      placeholder="+91 98765 43210" 
                      value={formData.phone} 
                      onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input 
                      type="email" 
                      className="form-input" 
                      placeholder="orders@vendor.com" 
                      value={formData.email} 
                      onChange={e => setFormData({ ...formData, email: e.target.value })} 
                      required 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Warehouse / Hub Address</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Sector 18, Udyog Vihar, Gurugram, Haryana" 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })} 
                    required 
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Average Lead Time (Days)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="60" 
                      className="form-input mono" 
                      value={formData.leadTimeDays} 
                      onChange={e => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })} 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Supplier Rating (1 to 5)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      step="0.1" 
                      className="form-input mono" 
                      value={formData.rating} 
                      onChange={e => setFormData({ ...formData, rating: Number(e.target.value) })} 
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <span>{editingSupplier ? 'Save Changes' : 'Register Supplier'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { 
  Receipt, ShoppingBag, Plus, Minus, Trash2, CheckCircle2, 
  IndianRupee, Search, User, Phone, CreditCard, Printer, 
  Sparkles, X, History, ArrowRight
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Item, Sale } from '../../types/erp';

interface CartItem {
  item: Item;
  quantity: number;
}

export const SalesTerminalView: React.FC = () => {
  const { items, sales, recordSale } = useERP();

  // Active Tab: Terminal vs History
  const [activeTab, setActiveTab] = useState<'TERMINAL' | 'HISTORY'>('TERMINAL');

  // POS State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('+91 ');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CASH' | 'CARD' | 'NET_BANKING'>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);

  // Invoice Modal State
  const [completedInvoice, setCompletedInvoice] = useState<Sale | null>(null);

  // Filter Catalog
  const filteredCatalog = useMemo(() => {
    return items.filter(it => {
      const matchesSearch = 
        it.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        it.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'ALL' || it.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [items, searchQuery, selectedCategory]);

  // Cart Calculations (in INR ₹)
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, ci) => sum + (ci.quantity * ci.item.sellingPrice), 0);
  }, [cart]);

  const gstAmount = cartSubtotal * 0.18; // 18% GST (9% CGST + 9% SGST)
  const cartTotal = cartSubtotal + gstAmount;

  const addToCart = (product: Item) => {
    if (product.currentStock <= 0) {
      alert(`Cannot add ${product.name}. Stock is depleted!`);
      return;
    }

    const existingIndex = cart.findIndex(c => c.item.id === product.id);
    if (existingIndex >= 0) {
      const currentCartQty = cart[existingIndex].quantity;
      if (currentCartQty + 1 > product.currentStock) {
        alert(`Cannot add more. Only ${product.currentStock} units available in stock!`);
        return;
      }
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { item: product, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId: string, delta: number) => {
    const updated = cart.map(ci => {
      if (ci.item.id === itemId) {
        const nextQty = ci.quantity + delta;
        if (nextQty > ci.item.currentStock) {
          alert(`Maximum available stock reached (${ci.item.currentStock} units)`);
          return ci;
        }
        return nextQty > 0 ? { ...ci, quantity: nextQty } : null;
      }
      return ci;
    }).filter(Boolean) as CartItem[];

    setCart(updated);
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.item.id !== itemId));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Please add at least one product to the bill.');
      return;
    }

    setIsProcessing(true);
    const salePayload = {
      customerName: customerName.trim() || 'Retail Customer',
      customerPhone: customerPhone.trim() || undefined,
      paymentMethod,
      items: cart.map(c => ({
        itemId: c.item.id,
        quantity: c.quantity
      }))
    };

    const res = await recordSale(salePayload);
    setIsProcessing(false);

    if (res.success) {
      try {
        confetti({ particleCount: 75, spread: 60, origin: { y: 0.6 } });
      } catch {}

      // Build invoice to display modal
      const dummyInvoice: Sale = {
        id: `sale-${Date.now()}`,
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: salePayload.customerName,
        customerPhone: salePayload.customerPhone,
        items: cart.map((c, i) => ({
          id: `line-${i}`,
          itemId: c.item.id,
          sku: c.item.sku,
          itemName: c.item.name,
          quantity: c.quantity,
          unitPrice: c.item.sellingPrice,
          lineTotal: c.quantity * c.item.sellingPrice
        })),
        subtotal: cartSubtotal,
        taxAmount: gstAmount,
        totalAmount: cartTotal,
        paymentMethod: salePayload.paymentMethod,
        paymentStatus: 'PAID',
        timestamp: new Date().toISOString(),
        createdBy: 'Admin Cashier'
      };

      setCompletedInvoice(dummyInvoice);
      setCart([]);
      setCustomerName('Walk-in Customer');
    } else {
      alert(res.errorMessage || 'Failed to complete checkout.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header / Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            className={`btn ${activeTab === 'TERMINAL' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('TERMINAL')}
          >
            <Receipt size={14} />
            <span>POS Billing Counter</span>
          </button>
          <button 
            className={`btn ${activeTab === 'HISTORY' ? 'btn-primary' : 'btn-outline'} btn-sm`}
            onClick={() => setActiveTab('HISTORY')}
          >
            <History size={14} />
            <span>Sales & Invoice History ({sales.length})</span>
          </button>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Standard GST 18% (9% CGST + 9% SGST) applied
        </div>
      </div>

      {activeTab === 'TERMINAL' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '1.25rem', alignItems: 'start' }}>
          {/* Left Column: Product Selection Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Filter bar */}
            <div className="filter-bar" style={{ margin: 0 }}>
              <div className="search-input-wrap">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search item by name or SKU..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                style={{ width: 'auto' }}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="ALL">All Categories</option>
                <option value="Electrical Supplies">Electrical Supplies</option>
                <option value="Power Tools & Hardware">Power Tools & Hardware</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Industrial Fasteners">Industrial Fasteners</option>
                <option value="Safety & PPE Equipment">Safety & PPE</option>
              </select>
            </div>

            {/* Catalog Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.85rem' }}>
              {filteredCatalog.map(product => {
                const isOutOfStock = product.currentStock <= 0;
                const inCart = cart.find(c => c.item.id === product.id);

                return (
                  <div 
                    key={product.id}
                    className="card"
                    style={{ 
                      padding: '1rem', 
                      background: '#ffffff',
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      opacity: isOutOfStock ? 0.6 : 1,
                      border: inCart ? '2px solid #2563eb' : '1px solid var(--border-subtle)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <span className="mono" style={{ fontSize: '0.72rem', color: '#2563eb', fontWeight: 800 }}>
                          {product.sku}
                        </span>
                        <span className={`badge ${product.currentStock > 10 ? 'badge-optimal' : product.currentStock > 0 ? 'badge-warning' : 'badge-danger'}`} style={{ fontSize: '0.62rem' }}>
                          {product.currentStock} {product.uom}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.35rem' }}>
                        {product.name}
                      </h4>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {product.category}
                      </div>
                    </div>

                    <div style={{ marginTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="mono" style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        ₹{product.sellingPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </div>

                      <button
                        className="btn btn-primary btn-sm"
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
                        disabled={isOutOfStock}
                        onClick={() => addToCart(product)}
                      >
                        <Plus size={13} />
                        <span>{inCart ? `Add (${inCart.quantity})` : 'Add'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Checkout & Cart Panel */}
          <div className="card" style={{ padding: '1.25rem', background: '#ffffff', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShoppingBag size={18} color="#2563eb" />
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Current Bill Cart</span>
              </div>
              <span className="badge badge-info">{cart.length} Products</span>
            </div>

            {/* Customer Inputs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Customer Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={13} style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }} />
                  <input
                    type="text"
                    className="form-input"
                    style={{ paddingLeft: '2rem', fontSize: '0.82rem' }}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={13} style={{ position: 'absolute', left: 10, top: 10, color: '#64748b' }} />
                  <input
                    type="text"
                    className="form-input mono"
                    style={{ paddingLeft: '2rem', fontSize: '0.82rem' }}
                    placeholder="+91 98765 43210"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Payment Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
                  {(['UPI', 'CASH', 'CARD', 'NET_BANKING'] as const).map(pm => (
                    <button
                      key={pm}
                      type="button"
                      className={`btn btn-sm ${paymentMethod === pm ? 'btn-primary' : 'btn-outline'}`}
                      style={{ fontSize: '0.72rem', justifyContent: 'center' }}
                      onClick={() => setPaymentMethod(pm)}
                    >
                      {pm}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div style={{ 
              maxHeight: '230px', 
              overflowY: 'auto', 
              border: '1px solid var(--border-subtle)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '0.5rem',
              background: '#f8fafc' 
            }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  No items in cart. Click "+ Add" on items to bill.
                </div>
              ) : (
                cart.map(ci => (
                  <div 
                    key={ci.item.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '0.45rem 0', 
                      borderBottom: '1px solid #e2e8f0',
                      fontSize: '0.8rem' 
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{ci.item.name}</div>
                      <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        ₹{ci.item.sellingPrice} × {ci.quantity}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.15rem 0.35rem' }}
                        onClick={() => updateQuantity(ci.item.id, -1)}
                      >
                        <Minus size={11} />
                      </button>
                      <span className="mono" style={{ fontWeight: 800, minWidth: '18px', textAlign: 'center' }}>
                        {ci.quantity}
                      </span>
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.15rem 0.35rem' }}
                        onClick={() => updateQuantity(ci.item.id, 1)}
                      >
                        <Plus size={11} />
                      </button>
                      <button 
                        className="btn btn-outline btn-sm" 
                        style={{ padding: '0.15rem 0.35rem', color: '#dc2626' }}
                        onClick={() => removeFromCart(ci.item.id)}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>

                    <div className="mono" style={{ fontWeight: 800, textAlign: 'right', minWidth: '70px' }}>
                      ₹{(ci.quantity * ci.item.sellingPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Bill Summary */}
            <div style={{ 
              background: '#f1f5f9', 
              padding: '0.85rem', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.82rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>Items Subtotal:</span>
                <span className="mono">₹{cartSubtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                <span>GST (18% - CGST 9% + SGST 9%):</span>
                <span className="mono">₹{gstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                borderTop: '1px solid #cbd5e1', 
                paddingTop: '0.45rem',
                fontSize: '1.05rem',
                fontWeight: 800,
                color: '#0f172a'
              }}>
                <span>Total Amount:</span>
                <span className="mono" style={{ color: '#16a34a' }}>
                  ₹{cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontWeight: 800 }}
              disabled={cart.length === 0 || isProcessing}
              onClick={handleCheckout}
            >
              <CheckCircle2 size={16} />
              <span>{isProcessing ? 'Processing Payment & Stock...' : `Complete Sale (₹${cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })})`}</span>
            </button>
          </div>
        </div>
      ) : (
        /* History Tab */
        <div className="card" style={{ padding: '0', background: '#ffffff', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Date & Time</th>
                  <th>Customer</th>
                  <th>Payment Method</th>
                  <th style={{ textAlign: 'right' }}>Items Count</th>
                  <th style={{ textAlign: 'right' }}>Total (₹)</th>
                  <th style={{ textAlign: 'center' }}>Status</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {sales.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2.5rem' }}>
                      No sales recorded yet. Process an order using the billing counter above!
                    </td>
                  </tr>
                ) : (
                  sales.map(s => (
                    <tr key={s.id}>
                      <td>
                        <span className="mono" style={{ fontWeight: 800, color: '#2563eb' }}>
                          {s.invoiceNumber}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(s.timestamp).toLocaleString()}
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.customerName}</div>
                        {s.customerPhone && (
                          <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                            {s.customerPhone}
                          </div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.68rem' }}>
                          {s.paymentMethod}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }} className="mono">
                        {s.items.reduce((acc, it) => acc + it.quantity, 0)} units
                      </td>
                      <td style={{ textAlign: 'right' }} className="mono">
                        <strong style={{ color: '#16a34a', fontSize: '0.95rem' }}>
                          ₹{s.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </strong>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className="badge badge-optimal">Paid in Full</span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
                          onClick={() => setCompletedInvoice(s)}
                        >
                          <Printer size={12} />
                          <span>View Invoice</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tax Invoice Modal */}
      {completedInvoice && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '650px', background: '#ffffff', color: '#0f172a' }}>
            <div className="modal-header" style={{ borderBottom: '2px solid #e2e8f0' }}>
              <div>
                <span className="badge badge-optimal" style={{ marginBottom: 4 }}>TAX INVOICE / CASH MEMO</span>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>
                  SmartStock Enterprise Retail
                </h2>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  GSTIN: 07AAACH1234A1Z5 | Haryana Supply Hub, India
                </div>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => setCompletedInvoice(null)}>
                <X size={15} />
              </button>
            </div>

            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              {/* Metadata strip */}
              <div style={{ display: 'flex', justifyContent: 'space-between', background: '#f8fafc', padding: '0.75rem', borderRadius: 6, border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>INVOICE NO:</div>
                  <div className="mono" style={{ fontWeight: 800, color: '#2563eb' }}>{completedInvoice.invoiceNumber}</div>
                  <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 4 }}>DATE:</div>
                  <div>{new Date(completedInvoice.timestamp).toLocaleString()}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#64748b', fontSize: '0.72rem' }}>BILLED TO:</div>
                  <div style={{ fontWeight: 800 }}>{completedInvoice.customerName}</div>
                  {completedInvoice.customerPhone && <div className="mono">{completedInvoice.customerPhone}</div>}
                  <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 4 }}>PAYMENT MODE:</div>
                  <div className="badge badge-optimal">{completedInvoice.paymentMethod}</div>
                </div>
              </div>

              {/* Items Table */}
              <table className="data-table" style={{ fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th style={{ textAlign: 'right' }}>Qty</th>
                    <th style={{ textAlign: 'right' }}>Rate (₹)</th>
                    <th style={{ textAlign: 'right' }}>Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {completedInvoice.items.map((line, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{line.itemName}</div>
                        <div className="mono" style={{ fontSize: '0.68rem', color: '#64748b' }}>SKU: {line.sku}</div>
                      </td>
                      <td style={{ textAlign: 'right' }} className="mono">{line.quantity}</td>
                      <td style={{ textAlign: 'right' }} className="mono">₹{line.unitPrice.toFixed(2)}</td>
                      <td style={{ textAlign: 'right' }} className="mono">₹{line.lineTotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total Calculation */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <span style={{ color: '#64748b' }}>Taxable Subtotal:</span>
                  <span className="mono">₹{completedInvoice.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <span style={{ color: '#64748b' }}>CGST (9%):</span>
                  <span className="mono">₹{(completedInvoice.taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <span style={{ color: '#64748b' }}>SGST (9%):</span>
                  <span className="mono">₹{(completedInvoice.taxAmount / 2).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', gap: '2rem', fontSize: '1.15rem', fontWeight: 900, color: '#16a34a', borderTop: '2px solid #0f172a', paddingTop: '0.35rem' }}>
                  <span>Grand Total (INR):</span>
                  <span className="mono">₹{completedInvoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', marginTop: '0.5rem' }}>
                Thank you for your business! Computer-generated tax invoice valid under GST Rules, 2017.
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setCompletedInvoice(null)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => window.print()}>
                <Printer size={15} />
                <span>Print Official Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

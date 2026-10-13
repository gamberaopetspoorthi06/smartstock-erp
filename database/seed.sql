-- ==============================================================================
-- SmartStock ERP – Indian Market Seed Data (All prices in Indian Rupees ₹ - INR)
-- ==============================================================================

USE smartstock_db;

-- 1. Insert Initial Users (Passwords hashed with BCrypt)
-- admin / admin123  (BCrypt hash: $2a$10$wT8K.H4q5kS3u3Y2x8t5vef9o2nF3nIeM5fD9rO7mB4q5tK8lO3y2)
-- staff / staff123  (BCrypt hash: $2a$10$sX8N.K5t6lT4v4Z3y9u6wgf0p3oG4oJfN6gE0sP8nC5r6uL9mP4z3)
INSERT INTO users (username, email, password_hash, role, full_name) VALUES
('admin', 'admin@smartstock.in', '$2a$10$wT8K.H4q5kS3u3Y2x8t5vef9o2nF3nIeM5fD9rO7mB4q5tK8lO3y2', 'ADMIN', 'Rajesh Sharma (System Admin)'),
('staff', 'staff@smartstock.in', '$2a$10$sX8N.K5t6lT4v4Z3y9u6wgf0p3oG4oJfN6gE0sP8nC5r6uL9mP4z3', 'INVENTORY_STAFF', 'Priya Patel (Inventory Officer)');

-- 2. Insert Categories
INSERT INTO categories (name, description) VALUES
('Electrical Supplies', 'Industrial and residential wiring, cables, and modular switches'),
('Power Tools & Hardware', 'Professional grade drills, angle grinders, and heavy fasteners'),
('Home Appliances', 'Ceiling fans, storage geysers, and ventilation units'),
('Industrial Fasteners', 'High-tensile zinc plated nuts, bolts, and structural anchors'),
('Safety & PPE Equipment', 'ISI certified industrial helmets, gloves, and protective gear');

-- 3. Insert Indian Suppliers
INSERT INTO suppliers (name, contact_person, email, phone, address, gstin) VALUES
('Havells India Electricals Ltd', 'Vikram Malhotra', 'orders@havells-supply.in', '+91 98201 44521', 'Noida Industrial Area, Phase II, UP - 201305', '09AAACH2241K1ZV'),
('Tata Steel & Fasteners Corp', 'Anil Deshmukh', 'enterprise@tatasteel-fasteners.com', '+91 98112 55432', 'Jamshedpur Works, Jharkhand - 831001', '20AAACT2727Q1ZW'),
('Crompton Greaves Consumer Ltd', 'Sunita Rao', 'distribution@crompton-west.in', '+91 98450 33211', 'Kanjurmarg East, Mumbai, MH - 400042', '27AAACC2034R1ZT'),
('Schneider Electric India Pvt Ltd', 'Amitabh Verma', 'b2b@se-india.com', '+91 98765 11223', 'Whitefield Cyber Park, Bengaluru, KA - 560066', '29AAACS3948N1ZX');

-- 4. Insert Products with Prices in INR (₹)
INSERT INTO products (sku, name, description, category_id, supplier_id, purchase_price, selling_price, quantity_available, min_stock_level) VALUES
('SKU-HAVL-CABLE-2.5', 'Havells 2.5 Sq mm Copper FR Cable (90m Roll)', 'Flame retardant 100% pure electrolytic grade copper roll for home wiring', 1, 1, 2150.00, 2599.00, 45, 20),
('SKU-CROM-FAN-1200', 'Crompton Silent Pro 1200mm BLDC Ceiling Fan', '5-star energy saving smart BLDC motor with RF remote control', 3, 3, 2200.00, 2899.00, 14, 15),
('SKU-TATA-BOLT-M12', 'Tata High-Tensile Hex Bolt M12 x 50mm (Pack of 50)', 'Grade 8.8 zinc plated corrosion resistant structural bolts', 4, 2, 450.00, 650.00, 180, 50),
('SKU-SCHN-MCB-16A', 'Schneider Acti9 16A Single Pole MCB C-Curve', '10kA breaking capacity miniature circuit breaker for overload protection', 1, 4, 185.00, 245.00, 85, 30),
('SKU-BAJAJ-GEYSER-25', 'Bajaj New Shakti Neo 25L Storage Water Heater', 'Titanium armor technology inner tank with magnesium anode protection', 3, 3, 6800.00, 8499.00, 6, 10),
('SKU-BOSCH-GRIND-850', 'Bosch GWS 850W Heavy-Duty Angle Grinder 100mm', 'Compact ergonomic metal and concrete cutting power tool', 2, 2, 2650.00, 3250.00, 22, 10),
('SKU-SAFE-HELMET-ISI', 'Karam ISI Certified Industrial Safety Helmet Ratchet', 'High-density polyethylene shell with 6-point textile suspension', 5, 2, 220.00, 360.00, 50, 25),
('SKU-ANCHOR-SW-6A', 'Anchor Roma Classic 1-Way Modular Switch 6A (Box of 20)', 'Sleek polycarbonate spark-shielded rocker switches for home interior', 1, 1, 420.00, 580.00, 110, 40);

-- 5. Insert Sample Purchase Orders
INSERT INTO purchase_orders (po_number, supplier_id, status, subtotal, tax_amount, total_amount, expected_delivery_date, created_by) VALUES
('PO-2026-IN-0101', 1, 'RECEIVED', 43000.00, 7740.00, 50740.00, '2026-10-05', 1),
('PO-2026-IN-0102', 3, 'APPROVED', 40800.00, 7344.00, 48144.00, '2026-10-18', 1),
('PO-2026-IN-0103', 2, 'DRAFT', 22500.00, 4050.00, 26550.00, '2026-10-25', 2);

-- Purchase Order Items
INSERT INTO purchase_order_items (purchase_order_id, product_id, quantity_ordered, quantity_received, unit_price, line_total) VALUES
(1, 1, 20, 20, 2150.00, 43000.00),
(2, 5, 6, 0, 6800.00, 40800.00),
(3, 3, 50, 0, 450.00, 22500.00);

-- 6. Insert Recent Inventory Movement History
INSERT INTO inventory_transactions (product_id, transaction_type, quantity, balance_before, balance_after, reference_type, reference_id, reason, performed_by) VALUES
(1, 'PURCHASE_RECEIPT', 20, 25, 45, 'PURCHASE_ORDER', 'PO-2026-IN-0101', 'Goods Receipt Note (GRN) inward delivery from Havells', 'Priya Patel'),
(2, 'SALE_ISSUE', -2, 16, 14, 'SALE_INVOICE', 'INV-2026-042', 'Retail billing to client M/s Shanti Builders', 'Priya Patel'),
(5, 'ADJUSTMENT_OUT', -1, 7, 6, 'MANUAL_ADJUSTMENT', 'ADJ-2026-009', 'Display piece internal demonstration write-off', 'Rajesh Sharma');

-- 7. Insert Low-Stock Alerts
INSERT INTO stock_alerts (product_id, alert_type, current_quantity, min_stock_level, recommended_reorder_qty, is_resolved) VALUES
(2, 'LOW_STOCK', 14, 15, 20, FALSE),
(5, 'LOW_STOCK', 6, 10, 15, FALSE);

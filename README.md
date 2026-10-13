# SmartStock ERP – AI-Powered Inventory Management System
> **3rd Year B.Tech Computer Science & Engineering Minor Project**  
> *Operating Currency: Indian Rupees (INR - ₹)*

---

## 📌 Project Overview
**SmartStock ERP** is a full-stack, enterprise-grade inventory management system designed for small businesses, retail shops, and distribution warehouses. Built with a modern **React 19 + Vite** frontend, **Spring Boot 3 REST API** backend, **FastAPI Machine Learning** demand forecasting microservice, and **MySQL 8** relational database.

All prices, valuations, purchase orders, ledger entries, and tax invoices strictly operate in **Indian Rupees (`₹` - INR)**.

---

## 🌟 10 Core Functional Modules

| # | Module Name | Key Features |
| :- | :--- | :--- |
| **1** | **Authentication & RBAC** | Role-based access control (`ROLE_ADMIN` vs `ROLE_INVENTORY_STAFF`), JWT token handling, instant role switching for grading/testing. |
| **2** | **Live Operations Dashboard** | Real-time KPI summary cards in ₹, Recharts graphical valuation breakdown by category, 7-day sales revenue velocity, recent movement logs. |
| **3** | **Product Master Catalog** | Complete CRUD, natural SKU uniqueness validation, UOM (`PCS`, `ROLL`, `BOX`, `SET`, `KG`), bin locations, Optimistic Concurrency Control (OCC) collision simulator. |
| **4** | **Inventory Transactions Ledger** | Double-entry stock movement tracking (`PURCHASE_RECEIPT`, `SALE_ISSUE`, `MANUAL_ADJUSTMENT`, `DAMAGE_WRITE_OFF`), balance tracker (`balanceBefore → balanceAfter`), ₹ valuation. |
| **5** | **Supplier Management** | Verified Indian vendor registry, GSTIN records, phone, email, lead time tracking (days), SLA rating, 1-click PO generator. |
| **6** | **Procurement & Purchase Orders** | Multi-item purchase order generation, 18% GST calculation in ₹, workflow (`DRAFT` → `APPROVED` → `RECEIVED`), automated Goods Receipt Note (GRN) stock increment. |
| **7** | **Sales Management & POS Terminal** | Point-of-Sale retail billing counter, instant stock decrement, UPI / Cash / Card modes, CGST (9%) + SGST (9%) calculation, printable official Tax Invoice. |
| **8** | **Low-Stock & Depletion Alerts** | Threshold monitoring against safety stock, categorized as *Depleted* or *Low Stock*, auto-calculated recommended replenishment quantities and required capital in ₹. |
| **9** | **Reports & Analytics with CSV Export** | Valuation share analysis, revenue totals, one-click browser CSV export for Products, Stock Movements, Sales Register, and Purchase Orders. |
| **10**| **AI Demand Forecasting** | Predictive ML engine (Holt-Winters exponential smoothing & moving average), 7/14/30-day forecast horizon, interactive Recharts graph with 95% confidence intervals, suggested reorder calculations in ₹. |

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Recharts 3, Lucide React, Canvas Confetti
- **Backend:** Spring Boot 3, Java 17, Spring Data JPA, Spring Security 6, JJWT, H2 In-Memory / MySQL 8
- **AI Microservice:** Python 3, FastAPI, Uvicorn, Pandas, Scikit-learn
- **Database:** MySQL 8 Relational Database (3NF schema with foreign key constraints)

---

## 🚀 How to Run the Project

### 1. Instant Interactive Web App (Running Live)
The application is active and running at:
👉 **[http://localhost:5173/](http://localhost:5173/)**

Or double-click `run.bat` in the project root folder.

### 2. Spring Boot Backend (Optional Java Execution)
```bash
cd backend
mvn clean spring-boot:run
```
- REST Endpoints: `http://localhost:8080/api/items`
- H2 In-Memory Console: `http://localhost:8080/h2-console`
- Actuator Health: `http://localhost:8080/actuator/health`

### 3. AI Demand Forecasting Microservice (FastAPI)
```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --port 8000 --reload
```
- Swagger Interactive Documentation: `http://localhost:8000/docs`

### 4. Docker Deployment
```bash
docker-compose up --build
```

---

## 🎓 Viva Q&A Cheat Sheet (For University Evaluation)

1. **How is negative stock prevented in this ERP?**
   - Both the frontend POS terminal and the Spring Boot service layer validate `currentStock >= requestedQuantity`. If requested exceeds available, an exception is thrown before any ledger or balance change is committed.
2. **How does the Goods Receipt Note (GRN) update stock and finance?**
   - Receiving an approved Purchase Order atomically increments on-hand quantity for every line item, generates immutable `StockMovement` logs, and posts balanced debit/credit entries between `1300 - Inventory Asset` and `2000 - Accounts Payable`.
3. **How does the AI Stock Demand Predictor work?**
   - It computes the historical daily velocity of each SKU, applies exponential smoothing with weekly seasonal weighting, and forecasts required safety buffer and economic reorder quantity (EOQ) in Indian Rupees (₹).

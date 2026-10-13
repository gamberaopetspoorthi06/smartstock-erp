import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { ItemCatalog } from './components/inventory/ItemCatalog';
import { InventoryLedgerView } from './components/inventory/InventoryLedgerView';
import { SupplierManagementView } from './components/suppliers/SupplierManagementView';
import { PurchaseOrderList } from './components/procurement/PurchaseOrderList';
import { SalesTerminalView } from './components/sales/SalesTerminalView';
import { StockAlertsView } from './components/alerts/StockAlertsView';
import { ForecastView } from './components/forecast/ForecastView';
import { ReportsView } from './components/reports/ReportsView';
import { ConflictModal } from './components/resilience/ConflictModal';
import { ChatbotDrawer } from './components/ai/ChatbotDrawer';
import { ErrorBoundary } from './components/resilience/ErrorBoundary';

const MainViewRouter: React.FC = () => {
  const { activeView } = useERP();

  switch (activeView) {
    case 'DASHBOARD':       return <DashboardView />;
    case 'PRODUCTS':        return <ItemCatalog />;
    case 'INVENTORY':       return <InventoryLedgerView />;
    case 'SUPPLIERS':       return <SupplierManagementView />;
    case 'PURCHASE_ORDERS': return <PurchaseOrderList />;
    case 'SALES':           return <SalesTerminalView />;
    case 'LOW_STOCK_ALERTS':return <StockAlertsView />;
    case 'FORECAST':        return <ForecastView />;
    case 'REPORTS':         return <ReportsView />;
    default:                return <DashboardView />;
  }
};

export const AppContent: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Header />
        <div className="content-body">
          <MainViewRouter />
        </div>
      </main>
      <ChatbotDrawer />
      <ConflictModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ERPProvider>
        <AppContent />
      </ERPProvider>
    </ErrorBoundary>
  );
}

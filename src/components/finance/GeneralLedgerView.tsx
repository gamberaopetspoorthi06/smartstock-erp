import React, { useState } from 'react';
import { 
  BookOpen, CheckCircle, Search, Scale, 
  ArrowUpRight, ArrowDownLeft, ShieldCheck, IndianRupee
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { SkeletonTable } from '../resilience/SkeletonTable';
import { EmptyState } from '../resilience/EmptyState';

export const GeneralLedgerView: React.FC = () => {
  const { ledgerEntries, isLoading } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');

  const filteredEntries = ledgerEntries.filter((entry) => {
    const matchesSearch = 
      entry.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.sourceRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.debitAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.creditAccount.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesModule = moduleFilter === 'ALL' || entry.sourceModule === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const totalDebits = ledgerEntries.reduce((acc, curr) => acc + curr.debitAmount, 0);
  const totalCredits = ledgerEntries.reduce((acc, curr) => acc + curr.creditAmount, 0);
  const isBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  // Account Balances
  const inventoryAssetBalance = ledgerEntries.reduce((sum, e) => {
    let delta = 0;
    if (e.debitAccount.includes('1300')) delta += e.debitAmount;
    if (e.creditAccount.includes('1300')) delta -= e.creditAmount;
    return sum + delta;
  }, 0);

  const accountsPayableBalance = ledgerEntries.reduce((sum, e) => {
    let delta = 0;
    if (e.creditAccount.includes('2000')) delta += e.creditAmount;
    if (e.debitAccount.includes('2000')) delta -= e.debitAmount;
    return sum + delta;
  }, 0);

  return (
    <div>
      {/* Financial Health & Trial Balance Banner */}
      <div className="kpi-grid">
        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-title">Trial Balance Integrity</span>
            <div className="kpi-icon-box" style={{ color: '#15803d' }}><Scale size={16} /></div>
          </div>
          <div className="kpi-value" style={{ color: isBalanced ? '#15803d' : '#b91c1c', fontSize: '1.4rem' }}>
            {isBalanced ? 'Balanced (Debits = Credits)' : 'Imbalance Detected'}
          </div>
          <div className="kpi-subtext">
            <span>Total Journal Volume: ₹{totalDebits.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-title">1300 - Inventory Asset Account</span>
            <div className="kpi-icon-box" style={{ color: '#2563eb' }}><BookOpen size={16} /></div>
          </div>
          <div className="kpi-value mono" style={{ color: '#0f172a' }}>
            ₹{inventoryAssetBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>Debit Balance (Current Realized Asset)</span>
          </div>
        </div>

        <div className="kpi-card glass-panel">
          <div className="kpi-header">
            <span className="kpi-title">2000 - Accounts Payable (AP)</span>
            <div className="kpi-icon-box" style={{ color: '#b45309' }}><IndianRupee size={16} /></div>
          </div>
          <div className="kpi-value mono" style={{ color: '#b45309' }}>
            ₹{accountsPayableBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="kpi-subtext">
            <span>Credit Balance (Outstanding Supplier Invoices)</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search journal entries by reference, account code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.6rem 0.85rem' }}
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
          >
            <option value="ALL">All Source Domains</option>
            <option value="INVENTORY">Inventory Adjustments</option>
            <option value="PROCUREMENT">Procurement Receipts (GRN)</option>
            <option value="FINANCE">Direct Disbursements</option>
          </select>
        </div>
      </div>

      {/* Loading Skeletons vs Data Table vs Empty State */}
      {isLoading ? (
        <SkeletonTable rows={6} columns={6} />
      ) : filteredEntries.length === 0 ? (
        <EmptyState
          title="No Ledger Entries Found"
          description="No accounting records match your search criteria. Process inventory transactions or goods receipts to generate entries."
          icon={<BookOpen size={32} />}
        />
      ) : (
        <div className="table-container glass-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Journal Reference</th>
                <th>Source Domain & Trigger</th>
                <th>Transaction Memo / Description</th>
                <th>Debit Account (DR)</th>
                <th>Credit Account (CR)</th>
                <th style={{ textAlign: 'right' }}>Amount (₹ - INR)</th>
                <th style={{ textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <div>
                      <span className="mono" style={{ fontWeight: 800, color: '#2563eb', fontSize: '0.88rem' }}>
                        {entry.entryNumber}
                      </span>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div>
                      <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>
                        {entry.sourceModule}
                      </span>
                      <div className="mono" style={{ fontSize: '0.72rem', color: '#2563eb', marginTop: '0.2rem' }}>
                        Ref: {entry.sourceRef}
                      </div>
                    </div>
                  </td>

                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', maxWidth: 320 }}>
                      {entry.description}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ArrowUpRight size={14} color="#15803d" />
                      <span className="mono" style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 600 }}>
                        {entry.debitAccount}
                      </span>
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ArrowDownLeft size={14} color="#b91c1c" />
                      <span className="mono" style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 600 }}>
                        {entry.creditAccount}
                      </span>
                    </div>
                  </td>

                  <td style={{ textAlign: 'right' }}>
                    <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
                      ₹{entry.debitAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    {entry.isReconciled ? (
                      <span className="badge badge-optimal">Reconciled</span>
                    ) : (
                      <span className="badge badge-warning">Unsettled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

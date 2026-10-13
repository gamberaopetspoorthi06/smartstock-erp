import React, { useState } from 'react';
import { 
  ShieldAlert, Search, Download, AlertOctagon, 
  Activity, CheckCircle2, RefreshCw, FileText 
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { storageService } from '../../services/storageService';
import { SkeletonTable } from '../resilience/SkeletonTable';
import { EmptyState } from '../resilience/EmptyState';

export const AuditTrailView: React.FC = () => {
  const { auditLogs, isLoading } = useERP();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch = 
      log.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const handleExportDump = () => {
    const dump = storageService.exportDatabaseDump();
    const blob = new Blob([dump], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_erp_snapshot_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'OCC_CONFLICT_DETECTED':
        return <span className="badge badge-danger">⚠ OCC Collision</span>;
      case 'STATUS_TRANSITION':
        return <span className="badge badge-info">Transition</span>;
      case 'STOCK_ADJUST':
        return <span className="badge badge-warning">Stock Adjust</span>;
      case 'CREATE':
        return <span className="badge badge-optimal">Created</span>;
      case 'UPDATE':
        return <span className="badge badge-draft">Updated</span>;
      default:
        return <span className="badge badge-draft">{action}</span>;
    }
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="filter-bar">
        <div className="search-input-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search audit trail by summary, entity ID, or actor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.6rem 0.85rem' }}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            <option value="ALL">All Event Types</option>
            <option value="OCC_CONFLICT_DETECTED">OCC Concurrency Collisions</option>
            <option value="STATUS_TRANSITION">Status Transitions</option>
            <option value="STOCK_ADJUST">Stock Adjustments</option>
            <option value="CREATE">Entity Creation</option>
            <option value="UPDATE">Entity Updates</option>
          </select>

          <button className="btn btn-secondary" onClick={handleExportDump} title="Export entire ERP JSON database snapshot">
            <Download size={15} />
            <span>Export Database Dump</span>
          </button>
        </div>
      </div>

      {/* Loading Skeletons vs Data Table vs Empty State */}
      {isLoading ? (
        <SkeletonTable rows={7} columns={5} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState
          title="No Audit Records Found"
          description="No event records matched your filter. Execute ERP operations to generate event logs."
          icon={<ShieldAlert size={32} />}
        />
      ) : (
        <div className="table-container glass-panel">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Target Domain</th>
                <th>Action Type</th>
                <th>Operational Event Summary</th>
                <th>Authenticated User / Agent</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>
                    <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span className="badge badge-draft" style={{ fontSize: '0.65rem', alignSelf: 'flex-start' }}>
                        {log.entityType}
                      </span>
                      <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        ID: {log.entityId}
                      </span>
                    </div>
                  </td>

                  <td>{getActionBadge(log.action)}</td>

                  <td>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                      {log.summary}
                    </div>
                    {log.diff && log.diff.length > 0 && (
                      <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {log.diff.map((d, idx) => (
                          <span key={idx} className="mono" style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.15rem 0.4rem', 
                            background: 'var(--bg-surface-3)', 
                            borderRadius: 'var(--radius-xs)',
                            border: '1px solid var(--border-subtle)'
                          }}>
                            {d.field}: {String(d.oldValue)} → {String(d.newValue)}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>

                  <td>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {log.user}
                    </div>
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

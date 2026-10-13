import React from 'react';
import { AlertOctagon, ArrowRight, ShieldAlert, Check, X } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const ConflictModal: React.FC = () => {
  const { conflictState, resolveConflict, dismissConflict } = useERP();

  if (!conflictState) return null;

  const { item, clientVersion, serverVersion, conflictingFields } = conflictState;

  return (
    <div className="modal-overlay">
      <div className="modal-content wide">
        <div className="modal-header" style={{ borderColor: 'var(--status-danger-border)', background: 'rgba(244, 63, 94, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ color: 'var(--status-danger)' }}>
              <AlertOctagon size={24} />
            </div>
            <div>
              <h3 style={{ color: 'var(--status-danger)', fontSize: '1.1rem' }}>
                Optimistic Concurrency Conflict (OCC Mismatch)
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Target Record: <span className="mono" style={{ color: '#fff', fontWeight: 700 }}>{item.sku}</span> | Server Version: <span className="mono">v{serverVersion}</span> vs Local Draft: <span className="mono">v{clientVersion}</span>
              </p>
            </div>
          </div>
          <button className="btn btn-outline btn-sm" onClick={dismissConflict}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="conflict-box">
            <p style={{ fontSize: '0.86rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              <strong>Another transaction committed modifications</strong> to this record while you were editing. To prevent dirty writes and preserve relational integrity, NEXUS ERP requires explicit resolution.
            </p>
          </div>

          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Field Collision Diff (Side-by-Side Comparison):
          </h4>

          <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div className="diff-grid" style={{ padding: '0.65rem 1rem', background: 'var(--bg-surface-2)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div className="diff-header">Attribute</div>
              <div className="diff-header" style={{ color: '#fbbf24' }}>Your Local Draft (v{clientVersion})</div>
              <div className="diff-header" style={{ color: '#34d399' }}>Live Server Master (v{serverVersion})</div>
            </div>

            {conflictingFields.length > 0 ? (
              conflictingFields.map((fieldDiff) => (
                <div key={String(fieldDiff.field)} className="diff-grid" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="diff-field-name">{String(fieldDiff.field)}</div>
                  <div className="diff-client mono">{String(fieldDiff.clientValue ?? '—')}</div>
                  <div className="diff-server mono">{String(fieldDiff.serverValue ?? '—')}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Simulated version stamp increment detected without raw payload collision.
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
          <button className="btn btn-outline" onClick={dismissConflict}>
            Cancel & Keep Editing
          </button>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => resolveConflict('KEEP_SERVER')}
            >
              <Check size={16} />
              <span>Discard Local & Accept Server (v{serverVersion})</span>
            </button>

            <button 
              className="btn btn-danger" 
              onClick={() => resolveConflict('FORCE_OVERWRITE')}
            >
              <ShieldAlert size={16} />
              <span>Force Overwrite (Commit v{serverVersion + 1})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

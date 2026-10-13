import React from 'react';

interface SkeletonTableProps {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({ rows = 6, columns = 6 }) => {
  return (
    <div className="table-container">
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)' }}>
        <div className="skeleton" style={{ height: '20px', width: '30%' }}></div>
      </div>
      <div>
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="skeleton-row">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div 
                key={cIdx} 
                className="skeleton" 
                style={{ 
                  height: '18px', 
                  flex: cIdx === 1 ? 2 : 1,
                  opacity: 1 - (rIdx * 0.08) 
                }} 
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

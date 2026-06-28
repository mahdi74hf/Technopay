import React from 'react';
import { C, CHART_COLORS } from '../../theme';
import { compact } from '../../lib/format';

export interface BarItem {
  label: string;
  amount: number;
}

const BranchBars: React.FC<{ items: BarItem[] }> = ({ items }) => {
  const max = Math.max(1, ...items.map((i) => i.amount));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
      {items.map((b, i) => (
        <div key={b.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{b.label}</span>
            <span style={{ fontSize: 12.5, color: C.faint, fontWeight: 600 }}>{compact(b.amount)} ریال</span>
          </div>
          <div style={{ height: 9, background: '#F0F2F7', borderRadius: 6, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${((b.amount / max) * 100).toFixed(0)}%`,
                background: CHART_COLORS[i % CHART_COLORS.length],
                borderRadius: 6,
                transition: 'width .5s ease',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default BranchBars;

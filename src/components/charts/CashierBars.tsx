import React from 'react';
import { C } from '../../theme';
import { compact } from '../../lib/format';
import type { BarItem } from './BranchBars';

const CashierBars: React.FC<{ items: BarItem[] }> = ({ items }) => {
  if (items.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: C.faint, fontSize: 13.5 }}>
        برای فیلترهای انتخابی، تراکنش آفلاینی یافت نشد.
      </div>
    );
  }
  const max = Math.max(1, ...items.map((i) => i.amount));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 18, height: 180, padding: '0 8px' }}>
      {items.map((c) => (
        <div key={c.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, marginBottom: 8 }}>{compact(c.amount)}</div>
          <div
            style={{
              width: '100%',
              maxWidth: 64,
              height: `${(28 + (c.amount / max) * 120).toFixed(0)}px`,
              background: 'linear-gradient(180deg, #2F6BED, #5B8DF5)',
              borderRadius: '8px 8px 0 0',
              transition: 'height .5s ease',
            }}
          />
          <div style={{ fontSize: 12.5, color: C.mut, marginTop: 10, textAlign: 'center', fontWeight: 600 }}>{c.label}</div>
        </div>
      ))}
    </div>
  );
};

export default CashierBars;

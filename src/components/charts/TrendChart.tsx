import React, { useState } from 'react';
import { C } from '../../theme';
import { faDigits, compact } from '../../lib/format';
import { jShort } from '../../lib/jalali';

export interface Bucket {
  d: Date;
  amount: number;
  count: number;
}

const TrendChart: React.FC<{ buckets: Bucket[]; mode: 'amount' | 'count' }> = ({ buckets, mode }) => {
  const [hover, setHover] = useState<number | null>(null);
  const days = buckets.length || 1;
  const vals = buckets.map((b) => (mode === 'amount' ? b.amount : b.count));
  const maxV = Math.max(1, ...vals);
  const X = (i: number) => 20 + (i / Math.max(1, days - 1)) * 720;
  const Y = (v: number) => 200 - (v / maxV) * 160;
  const pts = buckets.map((b, i) => ({ x: X(i), y: Y(vals[i]), b, i }));
  const linePath = pts.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ');
  const areaPath =
    'M' + X(0).toFixed(1) + ' 200 ' + pts.map((p) => 'L' + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ') + ' L' + X(days - 1).toFixed(1) + ' 200 Z';
  const rectW = 720 / days;
  const step = Math.max(1, Math.floor(days / 6));
  const axis = buckets.filter((_, i) => i % step === 0).map((b) => jShort(b.d));

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <svg viewBox="0 0 760 240" preserveAspectRatio="none" style={{ width: '100%', height: 230, display: 'block', overflow: 'visible' }}>
        {[40, 100, 160].map((y) => (
          <line key={y} x1="20" y1={y} x2="740" y2={y} stroke="#EEF1F7" strokeWidth="1" />
        ))}
        <line x1="20" y1="200" x2="740" y2="200" stroke={C.border} strokeWidth="1" />
        <defs>
          <linearGradient id="tpArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.22" />
            <stop offset="100%" stopColor={C.blue} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#tpArea)" />
        <path d={linePath} fill="none" stroke={C.blue} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        {pts.map((p) => (
          <circle key={p.i} cx={p.x} cy={p.y} r={hover === p.i ? 5 : days > 16 ? 0 : 3} fill="#fff" stroke={C.blue} strokeWidth="2.5" />
        ))}
        {pts.map((p) => (
          <rect
            key={'r' + p.i}
            x={20 + p.i * rectW - rectW / 2}
            y="20"
            width={rectW}
            height="200"
            fill="transparent"
            onMouseEnter={() => setHover(p.i)}
            onMouseLeave={() => setHover(null)}
          />
        ))}
      </svg>
      {hover != null && buckets[hover] && (
        <div
          style={{
            position: 'absolute',
            top: -4,
            transform: 'translateX(50%)',
            pointerEvents: 'none',
            background: C.ink,
            color: '#fff',
            borderRadius: 9,
            padding: '8px 12px',
            fontSize: 12,
            whiteSpace: 'nowrap',
            boxShadow: '0 8px 20px rgba(0,0,0,.18)',
            right: `${(1 - X(hover) / 760) * 100}%`,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 3 }}>{jShort(buckets[hover].d)}</div>
          <div style={{ color: '#BFD2F5' }}>مبلغ: {compact(buckets[hover].amount)} ریال</div>
          <div style={{ color: '#BFD2F5' }}>تعداد: {faDigits(buckets[hover].count)} تراکنش</div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, padding: '0 14px' }}>
        {axis.map((a, i) => (
          <span key={i} style={{ fontSize: 11, color: C.faint }}>{a}</span>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;

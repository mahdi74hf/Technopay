import React from 'react';
import { C } from '../../theme';
import { faDigits, compact } from '../../lib/format';

const ChannelDonut: React.FC<{ onAmt: number; offAmt: number }> = ({ onAmt, offAmt }) => {
  const tot = Math.max(1, onAmt + offAmt);
  const R = 46;
  const circ = 2 * Math.PI * R;
  const offPct = offAmt / tot;
  const onPct = onAmt / tot;
  const segs = [
    { color: C.blue, dash: `${(offPct * circ).toFixed(1)} ${circ.toFixed(1)}`, offset: 0 },
    { color: C.teal, dash: `${(onPct * circ).toFixed(1)} ${circ.toFixed(1)}`, offset: -offPct * circ },
  ];
  const legend = [
    { color: C.blue, label: 'آفلاین (حضوری)', amount: compact(offAmt) + ' ریال', pct: faDigits(Math.round(offPct * 100)) + '٪' },
    { color: C.teal, label: 'آنلاین', amount: compact(onAmt) + ' ریال', pct: faDigits(Math.round(onPct * 100)) + '٪' },
  ];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
      <svg viewBox="0 0 120 120" style={{ width: 148, height: 148, flex: 'none' }}>
        <circle cx="60" cy="60" r={R} fill="none" stroke="#F0F2F7" strokeWidth="16" />
        {segs.map((sg, i) => (
          <circle
            key={i}
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke={sg.color}
            strokeWidth="16"
            strokeDasharray={sg.dash}
            strokeDashoffset={sg.offset}
            strokeLinecap="round"
            transform="rotate(-90 60 60)"
          />
        ))}
        <text x="60" y="56" textAnchor="middle" style={{ fontSize: 9, fill: C.mut, fontFamily: 'Vazirmatn' }}>کل</text>
        <text x="60" y="70" textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, fill: C.ink, fontFamily: 'Vazirmatn' }}>{compact(tot)}</text>
      </svg>
      <div style={{ flex: 1 }}>
        {legend.map((l, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ width: 12, height: 12, borderRadius: 4, background: l.color, flex: 'none' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700 }}>{l.label}</div>
              <div style={{ fontSize: 12, color: C.faint }}>{l.amount}</div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: l.color }}>{l.pct}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelDonut;

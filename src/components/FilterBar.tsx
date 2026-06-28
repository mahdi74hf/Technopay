import React from 'react';
import { C } from '../theme';
import type { Filters, Option } from '../types';

export interface FilterDef {
  label: string;
  name: keyof Filters;
  value: string;
  options: Option[];
}

export const FilterPill: React.FC<{ def: FilterDef; onChange: (name: keyof Filters, value: string) => void }> = ({
  def,
  onChange,
}) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: `1px solid ${C.border}`, borderRadius: 10, padding: '8px 12px', height: 42 }}>
    <span style={{ fontSize: 12.5, color: C.mut, fontWeight: 600 }}>{def.label}</span>
    <select
      value={def.value}
      onChange={(e) => onChange(def.name, e.target.value)}
      style={{ border: 'none', background: 'none', fontSize: 13, fontWeight: 700, color: C.ink, outline: 'none', cursor: 'pointer', maxWidth: 150 }}
    >
      {def.options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  </div>
);

export const FilterBar: React.FC<{
  defs: FilterDef[];
  onChange: (name: keyof Filters, value: string) => void;
  trailing?: React.ReactNode;
}> = ({ defs, onChange, trailing }) => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', marginBottom: 16 }}>
    {defs.map((d) => (
      <FilterPill key={d.name} def={d} onChange={onChange} />
    ))}
    {trailing}
  </div>
);

import React from 'react';
import { useApp } from '../../store';
import { C } from '../../theme';
import { faDigits, money, compact } from '../../lib/format';
import {
  dashTx, scopedTx, branchList, rangeOpts, channelOpts, branchOpts, cashierOpts,
} from '../../lib/selectors';
import { FilterBar, FilterDef } from '../FilterBar';
import TrendChart, { Bucket } from '../charts/TrendChart';
import ChannelDonut from '../charts/ChannelDonut';
import BranchBars from '../charts/BranchBars';
import CashierBars from '../charts/CashierBars';

const card: React.CSSProperties = {
  background: '#fff',
  border: `1px solid ${C.border}`,
  borderRadius: 16,
  boxShadow: '0 1px 2px rgba(20,40,80,.03)',
};

const Dashboard: React.FC = () => {
  const { data, s, set, setFilter, resetFilters } = useApp();
  const tx = dashTx(data, s);
  const succ = tx.filter((t) => t.status === 'success');

  // ---- KPIs ----
  const totalAmt = succ.reduce((a, t) => a + t.amount, 0);
  const pend = scopedTx(data, s).filter((t) => t.settleStatus === 'pending');
  const pendAmt = pend.reduce((a, t) => a + (t.amount - t.fee - t.commission - t.tax), 0);
  const refs = tx.filter((t) => t.status === 'refunded');
  const refAmt = refs.reduce((a, t) => a + t.amount, 0);
  const kpis = [
    { label: 'تعداد و مبلغ تراکنش‌ها', icon: '⇄', iconBg: C.blueSoft, iconColor: C.blue, value: `${faDigits(succ.length)} تراکنش`, sub: money(totalAmt), trend: '▲ ۸٫۴٪', trendColor: C.green },
    { label: 'در انتظار تسویه', icon: '◷', iconBg: C.amberBg, iconColor: C.amber, value: `${faDigits(pend.length)} تراکنش`, sub: money(pendAmt), trend: '▲ ۳٫۱٪', trendColor: C.amber },
    { label: 'تراکنش‌های ریفاند شده', icon: '↺', iconBg: C.redBg, iconColor: C.red, value: `${faDigits(refs.length)} تراکنش`, sub: money(refAmt), trend: '▼ ۱٫۲٪', trendColor: C.green },
  ];

  // ---- trend buckets ----
  const days = s.f.range === 'all' ? 30 : Math.min(+s.f.range, 30);
  const buckets: Bucket[] = [];
  for (let i = days - 1; i >= 0; i--) buckets.push({ d: new Date(data.today.getTime() - i * 86400000), amount: 0, count: 0 });
  const idxOf = (d: Date) => Math.floor((data.today.getTime() - new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) / 86400000);
  succ.forEach((t) => {
    const k = days - 1 - idxOf(t.reg);
    if (k >= 0 && k < days) {
      buckets[k].amount += t.amount;
      buckets[k].count += 1;
    }
  });
  const rangeLabel = rangeOpts.find((r) => r.value === s.f.range)?.label || '';

  // ---- donut ----
  const onAmt = succ.filter((t) => t.channel === 'online').reduce((a, t) => a + t.amount, 0);
  const offAmt = succ.filter((t) => t.channel === 'offline').reduce((a, t) => a + t.amount, 0);

  // ---- branch breakdown ----
  const bmap: Record<string, number> = {};
  succ.forEach((t) => (bmap[t.branch] = (bmap[t.branch] || 0) + t.amount));
  const branchItems = Object.entries(bmap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, amount]) => ({ label, amount }));
  const branchCount = branchList(data, s).length;
  const single = branchCount <= 1;

  // ---- cashier breakdown ----
  const cmap: Record<string, number> = {};
  succ.filter((t) => t.channel === 'offline' && t.cashier).forEach((t) => (cmap[t.cashier!] = (cmap[t.cashier!] || 0) + t.amount));
  const cashierItems = Object.entries(cmap).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, amount]) => ({ label: label.split(' ')[0], amount }));

  const filters: FilterDef[] = [
    { label: 'بازه', name: 'range', value: s.f.range, options: rangeOpts },
    { label: 'شعبه', name: 'branch', value: s.f.branch, options: branchOpts(data, s) },
    { label: 'کانال', name: 'channel', value: s.f.channel, options: channelOpts },
    { label: 'صندوقدار', name: 'cashier', value: s.f.cashier, options: cashierOpts(data, s) },
  ];

  const tab = (active: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    borderRadius: 7,
    fontSize: 13,
    fontWeight: active ? 700 : 600,
    cursor: 'pointer',
    background: active ? '#fff' : 'transparent',
    color: active ? C.blue : C.mut,
    boxShadow: active ? '0 1px 3px rgba(0,0,0,.08)' : 'none',
  });

  return (
    <div style={{ animation: 'tpFade .4s ease' }}>
      <FilterBar
        defs={filters}
        onChange={setFilter}
        trailing={
          <>
            <div style={{ flex: 1 }} />
            <button onClick={resetFilters} style={{ height: 42, border: `1px solid ${C.border}`, background: '#fff', borderRadius: 10, padding: '0 16px', fontSize: 13, fontWeight: 600, color: C.mut, cursor: 'pointer' }}>
              پاک کردن فیلترها
            </button>
          </>
        }
      />

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ ...card, padding: '20px 22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 13.5, color: C.mut, fontWeight: 600 }}>{k.label}</span>
              <span style={{ width: 38, height: 38, borderRadius: 11, background: k.iconBg, color: k.iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{k.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.5px' }}>{k.value}</div>
            <div style={{ fontSize: 13, color: C.faint, marginTop: 5 }}>{k.sub}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
              <span style={{ fontSize: 12.5, fontWeight: 700, color: k.trendColor }}>{k.trend}</span>
              <span style={{ fontSize: 12, color: '#9AA6BD' }}>نسبت به دوره قبل</span>
            </div>
          </div>
        ))}
      </div>

      {/* trend */}
      <div style={{ ...card, padding: '22px 24px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 800 }}>روند تراکنش‌ها</div>
            <div style={{ fontSize: 12.5, color: C.mut, marginTop: 2 }}>به تفکیک روز — {rangeLabel}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, background: C.bg, borderRadius: 10, padding: 4 }}>
            <div onClick={() => set({ chartMode: 'amount', hoverIdx: null })} style={tab(s.chartMode === 'amount')}>مبلغ</div>
            <div onClick={() => set({ chartMode: 'count', hoverIdx: null })} style={tab(s.chartMode === 'count')}>تعداد</div>
          </div>
        </div>
        <TrendChart buckets={buckets} mode={s.chartMode} />
      </div>

      {/* donut + branch */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>آنلاین در برابر آفلاین</div>
          <div style={{ fontSize: 12.5, color: C.mut, marginBottom: 8 }}>سهم مبلغ تراکنش‌ها از کانال‌ها</div>
          <ChannelDonut onAmt={onAmt} offAmt={offAmt} />
        </div>
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>تراکنش به تفکیک شعبه</div>
            <span style={{ fontSize: 12, fontWeight: 700, color: single ? C.amber : C.green, background: single ? C.amberBg : C.greenBg, padding: '3px 10px', borderRadius: 20 }}>
              {single ? 'پذیرنده تک‌شعبه' : `${faDigits(branchCount)} شعبه فعال`}
            </span>
          </div>
          <div style={{ fontSize: 12.5, color: C.mut, marginBottom: 18 }}>مجموع مبلغ هر شعبه</div>
          <BranchBars items={branchItems} />
        </div>
      </div>

      {/* cashier */}
      <div style={{ ...card, padding: '22px 24px' }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>تراکنش آفلاین به تفکیک صندوقدار</div>
        <div style={{ fontSize: 12.5, color: C.mut, marginBottom: 20 }}>فقط تراکنش‌های حضوری (آفلاین)</div>
        <CashierBars items={cashierItems} />
      </div>
    </div>
  );
};

export default Dashboard;

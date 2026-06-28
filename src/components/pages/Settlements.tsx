import React from 'react';
import { useApp } from '../../store';
import { C } from '../../theme';
import { faDigits, fa, compact } from '../../lib/format';
import { jDate } from '../../lib/jalali';
import { settleTx, scopeMerchant, rangeOpts, channelOpts, branchOpts, cashierOpts } from '../../lib/selectors';
import { FilterBar, FilterDef } from '../FilterBar';

const th: React.CSSProperties = { padding: '14px 16px', fontSize: 12, color: C.mut, fontWeight: 700, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '13px 16px', fontSize: 12.5, color: C.sub, whiteSpace: 'nowrap' };

const Settlements: React.FC = () => {
  const { data, s, setFilter, openDrawer, exportSettle } = useApp();
  const tx = settleTx(data, s);
  const showMerchant = s.role === 'admin' && scopeMerchant(s) === 'all';
  const rows = tx.slice(0, 60);
  const totalSettle = tx.reduce((a, t) => a + (t.amount - t.fee - t.commission - t.tax), 0);

  const summary = [
    { label: 'تعداد تراکنش', value: faDigits(tx.length), hi: false },
    { label: 'مجموع مبلغ تراکنش', value: compact(tx.reduce((a, t) => a + t.amount, 0)) + ' ریال', hi: false },
    { label: 'مجموع قابل تسویه', value: compact(totalSettle) + ' ریال', hi: true },
  ];

  const filters: FilterDef[] = [
    { label: 'بازه', name: 'range', value: s.f.range, options: rangeOpts },
    { label: 'شعبه', name: 'branch', value: s.f.branch, options: branchOpts(data, s) },
    { label: 'کانال', name: 'channel', value: s.f.channel, options: channelOpts },
    { label: 'صندوقدار', name: 'cashier', value: s.f.cashier, options: cashierOpts(data, s) },
  ];

  return (
    <div style={{ animation: 'tpFade .4s ease' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 18 }}>
        {summary.map((ss) => (
          <div
            key={ss.label}
            style={
              ss.hi
                ? { background: 'linear-gradient(135deg,#12936A,#0d7a58)', border: '1px solid #0d7a58', borderRadius: 16, padding: '18px 22px', boxShadow: '0 10px 24px rgba(18,147,106,.28)' }
                : { background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '18px 22px' }
            }
          >
            <div style={{ fontSize: 13, color: ss.hi ? 'rgba(255,255,255,.85)' : C.mut, fontWeight: 600 }}>{ss.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, marginTop: 8, color: ss.hi ? '#fff' : C.ink }}>{ss.value}</div>
          </div>
        ))}
      </div>

      <FilterBar
        defs={filters}
        onChange={setFilter}
        trailing={
          <>
            <div style={{ flex: 1 }} />
            <button onClick={exportSettle} style={{ height: 42, border: 'none', borderRadius: 11, background: C.green, color: '#fff', fontSize: 13.5, fontWeight: 700, padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 18px rgba(18,147,106,.28)' }}>
              <span style={{ fontSize: 16 }}>⤓</span>خروجی اکسل
            </button>
          </>
        }
      />

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 2px rgba(20,40,80,.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 920 }}>
            <thead>
              <tr style={{ background: '#F7F9FD', textAlign: 'right' }}>
                {showMerchant && <th style={th}>پذیرنده</th>}
                <th style={th}>شعبه</th>
                <th style={th}>مبلغ تراکنش</th>
                <th style={th}>کارمزد</th>
                <th style={th}>کمیسیون</th>
                <th style={th}>مالیات</th>
                <th style={th}>قابل تسویه</th>
                <th style={th}>تاریخ تسویه</th>
                <th style={th}>شماره حساب</th>
                <th style={th}>وضعیت</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} onClick={() => openDrawer(t)} style={{ borderTop: `1px solid ${C.borderSoft}`, cursor: 'pointer' }}>
                  {showMerchant && <td style={td}>{t.merchantName}</td>}
                  <td style={{ ...td, fontSize: 13, fontWeight: 600, color: C.ink }}>{t.branch}</td>
                  <td style={{ ...td, fontSize: 13, fontWeight: 700, color: C.ink }}>{fa(t.amount)}</td>
                  <td style={td}>{fa(t.fee)}</td>
                  <td style={td}>{fa(t.commission)}</td>
                  <td style={td}>{fa(t.tax)}</td>
                  <td style={{ ...td, fontSize: 13, fontWeight: 700, color: C.green }}>{fa(t.amount - t.fee - t.commission - t.tax)}</td>
                  <td style={td}>{jDate(t.settle)}</td>
                  <td style={{ ...td, fontSize: 12, fontFamily: 'monospace', direction: 'ltr', textAlign: 'right' }}>{t.acc}</td>
                  <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                    <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 20, color: C.amber, background: C.amberBg }}>در انتظار</span>
                  </td>
                  <td style={{ padding: '13px 16px', color: '#C4CCDC', fontSize: 16 }}>‹</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tx.length > 60 && (
          <div style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12.5, color: C.faint, borderTop: `1px solid ${C.borderSoft}` }}>
            نمایش ۶۰ مورد از {faDigits(tx.length)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settlements;

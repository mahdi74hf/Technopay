import React from 'react';
import { useApp } from '../../store';
import { C } from '../../theme';
import { faDigits, fa, money } from '../../lib/format';
import { jDate } from '../../lib/jalali';
import {
  reportTx, scopeMerchant, statusTok, rangeOpts, statusOpts, channelOpts, branchOpts, cashierOpts,
} from '../../lib/selectors';
import { FilterBar, FilterDef } from '../FilterBar';

const th: React.CSSProperties = { padding: '14px 16px', fontSize: 12, color: C.mut, fontWeight: 700, whiteSpace: 'nowrap' };
const td: React.CSSProperties = { padding: '13px 16px', fontSize: 12.5, color: C.sub, whiteSpace: 'nowrap' };

const Reports: React.FC = () => {
  const { data, s, setFilter, set, openDrawer, exportReports } = useApp();
  const tx = reportTx(data, s);
  const showMerchant = s.role === 'admin' && scopeMerchant(s) === 'all';
  const rows = tx.slice(0, 60);
  const sum = tx.filter((t) => t.status === 'success').reduce((a, t) => a + t.amount, 0);

  const filters: FilterDef[] = [
    { label: 'بازه', name: 'range', value: s.f.range, options: rangeOpts },
    { label: 'وضعیت', name: 'status', value: s.f.status, options: statusOpts },
    { label: 'شعبه', name: 'branch', value: s.f.branch, options: branchOpts(data, s) },
    { label: 'کانال', name: 'channel', value: s.f.channel, options: channelOpts },
    { label: 'صندوقدار', name: 'cashier', value: s.f.cashier, options: cashierOpts(data, s) },
  ];

  return (
    <div style={{ animation: 'tpFade .4s ease' }}>
      <FilterBar defs={filters} onChange={setFilter} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#9AA6BD', fontSize: 15 }}>⌕</span>
          <input
            value={s.f.search}
            onChange={(e) => setFilter('search', e.target.value)}
            placeholder="جستجوی شماره تراکنش، نام مشتری، موبایل یا کد ملی…"
            style={{ width: '100%', height: 44, border: `1px solid ${C.border}`, borderRadius: 11, padding: '0 40px 0 14px', fontSize: 13.5, background: '#fff', outline: 'none' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: C.mut }}>
          <span><b style={{ color: C.ink }}>{faDigits(tx.length)}</b> نتیجه</span>
          <span style={{ width: 1, height: 18, background: C.border }} />
          <span>مجموع: <b style={{ color: C.ink }}>{money(sum)}</b></span>
        </div>
        <button onClick={exportReports} style={{ height: 44, border: 'none', borderRadius: 11, background: C.green, color: '#fff', fontSize: 13.5, fontWeight: 700, padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 18px rgba(18,147,106,.28)' }}>
          <span style={{ fontSize: 16 }}>⤓</span>خروجی اکسل
        </button>
      </div>

      <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 2px rgba(20,40,80,.03)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 880 }}>
            <thead>
              <tr style={{ background: '#F7F9FD', textAlign: 'right' }}>
                <th style={th}>شماره تراکنش</th>
                <th style={th}>وضعیت</th>
                <th style={th}>مشتری</th>
                {showMerchant && <th style={th}>پذیرنده</th>}
                <th style={th}>روش ثبت</th>
                <th style={th}>مبلغ (ریال)</th>
                <th style={th}>کارمزد</th>
                <th style={th}>شعبه</th>
                <th style={th}>تاریخ ثبت</th>
                <th style={th}>تسویه</th>
                <th style={th} />
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => {
                const st = statusTok(t.status);
                const settled = t.settleStatus === 'settled';
                return (
                  <tr key={t.id} onClick={() => openDrawer(t)} style={{ borderTop: `1px solid ${C.borderSoft}`, cursor: 'pointer' }}>
                    <td style={{ ...td, fontFamily: 'monospace', direction: 'ltr', textAlign: 'right', color: C.blue, fontWeight: 600 }}>{t.id}</td>
                    <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, padding: '4px 11px', borderRadius: 20, color: st.color, background: st.bg }}>{st.label}</span>
                    </td>
                    <td style={{ ...td, fontSize: 13, fontWeight: 600, color: C.ink }}>{t.customer}</td>
                    {showMerchant && <td style={td}>{t.merchantName}</td>}
                    <td style={{ ...td, fontSize: 12.5, fontWeight: 700, color: t.channel === 'online' ? C.teal : C.blue }}>{t.channel === 'online' ? 'آنلاین' : 'آفلاین'}</td>
                    <td style={{ ...td, fontSize: 13, fontWeight: 700, color: C.ink }}>{fa(t.amount)}</td>
                    <td style={td}>{fa(t.fee)}</td>
                    <td style={td}>{t.branch}</td>
                    <td style={td}>{jDate(t.reg)}</td>
                    <td style={{ padding: '13px 16px', whiteSpace: 'nowrap' }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, padding: '4px 10px', borderRadius: 20, color: settled ? C.green : C.amber, background: settled ? C.greenBg : C.amberBg }}>{settled ? 'تسویه‌شده' : 'در انتظار'}</span>
                    </td>
                    <td style={{ padding: '13px 16px', color: '#C4CCDC', fontSize: 16 }}>‹</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {tx.length > 60 && (
          <div style={{ padding: '14px 18px', textAlign: 'center', fontSize: 12.5, color: C.faint, borderTop: `1px solid ${C.borderSoft}` }}>
            نمایش ۶۰ مورد از {faDigits(tx.length)} — برای دیدن همه، خروجی اکسل بگیرید
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

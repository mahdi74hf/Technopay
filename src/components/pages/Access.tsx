import React from 'react';
import { useApp } from '../../store';
import { C } from '../../theme';
import { faDigits } from '../../lib/format';
import { scopeMerchant, branchList } from '../../lib/selectors';

const card: React.CSSProperties = { background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 24px' };
const pill: React.CSSProperties = { fontSize: 11, fontWeight: 600, color: C.mut, background: C.borderSoft, padding: '3px 10px', borderRadius: 20 };
const removeX: React.CSSProperties = { fontSize: 16, color: '#C4CCDC', cursor: 'pointer', padding: '0 4px' };

const Access: React.FC = () => {
  const { data, s, set, addBranch, addCashier, removeBranch, removeCashier } = useApp();
  const sm = scopeMerchant(s);
  const mid = sm === 'all' ? 'm1' : sm;
  const curM = data.merchants.find((x) => x.id === mid) || data.merchants[0];
  const isM1 = sm === 'm1' || s.role === 'merchant';

  const baseBranches = data.branchMap[mid].map((b) => ({ name: b, city: curM.city, date: faDigits('۱۴۰۴/۰۹/۱۵'), base: true }));
  const baseCashiers = data.cashierMap[mid].map((c, i) => ({ name: c, branch: data.branchMap[mid][i % data.branchMap[mid].length], date: faDigits('۱۴۰۴/۱۰/۰۲'), base: true }));

  const cityOpts = ['تهران', 'کرج', 'اصفهان', 'شیراز', 'مشهد', 'تبریز'];
  const cashierBranchOpts = branchList(data, s);

  return (
    <div style={{ animation: 'tpFade .4s ease', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, maxWidth: 1080 }}>
      {/* branches */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 18, background: C.blue, borderRadius: 4 }} />شعب
          </div>
          <span style={{ fontSize: 12, color: C.mut }}>مدیریت شعب پذیرنده</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
          {baseBranches.map((b) => (
            <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F7F9FD', border: `1px solid ${C.borderSoft}`, borderRadius: 11, padding: '12px 14px' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: C.blueSoft, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flex: 'none' }}>⌂</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{b.name}</div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 1 }}>{b.city} · ایجاد {b.date}</div>
              </div>
              <span style={pill}>فعال</span>
            </div>
          ))}
          {isM1 && s.branchesExtra.map((b, i) => (
            <div key={'x' + i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F7F9FD', border: `1px solid ${C.borderSoft}`, borderRadius: 11, padding: '12px 14px' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: C.blueSoft, color: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flex: 'none' }}>⌂</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{b.name}</div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 1 }}>{b.city} · ایجاد {b.date}</div>
              </div>
              <span onClick={() => removeBranch(i)} style={removeX}>✕</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px dashed #E2E7F1', paddingTop: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#3C4A66', marginBottom: 10 }}>افزودن شعبه جدید</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={s.newBranch} onChange={(e) => set({ newBranch: e.target.value })} placeholder="نام شعبه" style={{ flex: 1, height: 42, border: '1px solid #E2E7F1', borderRadius: 10, padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} />
            <select value={s.newBranchCity} onChange={(e) => set({ newBranchCity: e.target.value })} style={{ height: 42, border: '1px solid #E2E7F1', borderRadius: 10, padding: '0 10px', fontSize: 13, fontWeight: 600, outline: 'none', background: '#fff', cursor: 'pointer' }}>
              {cityOpts.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <button onClick={addBranch} style={{ height: 42, border: 'none', borderRadius: 10, background: C.blue, color: '#fff', fontSize: 13, fontWeight: 700, padding: '0 18px', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ افزودن</button>
          </div>
        </div>
      </div>

      {/* cashiers */}
      <div style={card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 18, background: C.green, borderRadius: 4 }} />صندوقداران
          </div>
          <span style={{ fontSize: 12, color: C.mut }}>برای تراکنش‌های آفلاین</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '16px 0' }}>
          {baseCashiers.map((c) => (
            <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F7F9FD', border: `1px solid ${C.borderSoft}`, borderRadius: 11, padding: '12px 14px' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: C.greenBg, color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flex: 'none' }}>{c.name.charAt(0)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 1 }}>{c.branch} · افزوده {c.date}</div>
              </div>
              <span style={pill}>فعال</span>
            </div>
          ))}
          {isM1 && s.cashiersExtra.map((c, i) => (
            <div key={'x' + i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#F7F9FD', border: `1px solid ${C.borderSoft}`, borderRadius: 11, padding: '12px 14px' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: C.greenBg, color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, flex: 'none' }}>{c.name.charAt(0)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 11.5, color: C.faint, marginTop: 1 }}>{c.branch} · افزوده {c.date}</div>
              </div>
              <span onClick={() => removeCashier(i)} style={removeX}>✕</span>
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px dashed #E2E7F1', paddingTop: 16 }}>
          <div style={{ fontSize: 12.5, fontWeight: 700, color: '#3C4A66', marginBottom: 10 }}>افزودن صندوقدار جدید</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={s.newCashier} onChange={(e) => set({ newCashier: e.target.value })} placeholder="نام و نام خانوادگی" style={{ flex: 1, height: 42, border: '1px solid #E2E7F1', borderRadius: 10, padding: '0 12px', fontSize: 13, outline: 'none', background: '#fff' }} />
            <select value={s.newCashierBranch || cashierBranchOpts[0] || ''} onChange={(e) => set({ newCashierBranch: e.target.value })} style={{ height: 42, border: '1px solid #E2E7F1', borderRadius: 10, padding: '0 10px', fontSize: 13, fontWeight: 600, outline: 'none', background: '#fff', cursor: 'pointer', maxWidth: 130 }}>
              {cashierBranchOpts.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <button onClick={addCashier} style={{ height: 42, border: 'none', borderRadius: 10, background: C.green, color: '#fff', fontSize: 13, fontWeight: 700, padding: '0 18px', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ افزودن</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Access;

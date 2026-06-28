import React from 'react';
import { useApp } from '../store';
import { C } from '../theme';
import { statusTok } from '../lib/selectors';
import { money } from '../lib/format';
import { jDate } from '../lib/jalali';
import type { Tx } from '../types';

const Row: React.FC<{ k: string; v: string }> = ({ k, v }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '11px 0', borderTop: `1px solid ${C.borderSoft}` }}>
    <span style={{ fontSize: 13, color: C.mut }}>{k}</span>
    <span style={{ fontSize: 13, fontWeight: 600, textAlign: 'left' }}>{v}</span>
  </div>
);

const Group: React.FC<{ title: string; rows: { k: string; v: string }[] }> = ({ title, rows }) => (
  <div style={{ background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '6px 20px', marginBottom: 14 }}>
    <div style={{ fontSize: 12, fontWeight: 700, color: C.blue, padding: '12px 0 6px' }}>{title}</div>
    {rows.map((r) => (
      <Row key={r.k} k={r.k} v={r.v} />
    ))}
  </div>
);

const Drawer: React.FC = () => {
  const { s, closeDrawer } = useApp();
  const t = s.drawerTx;
  if (!t) return null;
  const st = statusTok(t.status);

  const groups: { title: string; rows: { k: string; v: string }[] }[] = [
    {
      title: 'اطلاعات تراکنش',
      rows: [
        { k: 'وضعیت تراکنش', v: st.label },
        { k: 'روش ثبت', v: t.channel === 'online' ? 'آنلاین' : 'آفلاین (حضوری)' },
        { k: 'دسته‌بندی پذیرنده', v: t.category },
        { k: 'نام پذیرنده', v: t.merchantName },
        { k: 'شعبه', v: t.branch },
        { k: 'صندوقدار', v: t.cashier || '— (غیرحضوری)' },
        { k: 'تاریخ ثبت', v: jDate(t.reg) },
        { k: 'تاریخ تسویه', v: jDate(t.settle) },
      ],
    },
    {
      title: 'مبالغ',
      rows: [
        { k: 'مبلغ تراکنش', v: money(t.amount) },
        { k: 'کارمزد', v: money(t.fee) },
        { k: 'مبلغ کمیسیون', v: money(t.commission) },
        { k: 'مبلغ مالیات', v: money(t.tax) },
        { k: 'مبلغ پرداخت‌شده در فروشگاه', v: money(t.paidInStore) },
        { k: 'مبلغ ولت', v: money(t.wallet) },
      ],
    },
    {
      title: 'مشتری',
      rows: [
        { k: 'نام مشتری', v: t.customer },
        { k: 'شماره تماس', v: t.phone },
        { k: 'کد ملی', v: t.nationalId },
        { k: 'شهر', v: t.city },
      ],
    },
    {
      title: 'تسویه',
      rows: [
        { k: 'وضعیت تسویه', v: t.settleStatus === 'settled' ? 'تسویه‌شده' : 'در انتظار تسویه' },
        { k: 'شماره حساب', v: t.acc },
      ],
    },
  ];

  return (
    <>
      <div onClick={closeDrawer} style={{ position: 'fixed', inset: 0, background: 'rgba(15,28,52,.42)', zIndex: 60, backdropFilter: 'blur(1px)' }} />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: 440,
          maxWidth: '92vw',
          background: C.bg,
          zIndex: 61,
          boxShadow: '-16px 0 40px rgba(0,0,0,.16)',
          animation: 'tpDrawer .32s cubic-bezier(.2,.8,.2,1)',
          display: 'flex',
          flexDirection: 'column',
          direction: 'rtl',
        }}
      >
        <div style={{ padding: '20px 24px', background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 12.5, color: C.mut }}>جزئیات تراکنش</div>
            <div style={{ fontSize: 16, fontWeight: 800, fontFamily: 'monospace', direction: 'ltr', marginTop: 2 }}>{t.id}</div>
          </div>
          <div onClick={closeDrawer} style={{ width: 36, height: 36, borderRadius: 10, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18 }}>✕</div>
        </div>
        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12.5, color: C.mut }}>مبلغ تراکنش</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{money(t.amount)}</div>
            </div>
            <span style={{ fontSize: 12.5, fontWeight: 700, padding: '6px 14px', borderRadius: 20, color: st.color, background: st.bg }}>{st.label}</span>
          </div>
          {groups.map((g) => (
            <Group key={g.title} title={g.title} rows={g.rows} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Drawer;

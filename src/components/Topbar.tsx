import React from 'react';
import { useApp } from '../store';
import { C } from '../theme';
import { scopeMerchant } from '../lib/selectors';
import type { Nav } from '../types';

const TITLES: Record<Nav, [string, string]> = {
  dashboard: ['داشبورد', 'نمای کلی تراکنش‌ها و تسویه'],
  reports: ['گزارشات تراکنش‌ها', 'تراکنش‌های موفق و ریفاند شده'],
  settlements: ['تراکنش‌های در انتظار تسویه', 'مبالغ قابل تسویه پذیرنده'],
  access: ['مدیریت دسترسی', 'شعب و صندوقداران'],
  profile: ['پروفایل پذیرنده', 'اطلاعات عمومی، تسویه و تاریخچه'],
};

const stripPrefix = (name: string) =>
  name.replace(/^(فروشگاه|هایپرمارکت|رستوران|داروخانه|آرایشی بهداشتی)\s*/, '');

const Topbar: React.FC = () => {
  const { data, s, setFilter, go } = useApp();
  const isAdmin = s.role === 'admin';
  const sm = scopeMerchant(s);
  const curM = data.merchants.find((m) => m.id === (sm === 'all' ? 'm1' : sm)) || data.merchants[0];
  const profName = isAdmin ? (sm === 'all' ? 'ادمین تکنوپی' : curM.name) : curM.name;
  const profCategory = isAdmin && sm === 'all' ? 'دسترسی کامل' : curM.category;
  const [title, sub] = TITLES[s.nav];

  return (
    <header
      style={{
        height: 68,
        flex: 'none',
        background: '#fff',
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 26px',
        gap: 18,
        position: 'sticky',
        top: 0,
        zIndex: 20,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 800 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: C.mut, marginTop: 1 }}>{sub}</div>
      </div>

      {isAdmin && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: '7px 12px' }}>
          <span style={{ fontSize: 12.5, color: C.mut, fontWeight: 600 }}>پذیرنده:</span>
          <select
            value={s.f.merchant}
            onChange={(e) => setFilter('merchant', e.target.value)}
            style={{ border: 'none', background: 'none', fontSize: 13.5, fontWeight: 700, color: C.ink, outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">همه پذیرندگان</option>
            {data.merchants.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>
      )}

      <div style={{ width: 40, height: 40, borderRadius: 11, background: C.bg, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, cursor: 'pointer', position: 'relative' }}>
        <span>🔔</span>
        <span style={{ position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: '50%', background: C.red, border: '1.5px solid #fff' }} />
      </div>

      {/* پروفایل — بالا سمت چپ */}
      <div
        onClick={() => go('profile')}
        style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer', padding: '5px 6px 5px 12px', borderRadius: 12, border: `1px solid ${C.border}` }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 13.5, fontWeight: 700, lineHeight: 1.3 }}>{profName}</div>
          <div style={{ fontSize: 11.5, color: C.mut }}>{profCategory}</div>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: 'linear-gradient(135deg,#2F6BED,#1C4C8F)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
          {stripPrefix(profName).charAt(0)}
        </div>
      </div>
    </header>
  );
};

export default Topbar;

import React from 'react';
import { useApp } from '../store';
import { C } from '../theme';
import { scopedTx } from '../lib/selectors';
import { faDigits } from '../lib/format';
import type { Nav } from '../types';

const NAV: { key: Nav; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'داشبورد', icon: '◧' },
  { key: 'reports', label: 'گزارشات', icon: '▤' },
  { key: 'settlements', label: 'در انتظار تسویه', icon: '◷' },
  { key: 'access', label: 'مدیریت دسترسی', icon: '⚙' },
  { key: 'profile', label: 'پروفایل پذیرنده', icon: '◴' },
];

const Sidebar: React.FC = () => {
  const { data, s, go, logout } = useApp();
  const isAdmin = s.role === 'admin';
  const pendingCount = scopedTx(data, s).filter((t) => t.settleStatus === 'pending').length;

  return (
    <aside
      style={{
        width: 256,
        flex: 'none',
        background: C.navy,
        color: '#C4D2EA',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div style={{ padding: '22px 22px 18px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ width: 40, height: 40, borderRadius: 11, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 19, color: '#fff' }}>T</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17, color: '#fff' }}>تکنوپی</div>
          <div style={{ fontSize: 10.5, color: '#6E86AE', letterSpacing: 2 }}>TECHNOPAY</div>
        </div>
      </div>

      <div style={{ padding: '16px 14px', flex: 1, overflowY: 'auto' }}>
        <div style={{ fontSize: 11, color: '#5E7395', fontWeight: 600, padding: '6px 12px 10px', letterSpacing: '.5px' }}>منوی اصلی</div>
        {NAV.map((n) => {
          const active = s.nav === n.key;
          return (
            <div
              key={n.key}
              onClick={() => go(n.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 12px',
                borderRadius: 10,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                marginBottom: 3,
                color: active ? '#fff' : '#9FB2D2',
                background: active ? 'linear-gradient(90deg,#2F6BED,#2459c9)' : 'transparent',
                boxShadow: active ? '0 6px 16px rgba(47,107,237,.35)' : 'none',
              }}
            >
              <span style={{ width: 22, display: 'inline-flex', justifyContent: 'center' }}>{n.icon}</span>
              <span style={{ flex: 1 }}>{n.label}</span>
              {n.key === 'settlements' && (
                <span style={{ background: C.blue, color: '#fff', fontSize: 11, fontWeight: 700, borderRadius: 20, padding: '1px 8px' }}>
                  {faDigits(pendingCount)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ padding: 14, borderTop: '1px solid rgba(255,255,255,.07)' }}>
        <div style={{ background: 'rgba(255,255,255,.05)', borderRadius: 12, padding: '12px 14px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: '#6E86AE', marginBottom: 4 }}>نقش فعال</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: isAdmin ? '#E0A33C' : '#3BC07A' }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>{isAdmin ? 'ادمین تکنوپی' : 'پذیرنده'}</span>
          </div>
        </div>
        <div
          onClick={logout}
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, cursor: 'pointer', color: '#9FB2D2', fontSize: 14, fontWeight: 600 }}
        >
          <span>⎋</span>
          <span>خروج از حساب</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

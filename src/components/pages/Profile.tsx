import React from 'react';
import { useApp } from '../../store';
import { C } from '../../theme';
import { faDigits } from '../../lib/format';
import { scopeMerchant } from '../../lib/selectors';

const stripPrefix = (name: string) => name.replace(/^(فروشگاه|هایپرمارکت|رستوران|داروخانه|آرایشی بهداشتی)\s*/, '');

const SectionTitle: React.FC<{ color: string; children: React.ReactNode }> = ({ color, children }) => (
  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
    <span style={{ width: 4, height: 18, background: color, borderRadius: 4 }} />
    {children}
  </div>
);

const KV: React.FC<{ k: string; v: string; mono?: boolean; link?: boolean }> = ({ k, v, mono, link }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '11px 0', borderBottom: `1px solid ${C.bg}` }}>
    <span style={{ fontSize: 12.5, color: C.mut }}>{k}</span>
    <span style={{ fontSize: 12.5, fontWeight: link ? 700 : 600, textAlign: 'left', color: link ? C.blue : C.ink, cursor: link ? 'pointer' : 'default', fontFamily: mono ? 'monospace' : 'inherit', direction: mono || link ? 'ltr' : 'rtl' }}>{v}</span>
  </div>
);

const Profile: React.FC = () => {
  const { data, s } = useApp();
  const sm = scopeMerchant(s);
  const m = data.merchants.find((x) => x.id === (sm === 'all' ? 'm1' : sm)) || data.merchants[0];
  const branchCount = data.branchMap[m.id].length + (m.id === 'm1' ? s.branchesExtra.length : 0);
  const channelLabel = data.channelType[m.id] === 'offline' ? 'حضوری' : data.channelType[m.id] === 'online' ? 'آنلاین' : 'حضوری و آنلاین';

  const general = [
    { k: 'دسته‌بندی', v: m.category },
    { k: 'نوع شخصیت', v: m.type },
    { k: 'نوع فعالیت', v: channelLabel },
    { k: 'شهر', v: m.city },
    { k: 'آدرس دفتر', v: 'خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۲۴۰' },
    { k: 'کد پستی', v: faDigits('۱۹۹۴۷۳۳۸۵۱') },
    { k: 'تلفن ثابت', v: faDigits('۰۲۱-۸۸۷۷۲۲۱۰') },
    { k: 'تلفن همراه نماینده', v: faDigits('۰۹۱۲۳۴۵۶۷۸۸') },
    { k: 'ایمیل', v: 'arman.store@mail.ir' },
    { k: 'نام نماینده', v: 'محمد آرمان‌فر' },
    { k: 'تعداد شعب', v: faDigits(branchCount) },
  ];
  const settle = [
    { k: 'مدل پرداخت', v: 'هفته‌ای یک بار' },
    { k: 'کمیسیون', v: '۲٪' },
    { k: 'مدت بازپرداخت', v: faDigits('۷') + ' روز' },
    { k: 'روزهای تسویه', v: 'شنبه‌ها' },
  ];
  const bank = [
    { k: 'نام بانک', v: m.bank },
    { k: 'شماره حساب', v: m.acc, mono: true },
    { k: 'شماره شبا', v: m.sheba, mono: true },
  ];
  const contract = [
    { k: 'تاریخ عقد قرارداد', v: faDigits('۱۴۰۴/۰۹/۱۵') },
    { k: 'تاریخ انقضای قرارداد', v: faDigits('۱۴۰۵/۰۹/۱۵') },
    { k: 'اسکن قرارداد', v: '⤓ contract.pdf', link: true },
    { k: 'الحاقیه قرارداد', v: '⤓ addendum-1.pdf', link: true },
  ];
  const history = [
    { date: faDigits('۱۴۰۵/۰۳/۰۱'), title: 'تغییر کمیسیون', desc: 'از ۲٫۵٪ به ۲٪ کاهش یافت', color: C.blue },
    { date: faDigits('۱۴۰۴/۱۲/۱۰'), title: 'تغییر مدت بازپرداخت', desc: 'از ۱۰ روز به ۷ روز تغییر کرد', color: C.teal },
    { date: faDigits('۱۴۰۴/۰۹/۱۵'), title: 'عقد قرارداد', desc: 'قرارداد اولیه با مدل تسویه هفتگی', color: C.green },
  ];

  const card: React.CSSProperties = { background: '#fff', border: `1px solid ${C.border}`, borderRadius: 16, padding: '22px 24px' };

  return (
    <div style={{ animation: 'tpFade .4s ease', maxWidth: 1080 }}>
      <div style={{ background: 'linear-gradient(135deg, #0E2447, #1C4C8F)', borderRadius: 18, padding: '26px 30px', color: '#fff', display: 'flex', alignItems: 'center', gap: 22, marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(255,255,255,.08)', top: -80, left: 40 }} />
        <div style={{ width: 76, height: 76, borderRadius: 20, background: 'rgba(255,255,255,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, flex: 'none' }}>{stripPrefix(m.name).charAt(0)}</div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontSize: 23, fontWeight: 800 }}>{m.name}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {[m.category, m.type, m.city].map((b) => (
              <span key={b} style={{ fontSize: 12.5, fontWeight: 600, background: 'rgba(255,255,255,.16)', padding: '5px 13px', borderRadius: 20 }}>{b}</span>
            ))}
          </div>
        </div>
        <span style={{ position: 'relative', fontSize: 12.5, fontWeight: 700, background: '#3BC07A', padding: '6px 14px', borderRadius: 20 }}>قرارداد فعال</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
        <div style={card}>
          <SectionTitle color={C.blue}>اطلاعات عمومی</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 28px' }}>
            {general.map((g) => <KV key={g.k} k={g.k} v={g.v} />)}
          </div>
        </div>

        <div style={card}>
          <SectionTitle color={C.green}>اطلاعات تسویه</SectionTitle>
          {settle.map((g) => (
            <div key={g.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '12px 0', borderBottom: `1px solid ${C.bg}` }}>
              <span style={{ fontSize: 13, color: C.mut }}>{g.k}</span>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{g.v}</span>
            </div>
          ))}
        </div>

        <div style={card}>
          <SectionTitle color={C.indigo}>حساب و قرارداد</SectionTitle>
          {bank.map((g) => <KV key={g.k} k={g.k} v={g.v} mono={g.mono} />)}
          {contract.map((g) => <KV key={g.k} k={g.k} v={g.v} link={g.link} />)}
        </div>

        <div style={card}>
          <SectionTitle color="#E0A33C">تاریخچه تغییرات</SectionTitle>
          <div style={{ position: 'relative', paddingRight: 6 }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 18, position: 'relative' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: h.color, border: '3px solid #fff', boxShadow: `0 0 0 1px ${C.border}` }} />
                  <span style={{ width: 2, flex: 1, background: C.borderSoft, marginTop: 2 }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11.5, color: C.faint, marginBottom: 2 }}>{h.date}</div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>{h.title}</div>
                  <div style={{ fontSize: 12.5, color: C.mut, marginTop: 2 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

import React from 'react';
import { useApp } from '../store';
import { C } from '../theme';

const input: React.CSSProperties = {
  width: '100%',
  height: 50,
  border: '1.5px solid #E2E7F1',
  borderRadius: 12,
  padding: '0 16px',
  fontSize: 14.5,
  background: '#fff',
  outline: 'none',
};
const label: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  marginBottom: 8,
  color: '#3C4A66',
};
const primaryBtn: React.CSSProperties = {
  width: '100%',
  height: 50,
  border: 'none',
  borderRadius: 12,
  background: C.blue,
  color: '#fff',
  fontSize: 15.5,
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 10px 22px rgba(47,107,237,.32)',
};

const Login: React.FC = () => {
  const { s, set, login, verifyOtp, backToCreds } = useApp();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', direction: 'rtl' }}>
      {/* پنل برند */}
      <div
        style={{
          flex: 1.05,
          background: 'linear-gradient(150deg, #0E2447 0%, #143464 55%, #1C4C8F 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px 60px',
          color: '#fff',
        }}
      >
        <div style={{ position: 'absolute', width: 520, height: 520, borderRadius: '50%', border: '1px solid rgba(255,255,255,.08)', top: -160, left: -120 }} />
        <div style={{ position: 'absolute', width: 360, height: 360, borderRadius: '50%', border: '1px solid rgba(255,255,255,.07)', bottom: -120, right: -80 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ width: 46, height: 46, borderRadius: 12, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 22, boxShadow: '0 8px 24px rgba(47,107,237,.45)' }}>T</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 21, letterSpacing: '.3px' }}>تکنوپی</div>
            <div style={{ fontSize: 12, color: '#9DB6DD', letterSpacing: 2 }}>TECHNOPAY</div>
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.5 }}>
            پنل مدیریت
            <br />
            پذیرندگان و تسویه
          </div>
          <div style={{ fontSize: 15.5, color: '#B9CBE8', lineHeight: 2.1, marginTop: 18, maxWidth: 420 }}>
            داشبورد تراکنش‌ها، گزارش‌گیری لحظه‌ای، مدیریت تسویه و دسترسی شعب و صندوقداران — همه در یک جا.
          </div>
          <div style={{ display: 'flex', gap: 26, marginTop: 34 }}>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>۹۹٫۹٪</div>
              <div style={{ fontSize: 12.5, color: '#9DB6DD', marginTop: 4 }}>پایداری سرویس</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,.12)' }} />
            <div>
              <div style={{ fontSize: 24, fontWeight: 800 }}>۲۴/۷</div>
              <div style={{ fontSize: 12.5, color: '#9DB6DD', marginTop: 4 }}>پشتیبانی تسویه</div>
            </div>
          </div>
        </div>
        <div style={{ position: 'relative', fontSize: 12.5, color: '#7E96BE' }}>© ۱۴۰۵ تکنوپی · تمامی حقوق محفوظ است</div>
      </div>

      {/* فرم */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40, background: C.bg }}>
        <div style={{ width: '100%', maxWidth: 392, animation: 'tpFade .5s ease' }}>
          {s.loginStep === 'creds' ? (
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>ورود به پنل</div>
              <div style={{ fontSize: 14, color: C.mut, marginBottom: 30 }}>برای ادامه، نام کاربری و رمز عبور خود را وارد کنید.</div>
              <label style={label}>نام کاربری</label>
              <input
                value={s.username}
                onChange={(e) => set({ username: e.target.value })}
                placeholder="merchant یا admin"
                style={{ ...input, marginBottom: 18 }}
              />
              <label style={label}>رمز عبور</label>
              <input
                type="password"
                value={s.password}
                onChange={(e) => set({ password: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="••••••••"
                style={input}
              />
              {s.loginError && <div style={{ color: C.red, fontSize: 12.5, marginTop: 12, fontWeight: 600 }}>{s.loginError}</div>}
              <button onClick={login} style={{ ...primaryBtn, marginTop: 26 }}>ورود</button>
              <div style={{ marginTop: 22, background: '#EEF2FB', border: '1px dashed #C7D3EC', borderRadius: 12, padding: '14px 16px', fontSize: 12.5, color: C.sub, lineHeight: 2 }}>
                <b style={{ color: C.ink }}>دسترسی دمو:</b>
                <br />پذیرنده — <span style={{ fontFamily: 'monospace', direction: 'ltr', display: 'inline-block' }}>merchant / merchant</span>
                <br />ادمین — <span style={{ fontFamily: 'monospace', direction: 'ltr', display: 'inline-block' }}>admin / admin</span>
              </div>
            </div>
          ) : (
            <div>
              <button onClick={backToCreds} style={{ background: 'none', border: 'none', color: C.mut, fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 22 }}>→ بازگشت</button>
              <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>تأیید دو مرحله‌ای</div>
              <div style={{ fontSize: 14, color: C.mut, marginBottom: 28, lineHeight: 1.9 }}>
                کد یکبار‌مصرف به شماره <span style={{ fontWeight: 700, color: C.ink }}>۰۹۱۲ ••• ۴۵ ۸۸</span> ارسال شد.
              </div>
              <input
                value={s.otp}
                onChange={(e) => set({ otp: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && verifyOtp()}
                inputMode="numeric"
                maxLength={6}
                placeholder="------"
                style={{ ...input, height: 58, fontSize: 26, fontWeight: 700, letterSpacing: 14, textAlign: 'center', direction: 'ltr', color: C.ink }}
              />
              {s.otpError && <div style={{ color: C.red, fontSize: 12.5, marginTop: 12, fontWeight: 600 }}>{s.otpError}</div>}
              <button onClick={verifyOtp} style={{ ...primaryBtn, marginTop: 24 }}>تأیید و ورود</button>
              <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12.5, color: C.mut }}>
                کد دریافت نکردید؟ <span style={{ color: C.blue, fontWeight: 700, cursor: 'pointer' }}>ارسال مجدد (۰۰:۵۹)</span>
              </div>
              <div style={{ marginTop: 18, textAlign: 'center', background: '#EEF2FB', border: '1px dashed #C7D3EC', borderRadius: 10, padding: 10, fontSize: 12, color: C.sub }}>
                کد دمو: <b style={{ fontFamily: 'monospace', color: C.ink }}>۱۲۳۴</b>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

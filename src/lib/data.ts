import type { DataSet, Merchant, Tx, Channel, TxStatus, SettleStatus, ChannelType } from '../types';
import { faDigits } from './format';

// ساخت داده‌ی نمونه‌ی قطعی (seeded) — همیشه یک خروجی ثابت تولید می‌کند.
// برای اتصال به API واقعی، این فایل را با fetch جایگزین کنید و همان شکل DataSet را برگردانید.
export function buildData(): DataSet {
  let seed = 20260621;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const pick = <T>(a: T[]): T => a[Math.floor(rnd() * a.length)];
  const ri = (lo: number, hi: number) => Math.floor(rnd() * (hi - lo + 1)) + lo;

  const fn = ['علی', 'محمد', 'زهرا', 'فاطمه', 'رضا', 'حسین', 'مریم', 'سارا', 'امیر', 'نگار', 'مهدی', 'الهام', 'بهرام', 'نسیم', 'کاوه', 'پریسا', 'سینا', 'لیلا', 'آرش', 'یاسمن'];
  const ln = ['محمدی', 'حسینی', 'کریمی', 'رضایی', 'احمدی', 'موسوی', 'نوری', 'صادقی', 'جعفری', 'قاسمی', 'یوسفی', 'بهرامی', 'شریفی', 'کاظمی', 'مرادی'];
  const cities = ['تهران', 'اصفهان', 'شیراز', 'مشهد', 'تبریز', 'کرج', 'اهواز', 'قم'];
  const banks = ['بانک ملت', 'بانک ملی', 'بانک پاسارگاد', 'بانک سامان', 'بانک پارسیان'];

  const merchants: Merchant[] = [
    { id: 'm1', name: 'فروشگاه پوشاک آرمان', category: 'پوشاک', type: 'حقوقی', city: 'تهران', acc: '', sheba: '', bank: '' },
    { id: 'm2', name: 'هایپرمارکت یاس', category: 'خرده‌فروشی', type: 'حقوقی', city: 'کرج', acc: '', sheba: '', bank: '' },
    { id: 'm3', name: 'رستوران ونیز', category: 'رستوران', type: 'حقیقی', city: 'تهران', acc: '', sheba: '', bank: '' },
    { id: 'm4', name: 'دیجی‌لند الکترونیک', category: 'لوازم الکترونیکی', type: 'حقوقی', city: 'اصفهان', acc: '', sheba: '', bank: '' },
    { id: 'm5', name: 'داروخانه دکتر رضایی', category: 'دارو و سلامت', type: 'حقیقی', city: 'شیراز', acc: '', sheba: '', bank: '' },
    { id: 'm6', name: 'آرایشی بهداشتی رز', category: 'آرایشی بهداشتی', type: 'حقیقی', city: 'مشهد', acc: '', sheba: '', bank: '' },
  ];

  const branchMap: Record<string, string[]> = {
    m1: ['شعبه مرکزی (ولیعصر)', 'شعبه ونک', 'شعبه تجریش', 'شعبه غرب (صادقیه)'],
    m2: ['شعبه گوهردشت', 'شعبه عظیمیه'],
    m3: ['شعبه اصلی'],
    m4: ['شعبه چهارباغ', 'شعبه سپاهان‌شهر', 'شعبه آنلاین'],
    m5: ['شعبه معالی‌آباد'],
    m6: ['شعبه احمدآباد', 'شعبه وکیل‌آباد'],
  };
  const cashierMap: Record<string, string[]> = {
    m1: ['علی محمدی', 'زهرا کریمی', 'رضا نوری', 'مریم حسینی', 'حسین رضایی'],
    m2: ['سعید قاسمی', 'نگار یوسفی', 'بهرام بهرامی'],
    m3: ['سینا مرادی', 'لیلا شریفی'],
    m4: ['آرش کاظمی', 'یاسمن صادقی', 'امیر جعفری'],
    m5: ['پریسا احمدی'],
    m6: ['کاوه موسوی', 'الهام نوری'],
  };
  const channelType: Record<string, ChannelType> = {
    m1: 'mixed', m2: 'mixed', m3: 'offline', m4: 'mixed', m5: 'offline', m6: 'online',
  };

  merchants.forEach((m) => {
    m.acc = faDigits(`${ri(1000, 9999)}-${ri(10, 99)}-${ri(1000000, 9999999)}-${ri(1, 9)}`);
    m.sheba = 'IR' + faDigits(String(ri(100000, 999999)) + String(ri(100000000000000, 999999999999999)).slice(0, 18));
    m.bank = pick(banks);
  });

  const tx: Tx[] = [];
  const today = new Date('2026-06-21T12:00:00');
  let counter = 480112;

  merchants.forEach((m) => {
    const n = m.id === 'm1' ? 210 : ri(40, 70);
    const brs = branchMap[m.id];
    const css = cashierMap[m.id];
    const ct = channelType[m.id];
    for (let i = 0; i < n; i++) {
      let channel: Channel;
      if (ct === 'offline') channel = 'offline';
      else if (ct === 'online') channel = 'online';
      else channel = rnd() < 0.58 ? 'offline' : 'online';

      const dayAgo = ri(0, 29);
      const reg = new Date(today.getTime() - dayAgo * 86400000 - ri(0, 80000) * 1000);
      const settle = new Date(reg.getTime() + 7 * 86400000);
      const settled = settle <= today;
      const amount = ri(2, 250) * 100000;
      const fee = Math.round(amount * 0.015);
      const commission = Math.round(amount * 0.02);
      const tax = Math.round(fee * 0.09);
      const wallet = rnd() < 0.3 ? ri(1, 8) * 50000 : 0;
      const status: TxStatus = rnd() < 0.07 ? 'refunded' : 'success';
      const offlineBranches = brs.filter((b) => !b.includes('آنلاین'));
      const branch =
        channel === 'online'
          ? brs.find((b) => b.includes('آنلاین')) || 'فروشگاه آنلاین'
          : pick(offlineBranches.length ? offlineBranches : brs);
      const cashier = channel === 'offline' ? pick(css) : null;
      const settleStatus: SettleStatus = settled ? 'settled' : 'pending';

      tx.push({
        id: 'TP-' + counter++,
        merchantId: m.id,
        merchantName: m.name,
        status,
        channel,
        branch,
        cashier,
        customer: pick(fn) + ' ' + pick(ln),
        phone: '۰۹' + faDigits(`${ri(10, 39)} ${ri(100, 999)} ${ri(1000, 9999)}`),
        nationalId: faDigits(String(ri(1000000000, 4999999999))),
        city: pick(cities),
        category: m.category,
        amount,
        fee,
        commission,
        tax,
        wallet,
        paidInStore: amount - wallet,
        reg,
        settle,
        settleStatus,
        acc: m.acc,
      });
    }
  });

  tx.sort((a, b) => b.reg.getTime() - a.reg.getTime());
  return { merchants, branchMap, cashierMap, channelType, tx, today };
}

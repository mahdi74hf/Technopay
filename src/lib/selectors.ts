import type { AppState, DataSet, Tx, Option } from '../types';

// انتخابگرها (selectors): توابع خالص که از داده + وضعیت، خروجی مشتق می‌سازند.

export const scopeMerchant = (s: AppState): string =>
  s.role === 'merchant' ? 'm1' : s.f.merchant;

export const scopedTx = (data: DataSet, s: AppState): Tx[] => {
  const sm = scopeMerchant(s);
  return data.tx.filter((t) => (sm === 'all' ? true : t.merchantId === sm));
};

export const branchList = (data: DataSet, s: AppState): string[] => {
  const sm = scopeMerchant(s);
  let list: string[] = [];
  if (sm === 'all') data.merchants.forEach((m) => list.push(...data.branchMap[m.id]));
  else {
    list = [...data.branchMap[sm]];
    if (sm === 'm1') list = list.concat(s.branchesExtra.map((b) => b.name));
  }
  return Array.from(new Set(list));
};

export const cashierList = (data: DataSet, s: AppState): string[] => {
  const sm = scopeMerchant(s);
  let list: string[] = [];
  if (sm === 'all') data.merchants.forEach((m) => list.push(...data.cashierMap[m.id]));
  else {
    list = [...data.cashierMap[sm]];
    if (sm === 'm1') list = list.concat(s.cashiersExtra.map((c) => c.name));
  }
  return Array.from(new Set(list));
};

interface FilterOpts {
  status?: boolean;
  settle?: boolean;
}

export const applyFilters = (data: DataSet, s: AppState, arr: Tx[], opts: FilterOpts = {}): Tx[] => {
  const f = s.f;
  const days = f.range === 'all' ? 9999 : +f.range;
  const cutoff = new Date(data.today.getTime() - days * 86400000);
  return arr.filter((t) => {
    if (t.reg < cutoff) return false;
    if (f.branch !== 'all' && t.branch !== f.branch) return false;
    if (f.channel !== 'all' && t.channel !== f.channel) return false;
    if (f.cashier !== 'all' && t.cashier !== f.cashier) return false;
    if (opts.status && f.status !== 'all' && t.status !== f.status) return false;
    if (opts.settle && f.settle !== 'all' && t.settleStatus !== f.settle) return false;
    if (f.search) {
      const q = f.search.trim();
      if (!(t.id.includes(q) || t.customer.includes(q) || t.phone.includes(q) || t.nationalId.includes(q)))
        return false;
    }
    return true;
  });
};

export const dashTx = (data: DataSet, s: AppState): Tx[] => applyFilters(data, s, scopedTx(data, s), {});
export const reportTx = (data: DataSet, s: AppState): Tx[] =>
  applyFilters(data, s, scopedTx(data, s), { status: true });
export const settleTx = (data: DataSet, s: AppState): Tx[] =>
  applyFilters(
    data,
    s,
    scopedTx(data, s).filter((t) => t.settleStatus === 'pending'),
    { settle: false }
  );

// گزینه‌های فیلتر
export const rangeOpts: Option[] = [
  { value: '7', label: '۷ روز اخیر' },
  { value: '30', label: '۳۰ روز اخیر' },
  { value: '90', label: '۹۰ روز اخیر' },
  { value: 'all', label: 'همه' },
];
export const channelOpts: Option[] = [
  { value: 'all', label: 'همه کانال‌ها' },
  { value: 'online', label: 'آنلاین' },
  { value: 'offline', label: 'آفلاین' },
];
export const statusOpts: Option[] = [
  { value: 'all', label: 'همه وضعیت‌ها' },
  { value: 'success', label: 'موفق' },
  { value: 'refunded', label: 'ریفاند شده' },
];

export const branchOpts = (data: DataSet, s: AppState): Option[] => [
  { value: 'all', label: 'همه شعب' },
  ...branchList(data, s).map((b) => ({ value: b, label: b })),
];
export const cashierOpts = (data: DataSet, s: AppState): Option[] => [
  { value: 'all', label: 'همه صندوقداران' },
  ...cashierList(data, s).map((c) => ({ value: c, label: c })),
];

export const statusTok = (status: Tx['status']) =>
  status === 'success'
    ? { label: 'موفق', color: '#12936A', bg: '#E4F5EE' }
    : { label: 'ریفاند شده', color: '#D1495B', bg: '#FBE7EA' };

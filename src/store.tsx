import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AppState, DataSet, Tx, Filters } from './types';
import { buildData } from './lib/data';
import { reportTx, settleTx, branchList } from './lib/selectors';
import { jDate } from './lib/jalali';

// داده یک‌بار ساخته می‌شود (برای API واقعی، اینجا fetch کنید).
const DATA: DataSet = buildData();

const initialFilters: Filters = {
  range: '30',
  branch: 'all',
  channel: 'all',
  cashier: 'all',
  status: 'all',
  settle: 'all',
  merchant: 'all',
  search: '',
};

const initialState: AppState = {
  screen: 'login',
  loginStep: 'creds',
  role: 'merchant',
  username: '',
  password: '',
  loginError: '',
  otp: '',
  otpError: '',
  nav: 'dashboard',
  f: initialFilters,
  drawerTx: null,
  branchesExtra: [],
  cashiersExtra: [],
  newBranch: '',
  newBranchCity: 'تهران',
  newCashier: '',
  newCashierBranch: '',
  chartMode: 'amount',
  hoverIdx: null,
};

interface Store {
  data: DataSet;
  s: AppState;
  set: (patch: Partial<AppState>) => void;
  setFilter: (name: keyof Filters, value: string) => void;
  resetFilters: () => void;
  // auth
  login: () => void;
  verifyOtp: () => void;
  backToCreds: () => void;
  logout: () => void;
  // nav
  go: (nav: AppState['nav']) => void;
  openDrawer: (t: Tx) => void;
  closeDrawer: () => void;
  // access
  addBranch: () => void;
  addCashier: () => void;
  removeBranch: (i: number) => void;
  removeCashier: (i: number) => void;
  // export
  exportReports: () => void;
  exportSettle: () => void;
}

const Ctx = createContext<Store | null>(null);

function downloadCsv(name: string, rows: (string | number)[][]) {
  const csv =
    '\uFEFF' +
    rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [s, setState] = useState<AppState>(initialState);

  const set = useCallback((patch: Partial<AppState>) => setState((prev) => ({ ...prev, ...patch })), []);

  const setFilter = useCallback(
    (name: keyof Filters, value: string) =>
      setState((prev) => ({ ...prev, f: { ...prev.f, [name]: value }, hoverIdx: null })),
    []
  );

  const resetFilters = useCallback(
    () =>
      setState((prev) => ({
        ...prev,
        f: { ...prev.f, range: '30', branch: 'all', channel: 'all', cashier: 'all', status: 'all', settle: 'all', search: '' },
        hoverIdx: null,
      })),
    []
  );

  const login = useCallback(() => {
    setState((prev) => {
      const u = prev.username.trim().toLowerCase();
      const p = prev.password.trim();
      if (u === 'merchant' && p === 'merchant')
        return { ...prev, role: 'merchant', loginStep: 'otp', loginError: '', otp: '' };
      if (u === 'admin' && p === 'admin')
        return { ...prev, role: 'admin', loginStep: 'otp', loginError: '', otp: '' };
      return { ...prev, loginError: 'نام کاربری یا رمز عبور نادرست است.' };
    });
  }, []);

  const verifyOtp = useCallback(() => {
    setState((prev) =>
      prev.otp.trim().length >= 4
        ? { ...prev, screen: 'app', nav: 'dashboard', otpError: '', f: { ...prev.f, merchant: 'all' } }
        : { ...prev, otpError: 'کد را کامل وارد کنید (حداقل ۴ رقم).' }
    );
  }, []);

  const backToCreds = useCallback(() => set({ loginStep: 'creds', otpError: '' }), [set]);
  const logout = useCallback(
    () => set({ screen: 'login', loginStep: 'creds', username: '', password: '', otp: '', drawerTx: null }),
    [set]
  );

  const go = useCallback((nav: AppState['nav']) => set({ nav, drawerTx: null }), [set]);
  const openDrawer = useCallback((t: Tx) => set({ drawerTx: t }), [set]);
  const closeDrawer = useCallback(() => set({ drawerTx: null }), [set]);

  const addBranch = useCallback(() => {
    setState((prev) => {
      const n = prev.newBranch.trim();
      if (!n) return prev;
      return {
        ...prev,
        branchesExtra: [...prev.branchesExtra, { name: n, city: prev.newBranchCity, date: jDate(DATA.today) }],
        newBranch: '',
      };
    });
  }, []);

  const addCashier = useCallback(() => {
    setState((prev) => {
      const n = prev.newCashier.trim();
      if (!n) return prev;
      const br = prev.newCashierBranch || branchList(DATA, prev)[0] || '';
      return {
        ...prev,
        cashiersExtra: [...prev.cashiersExtra, { name: n, branch: br, date: jDate(DATA.today) }],
        newCashier: '',
      };
    });
  }, []);

  const removeBranch = useCallback(
    (i: number) => setState((prev) => ({ ...prev, branchesExtra: prev.branchesExtra.filter((_, x) => x !== i) })),
    []
  );
  const removeCashier = useCallback(
    (i: number) => setState((prev) => ({ ...prev, cashiersExtra: prev.cashiersExtra.filter((_, x) => x !== i) })),
    []
  );

  const exportReports = useCallback(() => {
    const head = ['شماره تراکنش', 'وضعیت', 'نام مشتری', 'نام پذیرنده', 'روش ثبت', 'مبلغ', 'کارمزد', 'کمیسیون', 'مالیات', 'مبلغ ولت', 'پرداخت در فروشگاه', 'دسته‌بندی', 'شهر', 'شعبه', 'صندوقدار', 'موبایل مشتری', 'کد ملی', 'تاریخ ثبت', 'تاریخ تسویه', 'وضعیت تسویه'];
    const rows = reportTx(DATA, s).map((t) => [
      t.id, t.status === 'success' ? 'موفق' : 'ریفاند', t.customer, t.merchantName,
      t.channel === 'online' ? 'آنلاین' : 'آفلاین', t.amount, t.fee, t.commission, t.tax, t.wallet,
      t.paidInStore, t.category, t.city, t.branch, t.cashier || '-', t.phone, t.nationalId,
      jDate(t.reg), jDate(t.settle), t.settleStatus === 'settled' ? 'تسویه‌شده' : 'در انتظار',
    ]);
    downloadCsv('technopay-reports.csv', [head, ...rows]);
  }, [s]);

  const exportSettle = useCallback(() => {
    const head = ['نام پذیرنده', 'مبلغ تراکنش', 'مالیات', 'کارمزد', 'کمیسیون', 'مبلغ قابل تسویه', 'تاریخ تسویه', 'وضعیت', 'دسته‌بندی', 'موبایل', 'شماره حساب', 'شعبه'];
    const rows = settleTx(DATA, s).map((t) => [
      t.merchantName, t.amount, t.tax, t.fee, t.commission, t.amount - t.fee - t.commission - t.tax,
      jDate(t.settle), 'در انتظار تسویه', t.category, t.phone, t.acc, t.branch,
    ]);
    downloadCsv('technopay-settlements.csv', [head, ...rows]);
  }, [s]);

  const store: Store = {
    data: DATA, s, set, setFilter, resetFilters,
    login, verifyOtp, backToCreds, logout,
    go, openDrawer, closeDrawer,
    addBranch, addCashier, removeBranch, removeCashier,
    exportReports, exportSettle,
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
};

export const useApp = (): Store => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

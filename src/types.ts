// ---------- دامنه‌ی داده‌ها (Domain types) ----------

export type Role = 'merchant' | 'admin';
export type Channel = 'online' | 'offline';
export type TxStatus = 'success' | 'refunded';
export type SettleStatus = 'settled' | 'pending';
export type ChannelType = 'mixed' | 'online' | 'offline';

export interface Merchant {
  id: string;
  name: string;
  category: string;
  type: 'حقیقی' | 'حقوقی';
  city: string;
  acc: string;
  sheba: string;
  bank: string;
}

export interface Tx {
  id: string;
  merchantId: string;
  merchantName: string;
  status: TxStatus;
  channel: Channel;
  branch: string;
  cashier: string | null;
  customer: string;
  phone: string;
  nationalId: string;
  city: string;
  category: string;
  amount: number;
  fee: number;
  commission: number;
  tax: number;
  wallet: number;
  paidInStore: number;
  reg: Date;
  settle: Date;
  settleStatus: SettleStatus;
  acc: string;
}

export interface DataSet {
  merchants: Merchant[];
  branchMap: Record<string, string[]>;
  cashierMap: Record<string, string[]>;
  channelType: Record<string, ChannelType>;
  tx: Tx[];
  today: Date;
}

// ---------- وضعیت اپ (App state) ----------

export interface Filters {
  range: string; // '7' | '30' | '90' | 'all'
  branch: string; // 'all' | branch name
  channel: string; // 'all' | 'online' | 'offline'
  cashier: string; // 'all' | cashier name
  status: string; // 'all' | 'success' | 'refunded'
  settle: string; // 'all' | 'settled' | 'pending'
  merchant: string; // 'all' | merchant id  (فقط ادمین)
  search: string;
}

export type Screen = 'login' | 'app';
export type LoginStep = 'creds' | 'otp';
export type Nav = 'dashboard' | 'reports' | 'settlements' | 'access' | 'profile';
export type ChartMode = 'amount' | 'count';

export interface ExtraBranch {
  name: string;
  city: string;
  date: string;
}
export interface ExtraCashier {
  name: string;
  branch: string;
  date: string;
}

export interface AppState {
  screen: Screen;
  loginStep: LoginStep;
  role: Role;
  username: string;
  password: string;
  loginError: string;
  otp: string;
  otpError: string;
  nav: Nav;
  f: Filters;
  drawerTx: Tx | null;
  branchesExtra: ExtraBranch[];
  cashiersExtra: ExtraCashier[];
  newBranch: string;
  newBranchCity: string;
  newCashier: string;
  newCashierBranch: string;
  chartMode: ChartMode;
  hoverIdx: number | null;
}

export interface Option {
  value: string;
  label: string;
}

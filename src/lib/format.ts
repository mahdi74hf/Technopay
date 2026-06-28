// قالب‌بندی اعداد فارسی
const FA = '۰۱۲۳۴۵۶۷۸۹';

export const faDigits = (s: string | number): string =>
  String(s).replace(/[0-9]/g, (d) => FA[+d]);

export const group = (n: number): string =>
  Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '٬');

/** عدد با جداکننده‌ی هزارگان و ارقام فارسی */
export const fa = (n: number): string => faDigits(group(n));

/** مبلغ به ریال */
export const money = (n: number): string => fa(n) + ' ریال';

/** نمایش فشرده: میلیون / میلیارد */
export const compact = (n: number): string => {
  if (n >= 1e9) return faDigits((n / 1e9).toFixed(2).replace('.', '٫')) + ' میلیارد';
  if (n >= 1e6) return faDigits((n / 1e6).toFixed(1).replace('.', '٫')) + ' میلیون';
  return fa(n);
};

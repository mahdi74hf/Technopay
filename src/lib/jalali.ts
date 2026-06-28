import { faDigits } from './format';

// تبدیل تاریخ میلادی به شمسی (الگوریتم استاندارد)
export function g2j(gy: number, gm: number, gd: number): [number, number, number] {
  const gdm = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy: number;
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    gdm[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

const MN = ['', 'فرو', 'ارد', 'خرد', 'تیر', 'مرد', 'شهر', 'مهر', 'آبا', 'آذر', 'دی', 'بهم', 'اسف'];
const pad = (n: number) => String(n).padStart(2, '0');

/** تاریخ کامل: ۱۴۰۵/۰۳/۳۱ */
export const jDate = (d: Date): string => {
  const [y, m, day] = g2j(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return faDigits(`${y}/${pad(m)}/${pad(day)}`);
};

/** تاریخ کوتاه برای محور نمودار: ۳۱ خرد */
export const jShort = (d: Date): string => {
  const [, m, day] = g2j(d.getFullYear(), d.getMonth() + 1, d.getDate());
  return faDigits(day) + ' ' + MN[m];
};

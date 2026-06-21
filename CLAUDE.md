# CLAUDE.md — راهنمای کار با این پروژه برای Claude Code

این فایل برای دستیار Claude Code است. هدف: ادامه‌ی توسعه‌ی «پنل تکنوپی» به سبک vibe coding —
کاربر تغییری را به زبان ساده می‌گوید، تو اعمال می‌کنی، سپس commit و push می‌شود.

---

## Stack
- **React 18 + TypeScript + Vite**. بدون فریم‌ورک UI، بدون Tailwind.
- استایل‌دهی **inline** با شیء style و توکن‌های رنگ از `src/theme.ts`.
- رابط کاربری **RTL/فارسی**. اعداد با ارقام فارسی (helperهای `src/lib/format.ts`).

## دستورها
```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run typecheck  # بررسی تایپ بدون اجرا
```

## ورود دمو
- پذیرنده: `merchant` / `merchant` — ادمین: `admin` / `admin` — کد OTP: `1234`

## نقشه‌ی کد (کجا چه چیزی را عوض کنم)
- **منطق/داده** → `src/lib/`
  - اعداد و تاریخ: `format.ts`, `jalali.ts`
  - داده‌ی نمونه: `data.ts` (تابع `buildData`؛ برای API واقعی همین را جایگزین کن)
  - فیلتر/اسکوپ/گزینه‌ها: `selectors.ts`
- **وضعیت سراسری و اکشن‌ها** → `src/store.tsx` (Context + `useApp()` hook). خروجی CSV هم اینجاست.
- **صفحات** → `src/components/pages/` (`Dashboard`, `Reports`, `Settlements`, `Profile`, `Access`)
- **اجزای مشترک** → `src/components/` (`Login`, `Sidebar`, `Topbar`, `FilterBar`, `Drawer`)
- **نمودارها** → `src/components/charts/` (SVG سفارشی، بدون کتابخانه)
- **رنگ‌ها/برند** → `src/theme.ts` (یک‌جا؛ برای تغییر رنگ برند فقط همین فایل)

## قواعد (Conventions)
1. **استایل inline** بمان؛ کلاس CSS و کتابخانه‌ی استایل اضافه نکن مگر کاربر بخواهد.
2. رنگ‌ها را از `C` در `theme.ts` بگیر، رنگ هاردکد نساز.
3. اعداد نمایشی را با `fa()`, `money()`, `compact()` فارسی کن؛ تاریخ‌ها با `jDate()`/`jShort()`.
4. وضعیت جدید را در `AppState` (در `types.ts`) تعریف کن و اکشن متناظر را در `store.tsx` بساز؛
   کامپوننت‌ها از `useApp()` می‌خوانند.
5. منطق فیلتر/مشتق را در `selectors.ts` به‌صورت توابع خالص نگه‌دار (تست‌پذیر و قابل‌استفاده‌ی مجدد).
6. اختلاف نقش پذیرنده/ادمین: ادمین فیلتر `merchant` دارد و ستون «پذیرنده» وقتی `merchant === 'all'` است
   نمایش داده می‌شود. تابع `scopeMerchant(s)` نقطه‌ی مرجع است.
7. بعد از هر تغییر، `npm run typecheck` را اجرا کن و خطاها را رفع کن.

## نمونه تغییرها (چطور انجام بده)
- «رنگ برند را سبز کن» → `C.blue` و گرادیان‌های مرتبط در `theme.ts`/`Login.tsx`/`Sidebar.tsx`.
- «یک KPI جدید اضافه کن» → آرایه‌ی `kpis` در `pages/Dashboard.tsx`.
- «ستون شهر به جدول گزارشات» → `pages/Reports.tsx` (هم `<th>` هم `<td>`؛ از `t.city`).
- «فیلتر جدید» → گزینه‌ها در `selectors.ts`، فیلد در `Filters` (types.ts)، اعمال در `applyFilters`.
- «اتصال به API» → `lib/data.ts` را با fetch جایگزین کن و همان `DataSet` را برگردان.

## Git / حلقه‌ی vibe coding
- شاخه‌ی اصلی: `main`. برای هر تغییر معنی‌دار commit جدا با پیام فارسی روشن بزن.
- جریان پیشنهادی:
  ```bash
  npm run typecheck && npm run build   # مطمئن شو سالم است
  git add -A
  git commit -m "<توضیح تغییر>"
  git push
  ```
- چیزی را که در `.gitignore` هست (`node_modules`, `dist`) commit نکن.

## چیزهایی که عوض نکن مگر درخواست شود
- جهت RTL و فونت Vazirmatn (در `index.html` و `index.css`).
- ساختار Context/selectors (ستون فقرات اپ).

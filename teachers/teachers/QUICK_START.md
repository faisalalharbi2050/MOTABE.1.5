# 🚀 ابدأ بسرعة - Quick Start

## ✨ في 3 خطوات فقط!

### 1️⃣ انسخ الملفات
```bash
# انسخ المجلد كاملاً إلى مشروعك
cp -r export/teachers/* your-nextjs-project/
```

### 2️⃣ ثبّت الاعتمادات
```bash
npm install
# أو
yarn install
# أو
pnpm install
```

### 3️⃣ شغّل المشروع
```bash
npm run dev
# زُر http://localhost:3000/teachers
```

---

## 📁 هيكل المشروع

```
your-nextjs-project/
├── app/
│   └── teachers/
│       ├── page.tsx         ← الصفحة الرئيسية
│       └── loading.tsx
├── components/
│   └── ui/                  ← المكونات المعاد استخدامها
├── lib/
│   └── excel.ts            ← استيراد Excel
├── styles/
│   └── globals.css         ← الأنماط
└── ...
```

---

## 🎯 الخطوات الأساسية للتكامل الكامل

### أ) تحديث `app/layout.tsx`
```tsx
import "./styles/globals.css";  // استيراد الأنماط

export const metadata = {
  title: "إدارة المعلمين والإداريين",
  description: "نظام إدارة المعلمين والإداريين",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
```

### ب) تحديث `tsconfig.json`
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### ج) إضافة خط Cairo (اختياري)
في `app/layout.tsx`:
```tsx
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["arabic"] });

export default function RootLayout({...}) {
  return (
    <html lang="ar" style={{ fontFamily: cairo.style.fontFamily }}>
      ...
    </html>
  );
}
```

---

## 🧪 اختبر المشروع

1. **أضف معلماً**: اضغط على "إضافة معلم"
2. **استيرد ملف**: حضّر ملف Excel بهذه الأعمدة:
   - الاسم
   - التخصص
   - الجوال
3. **اطبع**: اضغط على "طباعة"

---

## 🔧 حل مشاكل شائعة

| المشكلة | الحل |
|-------|------|
| الصفحة بيضاء | تأكد من `"use client"` في أعلى page.tsx |
| الأسلوب لا يعمل | تحقق من استيراد `globals.css` في `layout.tsx` |
| لا توجد أيقونات | ثبّت `npm install lucide-react` |
| Excel لا يعمل | ثبّت `npm install xlsx` |

---

## 📞 للمساعدة

اقرأ `README.md` للمزيد من المعلومات التفصيلية!

# 📋 قائمة الملفات والهيكل

هذا الملف يوضح بنية المشروع المُصدَّر بالكامل.

## 📂 هيكل المجلدات

```
teachers-export/
│
├── 📄 README.md                    # دليل التوثيق الكامل (عربي)
├── 📄 QUICK_START.md               # ابدأ بسرعة في 3 خطوات
├── 📄 INTEGRATION_GUIDE.md         # دليل التكامل التفصيلي
├── 📄 package.json                 # اعتمادات المشروع
├── 📄 tailwind.config.ts           # إعدادات Tailwind
├── 📄 tsconfig.json                # إعدادات TypeScript
├── 📄 postcss.config.js            # إعدادات PostCSS
├── 📄 next.config.mjs              # إعدادات Next.js
│
├── 📁 app/
│   └── 📁 teachers/
│       ├── 📄 page.tsx             # الصفحة الرئيسية (1179 سطر)
│       └── 📄 loading.tsx          # هيكل التحميل (skeleton)
│
├── 📁 components/
│   └── 📁 ui/
│       ├── 📄 Button.tsx           # مكون الزر
│       ├── 📄 Card.tsx             # مكون البطاقة
│       ├── 📄 Badge.tsx            # مكون الشارة
│       ├── 📄 PageHeader.tsx       # رأس الصفحة
│       └── 📄 index.ts             # فهرس الاستيراد السريع
│
├── 📁 lib/
│   └── 📄 excel.ts                 # دالات استيراد Excel
│
└── 📁 styles/
    └── 📄 globals.css              # الأنماط العامة
```

## 📊 إحصائيات الملفات

| الملف | السطور | الوظيفة |
|------|--------|---------|
| page.tsx | 1179 | الصفحة الرئيسية الكاملة |
| loading.tsx | 44 | هيكل التمويل والتحميل |
| Button.tsx | 45 | مكون زر قابل للتخصيص |
| Card.tsx | 14 | مكون بطاقة زجاجية |
| Badge.tsx | 21 | مكون شارة ملونة |
| PageHeader.tsx | 40 | رأس الصفحة الثابت |
| excel.ts | 48 | معالج ملفات Excel |
| globals.css | 100+ | أنماط Tailwind وحسن التخصيص |

## 🔗 العلاقات بين الملفات

```
page.tsx
  ├── imports Button from components/ui/Button.tsx
  ├── imports Card from components/ui/Card.tsx
  ├── imports Badge from components/ui/Badge.tsx
  ├── imports PageHeader from components/ui/PageHeader.tsx
  └── imports parseTeachersExcel from lib/excel.ts

excel.ts
  └── exports TeacherData interface
      └── استخدمها في page.tsx

globals.css
  └── يُستيراد في app/layout.tsx
      └── يطبق الأنماط على كل الصفحات
```

## 🎨 الألوان والأنماط

### الألوان الأساسية
- **Primary**: `#655ac1` (بنفسجي)
- **Primary Light**: `#8779fb`
- **Primary Subtle**: `#e5e1fe`
- **Secondary**: `#8779fb`
- **Accent**: `#e5e1fe`

### الخطوط
- الخط الأساسي: Cairo (عربي)
- Font Stack: `['var(--font-cairo)', 'sans-serif']`

## 🧩 المكونات المستخدمة

### Button Component
```tsx
<Button variant="primary">اضغط هنا</Button>
<Button variant="secondary" size="sm">صغير</Button>
<Button icon={SomeIcon}>مع أيقونة</Button>
```

### Card Component
```tsx
<Card>المحتوى هنا</Card>
<Card noHover>بدون hover effect</Card>
```

### Badge Component
```tsx
<Badge variant="success">نجح</Badge>
<Badge variant="warning">تحذير</Badge>
```

### PageHeader Component
```tsx
<PageHeader title="العنوان" subtitle="الوصف">
  محتوى الشريط العلوي
</PageHeader>
```

## 📦 الاعتماديات الخارجية

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "lucide-react": "^0.263.0",         // الأيقونات
    "xlsx": "^0.18.5"                   // استيراد Excel
  },
  "devDependencies": {
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.14",
    "postcss": "^8.4.24",
    "typescript": "^5.0.0"
  }
}
```

## 🔄 صيغ الاستيراد

يستخدم المشروع **المسارات النسبية** بدلاً من alias:

```tsx
// ✅ صحيح (مستخدم)
import { Button } from "../../components/ui/Button";

// ❌ لن يعمل (إلا إذا حدثت tsconfig)
import { Button } from "@/components/ui/Button";
```

## 📱 الاستجابة (Responsive)

- **Desktop**: جداول كاملة مع جميع الميزات
- **Tablet**: جداول مع scroll أفقي
- **Mobile**: عروض Card بدلاً من الجداول

## 💾 التخزين المحلي (localStorage)

```javascript
// تُحفظ البيانات تحت:
localStorage.getItem("injazi_teachers")      // قائمة المعلمين
localStorage.getItem("injazi_spec_order")    // ترتيب التخصصات
```

---

**هل تريد المزيد من المعلومات؟ اقرأ README.md!** 📖

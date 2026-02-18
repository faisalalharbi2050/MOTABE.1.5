#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import openpyxl

# فتح ملف Excel
excel_file = "خطة المقررات الدراسية 1447هـ.xlsx"
workbook = openpyxl.load_workbook(excel_file)
worksheet = workbook.active

# قراءة البيانات
data = []
for row in worksheet.iter_rows(min_row=2, values_only=True):
    # التأكد من أن الصف ليس فارغاً
    if row[0] is not None and row[0] != "المرحلة":
        # تخطي أسطر الرؤساء الإضافية
        if row[0] == "الصف الدراسي":
            continue
        
        # تنظيف المسافات الزائدة من كل الأعمدة
        phase = str(row[0]).strip() if row[0] else None
        grade = ' '.join(str(row[1]).split()) if row[1] else None  # تنظيف المسافات المتعددة
        subject = str(row[2]).strip() if row[2] else None
        periods = int(row[3]) if row[3] and isinstance(row[3], int) else 0
        
        if phase and grade and subject:
            data.append({
                'phase': phase,
                'grade': grade,
                'subject': subject,
                'periods': periods
            })

print(f"✓ تم قراءة {len(data)} مادة من Excel\n")

# تحديد نوع المرحلة
def get_phase_type(phase_name):
    if 'ابتدائي' in phase_name:
        return 'ELEMENTARY'
    elif 'متوسط' in phase_name:
        return 'MIDDLE'
    elif 'ثانوي' in phase_name:
        return 'HIGH'
    return 'ELEMENTARY'

# استخراج الشعبة من اسم المرحلة
def get_department(phase_name):
    if 'تحفيظ' in phase_name:
        return 'تحفيظ'
    elif 'حاسب' in phase_name or 'هندسة' in phase_name:
        return 'حاسب وهندسة'
    elif 'صحة' in phase_name or 'حياة' in phase_name:
        return 'صحة وحياة'
    elif 'إدارة' in phase_name or 'أعمال' in phase_name:
        return 'إدارة أعمال'
    elif 'شرعي' in phase_name:
        return 'شرعي'
    else:
        return 'عام'

# تحويل اسم الصف إلى كود
def get_grade_code(grade_name):
    grade_clean = grade_name.strip().replace('  ', ' ')
    
    if 'الصف الأول' in grade_clean and '/' not in grade_clean:
        return 'grade1'
    elif 'الصف الثاني' in grade_clean and '/' not in grade_clean:
        return 'grade2'
    elif 'الصف الثالث' in grade_clean and '/' not in grade_clean:
        return 'grade3'
    elif 'الصفوف العليا' in grade_clean or '4-6' in grade_clean:
        return 'upper'
    elif 'والثاني والثالث' in grade_clean:
        return 'grades123'
    elif 'والثاني' in grade_clean:
        return 'grades12'
    elif 'والثالث' in grade_clean:
        return 'grades23'
    else:
        return 'mixed'

# إنشاء اسم export
def make_export_name(phase_name, grade_code):
    phase_type = get_phase_type(phase_name).lower()
    
    # استخراج المسار/الشعبة
    if 'مسار عام' in phase_name:
        path = 'general'
    elif 'مسار حاسب' in phase_name:
        path = 'cs_eng'
    elif 'مسار صحة' in phase_name:
        path = 'health'
    elif 'مسار إدارة' in phase_name:
        path = 'business'
    elif 'مسار شرعي' in phase_name:
        path = 'islamic'
    elif 'تحفيظ' in phase_name:
        path = 'quran'
    else:
        path = 'general'
    
    # استخراج السنة من الثانوية
    year = ''
    if 'الأولى' in phase_name:
        year = 'y1'
    elif 'الثانية' in phase_name:
        year = 'y2'
    elif 'الثالثة' in phase_name:
        year = 'y3'
    
    # بناء الاسم
    if year:
        name = f"excel_{phase_type}_{year}_{path}_{grade_code}"
    else:
        name = f"excel_{phase_type}_{path}_{grade_code}"
    
    return name

# تجميع البيانات
groups = {}
for item in data:
    phase = item['phase']
    grade = item['grade']
    grade_code = get_grade_code(grade)
    export_name = make_export_name(phase, grade_code)
    
    if export_name not in groups:
        groups[export_name] = {
            'phase': phase,
            'grade': grade,
            'department': get_department(phase),
            'phase_type': get_phase_type(phase),
            'subjects': []
        }
    
    groups[export_name]['subjects'].append(item)

print(f"✓ عدد المجموعات: {len(groups)}\n")

# توليد TypeScript
ts_code = '''import { Phase, Subject } from './types';

'''

subject_id = 1
exports_list = []

for export_name in sorted(groups.keys()):
    group = groups[export_name]
    
    ts_code += f"// {group['phase']} | {group['grade']}\n"
    ts_code += f"export const {export_name}: Subject[] = [\n"
    
    for subj in group['subjects']:
        ts_code += f'''  {{
    id: "s_{subject_id:04d}",
    name: "{subj['subject'].replace('"', '\\"')}",
    specializationIds: [],
    periodsPerClass: {subj['periods']},
    phases: [Phase.{group['phase_type']}],
    department: "{group['department']}",
  }},
'''
        subject_id += 1
    
    ts_code += "];\n\n"
    exports_list.append(export_name)

# إضافة export الرئيسي
ts_code += "export const EXCEL_1447_TEMPLATES = {\n"
for name in sorted(exports_list):
    ts_code += f"  '{name}': {name},\n"
ts_code += "};\n"

# كتابة الملف
with open("excel_templates.ts", 'w', encoding='utf-8') as f:
    f.write(ts_code)

print(f"✓ تم إنشاء excel_templates.ts")
print(f"✓ عدد الـ exports: {len(exports_list)}")
print(f"✓ عدد المواد الكلي: {subject_id - 1}")
print(f"\nأول 10 exports:")
for i, name in enumerate(sorted(exports_list)[:10]):
    count = len(groups[name]['subjects'])
    print(f"  {i+1}. {name} ({count} مادة)")

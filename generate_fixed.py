#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import openpyxl
import re

# فتح ملف Excel
excel_file = "خطة المقررات الدراسية 1447هـ.xlsx"
workbook = openpyxl.load_workbook(excel_file)
worksheet = workbook.active

# قراءة البيانات
data = []
for row_num, row in enumerate(worksheet.iter_rows(min_row=2, values_only=True), start=2):
    if row[0] is not None and row[0] != "الصف الدراسي":  # تخطي الصفوف الفارغة والرؤوس
        phase = str(row[0]).strip() if row[0] else None
        division = str(row[1]).strip() if row[1] else None
        grade = str(row[2]).strip() if row[2] else None
        subject = str(row[3]).strip() if row[3] else None
        periods = int(row[4]) if row[4] and str(row[4]).isdigit() else 0
        
        if phase and division and subject:
            data.append({
                'phase': phase,
                'division': division,
                'grade': grade,
                'subject': subject,
                'periods': periods
            })

print(f"✓ تم قراءة {len(data)} مادة من Excel\n")

# تحديد ما إذا كانت الابتدائية أو المتوسطة أو الثانوية
def get_phase_type(phase_name):
    if 'ابتدائي' in phase_name:
        return 'ELEMENTARY'
    elif 'متوسط' in phase_name:
        return 'MIDDLE'
    elif 'ثانوي' in phase_name:
        return 'HIGH'
    return 'ELEMENTARY'

# دالة تحويل أسماء الصفوف إلى أرقام وكود
def get_grade_code(grade_name, phase_name):
    grade_name_lower = grade_name.lower()
    
    if 'أول' in grade_name or '1' in grade_name:
        return 'grade_1'
    elif 'ثاني' in grade_name or '2' in grade_name:
        return 'grade_2'
    elif 'ثالث' in grade_name or '3' in grade_name:
        return 'grade_3'
    elif 'رابع' in grade_name or '4' in grade_name:
        return 'grade_4'
    elif 'خامس' in grade_name or '5' in grade_name:
        return 'grade_5'
    elif 'سادس' in grade_name or '6' in grade_name:
        return 'grade_6'
    elif 'عليا' in grade_name or '4-6' in grade_name:
        return 'grade_upper'
    elif 'مشترك' in phase_name or 'المشتركة' in phase_name:
        return 'shared'
    
    return 'unknown'

# دالة تحويل اسم الشعبة إلى كود
def get_division_code(division_name):
    if 'عام' in division_name and 'تحفيظ' not in division_name:
        return 'general'
    elif 'تحفيظ' in division_name:
        return 'quran'
    elif 'حاسب' in division_name or 'هندسة' in division_name:
        return 'cs_eng'
    elif 'صحة' in division_name or 'حياة' in division_name:
        return 'health'
    elif 'إدارة' in division_name or 'أعمال' in division_name:
        return 'business'
    elif 'شرعي' in division_name:
        return 'islamic'
    
    return 'general'

# تجميع المواد
export_code = '''import { Phase, Subject } from './types';

'''

subject_id = 1
exports_dict = {}

# تجميع حسب المرحلة والشعبة والصف
groups = {}
for item in data:
    phase = item['phase']
    division = item['division']
    grade = item['grade']
    
    key = (phase, division, grade)
    if key not in groups:
        groups[key] = []
    
    groups[key].append(item)

# توليد الـ exports
for (phase, division, grade), subjects in sorted(groups.items()):
    # إنشاء اسم الـ export
    phase_type = get_phase_type(phase)
    div_code = get_division_code(division)
    grade_code = get_grade_code(grade, phase)
    
    # الإنجليزية فقط للأسماء
    export_name = f"excel_{phase_type.lower()}_{div_code}_{grade_code}".replace('-', '_')
    
    # تنظيف الاسم
    export_name = re.sub(r'[^a-z0-9_]', '', export_name.lower())
    
    # تجنب التكرارات
    original_name = export_name
    counter = 1
    while export_name in exports_dict:
        export_name = f"{original_name}_{counter}"
        counter += 1
    
    exports_dict[export_name] = {
        'phase': phase,
        'division': division,
        'grade': grade,
        'subjects': subjects
    }
    
    # توليد الـ TypeScript code
    export_code += f"// {phase} | {division} | {grade}\n"
    export_code += f"export const {export_name}: Subject[] = [\n"
    
    for subj in subjects:
        export_code += f'''  {{
    id: "s_{subject_id:04d}",
    name: "{subj['subject'].replace('"', '\\"')}",
    specializationIds: [],
    periodsPerClass: {subj['periods']},
    phases: [Phase.{phase_type}],
    department: "{div_code}",
  }},
'''
        subject_id += 1
    
    export_code += "];\n\n"

# إضافة الـ EXCEL_1447_TEMPLATES export
export_code += "\n// Template exports for UI compatibility\n"
export_code += "export const EXCEL_1447_TEMPLATES = {\n"

for export_name in sorted(exports_dict.keys()):
    export_code += f"  '{export_name}': {export_name},\n"

export_code += "};\n"

# كتابة الملف
output_file = "excel_templates_new.ts"
with open(output_file, 'w', encoding='utf-8') as f:
    f.write(export_code)

print(f"✓ تم إنشاء {output_file}")
print(f"✓ عدد الـ exports: {len(exports_dict)}")
print(f"✓ عدد المواد الكلي: {subject_id - 1}")
print(f"\nأول 5 exports:")
for i, name in enumerate(sorted(exports_dict.keys())[:5]):
    info = exports_dict[name]
    print(f"  {i+1}. {name} ({len(info['subjects'])} مادة)")

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import openpyxl

wb = openpyxl.load_workbook('خطة المقررات الدراسية 1447هـ.xlsx')
ws = wb.active

# عد المواد مع شروط التنظيف
actual_data = 0
failed_conditions = []

for row in ws.iter_rows(min_row=2, values_only=True):
    if row[0] is not None and row[0] != 'المرحلة':
        if row[0] == 'الصف الدراسي':
            continue
        
        phase = str(row[0]).strip() if row[0] else None
        grade = ' '.join(str(row[1]).split()) if row[1] else None
        subject = str(row[2]).strip() if row[2] else None
        periods = int(row[3]) if row[3] and isinstance(row[3], int) else 0
        
        if phase and grade and subject:
            actual_data += 1
        else:
            failed_conditions.append({
                'phase': phase,
                'grade': grade,
                'subject': subject,
                'original': row
            })

print(f'المواد الفعلية: {actual_data}')
print(f'الأسطر الفاشلة في الشروط: {len(failed_conditions)}')
for item in failed_conditions:
    print(f'  Phase={item["phase"]}, Grade={item["grade"]}, Subject={item["subject"]}')
    print(f'    Original: {item["original"][0][:30]} | {item["original"][1][:30] if item["original"][1] else "None"} | {item["original"][2]} | {item["original"][3]}')

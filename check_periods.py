#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import openpyxl

wb = openpyxl.load_workbook('خطة المقررات الدراسية 1447هـ.xlsx')
ws = wb.active

# البحث عن صفوف بدون رقم صحيح للحصص
problem_rows = []

for row_num, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
    if row[0] is not None and row[0] != 'المرحلة' and row[0] != 'الصف الدراسي':
        phase = str(row[0]).strip() if row[0] else None
        grade = ' '.join(str(row[1]).split()) if row[1] else None
        subject = str(row[2]).strip() if row[2] else None
        periods = row[3]
        
        # البحث عن صفوف حيث الحصص ليست integer
        if phase and grade and subject:
            if not isinstance(periods, int) or periods == 0:
                problem_rows.append({
                    'row_num': row_num,
                    'phase': phase,
                    'grade': grade,
                    'subject': subject,
                    'periods': periods,
                    'type': type(periods).__name__
                })

print(f'عدد الصفوف بمشاكل الحصص: {len(problem_rows)}')
for item in problem_rows[:10]:
    print(f'Row {item["row_num"]}: {item["subject"][:30]} = {item["periods"]} ({item["type"]})')

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import openpyxl
import json
import re

# فتح ملف Excel
excel_file = "خطة المقررات الدراسية 1447هـ.xlsx"
workbook = openpyxl.load_workbook(excel_file)
worksheet = workbook.active

# قراءة البيانات
data = []
for row in worksheet.iter_rows(min_row=2, values_only=True):
    if row[0] is not None:  # تخطي الصفوف الفارغة
        phase = row[0]
        division = row[1]
        grade = row[2]
        subject_name = row[3]
        periods = row[4] if row[4] else 0
        
        data.append({
            'phase': phase,
            'division': division,
            'grade': grade,
            'subject': subject_name,
            'periods': periods
        })

print(f"عدد الصفوف: {len(data)}")

# تجميع البيانات حسب المرحلة والشعبة
groups = {}
for item in data:
    phase = item['phase']
    division = item['division']
    grade = item['grade']
    
    key = f"{phase}|{division}|{grade}"
    if key not in groups:
        groups[key] = []
    
    groups[key].append(item)

print(f"عدد المجموعات: {len(groups)}")

# طباعة البيانات
total_subjects = 0
for i, (key, subjects) in enumerate(groups.items(), 1):
    parts = key.split('|')
    phase = parts[0]
    division = parts[1]
    grade = parts[2]
    print(f"\n{i}. {phase} | {division} | {grade}")
    print(f"   عدد المواد: {len(subjects)}")
    total_subjects += len(subjects)
    for subj in subjects[:2]:  # اعرض أول مادتين فقط
        print(f"   - {subj['subject']} ({subj['periods']} حصة)")

print(f"\nالمجموع الكلي للمواد: {total_subjects}")

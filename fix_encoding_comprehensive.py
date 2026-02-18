#!/usr/bin/env python3
"""
Comprehensive fix for ALL character encoding issues in Step3Subjects.tsx
Uses HTML entity decoding to handle all XML-encoded Arabic characters
"""
import html

# Read the file
file_path = r'c:\Users\fasoo\OneDrive\Desktop\مشاريع رقمية\متابع-تحديث\motabe-1.5\components\wizard\steps\Step3Subjects.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Decode all HTML entities
fixed_content = html.unescape(content)

# Write the fixed content back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(fixed_content)

print("✅ All character encoding fixed using HTML entity decoding!")
print(f"File size: {len(fixed_content)} bytes")

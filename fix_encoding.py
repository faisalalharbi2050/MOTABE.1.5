#!/usr/bin/env python3
"""
Fix character encoding issues in Step3Subjects.tsx
Replaces XML-encoded Arabic characters with proper UTF-8 encoding
"""

import re

# Read the file
file_path = r'c:\Users\fasoo\OneDrive\Desktop\مشاريع رقمية\متابع-تحديث\motabe-1.5\components\wizard\steps\Step3Subjects.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Define replacements for common XML-encoded patterns
replacements = {
    # Department terms
    'ط¹ط§ظ…': 'عام',
    'طھط­ظپظٹط¸': 'تحفيظ',
    'ط¢ط®ط±': 'آخر',
    
    # Phase terms
    'ط§ظ„ط§ط¨طھط¯ط§ط¦ظٹط©': 'الابتدائية',
    'ط§ظ„ط§ط¨طھط¯ط§ط¦ظٹ': 'الابتدائي',
    'ط§ظ„ظ…طھظˆط³ط·ط©': 'المتوسطة',
    'ط§ظ„ظ…طھظˆط³ط·': 'المتوسط',
    'ط§ظ„ط«ط§ظ†ظˆظٹط©': 'الثانوية',
    'ط§ظ„ط«ط§ظ†ظˆظٹ': 'الثانوي',
    
    # Grade terms
    'ط§ظ„طµظپ': 'الصف',
    'ط§ظ„ط£ظˆظ„': 'الأول',
    'ط§ظ„ط«ط§ظ†ظٹ': 'الثاني',
    'ط§ظ„ط«ط§ظ„ط«': 'الثالث',
    'ط§ظ„ط±ط§ط¨ط¹': 'الرابع',
    'ط§ظ„ط®ط§ظ…ط³': 'الخامس',
    'ط§ظ„ط³ط§ط¯ط³': 'السادس',
    
    # Common phrases
    'ط§ظ„طھط¹ظ„ظٹظ… ط§ظ„': 'التعليم ال',
    'طھط­ظپظٹط¸ ط§ظ„ظ‚ط±ط¢ظ† ط§ظ„ظƒط±ظٹظ…': 'تحفيظ القرآن الكريم',
    'ط®ط·ط©': 'خطة',
    'ظ†ط¸ط§ظ… ط§ظ„ظ…ط³ط§ط±ط§طھ': 'نظام المسارات',
    'ط§ط³طھط¹ط±ط¶ ظˆط§ط¹طھظ…ط¯ ط§ظ„ظ…ظˆط§ط¯ ظ„ظ„ظ…ط³ط§ط±ط§طھ ط§ظ„طھط®طµطµظٹط©': 'استعرض واعتمد المواد للمسارات التخصصية',
    'ط·ط¨ط§ط¹ط© ط§ظ„': 'طباعة ال',
    'ط·ط¨ط§ط¹ط© ظ‡ط°ظ‡ ط§ظ„': 'طباعة هذه ال',
    'ظ…ط¹طھظ…ط¯ط©': 'معتمدة',
    'ظ„ظ… ظٹطھظ… ط§ظ„ط§ط¹طھظ…ط§ط¯': 'لم يتم الاعتماد',
    'ظ…ط§ط¯ط©': 'مادة',
    'ظ…ط¹ط§ظٹظ†ط©': 'معاينة',
    'ط·ط¨ط§ط¹ط©': 'طباعة',
    'ط¥ظ„ط؛ط§ط، ط§ظ„ط§ط¹طھظ…ط§ط¯': 'إلغاء الاعتماد',
    'ط§ط¹طھظ…ط§ط¯ ظ„ظ„ظƒظ„': 'اعتماد للكل',
}

# Apply all replacements
for old, new in replacements.items():
    content = content.replace(old, new)

# Write the fixed content back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Character encoding fixed successfully!")
print(f"Applied {len(replacements)} replacements")

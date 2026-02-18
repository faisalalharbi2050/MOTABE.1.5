import pandas as pd

file_path = 'خطة المقررات الدراسية 1447هـ.xlsx'

try:
    xl = pd.ExcelFile(file_path)
    df = xl.parse('ورقة1', header=None)
    
    # Search for keywords
    keywords = ['الابتدائية', 'المتوسطة', 'الثانوية', 'تحفيظ', 'عام']
    
    print("Found keywords at rows:")
    for key in keywords:
        # Find rows containing the keyword
        matches = df[df.apply(lambda row: row.astype(str).str.contains(key).any(), axis=1)].index
        for idx in matches:
            print(f"'{key}' at row {idx}")
            print(df.iloc[idx:idx+25].to_string()) # Print 25 rows starting from match
            print("-" * 50)

except Exception as e:
    print(f"Error: {e}")

import pandas as pd

file_path = 'خطة المقررات الدراسية 1447هـ.xlsx'

try:
    xl = pd.ExcelFile(file_path)
    print(f"Sheet names: {xl.sheet_names}")

    for sheet in xl.sheet_names:
        print(f"\n--- Sheet: {sheet} ---")
        df = xl.parse(sheet, nrows=20, header=None) # Read first 20 rows, no header to see layout
        print(df.to_string())
except Exception as e:
    print(f"Error reading excel: {e}")

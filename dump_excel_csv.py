import pandas as pd

try:
    df = pd.read_excel('خطة المقررات الدراسية 1447هـ.xlsx', sheet_name='ورقة1', header=None)
    # Slice rows 15 to 60
    subset = df.iloc[15:60]
    # Save to CSV
    subset.to_csv('excel_dump.csv', index=True, header=False)
    print("Dumped to excel_dump.csv")
except Exception as e:
    print(f"Error: {e}")

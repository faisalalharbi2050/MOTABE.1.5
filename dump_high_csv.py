import pandas as pd

try:
    df = pd.read_excel('خطة المقررات الدراسية 1447هـ.xlsx', sheet_name='ورقة1', header=None)
    # Estimate High School rows - let's dump a chunk
    subset = df.iloc[70:250]
    subset.to_csv('excel_dump_high.csv', index=True, header=False)
    print("Dumped high school chunk to excel_dump_high.csv")
except Exception as e:
    print(f"Error: {e}")

import pandas as pd
import json
import re

# Load the Excel file
file_path = 'خطة المقررات الدراسية 1447هـ.xlsx'
try:
    df = pd.read_excel(file_path, sheet_name='ورقة1', header=None)
except Exception as e:
    print(f"Error reading Excel file: {e}")
    exit(1)

# Helper function to map phase names to code constants
def get_phase_code(phase_str):
    if 'الابتدائية' in phase_str:
        return 'Phase.ELEMENTARY'
    elif 'المتوسطة' in phase_str:
        return 'Phase.MIDDLE'
    elif 'الثانوية' in phase_str:
        return 'Phase.HIGH'
    return 'Phase.ELEMENTARY' # Default

# Helper function to map department names
def get_department(phase_str):
    if 'تحفيظ' in phase_str:
        return 'تحفيظ'
    elif 'المسار' in phase_str or 'مشترك' in phase_str: # High school pathways might be in phase string or separate
        # For High School, we might need more logic, but for now:
        if 'مشترك' in phase_str: return 'مشترك'
        # etc.
    return 'عام'

# Helper to normalize grade names to numbers
def get_grade_numbers(grade_str):
    mapping = {
        'الأول': 1, 'الثاني': 2, 'الثالث': 3, 'الرابع': 4, 'الخامس': 5, 'السادس': 6
    }
    nums = []
    
    # Handle ranges or combined strings like "الصف الأول / الثاني" or "الصفوف العليا (4-6)"
    if 'الصفوف العليا' in grade_str:
        return [4, 5, 6]
    if 'الصفوف الأولية' in grade_str:
        return [1, 2, 3]
        
    for word, num in mapping.items():
        if word in grade_str:
            nums.append(num)
            
    return sorted(list(set(nums)))

# Store extracted data
# Structure: { 'phase_dept_grade': [ {name, periods, ...} ] }
templates = {}

# Iterate through rows
current_phase = ""
current_grade_str = ""

# Start processing from row 15 (index 14) onwards based on inspection
# Start processing from row 5 to capture early grades
start_row = 5 
end_row = 200 # Arbitrary limit or detect end

count = 0

# Initialize debug log
with open('extraction_debug.log', 'w', encoding='utf-8') as f:
    f.write("DEBUG LOG STARTED\n")

print(f"Total rows in DF: {len(df)}")

for index, row in df.iloc[start_row:].iterrows():
    # Columns based on CSV dump:
    # 0: Phase (merged often), 1: Grade (merged often), 2: Subject, 3: Periods
    
    val0 = str(row[0]).strip() if pd.notna(row[0]) else ""
    val1 = str(row[1]).strip() if pd.notna(row[1]) else ""
    val2 = str(row[2]).strip() if pd.notna(row[2]) else ""
    val3 = row[3] # Periods

    # Debug first 20 rows of iteration to see what's happening
    if index < start_row + 40:
        with open('debug.txt', 'a', encoding='utf-8') as fs:
            fs.write(f"RAW ROW {index}: {val0} | {val1} | {val2} | {val3}\n")
        
    if val0:
        current_phase = val0
        with open('debug.txt', 'a', encoding='utf-8') as fs:
            fs.write(f"DEBUG: New Phase Detected at row {index}: {current_phase}\n")

    if val1: current_grade_str = val1
    
    # Calculate phase code and department early for debugging/logic
    phase_code = get_phase_code(current_phase)
    dept = get_department(current_phase)

    if 'ELEMENTARY' in phase_code:
        with open('debug.txt', 'a', encoding='utf-8') as fs:
            fs.write(f"DEBUG ELEM processing: grade_str='{current_grade_str}' phase='{current_phase}'\n")

    if not val2 or val2 == 'nan' or val2 == 'المادة الدراسية': 
        continue # Skip empty subject rows or header rows repeats

    subject_name = val2
    try:
        periods = int(val3)
    except:
        periods = 0 # Handle non-numeric
        
    if periods == 0: continue

    # Construct Key
    # Logic to build key: excel_1447_[phase]_[dept]_[grade]
    
    phase_code = get_phase_code(current_phase)
    dept = get_department(current_phase) # Primary logic
    
    # Special High School Logic
    if 'الثانوية' in current_phase:
        # High school structure in Excel might be different. 
        # For now let's focus on Elementary/Middle which seemed clear in CSV dump.
        pass

    grades = get_grade_numbers(current_grade_str)
    
    # If no grades found in the grade column, try finding them in the phase column
    # This happens often in Excel where cells are merged or "First Grade" is in the main header
    if not grades:
        grades = get_grade_numbers(current_phase)
        
    if not grades:
        # Try to parse numeric from parens e.g. (4-6) or other patterns
        pass

    grade_names = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس']
    
    # Determine department code for key
    dept_key = 'gen'
    if dept == 'تحفيظ': dept_key = 'quran'
    
    # Determine phase key for ID
    phase_key_short = 'elem'
    if 'MIDDLE' in phase_code: phase_key_short = 'mid'
    elif 'HIGH' in phase_code: phase_key_short = 'high'
    
    # High School Specific Logic
    if phase_key_short == 'high':
        with open('extraction_debug.log', 'a', encoding='utf-8') as log:
            log.write(f"DEBUG: Processing HS Row: {current_phase} | {current_grade_str}\n")

        # Parse Grade from current_phase (Col 0)
        # Parse Grade from current_phase (Col 0)
        # e.g. "السنة الأولى الثانوية المشتركة" -> 1
        # "السنة الثانية الثانوية مسار عام" -> 2
        # "السنة الثالثة..." -> 3
        hs_grade = 1
        if 'الثانية' in current_phase: hs_grade = 2
        elif 'الثالثة' in current_phase: hs_grade = 3
        
        # Parse Pathway
        # e.g. "المشتركة" -> "مشترك"
        # "مسار عام" -> "عام"
        # "مسار حاسب وهندسة" -> "حاسب_وهندسة"
        # "صحة وحياة" -> "صحة_وحياة"
        # "إدارة أعمال" -> "إدارة_أعمال"
        # "مسار شرعي" -> "شرعي"
        
        raw_pathway = current_phase
        pathway_key = 'عام' # Default
        
        if 'المشتركة' in raw_pathway: pathway_key = 'مشترك'
        elif 'مسار عام' in raw_pathway: pathway_key = 'عام'
        elif 'حاسب وهندسة' in raw_pathway: pathway_key = 'حاسب_وهندسة'
        elif 'صحة وحياة' in raw_pathway: pathway_key = 'صحة_وحياة'
        elif 'إدارة أعمال' in raw_pathway: pathway_key = 'إدارة_أعمال'
        elif 'شرعي' in raw_pathway: pathway_key = 'شرعي'
        
        # Parse Semester from Col 1 (current_grade_str in my loop variable name, but for HS it's sem)
        # e.g. "الأول" -> 1
        hs_sem = 1
        sem_str = current_grade_str
        if 'الثاني' in sem_str: hs_sem = 2
        elif 'الثالث' in sem_str: hs_sem = 3
        
        # Build Key
        # Format: excel_1447_high_grade_{grade}_pathway_{pathway}_sem_{sem}
        key = f"excel_1447_high_grade_{hs_grade}_pathway_{pathway_key}_sem_{hs_sem}"
        
        if key not in templates:
            templates[key] = []
            
        subj_id = f"{key}_{len(templates[key]) + 1}"
        
        # ... specializations ...
        spec_ids = []
        if 'قرآن' in subject_name: spec_ids = ["1"]
        elif 'إسلامية' in subject_name or 'توحيد' in subject_name or 'حديث' in subject_name or 'تفسير' in subject_name or 'فقه' in subject_name: spec_ids = ["1"]
        elif 'عربية' in subject_name or 'لغوية' in subject_name: spec_ids = ["2"]
        elif 'رياضيات' in subject_name: spec_ids = ["3"]
        elif 'علوم' in subject_name or 'فيزياء' in subject_name or 'كيمياء' in subject_name or 'أحياء' in subject_name or 'بيئة' in subject_name or 'أرض' in subject_name: 
             if 'فيزياء' in subject_name: spec_ids = ["12"]
             elif 'كيمياء' in subject_name: spec_ids = ["10"]
             elif 'أحياء' in subject_name: spec_ids = ["11"]
             elif 'أرض' in subject_name: spec_ids = ["20"]
             elif 'بيئة' in subject_name: spec_ids = ["4"]
             else: spec_ids = ["4"]
        elif 'إنجليزية' in subject_name: spec_ids = ["5"]
        elif 'اجتماعية' in subject_name or 'تاريخ' in subject_name or 'جغرافيا' in subject_name: spec_ids = ["6"]
        elif 'رقمية' in subject_name or 'حاسب' in subject_name or 'بيانات' in subject_name or 'إنترنت' in subject_name: spec_ids = ["7"] # 23?
        elif 'فنية' in subject_name or 'فنون' in subject_name: spec_ids = ["8"]
        elif 'بدنية' in subject_name or 'لياقة' in subject_name: spec_ids = ["9"]
        elif 'أسرية' in subject_name or 'مهارات' in subject_name: spec_ids = ["17"]
        elif 'مالية' in subject_name or 'أعمال' in subject_name or 'اقتصاد' in subject_name or 'إدارة' in subject_name: spec_ids = ["13"]
        elif 'بحرية' in subject_name: spec_ids = ["99"]
        elif 'هندسة' in subject_name: spec_ids = ["22"]
        elif 'تفكير ناقد' in subject_name: spec_ids = ["18"] # 18 is Critical Thinking
        elif 'حياتية' in subject_name: spec_ids = ["17"]

        obj = {
            "id": subj_id,
            "name": subject_name,
            "specializationIds": spec_ids,
            "periodsPerClass": periods,
            "phases": [phase_code], # Literal
            "department": pathway_key,
        }
        templates[key].append(obj)
        # count += 1 # Global count
        continue
    
    # Elem/Mid Logic
    for g in grades:
        g_name = grade_names[g-1]
        
        # Build the final key expected by React component
        # e.g. excel_1447_elem_gen_الصف_الأول
        
        key_phase_part = phase_key_short # elem or mid
        
        # Adjust for key format matching Step3Subjects.tsx expectations
        # It expects: `excel_1447_${phase}_${dept}_الصف_${gradeName}`
        # where phase is 'elem' or 'mid' (or 'high' but high has different logic)
        
        key = f"excel_1447_{phase_key_short}_{dept_key}_الصف_{g_name}"
        
        if key not in templates:
            templates[key] = []
            
        # Add subject
        # Create ID: simple deterministic ID
        subj_id = f"{key}_{len(templates[key]) + 1}"
        
        # Specialization mapping (simplified for now)
        spec_ids = []
        if 'قرآن' in subject_name: spec_ids = ["1"]
        elif 'إسلامية' in subject_name: spec_ids = ["1"]
        elif 'عربية' in subject_name: spec_ids = ["2"] # 2 = Arabic
        elif 'رياضيات' in subject_name: spec_ids = ["3"]
        elif 'علوم' in subject_name: spec_ids = ["4"]
        elif 'إنجليزية' in subject_name: spec_ids = ["5"]
        elif 'اجتماعية' in subject_name: spec_ids = ["6"]
        elif 'رقمية' in subject_name or 'حاسب' in subject_name: spec_ids = ["7"]
        elif 'فنية' in subject_name: spec_ids = ["8"]
        elif 'بدنية' in subject_name: spec_ids = ["9"]
        elif 'أسرية' in subject_name or 'مهارات' in subject_name: spec_ids = ["17"] # Life skills
        
        # Construct Subject Object String
        obj = {
            "id": subj_id,
            "name": subject_name,
            "specializationIds": spec_ids,
            "periodsPerClass": periods,
            "phases": [phase_code], # This will be a literal in the TS string
            "department": dept
        }
        templates[key].append(obj)
        count += 1

print(f"Extracted {count} subject entries across {len(templates)} keys.")

# Generate TypeScript File Content
ts_content = """import { Phase, Subject } from './types';

export const GENERATED_TEMPLATES: Record<string, Subject[]> = {
"""

for key, subjects in templates.items():
    ts_content += f"  '{key}': [\n"
    for s in subjects:
        # Format phases correctly as literal
        phases_str = str(s['phases']).replace("'Phase.ELEMENTARY'", "Phase.ELEMENTARY").replace("'Phase.MIDDLE'", "Phase.MIDDLE").replace("'Phase.HIGH'", "Phase.HIGH")
        
        ts_content += "    {\n"
        ts_content += f"      id: '{s['id']}',\n"
        ts_content += f"      name: '{s['name']}',\n"
        ts_content += f"      specializationIds: {json.dumps(s['specializationIds'])},\n"
        ts_content += f"      periodsPerClass: {s['periodsPerClass']},\n"
        ts_content += f"      phases: {phases_str},\n"
        ts_content += f"      department: '{s['department']}',\n"
        ts_content += "    },\n"
    ts_content += "  ],\n"

ts_content += "};\n"

with open('generated_templates_final.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)

print("Generated generated_templates_final.ts")

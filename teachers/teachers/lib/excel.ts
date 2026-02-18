import * as XLSX from 'xlsx';

export interface TeacherData {
  id: string;
  name: string;
  specialization: string;
  mobile: string;
  weeklyQuota: number; // نصاب الحصص
  waitingQuota: number; // نصاب الانتظار
  isAdmin?: boolean; // هل هو إداري؟
  adminRole?: string; // المسمى الوظيفي للإداري
  sortIndex?: number; // ترتيب مخصص
}

export const parseTeachersExcel = (file: File): Promise<TeacherData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet) as any[];

        // Map data - expecting columns: Name, Specialization, Mobile (or Arabic equivalents)
        const teachers: TeacherData[] = json.map((row, index) => {
           // Basic fuzzy matching for column names
           const name = row['الاسم'] || row['Name'] || row['اسم المعلم'] || '';
           const specialization = row['التخصص'] || row['Specialization'] || '';
           const mobile = row['الجوال'] || row['Mobile'] || row['رقم الجوال'] || '';

           if (!name) return null; // Skip invalid rows using null placeholder

           return {
             id: `t-${index}-${Date.now()}`,
             name,
             specialization,
             mobile: String(mobile),
             weeklyQuota: 24, // Default
             waitingQuota: 0, // Default
           };
        }).filter(t => t !== null) as TeacherData[];

        resolve(teachers);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
};

import { Phase, Specialization, Subject } from "./types";
import { STUDY_PLANS } from './study_plans';

export const INITIAL_SPECIALIZATIONS: Specialization[] = [
  { id: "1", name: "الدراسات الإسلامية" },
  { id: "2", name: "اللغة العربية" },
  { id: "3", name: "الرياضيات" },
  { id: "4", name: "العلوم" },
  { id: "5", name: "اللغة الإنجليزية" },
  { id: "6", name: "الاجتماعيات" },
  { id: "7", name: "الحاسب الآلي" },
  { id: "8", name: "التربية الفنية" },
  { id: "9", name: "التربية البدنية" },
  { id: "10", name: "كيمياء" },
  { id: "11", name: "أحياء" },
  { id: "12", name: "فيزياء" },
  { id: "13", name: "الإدارة المالية" },
  { id: "14", name: "تربية فكرية" },
  { id: "15", name: "صعوبات تعلم" },
  { id: "16", name: "توحد" },
  { id: "17", name: "المهارات الحياتية" },
  { id: "18", name: "التفكير الناقد" },
  { id: "19", name: "الدراسات النفسية" },
  { id: "20", name: "علم الأرض والفضاء" },
  { id: "21", name: "صناعة القرار" },
  { id: "22", name: "علوم وهندسة" },
  { id: "23", name: "تقنية رقمية" },
  { id: "24", name: "المكتبات" },
  { id: "99", name: "أخرى" }
];

export const DETAILED_TEMPLATES: Record<string, Subject[]> = {
  ...STUDY_PLANS,
};

// دالة مساعدة لجمع جميع المواد من DETAILED_TEMPLATES
function getAllSubjectsFromTemplates(): Subject[] {
  const allSubjects: Subject[] = [];
  const seen = new Set<string>();
  
  // جمع جميع المواد من DETAILED_TEMPLATES
  for (const template of Object.values(DETAILED_TEMPLATES)) {
    if (Array.isArray(template)) {
      for (const subject of template) {
        if (!seen.has(subject.id)) {
          allSubjects.push(subject);
          seen.add(subject.id);
        }
      }
    }
  }
  
  return allSubjects;
}

export const INITIAL_SUBJECTS: Subject[] = getAllSubjectsFromTemplates();

export const PHASE_CONFIG = {
  [Phase.ELEMENTARY]: { grades: 6 },
  [Phase.MIDDLE]: { grades: 3 },
  [Phase.HIGH]: { grades: 3 },
  [Phase.KINDERGARTEN]: { grades: 3 },
  [Phase.OTHER]: { grades: 12 },
};

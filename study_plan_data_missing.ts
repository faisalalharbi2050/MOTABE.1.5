import { Phase, Subject } from './types';

// Templates for Middle School (General)
const MIDDLE_SCHOOL_TEMPLATES: Record<string, Subject[]> = {
  'excel_1447_mid_gen_الصف_الأول': [
    { id: 'mid_gen_1_quran', name: 'القرآن الكريم', specializationIds: ['1'], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_islamic', name: 'الدراسات الإسلامية', specializationIds: ['1'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_arabic', name: 'اللغة العربية', specializationIds: ['2'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_math', name: 'الرياضيات', specializationIds: ['3'], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_science', name: 'العلوم', specializationIds: ['4'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_english', name: 'اللغة الإنجليزية', specializationIds: ['5'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_social', name: 'الدراسات الاجتماعية', specializationIds: ['6'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_digital', name: 'المهارات الرقمية', specializationIds: ['7'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_art', name: 'التربية الفنية', specializationIds: ['8'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_pe', name: 'التربية البدنية', specializationIds: ['9'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_1_thinking', name: 'التفكير الناقد', specializationIds: ['10'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
  ],
  'excel_1447_mid_gen_الصف_الثاني': [
    { id: 'mid_gen_2_quran', name: 'القرآن الكريم', specializationIds: ['1'], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_islamic', name: 'الدراسات الإسلامية', specializationIds: ['1'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_arabic', name: 'اللغة العربية', specializationIds: ['2'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_math', name: 'الرياضيات', specializationIds: ['3'], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_science', name: 'العلوم', specializationIds: ['4'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_english', name: 'اللغة الإنجليزية', specializationIds: ['5'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_social', name: 'الدراسات الاجتماعية', specializationIds: ['6'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_digital', name: 'المهارات الرقمية', specializationIds: ['7'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_art', name: 'التربية الفنية', specializationIds: ['8'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_2_pe', name: 'التربية البدنية', specializationIds: ['9'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
  ],
  'excel_1447_mid_gen_الصف_الثالث': [
    { id: 'mid_gen_3_quran', name: 'القرآن الكريم', specializationIds: ['1'], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_islamic', name: 'الدراسات الإسلامية', specializationIds: ['1'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_arabic', name: 'اللغة العربية', specializationIds: ['2'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_math', name: 'الرياضيات', specializationIds: ['3'], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_science', name: 'العلوم', specializationIds: ['4'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_english', name: 'اللغة الإنجليزية', specializationIds: ['5'], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_social', name: 'الدراسات الاجتماعية', specializationIds: ['6'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_digital', name: 'المهارات الرقمية', specializationIds: ['7'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_art', name: 'التربية الفنية', specializationIds: ['8'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_pe', name: 'التربية البدنية', specializationIds: ['9'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
    { id: 'mid_gen_3_thinking', name: 'التفكير الناقد', specializationIds: ['10'], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'عام' },
  ]
};

// Templates for High School (Pathways - Simplified for example)
const HIGH_SCHOOL_TEMPLATES: Record<string, Subject[]> = {
  // First Year Common
  'excel_1447_high_grade_1_pathway_مشترك_sem_1': [
    { id: 'high_1_quran', name: 'القرآن الكريم 1', specializationIds: ['1'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_islamic', name: 'التوحيد 1', specializationIds: ['1'], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_arabic', name: 'الكفايات اللغوية 1-1', specializationIds: ['2'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_math', name: 'الرياضيات 1-1', specializationIds: ['3'], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_science', name: 'فيزياء 1', specializationIds: ['4'], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_english', name: 'اللغة الإنجليزية 1-1', specializationIds: ['5'], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_tech', name: 'التقنية الرقمية 1-1', specializationIds: ['7'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_social', name: 'دراسات اجتماعية', specializationIds: ['6'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مشترك' },
    { id: 'high_1_thinking', name: 'تفكير ناقد', specializationIds: ['10'], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مشترك' },
  ],
  // Second Year (General Pathway)
  'excel_1447_high_grade_2_pathway_عام_sem_1': [
     { id: 'high_2_quran', name: 'القرآن الكريم 2', specializationIds: ['1'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'عام' },
     { id: 'high_2_math', name: 'الرياضيات 2-1', specializationIds: ['3'], periodsPerClass: 5, phases: [Phase.HIGH], department: 'عام' },
     { id: 'high_2_science', name: 'فيزياء 2', specializationIds: ['4'], periodsPerClass: 4, phases: [Phase.HIGH], department: 'عام' },
     { id: 'high_2_english', name: 'اللغة الإنجليزية 2-1', specializationIds: ['5'], periodsPerClass: 4, phases: [Phase.HIGH], department: 'عام' },
     { id: 'high_2_tech', name: 'التقنية الرقمية 2-1', specializationIds: ['7'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'عام' },
     { id: 'high_2_history', name: 'تاريخ', specializationIds: ['6'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'عام' },
     { id: 'high_2_health', name: 'التربية الصحية والبدنية', specializationIds: ['9'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'عام' },
  ],
  // Third Year (General Pathway)
  'excel_1447_high_grade_3_pathway_عام_sem_1': [
    { id: 'high_3_quran', name: 'القرآن الكريم 3', specializationIds: ['1'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'عام' },
    { id: 'high_3_math', name: 'الرياضيات 3-1', specializationIds: ['3'], periodsPerClass: 5, phases: [Phase.HIGH], department: 'عام' },
    { id: 'high_3_science', name: 'فيزياء 3', specializationIds: ['4'], periodsPerClass: 4, phases: [Phase.HIGH], department: 'عام' },
    { id: 'high_3_english', name: 'اللغة الإنجليزية 3-1', specializationIds: ['5'], periodsPerClass: 4, phases: [Phase.HIGH], department: 'عام' },
    { id: 'high_3_tech', name: 'التقنية الرقمية 3-1', specializationIds: ['7'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'عام' },
    { id: 'high_3_geo', name: 'جغرافيا', specializationIds: ['6'], periodsPerClass: 3, phases: [Phase.HIGH], department: 'عام' },
    { id: 'high_3_research', name: 'مهارات البحث ومصادر المعلومات', specializationIds: ['10'], periodsPerClass: 2, phases: [Phase.HIGH], department: 'عام' },
  ]
};

export const MISSING_TEMPLATES = {
  ...MIDDLE_SCHOOL_TEMPLATES,
  ...HIGH_SCHOOL_TEMPLATES
};

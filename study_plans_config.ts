import { Phase } from './types';

export interface StudyPlanCategory {
  id: string;
  name: string;
  phase: Phase;
  departments: StudyPlanDepartment[];
}

export interface StudyPlanDepartment {
  id: string;
  name: string;
  subDepartments?: StudyPlanDepartment[];
  planKeys?: string[]; // Keys in DETAILED_TEMPLATES
  grades?: number[];
  description?: string;
}

export const STUDY_PLANS_CONFIG: StudyPlanCategory[] = [
  {
    id: 'kindergarten',
    name: 'رياض الأطفال',
    phase: Phase.KINDERGARTEN,
    departments: []
  },
  {
    id: 'elementary',
    name: 'الابتدائية',
    phase: Phase.ELEMENTARY,
    departments: [
      { id: 'gen', name: 'تعليم عام', grades: [1, 2, 3, 4, 5, 6], planKeys: [1, 2, 3, 4, 5, 6].map(g => `excel_1447_elem_gen_الصف_${['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'][g - 1]}`) },
      { id: 'quran', name: 'تحفيظ القرآن', grades: [1, 2, 3, 4, 5, 6], planKeys: [1, 2, 3, 4, 5, 6].map(g => `excel_1447_elem_quran_الصف_${['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'][g - 1]}`) },
      { id: 'continuing', name: 'تعليم مستمر', planKeys: [] },
      { id: 'special-simple', name: 'ذوي الإعاقة البسيطة', planKeys: [] },
      { id: 'private', name: 'الأهلية المغايرة للحكومي', planKeys: [] },
      { id: 'arts', name: 'المطبقة للفنون', planKeys: [] },
      { id: 'autism', name: 'طيف التوحد', planKeys: [] },
      { id: 'intellectual', name: 'الفكرية', planKeys: [] },
      { id: 'multiple', name: 'تعدد الإعاقات', planKeys: [] },
      { id: 'gifted', name: 'الموهوبين', planKeys: [] }
    ]
  },
  {
    id: 'middle',
    name: 'المتوسطة',
    phase: Phase.MIDDLE,
    departments: [
      { id: 'gen', name: 'تعليم عام', grades: [1, 2, 3], planKeys: [1, 2, 3].map(g => `excel_1447_mid_gen_الصف_${['الأول', 'الثاني', 'الثالث'][g - 1]}`) },
      { id: 'quran', name: 'تحفيظ القرآن', grades: [1, 2, 3], planKeys: [1, 2, 3].map(g => `excel_1447_mid_quran_الصف_${['الأول', 'الثاني', 'الثالث'][g - 1]}`) },
      { id: 'makkiya', name: 'دار الحديث المكية', planKeys: [] },
      { id: 'madaniya', name: 'دار الحديث المدنية', planKeys: [] },
      { id: 'private', name: 'الأهلية المغايرة للحكومي', planKeys: [] },
      { id: 'chinese', name: 'المطبقة للغة الصينية', planKeys: [] },
      { id: 'autism', name: 'طيف التوحد', planKeys: [] },
      { id: 'intellectual', name: 'الفكرية', planKeys: [] },
      { id: 'gifted', name: 'الموهوبين', planKeys: [] }
    ]
  },
  {
    id: 'high',
    name: 'الثانوية',
    phase: Phase.HIGH,
    departments: [
      { 
        id: 'pathways', 
        name: 'المسارات', 
        planKeys: [
          'excel_1447_high_grade_1_pathway_مشترك_sem_1', 'excel_1447_high_grade_2_pathway_عام_sem_1',
          'excel_1447_high_grade_2_pathway_حاسب_وهندسة_sem_1', 'excel_1447_high_grade_2_pathway_صحة_وحياة_sem_1',
          'excel_1447_high_grade_2_pathway_إدارة_أعمال_sem_1', 'excel_1447_high_grade_2_pathway_شرعي_sem_1',
          'excel_1447_high_grade_3_pathway_عام_sem_1', 'excel_1447_high_grade_3_pathway_حاسب_وهندسة_sem_1',
          'excel_1447_high_grade_3_pathway_صحة_وحياة_sem_1', 'excel_1447_high_grade_3_pathway_إدارة_أعمال_sem_1',
          'excel_1447_high_grade_3_pathway_شرعي_sem_1'
        ]
      },
      { id: 'scientific', name: 'المعاهد العلمية "ثالث ثانوي"', planKeys: [] },
      { id: 'makkiya', name: 'دار الحديث المكية', planKeys: [] },
      { id: 'madaniya', name: 'دار الحديث المدنية', planKeys: [] },
      { id: 'private', name: 'الأهلية المغايرة للحكومي', planKeys: [] },
      { id: 'autism-qual', name: 'طيف التوحد التأهيلية', planKeys: [] },
      { id: 'intellectual-qual', name: 'الفكرية التأهيلية', planKeys: [] },
      { id: 'multiple-qual', name: 'تعدد الإعاقات التأهيلية', planKeys: [] }
    ]
  },
  {
    id: 'other',
    name: 'أخرى',
    phase: Phase.OTHER,
    departments: []
  }
];

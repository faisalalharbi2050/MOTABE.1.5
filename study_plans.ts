import { Phase, Subject } from './types';

/**
 * الخطط الدراسية 1447هـ - مستوردة تلقائياً من ملف Excel
 *
 * المفتاح: معرّف الخطة (يتطابق مع planKeys في study_plans_config.ts)
 */
export const STUDY_PLANS: Record<string, Subject[]> = {

  // رياض أطفال | الحضانة | الصف: المستوى الأول
  'sp_رياض_أطفال_الحضانة_المستوى_الأول': [
    { id: 'sp_رياض_أطفال_الحضانة_المستوى_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'الحضانة' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_الحضانة_المستوى_الأول_2', name: 'الوطنية والدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'الحضانة' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_الحضانة_المستوى_الأول_3', name: 'التطور الاجتماعي والعاطفي', specializationIds: [], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'الحضانة' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_الحضانة_المستوى_الأول_4', name: 'اللغة والتواصل', specializationIds: [], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'الحضانة' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_الحضانة_المستوى_الأول_5', name: 'العمليات المعرفية والمعلومات العامة', specializationIds: ["4"], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'الحضانة' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_الحضانة_المستوى_الأول_6', name: 'الصحة والتطور البدني', specializationIds: [], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'الحضانة' }, // يحددها المستخدم
  ],

  // رياض أطفال | رياض أطفال | الصف: المستوى الثاني
  'sp_رياض_أطفال_رياض_أطفال_المستوى_الثاني': [
    { id: 'sp_رياض_أطفال_رياض_أطفال_المستوى_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'رياض أطفال' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_رياض_أطفال_المستوى_الثاني_2', name: 'الوطنية والدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'رياض أطفال' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_رياض_أطفال_المستوى_الثاني_3', name: 'التطور الاجتماعي والعاطفي', specializationIds: [], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'رياض أطفال' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_رياض_أطفال_المستوى_الثاني_4', name: 'اللغة والتواصل', specializationIds: [], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'رياض أطفال' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_رياض_أطفال_المستوى_الثاني_5', name: 'العمليات المعرفية والمعلومات العامة', specializationIds: ["4"], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'رياض أطفال' }, // يحددها المستخدم
    { id: 'sp_رياض_أطفال_رياض_أطفال_المستوى_الثاني_6', name: 'الصحة والتطور البدني', specializationIds: [], periodsPerClass: 0, phases: [Phase.KINDERGARTEN], department: 'رياض أطفال' }, // يحددها المستخدم
  ],

  // الابتدائية | تعليم عام | الصف: الأول
  'sp_الابتدائية_تعليم_عام_الأول': [
    { id: 'sp_الابتدائية_تعليم_عام_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 8, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_6', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_7', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_8', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الأول_9', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
  ],

  // الابتدائية | تعليم عام | الصف: الثاني
  'sp_الابتدائية_تعليم_عام_الثاني': [
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 7, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_6', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_7', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_8', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثاني_9', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
  ],

  // الابتدائية | تعليم عام | الصف: الثالث
  'sp_الابتدائية_تعليم_عام_الثالث': [
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_6', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_7', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_8', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الثالث_9', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
  ],

  // الابتدائية | تعليم عام | الصف: الرابع
  'sp_الابتدائية_تعليم_عام_الرابع': [
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الرابع_11', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
  ],

  // الابتدائية | تعليم عام | الصف: الخامس
  'sp_الابتدائية_تعليم_عام_الخامس': [
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_الخامس_11', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
  ],

  // الابتدائية | تعليم عام | الصف: السادس
  'sp_الابتدائية_تعليم_عام_السادس': [
    { id: 'sp_الابتدائية_تعليم_عام_السادس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
    { id: 'sp_الابتدائية_تعليم_عام_السادس_11', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم عام' },
  ],

  // الابتدائية | تحفيظ القرآن | الصف: الأول
  'sp_الابتدائية_تحفيظ_القرآن_الأول': [
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 9, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 8, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_6', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_7', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_8', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الأول_9', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
  ],

  // الابتدائية | تحفيظ القرآن | الصف: الثاني
  'sp_الابتدائية_تحفيظ_القرآن_الثاني': [
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 9, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 7, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_6', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_7', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_8', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثاني_9', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
  ],

  // الابتدائية | تحفيظ القرآن | الصف: الثالث
  'sp_الابتدائية_تحفيظ_القرآن_الثالث': [
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 9, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_6', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_7', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_8', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الثالث_9', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
  ],

  // الابتدائية | تحفيظ القرآن | الصف: الرابع
  'sp_الابتدائية_تحفيظ_القرآن_الرابع': [
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 8, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الرابع_11', name: 'التجويد', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
  ],

  // الابتدائية | تحفيظ القرآن | الصف: الخامس
  'sp_الابتدائية_تحفيظ_القرآن_الخامس': [
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 8, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_الخامس_11', name: 'التجويد', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
  ],

  // الابتدائية | تحفيظ القرآن | الصف: السادس
  'sp_الابتدائية_تحفيظ_القرآن_السادس': [
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 8, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
    { id: 'sp_الابتدائية_تحفيظ_القرآن_السادس_11', name: 'التجويد', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تحفيظ القرآن' },
  ],

  // المتوسطة | تعليم عام | الصف: الأول المتوسط
  'sp_المتوسطة_تعليم_عام_الأول_المتوسط': [
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الأول_المتوسط_11', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تعليم عام' },
  ],

  // المتوسطة | تعليم عام | الصف: الثاني المتوسط
  'sp_المتوسطة_تعليم_عام_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثاني_المتوسط_11', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تعليم عام' },
  ],

  // المتوسطة | تعليم عام | الصف: الثالث المتوسط
  'sp_المتوسطة_تعليم_عام_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_7', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_11', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تعليم عام' },
    { id: 'sp_المتوسطة_تعليم_عام_الثالث_المتوسط_12', name: 'التفكير الناقد', specializationIds: ["18"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تعليم عام' },
  ],

  // المتوسطة | تحفيظ القرآن | الصف: الأول المتوسط
  'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط': [
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 8, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_2', name: 'التجويد', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_3', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_5', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_6', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_7', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_8', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_9', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_10', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الأول_المتوسط_11', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
  ],

  // المتوسطة | تحفيظ القرآن | الصف: الثاني المتوسط
  'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 8, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_2', name: 'التجويد', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_3', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_5', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_6', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_7', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_8', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_9', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_10', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثاني_المتوسط_11', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
  ],

  // المتوسطة | تحفيظ القرآن | الصف: الثالث المتوسط
  'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 7, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_2', name: 'التجويد', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_3', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_4', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_5', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_6', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_7', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_8', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_9', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_10', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_11', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
    { id: 'sp_المتوسطة_تحفيظ_القرآن_الثالث_المتوسط_12', name: 'التفكير الناقد', specializationIds: ["18"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'تحفيظ القرآن' },
  ],

  // الثانوية | مسارات - الفصل الأول | الصف: الأول الثانوي
  'sp_الثانوية_مسارات_الفصل_الأول_الأول_الثانوي': [
    { id: 'sp_الثانوية_مسارات_الفصل_الأول_الأول_الثانوي_1', name: 'القرآن الكريم وتفسيره', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسارات - الفصل الأول' },
  ],

  // الثانوية | المشترك - الفصل الأول | الصف: الأول الثانوي
  'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي': [
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_0', name: 'القرآن الكريم وتفسيره', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_1', name: 'الرياضيات 1', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_2', name: 'اللغة الإنجليزية 1', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_3', name: 'التقنية الرقمية 1', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_4', name: 'الكفايات اللغوية 1', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_5', name: 'مادة العلوم (كيمياء/فيزياء)', specializationIds: ["10"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_6', name: 'التفكير الناقد', specializationIds: ["18"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
    { id: 'sp_الثانوية_المشترك_الفصل_الأول_الأول_الثانوي_7', name: 'التربية الصحية والبدنية 1', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المشترك - الفصل الأول' },
  ],

  // الثانوية | المشترك - الفصل الثاني | الصف: الأول الثانوي
  'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي': [
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_1', name: 'الرياضيات 1', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_2', name: 'اللغة الإنجليزية 1', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_3', name: 'التقنية الرقمية 1', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_4', name: 'الأحياء 1', specializationIds: ["11"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_5', name: 'مادة العلوم (كيمياء/فيزياء)', specializationIds: ["10"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_6', name: 'الكفايات اللغوية 1', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_7', name: 'علم البيئة', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_8', name: 'الحديث 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_9', name: 'المعرفة المالية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_10', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_11', name: 'التربية المهنية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
    { id: 'sp_الثانوية_المشترك_الفصل_الثاني_الأول_الثانوي_12', name: 'التربية الصحية والبدنية 1', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المشترك - الفصل الثاني' },
  ],

  // الثانوية | مسار عام - الفصل الأول | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_1', name: 'الرياضيات 2', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_3', name: 'الفيزياء 2', specializationIds: ["12"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_4', name: 'الكيمياء 2', specializationIds: ["10"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_5', name: 'الأحياء 2', specializationIds: ["11"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_6', name: 'الكفايات اللغوية 2', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_7', name: 'التاريخ', specializationIds: ["6"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_8', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثاني_الثانوي_9', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
  ],

  // الثانوية | مسار عام - الفصل الثاني | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_1', name: 'الرياضيات 2', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_3', name: 'الكيمياء 2', specializationIds: ["10"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_4', name: 'الأحياء 2', specializationIds: ["11"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_5', name: 'التقنية الرقمية 2', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_6', name: 'التوحيد 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_7', name: 'الجغرافيا', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_8', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_9', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثاني_الثانوي_10', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
  ],

  // الثانوية | مسار حاسب وهندسة - الفصل الأول | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_1', name: 'الرياضيات 2', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_3', name: 'الفيزياء 2', specializationIds: ["12"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_4', name: 'إنترنت الأشياء 1-1', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_5', name: 'الكفايات اللغوية 2', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_6', name: 'التاريخ', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_7', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثاني_الثانوي_8', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
  ],

  // الثانوية | مسار حاسب وهندسة - الفصل الثاني | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_1', name: 'الرياضيات 2', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_3', name: 'الكيمياء 2', specializationIds: ["10"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_4', name: 'علم البيانات', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_5', name: 'الهندسة', specializationIds: ["22"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_6', name: 'التوحيد 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_7', name: 'الجغرافيا', specializationIds: ["6"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_8', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثاني_الثانوي_9', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
  ],

  // الثانوية | مسار صحة وحياة - الفصل الأول | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_1', name: 'الرياضيات 2', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_3', name: 'الكيمياء 2', specializationIds: ["10"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_4', name: 'الأحياء 2', specializationIds: ["11"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_5', name: 'مبادئ العلوم الصحية', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_6', name: 'الكفايات اللغوية 2', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_7', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثاني_الثانوي_8', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
  ],

  // الثانوية | مسار صحة وحياة - الفصل الثاني | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_1', name: 'الرياضيات 2', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_3', name: 'الفيزياء 2', specializationIds: ["12"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_4', name: 'الرعاية الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_5', name: 'التقنية الرقمية 2', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_6', name: 'التوحيد 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_7', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثاني_الثانوي_8', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
  ],

  // الثانوية | مسار إدارة أعمال - الفصل الأول | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_1', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_2', name: 'صناعة القرار في الأعمال', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_3', name: 'مقدمة في الأعمال', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_4', name: 'الكفايات اللغوية 2', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_5', name: 'الإدارة المالية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_6', name: 'التوحيد 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_7', name: 'التاريخ', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_8', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثاني_الثانوي_9', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
  ],

  // الثانوية | مسار إدارة أعمال - الفصل الثاني | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_1', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_2', name: 'صناعة القرار في الأعمال', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_3', name: 'مقدمة في الأعمال', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_4', name: 'مبادئ الاقتصاد', specializationIds: ["13"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_5', name: 'مبادئ الإدارة', specializationIds: ["13"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_6', name: 'التفسير 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_7', name: 'الجغرافيا', specializationIds: ["6"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_8', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_9', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثاني_الثانوي_10', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
  ],

  // الثانوية | مسار شرعي - الفصل الأول | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_1', name: 'القرآن الكريم 1', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_3', name: 'الكفايات اللغوية 2', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_4', name: 'القراءات 1', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_5', name: 'الحديث 2', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_6', name: 'التوحيد 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_7', name: 'التاريخ', specializationIds: ["6"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_8', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثاني_الثانوي_9', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
  ],

  // الثانوية | مسار شرعي - الفصل الثاني | الصف: الثاني الثانوي
  'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي': [
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_1', name: 'القرآن الكريم 1', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_2', name: 'اللغة الإنجليزية 2', specializationIds: ["5"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_3', name: 'علوم القرآن', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_4', name: 'القراءات 2', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_5', name: 'مصطلح الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_6', name: 'التوحيد 2', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_7', name: 'الجغرافيا', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_8', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_9', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثاني_الثانوي_10', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
  ],

  // الثانوية | مسار عام - الفصل الأول | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_1', name: 'الرياضيات 3', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_3', name: 'الفيزياء 3', specializationIds: ["12"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_4', name: 'الكيمياء 3', specializationIds: ["10"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_5', name: 'الأحياء 3', specializationIds: ["11"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_6', name: 'علوم الأرض والفضاء', specializationIds: ["20"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_7', name: 'المجال الاختياري', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الأول_الثالث_الثانوي_8', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'مسار عام - الفصل الأول' },
  ],

  // الثانوية | مسار عام - الفصل الثاني | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_1', name: 'الرياضيات 3', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_3', name: 'الفيزياء 3', specializationIds: ["12"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_4', name: 'الكيمياء 3', specializationIds: ["10"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_5', name: 'الأحياء 3', specializationIds: ["11"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_6', name: 'علوم الأرض والفضاء', specializationIds: ["20"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_7', name: 'الفقه 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_8', name: 'الدراسات الأدبية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_9', name: 'الدراسات النفسية والاجتماعية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_10', name: 'التقنية الرقمية 3', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_11', name: 'المواطنة الرقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_12', name: 'المجال الاختياري', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_عام_الفصل_الثاني_الثالث_الثانوي_13', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار عام - الفصل الثاني' },
  ],

  // الثانوية | مسار حاسب وهندسة - الفصل الأول | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_1', name: 'الرياضيات 3', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_3', name: 'الفيزياء 3', specializationIds: ["12"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_4', name: 'الكيمياء 3', specializationIds: ["10"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_5', name: 'علوم الأرض والفضاء', specializationIds: ["20"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_6', name: 'الذكاء الاصطناعي', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_7', name: 'هندسة البرمجيات', specializationIds: ["22"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_8', name: 'التربية الصحية والبدنية 2', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_9', name: 'مشروع التخرج', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الأول_الثالث_الثانوي_10', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الأول' },
  ],

  // الثانوية | مسار حاسب وهندسة - الفصل الثاني | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_1', name: 'الرياضيات 3', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_3', name: 'الأمن السيبراني', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_4', name: 'التصميم الهندسي', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_5', name: 'الفقه 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_6', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_7', name: 'البحث ومصادر المعلومات', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_حاسب_وهندسة_الفصل_الثاني_الثالث_الثانوي_8', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار حاسب وهندسة - الفصل الثاني' },
  ],

  // الثانوية | مسار صحة وحياة - الفصل الأول | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_1', name: 'الرياضيات 3', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_3', name: 'الأحياء 3', specializationIds: ["11"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_4', name: 'أنظمة جسم الإنسان', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_5', name: 'علوم الأرض والفضاء', specializationIds: ["20"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_6', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_7', name: 'التربية الصحية والبدنية 2', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_8', name: 'مشروع التخرج', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الأول_الثالث_الثانوي_9', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الأول' },
  ],

  // الثانوية | مسار صحة وحياة - الفصل الثاني | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_1', name: 'الرياضيات 3', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_3', name: 'الفيزياء 3', specializationIds: ["12"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_4', name: 'الكيمياء 3', specializationIds: ["10"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_5', name: 'الفقه 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_6', name: 'الإحصاء', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_7', name: 'البحث ومصادر المعلومات', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_صحة_وحياة_الفصل_الثاني_الثالث_الثانوي_8', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'مسار صحة وحياة - الفصل الثاني' },
  ],

  // الثانوية | مسار إدارة أعمال - الفصل الأول | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_1', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_2', name: 'إدارة الفعاليات', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_3', name: 'تخطيط الحملات التسويقية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_4', name: 'مبادئ القانون', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_5', name: 'الدراسات البلاغية والنقدية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_6', name: 'الإحصاء', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_7', name: 'التربية الصحية والبدنية 2', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_8', name: 'البحث ومصادر المعلومات', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_9', name: 'مشروع التخرج', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الأول_الثالث_الثانوي_10', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الأول' },
  ],

  // الثانوية | مسار إدارة أعمال - الفصل الثاني | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_1', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_2', name: 'إدارة الفعاليات', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_3', name: 'تخطيط الحملات التسويقية', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_4', name: 'السكرتارية والإدارة المكتبية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_5', name: 'تطبيقات في القانون', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_6', name: 'الفقه 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_7', name: 'الدراسات الأدبية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_8', name: 'الدراسات النفسية والاجتماعية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_9', name: 'التقنية الرقمية 2', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_10', name: 'المواطنة الرقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_11', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_إدارة_أعمال_الفصل_الثاني_الثالث_الثانوي_12', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار إدارة أعمال - الفصل الثاني' },
  ],

  // الثانوية | مسار شرعي - الفصل الأول | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_1', name: 'القرآن الكريم 2', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_3', name: 'الفقه 2', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_4', name: 'مبادئ القانون', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_5', name: 'الدراسات البلاغية والنقدية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_6', name: 'التفسير 2', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_7', name: 'الفرائض', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_8', name: 'مشروع التخرج', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الأول_الثالث_الثانوي_9', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الأول' },
  ],

  // الثانوية | مسار شرعي - الفصل الثاني | الصف: الثالث الثانوي
  'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي': [
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_1', name: 'القرآن الكريم 2', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_2', name: 'اللغة الإنجليزية 3', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_3', name: 'أصول الفقه', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_4', name: 'الفقه 1', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_5', name: 'الدراسات الأدبية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_6', name: 'الدراسات النفسية والاجتماعية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_7', name: 'التقنية الرقمية 2', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_8', name: 'تطبيقات في القانون', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_9', name: 'المواطنة الرقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_11', name: 'البحث ومصادر المعلومات', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_12', name: 'التربية الصحية والبدنية 2', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
    { id: 'sp_الثانوية_مسار_شرعي_الفصل_الثاني_الثالث_الثانوي_13', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مسار شرعي - الفصل الثاني' },
  ],

  // الابتدائية | تعليم مستمر - ابتدائية | الصف: الأول
  'sp_الابتدائية_تعليم_مستمر_ابتدائية_الأول': [
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الأول_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 9, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الأول_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الأول_4', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الأول_5', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الأول_6', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
  ],

  // الابتدائية | تعليم مستمر - ابتدائية | الصف: الثاني
  'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني': [
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_7', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_8', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثاني_9', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
  ],

  // الابتدائية | تعليم مستمر - ابتدائية | الصف: الثالث
  'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث': [
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_7', name: 'الحاسب', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_8', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
    { id: 'sp_الابتدائية_تعليم_مستمر_ابتدائية_الثالث_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'تعليم مستمر - ابتدائية' },
  ],

  // الابتدائية | التعليم المستمر - ذوي الإعاقة الفكرية البسيطة | الصف: الأول
  'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول': [
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 8, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول_4', name: 'المهارات المهنية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول_5', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول_6', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الأول_7', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
  ],

  // الابتدائية | التعليم المستمر - ذوي الإعاقة الفكرية البسيطة | الصف: الثاني
  'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني': [
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_5', name: 'المهارات المهنية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_7', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_8', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثاني_9', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
  ],

  // الابتدائية | التعليم المستمر - ذوي الإعاقة الفكرية البسيطة | الصف: الثالث
  'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث': [
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_5', name: 'المهارات المهنية', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_7', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_8', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
    { id: 'sp_الابتدائية_التعليم_المستمر_ذوي_الإعاقة_الفكرية_البسيطة_الثالث_9', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'التعليم المستمر - ذوي الإعاقة الفكرية البسيطة' },
  ],

  // الثانوية | المعاهد العلمية | الصف: الثالث الثانوي
  'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي': [
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_1', name: 'القرآن الكريم', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_2', name: 'التفسير', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_3', name: 'الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_4', name: 'التوحيد', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_5', name: 'الفقه', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_6', name: 'أصول الفقه', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_7', name: 'الفرائض', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_8', name: 'النحو والصرف', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_9', name: 'المهارات اللغوية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_10', name: 'البلاغة والنقد', specializationIds: ["2"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_11', name: 'الأدب العربي وتاريخه', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_12', name: 'العروض والقافية', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_13', name: 'الدراسات الاجتماعية (الجغرافيا)', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_14', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_15', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
    { id: 'sp_الثانوية_المعاهد_العلمية_الثالث_الثانوي_16', name: 'التقنية الرقمية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'المعاهد العلمية' },
  ],

  // المتوسطة | دار الحديث المكية / المدنية | الصف: الأول المتوسط
  'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط': [
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_1', name: 'القرآن الكريم', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_2', name: 'التفسير', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_3', name: 'الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_4', name: 'علوم الحديث', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_5', name: 'التوحيد', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_6', name: 'الفقه', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_7', name: 'النحو والصرف', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_8', name: 'المهارات اللغوية', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_9', name: 'النصوص الأدبية', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_10', name: 'القواعد الكتابية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_11', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_12', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_13', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_14', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_15', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_16', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الأول_المتوسط_17', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
  ],

  // المتوسطة | دار الحديث المكية / المدنية | الصف: الثاني المتوسط
  'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_1', name: 'القرآن الكريم', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_2', name: 'التفسير', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_3', name: 'الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_4', name: 'علوم الحديث', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_5', name: 'التوحيد', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_6', name: 'الفقه', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_7', name: 'النحو والصرف', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_8', name: 'المهارات اللغوية', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_9', name: 'النصوص الأدبية', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_10', name: 'القواعد الكتابية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_11', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_12', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_13', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_14', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_15', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_16', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثاني_المتوسط_17', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
  ],

  // المتوسطة | دار الحديث المكية / المدنية | الصف: الثالث المتوسط
  'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_1', name: 'القرآن الكريم', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_2', name: 'التفسير', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_3', name: 'الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_4', name: 'علوم الحديث', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_5', name: 'التوحيد', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_6', name: 'الفقه', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_7', name: 'النحو والصرف', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_8', name: 'المهارات اللغوية', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_9', name: 'النصوص الأدبية', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_10', name: 'القواعد الكتابية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_11', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_12', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_13', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_14', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_15', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_16', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_17', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_المتوسطة_دار_الحديث_المكية_المدنية_الثالث_المتوسط_18', name: 'التفكير الناقد', specializationIds: ["18"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'دار الحديث المكية / المدنية' },
  ],

  // الثانوية | دار الحديث المكية / المدنية | الصف: الأول الثانوي
  'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي': [
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_1', name: 'القرآن الكريم', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_2', name: 'التفسير', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_3', name: 'الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_4', name: 'التوحيد', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_5', name: 'الفقه', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_6', name: 'دراسات في الكتب الستة', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_7', name: 'النحو والصرف', specializationIds: ["2"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_8', name: 'المهارات اللغوية', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_9', name: 'البلاغة والنقد', specializationIds: ["2"], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_10', name: 'الأدب العربي وتاريخه', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_11', name: 'الدراسات الاجتماعية ( تاريخ - جغرافيا)', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_12', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_13', name: 'العلوم (الأحياء)', specializationIds: ["11"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_14', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_15', name: 'التقنية الرقمية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_16', name: 'اللياقة والثقافة الصحية', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الأول_الثانوي_17', name: 'التفكير الناقد', specializationIds: ["18"], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
  ],

  // الثانوية | دار الحديث المكية / المدنية | الصف: الثاني الثانوي
  'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي': [
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_1', name: 'القرآن الكريم', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_2', name: 'التفسير', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_3', name: 'الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_4', name: 'التوحيد', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_5', name: 'الفقه', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_6', name: 'الفرائض', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_7', name: 'مصطلح الحديث', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_8', name: 'دراسات في الكتب الستة', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_9', name: 'تخريج الحديث', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_10', name: 'النحو والصرف', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_11', name: 'المهارات اللغوية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_12', name: 'البلاغة والنقد', specializationIds: ["2"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_13', name: 'الأدب العربي وتاريخه', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_14', name: 'الدراسات الاجتماعية (تاريخ)', specializationIds: ["6"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_15', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_16', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_17', name: 'التقنية الرقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثاني_الثانوي_18', name: 'التربية الصحية', specializationIds: ["9"], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
  ],

  // الثانوية | دار الحديث المكية / المدنية | الصف: الثالث الثانوي
  'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي': [
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_1', name: 'القرآن الكريم', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_2', name: 'التفسير', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_3', name: 'الحديث', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_4', name: 'التوحيد', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_5', name: 'الفقه', specializationIds: ["1"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_6', name: 'أصول الفقه', specializationIds: ["1"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_7', name: 'الفرائض', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_8', name: 'دراسات في الكتب الستة', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_9', name: 'تخريج الحديث', specializationIds: ["1"], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_10', name: 'النحو والصرف', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_11', name: 'المهارات اللغوية', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_12', name: 'البلاغة والنقد', specializationIds: ["2"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_13', name: 'الأدب العربي وتاريخه', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_14', name: 'العروض والقافية', specializationIds: [], periodsPerClass: 1, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_15', name: 'الدراسات الاجتماعية (جغرافيا)', specializationIds: ["6"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_16', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_17', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
    { id: 'sp_الثانوية_دار_الحديث_المكية_المدنية_الثالث_الثانوي_18', name: 'التقنية الرقمية', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'دار الحديث المكية / المدنية' },
  ],

  // الابتدائية | المدارس الأهلية (منهج مغاير) | الصف: الأول
  'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الأول': [
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الأول_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الأول_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // الابتدائية | المدارس الأهلية (منهج مغاير) | الصف: الثاني
  'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الثاني': [
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الثاني_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الثاني_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // الابتدائية | المدارس الأهلية (منهج مغاير) | الصف: الثالث
  'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الثالث': [
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الثالث_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الثالث_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الثالث_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // الابتدائية | المدارس الأهلية (منهج مغاير) | الصف: الرابع
  'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الرابع': [
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الرابع_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الرابع_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الرابع_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // الابتدائية | المدارس الأهلية (منهج مغاير) | الصف: الخامس
  'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الخامس': [
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الخامس_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الخامس_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_الخامس_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // الابتدائية | المدارس الأهلية (منهج مغاير) | الصف: السادس
  'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_السادس': [
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_السادس_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_السادس_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_الابتدائية_المدارس_الأهلية_(منهج_مغاير)_السادس_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // المتوسطة | المدارس الأهلية (منهج مغاير) | الصف: الأول المتوسط
  'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الأول_المتوسط': [
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الأول_المتوسط_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الأول_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الأول_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // المتوسطة | المدارس الأهلية (منهج مغاير) | الصف: الثاني المتوسط
  'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثاني_المتوسط_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثاني_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثاني_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // المتوسطة | المدارس الأهلية (منهج مغاير) | الصف: الثالث المتوسط
  'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثالث_المتوسط_1', name: 'الدراسات الإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثالث_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
    { id: 'sp_المتوسطة_المدارس_الأهلية_(منهج_مغاير)_الثالث_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس الأهلية (منهج مغاير)' },
  ],

  // المتوسطة | المدارس المطبقة للغة الصينية | الصف: الأول المتوسط
  'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط': [
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_7', name: 'اللغة الصينية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_8', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_9', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_10', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الأول_المتوسط_11', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
  ],

  // المتوسطة | المدارس المطبقة للغة الصينية | الصف: الثاني المتوسط
  'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_7', name: 'اللغة الصينية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_8', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_9', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_10', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثاني_المتوسط_11', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
  ],

  // المتوسطة | المدارس المطبقة للغة الصينية | الصف: الثالث المتوسط
  'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_3', name: 'الدراسات الاجتماعية', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_4', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_5', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_6', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_7', name: 'اللغة الصينية', specializationIds: ["5"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_8', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_9', name: 'التربية الفنية', specializationIds: ["8"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_10', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_11', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_12', name: 'التفكير الناقد', specializationIds: ["18"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
    { id: 'sp_المتوسطة_المدارس_المطبقة_للغة_الصينية_الثالث_المتوسط_13', name: 'النشاط', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'المدارس المطبقة للغة الصينية' },
  ],

  // الابتدائية | المدارس المطبقة للفنون - أولية | الصف: الأول
  'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول': [
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 8, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_6', name: 'الفنون البصرية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_7', name: 'الفنون الموسيقية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_8', name: 'الفنون الأدائية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الأول_11', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
  ],

  // الابتدائية | المدارس المطبقة للفنون - أولية | الصف: الثاني
  'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني': [
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 7, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_6', name: 'الفنون البصرية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_7', name: 'الفنون الموسيقية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_8', name: 'الفنون الأدائية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثاني_11', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
  ],

  // الابتدائية | المدارس المطبقة للفنون - أولية | الصف: الثالث
  'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث': [
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_2', name: 'اللغة العربية', specializationIds: ["2"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_3', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 6, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_4', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_5', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_6', name: 'الفنون البصرية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_7', name: 'الفنون الموسيقية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_8', name: 'الفنون الأدائية', specializationIds: ["8"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_9', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_10', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
    { id: 'sp_الابتدائية_المدارس_المطبقة_للفنون_أولية_الثالث_11', name: 'النشاط', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'المدارس المطبقة للفنون - أولية' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الأول
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 12, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_6', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الثاني
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 12, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_6', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الثالث
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 12, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_6', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الرابع
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 14, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الرابع_7', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الخامس
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 14, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_الخامس_7', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - طيف التوحد | الصف: السادس
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 14, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_طيف_التوحد_السادس_7', name: 'النشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - طيف التوحد | الصف: الأول المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 14, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_المتوسط_7', name: 'النشاط والتدريب', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - طيف التوحد | الصف: الثاني المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 14, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_المتوسط_7', name: 'النشاط والتدريب', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - طيف التوحد | الصف: الثالث المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط_1', name: 'التواصل', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 14, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_المتوسط_7', name: 'النشاط والتدريب', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الأول الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي_1', name: 'التواصل', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 11, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الأول_الثانوي_التأهيلي_7', name: 'النشاط والتدريب', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الثاني الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي_1', name: 'التواصل', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 11, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثاني_الثانوي_التأهيلي_7', name: 'النشاط والتدريب', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - طيف التوحد | الصف: الثالث الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي_1', name: 'التواصل', specializationIds: [], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي_2', name: 'الأكاديمي', specializationIds: [], periodsPerClass: 11, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي_3', name: 'المهارات الحياتية', specializationIds: ["17"], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي_4', name: 'التربية البدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي_5', name: 'الفنون', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي_6', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_طيف_التوحد_الثالث_الثانوي_التأهيلي_7', name: 'النشاط والتدريب', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - طيف التوحد' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الفكرية | الصف: الأول
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_5', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_8', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الأول_9', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الفكرية | الصف: الثاني
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_5', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_8', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_9', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الفكرية | الصف: الثالث
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_5', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_8', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_9', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الفكرية | الصف: الرابع
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_10', name: 'حياتية', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الرابع_11', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الفكرية | الصف: الخامس
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_10', name: 'حياتية', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_الخامس_11', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الفكرية | الصف: السادس
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_10', name: 'حياتية', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الفكرية_السادس_11', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - الفكرية | الصف: الأول المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_10', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الأول_المتوسط_11', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - الفكرية | الصف: الثاني المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_10', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثاني_المتوسط_11', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - الفكرية | الصف: الثالث المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_10', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الفكرية_الثالث_المتوسط_11', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - الفكرية | الصف: الأول الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_4', name: 'إنجليزي', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_5', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_8', name: 'حياتية', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الأول_الثانوي_التأهيلي_9', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - الفكرية | الصف: الثاني الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_4', name: 'إنجليزي', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_5', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_8', name: 'حياتية', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثاني_الثانوي_التأهيلي_9', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - الفكرية | الصف: الثالث الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_4', name: 'إنجليزي', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_5', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_8', name: 'حياتية', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الفكرية_الثالث_الثانوي_التأهيلي_9', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الفكرية' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الإعاقات | الصف: الأول
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_5', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_8', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_9', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الإعاقات | الصف: الثاني
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_5', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_8', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_9', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الإعاقات | الصف: الثالث
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_5', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_8', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_9', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الإعاقات | الصف: الرابع
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_10', name: 'حياتية', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الرابع_11', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الإعاقات | الصف: الخامس
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_10', name: 'حياتية', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_الخامس_11', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الابتدائية | مدارس ذوي الإعاقة - الإعاقات | الصف: السادس
  'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس': [
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_10', name: 'حياتية', specializationIds: [], periodsPerClass: 3, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الابتدائية_مدارس_ذوي_الإعاقة_الإعاقات_السادس_11', name: 'نشاط', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - الإعاقات | الصف: الأول المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_10', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الأول_المتوسط_11', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - الإعاقات | الصف: الثاني المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_10', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_المتوسط_11', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // المتوسطة | مدارس ذوي الإعاقة - الإعاقات | الصف: الثالث المتوسط
  'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_4', name: 'علوم', specializationIds: ["4"], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_5', name: 'اجتماعيات', specializationIds: ["6"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_6', name: 'إنجليزي', specializationIds: [], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_7', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_8', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_9', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_10', name: 'حياتية', specializationIds: [], periodsPerClass: 4, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_المتوسطة_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_المتوسط_11', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.MIDDLE], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - الإعاقات | الصف: الأول الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_4', name: 'إنجليزي', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_5', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_8', name: 'حياتية', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الأول_الثانوي_التأهيلي_9', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - الإعاقات | الصف: الثاني الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_4', name: 'إنجليزي', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_5', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_8', name: 'حياتية', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثاني_الثانوي_التأهيلي_9', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الثانوية | مدارس ذوي الإعاقة - الإعاقات | الصف: الثالث الثانوي - التأهيلي
  'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي': [
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_1', name: 'قرآن وإسلامية', specializationIds: ["1"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_2', name: 'لغة عربية', specializationIds: ["2"], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_3', name: 'رياضيات', specializationIds: ["3"], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_4', name: 'إنجليزي', specializationIds: [], periodsPerClass: 2, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_5', name: 'مهارات رقمية', specializationIds: [], periodsPerClass: 4, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_6', name: 'فنية', specializationIds: ["8"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_7', name: 'بدنية', specializationIds: ["9"], periodsPerClass: 3, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_8', name: 'حياتية', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
    { id: 'sp_الثانوية_مدارس_ذوي_الإعاقة_الإعاقات_الثالث_الثانوي_التأهيلي_9', name: 'نشاط', specializationIds: [], periodsPerClass: 5, phases: [Phase.HIGH], department: 'مدارس ذوي الإعاقة - الإعاقات' },
  ],

  // الابتدائية | الموهوبين | الصف: الرابع
  'sp_الابتدائية_الموهوبين_الرابع': [
    { id: 'sp_الابتدائية_الموهوبين_الرابع_1', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الرابع_2', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الرابع_3', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الرابع_4', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الرابع_5', name: 'الإثراء العام', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
  ],

  // الابتدائية | الموهوبين | الصف: الخامس
  'sp_الابتدائية_الموهوبين_الخامس': [
    { id: 'sp_الابتدائية_الموهوبين_الخامس_1', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الخامس_2', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الخامس_3', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الخامس_4', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_الخامس_5', name: 'الإثراء العام', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
  ],

  // الابتدائية | الموهوبين | الصف: السادس
  'sp_الابتدائية_الموهوبين_السادس': [
    { id: 'sp_الابتدائية_الموهوبين_السادس_1', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_السادس_2', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_السادس_3', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_السادس_4', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
    { id: 'sp_الابتدائية_الموهوبين_السادس_5', name: 'الإثراء العام', specializationIds: [], periodsPerClass: 2, phases: [Phase.ELEMENTARY], department: 'الموهوبين' },
  ],

  // المتوسطة | الموهوبين | الصف: الأول المتوسط
  'sp_المتوسطة_الموهوبين_الأول_المتوسط': [
    { id: 'sp_المتوسطة_الموهوبين_الأول_المتوسط_1', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الأول_المتوسط_2', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الأول_المتوسط_3', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الأول_المتوسط_4', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الأول_المتوسط_5', name: 'الإثراء العام', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'الموهوبين' },
  ],

  // المتوسطة | الموهوبين | الصف: الثاني المتوسط
  'sp_المتوسطة_الموهوبين_الثاني_المتوسط': [
    { id: 'sp_المتوسطة_الموهوبين_الثاني_المتوسط_1', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثاني_المتوسط_2', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثاني_المتوسط_3', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثاني_المتوسط_4', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثاني_المتوسط_5', name: 'الإثراء العام', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'الموهوبين' },
  ],

  // المتوسطة | الموهوبين | الصف: الثالث المتوسط
  'sp_المتوسطة_الموهوبين_الثالث_المتوسط': [
    { id: 'sp_المتوسطة_الموهوبين_الثالث_المتوسط_1', name: 'الرياضيات', specializationIds: ["3"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثالث_المتوسط_2', name: 'العلوم', specializationIds: ["4"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثالث_المتوسط_3', name: 'اللغة الإنجليزية', specializationIds: ["5"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثالث_المتوسط_4', name: 'المهارات الرقمية', specializationIds: ["7"], periodsPerClass: 1, phases: [Phase.MIDDLE], department: 'الموهوبين' },
    { id: 'sp_المتوسطة_الموهوبين_الثالث_المتوسط_5', name: 'الإثراء العام', specializationIds: [], periodsPerClass: 2, phases: [Phase.MIDDLE], department: 'الموهوبين' },
  ],
};

/**
 * بيانات وهمية للمعاينة فقط — لا تُستخدم في الإنتاج
 */
import { Teacher, ClassInfo, Subject, TimetableData, TimetableSlot, ScheduleSettingsData, Phase } from '../../types';

// ─── التخصصات ───────────────────────────────────────────────────────
export const mockSpecNames: Record<string, string> = {
    'spec-ar':  'اللغة العربية',
    'spec-en':  'اللغة الإنجليزية',
    'spec-ma':  'الرياضيات',
    'spec-sc':  'العلوم',
    'spec-is':  'الدراسات الإسلامية',
    'spec-ss':  'الاجتماعيات',
    'spec-pe':  'التربية البدنية',
    'spec-it':  'الحاسب الآلي',
};

// ─── المواد ──────────────────────────────────────────────────────────
export const mockSubjects: Subject[] = [
    { id:'sub-ar', name:'لغة عربية',       specializationIds:['spec-ar'], periodsPerClass:6, phases:[Phase.MIDDLE] },
    { id:'sub-en', name:'لغة إنجليزية',    specializationIds:['spec-en'], periodsPerClass:5, phases:[Phase.MIDDLE] },
    { id:'sub-ma', name:'رياضيات',          specializationIds:['spec-ma'], periodsPerClass:5, phases:[Phase.MIDDLE] },
    { id:'sub-sc', name:'علوم',             specializationIds:['spec-sc'], periodsPerClass:4, phases:[Phase.MIDDLE] },
    { id:'sub-is', name:'تربية إسلامية',   specializationIds:['spec-is'], periodsPerClass:4, phases:[Phase.MIDDLE] },
    { id:'sub-ss', name:'اجتماعيات',       specializationIds:['spec-ss'], periodsPerClass:3, phases:[Phase.MIDDLE] },
    { id:'sub-pe', name:'تربية بدنية',     specializationIds:['spec-pe'], periodsPerClass:2, phases:[Phase.MIDDLE] },
    { id:'sub-it', name:'حاسب آلي',        specializationIds:['spec-it'], periodsPerClass:2, phases:[Phase.MIDDLE] },
];

// ─── الفصول ──────────────────────────────────────────────────────────
export const mockClasses: ClassInfo[] = [
    { id:'cls-1a', phase:Phase.MIDDLE, grade:1, section:1, name:'الأول أ' },
    { id:'cls-1b', phase:Phase.MIDDLE, grade:1, section:2, name:'الأول ب' },
    { id:'cls-2a', phase:Phase.MIDDLE, grade:2, section:1, name:'الثاني أ' },
    { id:'cls-2b', phase:Phase.MIDDLE, grade:2, section:2, name:'الثاني ب' },
    { id:'cls-3a', phase:Phase.MIDDLE, grade:3, section:1, name:'الثالث أ' },
];

// ─── المعلمون ─────────────────────────────────────────────────────────
export const mockTeachers: Teacher[] = [
    { id:'t1', name:'أحمد محمد السالم',    specializationId:'spec-ar', assignedSubjectId:'sub-ar', quotaLimit:24, waitingQuota:4, phone:'' },
    { id:'t2', name:'خالد عبدالله الراشد', specializationId:'spec-en', assignedSubjectId:'sub-en', quotaLimit:22, waitingQuota:3, phone:'' },
    { id:'t3', name:'سعد علي المطيري',     specializationId:'spec-ma', assignedSubjectId:'sub-ma', quotaLimit:24, waitingQuota:4, phone:'' },
    { id:'t4', name:'فهد ناصر العتيبي',    specializationId:'spec-sc', assignedSubjectId:'sub-sc', quotaLimit:20, waitingQuota:3, phone:'' },
    { id:'t5', name:'عمر سعد الحارثي',    specializationId:'spec-is', assignedSubjectId:'sub-is', quotaLimit:20, waitingQuota:2, phone:'' },
    { id:'t6', name:'يوسف طارق الزهراني', specializationId:'spec-ss', assignedSubjectId:'sub-ss', quotaLimit:18, waitingQuota:2, phone:'' },
    { id:'t7', name:'ماجد سلطان العمري',  specializationId:'spec-pe', assignedSubjectId:'sub-pe', quotaLimit:18, waitingQuota:2, phone:'' },
    { id:'t8', name:'نواف بندر القحطاني', specializationId:'spec-it', assignedSubjectId:'sub-it', quotaLimit:16, waitingQuota:2, phone:'' },
];

// ─── دالة مساعدة لإنشاء مفتاح الخانة ───────────────────────────────
const slot = (teacherId:string, day:string, period:number, subjectId:string, classId:string): [string, TimetableSlot] =>
    [`${teacherId}-${day}-${period}`, { teacherId, subjectId, classId, type:'lesson' as const }];

const waitSlot = (teacherId:string, day:string, period:number): [string, TimetableSlot] =>
    [`${teacherId}-${day}-${period}`, { teacherId, type:'waiting' as const, isSubstitution:true }];

// ─── الجدول الوهمي ────────────────────────────────────────────────────
// نوزع حصص كل معلم على الأيام والفصول بشكل واقعي
const entries: [string, TimetableSlot][] = [
    // أحمد - عربي (24 حصة على 5 فصول)
    ...[
        slot('t1','sunday',    1,'sub-ar','cls-1a'),
        slot('t1','sunday',    2,'sub-ar','cls-1b'),
        slot('t1','sunday',    4,'sub-ar','cls-2a'),
        slot('t1','monday',    1,'sub-ar','cls-2b'),
        slot('t1','monday',    3,'sub-ar','cls-3a'),
        slot('t1','monday',    5,'sub-ar','cls-1a'),
        slot('t1','tuesday',   1,'sub-ar','cls-1b'),
        slot('t1','tuesday',   3,'sub-ar','cls-2a'),
        slot('t1','tuesday',   5,'sub-ar','cls-2b'),
        slot('t1','wednesday', 1,'sub-ar','cls-3a'),
        slot('t1','wednesday', 3,'sub-ar','cls-1a'),
        slot('t1','wednesday', 6,'sub-ar','cls-1b'),
        slot('t1','thursday',  2,'sub-ar','cls-2a'),
        slot('t1','thursday',  4,'sub-ar','cls-2b'),
        waitSlot('t1','thursday', 6),
        waitSlot('t1','thursday', 7),
    ],
    // خالد - إنجليزي
    ...[
        slot('t2','sunday',    2,'sub-en','cls-1a'),
        slot('t2','sunday',    3,'sub-en','cls-2a'),
        slot('t2','monday',    2,'sub-en','cls-1b'),
        slot('t2','monday',    4,'sub-en','cls-2b'),
        slot('t2','tuesday',   2,'sub-en','cls-3a'),
        slot('t2','tuesday',   4,'sub-en','cls-1a'),
        slot('t2','wednesday', 2,'sub-en','cls-2a'),
        slot('t2','wednesday', 5,'sub-en','cls-1b'),
        slot('t2','thursday',  1,'sub-en','cls-2b'),
        slot('t2','thursday',  3,'sub-en','cls-3a'),
        waitSlot('t2','sunday', 6),
    ],
    // سعد - رياضيات
    ...[
        slot('t3','sunday',    3,'sub-ma','cls-1a'),
        slot('t3','sunday',    5,'sub-ma','cls-3a'),
        slot('t3','monday',    1,'sub-ma','cls-2a'),
        slot('t3','monday',    6,'sub-ma','cls-1b'),
        slot('t3','tuesday',   1,'sub-ma','cls-2b'),
        slot('t3','tuesday',   6,'sub-ma','cls-1a'),
        slot('t3','wednesday', 1,'sub-ma','cls-3a'),
        slot('t3','wednesday', 4,'sub-ma','cls-2a'),
        slot('t3','thursday',  2,'sub-ma','cls-1b'),
        slot('t3','thursday',  5,'sub-ma','cls-2b'),
        waitSlot('t3','monday', 7),
        waitSlot('t3','tuesday', 7),
    ],
    // فهد - علوم
    ...[
        slot('t4','sunday',    4,'sub-sc','cls-2b'),
        slot('t4','sunday',    6,'sub-sc','cls-3a'),
        slot('t4','monday',    2,'sub-sc','cls-1a'),
        slot('t4','monday',    5,'sub-sc','cls-1b'),
        slot('t4','tuesday',   3,'sub-sc','cls-2a'),
        slot('t4','wednesday', 3,'sub-sc','cls-2b'),
        slot('t4','wednesday', 7,'sub-sc','cls-3a'),
        slot('t4','thursday',  1,'sub-sc','cls-1a'),
        slot('t4','thursday',  6,'sub-sc','cls-1b'),
        waitSlot('t4','sunday', 7),
    ],
    // عمر - إسلامية
    ...[
        slot('t5','sunday',    1,'sub-is','cls-3a'),
        slot('t5','monday',    3,'sub-is','cls-1a'),
        slot('t5','tuesday',   2,'sub-is','cls-1b'),
        slot('t5','wednesday', 2,'sub-is','cls-2a'),
        slot('t5','thursday',  3,'sub-is','cls-2b'),
        slot('t5','sunday',    5,'sub-is','cls-2a'),
        slot('t5','monday',    6,'sub-is','cls-2b'),
        slot('t5','tuesday',   5,'sub-is','cls-3a'),
        waitSlot('t5','wednesday', 6),
    ],
    // يوسف - اجتماعيات
    ...[
        slot('t6','sunday',    2,'sub-ss','cls-3a'),
        slot('t6','monday',    4,'sub-ss','cls-1a'),
        slot('t6','tuesday',   4,'sub-ss','cls-1b'),
        slot('t6','wednesday', 4,'sub-ss','cls-2a'),
        slot('t6','thursday',  4,'sub-ss','cls-2b'),
        slot('t6','sunday',    7,'sub-ss','cls-2b'),
        slot('t6','monday',    7,'sub-ss','cls-3a'),
        waitSlot('t6','tuesday', 7),
    ],
    // ماجد - بدنية
    ...[
        slot('t7','sunday',    6,'sub-pe','cls-1a'),
        slot('t7','monday',    6,'sub-pe','cls-1b'),
        slot('t7','tuesday',   6,'sub-pe','cls-2a'),
        slot('t7','wednesday', 6,'sub-pe','cls-2b'),
        slot('t7','thursday',  6,'sub-pe','cls-3a'),
        waitSlot('t7','sunday', 7),
        waitSlot('t7','tuesday', 7),
    ],
    // نواف - حاسب
    ...[
        slot('t8','sunday',    7,'sub-it','cls-1a'),
        slot('t8','monday',    7,'sub-it','cls-1b'),
        slot('t8','tuesday',   7,'sub-it','cls-2a'),
        slot('t8','wednesday', 7,'sub-it','cls-2b'),
        slot('t8','thursday',  7,'sub-it','cls-3a'),
        waitSlot('t8','monday', 5),
    ],
];

export const mockTimetable: TimetableData = Object.fromEntries(entries);

// ─── عنصر settings وهمي ──────────────────────────────────────────────
export const mockSettings: ScheduleSettingsData = {
    subjectConstraints: [],
    teacherConstraints: [],
    meetings: [],
    substitutionConfig: { method:'auto', maxTotalQuota:24, maxDailyTotal:5 },
    timetable: mockTimetable,
    subjectAbbreviations: {
        'sub-ar': 'عربي',
        'sub-en': 'إنجليزي',
        'sub-ma': 'رياضيات',
        'sub-sc': 'علوم',
        'sub-is': 'إسلامية',
        'sub-ss': 'اجتماعيات',
        'sub-pe': 'بدنية',
        'sub-it': 'حاسب',
    },
} as unknown as ScheduleSettingsData;


export enum EntityType {
  SCHOOL = 'مدرسة',
  INSTITUTE = 'معهد',
  UNIVERSITY = 'جامعة',
  OTHER = 'أخرى'
}

export enum Phase {
  KINDERGARTEN = 'رياض أطفال',
  ELEMENTARY = 'الابتدائية',
  MIDDLE = 'المتوسطة',
  HIGH = 'الثانوية',
  OTHER = 'أخرى'
}

export interface SharedSchool {
  id: string;
  name: string;
  phases: Phase[];
  gender: 'بنين' | 'بنات';
  // departments: string[]; // Removed as per request
  // otherDepartment?: string; // Removed as per request
  otherPhase?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  timing?: TimingConfig; // Optional custom timing for this school
  educationAdministration?: string; // Added
  region?: string; // Added
  managerName?: string; // Added - Principal
  managerMobile?: string; // Added - Principal Mobile
}

export interface SchoolInfo {
  // Entity Type Configuration
  entityType: EntityType;
  
  // Common Fields
  region: string;
  city?: string;
  country?: string; 
  email?: string;
  logo?: string;
  address?: string;
  phone?: string;

  // School Specific
  schoolName: string; // Used for Entity Name as well if not school
  phases: Phase[];
  gender: 'بنين' | 'بنات';
  educationAdministration?: string;
  
  // Leadership
  principal: string; // Manager Name
  principalMobile?: string; // Manager Mobile
  educationalAgent: string; // Kept for schools

  // Deprecated / Legacy but kept for compatibility or removal
  departments: string[]; 
  otherDepartment?: string;
  otherPhase?: string;

  
  // Shared Schools - Refactored from single second school to array
  sharedSchools: SharedSchool[];

  // Legacy fields (kept optional for migration if needed, or remove if strictly following clean slate)
  // We will migrate data from these to sharedSchools in the wizard or on load
  hasSecondSchool?: boolean;
  secondSchoolName?: string;
  secondSchoolPhases?: Phase[];
  secondSchoolGender?: 'بنين' | 'بنات';
  secondSchoolDepartments?: string[];
  secondSchoolOtherDepartment?: string;
  secondSchoolPhone?: string;
  secondSchoolEmail?: string;

  mergeTeachers?: boolean;
  mergeTiming?: boolean;
  mergeSubjects?: boolean;
  mergeClassesView?: boolean;
  mergeTeachersView?: boolean;
  timing?: TimingConfig;
  secondTiming?: TimingConfig; // For 'separate' or 'copied' mode
  semesters?: SemesterInfo[];
  currentSemesterId?: string;
  academicYear?: string;
  isWizardCompleted?: boolean;
  
  // Custom/Institute Mode configuration
  customCategories?: { id: number; name: string }[];
}

export interface SemesterInfo {
  id: string;
  name: string;
  calendarType: 'hijri' | 'gregorian';
  startDate: string;
  endDate: string;
  weeksCount: number;
  isCurrent?: boolean;
}

export interface BreakInfo {
  id: string;
  name: string;
  duration: number;
  afterPeriod: number;
  targetPhases?: Phase[];
}

export interface PrayerInfo {
  id: string;
  name: string;
  duration: number;
  afterPeriod: number;
  isEnabled: boolean;
}

export interface TimingConfig {
  activeDays: string[]; // ['sunday', 'monday', ..., 'thursday']
  periodCounts: Record<string, number>; // { 'sunday': 7, 'monday': 6 ... }
  
  // Seasonal / Pattern
  season?: 'summer' | 'winter' | 'ramadan';
  
  // Time settings
  assemblyTime: string; // "06:45"
  periodDuration: number; // minutes
  customDurations?: Record<string, number>; // { '1': 45, '2': 40 ... }
  customPeriodNames?: Record<string, string>; // { '1': 'الطابور', '2': 'القرآن' ... }
  customStartTimes?: Record<string, string>; // { 'period-1': '07:00' ... }
  hasAssembly?: boolean;
  notes?: string;

  // Breaks & Prayer
  breaks: BreakInfo[];
  prayers: PrayerInfo[];
  
  // Shared School
  sharedSchoolMode?: 'unified' | 'copied' | 'separate';
  
  // Deprecated but kept for backward compatibility if needed, or can be removed if we migrate fully
  periodCount?: number; 
  breakCount?: number;
  breakDuration?: number;
  dayStartTime?: string;
}

export interface Student {
  id: string;
  name: string;
  classId: string;
  grade: number;
  parentPhone?: string;
  schoolId?: string; // 'main' or 'second' for shared schools
  nationalId?: string;
}

export interface Admin {
  id: string;
  name: string;
  role: string;
  phone: string;
  waitingQuota?: number;
  sortIndex?: number;
}

export interface Specialization {
  id: string;
  name: string;
}

export interface Subject {
  id: string;
  name: string;
  specializationIds: string[];
  periodsPerClass: number;
  phases: Phase[];
  targetGrades?: number[]; // مخصص للمرحلة الثانوية والصفوف المحددة (1, 2, 3...)
  department?: 'عام' | 'تحفيظ' | 'آخر' | 'مشترك' | 'حاسب وهندسة' | 'صحة وحياة' | 'إدارة أعمال' | 'شرعي' | 'custom'; // القسم التابع له المادة
  customPhaseName?: string; // اسم المرحلة المخصصة (عند اختيار "أخرى")
  customDepartmentName?: string; // اسم القسم المخصص (عند اختيار "أخرى" أو "آخر")
  customPlanName?: string; // اسم الخطة المخصصة (للمواد المضافة يدوياً كخطة)
  semester?: 1 | 2 | 3; // الفصل الدراسي (خاص بالثانوي - نظام 3 فصول)
  targetGradeNames?: string[]; // أسماء الصفوف/المستويات المستهدفة (لرياض الأطفال والمراحل الأخرى)
  isArchived?: boolean;
}

export interface Teacher {
  id: string;
  name: string;
  specializationId: string;
  assignedSubjectId: string;
  quotaLimit: number; // نصاب الحصص
  waitingQuota?: number; // نصاب الانتظار
  phone: string;
  targetPhase?: Phase;
  sortIndex?: number;
  schoolId?: string; // 'main' or 'second'
}

export interface ClassInfo {
  id: string;
  phase: Phase;
  grade: number;
  section: number;
  name?: string; // Custom name override (default: "1-1" format)
  subjectIds?: string[];
  
  // Customization & Configuration
  schoolId?: string; // 'main' or 'second' for shared schools
  customPeriodCounts?: Record<string, number>; // Override per day: { 'sunday': 6, 'monday': 6 }
  sortOrder?: number; // Manual reordering
  isManuallyCreated?: boolean; // Track creation method
  createdAt?: string; // ISO timestamp
  
  // Advanced Features
  type?: 'class' | 'lab' | 'computer_lab' | 'gym' | 'playground' | 'other';
  customType?: string; // If 'other'
  isMerged?: boolean;
  mergedClassIds?: string[];
  originalSchoolId?: string; // If merged from multiple
  linkedSubjectId?: string; // For linking facility to a subject (e.g., Gym -> PE)
}

export interface Assignment {
  teacherId: string;
  classId: string;
  subjectId: string;
  isDraft?: boolean;
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  content: string;
  timestamp: string;
  type: 'whatsapp' | 'sms';
  status: 'sent' | 'pending' | 'failed';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO date string YYYY-MM-DD
  type: 'meeting' | 'holiday' | 'exam' | 'other';
  description?: string;
}

export interface DailyScheduleItem {
  id: string;
  type: 'absence' | 'supervision' | 'duty';
  name: string; // Teacher name or staff name
  role?: string; // e.g. "Supervisor", "Duty Officer"
  time?: string;
  location?: string;
  isTomorrow?: boolean;
}

export interface SubscriptionInfo {
  totalMessages: number;
  remainingMessages: number;
  startDate: string;
  endDate: string;
  planName: string;
}

// ===== Schedule Settings Types =====

export interface SubjectConstraint {
  subjectId: string;
  excludedPeriods: number[];        // الحصص المستثناة
  preferredPeriods: number[];       // الحصص المفضلة (أولوية)
  enableDoublePeriods: boolean;     // تتابع الحصص (حصتين متتاليتين)
}

export interface TeacherConstraint {
  teacherId: string;
  maxConsecutive: number;           // الحد الأقصى للتتابع (default: 4)
  excludedSlots: Record<string, number[]>; // يوم → أرقام الحصص المستثناة { 'الأحد': [1,7], 'الإثنين': [7] }
  dailyLimits?: Record<string, {
    min: number;
    max: number;
    windowStart?: number; // بداية النافذة الزمنية (مثلاً: 1)
    windowEnd?: number;   // نهاية النافذة الزمنية (مثلاً: 5)
  }>;
  maxLastPeriods?: number;          // الحد الأقصى للحصص الأخيرة أسبوعياً
  maxFirstPeriods?: number;         // الحد الأقصى للحصص الأولى أسبوعياً
  earlyExit?: Record<string, number>; // يوم → آخر حصة مسموحة (الخروج المبكر)
  earlyExitMode?: 'manual' | 'auto';  // نمط الخروج المبكر: يدوي أو تلقائي
}

export interface SpecializedMeeting {
  id: string;
  specializationId: string;
  day: string;                      // اليوم
  period: number;                   // رقم الحصة
  teacherIds: string[];             // المعلمون المشاركون
}

export interface SubstitutionConfig {
  method: 'auto' | 'fixed' | 'manual';
  maxTotalQuota: number;            // الحد الأقصى للنصاب (أساسي + انتظار) - default: 24
  maxDailyTotal: number;            // الحد الأقصى اليومي (أساسي + انتظار) - default: 5
  fixedPerPeriod?: number;          // عدد المنتظرين لكل حصة (في الطريقة المحددة)
}

export interface TimetableSlot {
  teacherId: string;
  subjectId?: string;
  classId?: string;
  type: 'lesson' | 'waiting';
}

export type TimetableData = Record<string, TimetableSlot>;

export interface ScheduleSettingsData {
  subjectConstraints: SubjectConstraint[];
  teacherConstraints: TeacherConstraint[];
  meetings: SpecializedMeeting[];
  substitution: SubstitutionConfig;
  timetable?: TimetableData;
}


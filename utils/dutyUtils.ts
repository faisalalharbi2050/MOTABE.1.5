/**
 * Daily Duty Utility Functions
 * محرك الإسناد الذكي للمناوبة اليومية
 */

import {
  Teacher,
  Admin,
  SchoolInfo,
  TimingConfig,
  ScheduleSettingsData,
  TimetableData,
  DutyStaffExclusion,
  DutyDayAssignment,
  DutyStaffAssignment,
  DutyScheduleData,
  DutySettings,
  DutyReportRecord,
  Phase,
} from '../types';

// ===== Constants =====
export const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'] as const;
export const DAY_NAMES: Record<string, string> = {
  sunday: 'الأحد',
  monday: 'الإثنين',
  tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء',
  thursday: 'الخميس',
};

// ===== Timing Integration =====
export function getTimingConfig(schoolInfo: SchoolInfo): TimingConfig {
  return schoolInfo.timing || {
    activeDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
    periodDuration: 45,
    assemblyTime: '06:45',
    breaks: [],
    prayers: [],
    periodCounts: { sunday: 7, monday: 7, tuesday: 7, wednesday: 7, thursday: 7 },
  };
}

export function hasDutyTimingData(schoolInfo: SchoolInfo): boolean {
  const timing = schoolInfo.timing;
  if (!timing) return false;
  return Boolean(timing.periodCounts);
}

// ===== Staff Management =====

/**
 * Check if admin count (مساعد إداري etc) >= 5
 * to suggest excluding teachers from duty
 */
export function canSuggestExcludeTeachers(admins: Admin[]): boolean {
  const adminAssistants = admins.filter(a => getEligibleDutyAdminRoles().includes(a.role || ''));
  return adminAssistants.length >= 5;
}

/**
 * Get list of available staff (teachers + admins) for duty
 * Excludes vice principals and guards based on settings
 */
export function getAvailableStaffForDuty(
  teachers: Teacher[],
  admins: Admin[],
  exclusions: DutyStaffExclusion[],
  settings: DutySettings
): { id: string; name: string; type: 'teacher' | 'admin'; role?: string; phone?: string }[] {
  const excluded = new Set(exclusions.filter(e => e.isExcluded).map(e => e.staffId));
  const staff: { id: string; name: string; type: 'teacher' | 'admin'; role?: string; phone?: string }[] = [];

  // Add teachers if not automatically excluded by "autoExcludeTeachersWhen5Admins" (unless they are specifically chosen)
  // Or just rely on settings.
  const excludeAllTeachers = settings.autoExcludeTeachersWhen5Admins && canSuggestExcludeTeachers(admins);

  if (!excludeAllTeachers) {
    teachers.forEach(t => {
      if (!excluded.has(t.id)) {
        staff.push({ id: t.id, name: t.name, type: 'teacher', phone: t.phone });
      }
    });
  }

  // Add admins
  const vpRoles = ['وكيل', 'وكيلة', 'وكيل الشؤون التعليمية', 'وكيل الشؤون المدرسية'];
  const guardRoles = ['حارس', 'حارسة'];
  
  admins.forEach(a => {
    if (excluded.has(a.id)) return;
    if (settings.excludeVicePrincipals && vpRoles.some(r => a.role?.includes(r))) return;
    if (settings.excludeGuards && guardRoles.some(r => a.role?.includes(r))) return;
    
    staff.push({ id: a.id, name: a.name, type: 'admin', role: a.role, phone: a.phone });
  });

  return staff;
}

/**
 * Get admin staff eligible for Duty
 */
export function getEligibleDutyAdminRoles(): string[] {
  return ['موجه طلابي', 'رائد نشاط', 'محضر مختبر', 'مساعد إداري'];
}

// ===== Smart Auto-Assignment Engine =====

interface DutyStaffScore {
  staffId: string;
  staffName: string;
  staffType: 'teacher' | 'admin';
  phone?: string;
  day: string;
  score: number; // higher = better candidate
  reasons: string[];
  lastPeriod?: number; 
}

/**
 * Calculate suggested number of duty officers per day
 */
export function getSuggestedDutyCountPerDay(
  availableStaffCount: number,
  activeDaysCount: number = 5
): number {
  if (activeDaysCount === 0) return 0;
  return Math.ceil(availableStaffCount / activeDaysCount);
}

/**
 * Golden Rule Check: Each staff assigned evenly
 */
export function validateDutyGoldenRule(assignments: DutyDayAssignment[]): {
  valid: boolean;
  duplicates: { staffId: string; staffName: string; days: string[] }[];
} {
  const staffDays: Record<string, { name: string; days: string[] }> = {};

  assignments.forEach(da => {
    da.staffAssignments.forEach(sa => {
      if (!staffDays[sa.staffId]) {
        staffDays[sa.staffId] = { name: sa.staffName, days: [] };
      }
      staffDays[sa.staffId].days.push(da.day);
    });
  });

  const duplicates = Object.entries(staffDays)
    .filter(([_, v]) => v.days.length > 1)
    .map(([id, v]) => ({ staffId: id, staffName: v.name, days: v.days }));

  return { valid: duplicates.length === 0, duplicates };
}

/**
 * Detect Early Exit Cases
 */
export function getEarlyExitStaff(
  timetable: TimetableData, 
  teachers: Teacher[], 
  timing: TimingConfig
): { staffId: string; maxPeriodAcrossWeek: number }[] {
  const result: { staffId: string; maxPeriodAcrossWeek: number }[] = [];
  const activeDays = timing.activeDays || DAYS.slice();
  
  teachers.forEach(teacher => {
    let maxPeriod = 0;
    activeDays.forEach(day => {
      const dayMaxPeriod = timing.periodCounts?.[day] || 7;
      for (let p = 1; p <= dayMaxPeriod; p++) {
        const key = `${teacher.id}-${day}-${p}`;
        if (timetable[key]) {
          if (p > maxPeriod) maxPeriod = p;
        }
      }
    });
    
    // Check if the overall max period is significantly earlier than typical end
    const generalMaxPeriod = Math.max(...Object.values(timing.periodCounts || { sunday: 7 }));
    if (maxPeriod > 0 && maxPeriod < generalMaxPeriod - 1) { // Finish 2+ periods early everyday
      result.push({ staffId: teacher.id, maxPeriodAcrossWeek: maxPeriod });
    }
  });
  
  return result;
}

/**
 * Smart Assignment Algorithm for Daily Duty
 * Ranks staff based on:
 * 1. Has class in the final period of that day (HUGE PLUS for duty fairness)
 */
export function generateSmartDutyAssignment(
  teachers: Teacher[],
  admins: Admin[],
  exclusions: DutyStaffExclusion[],
  settings: DutySettings,
  scheduleSettings: ScheduleSettingsData,
  schoolInfo: SchoolInfo,
  countPerDay?: number
): { assignments: DutyDayAssignment[]; alerts: string[] } {
  const timing = getTimingConfig(schoolInfo);
  const activeDays = timing.activeDays || DAYS.slice();
  const availableStaff = getAvailableStaffForDuty(teachers, admins, exclusions, settings);
  const staffPerDay = countPerDay || getSuggestedDutyCountPerDay(availableStaff.length, activeDays.length);
  const timetable = scheduleSettings.timetable || {};
  const alerts: string[] = [];

  // Check early exit alerts
  const earlyExitStaff = getEarlyExitStaff(timetable, teachers, timing);
  earlyExitStaff.forEach(info => {
    const teacher = teachers.find(t => t.id === info.staffId);
    if (teacher && !exclusions.find(e => e.staffId === teacher.id && e.isExcluded)) {
      alerts.push(`المعلم ${teacher.name} ينتهي جدوله مبكراً جداً طوال الأسبوع (أقصى حصة له هي ${info.maxPeriodAcrossWeek}). يوصى بمراجعة إسناده يدوياً.`);
    }
  });

  const allScores: DutyStaffScore[] = [];

  availableStaff.forEach(staff => {
    activeDays.forEach(day => {
      let score = 0;
      const reasons: string[] = [];
      const dayMaxPeriod = timing.periodCounts?.[day] || 7;
      let lastPeriodForStaff = 0;

      if (staff.type === 'teacher') {
        let hasClassInLastPeriod = false;
        
        for (let p = 1; p <= dayMaxPeriod; p++) {
          const key = `${staff.id}-${day}-${p}`;
          if (timetable[key]) {
            lastPeriodForStaff = p;
          }
        }

        if (lastPeriodForStaff === dayMaxPeriod) {
          hasClassInLastPeriod = true;
          score += 100; // Prioritize those who stay till the end naturally
          reasons.push(`ينتهي جدوله في الحصة الأخيرة (${dayMaxPeriod})`);
        } else if (lastPeriodForStaff === dayMaxPeriod - 1) {
          score += 50; 
          reasons.push(`ينتهي جدوله متأخراً (الحصة ${lastPeriodForStaff})`);
        } else if (lastPeriodForStaff > 0) {
          score += 10;
          reasons.push(`ينتهي مبكراً جداً في هذا اليوم (الحصة ${lastPeriodForStaff})`);
        } else {
          score += 5; 
          reasons.push(`ليس لديه حصص هذا اليوم`);
        }
      } else {
        // Admins are highly favored since they are always there till the end
        score += 80;
        reasons.push('إداري متواجد لنهاية الدوام');
        lastPeriodForStaff = dayMaxPeriod;
      }

      allScores.push({
        staffId: staff.id,
        staffName: staff.name,
        staffType: staff.type,
        phone: staff.phone,
        day,
        score,
        reasons,
        lastPeriod: lastPeriodForStaff
      });
    });
  });

  const dailyQuotas: Record<string, number> = {};
  activeDays.forEach(day => {
     dailyQuotas[day] = staffPerDay;
  });

  const assigned = new Set<string>();
  const dayAssignments: DutyDayAssignment[] = activeDays.map(day => ({
    day,
    staffAssignments: []
  }));

  const sortedScores = allScores.sort((a, b) => b.score - a.score);

  // Distribute based on score
  for (const scoreObj of sortedScores) {
    if (assigned.has(scoreObj.staffId)) continue; 
    if (dailyQuotas[scoreObj.day] <= 0) continue; 
    
    assigned.add(scoreObj.staffId);
    dailyQuotas[scoreObj.day]--;
    
    const targetDay = dayAssignments.find(d => d.day === scoreObj.day)!;
    targetDay.staffAssignments.push({
      staffId: scoreObj.staffId,
      staffName: scoreObj.staffName,
      staffType: scoreObj.staffType,
      lastPeriod: scoreObj.lastPeriod,
      isManual: false
    });
  }

  return { assignments: dayAssignments, alerts };
}

// ===== Default Data =====
export function getDefaultDutyData(schoolInfo: SchoolInfo): DutyScheduleData {
  return {
    exclusions: [],
    dayAssignments: [],
    reports: [],
    settings: {
      autoExcludeTeachersWhen5Admins: false,
      excludeVicePrincipals: true,
      excludeGuards: true,
      enableAutoAssignment: true,
      sharedSchoolMode: 'unified',
      suggestedCountPerDay: 1,
      reminderMessageTemplate: '',
      assignmentMessageTemplate: '',
      reminderSendTime: '07:00',
      autoSendLinks: false,
    },
    isApproved: false,
  };
}

export function generateDutyAssignmentMessage(
  staffName: string,
  staffType: 'teacher' | 'admin',
  day: string,
  dateFormatted: string,
  gender: 'بنين' | 'بنات' = 'بنين'
): string {
  const isTeacher = staffType === 'teacher';
  const roleName = isTeacher 
    ? (gender === 'بنين' ? 'المعلم الفاضل' : 'المعلمة الفاضلة')
    : (gender === 'بنين' ? 'الإداري الفاضل' : 'الإدارية الفاضلة');
  
  return `${roleName}/ ${staffName}، نشعركم بإسناد مهمة المناوبة اليومية في يوم ${DAY_NAMES[day] || day} الموافق ${dateFormatted}، نسأل الله لكم العون والتوفيق.`;
}

export function generateDutyReminderMessage(
  staffName: string,
  staffType: 'teacher' | 'admin',
  day: string,
  dateFormatted: string,
  gender: 'بنين' | 'بنات' = 'بنين'
): string {
  const isTeacher = staffType === 'teacher';
  const roleName = isTeacher 
    ? (gender === 'بنين' ? 'المعلم الفاضل' : 'المعلمة الفاضلة')
    : (gender === 'بنين' ? 'الإداري الفاضل' : 'الإدارية الفاضلة');
    
  // Link to be appended later or inserted here
  return `${roleName}/ ${staffName} نذكركم بموعد المناوبة اليومية لهذا اليوم (${DAY_NAMES[day] || day}) الموافق ${dateFormatted}، شاكرين تعاونكم.`;
}

export function getDutyBalanceInfo(dayAssignments: DutyDayAssignment[]): {
  isBalanced: boolean;
  min: number;
  max: number;
  counts: Record<string, number>;
} {
  const counts: Record<string, number> = {};
  dayAssignments.forEach(da => {
    da.staffAssignments.forEach(sa => {
       counts[sa.staffId] = (counts[sa.staffId] || 0) + 1;
    });
  });

  const values = Object.values(counts);
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  return {
    isBalanced: max - min <= 1,
    min,
    max,
    counts,
  };
}

// ===== Reporting & Stats =====
export function getTodayDutyReports(
  reports: DutyReportRecord[],
  date: string
): DutyReportRecord[] {
  return reports.filter(r => r.date === date);
}

export function getDutyStats(
  reports: DutyReportRecord[],
  dateRange?: { start: string; end: string }
): {
  total: number;
  present: number;
  absent: number;
  excused: number;
  withdrawn: number;
  late: number;
  submitted: number;
} {
  let filtered = reports;
  if (dateRange) {
    filtered = reports.filter(r => r.date >= dateRange.start && r.date <= dateRange.end);
  }
  return {
    total: filtered.length,
    present: filtered.filter(r => r.status === 'present').length,
    absent: filtered.filter(r => r.status === 'absent').length,
    excused: filtered.filter(r => r.status === 'excused').length,
    withdrawn: filtered.filter(r => r.status === 'withdrawn').length,
    late: filtered.filter(r => r.status === 'late').length,
    submitted: filtered.filter(r => r.isSubmitted).length,
  };
}

// ===== Print/Export Helpers =====
export function getDutyPrintData(
  data: DutyScheduleData,
  schoolInfo: SchoolInfo
): {
  title: string;
  schoolName: string;
  semester: string;
  days: {
    dayName: string;
    supervisors: { name: string; type: string; lastPeriod?: number; signature: string }[];
  }[];
  footerText: string;
} {
  const activeDays = getTimingConfig(schoolInfo).activeDays || DAYS.slice();

  return {
    title: 'جدول المناوبة اليومية',
    schoolName: schoolInfo.schoolName,
    semester: schoolInfo.semesters?.find(s => s.id === schoolInfo.currentSemesterId)?.name || 'الفصل الدراسي',
    days: activeDays.map(day => {
      const da = data.dayAssignments.find(d => d.day === day);
      return {
        dayName: DAY_NAMES[day],
        supervisors: (da?.staffAssignments || []).map(sa => ({
           name: sa.staffName,
           type: sa.staffType === 'teacher' ? 'معلم' : 'إداري',
           lastPeriod: sa.lastPeriod,
           signature: '',
        })),
      };
    }),
    footerText: data.footerText || `يبدأ العمل بهذا الجدول من يوم ${DAY_NAMES[activeDays[0]]} الموافق ${data.effectiveDate || '___/___/______'}`,
  };
}

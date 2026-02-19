import React, { useState, useMemo } from 'react';
import { Settings, BookOpen, Users, Clock, AlertTriangle, Info } from 'lucide-react';
import { Subject, Teacher, Specialization, SchoolInfo, ClassInfo, ScheduleSettingsData } from '../../types';
import { validateAllConstraints } from '../../utils/scheduleConstraints';
import SubstitutionTab from './SubstitutionTab';

interface Props {
  subjects: Subject[];
  teachers: Teacher[];
  specializations: Specialization[];
  schoolInfo: SchoolInfo;
  classes: ClassInfo[];
  gradeSubjectMap: Record<string, string[]>;
  scheduleSettings: ScheduleSettingsData;
  setScheduleSettings: React.Dispatch<React.SetStateAction<ScheduleSettingsData>>;
}

export default function ScheduleSettingsPage({
  subjects, teachers, specializations, schoolInfo,
  classes, gradeSubjectMap, scheduleSettings, setScheduleSettings
}: Props) {
  const [activeTab, setActiveTab] = useState<'substitution'>('substitution');

  const weekDays = schoolInfo.timing?.activeDays?.length || 5;
  const periodsPerDay = Math.max(...Object.values(schoolInfo.timing?.periodCounts || { 'default': 7 }));
  const activeDays = schoolInfo.timing?.activeDays || ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  const warnings = useMemo(() =>
    validateAllConstraints(scheduleSettings, subjects, teachers, weekDays, periodsPerDay, activeDays, classes.length),
    [scheduleSettings, subjects, teachers, weekDays, periodsPerDay, activeDays, classes.length]
  );

  const errorCount = warnings.filter(w => w.level === 'error').length;
  const warningCount = warnings.filter(w => w.level === 'warning').length;

  const tabs = [
    { id: 'substitution' as const, label: 'إعدادات الانتظار', icon: Clock, gradient: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* ─── Header ─── */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-bl from-primary/5 via-white to-indigo-50/30 border border-slate-100 shadow-xl shadow-indigo-100/10 p-6">
        <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-x-16 -translate-y-16 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-400/10 to-transparent rounded-full translate-x-8 translate-y-8 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 rotate-3">
              <Settings className="text-white" size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight">إعدادات الجدول</h1>
              <p className="text-sm text-slate-500 font-medium mt-0.5">
                تخصيص قيود المواد والمعلمين وإعدادات الانتظار
              </p>
            </div>
          </div>
          {(errorCount > 0 || warningCount > 0) && (
            <div className="flex gap-2">
              {errorCount > 0 && (
                <span className="px-3.5 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black flex items-center gap-1.5 ring-1 ring-red-100 shadow-md shadow-red-100/30">
                  <AlertTriangle size={14} /> {errorCount} خطأ
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-3.5 py-2 bg-amber-50 text-amber-600 rounded-xl text-xs font-black flex items-center gap-1.5 ring-1 ring-amber-100 shadow-md shadow-amber-100/30">
                  <Info size={14} /> {warningCount} تنبيه
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex gap-2 bg-slate-50/80 p-2 rounded-2xl border border-slate-100 shadow-inner">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${
              activeTab === tab.id
                ? 'bg-white text-slate-800 shadow-lg shadow-slate-200/50 ring-1 ring-slate-100 scale-[1.01]'
                : 'text-slate-400 hover:text-slate-600 hover:bg-white/40'
            }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 ${
              activeTab === tab.id ? `bg-gradient-to-br ${tab.gradient} shadow-md` : 'bg-slate-200/60'
            }`}>
              <tab.icon size={14} className={activeTab === tab.id ? 'text-white' : 'text-slate-400'} />
            </div>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Global Warnings ─── */}
      {warnings.filter(w => w.id === 'general-overload').map(w => (
        <div key={w.id} className="relative">
          <div className="absolute -inset-1 bg-red-400/10 rounded-[2rem] blur-xl" />
          <div className="relative bg-red-50/80 border-2 border-red-200/60 rounded-2xl p-5 flex items-start gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={22} />
            <div>
              <p className="font-black text-red-700">{w.message}</p>
              {w.suggestion && <p className="text-xs text-red-500 mt-1">{w.suggestion}</p>}
            </div>
          </div>
        </div>
      ))}

      {/* ─── Tab Content ─── */}
      {/* ─── Tab Content ─── */}

      {activeTab === 'substitution' && (
        <SubstitutionTab
          teachers={teachers}
          config={scheduleSettings.substitution}
          weekDays={weekDays}
          periodsPerDay={periodsPerDay}
          warnings={warnings}
          onChange={s => setScheduleSettings(prev => ({ ...prev, substitution: s }))}
        />
      )}
    </div>
  );
}

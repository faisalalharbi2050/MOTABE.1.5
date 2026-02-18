import React, { useState, useMemo } from 'react';
import { Teacher, Specialization, TeacherConstraint, SpecializedMeeting, ClassInfo } from '../../types';
import { Users, Plus, X, Shield, Calendar, AlertTriangle, Ban, ChevronDown, Check, Copy, Clock, ArrowRightFromLine, ArrowLeftFromLine, Sliders, Repeat, Sparkles, BarChart3, Edit3 } from 'lucide-react';
import { ValidationWarning } from '../../utils/scheduleConstraints';

const DAYS_DEFAULT = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

interface Props {
  teachers: Teacher[];
  specializations: Specialization[];
  constraints: TeacherConstraint[];
  meetings: SpecializedMeeting[];
  activeDays: string[];
  periodsPerDay: number;
  warnings: ValidationWarning[];
  classes: ClassInfo[];
  onChangeConstraints: (c: TeacherConstraint[]) => void;
  onChangeMeetings: (m: SpecializedMeeting[]) => void;
}

export default function TeacherSettingsTab({
  teachers, specializations, constraints, meetings, activeDays, periodsPerDay,
  warnings, classes, onChangeConstraints, onChangeMeetings
}: Props) {
  const getDayName = (d: string) => {
    switch(d?.toLowerCase()) {
        case 'sunday': return 'الأحد';
        case 'monday': return 'الإثنين';
        case 'tuesday': return 'الثلاثاء';
        case 'wednesday': return 'الأربعاء';
        case 'thursday': return 'الخميس';
        case 'friday': return 'الجمعة';
        case 'saturday': return 'السبت';
        default: return d;
    }
  };

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'alphabetical' | 'specialization'>('alphabetical');
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ specId: '', day: DAYS_DEFAULT[0], period: 1 });
  
  // Copy Modal State
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [copyTargets, setCopyTargets] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1);
  const days = activeDays.length > 0 ? activeDays : DAYS_DEFAULT;

  const getConstraint = (id: string): TeacherConstraint => {
    return constraints.find(c => c.teacherId === id) || { teacherId: id, maxConsecutive: 4, excludedSlots: {} };
  };

  const updateConstraint = (teacherId: string, updates: Partial<TeacherConstraint>) => {
    const existing = constraints.find(c => c.teacherId === teacherId);
    if (existing) {
      onChangeConstraints(constraints.map(c => c.teacherId === teacherId ? { ...c, ...updates } : c));
    } else {
      onChangeConstraints([...constraints, { teacherId, maxConsecutive: 4, excludedSlots: {}, ...updates }]);
    }
  };

  const handleCopyConstraints = () => {
      if (!selectedId || copyTargets.length === 0) return;
      
      const sourceConstraint = getConstraint(selectedId);
      
      const newConstraints = [...constraints];
      
      copyTargets.forEach(targetId => {
          const targetIndex = newConstraints.findIndex(c => c.teacherId === targetId);
          const newConstraint = {
              ...sourceConstraint,
              teacherId: targetId
          };
          
          if (targetIndex >= 0) {
              newConstraints[targetIndex] = newConstraint;
          } else {
              newConstraints.push(newConstraint);
          }
      });
      
      onChangeConstraints(newConstraints);
      setShowCopyModal(false);
      setCopyTargets([]);
      alert('تم نسخ الإعدادات بنجاح');
  };

  const copyDaySettingsToAll = (teacherId: string, sourceDay: string) => {
      const constraint = getConstraint(teacherId);
      const sourceLimits = constraint.dailyLimits?.[sourceDay];
      
      if (!sourceLimits) return;

      const newLimits = { ...(constraint.dailyLimits || {}) };
      
      days.forEach(day => {
          if (day !== sourceDay) {
              newLimits[day] = { ...sourceLimits };
          }
      });

      updateConstraint(teacherId, { dailyLimits: newLimits });
  };

  const toggleSlot = (teacherId: string, day: string, period: number) => {
    const constraint = getConstraint(teacherId);
    const slots = { ...(constraint.excludedSlots || {}) };
    const daySlots = [...(slots[day] || [])];
    slots[day] = daySlots.includes(period) ? daySlots.filter(p => p !== period) : [...daySlots, period];
    updateConstraint(teacherId, { excludedSlots: slots });
  };

  const toggleEntireDay = (teacherId: string, day: string) => {
    const constraint = getConstraint(teacherId);
    const slots = { ...(constraint.excludedSlots || {}) };
    const daySlots = slots[day] || [];
    // If all periods are excluded, clear them. Otherwise, exclude all.
    slots[day] = daySlots.length === periodsPerDay ? [] : [...periods];
    updateConstraint(teacherId, { excludedSlots: slots });
  };

  const toggleEntirePeriod = (teacherId: string, period: number) => {
    const constraint = getConstraint(teacherId);
    const slots = { ...(constraint.excludedSlots || {}) };
    const allHave = days.every(d => (slots[d] || []).includes(period));
    for (const d of days) {
      const ds = [...(slots[d] || [])];
      slots[d] = allHave ? ds.filter(p => p !== period) : (ds.includes(period) ? ds : [...ds, period]);
    }
    updateConstraint(teacherId, { excludedSlots: slots });
  };

  const updateDailyLimit = (teacherId: string, day: string, field: 'min' | 'max' | 'windowStart' | 'windowEnd', value: string) => {
    const constraint = getConstraint(teacherId);
    const limits = { ...(constraint.dailyLimits || {}) };
    const current = limits[day] || { min: 0, max: periodsPerDay, windowStart: 1, windowEnd: periodsPerDay };
    
    const val = value === '' ? undefined : Number(value);
    
    // Logic to handle defaults if value is cleared
    let newVal = val;
    if (val === undefined) {
         if (field === 'min') newVal = 0;
         if (field === 'max') newVal = periodsPerDay;
         if (field === 'windowStart') newVal = 1;
         if (field === 'windowEnd') newVal = periodsPerDay;
    }

    limits[day] = { ...current, [field]: newVal };
    updateConstraint(teacherId, { dailyLimits: limits });
  };
  
  const setEarlyExitMode = (teacherId: string, mode: 'manual' | 'auto') => {
      const constraint = getConstraint(teacherId);
      // When switching, try to preserve the period logic if possible
      // If switching to Auto, we keep the period but ignore the day (conceptually)
      // If switching to Manual, we might default to the first day if previously auto
      updateConstraint(teacherId, { earlyExitMode: mode });
  };

  const setEarlyExitDay = (teacherId: string, day: string | null, period: number | null) => {
      const constraint = getConstraint(teacherId);
      const isAuto = constraint.earlyExitMode === 'auto';
      
      // If day is empty and not auto, clear early exit
      if (!day && !isAuto) {
          updateConstraint(teacherId, { earlyExit: {} });
          return;
      }
      
      // If Auto, we use a placeholder day (first active day usually) just to store the period value
      const targetDay = isAuto ? (days[0] || 'any') : day!;
      
      const newEarlyExit = { [targetDay]: period || periodsPerDay - 1 }; 
      updateConstraint(teacherId, { earlyExit: newEarlyExit });
  };

  const addMeeting = () => {
    if (!meetingForm.specId) return;
    const specTeachers = teachers.filter(t => t.specializationId === meetingForm.specId);
    onChangeMeetings([...meetings, {
      id: `meeting-${Date.now()}`, specializationId: meetingForm.specId,
      day: meetingForm.day, period: meetingForm.period, teacherIds: specTeachers.map(t => t.id)
    }]);
    setShowAddMeeting(false);
    setMeetingForm({ specId: '', day: DAYS_DEFAULT[0], period: 1 });
  };

  // Bulk Edit First/Last State
  const [showBulkModal, setShowBulkModal] = useState<'first' | 'last' | null>(null);
  const [bulkValue, setBulkValue] = useState<number>(5);
  // Re-use copyTargets for bulk selection

  // Statistics & Recommendations
  const stats = useMemo(() => {
     const totalClasses = classes.length;
     const daysCount = days.length;
     const neededSlots = totalClasses * daysCount; // Total specific slots needed per week (e.g. 1st periods)
     
     // Capacity
     const currentCapFirst = constraints.reduce((sum, c) => sum + (c.maxFirstPeriods ?? daysCount), 0) 
                           + teachers.filter(t => !constraints.find(c => c.teacherId === t.id)).length * daysCount;
                           
     const currentCapLast = constraints.reduce((sum, c) => sum + (c.maxLastPeriods ?? daysCount), 0)
                          + teachers.filter(t => !constraints.find(c => c.teacherId === t.id)).length * daysCount;

     const activeTeachersCount = teachers.length || 1;
     const recommendedMin = Math.ceil(neededSlots / activeTeachersCount);
     
     return { neededSlots, currentCapFirst, currentCapLast, recommendedMin, totalClasses };
  }, [classes.length, days.length, constraints, teachers]);

  const handleBulkApply = () => {
      if (!showBulkModal || copyTargets.length === 0) return;
      
      const newConstraints = [...constraints];
      const field = showBulkModal === 'first' ? 'maxFirstPeriods' : 'maxLastPeriods';
      
      copyTargets.forEach(targetId => {
          const index = newConstraints.findIndex(c => c.teacherId === targetId);
          if (index >= 0) {
              newConstraints[index] = { ...newConstraints[index], [field]: bulkValue };
          } else {
              newConstraints.push({ 
                  teacherId: targetId, maxConsecutive: 4, excludedSlots: {}, 
                  [field]: bulkValue 
              });
          }
      });
      
      onChangeConstraints(newConstraints);
      setShowBulkModal(null);
      setCopyTargets([]);
      setBulkValue(5);
  };
  
  const openBulkModal = (type: 'first' | 'last') => {
      setCopyTargets([]); // Clear previous
      setBulkValue(stats.recommendedMin); // Suggest the recommended value
      setShowBulkModal(type);
  };

  const selectedTeacher = teachers.find(t => t.id === selectedId);
  const selectedConstraint = selectedId ? getConstraint(selectedId) : null;
  const selectedWarnings = selectedId ? warnings.filter(w => w.relatedId === selectedId) : [];

  // Filter for Copy Modal
  const teachersForCopy = useMemo(() => {
      return teachers.filter(t => t.id !== selectedId && t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [teachers, selectedId, searchTerm]);

  // Derived state for Early Exit UI (Single Day)
  const currentEarlyExitDay = selectedConstraint?.earlyExit ? Object.keys(selectedConstraint.earlyExit)[0] || '' : '';
  const currentEarlyExitPeriod = currentEarlyExitDay && selectedConstraint?.earlyExit ? selectedConstraint.earlyExit[currentEarlyExitDay] : '';

  return (
    <div className="space-y-6">
      {/* ─── توضيح ─── */}
      <div className="bg-gradient-to-l from-blue-50/60 to-indigo-50/40 rounded-2xl p-5 border border-blue-100/50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Shield size={16} className="text-white" />
          </div>
          <h3 className="font-black text-slate-700 text-sm">ملاحظة عن قيود المعلمين</h3>
        </div>
        <p className="text-[12px] text-slate-600 leading-relaxed">
          جميع المعلمين لديهم حد تتابع تلقائي (4 حصص متتالية كحد أقصى). يمكنك تخصيص قيود إضافية لكل معلم من القائمة.
        </p>
      </div>

      {/* ─── المحتوى الرئيسي: القائمة الجانبية + التخصيص ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          {/* ─── القائمة الجانبية اليمنى ─── */}
          <div className="w-full md:w-64 border-l border-slate-100 bg-slate-50/40 flex flex-col shrink-0">
             <div className="p-3 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                <input 
                    type="text" 
                    placeholder="بحث عن معلم..." 
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:border-primary outline-none mb-2"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <div className="flex gap-1">
                    <button 
                        onClick={() => setSortBy('alphabetical')}
                        className={`flex-1 text-[10px] py-1.5 rounded-md font-bold transition-all ${sortBy === 'alphabetical' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        ترتيب أبجدي
                    </button>
                    <button 
                        onClick={() => setSortBy('specialization')}
                        className={`flex-1 text-[10px] py-1.5 rounded-md font-bold transition-all ${sortBy === 'specialization' ? 'bg-primary text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        حسب التخصص
                    </button>
                </div>
             </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5 max-h-[500px]">
              {teachers
                .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .sort((a, b) => {
                    if (sortBy === 'alphabetical') {
                        return a.name.localeCompare(b.name, 'ar');
                    } else {
                        const specA = specializations.find(s => s.id === a.specializationId)?.name || '';
                        const specB = specializations.find(s => s.id === b.specializationId)?.name || '';
                        return specA.localeCompare(specB, 'ar') || a.name.localeCompare(b.name, 'ar');
                    }
                })
                .map(teacher => {
                const isSelected = selectedId === teacher.id;
                const hasConstraint = constraints.some(c => c.teacherId === teacher.id);
                // Simple count of potential complexities
                const constraintObj = hasConstraint ? getConstraint(teacher.id) : null;
                const totalExcluded = constraintObj ? Object.values(constraintObj.excludedSlots).flat().length : 0;
                const hasAdvanced = constraintObj && (
                    Object.keys(constraintObj.earlyExit || {}).length > 0 || 
                    constraintObj.maxFirstPeriods !== undefined || 
                    constraintObj.maxLastPeriods !== undefined
                );

                const hasError = warnings.some(w => w.relatedId === teacher.id && w.level === 'error');
                return (
                  <button key={teacher.id} onClick={() => setSelectedId(teacher.id)}
                    className={`w-full text-right px-3 py-3 rounded-xl transition-all duration-200 flex items-center gap-2.5 group ${
                      isSelected ? 'bg-gradient-to-l from-primary/10 to-blue-50 ring-2 ring-primary/20 shadow-md' : 'hover:bg-white hover:shadow-sm'
                    }`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-colors ${
                      isSelected ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                    }`}>
                      {teacher.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-slate-700 truncate">{teacher.name}</div>
                      <div className="text-[10px] text-slate-400 flex flex-wrap gap-1">
                          <span>{teacher.quotaLimit} حصة</span>
                          {totalExcluded > 0 && <span className="text-red-400">• قيود</span>}
                          {hasAdvanced && <span className="text-indigo-400">• متقدم</span>}
                      </div>
                    </div>
                    {hasError && <div className="w-2 h-2 rounded-full bg-red-500 shrink-0 animate-pulse" />}
                    {!hasError && hasConstraint && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />}
                  </button>
                );
              })}
              {teachers.length === 0 && <div className="text-center py-8 text-slate-400 text-xs">لا يوجد معلمون</div>}
            </div>
          </div>

          {/* ─── منطقة التخصيص ─── */}
          <div className="flex-1 p-5 overflow-y-auto bg-white">
            {!selectedTeacher ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                     <Users size={32} className="opacity-20" />
                </div>
                <p className="font-bold text-sm">اختر معلماً من القائمة</p>
                <p className="text-xs mt-1">لعرض وتعديل إعداداته والقيود المتقدمة</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-300 slide-in-from-bottom-2">
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg text-white font-black text-xl">
                            {selectedTeacher.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-black text-xl text-slate-800">{selectedTeacher.name}</h4>
                            <div className="flex flex-wrap gap-2 mt-1.5">
                                <span className="text-[11px] bg-blue-50 text-blue-600 px-3 py-0.5 rounded-full font-bold border border-blue-100">
                                    النصاب: {selectedTeacher.quotaLimit} حصة
                                </span>
                                <span className="text-[11px] bg-slate-50 text-slate-500 px-3 py-0.5 rounded-full font-bold border border-slate-100">
                                    التخصص: {specializations.find(s=>s.id===selectedTeacher.specializationId)?.name || 'عام'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={() => { setShowCopyModal(true); setCopyTargets([]); }}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        <Copy size={14} className="animate-pulse" />
                        <span>نسخ إعدادات المعلم لآخر</span>
                    </button>
                </div>

                {/* Warnings Section */}
                {selectedWarnings.length > 0 && (
                    <div className="space-y-2">
                        {selectedWarnings.map(w => (
                        <div key={w.id} className={`rounded-xl p-3 flex items-start gap-2.5 text-xs ${w.level === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                            <AlertTriangle size={15} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block text-sm mb-0.5">{w.message}</span>
                                {w.suggestion && <span className="opacity-80 block">{w.suggestion}</span>}
                            </div>
                        </div>
                        ))}
                    </div>
                )}

                {/* حد التتابع */}
                <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100/50">
                  <div className="flex items-center gap-2 mb-3">
                      <div className="p-1.5 bg-white rounded-lg shadow-sm"><Sliders size={16} className="text-slate-400"/></div>
                      <label className="text-sm font-black text-slate-700">أقصى عدد حصص متتالية</label>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <button key={n} onClick={() => updateConstraint(selectedId!, { maxConsecutive: n })}
                        className={`w-12 h-12 rounded-xl text-sm font-black transition-all duration-200 ${
                          selectedConstraint?.maxConsecutive === n
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-200/50 scale-105 ring-2 ring-offset-2 ring-blue-200'
                            : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-blue-300 hover:text-blue-500 shadow-sm'
                        }`}>{n}</button>
                    ))}
                  </div>
                </div>

                {/* ─── جدول الحصص المستثناة ─── */}
                <div className="bg-slate-50/60 rounded-2xl p-5 border border-slate-100/50">
                  <div className="flex items-center justify-between mb-2">
                      <h5 className="text-sm font-black text-slate-700 flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm"><Ban size={16} className="text-red-400" /></div>
                        الحصص المستثناة
                      </h5>
                      <span className="text-[10px] text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">انقر للاستثناء</span>
                  </div>
                  
                  <div className="overflow-x-auto pb-1">
                    <table className="w-full separate-border-spacing">
                      <thead>
                        <tr>
                          <th className="w-20"></th>
                          {periods.map(p => (
                            <th key={p} className="text-center px-1 pb-2">
                              <button onClick={() => toggleEntirePeriod(selectedId!, p)}
                                className="text-[10px] font-black text-slate-400 hover:text-primary transition-colors">
                                {p}
                              </button>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="space-y-1">
                        {days.map(day => {
                          const daySlots = selectedConstraint?.excludedSlots[day] || [];
                          // Check for early exit on this day to visually indicate disabled slots
                          const earlyExitVal = selectedConstraint?.earlyExit?.[day];
                          
                          return (
                            <tr key={day}>
                              <td className="py-1 pl-2">
                                <button onClick={() => toggleEntireDay(selectedId!, day)}
                                  className="text-[11px] font-bold text-slate-600 hover:text-primary w-full text-right transition-colors">
                                  {getDayName(day)}
                                </button>
                              </td>
                              {periods.map(p => {
                                const isExcl = daySlots.includes(p);
                                const isBlockedByEarlyExit = earlyExitVal !== undefined && p > earlyExitVal;
                                
                                return (
                                  <td key={p} className="p-0.5 text-center">
                                    <button onClick={() => !isBlockedByEarlyExit && toggleSlot(selectedId!, day, p)}
                                      disabled={isBlockedByEarlyExit}
                                      className={`w-8 h-8 rounded-lg text-[10px] font-bold transition-all duration-150 flex items-center justify-center mx-auto ${
                                        isBlockedByEarlyExit 
                                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed border border-dashed border-slate-200' 
                                        : isExcl
                                            ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-md shadow-red-200/40 ring-1 ring-white'
                                            : 'bg-white border border-slate-200 text-slate-300 hover:border-red-300 hover:text-red-400 hover:shadow-sm'
                                      }`}>
                                      {isBlockedByEarlyExit ? '—' : isExcl ? <X size={12} strokeWidth={4} /> : ''}
                                    </button>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ─── القيود المتقدمة ─── */}
                <div className="bg-white rounded-2xl border-2 border-indigo-50 shadow-sm overflow-hidden">
                    <div className="bg-indigo-50/50 px-5 py-4 border-b border-indigo-100 flex items-center gap-2">
                        <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-600"><Clock size={18} /></div>
                        <div>
                            <h4 className="font-black text-slate-800 text-sm">قيود متقدمة</h4>
                            <p className="text-[10px] text-slate-500">الحدود اليومية، الخروج المبكر، وتوزيع الحصص</p>
                        </div>
                    </div>

                    <div className="p-5 space-y-8">
                       
                       {/* 1. First & Last Periods (Enhanced) */}
                       <div className="grid grid-cols-1 gap-6">
                           <div className="bg-emerald-50/20 p-4 rounded-2xl border border-emerald-100/50">
                               <h5 className="text-sm font-black text-slate-700 mb-4 flex items-center gap-2">
                                   <div className="p-1.5 bg-white rounded-lg shadow-sm text-emerald-500"><ArrowRightFromLine size={16} /></div>
                                   توزيع الحصص الأولى والأخيرة
                               </h5>
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           {/* Max First Periods */}
                           <div className={`p-4 rounded-xl border-2 transition-colors ${
                               stats.currentCapFirst < stats.neededSlots ? 'bg-amber-50/50 border-amber-100' : 'bg-emerald-50/30 border-slate-100'
                           }`}>
                               <div className="flex justify-between items-start mb-2">
                                   <label className="flex items-center gap-2 text-xs font-black text-slate-700">
                                      <ArrowRightFromLine size={16} className="text-emerald-500"/>
                                      الحصص الأولى (الأسبوعية)
                                   </label>
                                   <button onClick={() => openBulkModal('first')} className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-primary bg-white px-2 py-1 rounded-lg border border-slate-200 hover:border-primary/30 transition-all">
                                       <Edit3 size={10}/> تعيين لمجموعة
                                   </button>
                               </div>
                               
                               <div className="flex gap-3 items-center">
                                   <input 
                                      type="number" 
                                      min={0} max={days.length}
                                      placeholder={`موصى به: ${stats.recommendedMin}`}
                                      value={selectedConstraint?.maxFirstPeriods ?? ''}
                                      onChange={e => updateConstraint(selectedId!, { maxFirstPeriods: e.target.value ? Number(e.target.value) : undefined })}
                                      className="w-20 p-2 bg-white border border-slate-200 rounded-xl text-center text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                   />
                                   <div className="flex-1">
                                       <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                            <span>سعة المدرسة: {stats.currentCapFirst} / {stats.neededSlots}</span>
                                            {stats.currentCapFirst < stats.neededSlots && <span className="text-amber-500 font-bold flex items-center gap-1"><AlertTriangle size={10}/> عجز</span>}
                                       </div>
                                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                           <div 
                                              className={`h-full rounded-full ${stats.currentCapFirst < stats.neededSlots ? 'bg-amber-400' : 'bg-emerald-400'}`} 
                                              style={{ width: `${Math.min(100, (stats.currentCapFirst / stats.neededSlots) * 100)}%` }}
                                           />
                                       </div>
                                   </div>
                               </div>
                               <p className="text-[10px] text-slate-400 mt-2">
                                  يفضل أن يكون نصيب كل معلم {stats.recommendedMin} حصص أولى أسبوعياً.
                               </p>
                           </div>

                           {/* Max Last Periods */}
                           <div className={`p-4 rounded-xl border-2 transition-colors ${
                               stats.currentCapLast < stats.neededSlots ? 'bg-amber-50/50 border-amber-100' : 'bg-rose-50/30 border-slate-100'
                           }`}>
                               <div className="flex justify-between items-start mb-2">
                                   <label className="flex items-center gap-2 text-xs font-black text-slate-700">
                                      <ArrowLeftFromLine size={16} className="text-rose-500"/>
                                      الحصص الأخيرة (الأسبوعية)
                                   </label>
                                   <button onClick={() => openBulkModal('last')} className="text-[10px] flex items-center gap-1 text-slate-400 hover:text-primary bg-white px-2 py-1 rounded-lg border border-slate-200 hover:border-primary/30 transition-all">
                                       <Edit3 size={10}/> تعيين لمجموعة
                                   </button>
                               </div>
                               
                               <div className="flex gap-3 items-center">
                                   <input 
                                      type="number" 
                                      min={0} max={days.length}
                                      placeholder={`موصى به: ${stats.recommendedMin}`}
                                      value={selectedConstraint?.maxLastPeriods ?? ''}
                                      onChange={e => updateConstraint(selectedId!, { maxLastPeriods: e.target.value ? Number(e.target.value) : undefined })}
                                      className="w-20 p-2 bg-white border border-slate-200 rounded-xl text-center text-sm font-bold focus:ring-2 focus:ring-primary/20 outline-none"
                                   />
                                   <div className="flex-1">
                                       <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                                            <span>سعة المدرسة: {stats.currentCapLast} / {stats.neededSlots}</span>
                                            {stats.currentCapLast < stats.neededSlots && <span className="text-amber-500 font-bold flex items-center gap-1"><AlertTriangle size={10}/> عجز</span>}
                                       </div>
                                       <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                           <div 
                                              className={`h-full rounded-full ${stats.currentCapLast < stats.neededSlots ? 'bg-amber-400' : 'bg-rose-400'}`} 
                                              style={{ width: `${Math.min(100, (stats.currentCapLast / stats.neededSlots) * 100)}%` }}
                                           />
                                       </div>
                                   </div>
                               </div>
                               <p className="text-[10px] text-slate-400 mt-2">
                                  يفضل أن يكون نصيب كل معلم {stats.recommendedMin} حصص أخيرة أسبوعياً.
                               </p>
                           </div>
                               </div>
                           </div>
                       </div>
                       
                       {/* 2. Early Exit (Single Day) */}
                       <div className="bg-rose-50/50 rounded-xl p-4 border border-rose-100">
                           <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 text-xs font-black text-rose-700">
                                   <Clock size={14} className="text-rose-500"/>
                                   بطاقة الخروج المبكر
                                </label>
                               
                               {/* Mode Toggle */}
                               <div className="flex bg-white rounded-lg p-0.5 border border-rose-200 shadow-sm">
                                   <button 
                                      onClick={() => setEarlyExitMode(selectedId!, 'manual')}
                                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                          (selectedConstraint?.earlyExitMode || 'manual') === 'manual' 
                                          ? 'bg-rose-100 text-rose-700 shadow-sm' 
                                          : 'text-slate-400 hover:text-rose-500'
                                      }`}
                                   >
                                       يدوي
                                   </button>
                                   <button 
                                      onClick={() => setEarlyExitMode(selectedId!, 'auto')}
                                      className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                                          selectedConstraint?.earlyExitMode === 'auto' 
                                          ? 'bg-rose-100 text-rose-700 shadow-sm' 
                                          : 'text-slate-400 hover:text-rose-500'
                                      }`}
                                   >
                                       تلقائي
                                   </button>
                               </div>
                           </div>
                           
                           <div className="flex gap-3">
                               {/* Day Selector - Only for Manual */}
                               {(selectedConstraint?.earlyExitMode || 'manual') === 'manual' && (
                                   <div className="flex-1">
                                       <select 
                                          value={currentEarlyExitDay} 
                                          onChange={e => setEarlyExitDay(selectedId!, e.target.value, currentEarlyExitPeriod ? Number(currentEarlyExitPeriod) : null)}
                                           className="w-full p-2.5 rounded-xl border border-rose-200 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 bg-white"
                                        >
                                            <option value="">لا يوجد خروج مبكر</option>
                                            {days.map(d => <option key={d} value={d}>{getDayName(d)}</option>)}
                                        </select>
                                   </div>
                               )}

                               {/* Period Selector - Always Visible (Context changes) */}
                               <div className="flex-1">
                                   <select 
                                      disabled={selectedConstraint?.earlyExitMode === 'manual' && !currentEarlyExitDay}
                                      value={currentEarlyExitPeriod || ''}
                                      onChange={e => setEarlyExitDay(selectedId!, selectedConstraint?.earlyExitMode === 'auto' ? null : currentEarlyExitDay, Number(e.target.value))}
                                      className="w-full p-2.5 rounded-xl border border-rose-200 text-sm font-bold outline-none focus:ring-2 focus:ring-rose-200 bg-white disabled:opacity-50 disabled:bg-slate-50 disabled:border-slate-200"
                                   >
                                       <option value="">اختر وقت الخروج...</option>
                                       {periods.slice(0, -1).map(p => (
                                           <option key={p} value={p}>بعد الحصة {p}</option>
                                       ))}
                                   </select>
                               </div>
                           </div>
                           
                           <p className="text-[10px] text-rose-400 mt-2 flex items-center gap-1.5">
                               {selectedConstraint?.earlyExitMode === 'auto' ? (
                                   <>
                                     <Shield size={12} className="shrink-0"/>
                                     سيقوم النظام باختيار اليوم الأنسب للخروج المبكر تلقائياً لتقليل التعارضات.
                                   </>
                               ) : (
                                   "سيتم استبعاد الحصص بعد الوقت المحدد لهذا اليوم فقط."
                               )}
                           </p>
                       </div>

                       <div className="h-px bg-slate-100" />

                        {/* 3. Daily Limits */}
                       <div className="bg-indigo-50/30 rounded-2xl p-5 border border-indigo-100/50">
                           <h5 className="text-sm font-black text-slate-700 mb-2 flex items-center gap-2">
                               <div className="p-1.5 bg-white rounded-lg shadow-sm text-indigo-500"><Sliders size={16} /></div>
                               التوزيع المتقدم
                           </h5>
                           
                           <div className="bg-white/60 p-3 rounded-xl border border-indigo-100/40 mb-4">
                               <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                                   تخصيص توزيع الحصص على المعلمين مع إمكانية تحديد أقل عدد حصص أو أكثر عدد حصص لحصة معينة في الأسبوع.
                               </p>
                               <div className="bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-100/50">
                                   <p className="text-[10px] text-indigo-700 font-bold mb-1 flex items-center gap-1">
                                       <Sparkles size={10}/> مثال للتوضيح:
                                   </p>
                                   <p className="text-[10px] text-indigo-600/80 leading-relaxed">
                                       معلم التربية البدنية تود أن تكون حصصه في كل الأيام من الحصة الأولى إلى الخامسة ولأجل التطبيق بشكل صحيح: اختر يوم ثم اختر الحصص من الأولى إلى الخامسة ثم ضع (أقل عدد حصص: 1، أكثر عدد حصص: 1)، وعليه سيكون جدول المعلم من الأولى إلى الخامسة لكل يوم ويمكنك من نسخ هذا الترتيب لباقي الأيام.
                                   </p>
                               </div>
                           </div>
                           
                           <div className="overflow-x-auto">
                           <table className="w-full text-right">
                               <thead>
                                    <tr className="border-b border-indigo-100/50 text-[11px] text-slate-400">
                                        <th className="pb-2 font-black w-20">اليوم</th>
                                        <th className="pb-2 font-black px-4 text-center">الحصص (من - إلى)</th>
                                        <th className="pb-2 font-black px-2 text-center">أقل عدد حصص</th>
                                        <th className="pb-2 font-black px-2 text-center">أكثر عدد حصص</th>
                                        <th className="pb-2 font-black w-10 text-center">نسخ</th>
                                    </tr>
                               </thead>
                               <tbody>
                                   {days.map(day => {
                                        const limits = selectedConstraint?.dailyLimits?.[day] || { min: 0, max: periodsPerDay, windowStart: 1, windowEnd: periodsPerDay };
                                        
                                       return (
                                        <tr key={day} className="group hover:bg-white/80 transition-colors border-b border-indigo-50/50 last:border-0">
                                            <td className="py-3 text-[11px] font-black text-slate-600">{getDayName(day)}</td>
                                            
                                            {/* Window */}
                                            <td className="py-2 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="relative flex-1">
                                                        <select 
                                                            value={limits.windowStart || 1}
                                                            onChange={e => updateDailyLimit(selectedId!, day, 'windowStart', e.target.value)}
                                                            className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-black cursor-pointer hover:border-primary/30 focus:border-primary outline-none"
                                                        >
                                                            {periods.map(p => <option key={p} value={p}>{p}</option>)}
                                                        </select>
                                                        <ChevronDown size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                                                    </div>
                                                    <span className="text-slate-300">-</span>
                                                    <div className="relative flex-1">
                                                        <select 
                                                            value={limits.windowEnd || periodsPerDay}
                                                            onChange={e => updateDailyLimit(selectedId!, day, 'windowEnd', e.target.value)}
                                                            className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-black cursor-pointer hover:border-primary/30 focus:border-primary outline-none"
                                                        >
                                                            {periods.map(p => <option key={p} value={p}>{p}</option>)}
                                                        </select>
                                                        <ChevronDown size={10} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Min/Max */}
                                            <td className="py-2 px-1">
                                                <input 
                                                    type="number" min={0} max={8} 
                                                    value={limits.min || ''} 
                                                    placeholder="0"
                                                    onChange={e => updateDailyLimit(selectedId!, day, 'min', e.target.value)}
                                                    className={`w-14 mx-auto block text-center p-1.5 rounded-lg border text-xs font-black focus:ring-2 outline-none ${
                                                        (limits.min > 0) ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-500'
                                                    }`}
                                                />
                                            </td>
                                            <td className="py-2 px-1">
                                                <input 
                                                    type="number" min={0} max={8} 
                                                    value={limits.max === periodsPerDay ? '' : limits.max}
                                                    placeholder={String(periodsPerDay)}
                                                    onChange={e => updateDailyLimit(selectedId!, day, 'max', e.target.value)}
                                                    className={`w-14 mx-auto block text-center p-1.5 rounded-lg border text-xs font-black focus:ring-2 outline-none ${
                                                        (limits.max < periodsPerDay) ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-white text-slate-500'
                                                    }`}
                                                />
                                            </td>
                                            
                                            {/* Actions */}
                                            <td className="py-2 px-1 text-center">
                                                <button 
                                                    onClick={() => copyDaySettingsToAll(selectedId!, day)}
                                                    title="نسخ هذه الإعدادات لباقي الأيام"
                                                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-all"
                                                >
                                                    <Repeat size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                       )
                                   })}
                               </tbody>
                           </table>
                           </div>
                       </div>

                       {/* ─── الاجتماعات التخصصية (Restored & Repositioned) ─── */}
                       <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                          <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md">
                                <Calendar size={16} className="text-white" />
                              </div>
                              <div>
                                <h3 className="font-black text-slate-800 text-sm">الاجتماعات التخصصية</h3>
                                <p className="text-[11px] text-slate-400">يُرمز بـ "ج" في الجدول</p>
                              </div>
                            </div>
                            {!showAddMeeting && (
                              <button onClick={() => setShowAddMeeting(true)}
                                className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-l from-indigo-500 to-violet-600 text-white px-4 py-2 rounded-xl shadow-lg active:scale-95 transition-all">
                                <Plus size={14} /> اجتماع جديد
                              </button>
                            )}
                          </div>

                          {showAddMeeting && (
                            <div className="px-5 py-4 bg-indigo-50/40 border-b border-indigo-100/40">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                                <select value={meetingForm.specId} onChange={e => setMeetingForm(f => ({ ...f, specId: e.target.value }))}
                                  className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-100 font-bold">
                                  <option value="">اختر التخصص...</option>
                                  {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                                <select value={meetingForm.day} onChange={e => setMeetingForm(f => ({ ...f, day: e.target.value }))}
                                  className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-100 font-bold">
                                  {days.map(d => (
                                    <option key={d} value={d}>
                                        {getDayName(d)}
                                    </option>
                                  ))}
                                </select>
                                <select value={meetingForm.period} onChange={e => setMeetingForm(f => ({ ...f, period: Number(e.target.value) }))}
                                  className="bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-100 font-bold">
                                  {periods.map(p => <option key={p} value={p}>الحصة {p}</option>)}
                                </select>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={addMeeting} disabled={!meetingForm.specId}
                                  className="px-5 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold disabled:opacity-40 shadow-md">إضافة</button>
                                <button onClick={() => setShowAddMeeting(false)} className="px-4 py-2 text-slate-500 text-xs font-bold">إلغاء</button>
                              </div>
                            </div>
                          )}

                          <div className="p-4">
                            {meetings.length === 0 && !showAddMeeting ? (
                              <div className="text-center py-8 text-slate-400">
                                <Calendar size={32} className="mx-auto mb-2 opacity-15" />
                                <p className="font-bold text-xs">لا توجد اجتماعات تخصصية</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {meetings.map(m => {
                                  const spec = specializations.find(s => s.id === m.specializationId);
                                  
                                  return (
                                    <div key={m.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-all">
                                      <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-md">ج</div>
                                        <div>
                                          <span className="font-bold text-slate-700 text-sm">{spec?.name || 'تخصص'}</span>
                                          <span className="text-xs text-slate-400 mr-2">{getDayName(m.day)} — الحصة {m.period}</span>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">{m.teacherIds.length} معلم</span>
                                        <button onClick={() => onChangeMeetings(meetings.filter(x => x.id !== m.id))}
                                          className="w-7 h-7 text-slate-300 hover:text-red-500 rounded-lg flex items-center justify-center"><X size={14} /></button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                       </div>
                    </div>
                </div>

              </div>
            )}
          </div>
      </div>


       {/* ─── Copy Modal ─── */}
       {showCopyModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                   <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <Copy size={16} className="text-primary"/> نسخ إعدادات: {selectedTeacher?.name}
                       </h3>
                       <button onClick={() => setShowCopyModal(false)}><X className="text-slate-400 hover:text-red-500" size={20}/></button>
                   </div>
                   
                   <div className="p-4 max-h-[400px] overflow-y-auto">
                        <p className="text-xs text-slate-500 mb-3">اختر المعلمين الذين تريد تطبيق نفس القيود عليهم:</p>
                        
                        <div className="space-y-1">
                            {teachersForCopy.map(t => (
                                <label key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-100 cursor-pointer transition-all">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        copyTargets.includes(t.id) ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
                                    }`}>
                                        {copyTargets.includes(t.id) && <Check size={12} strokeWidth={3}/>}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={copyTargets.includes(t.id)} 
                                        onChange={() => setCopyTargets(prev => prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id])}
                                    />
                                    <span className="text-sm font-bold text-slate-700">{t.name}</span>
                                    <span className="text-[10px] text-slate-400 mr-auto bg-slate-100 px-2 py-0.5 rounded-full">{t.quotaLimit} حصة</span>
                                </label>
                            ))}
                        </div>
                   </div>

                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                       <button onClick={() => setShowCopyModal(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white rounded-lg">إلغاء</button>
                       <button 
                            onClick={handleCopyConstraints} 
                            disabled={copyTargets.length === 0}
                            className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none hover:bg-primary/90 transition-all"
                       >
                           نسخ ({copyTargets.length})
                       </button>
                   </div>
               </div>
           </div>
       )}

      {/* ─── Bulk Edit First/Last Modal ─── */}
       {showBulkModal && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                   <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                       <h3 className="font-bold text-slate-800 flex items-center gap-2">
                           <Sparkles size={16} className="text-primary"/> 
                           {showBulkModal === 'first' ? 'توزيع الحصص الأولى' : 'توزيع الحصص الأخيرة'}
                       </h3>
                       <button onClick={() => setShowBulkModal(null)}><X className="text-slate-400 hover:text-red-500" size={20}/></button>
                   </div>

                   <div className="p-5 bg-indigo-50/50">
                        <div className="flex items-center gap-3 mb-2">
                            <BarChart3 size={20} className="text-indigo-600"/>
                            <div>
                                <h4 className="text-sm font-black text-slate-700">تحليل التوزيع العادل</h4>
                                <p className="text-[11px] text-slate-500">لضمان تغطية {stats.neededSlots} حصة أسبوعياً</p>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm flex items-center gap-4">
                            <div className="flex-1 text-center border-l border-slate-100">
                                <span className="block text-[10px] text-slate-400 font-bold">الموصى به لكل معلم</span>
                                <span className="block text-xl font-black text-indigo-600">{stats.recommendedMin}</span>
                                <span className="text-[9px] text-slate-400">حصص/أسبوع</span>
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] text-slate-500 font-bold mb-1">القيمة المراد تطبيقها</label>
                                <input 
                                    type="number" min={0} max={days.length}
                                    value={bulkValue}
                                    onChange={e => setBulkValue(Number(e.target.value))}
                                    className="w-full text-center p-1.5 rounded-lg border-2 border-indigo-100 focus:border-indigo-400 outline-none font-bold text-sm"
                                />
                            </div>
                        </div>
                   </div>
                   
                   <div className="p-4 max-h-[300px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-2">
                             <p className="text-xs text-slate-500">اختر المعلمين لتطبيق هذا الحد عليهم:</p>
                             <div className="flex gap-2">
                                 <button onClick={() => setCopyTargets(teachers.map(t => t.id))} className="text-[10px] text-primary hover:underline">تحديد الكل</button>
                                 <button onClick={() => setCopyTargets([])} className="text-[10px] text-slate-400 hover:text-slate-600">إلغاء التحديد</button>
                             </div>
                        </div>
                        
                        <div className="space-y-1">
                            {teachers.map(t => (
                                <label key={t.id} className="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:bg-slate-50 hover:border-slate-100 cursor-pointer transition-all">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                        copyTargets.includes(t.id) ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
                                    }`}>
                                        {copyTargets.includes(t.id) && <Check size={12} strokeWidth={3}/>}
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        className="hidden" 
                                        checked={copyTargets.includes(t.id)} 
                                        onChange={() => setCopyTargets(prev => prev.includes(t.id) ? prev.filter(id => id !== t.id) : [...prev, t.id])}
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-bold text-slate-700">{t.name}</span>
                                            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">
                                                حالي: {
                                                    (constraints.find(c => c.teacherId === t.id)?.[showBulkModal === 'first' ? 'maxFirstPeriods' : 'maxLastPeriods'] ?? 5)
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                   </div>

                   <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-2">
                       <button onClick={() => setShowBulkModal(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-white rounded-lg">إلغاء</button>
                       <button 
                            onClick={handleBulkApply} 
                            disabled={copyTargets.length === 0}
                            className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none hover:bg-primary/90 transition-all"
                       >
                           تطبيق التغييرات ({copyTargets.length})
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
}

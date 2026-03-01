import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  Calendar, Plus, X, Trash2, Zap,
  AlertTriangle, Search, Shield, Info, CheckCircle2, Check, BarChart2
} from 'lucide-react';
import {
  SchoolInfo, Teacher, Admin, ScheduleSettingsData,
  DutyScheduleData, DutyDayAssignment, DutyStaffAssignment
} from '../../types';
import {
  DAYS, DAY_NAMES, getTimingConfig, getAvailableStaffForDuty,
  generateSmartDutyAssignment, validateDutyGoldenRule
} from '../../utils/dutyUtils';

interface Props {
  dutyData: DutyScheduleData;
  setDutyData: React.Dispatch<React.SetStateAction<DutyScheduleData>>;
  teachers: Teacher[];
  admins: Admin[];
  scheduleSettings: ScheduleSettingsData;
  schoolInfo: SchoolInfo;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const DutyScheduleBuilder: React.FC<Props> = ({
  dutyData, setDutyData, teachers, admins,
  scheduleSettings, schoolInfo, showToast
}) => {
  const [showAddPanel, setShowAddPanel] = useState<string | null>(null);
  const [addSearch, setAddSearch] = useState('');
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDistributionReport, setShowDistributionReport] = useState(false);
  const [isAutoAssign, setIsAutoAssign] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const timing = getTimingConfig(schoolInfo);
  const activeDays = timing.activeDays || DAYS.slice();
  const dayAssignments = dutyData.dayAssignments;

  const availableStaff = useMemo(
    () => getAvailableStaffForDuty(teachers, admins, dutyData.exclusions, dutyData.settings),
    [teachers, admins, dutyData.exclusions, dutyData.settings]
  );

  const assignedStaffIds = useMemo(() => {
    const ids = new Set<string>();
    dayAssignments.forEach(da => da.staffAssignments.forEach(sa => ids.add(sa.staffId)));
    return ids;
  }, [dayAssignments]);

  const unassignedStaff = useMemo(() => {
    return availableStaff.filter(s => !assignedStaffIds.has(s.id));
  }, [availableStaff, assignedStaffIds]);

  // How many duty columns to show: determined by max staff assigned per day
  const maxStaffPerDay = useMemo(() => {
    let max = dutyData.settings.suggestedCountPerDay || 1;
    dayAssignments.forEach(da => {
      if (da.staffAssignments.length > max) max = da.staffAssignments.length;
    });
    return Math.max(max, 1);
  }, [dayAssignments, dutyData.settings.suggestedCountPerDay]);

  const getDayAssignment = (dayId: string): DutyDayAssignment => {
    return dayAssignments.find(d => (d.date || d.day) === dayId) || { day: dayId, staffAssignments: [] };
  };

  const updateDayAssignment = (dayId: string, updater: (da: DutyDayAssignment) => DutyDayAssignment) => {
    setDutyData(prev => {
      const applyUpdater = (arr: DutyDayAssignment[]) =>
        arr.map(d => (d.date || d.day) === dayId ? updater(d) : d);

      const exists = prev.dayAssignments.some(d => (d.date || d.day) === dayId);
      let newDayAssignments = applyUpdater(prev.dayAssignments);

      if (!exists) {
        newDayAssignments.push(updater({ day: dayId, staffAssignments: [] }));
      }

      const newWeekAssignments = prev.weekAssignments?.map(wa => ({
        ...wa,
        dayAssignments: applyUpdater(wa.dayAssignments)
      }));

      return {
        ...prev,
        dayAssignments: newDayAssignments,
        weekAssignments: newWeekAssignments
      };
    });
  };

  const handleAutoAssign = () => {
    if (availableStaff.length === 0) {
      showToast('لا يوجد موظفين متاحين للتوزيع', 'warning');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      try {
        const { assignments, weekAssignments, alerts, newCounts } = generateSmartDutyAssignment(
          teachers, admins, dutyData.exclusions, dutyData.settings,
          scheduleSettings, schoolInfo, dutyData.dutyAssignmentCounts || {}, dutyData.settings.suggestedCountPerDay
        );

        setDutyData(prev => ({ ...prev, dayAssignments: assignments, weekAssignments, dutyAssignmentCounts: newCounts }));
        showToast('تم التوزيع الذكي بنجاح بناءً على جدول الحصص الفعلي', 'success');
        setIsAutoAssign(true);
        setShowDistributionReport(true);

        if (alerts.length > 0) {
          showToast(alerts[0], 'warning');
        }
      } catch (err) {
        showToast('حدث خطأ أثناء التوزيع', 'error');
        console.error(err);
      } finally {
        setIsGenerating(false);
      }
    }, 600);
  };

  const resetSchedule = () => {
    if (confirm('هل أنت متأكد من مسح مسودة الجدول الحالي والبدء من جديد؟')) {
      const { assignments, weekAssignments } = generateSmartDutyAssignment(
        teachers, admins, dutyData.exclusions, dutyData.settings,
        scheduleSettings, schoolInfo, dutyData.dutyAssignmentCounts || {}, 0
      );
      setDutyData(prev => ({
        ...prev,
        dayAssignments: assignments,
        weekAssignments: weekAssignments
      }));
      showToast('تم تصفير الجدول', 'success');
    }
  };

  const saveManualStaffAssignments = (dayId: string) => {
    if (selectedStaffIds.length === 0) {
      setShowAddPanel(null);
      return;
    }
    const daInfo = getDayAssignment(dayId);
    const genericDay = daInfo.day;

    updateDayAssignment(dayId, da => {
      const newAssignments = selectedStaffIds.map(staffId => {
        const staff = availableStaff.find(s => s.id === staffId);
        if (!staff) return null;
        let lastP = 0;
        if (staff.type === 'teacher' && scheduleSettings.timetable) {
          const dayMaxPeriod = timing.periodCounts?.[genericDay] || 7;
          for (let p = 1; p <= dayMaxPeriod; p++) {
            if (scheduleSettings.timetable[`${staff.id}-${genericDay}-${p}`]) lastP = p;
          }
        } else if (staff.type === 'admin') {
          lastP = timing.periodCounts?.[genericDay] || 7;
        }
        return { staffId: staff.id, staffName: staff.name, staffType: staff.type, lastPeriod: lastP, isManual: true };
      }).filter(Boolean) as DutyStaffAssignment[];

      return { ...da, staffAssignments: [...da.staffAssignments, ...newAssignments] };
    });

    setSelectedStaffIds([]);
    setShowAddPanel(null);
    setAddSearch('');
    setIsAutoAssign(false);
    showToast('تم إضافة المناوبين بنجاح', 'success');
  };

  const toggleStaffSelection = (staffId: string) => {
    if (!showAddPanel) return;
    const dayId = showAddPanel;
    const assignedCount = getDayAssignment(dayId).staffAssignments.length;
    const maxCount = dutyData.settings.suggestedCountPerDay || 1;

    setSelectedStaffIds(prev => {
      if (prev.includes(staffId)) return prev.filter(id => id !== staffId);
      if (assignedCount + prev.length >= maxCount) {
        showToast(`تم بلوغ الحد الأقصى للمناوبين (${maxCount})`, 'error');
        return prev;
      }
      return [...prev, staffId];
    });
  };

  const toggleRemoteWork = (dayId: string) => {
    updateDayAssignment(dayId, da => ({
      ...da,
      isRemoteWork: !da.isRemoteWork,
      staffAssignments: !da.isRemoteWork ? [] : da.staffAssignments,
    }));
  };

  const removeStaffFromDay = (dayId: string, staffId: string) => {
    updateDayAssignment(dayId, da => ({
      ...da,
      staffAssignments: da.staffAssignments.filter(sa => sa.staffId !== staffId),
    }));
  };

  const { valid: isGoldenRuleValid } = validateDutyGoldenRule(dayAssignments);

  // Scroll to report when it appears
  useEffect(() => {
    if (showDistributionReport && reportRef.current) {
      setTimeout(() => reportRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }, [showDistributionReport]);

  // Build staff count map for distribution report
  const staffCountMap = useMemo(() => {
    const map: Record<string, { name: string; type: string; count: number }> = {};
    dayAssignments.forEach(da => {
      da.staffAssignments.forEach(sa => {
        if (!map[sa.staffId]) {
          map[sa.staffId] = { name: sa.staffName, type: sa.staffType === 'admin' ? 'إداري' : 'معلم', count: 0 };
        }
        map[sa.staffId].count++;
      });
    });
    return Object.entries(map).sort((a, b) => b[1].count - a[1].count);
  }, [dayAssignments]);

  const maxCount = staffCountMap.length > 0 ? staffCountMap[0][1].count : 0;
  const allSame = staffCountMap.every(([, v]) => v.count === maxCount);

  // Column headers for duty officers (مناوب 1، مناوب 2، ...)
  const staffColumnHeaders = Array.from({ length: maxStaffPerDay }, (_, i) =>
    maxStaffPerDay === 1 ? 'المناوب' : `مناوب ${i + 1}`
  );

  return (
    <div className="space-y-6">

      {/* Top Action Bar */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-50/50 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10 w-full md:w-auto">
          <div className="w-12 h-12 rounded-2xl bg-[#e5e1fe] text-[#655ac1] flex items-center justify-center shrink-0 shadow-sm">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">بناء جدول المناوبة</h3>
            <p className="text-sm font-medium text-slate-500 mt-1">توزيع المناوبين يدويًا أو تلقائيًا</p>
          </div>
        </div>

        {dayAssignments.length > 0 && (
          <button
            onClick={() => setShowDistributionReport(v => !v)}
            className="flex items-center gap-2 border-2 border-[#c4b8fb] bg-white hover:bg-[#f3f0ff] text-[#655ac1] px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm"
          >
            <BarChart2 size={16} />
            تقرير توزيع المناوبة
          </button>
        )}
      </div>

      {/* Distribution Report Modal Popup */}
      {showDistributionReport && dayAssignments.length > 0 && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowDistributionReport(false)}>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col border border-[#e5e1fe] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-l from-[#f3f0ff] to-white rounded-t-[2rem]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#e5e1fe] text-[#655ac1] rounded-xl shadow-sm">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <h4 className="font-black text-slate-800 text-base">تقرير توزيع المناوبة</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">نصيب كل موظف من أيام المناوبة</p>
                </div>
              </div>
              <button onClick={() => setShowDistributionReport(false)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Report Body */}
            <div className="flex-1 overflow-y-auto p-5">
              {staffCountMap.length === 0 ? (
                <div className="text-center py-10 text-slate-400">
                  <Shield size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="font-bold text-sm">لا توجد بيانات توزيع حتى الآن</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-xl border border-slate-100">
                    <table className="w-full text-right text-sm">
                      <thead>
                        <tr className="bg-[#f3f0ff]">
                          <th className="p-3 font-black text-[#655ac1] rounded-tr-xl">التسلسل</th>
                          <th className="p-3 font-black text-[#655ac1]">الموظف</th>
                          <th className="p-3 font-black text-[#655ac1]">الوظيفة</th>
                          <th className="p-3 font-black text-[#655ac1] text-center rounded-tl-xl">عدد المناوبات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffCountMap.map(([id, info], idx) => {
                          const isHighest = !allSame && info.count === maxCount;
                          return (
                            <tr key={id} className={`border-b border-slate-100 transition-colors ${isHighest ? 'bg-amber-50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                              <td className="p-3 font-bold text-slate-500 text-center">{idx + 1}</td>
                              <td className={`p-3 font-bold ${isHighest ? 'text-amber-700' : 'text-slate-800'}`}>
                                {isHighest && <span className="inline-block w-2 h-2 rounded-full bg-amber-400 mr-2"></span>}
                                {info.name}
                              </td>
                              <td className="p-3">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${
                                  info.type === 'إداري' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>{info.type}</span>
                              </td>
                              <td className="p-3 text-center">
                                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl font-black text-base shadow-sm ${
                                  isHighest ? 'bg-amber-400 text-white' : 'bg-[#e5e1fe] text-[#655ac1]'
                                }`}>
                                  {info.count}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {allSame && (
                    <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                      <p className="text-xs font-medium text-emerald-700">
                        توزيع متساوٍ تام: جميع الموظفين لديهم {maxCount} يوم مناوبة.
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Unassigned staff alert */}
      {unassignedStaff.length > 0 && dayAssignments.some(da => da.staffAssignments.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start sm:items-center gap-3 shadow-sm">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0 mt-1 sm:mt-0">
            <Info size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-blue-800">يوجد مناوبين متاحين لم يتم تكليفهم</h4>
            <p className="text-xs text-blue-700 font-medium mt-0.5 leading-relaxed">
              يوجد ({unassignedStaff.length}) موظفين متاحين للمناوبة لم يتم إضافتهم للجدول في أي يوم.
            </p>
          </div>
        </div>
      )}

      {/* Main Table Layout */}
      <div className="space-y-8">
        {(() => {
          const weeksToRender = dutyData.weekAssignments && dutyData.weekAssignments.length > 0
            ? dutyData.weekAssignments
            : [{ weekId: 'legacy-week', weekName: '', startDate: '', endDate: '', dayAssignments: activeDays.map(day => getDayAssignment(day)) }];

          return weeksToRender.map((week) => (
            <div key={week.weekId} className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
              {week.weekName && (
                <div className="bg-slate-50/80 border-b border-slate-200 p-5 flex items-center justify-between">
                  <h4 className="font-black text-[#5C50A4] text-xl">{week.weekName}</h4>
                  {week.startDate && (
                    <span className="text-sm font-bold text-slate-500 font-mono bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                      {week.startDate} إلى {week.endDate}
                    </span>
                  )}
                </div>
              )}
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-200">
                      <th className="p-4 font-black text-slate-700 w-24 border-l border-slate-200/60">اليوم</th>
                      <th className="p-4 font-black text-slate-700 w-28 border-l border-slate-200/60">التاريخ</th>
                      {staffColumnHeaders.map((header, i) => (
                        <th key={i} className="p-4 font-black text-slate-700 min-w-[180px] border-l border-slate-200/60">{header}</th>
                      ))}
                      <th className="p-4 font-black text-slate-700 w-32 text-center">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {week.dayAssignments.map(da => {
                      const dayId = da.date || da.day;
                      const staffAssignments = da.staffAssignments;
                      const showAdd = showAddPanel === dayId;

                      return (
                        <tr key={dayId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                          {/* Day Column */}
                          <td className="p-4 border-l border-slate-200/60 align-middle bg-gradient-to-br from-violet-50/20 to-transparent relative group">
                            <div className="flex flex-col justify-center items-center text-center gap-1">
                              <h4 className="font-black text-slate-800 text-base">{DAY_NAMES[da.day]}</h4>
                            </div>
                            <button
                              onClick={() => toggleRemoteWork(dayId)}
                              title={da.isRemoteWork ? 'إلغاء وضع العمل عن بعد' : 'تحويل اليوم إلى عمل عن بعد'}
                              className={`absolute top-2 left-2 p-1.5 rounded-lg border shadow-sm transition-all sm:opacity-0 sm:group-hover:opacity-100 ${
                                da.isRemoteWork
                                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 sm:opacity-100'
                                  : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50'
                              }`}
                            >
                              <Zap size={13} className={da.isRemoteWork ? 'fill-emerald-200' : ''} />
                            </button>
                          </td>

                          {/* Date Column */}
                          <td className="p-4 border-l border-slate-200/60 align-middle text-center">
                            {da.date ? (
                              <span className="font-bold text-slate-700 text-xs font-mono bg-violet-50 px-2 py-1 rounded-lg border border-violet-200 shadow-sm">{da.date}</span>
                            ) : (
                              <span className="text-xs text-slate-400">—</span>
                            )}
                          </td>

                          {/* Staff Columns — one cell per duty slot */}
                          {da.isRemoteWork ? (
                            <td colSpan={maxStaffPerDay} className="p-4 border-l border-slate-200/60 align-middle">
                              <div className="flex items-center justify-center p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                                <span className="font-black text-emerald-600 text-sm">عمل عن بعد</span>
                              </div>
                            </td>
                          ) : (
                            staffColumnHeaders.map((_, colIdx) => {
                              const sa = staffAssignments[colIdx];
                              return (
                                <td key={colIdx} className="p-3 border-l border-slate-200/60 align-middle">
                                  {sa ? (
                                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 shadow-sm hover:border-indigo-200 transition-all group">
                                      <span className="font-bold text-slate-800 text-sm flex-1 text-right">{sa.staffName}</span>
                                      <button
                                        onClick={() => removeStaffFromDay(dayId, sa.staffId)}
                                        className="w-6 h-6 rounded-lg flex items-center justify-center text-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                                        title="حذف المناوب"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    /* Add slot — only show for the first empty slot */
                                    colIdx === staffAssignments.length ? (
                                      <div className="relative">
                                        <button
                                          onClick={() => { setShowAddPanel(dayId); setSelectedStaffIds([]); setAddSearch(''); }}
                                          className="w-full min-h-[44px] border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-[#655ac1] hover:border-indigo-300 hover:bg-violet-50/50 font-bold text-xs flex items-center justify-center gap-1 transition-all"
                                        >
                                          <Plus size={14} /> إضافة
                                        </button>

                                        {/* Dropdown */}
                                        {showAdd && (
                                          <div className="absolute top-[calc(100%+0.5rem)] right-0 w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] border border-slate-200 z-[99]" onClick={e => e.stopPropagation()}>
                                            <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
                                              <span className="text-xs font-black text-slate-700">{DAY_NAMES[da.day]} {da.date && `(${da.date})`}</span>
                                              <button onClick={() => setShowAddPanel(null)} className="p-1 text-slate-400 hover:text-rose-500"><X size={14} /></button>
                                            </div>
                                            <div className="p-2 border-b border-slate-100">
                                              <div className="relative">
                                                <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
                                                <input type="text" autoFocus value={addSearch} onChange={e => setAddSearch(e.target.value)} placeholder="بحث..." className="w-full pl-2 pr-8 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8779fb]/30" />
                                              </div>
                                            </div>
                                            <div className="max-h-56 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                              {unassignedStaff.filter(s => !addSearch.trim() || s.name.includes(addSearch)).map(staff => {
                                                const isSelected = selectedStaffIds.includes(staff.id);
                                                return (
                                                  <button key={staff.id} onClick={() => toggleStaffSelection(staff.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-right transition-all outline-none ${isSelected ? 'bg-violet-50 border-[#c4b8fb]' : 'bg-white border-transparent hover:bg-slate-50'}`}>
                                                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[#8779fb] border-[#8779fb] text-white' : 'bg-white border-slate-300'}`}>
                                                      {isSelected && <Check size={11} />}
                                                    </div>
                                                    <div className="flex-1 flex flex-col">
                                                      <span className={`text-sm font-bold ${isSelected ? 'text-[#655ac1]' : 'text-slate-700'}`}>{staff.name}</span>
                                                      <span className="text-[10px] text-slate-500">{staff.type === 'teacher' ? '(معلم)' : '(إداري)'}</span>
                                                    </div>
                                                  </button>
                                                );
                                              })}
                                              {unassignedStaff.length === 0 && (
                                                <div className="text-center py-6 text-slate-400 text-xs font-bold">
                                                  <Shield size={22} className="mx-auto mb-2 opacity-30" />
                                                  جميع الموظفين مخصصون
                                                </div>
                                              )}
                                            </div>
                                            <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl">
                                              <button onClick={() => saveManualStaffAssignments(dayId)} className="bg-[#8779fb] hover:bg-[#655ac1] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-all">
                                                حفظ ({selectedStaffIds.length})
                                              </button>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-xs text-slate-300 flex items-center justify-center h-full">—</span>
                                    )
                                  )}
                                </td>
                              );
                            })
                          )}

                          {/* Actions Column */}
                          <td className="p-4 align-middle text-center">
                            <div className="flex justify-center">
                              {da.isRemoteWork ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
                                  <CheckCircle2 size={13} /> عمل عن بعد
                                </span>
                              ) : staffAssignments.length > 0 ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
                                  <CheckCircle2 size={13} /> مكتمل
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-200">
                                  بانتظار الإسناد
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ));
        })()}
      </div>
    </div>
  );
};

export default DutyScheduleBuilder;

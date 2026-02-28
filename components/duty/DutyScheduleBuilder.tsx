import React, { useState, useMemo } from 'react';
import {
  Calendar, Users, Plus, X, Trash2, Zap, RefreshCw,
  AlertTriangle, Search, Shield, Info, CheckCircle2, ChevronDown, Check
} from 'lucide-react';
import {
  SchoolInfo, Teacher, Admin, ScheduleSettingsData,
  DutyScheduleData, DutyDayAssignment, DutyStaffAssignment
} from '../../types';
import { Badge } from '../ui/Badge';
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

  const getDayAssignment = (day: string): DutyDayAssignment => {
    return dayAssignments.find(d => d.day === day) || { day, staffAssignments: [] };
  };

  const updateDayAssignment = (day: string, updater: (da: DutyDayAssignment) => DutyDayAssignment) => {
    setDutyData(prev => {
      const existing = prev.dayAssignments.find(d => d.day === day);
      if (existing) {
        return {
          ...prev,
          dayAssignments: prev.dayAssignments.map(d => d.day === day ? updater(d) : d),
        };
      } else {
        return {
          ...prev,
          dayAssignments: [...prev.dayAssignments, updater({ day, staffAssignments: [] })],
        };
      }
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
        const { assignments, alerts } = generateSmartDutyAssignment(
          teachers, admins, dutyData.exclusions, dutyData.settings,
          scheduleSettings, schoolInfo, dutyData.settings.suggestedCountPerDay
        );

        setDutyData(prev => ({ ...prev, dayAssignments: assignments }));
        showToast('تم التوزيع الذكي بنجاح بناءً على جدول الحصص الفعلي', 'success');
        
        if (alerts.length > 0) {
           // Display the first alert as a warning, just to inform the user
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
      setDutyData(prev => ({
        ...prev,
        dayAssignments: activeDays.map(day => ({ day, staffAssignments: [] }))
      }));
      showToast('تم تصفير الجدول', 'success');
    }
  };

  const saveManualStaffAssignments = (day: string) => {
    if (selectedStaffIds.length === 0) {
       setShowAddPanel(null);
       return;
    }
    
    updateDayAssignment(day, da => {
      const newAssignments = selectedStaffIds.map(staffId => {
         const staff = availableStaff.find(s => s.id === staffId);
         if (!staff) return null;
         
         // Try to find last period if teacher
         let lastP = 0;
         if (staff.type === 'teacher' && scheduleSettings.timetable) {
             const dayMaxPeriod = timing.periodCounts?.[day] || 7;
             for (let p = 1; p <= dayMaxPeriod; p++) {
                if (scheduleSettings.timetable[`${staff.id}-${day}-${p}`]) {
                    lastP = p;
                }
             }
         } else if (staff.type === 'admin') {
             lastP = timing.periodCounts?.[day] || 7; // Admins stay till end
         }

         return {
            staffId: staff.id,
            staffName: staff.name,
            staffType: staff.type,
            lastPeriod: lastP,
            isManual: true
         };
      }).filter(Boolean) as DutyStaffAssignment[];
      
      return {
        ...da,
        staffAssignments: [...da.staffAssignments, ...newAssignments],
      };
    });
    
    setSelectedStaffIds([]);
    setShowAddPanel(null);
    setAddSearch('');
    showToast(`تم إضافة المناوبين بنجاح ليوم ${DAY_NAMES[day]}`, 'success');
  };

  const toggleStaffSelection = (staffId: string) => {
     if (!showAddPanel) return;
     const day = showAddPanel;
     const assignedCount = getDayAssignment(day).staffAssignments.length;
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

  const toggleRemoteWork = (day: string) => {
    updateDayAssignment(day, da => ({
      ...da,
      isRemoteWork: !da.isRemoteWork,
      staffAssignments: !da.isRemoteWork ? [] : da.staffAssignments,
    }));
  };

  const removeStaffFromDay = (day: string, staffId: string) => {
    updateDayAssignment(day, da => ({
      ...da,
      staffAssignments: da.staffAssignments.filter(sa => sa.staffId !== staffId),
    }));
  };

  const { valid: isGoldenRuleValid, duplicates } = validateDutyGoldenRule(dayAssignments);

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
      </div>

      {/* Alerts */}
      {unassignedStaff.length > 0 && dayAssignments.some(da => da.staffAssignments.length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start sm:items-center gap-3 animate-in slide-in-from-top-2 shadow-sm">
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

      {!isGoldenRuleValid && (
        <div className="bg-violet-50/50 border -[#e5e1fe] rounded-2xl p-4 flex items-start sm:items-center gap-3 animate-in slide-in-from-top-2 shadow-sm">
          <div className="p-2 bg-[#e5e1fe] text-[#655ac1] rounded-xl shrink-0 mt-1 sm:mt-0">
             <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
             <h4 className="text-sm font-bold text-indigo-800">تحذير: تجاوز قاعدة التوزيع العادل</h4>
             <p className="text-xs text-[#655ac1] font-medium mt-0.5 leading-relaxed">
               يوجد موظفون تم تكليفهم بأكثر من يوم مناوبة في نفس الأسبوع: {duplicates.map(d => d.staffName).join('، ')}.
             </p>
          </div>
        </div>
      )}

      {/* Main Table Layout */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-black text-slate-700 w-32 border-l border-slate-200/60">اليوم</th>
                <th className="p-4 font-black text-slate-700 min-w-[300px] border-l border-slate-200/60">المناوبون</th>
                <th className="p-4 font-black text-slate-700 w-32 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {activeDays.map(day => {
                const da = getDayAssignment(day);
                const staffAssignments = da.staffAssignments;
                const showAdd = showAddPanel === day;
                const dayMaxPeriod = timing.periodCounts?.[day] || 7;
                
                return (
                  <tr key={day} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    {/* Day Column */}
                    <td className="p-4 border-l border-slate-200/60 align-top bg-gradient-to-br from-violet-50/50/20 to-transparent relative group">
                        <div className="flex flex-col justify-center items-center text-center gap-2">
                            <h4 className="font-black text-slate-800 text-lg">{DAY_NAMES[day]}</h4>
                            {!da.isRemoteWork && (
                              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-md border border-slate-200">
                                  {staffAssignments.length} مناوب
                              </span>
                            )}
                        </div>
                        <button
                          onClick={() => toggleRemoteWork(day)}
                          title={da.isRemoteWork ? 'إلغاء وضع العمل عن بعد' : 'تحويل اليوم إلى عمل عن بعد'}
                          className={`absolute top-2 left-2 p-1.5 rounded-lg border shadow-sm transition-all sm:opacity-0 sm:group-hover:opacity-100 ${
                            da.isRemoteWork 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 sm:opacity-100' 
                              : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-500 hover:border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          <Zap size={14} className={da.isRemoteWork ? 'fill-emerald-200' : ''} />
                        </button>
                    </td>

                    {/* Staff Column */}
                    <td className="p-4 border-l border-slate-200/60 align-top">
                        {da.isRemoteWork ? (
                           <div className="flex items-center justify-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
                              <span className="font-black text-emerald-600">عمل عن بعد</span>
                           </div>
                        ) : (
                        <div className="flex flex-wrap gap-3">
                           {staffAssignments.map(sa => (
                             <div key={sa.staffId} className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 ${sa.staffType === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                   {sa.staffType === 'admin' ? 'إ' : 'م'}
                                </div>
                                <div className="flex flex-col min-w-[120px]">
                                   <span className="font-bold text-slate-800 text-sm">{sa.staffName}</span>
                                   <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                                     {sa.staffType === 'admin' ? 'إداري (دوام كامل)' : `تفريغ: الحصة ${sa.lastPeriod || '؟'}`}
                                     {sa.lastPeriod === dayMaxPeriod && sa.staffType === 'teacher' && <span className="text-emerald-500 mr-1">(مثالي)</span>}
                                   </span>
                                </div>
                                <div className="pr-3 pl-1 border-r border-slate-100">
                                   <button onClick={() => removeStaffFromDay(day, sa.staffId)} className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors shadow-sm bg-white" title="حذف المناوب">
                                       <Trash2 size={16} />
                                   </button>
                                </div>
                             </div>
                           ))}

                           {/* Add Staff Button in flow */}
                           <div className="relative flex items-center min-w-[160px]">
                             <button onClick={() => { setShowAddPanel(day); setSelectedStaffIds([]); setAddSearch(''); }} className="w-full h-full min-h-[66px] border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:text-[#655ac1] hover:border-indigo-400 hover:bg-violet-50/50 font-bold text-xs flex flex-col items-center justify-center gap-1 transition-all">
                               <Plus size={16} /> إضافة مناوب
                             </button>

                             {/* Add Staff Dropdown (Multiselect) */}
                              {showAdd && (
                                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-72 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] border border-slate-200 z-[99]" onClick={(e) => e.stopPropagation()}>
                                   <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
                                     <span className="text-xs font-black text-slate-700">تحديد المناوبين ليوم {DAY_NAMES[day]}</span>
                                     <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md shadow-sm border border-slate-200">الحد الأقصى: {dutyData.settings.suggestedCountPerDay || 1}</span>
                                        <button onClick={() => setShowAddPanel(null)} className="p-1 text-slate-400 hover:text-rose-500"><X size={14}/></button>
                                     </div>
                                   </div>
                                   <div className="p-2 border-b border-slate-100">
                                     <div className="relative">
                                       <Search size={14} className="absolute right-2.5 top-2.5 text-slate-400" />
                                       <input type="text" autoFocus value={addSearch} onChange={e => setAddSearch(e.target.value)} placeholder="بحث عن مناوب متاح..." className="w-full pl-2 pr-8 py-2 rounded-lg border border-slate-200 text-xs outline-none focus:ring-2 focus:ring-[#8779fb]/30 focus:border-[#8779fb]" />
                                     </div>
                                   </div>
                                   <div className="max-h-56 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                     {unassignedStaff.filter(s => !addSearch.trim() || s.name.includes(addSearch)).map(staff => {
                                        const isSelected = selectedStaffIds.includes(staff.id);
                                        return (
                                          <button key={staff.id} onClick={() => toggleStaffSelection(staff.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-right transition-all outline-none ${isSelected ? 'bg-violet-50/50 -[#e5e1fe]' : 'bg-white border-transparent hover:bg-slate-50'}`}>
                                             <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${isSelected ? 'bg-[#8779fb] border-[#8779fb] text-white' : 'bg-white border-slate-300'}`}>
                                                {isSelected && <Check size={12} />}
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
                                         <Shield size={24} className="mx-auto mb-2 opacity-30" />
                                         جميع الموظفين مخصصون
                                       </div>
                                     )}
                                   </div>
                                   <div className="p-3 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl">
                                      <button onClick={() => saveManualStaffAssignments(day)} className="bg-[#8779fb] hover:bg-[#655ac1] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md -[#e5e1fe] transition-all">
                                         حفظ المحدد ({selectedStaffIds.length})
                                      </button>
                                   </div>
                                </div>
                              )}
                           </div>
                        </div>
                        )}
                    </td>

                    {/* Actions Column */}
                    <td className="p-4 align-middle text-center">
                        <div className="flex justify-center">
                            {da.isRemoteWork ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
                                   <CheckCircle2 size={14} /> عمل عن بعد
                                </span>
                            ) : staffAssignments.length > 0 ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg border border-emerald-100">
                                   <CheckCircle2 size={14} /> مكتمل
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

    </div>
  );
};

export default DutyScheduleBuilder;


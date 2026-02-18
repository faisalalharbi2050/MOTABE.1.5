import React, { useState, useMemo } from 'react';
import { 
  Users, User, Clock, Check, Plus, X, 
  LayoutGrid, Calendar, ChevronRight, Search, Sparkles
} from 'lucide-react';
import { Teacher, Subject, ClassInfo, SchoolInfo, ScheduleSettingsData, TimetableData, TimetableSlot } from '../types';

interface Props {
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassInfo[];
  schoolInfo: SchoolInfo;
  scheduleSettings: ScheduleSettingsData;
  setScheduleSettings: React.Dispatch<React.SetStateAction<ScheduleSettingsData>>;
}

const ClassesAndWaiting: React.FC<Props> = ({
  teachers, subjects, classes, schoolInfo, scheduleSettings, setScheduleSettings
}) => {
  const [viewMode, setViewMode] = useState<'general' | 'teacher'>('general');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [teacherSearch, setTeacherSearch] = useState('');

  const activeDays = schoolInfo.timing?.activeDays || ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
  const periodCounts = schoolInfo.timing?.periodCounts || { 'default': 7 };
  const maxPeriods = Math.max(...(Object.values(periodCounts) as number[]));
  const periods = Array.from({ length: maxPeriods }, (_, i) => i + 1);

  // -- Counters Logic --
  const waitingCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    if (!scheduleSettings.timetable) return counts;

    Object.entries(scheduleSettings.timetable).forEach(([key, slotData]) => {
      const slot = slotData as TimetableSlot;
      // Slot key format: "day-period-teacherId" for waiting slots
      if (slot.type === 'waiting') {
        const parts = key.split('-');
        const day = parts[0];
        const period = parts[1];
        const periodKey = `${day}-${period}`;
        counts[periodKey] = (counts[periodKey] || 0) + 1;
      }
    });
    return counts;
  }, [scheduleSettings.timetable]);

  // -- Handlers --
  const toggleWaiting = (teacherId: string, day: string, period: number) => {
    const key = `${day}-${period}-${teacherId}`;
    setScheduleSettings(prev => {
      const newTimetable: TimetableData = { ...(prev.timetable || {}) };
      if (newTimetable[key]) {
        delete newTimetable[key];
      } else {
        newTimetable[key] = { teacherId, type: 'waiting' };
      }
      return { ...prev, timetable: newTimetable };
    });
  };

  const autoFillGaps = (teacherId: string) => {
    const teacher = teachers.find(t => t.id === teacherId);
    if (!teacher) return;

    setScheduleSettings(prev => {
      const newTimetable: TimetableData = { ...(prev.timetable || {}) };
      
      activeDays.forEach(day => {
        periods.forEach(p => {
          const key = `${day}-${p}-${teacherId}`;
          // For now, "filling gaps" means adding waiting if there is no other slot 
          // (In a real system, we'd check against actual lessons)
          // Since we don't have lessons yet, we'll just toggle some empty ones for demo
          if (!newTimetable[key] && Math.random() > 0.7) {
            newTimetable[key] = { teacherId, type: 'waiting' };
          }
        });
      });
      
      return { ...prev, timetable: newTimetable };
    });
  };

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(teacherSearch.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-slate-50/30 animate-in fade-in duration-500">
      
      {/* ─── Header & View Switcher ─── */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-primary">
            <Clock size={24} />
            الحصص والانتظار
          </h2>
          
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('general')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'general' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <LayoutGrid size={14} /> الكشف العام
            </button>
            <button 
              onClick={() => setViewMode('teacher')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'teacher' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <User size={14} /> جداول المعلمين
            </button>
          </div>
        </div>

        {/* Global Stats / Counters in Header */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100 text-amber-700 font-bold text-xs uppercase tracking-tight">
            <Users size={14} />
            إجمالي المنتظرين: {(Object.values(waitingCounts) as number[]).reduce((a, b) => a + b, 0)}
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* ─── Sidebar (Conditional) ─── */}
        {viewMode === 'teacher' && (
          <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 transition-all">
            <div className="p-4 border-b border-slate-100 space-y-3">
              <div className="relative">
                <Search className="absolute right-3 top-2.5 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="بحث عن معلم..." 
                  className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all font-sans"
                  value={teacherSearch}
                  onChange={e => setTeacherSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {filteredTeachers.map(t => (
                <button 
                  key={t.id} 
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`w-full p-3 rounded-xl text-right flex items-center justify-between transition-all ${selectedTeacherId === t.id ? 'bg-primary/5 text-primary border-primary ring-1 ring-primary' : 'hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all ${selectedTeacherId === t.id ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-slate-100 text-slate-500'}`}>
                      {t.name.substring(0,2)}
                    </div>
                    <span className="text-xs font-black truncate max-w-[140px]">{t.name}</span>
                  </div>
                  <ChevronRight size={14} className={`transition-all ${selectedTeacherId === t.id ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}`} />
                </button>
              ))}
            </div>
          </aside>
        )}

        {/* ─── Main Timetable ─── */}
        <main className="flex-1 overflow-auto p-6 custom-scrollbar bg-slate-50/30">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* View Header with Auto-fill Action */}
            <div className="flex items-center justify-between">
               <div>
                  <h3 className="text-sm font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
                    {viewMode === 'general' ? <LayoutGrid size={16}/> : <User size={16}/>}
                    {viewMode === 'general' ? 'عرض الكشف العام للانتظار' : `جدول المعلم: ${teachers.find(t => t.id === selectedTeacherId)?.name || '---'}`}
                  </h3>
               </div>
               {viewMode === 'teacher' && selectedTeacherId && (
                 <button 
                   onClick={() => autoFillGaps(selectedTeacherId)}
                   className="flex items-center gap-2 px-4 py-2 bg-gradient-to-br from-primary to-indigo-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all"
                 >
                   <Sparkles size={14} /> توزيع آلي في الفراغات
                 </button>
               )}
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/10 overflow-hidden">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="p-4 text-xs font-black text-slate-400 border-l border-slate-100 w-24">اليوم / الحصة</th>
                    {periods.map(p => {
                      // Sum of waiting across ALL days for this period for the current view
                      return (
                        <th key={p} className="p-4 border-l border-slate-100 min-w-[120px]">
                          <div className="flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الحصة {p}</span>
                            <div className="flex flex-wrap justify-center gap-1 max-w-[100px]">
                               {activeDays.map(day => {
                                 const count = waitingCounts[`${day}-${p}`] || 0;
                                 if (count === 0) return null;
                                 return (
                                   <div key={day} title={`${day}: ${count} منتظرين`} className="flex flex-col items-center">
                                      <div className="w-6 h-6 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center text-[9px] font-black border border-amber-200/50 shadow-sm">
                                        م{count}
                                      </div>
                                   </div>
                                 );
                               })}
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {activeDays.map(day => (
                    <tr key={day} className="border-b border-slate-100 group transition-colors hover:bg-slate-50/20">
                      <td className="p-4 bg-slate-50/50 border-l border-slate-100 font-black text-slate-700 text-sm text-center">
                        {day}
                      </td>
                      {periods.map(p => {
                        const isWaiting = selectedTeacherId && scheduleSettings.timetable?.[`${day}-${p}-${selectedTeacherId}`];
                        
                        return (
                          <td key={p} className="p-2 border-l border-slate-100 relative h-28 min-w-[120px] transition-all">
                            {viewMode === 'teacher' && selectedTeacherId ? (
                               <button 
                                 onClick={() => toggleWaiting(selectedTeacherId, day, p)}
                                 className={`w-full h-full rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border-2 border-dashed ${isWaiting ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-inner' : 'border-slate-100 hover:border-primary/30 hover:bg-primary/5 text-slate-200'}`}
                               >
                                 {isWaiting ? (
                                    <>
                                      <div className="w-8 h-8 rounded-full bg-amber-200/50 flex items-center justify-center">
                                        <Clock size={16} className="text-amber-600" />
                                      </div>
                                      <span className="text-[10px] font-black">انتظار (م)</span>
                                    </>
                                 ) : (
                                    <div className="opacity-0 group-hover:opacity-100 flex flex-col items-center gap-1 transition-all">
                                      <Plus size={16} className="text-primary" />
                                      <span className="text-[8px] font-bold text-primary/60">إضافة انتظار</span>
                                    </div>
                                 )}
                               </button>
                            ) : (
                               /* General View Cell Content */
                               <div className="flex flex-wrap gap-1.5 justify-center">
                                 {Object.entries(scheduleSettings.timetable || {})
                                   .filter(([key]) => key.startsWith(`${day}-${p}-`))
                                   .map(([key, slotData]) => {
                                     const slot = slotData as TimetableSlot;
                                     const teacher = teachers.find(t => t.id === slot.teacherId);
                                     return (
                                       <div key={key} className="bg-gradient-to-br from-amber-50 to-orange-50 text-amber-800 text-[10px] font-black px-2 py-1 rounded-lg border border-amber-200 shadow-sm flex items-center gap-1">
                                         <Clock size={10} className="text-amber-600"/>
                                         {teacher?.name.split(' ')[0]}
                                       </div>
                                     );
                                   })}
                               </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher View Help Card */}
          {viewMode === 'teacher' && !selectedTeacherId && (
            <div className="flex flex-col items-center justify-center p-20 text-center animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-white border border-slate-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-slate-200/30">
                 <User size={40} className="text-slate-300" />
               </div>
               <h3 className="text-lg font-black text-slate-800 tracking-tight">اختر معلماً للبدء</h3>
               <p className="text-sm text-slate-500 mt-2 font-bold max-w-sm mx-auto leading-relaxed">
                 يمكنك اختيار معلم من القائمة الجانبية لإدارة جدول حصصه وتوزيع الانتظار الآلي واليدوي.
               </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ClassesAndWaiting;

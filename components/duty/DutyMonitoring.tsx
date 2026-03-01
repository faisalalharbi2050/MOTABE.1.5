import React, { useState, useMemo } from 'react';
import {
  Eye, UserCheck, UserX, Clock, Check, AlertTriangle,
  CheckCircle, Calendar, ChevronLeft, ChevronRight, Save,
  Shield, X
} from 'lucide-react';
import {
  SchoolInfo, DutyScheduleData, DutyReportRecord,
  SupervisionAttendanceStatus
} from '../../types';
import { Badge } from '../ui/Badge';
import { DAYS, DAY_NAMES, getTimingConfig, getTodayDutyReports, getDutyStats } from '../../utils/dutyUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dutyData: DutyScheduleData;
  setDutyData: React.Dispatch<React.SetStateAction<DutyScheduleData>>;
  schoolInfo: SchoolInfo;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const STATUS_MAP: Record<SupervisionAttendanceStatus, { label: string; color: string; icon: React.ReactNode }> = {
  present: { label: 'حاضر', color: 'bg-green-100 text-green-700 border-green-200', icon: <CheckCircle size={14} /> },
  absent: { label: 'غائب', color: 'bg-red-100 text-red-700 border-red-200', icon: <UserX size={14} /> },
  excused: { label: 'مستأذن', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <Clock size={14} /> },
  withdrawn: { label: 'منسحب', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: <AlertTriangle size={14} /> },
  late: { label: 'متأخر', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock size={14} /> },
};

const DutyMonitoringModal: React.FC<Props> = ({
  isOpen, onClose, dutyData, setDutyData, schoolInfo, showToast
}) => {
  // ===== ALL HOOKS BEFORE ANY EARLY RETURN =====
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [withdrawalTimes, setWithdrawalTimes] = useState<Record<string, string>>({});

  const timing = getTimingConfig(schoolInfo);

  const selectedDayOfWeek = useMemo(() => {
    const date = new Date(selectedDate);
    const dayIndex = date.getDay();
    const dayMap: Record<number, string> = { 0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday' };
    return dayMap[dayIndex] || 'sunday';
  }, [selectedDate]);

  const currentDayAssignment = useMemo(() => {
    // Try matching by exact date first (multi-week support)
    const exactMatch = dutyData.dayAssignments.find(da => da.date === selectedDate);
    if (exactMatch) return exactMatch;
    // Fallback for older schedules without dates
    return dutyData.dayAssignments.find(da => da.day === selectedDayOfWeek);
  }, [dutyData.dayAssignments, selectedDate, selectedDayOfWeek]);

  const existingReports = useMemo(() => {
    return getTodayDutyReports(dutyData.reports, selectedDate);
  }, [dutyData.reports, selectedDate]);

  const dutyStaffList = useMemo(() => {
    if (!currentDayAssignment) return [];
    return (currentDayAssignment.staffAssignments || []).map(sa => {
      const existing = existingReports.find(r => r.staffId === sa.staffId);
      return {
        ...sa,
        status: existing?.status || ('present' as SupervisionAttendanceStatus),
        withdrawalTime: existing?.withdrawalTime || '',
        isSubmitted: existing?.isSubmitted || false,
      };
    });
  }, [currentDayAssignment, existingReports]);

  const formattedDate = useMemo(() => {
    const d = new Date(selectedDate);
    const calendarType = schoolInfo.semesters?.[0]?.calendarType || 'hijri';
    if (calendarType === 'hijri') {
      return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(d);
    } else {
      return new Intl.DateTimeFormat('ar-SA', {
        day: 'numeric', month: 'long', year: 'numeric'
      }).format(d);
    }
  }, [selectedDate, schoolInfo.semesters]);

  // ===== EARLY RETURN AFTER ALL HOOKS =====
  if (!isOpen) return null;

  // ===== NON-HOOK LOGIC =====
  const isAlreadyRecorded = existingReports.length > 0;
  const stats = getDutyStats(dutyData.reports);
  const todayStats = getDutyStats(existingReports);
  const dayName = DAY_NAMES[selectedDayOfWeek] || '';
  const isWeekend = selectedDayOfWeek === 'friday' || selectedDayOfWeek === 'saturday';

  const saveAttendanceStatus = (status: SupervisionAttendanceStatus, staffId: string) => {
    const sa = (currentDayAssignment?.staffAssignments || []).find(s => s.staffId === staffId);
    if (!sa) return;

    setDutyData(prev => {
      const existingIdx = prev.reports.findIndex(
        r => r.date === selectedDate && r.staffId === staffId
      );
      const updated = [...prev.reports];
      if (existingIdx >= 0) {
        updated[existingIdx] = {
          ...updated[existingIdx],
          status,
          withdrawalTime: status === 'withdrawn' ? (withdrawalTimes[staffId] || updated[existingIdx].withdrawalTime || '') : undefined,
        };
      } else {
        const newReport: DutyReportRecord = {
          id: `duty-rep-${selectedDate}-${staffId}`,
          date: selectedDate,
          day: selectedDayOfWeek,
          staffId,
          staffName: sa.staffName,
          status,
          withdrawalTime: status === 'withdrawn' ? (withdrawalTimes[staffId] || '') : undefined,
          lateStudents: [],
          violatingStudents: [],
          isSubmitted: false
        };
        updated.push(newReport);
      }
      return { ...prev, reports: updated };
    });
  };

  const markAllPresent = () => {
    if (!currentDayAssignment || !currentDayAssignment.staffAssignments) return;
    currentDayAssignment.staffAssignments.forEach(sa => {
      saveAttendanceStatus('present', sa.staffId);
    });
    showToast('تم تسجيل الحضور لجميع المناوبين', 'success');
  };

  const changeDate = (delta: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#e5e1fe] rounded-2xl flex items-center justify-center text-[#655ac1] shadow-sm">
              <Eye size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">المتابعة اليومية</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">تسجيل حالات الحضور والانصراف للمناوبين</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">

            {/* Date Navigation */}
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#e5e1fe]/50 to-transparent rounded-br-full -z-0 pointer-events-none" />

              <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm relative z-10 w-full sm:w-auto justify-between sm:justify-start">
                <button onClick={() => changeDate(1)} className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-[#655ac1] hover:shadow-sm transition-all active:scale-95">
                  <ChevronRight size={20} />
                </button>

                <div className="text-center min-w-[180px] flex flex-col items-center">
                  <p className="text-lg font-black text-[#655ac1]">{dayName}</p>
                  <div className="relative group/date cursor-pointer flex items-center gap-1.5 mt-0.5">
                    <Calendar size={14} className="text-slate-400 group-hover/date:text-[#655ac1] transition-colors" />
                    <span className="text-sm font-bold text-slate-500 group-hover/date:text-[#655ac1] transition-colors">
                      {formattedDate}
                    </span>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </div>
                </div>

                <button onClick={() => changeDate(-1)} className="p-2.5 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-[#655ac1] hover:shadow-sm transition-all active:scale-95">
                  <ChevronLeft size={20} />
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 relative z-10 w-full sm:w-auto">
                {(!isWeekend && !!currentDayAssignment) && (
                  <>
                    {isAlreadyRecorded && (
                      <Badge variant="info" className="px-3 py-1.5 text-xs font-bold shadow-sm bg-[#e5e1fe] text-[#655ac1] border-none">مرصود مسبقاً</Badge>
                    )}
                    <button
                      onClick={markAllPresent}
                      className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all hover:scale-105 active:scale-95 border border-emerald-600/20 w-full sm:w-auto"
                    >
                      <Check size={18} />
                      <span>حاضر للكل</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Weekend Notice */}
            {isWeekend && (
              <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-10 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5e1fe]/30 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto bg-[#e5e1fe] rounded-3xl flex items-center justify-center text-[#655ac1] mb-4 shadow-sm">
                    <Calendar size={40} />
                  </div>
                  <p className="font-black text-2xl text-slate-700 mb-2">إجازة رسمية</p>
                  <p className="text-sm font-medium text-slate-500">تمتع بعطلة نهاية الأسبوع.</p>
                </div>
              </div>
            )}

            {/* No assignment */}
            {!isWeekend && !currentDayAssignment && (
              <div className="bg-amber-50 border border-amber-100/50 rounded-[2rem] p-10 text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110 duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto bg-amber-100 rounded-3xl flex items-center justify-center text-amber-500 mb-4 shadow-sm">
                    <AlertTriangle size={40} />
                  </div>
                  <p className="font-black text-2xl text-amber-700 mb-2">لم يتم تعيين مناوبين لهذا اليوم</p>
                  <p className="text-sm font-medium text-amber-500">يُرجى إعداد جدول المناوبة أولاً لتتمكن من رصد الحضور ومتابعة التقارير.</p>
                </div>
              </div>
            )}

            {/* Monitoring Table */}
            {!isWeekend && currentDayAssignment && (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-[#e5e1fe] text-[#655ac1] rounded-xl"><Eye size={22} /></div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">
                        رصد الحضور للمناوبين - {dayName}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">تسجيل حالات الحضور والانصراف للمناوبين وإدارة تقاريرهم</p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs font-bold bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                    <span className="px-3 py-1.5 rounded-lg bg-green-100 text-green-700">{todayStats.present} حاضر</span>
                    <span className="px-3 py-1.5 rounded-lg bg-red-100 text-red-700">{todayStats.absent} غائب</span>
                    <span className="px-3 py-1.5 rounded-lg bg-amber-100 text-amber-700">{todayStats.late} متأخر</span>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-800 border-b border-slate-200">
                        <th className="py-4 px-4 text-right font-black">المناوب</th>
                        <th className="py-4 px-4 text-center font-black">النوع</th>
                        <th className="py-4 px-4 text-center font-black">الحالة</th>
                        <th className="py-4 px-4 text-center font-black">وقت الانسحاب (إن وجد)</th>
                        <th className="py-4 px-4 text-center font-black">التقرير الختامي</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dutyStaffList.map(sup => {
                        const currentStatus = sup.status;
                        return (
                          <tr key={sup.staffId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-sm border ${
                                  sup.staffType === 'teacher' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-[#e5e1fe] text-[#655ac1] border-[#655ac1]/20'
                                }`}>
                                  {sup.staffType === 'teacher' ? 'م' : 'إ'}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-700">{sup.staffName}</span>
                                  {sup.staffType === 'teacher' && sup.lastPeriod && (
                                    <span className="text-[10px] text-slate-400">ينتهي الحصة {sup.lastPeriod}</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <Badge variant={sup.staffType === 'teacher' ? 'info' : 'neutral'}>
                                {sup.staffType === 'teacher' ? 'معلم' : 'إداري'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex justify-center gap-1.5 flex-nowrap w-max mx-auto">
                                {(Object.entries(STATUS_MAP) as [SupervisionAttendanceStatus, any][]).map(([status, config]) => (
                                  <button
                                    key={status}
                                    onClick={() => saveAttendanceStatus(status, sup.staffId)}
                                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap active:scale-95 flex-shrink-0 ${
                                      currentStatus === status
                                        ? config.color + ' ring-2 ring-offset-1 ring-current/20 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                                    title={config.label}
                                  >
                                    {config.label}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {currentStatus === 'withdrawn' ? (
                                <input
                                  type="time"
                                  value={withdrawalTimes[sup.staffId] || sup.withdrawalTime || ''}
                                  onChange={e => {
                                    setWithdrawalTimes(prev => ({ ...prev, [sup.staffId]: e.target.value }));
                                    saveAttendanceStatus(currentStatus, sup.staffId);
                                  }}
                                  className="w-24 px-2 py-1 rounded border border-slate-200 text-xs outline-none focus:ring-1 focus:ring-[#655ac1]/30 text-center"
                                />
                              ) : (
                                <span className="text-slate-300 text-xs">-</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              {sup.isSubmitted ? (
                                <div className="flex items-center justify-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 text-xs font-bold w-max mx-auto">
                                  <CheckCircle size={14} /> تم تسليم التقرير
                                </div>
                              ) : (
                                <div className="text-[#655ac1] text-xs font-bold">بانتظار التسليم</div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Auto-save indicator */}
                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 justify-center sm:justify-start bg-slate-50 py-2 px-4 rounded-xl w-max">
                  <Save size={14} className="text-emerald-500" />
                  يتم حفظ التعديلات تلقائياً
                </div>
              </div>
            )}

            {/* Weekly Stats Summary */}
            {!isWeekend && (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#e5e1fe] text-[#655ac1] rounded-2xl flex items-center justify-center shadow-sm">
                      <Eye size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800">ملخص الأداء الإجمالي</h3>
                      <p className="text-sm font-medium text-slate-500 mt-0.5">إحصائيات المناوبة لجميع الأيام المسجلة</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  <div className="bg-white shadow-sm rounded-2xl p-4 text-center border border-slate-200 transition-transform hover:scale-105">
                    <p className="text-3xl font-black text-green-600 mb-1">{stats.present}</p>
                    <p className="text-sm font-bold text-green-600">حاضر</p>
                  </div>
                  <div className="bg-white shadow-sm rounded-2xl p-4 text-center border border-slate-200 transition-transform hover:scale-105">
                    <p className="text-3xl font-black text-red-600 mb-1">{stats.absent}</p>
                    <p className="text-sm font-bold text-red-600">غائب</p>
                  </div>
                  <div className="bg-white shadow-sm rounded-2xl p-4 text-center border border-slate-200 transition-transform hover:scale-105">
                    <p className="text-3xl font-black text-blue-600 mb-1">{stats.excused}</p>
                    <p className="text-sm font-bold text-blue-600">مستأذن</p>
                  </div>
                  <div className="bg-white shadow-sm rounded-2xl p-4 text-center border border-slate-200 transition-transform hover:scale-105">
                    <p className="text-3xl font-black text-orange-600 mb-1">{stats.withdrawn}</p>
                    <p className="text-sm font-bold text-orange-600">منسحب</p>
                  </div>
                  <div className="bg-white shadow-sm rounded-2xl p-4 text-center border border-slate-200 transition-transform hover:scale-105">
                    <p className="text-3xl font-black text-amber-600 mb-1">{stats.late}</p>
                    <p className="text-sm font-bold text-amber-600">متأخر</p>
                  </div>
                  <div className="bg-white shadow-sm rounded-2xl p-4 text-center border border-slate-200 transition-transform hover:scale-105">
                    <p className="text-3xl font-black text-[#655ac1] mb-1">{stats.submitted}</p>
                    <p className="text-sm font-bold text-[#655ac1]">تقرير مُسلم</p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DutyMonitoringModal;

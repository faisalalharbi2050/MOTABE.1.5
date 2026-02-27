import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Eye, Settings, Calendar, Download, Send, Printer,
  CheckCircle, AlertTriangle, Shield, Clock, Plus, Trash2, Edit,
  RefreshCw, BarChart3, MessageSquare, ChevronDown, ChevronUp,
  GripVertical, Copy, Search, Filter, X, Save, AlertCircle,
  UserCheck, UserX, Info, Bell, Zap, FileText, Check
} from 'lucide-react';
import {
  SchoolInfo, Teacher, Admin, ScheduleSettingsData, Phase,
  SupervisionScheduleData, SupervisionLocation, SupervisionPeriodConfig,
  SupervisionStaffExclusion, SupervisionDayAssignment, SupervisionStaffAssignment,
  SupervisionAttendanceRecord, SupervisionAttendanceStatus, SupervisionSettings,
  TimingConfig
} from '../types';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import {
  DAYS, DAY_NAMES, LOCATION_CATEGORIES, FLOOR_NAMES,
  getDefaultLocations, getDefaultSupervisionData, getTimingConfig,
  hasTimingData, getSupervisionPeriods, getAvailableStaff,
  shouldSuggestExcludeTeachers, getSuggestedCountPerDay,
  generateSmartAssignment, validateGoldenRule, getBalanceInfo,
  getAttendanceStats, generateAssignmentMessage, generateReminderMessage,
  getSupervisionPrintData, detectScheduleChanges
} from '../utils/supervisionUtils';

// ===== Sub-component imports =====
// ===== Sub-component imports =====
import SupervisionScheduleBuilder from './supervision/SupervisionScheduleBuilder';
import TimingPopup from './supervision/TimingPopup';
import SupervisionSettingsPage from './supervision/SupervisionSettingsPage';
import SupervisionMonitoringModal from './supervision/modals/SupervisionMonitoringModal';
import SupervisionPrintModal from './supervision/modals/SupervisionPrintModal';
import SupervisionMessagingModal from './supervision/modals/SupervisionMessagingModal';
import SupervisionReportsModal from './supervision/modals/SupervisionReportsModal';
import SupervisionManageSchedulesModal from './supervision/modals/SupervisionManageSchedulesModal';
import SupervisionCreateScheduleModal from './supervision/modals/SupervisionCreateScheduleModal';

interface DailySupervisionProps {
  schoolInfo: SchoolInfo;
  setSchoolInfo: React.Dispatch<React.SetStateAction<SchoolInfo>>;
  teachers: Teacher[];
  admins: Admin[];
  scheduleSettings: ScheduleSettingsData;
}

type TabId = 'settings' | 'schedule' | 'monitoring' | 'reports';

const DailySupervision: React.FC<DailySupervisionProps> = ({
  schoolInfo, setSchoolInfo, teachers, admins, scheduleSettings
}) => {
  // ===== State =====
  const [activeSchoolTab, setActiveSchoolTab] = useState<string>('main');
  const [showTimingPopup, setShowTimingPopup] = useState(false);
  const [showSettingsPage, setShowSettingsPage] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [scheduleChangeAlert, setScheduleChangeAlert] = useState(false);
  
  // Modals state
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isManageSchedulesOpen, setIsManageSchedulesOpen] = useState(false);
  const [isCreateScheduleOpen, setIsCreateScheduleOpen] = useState(false);
  
  // Confirmation state
  const [showGlobalDeleteConfirm, setShowGlobalDeleteConfirm] = useState(false);

  const [supervisionData, setSupervisionData] = useState<SupervisionScheduleData>(() => {
    const saved = localStorage.getItem('supervision_data_v1');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return getDefaultSupervisionData(schoolInfo);
  });

  // ===== Persistence =====
  useEffect(() => {
    localStorage.setItem('supervision_data_v1', JSON.stringify(supervisionData));
  }, [supervisionData]);

  // ===== Timing Check =====
  useEffect(() => {
    if (!hasTimingData(schoolInfo)) {
      setShowTimingPopup(true);
    }
  }, [schoolInfo]);

  // ===== Schedule Change Detection =====
  const prevTimetableRef = React.useRef(scheduleSettings.timetable);
  useEffect(() => {
    if (prevTimetableRef.current !== scheduleSettings.timetable && supervisionData.dayAssignments.length > 0) {
      const changes = detectScheduleChanges(
        prevTimetableRef.current,
        scheduleSettings.timetable,
        supervisionData.dayAssignments
      );
      if (changes.hasChanges) {
        setScheduleChangeAlert(true);
        showToast('تم تغيير جدول الحصص - يُرجى مراجعة الإشراف اليومي', 'warning');
      }
    }
    prevTimetableRef.current = scheduleSettings.timetable;
  }, [scheduleSettings.timetable]);

  // ===== Sync periods from timing =====
  useEffect(() => {
    const newPeriods = getSupervisionPeriods(schoolInfo);
    if (newPeriods.length > 0 && supervisionData.periods.length === 0) {
      setSupervisionData(prev => ({ ...prev, periods: newPeriods }));
    }
  }, [schoolInfo.timing]);

  // ===== Toast =====
  const showToast = useCallback((message: string, type: 'success' | 'warning' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ===== Computed values =====
  const timing = useMemo(() => getTimingConfig(schoolInfo), [schoolInfo]);
  const availableStaff = useMemo(
    () => getAvailableStaff(teachers, admins, supervisionData.exclusions, supervisionData.settings),
    [teachers, admins, supervisionData.exclusions, supervisionData.settings]
  );
  const suggestExcludeTeachers = useMemo(() => shouldSuggestExcludeTeachers(admins), [admins]);
  const suggestedCount = useMemo(
    () => getSuggestedCountPerDay(availableStaff.length, timing.activeDays?.length || 5),
    [availableStaff.length, timing]
  );
  const balanceInfo = useMemo(
    () => getBalanceInfo(supervisionData.dayAssignments),
    [supervisionData.dayAssignments]
  );
  const goldenRuleCheck = useMemo(
    () => validateGoldenRule(supervisionData.dayAssignments),
    [supervisionData.dayAssignments]
  );

  // ===== Handlers =====
  const handleAutoAssign = () => {
    const assignments = generateSmartAssignment(
      teachers, admins, supervisionData.exclusions, supervisionData.settings,
      scheduleSettings, schoolInfo, supervisionData.periods,
      supervisionData.settings.suggestedCountPerDay || suggestedCount
    );
    setSupervisionData(prev => ({ ...prev, dayAssignments: assignments }));
    showToast('تم التوزيع الذكي بنجاح', 'success');
  };

  const handleApprove = () => {
    if (!goldenRuleCheck.valid) {
      showToast('يوجد موظفون مكررون في أكثر من يوم - يُرجى مراجعة التوزيع', 'error');
      return;
    }
    setSupervisionData(prev => ({
      ...prev,
      isApproved: true,
      approvedAt: new Date().toISOString(),
    }));
    showToast('تم اعتماد جدول الإشراف', 'success');
  };

  const handleDeleteCurrentSchedule = () => {
    setSupervisionData(prev => ({
      ...prev,
      dayAssignments: [],
      isApproved: false,
      activeScheduleId: undefined, // Deselect saved schedule
      savedSchedules: (prev.savedSchedules || []).filter(s => s.id !== prev.activeScheduleId) // Delete from saved list if active
    }));
    setShowGlobalDeleteConfirm(false);
    showToast('تم حذف الجدول بالكامل من النظام', 'success');
  };

  // ===== Shared Schools Tabs =====
  const sharedSchools = schoolInfo.sharedSchools || [];
  const hasSharedSchools = sharedSchools.length > 0;

  // ===== Settings Page =====
  if (showSettingsPage) {
    return (
      <SupervisionSettingsPage
        onBack={() => setShowSettingsPage(false)}
        teachers={teachers}
        admins={admins}
        totalStaffCount={availableStaff.length}
        exclusions={supervisionData.exclusions}
        setExclusions={(excs) => setSupervisionData(prev => ({
          ...prev,
          exclusions: typeof excs === 'function' ? excs(prev.exclusions) : excs,
        }))}
        settings={supervisionData.settings}
        setSettings={(s) => setSupervisionData(prev => ({
          ...prev,
          settings: typeof s === 'function' ? s(prev.settings) : s,
        }))}
        availableCount={availableStaff.length}
        suggestExclude={suggestExcludeTeachers}
        locations={supervisionData.locations}
        setLocations={(locs) => setSupervisionData(prev => ({
          ...prev,
          locations: typeof locs === 'function' ? locs(prev.locations) : locs,
        }))}
        periods={supervisionData.periods}
        setPeriods={(periods) => setSupervisionData(prev => ({
          ...prev,
          periods: typeof periods === 'function' ? periods(prev.periods) : periods,
        }))}
        schoolInfo={schoolInfo}
        showToast={showToast}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* ══════ Header ══════ */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-md transition-all duration-300 overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5e1fe] rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110 duration-500"></div>

        <div className="flex justify-between items-start relative z-10">
          <div>
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-[#e5e1fe] text-[#655ac1] rounded-xl"><Eye size={24} /></div>
              الإشراف اليومي
            </h3>
            <p className="text-slate-500 font-medium mt-2 mr-12 max-w-2xl text-sm leading-relaxed">
              إدارة الإشراف اليومي على الطلاب أثناء اليوم الدراسي بطريقة ذكية.
            </p>
          </div>
        </div>
      </div>

      {/* ══════ Toolbar / Action Bar ══════ */}
      <div className="flex flex-col gap-4 mb-6">
        {/* ROW 1 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Right Side */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSettingsPage(true)}
              className="flex items-center gap-2 bg-[#8779fb] text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm shadow-[#8779fb]/20 hover:scale-105 active:scale-95"
            >
              <Settings size={18} className="text-white" />
              <span className="text-white">إعدادات الإشراف</span>
            </button>
            <button
              onClick={() => setIsCreateScheduleOpen(true)}
              className="flex items-center gap-2 bg-[#655ac1] text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-[#655ac1]/20 transition-all hover:scale-105 active:scale-95"
            >
              <Zap size={18} />
              <span>إنشاء الجدول</span>
            </button>
          </div>

          {/* Left Side */}
          <div className="flex flex-wrap items-center gap-2">
          </div>
        </div>

        {/* ROW 2 */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
           {/* Right Side */}
           <div className="flex flex-wrap items-center gap-2">
             <button
               onClick={() => setIsMonitoringOpen(true)}
               className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition-all hover:border-[#655ac1] hover:text-[#655ac1]"
             >
               <Eye size={18} className="text-[#655ac1]" />
               <span>المتابعة اليومية</span>
             </button>
             <button
               onClick={() => setIsReportsOpen(true)}
               className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition-all hover:border-[#655ac1] hover:text-[#655ac1]"
             >
               <BarChart3 size={18} className="text-[#655ac1]" />
               <span>تقارير الإشراف</span>
             </button>
           </div>

           {/* Left Side */}
           <div className="flex flex-wrap items-center gap-2">
             <button
               onClick={() => setIsManageSchedulesOpen(true)}
               className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition-all hover:border-[#655ac1] hover:text-[#655ac1]"
             >
               <Save size={18} className="text-[#655ac1]" />
               <span>إدارة الجداول</span>
             </button>
             <button
               onClick={() => setIsPrintOpen(true)}
               className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition-all hover:border-[#655ac1] hover:text-[#655ac1]"
             >
               <Printer size={18} className="text-[#655ac1]" />
               <span>طباعة الجدول</span>
             </button>
             <button
               onClick={() => setIsMessagingOpen(true)}
               className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition-all hover:border-[#655ac1] hover:text-[#655ac1]"
             >
               <Send size={18} className="text-[#655ac1]" />
               <span>إرسال</span>
             </button>

             {!showGlobalDeleteConfirm ? (
               <button
                 onClick={() => setShowGlobalDeleteConfirm(true)}
                 className="flex items-center gap-2 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 px-4 py-2.5 rounded-xl font-bold transition-all hover:border-rose-300"
               >
                 <Trash2 size={18} className="text-rose-500" />
                 <span>حذف الجدول</span>
               </button>
             ) : (
               <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl animate-in slide-in-from-left-4">
                 <span className="text-xs font-bold text-rose-700 mx-2">أنت متأكد؟ سيتم حذفه من القائمة المحفوظة أيضاً.</span>
                 <button
                   onClick={handleDeleteCurrentSchedule}
                   className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors"
                 >
                   نعم، احذف
                 </button>
                 <button
                   onClick={() => setShowGlobalDeleteConfirm(false)}
                   className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-xs font-bold rounded-lg transition-colors hover:bg-slate-50"
                 >
                   تراجع
                 </button>
               </div>
             )}
           </div>
        </div>
      </div>


      {/* Admin Suggestion Banner */}
      {suggestExcludeTeachers && !supervisionData.settings.autoExcludeTeachersWhen5Admins && (
        <div className="bg-[#fcfbff] border-2 border-[#8779fb]/30 rounded-2xl p-5 mb-6 flex items-start gap-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 bg-[#655ac1] h-full rounded-r-2xl"></div>
          <div className="w-10 h-10 rounded-xl bg-[#e5e1fe] flex items-center justify-center shrink-0">
            <Info size={22} className="text-[#655ac1]" />
          </div>
          <div className="flex-1">
            <p className="text-base font-black text-slate-800">
              يوجد 5 إداريين أو أكثر - يُقترح استثناء المعلمين الممارسين من الإشراف
            </p>
            <p className="text-sm font-medium text-slate-500 mt-1">
              لتقليل العبء على المعلمين الممارسين للتدريس، ينصح بتفعيل الاستثناء للوصول إلى إدارة أفضل ومريحة للجميع. يمكنك تفعيل هذا الخيار من إعدادات الاستثناءات.
            </p>
          </div>
          <button
            onClick={() => {
              setSupervisionData(prev => ({
                ...prev,
                settings: { ...prev.settings, autoExcludeTeachersWhen5Admins: true },
              }));
              showToast('تم تفعيل استثناء المعلمين الممارسين', 'success');
            }}
            className="shrink-0 px-6 py-2.5 bg-[#655ac1] hover:bg-[#5046a0] text-white text-sm font-bold rounded-xl transition-all shadow-md mt-auto mb-auto hover:scale-105 active:scale-95"
          >
            تفعيل التلقائي
          </button>
        </div>
      )}

      {/* Schedule Change Alert */}
      {scheduleChangeAlert && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-5 mb-6 flex items-start gap-4 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1 bg-amber-500 h-full rounded-r-2xl"></div>
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-base font-black text-amber-900">
              تم تعديل جدول الحصص - يُرجى مراجعة توزيع الإشراف
            </p>
            <p className="text-sm font-medium text-amber-700/80 mt-1">
              قد تكون هناك فراغات جديدة أو تغيرات يمكن الاستفادة منها. يُنصح بإعادة التوزيع.
            </p>
          </div>
          <div className="flex gap-2 items-center mt-auto mb-auto">
            <button
              onClick={() => {
                handleAutoAssign();
                setScheduleChangeAlert(false);
              }}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95"
            >
              <RefreshCw size={16} />
              <span>إعادة التوزيع</span>
            </button>
            <button
              onClick={() => setScheduleChangeAlert(false)}
              className="p-2.5 text-slate-400 hover:bg-amber-100 hover:text-slate-600 rounded-xl transition-colors"
              title="إغلاق التنبيه"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area - Schedule Viewer and Builder */}
      <div id="schedule-builder-section" className="mt-2">
         <SupervisionScheduleBuilder
            supervisionData={supervisionData}
            setSupervisionData={setSupervisionData}
            teachers={teachers}
            admins={admins}
            scheduleSettings={scheduleSettings}
            schoolInfo={schoolInfo}
            suggestedCount={suggestedCount}
            showToast={showToast}
          />
      </div>

      {/* ══════ Modals ══════ */}
       <SupervisionMonitoringModal
         isOpen={isMonitoringOpen}
         onClose={() => setIsMonitoringOpen(false)}
         supervisionData={supervisionData}
         setSupervisionData={setSupervisionData}
         schoolInfo={schoolInfo}
         showToast={showToast}
       />

       <SupervisionPrintModal
         isOpen={isPrintOpen}
         onClose={() => setIsPrintOpen(false)}
         supervisionData={supervisionData}
         schoolInfo={schoolInfo}
         showToast={showToast}
       />

       <SupervisionMessagingModal
         isOpen={isMessagingOpen}
         onClose={() => setIsMessagingOpen(false)}
         supervisionData={supervisionData}
         schoolInfo={schoolInfo}
         teachers={teachers}
         admins={admins}
         showToast={showToast}
       />

       <SupervisionManageSchedulesModal
         isOpen={isManageSchedulesOpen}
         onClose={() => setIsManageSchedulesOpen(false)}
         supervisionData={supervisionData}
         setSupervisionData={setSupervisionData}
         showToast={showToast}
       />

       <SupervisionReportsModal
         isOpen={isReportsOpen}
         onClose={() => setIsReportsOpen(false)}
         supervisionData={supervisionData}
         schoolInfo={schoolInfo}
         showToast={showToast}
       />

       <SupervisionCreateScheduleModal
         isOpen={isCreateScheduleOpen}
         onClose={() => setIsCreateScheduleOpen(false)}
         supervisionData={supervisionData}
         setSupervisionData={setSupervisionData}
         teachers={teachers}
         admins={admins}
         scheduleSettings={scheduleSettings}
         schoolInfo={schoolInfo}
         suggestedCount={suggestedCount}
         showToast={showToast}
         activeDaysCount={timing.activeDays?.length || 5}
         availableStaffCount={availableStaff.length}
       />

      {/* Timing Popup */}
      {showTimingPopup && (
        <TimingPopup
          schoolInfo={schoolInfo}
          setSchoolInfo={setSchoolInfo}
          onClose={() => setShowTimingPopup(false)}
          showToast={showToast}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`flex items-center gap-3 px-6 py-3.5 rounded-2xl shadow-xl border font-bold text-sm
            ${toast.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : ''}
            ${toast.type === 'warning' ? 'bg-amber-50 text-amber-800 border-amber-200' : ''}
            ${toast.type === 'error' ? 'bg-red-50 text-red-800 border-red-200' : ''}
          `}>
            {toast.type === 'success' && <CheckCircle size={18} />}
            {toast.type === 'warning' && <AlertTriangle size={18} />}
            {toast.type === 'error' && <AlertCircle size={18} />}
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySupervision;

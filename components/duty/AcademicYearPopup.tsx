import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Check, AlertCircle } from 'lucide-react';
import { SchoolInfo, SemesterInfo } from '../../types';
import { Button } from '../ui/Button';
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";

interface Props {
  schoolInfo: SchoolInfo;
  setSchoolInfo: React.Dispatch<React.SetStateAction<SchoolInfo>>;
  onClose: () => void;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const AcademicYearPopup: React.FC<Props> = ({ schoolInfo, setSchoolInfo, onClose, showToast }) => {
  const [academicYear, setAcademicYear] = useState(schoolInfo.academicYear || '');
  const existingSemester: Partial<SemesterInfo> = schoolInfo.semesters?.[0] || {};
  const [semester, setSemester] = useState<Partial<SemesterInfo>>({
    name: existingSemester.name || 'الفصل الدراسي الحالي',
    calendarType: existingSemester.calendarType || 'hijri',
    weeksCount: existingSemester.weeksCount || 18,
    startDate: existingSemester.startDate || '',
    endDate: existingSemester.endDate || '',
    holidays: existingSemester.holidays || []
  });

  const [holidayDates, setHolidayDates] = useState<DateObject[]>([]);

  const formatDate = (date: any) => {
    if (!date) return '';
    if (date instanceof DateObject) return date.format("YYYY-MM-DD");
    return date.toString();
  };

  const handleSave = () => {
    if (!academicYear || !semester.name || !semester.startDate || !semester.endDate) {
      showToast('يرجى تعبئة الحقول الأساسية أولاً', 'error');
      return;
    }

    const holidaysStrings = holidayDates.map(d => formatDate(d));

    const newSemester: SemesterInfo = {
      id: Date.now().toString(),
      name: semester.name,
      calendarType: semester.calendarType as 'hijri' | 'gregorian',
      startDate: formatDate(semester.startDate),
      endDate: formatDate(semester.endDate),
      weeksCount: semester.weeksCount || 18,
      holidays: holidaysStrings,
    };

    setSchoolInfo(prev => ({
      ...prev,
      academicYear,
      semesters: [newSemester], // Replace or initialize with this semester
      currentSemesterId: newSemester.id
    }));

    showToast('تم حفظ بيانات العام الدراسي بنجاح', 'success');
    onClose();
  };

  return (
    <>
      <style>{`
        .rmdp-wrapper,
        .rmdp-container .rmdp-ep-arrow {
          z-index: 100000 !important;
        }
      `}</style>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-5 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#e5e1fe] rounded-xl flex items-center justify-center">
              <AlertCircle size={20} className="text-[#655ac1]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">استكمال بيانات العام الدراسي</h3>
              <p className="text-xs text-slate-400">يلزم إدخال تواريخ الدراسة لبناء الجدول المناوبة بشكل صحيح</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6 bg-slate-50/50">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700 font-medium leading-relaxed">
            لبناء نظام المناوبة وجدول التوزيع بدقة، نحتاج للتعرف على عدد أسابيع الدراسة الفعلية وتحديد تواريخ البداية والنهاية للفصل الدراسي حتى يتم توزيع المناوبين على الأسابيع
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* Calendar Type */}
               <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">نوع التقويم</label>
                  <div className="flex gap-2 bg-slate-50 border border-slate-200 p-1 rounded-xl">
                      <button 
                        onClick={() => setSemester({...semester, calendarType: 'hijri', startDate: '', endDate: '', holidays: []})}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${semester.calendarType === 'hijri' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        هجري
                      </button>
                      <button 
                        onClick={() => setSemester({...semester, calendarType: 'gregorian', startDate: '', endDate: '', holidays: []})}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${semester.calendarType === 'gregorian' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                      >
                        ميلادي
                      </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">العام الدراسي</label>
                  <input 
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-slate-50"
                    placeholder="مثال: 1447هـ"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">اسم الفصل الدراسي</label>
                  <input 
                    value={semester.name}
                    onChange={e => setSemester({...semester, name: e.target.value})}
                    className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-slate-50"
                    placeholder="مثال: الفصل الدراسي الأول"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">عدد الأسابيع الإجمالي</label>
                  <div className="relative">
                      <select 
                        value={semester.weeksCount || 18}
                        onChange={e => setSemester({...semester, weeksCount: parseInt(e.target.value)})}
                        className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-slate-50"
                      >
                        {Array.from({length: 40}, (_, i) => i + 1).map(num => (
                          <option key={num} value={num}>{num} أسبوع</option>
                        ))}
                      </select>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          <span className="text-xs">▼</span>
                      </div>
                  </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">تاريخ البداية (إلزامي)</label>
                      <DatePicker 
                        value={semester.startDate}
                        onChange={(date) => setSemester({...semester, startDate: formatDate(date)})}
                        calendar={semester.calendarType === 'hijri' ? arabic : gregorian}
                        locale={semester.calendarType === 'hijri' ? arabic_ar : gregorian_ar}
                        containerClassName="w-full relative z-[60]"
                        inputClass="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-slate-50"
                        placeholder="حدد التاريخ"
                        style={{ width: "100%", height: "42px", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}
                        fixMainPosition={true}
                        portal
                        zIndex={100000}
                      />
                  </div>
                  <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">تاريخ النهاية (إلزامي)</label>
                      <DatePicker 
                        value={semester.endDate}
                        onChange={(date) => setSemester({...semester, endDate: formatDate(date)})}
                        calendar={semester.calendarType === 'hijri' ? arabic : gregorian}
                        locale={semester.calendarType === 'hijri' ? arabic_ar : gregorian_ar}
                        containerClassName="w-full relative z-[50]"
                        inputClass="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-slate-50"
                        placeholder="حدد التاريخ"
                        style={{ width: "100%", height: "42px", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}
                        fixMainPosition={true}
                        portal
                        zIndex={100000}
                      />
                  </div>
                </div>

                {/* Holidays Multi-Select */}
                <div className="md:col-span-2 mt-2">
                  <label className="text-xs font-bold text-slate-500 block mb-1">أيام الإجازات الرسمية (تُستثنى من التوزيع)</label>
                  <DatePicker 
                     multiple
                     value={holidayDates}
                     onChange={(dates) => setHolidayDates(dates as DateObject[])}
                     calendar={semester.calendarType === 'hijri' ? arabic : gregorian}
                     locale={semester.calendarType === 'hijri' ? arabic_ar : gregorian_ar}
                     containerClassName="w-full relative z-[40]"
                     inputClass="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-slate-50"
                     placeholder="حدد أيام الإجازات الرسمية لمنع إسناد المناوبة فيها"
                     style={{ width: "100%", minHeight: "42px", borderRadius: "0.75rem", border: "1px solid #e2e8f0" }}
                     fixMainPosition={true}
                     portal
                     zIndex={100000}
                     animations={[]}
                  />
                  <p className="text-[10px] text-slate-400 mt-1 mr-1">يمكنك تحديد عدة أيام بالضغط عليها في التقويم</p>
                </div>
                 {/* Empty space to allow scrolling for the calendar */}
                 <div className="h-32 md:col-span-2"></div>

             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-5 rounded-b-2xl flex justify-end gap-3 z-10">
          <Button variant="ghost" onClick={onClose}>إلغاء</Button>
          <Button 
            variant="primary" 
            icon={Check} 
            onClick={handleSave}
            disabled={!academicYear || !semester.name || !semester.startDate || !semester.endDate}
          >
            حفظ واستمرار
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AcademicYearPopup;


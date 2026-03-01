import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Trash2, Check, Plus, AlertCircle, X, CheckCircle2, FileText } from 'lucide-react';
import { SemesterInfo } from '../../types';
import DatePicker, { DateObject } from "react-multi-date-picker";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";

interface SemesterManagerProps {
  semesters: SemesterInfo[];
  setSemesters: (semesters: SemesterInfo[]) => void;
  currentSemesterId?: string;
  setCurrentSemesterId: (id: string) => void;
  academicYear: string;
  onAcademicYearChange: (year: string) => void;
}

const SemesterManager: React.FC<SemesterManagerProps> = ({ 
  semesters, 
  setSemesters, 
  currentSemesterId, 
  setCurrentSemesterId,
  academicYear,
  onAcademicYearChange
}) => {
  const [showForm, setShowForm] = useState(semesters.length === 0);
  const [newSemester, setNewSemester] = useState<Partial<SemesterInfo>>({
    name: 'الفصل الدراسي الأول',
    calendarType: 'hijri',
    weeksCount: 18,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const formRef = React.useRef<HTMLDivElement>(null);

  // Helper to safely format DateObject or string to YYYY-MM-DD
  const formatDate = (date: any) => {
    if (!date) return '';
    if (date instanceof DateObject) {
      // Always convert to Gregorian to ensure JS Date compatibility internally
      const greg = new DateObject({ date, calendar: gregorian });
      return greg.format("YYYY-MM-DD");
    }
    return date.toString();
  };

  const getValidDate = (str: string | undefined | null) => {
    if (!str) return undefined;
    const d = new Date(str);
    return isNaN(d.getTime()) ? undefined : d;
  };

  const handleSaveSemester = () => {
    if (newSemester.name && newSemester.startDate && newSemester.endDate) {
      if (editingId) {
        // Update existing
        const updatedSemesters = semesters.map(s => s.id === editingId ? {
          ...s,
          name: newSemester.name!,
          calendarType: newSemester.calendarType as 'hijri' | 'gregorian',
          startDate: formatDate(newSemester.startDate),
          endDate: formatDate(newSemester.endDate),
          weeksCount: newSemester.weeksCount || 18,
        } : s);
        setSemesters(updatedSemesters);
      } else {
        // Add new
        const semester: SemesterInfo = {
          id: Date.now().toString(),
          name: newSemester.name!,
          calendarType: newSemester.calendarType as 'hijri' | 'gregorian',
          startDate: formatDate(newSemester.startDate),
          endDate: formatDate(newSemester.endDate),
          weeksCount: newSemester.weeksCount || 18,
        };
        
        const updatedSemesters = [...semesters, semester];
        setSemesters(updatedSemesters);
        
        if (updatedSemesters.length === 1) {
          setCurrentSemesterId(semester.id);
        }
      }
      
      handleCancel();
    }
  };

  const handleEditSemester = (semester: SemesterInfo) => {
    setNewSemester({
       name: semester.name,
       calendarType: semester.calendarType,
       startDate: semester.startDate,
       endDate: semester.endDate,
       weeksCount: semester.weeksCount
    });
    setEditingId(semester.id);
    setShowForm(true);
    // Scroll to form
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewSemester({
        name: 'الفصل الدراسي التالي',
        calendarType: 'hijri',
        weeksCount: 18,
        startDate: '',
        endDate: ''
    });
    setShowForm(false);
  };

  const handleDeleteSemester = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفصل الدراسي؟')) {
      const updated = semesters.filter(s => s.id !== id);
      setSemesters(updated);
      if (currentSemesterId === id && updated.length > 0) {
        setCurrentSemesterId(updated[0].id);
      } else if (updated.length === 0) {
        setCurrentSemesterId('');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-600 block">فصول ومكونات العام الدراسي</label>
        
        {!showForm && (
            <button 
              onClick={() => {
                setEditingId(null);
                setNewSemester({
                    name: 'الفصل الدراسي الأول',
                    calendarType: 'hijri',
                    weeksCount: 18,
                });
                setShowForm(true);
                setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
              }}
              className="text-xs font-bold text-primary flex items-center gap-1 hover:bg-primary/5 px-2 py-1 rounded-lg transition-colors"
            >
              <Plus size={14} /> إضافة
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {!showForm && semesters.length === 0 ? (
          <div className="col-span-full text-center p-8 bg-white rounded-xl border border-dashed border-slate-300">
            <Calendar className="mx-auto text-slate-400 mb-2" size={32} />
            <p className="text-sm text-slate-500">لم يتم إضافة العام والفصول الدراسية</p>
            <button 
                onClick={() => {
                  setShowForm(true);
                  setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
                }}
                className="text-xs font-bold text-primary hover:underline mt-2"
            >
                إضافة
            </button>
          </div>
        ) : (
          semesters.map(semester => (
            <div 
              key={semester.id}
              className={`p-4 rounded-xl border transition-all relative group ${
                currentSemesterId === semester.id 
                  ? 'bg-white border-emerald-200 shadow-sm ring-1 ring-emerald-100' 
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                   <h4 className="font-bold text-sm text-slate-800">{semester.name}</h4>
                   <div className="flex items-center gap-2 mt-1">
                       <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                           semester.calendarType === 'hijri' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                       }`}>
                         {semester.calendarType === 'hijri' ? 'هجري' : 'ميلادي'}
                       </span>
                       {currentSemesterId === semester.id && (
                            <span className="text-[10px] font-bold bg-purple-50 text-purple-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                                <CheckCircle2 size={10} /> الحالي
                            </span>
                       )}
                   </div>
                </div>
                
                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                   {currentSemesterId !== semester.id && (
                     <button 
                       onClick={() => setCurrentSemesterId(semester.id)}
                       className="p-1.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"
                       title="تعيين كفصل حالي"
                     >
                       <Check size={14} />
                     </button>
                   )}
                   <button 
                       onClick={() => handleEditSemester(semester)}
                       className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                       title="تعديل"
                     >
                       <FileText size={14} /> 
                     </button>
                   <button 
                     onClick={() => handleDeleteSemester(semester.id)}
                     className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-100"
                     title="حذف"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                 <div>
                    <span className="text-slate-400">البداية: </span> <span dir="ltr" className="font-medium text-slate-700">{semester.startDate}</span>
                 </div>
                 <div>
                    <span className="text-slate-400">النهاية: </span> <span dir="ltr" className="font-medium text-slate-700">{semester.endDate}</span>
                 </div>
                 <div className="col-span-2 pt-1 border-t border-slate-200/50 mt-1">
                    <span className="text-slate-400">المدة: </span> <span className="font-medium text-slate-700">{semester.weeksCount} أسبوع</span>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inline Add/Edit Form */}
      {showForm && (
          <div ref={formRef} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mt-6 animate-in slide-in-from-top-2 duration-300">
              <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    {editingId ? (
                        <>
                            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><FileText size={16} /></div>
                            تعديل فصل دراسي
                        </>
                    ) : (
                        <>
                            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Plus size={16} /></div>
                            إضافة عام وفصل دراسي
                        </>
                    )}
                  </h3>
                  <button onClick={handleCancel} className="text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 p-1.5 rounded-lg transition-colors">
                    <X size={16} />
                  </button>
              </div>
              
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     
                     {/* Calendar Type - Moved to First Position */}
                     <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">نوع التقويم</label>
                      <div className="flex gap-2 bg-white border border-slate-200 p-1 rounded-xl">
                          <button 
                            onClick={() => setNewSemester({...newSemester, calendarType: 'hijri', startDate: '', endDate: ''})}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${newSemester.calendarType === 'hijri' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            هجري
                          </button>
                          <button 
                            onClick={() => setNewSemester({...newSemester, calendarType: 'gregorian', startDate: '', endDate: ''})}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${newSemester.calendarType === 'gregorian' ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            ميلادي
                          </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">العام الدراسي</label>
                      <input 
                        value={academicYear}
                        onChange={(e) => onAcademicYearChange(e.target.value)}
                        className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                        placeholder="مثال: 1447هـ"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">اسم الفصل الدراسي</label>
                      <input 
                        value={newSemester.name}
                        onChange={e => setNewSemester({...newSemester, name: e.target.value})}
                        className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                        placeholder="مثال: الفصل الدراسي الأول"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">تاريخ البداية</label>
                        <div className="relative">
                            <DatePicker 
                              value={getValidDate(newSemester.startDate)}
                              onChange={(date) => setNewSemester({...newSemester, startDate: formatDate(date)})}
                              calendar={newSemester.calendarType === 'hijri' ? arabic : gregorian}
                              locale={newSemester.calendarType === 'hijri' ? arabic_ar : gregorian_ar}
                              containerClassName="w-full"
                              inputClass="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                              placeholder="حدد التاريخ"
                              portal
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "10px",
                                borderRadius: "0.75rem",
                                border: "1px solid #e2e8f0",
                                fontSize: "0.875rem",
                                height: "42px",
                                backgroundColor: "white"
                              }}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 block mb-1">تاريخ النهاية</label>
                        <div className="relative">
                            <DatePicker 
                              value={getValidDate(newSemester.endDate)}
                              onChange={(date) => setNewSemester({...newSemester, endDate: formatDate(date)})}
                              calendar={newSemester.calendarType === 'hijri' ? arabic : gregorian}
                              locale={newSemester.calendarType === 'hijri' ? arabic_ar : gregorian_ar}
                              containerClassName="w-full"
                              inputClass="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none bg-white"
                              placeholder="حدد التاريخ"
                              portal
                              style={{
                                width: "100%",
                                boxSizing: "border-box",
                                padding: "10px",
                                borderRadius: "0.75rem",
                                border: "1px solid #e2e8f0",
                                fontSize: "0.875rem",
                                height: "42px",
                                backgroundColor: "white"
                              }}
                            />
                        </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 block mb-1">عدد الأسابيع</label>
                      <div className="relative">
                          <select 
                            value={newSemester.weeksCount || 18}
                            onChange={e => setNewSemester({...newSemester, weeksCount: parseInt(e.target.value)})}
                            className="w-full p-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none appearance-none bg-white"
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
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-200/50">
                      <button 
                        onClick={handleCancel}
                        className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-200/50 rounded-xl transition-colors"
                      >
                        إلغاء
                      </button>
                      <button 
                        onClick={handleSaveSemester}
                        disabled={!newSemester.name || !newSemester.startDate || !newSemester.endDate}
                        className="px-10 py-2.5 text-sm font-bold text-white bg-primary hover:bg-secondary rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-primary/20 min-w-[150px]"
                      >
                        {editingId ? 'حفظ التعديلات' : 'إضافة'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SemesterManager;

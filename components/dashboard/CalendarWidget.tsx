import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, Calendar as CalendarIcon, X } from 'lucide-react';
import { CalendarEvent } from '../../types';

interface CalendarWidgetProps {
  events: CalendarEvent[];
  onAddEvent: () => void;
}

const CalendarWidget: React.FC<CalendarWidgetProps> = ({ events, onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarType, setCalendarType] = useState<'gregorian' | 'hijri'>('gregorian');
  const [showEventModal, setShowEventModal] = useState(false);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const toHijri = (date: Date) => {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
        day: 'numeric',
    }).format(date);
  };

  const renderDays = () => {
    const days = [];
    
    // Add empty slots
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 md:h-14"></div>);
    }
  
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <div key={i} className={`h-10 md:h-14 flex flex-col items-center justify-start pt-1 md:pt-2 relative rounded-xl transition-all duration-200 cursor-pointer group ${
            isToday 
                ? 'ring-2 ring-[#655ac1] text-[#655ac1] font-extrabold bg-[#655ac1]/5' 
                : 'hover:bg-slate-50 text-slate-700'
        }`}>
          <span className={`text-sm md:text-base font-bold ${isToday ? 'text-[#655ac1]' : ''}`}>
            {calendarType === 'gregorian' ? i : toHijri(date)}
          </span>
          <div className="flex gap-1 mt-1">
            {dayEvents.map((e, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full ring-1 ring-white ${
                    e.type === 'meeting' ? 'bg-blue-400' : 
                    e.type === 'holiday' ? 'bg-rose-400' : 
                    e.type === 'exam' ? 'bg-amber-400' : 'bg-slate-400'
                }`} />
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  const monthNames = [
    "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
    "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
  ];

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow relative">
      <div className="p-6 border-b border-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-lg">
                <CalendarIcon size={24} className="text-[#655ac1]" />
                التقويم
            </h3>
            
            <div className="flex gap-2">
                 {/* Calendar Type Toggles */}
                 <div className="flex bg-slate-50 rounded-lg p-1 text-xs font-bold">
                     <button 
                      onClick={() => setCalendarType('gregorian')}
                      className={`px-3 py-1.5 rounded-md transition-all ${calendarType === 'gregorian' ? 'bg-white text-[#655ac1] shadow-sm' : 'text-slate-400'}`}
                     >ميلادي</button>
                     <button 
                      onClick={() => setCalendarType('hijri')}
                      className={`px-3 py-1.5 rounded-md transition-all ${calendarType === 'hijri' ? 'bg-white text-[#655ac1] shadow-sm' : 'text-slate-400'}`}
                     >هجري</button>
                </div>

                {/* Date Dropdowns */}
                <div className="flex gap-2">
                    <select 
                        value={currentDate.getMonth()} 
                        onChange={(e) => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(e.target.value), 1))}
                        className="bg-slate-50 border-none outline-none text-sm font-bold text-slate-600 rounded-lg px-3 py-1.5"
                    >
                        {calendarType === 'gregorian' 
                            ? monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)
                            : ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'].map((m, i) => <option key={i} value={i}>{m}</option>)
                        }
                    </select>
                    <select 
                        value={currentDate.getFullYear()} 
                        onChange={(e) => setCurrentDate(new Date(parseInt(e.target.value), currentDate.getMonth(), 1))}
                        className="bg-slate-50 border-none outline-none text-sm font-bold text-slate-600 rounded-lg px-3 py-1.5"
                    >
                         {calendarType === 'gregorian'
                            ? [2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)
                            : [1445, 1446, 1447, 1448].map(y => <option key={y} value={y - (2024 - 1445 - 1)}>{y}</option>) 
                              // Approximation logic for display, just for demo. In real app, need explicit Hijri library.
                         }
                    </select>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2">
            <button onClick={() => setShowEventModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#8779fb] text-white rounded-xl shadow-sm hover:bg-[#7566ea] transition-colors shadow-[#8779fb]/20" title="إضافة مهام">
                <Plus size={20} strokeWidth={2.5} />
                <span className="text-sm font-bold">إضافة مهام</span>
            </button>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="grid grid-cols-7 text-center text-[11px] font-extrabold text-slate-400 mb-4 uppercase tracking-wider">
          <div>الأحد</div>
          <div>الاثنين</div>
          <div>الثلاثاء</div>
          <div>الأربعاء</div>
          <div>الخميس</div>
          <div>الجمعة</div>
          <div>السبت</div>
        </div>
        <div className="grid grid-cols-7 text-center flex-1 items-start gap-1">
            {renderDays()}
        </div>
      </div>

       {/* Add Event Modal (Simplified) */}
      {showEventModal && (
        <div className="absolute inset-0 bg-white/95 z-20 p-6 flex flex-col animate-fade-in backdrop-blur-sm">
            <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-800">إضافة مهمة جديدة</h3>
                 <button onClick={() => setShowEventModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto pb-20">
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">عنوان المهمة</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#655ac1]" placeholder="مثال: اجتماع مجلس المعلمين" />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">التاريخ</label>
                    {calendarType === 'gregorian' ? (
                        <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#655ac1]" />
                    ) : (
                        <input type="text" placeholder="YYYY-MM-DD (هجري)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#655ac1]" />
                    )}
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">نوع المهمة</label>
                    <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#655ac1]" placeholder="اجتماع، اختبار، إجازة..." />
                 </div>
                 <div>
                    <label className="text-xs font-bold text-slate-500 block mb-1">لون المهمة</label>
                    <div className="flex gap-3 flex-wrap">
                        {['emerald', 'rose', 'amber', 'blue', 'purple'].map(color => (
                            <button key={color} className={`w-8 h-8 rounded-full bg-${color}-500 ring-2 ring-offset-2 ring-${color}-200 hover:scale-110 transition-transform`}></button>
                        ))}
                    </div>
                 </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100">
                <button onClick={() => { onAddEvent(); setShowEventModal(false); }} className="w-full py-3 bg-[#655ac1] text-white rounded-xl font-bold shadow-lg shadow-[#655ac1]/20">
                    حفظ المهمة
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;

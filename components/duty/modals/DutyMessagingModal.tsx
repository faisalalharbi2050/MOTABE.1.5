import React, { useState, useMemo } from 'react';
import { X, MessageSquare, Send, Copy, RefreshCw, FileText } from 'lucide-react';
import { SchoolInfo, DutyScheduleData, Teacher, Admin, DutyMessage } from '../../../types';
import { DAYS, DAY_NAMES, getTimingConfig, generateDutyAssignmentMessage, generateDutyReminderMessage } from '../../../utils/dutyUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dutyData: DutyScheduleData;
  schoolInfo: SchoolInfo;
  teachers: Teacher[];
  admins: Admin[];
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const DutyMessagingModal: React.FC<Props> = ({
  isOpen, onClose, dutyData, schoolInfo, teachers, admins, showToast
}) => {
  const [messageType, setMessageType] = useState<'assignment' | 'reminder'>('assignment');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [bulkMasterMessage, setBulkMasterMessage] = useState<string>('');

  const timing = getTimingConfig(schoolInfo);
  const activeDays = timing.activeDays || DAYS.slice();

  const messages = useMemo(() => {
    const msgs: DutyMessage[] = [];
    const daysToProcess = selectedDay === 'all' ? activeDays : [selectedDay];

    daysToProcess.forEach(day => {
      const da = dutyData.dayAssignments.find(d => d.day === day);
      if (!da) return;

      da.staffAssignments.forEach(sa => {
        // Fallback staff type calculation
        const staffType = sa.staffType || (teachers.some(t => t.id === sa.staffId) ? 'teacher' : 'admin');

        // Formatted Date logic
        let dateFormatted = 'اليوم';
        const dObj = new Date(); // Ideally, we'd map 'day' to actual upcoming dates, but 'اليوم' or basic text is fine.
        // Let's use simple textual date as in Supervision
        
        // Wait, supervision doesn't use dateFormatted in generator signatures exactly, Duty does.
        // I will just pass an empty string or a placeholder, but actually let's calculate the date of that day in the current week.
        const dayIndexMap: Record<string, number> = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
        const targetIdx = dayIndexMap[day];
        const currentIdx = dObj.getDay();
        const diff = targetIdx >= currentIdx ? targetIdx - currentIdx : 7 - (currentIdx - targetIdx);
        dObj.setDate(dObj.getDate() + diff);
        
        const dateString = new Intl.DateTimeFormat('ar-SA', { day: 'numeric', month: 'numeric', year: 'numeric' }).format(dObj);

        const baseContent = messageType === 'assignment'
          ? generateDutyAssignmentMessage(sa.staffName, staffType, day, dateString, schoolInfo.gender)
          : generateDutyReminderMessage(sa.staffName, staffType, day, dateString, schoolInfo.gender);

        const finalContent = customMessages[`${day}-${sa.staffId}`] || baseContent;

        msgs.push({
          id: `msg-${day}-${sa.staffId}`,
          staffId: sa.staffId,
          staffName: sa.staffName,
          type: messageType,
          channel: 'whatsapp',
          content: finalContent,
          status: 'pending',
          day,
        });
      });
    });

    return msgs;
  }, [dutyData.dayAssignments, messageType, selectedDay, activeDays, schoolInfo.gender, customMessages, teachers]);

  const handleApplyBulkMessage = () => {
    if (!bulkMasterMessage.trim()) return;
    const newCustom: Record<string, string> = { ...customMessages };
    messages.forEach(msg => {
      newCustom[`${msg.day}-${msg.staffId}`] = bulkMasterMessage;
    });
    setCustomMessages(newCustom);
    setBulkMasterMessage('');
    showToast('تم اعتماد النص للכל', 'success');
  };

  const handleCopyAll = () => {
    const allText = messages.map(m => m.content).join('\\n\\n-------------------\\n\\n');
    navigator.clipboard.writeText(allText);
    showToast('تم نسخ جميع الرسائل بنجاح', 'success');
  };

  const resetMessages = () => {
    setCustomMessages({});
    setBulkMasterMessage('');
    showToast('تم استعادة النصوص التلقائية لجميع الرسائل', 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#e5e1fe] rounded-2xl flex items-center justify-center text-[#655ac1] shadow-sm">
              <Send size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">إرسال إشعارات المناوبة</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">تبليغ المناوبين بمهامهم عبر الواتساب أو الرسائل النصية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
             {/* Message Type & Day Filter */}
             <div className="flex flex-wrap gap-4 mb-6">
               <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200 shadow-inner w-full sm:w-auto">
                 <button
                   onClick={() => setMessageType('assignment')}
                   className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                     messageType === 'assignment'
                       ? 'bg-white text-[#655ac1] shadow-sm transform scale-[1.02] border border-slate-100/50'
                       : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                   }`}
                 >
                   رسالة تكليف
                 </button>
                 <button
                   onClick={() => setMessageType('reminder')}
                   className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                     messageType === 'reminder'
                       ? 'bg-white text-[#655ac1] shadow-sm transform scale-[1.02] border border-slate-100/50'
                       : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                   }`}
                 >
                   رسالة تذكيرية
                 </button>
               </div>

               <select
                 value={selectedDay}
                 onChange={e => setSelectedDay(e.target.value)}
                 className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-[#655ac1]/30 outline-none bg-slate-50 hover:bg-white transition-colors"
               >
                 <option value="all">جميع الأيام</option>
                 {activeDays.map(day => (
                   <option key={day} value={day}>{DAY_NAMES[day]}</option>
                 ))}
               </select>
             </div>

             {/* Bulk Edit & Copy All Section */}
             {messages.length > 0 && (
               <div className="bg-[#facc15]/10 rounded-2xl p-5 mb-6 border border-[#facc15]/20 flex flex-col gap-4">
                 <div className="flex items-start gap-3">
                   <div className="p-2 bg-[#facc15]/20 text-[#ca8a04] rounded-xl mt-1">
                     <FileText size={20} />
                   </div>
                   <div className="flex-1">
                     <h4 className="text-sm font-bold text-slate-800">تخصيص ونسخ الرسائل</h4>
                     <p className="text-xs text-slate-500 mt-1">
                       يمكنك كتابة نص موحد هنا واعتماده للكل، أو نسخ جميع الرسائل دفعة واحدة.
                     </p>
                   </div>
                 </div>
                 
                 <div className="flex flex-col sm:flex-row gap-3">
                   <textarea
                     value={bulkMasterMessage}
                     onChange={(e) => setBulkMasterMessage(e.target.value)}
                     placeholder="اكتب رسالة مخصصة لتعميمها على الجميع هنا..."
                     className="flex-1 bg-white border border-slate-200 text-slate-700 text-sm rounded-xl p-3 min-h-[44px] max-h-[120px] outline-none focus:ring-2 focus:ring-[#facc15]/30 focus:border-[#facc15] resize-y custom-scrollbar font-medium"
                   />
                   <div className="flex flex-col gap-2 shrink-0">
                     <button
                       onClick={handleApplyBulkMessage}
                       disabled={!bulkMasterMessage.trim()}
                       className="flex items-center justify-center gap-2 bg-[#ca8a04] hover:bg-[#a16207] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                     >
                       <Send size={16} /> اعتماد للكل
                     </button>
                     <div className="flex gap-2">
                       <button
                         onClick={handleCopyAll}
                         className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
                       >
                         <Copy size={14} /> نسخ الكل
                       </button>
                       <button
                         onClick={resetMessages}
                         className="flex-none flex items-center justify-center p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 rounded-xl transition-all shadow-sm active:scale-95"
                         title="استعادة النصوص التلقائية"
                       >
                         <RefreshCw size={14} />
                       </button>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {/* Bulk Send All Buttons (Moved to Top) */}
             {messages.length > 0 && (
               <div className="flex flex-col sm:flex-row gap-4 justify-end mb-6">
                 <button
                   onClick={() => showToast(`سيتم إرسال ${messages.length} رسالة نصية...`, 'success')}
                   className="flex items-center justify-center gap-2 bg-[#007AFF]/10 hover:bg-[#007AFF]/20 text-[#007AFF] px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 border border-[#007AFF]/20"
                 >
                   <Send size={18} /> نصية للجميع (رسوم)
                 </button>
                 <button
                   onClick={() => showToast(`سيتم تجهيز ${messages.length} رسالة واتساب...`, 'success')}
                   className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-6 py-3 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 border border-[#25D366]/20"
                 >
                   <MessageSquare size={18} /> واتساب للجميع ({messages.length})
                 </button>
               </div>
             )}

             {/* Messages List */}
             <div className="space-y-4">
               {messages.length === 0 && (
                 <div className="text-center py-10 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                   <MessageSquare size={40} className="mx-auto mb-3 text-slate-300" />
                   <p className="font-bold">لا توجد رسائل للحالات المحددة</p>
                   <p className="text-sm mt-1">يُرجى إعداد جدول المناوبة أولاً</p>
                 </div>
               )}
               {messages.map((msg, index) => (
                 <div key={msg.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-[#655ac1]/20 transition-all shadow-sm hover:shadow-md group">
                   <div className="flex items-center justify-between mb-4">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-[#655ac1]/10 flex items-center justify-center font-bold text-[#655ac1] text-xs">
                         {index + 1}
                       </div>
                       <span className="font-bold text-base text-slate-800">{msg.staffName}</span>
                       <span className="text-xs font-bold px-2 py-1 rounded bg-[#e5e1fe] text-[#655ac1] border -[#e5e1fe]">{DAY_NAMES[msg.day]}</span>
                     </div>
                     <div className="flex gap-2">
                       <button
                         onClick={() => {
                           const phone = [...teachers, ...admins].find(s => s.id === msg.staffId)?.phone;
                           if (phone) {
                             window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg.content)}`, '_blank');
                           } else {
                             showToast('لم يتم العثور على رقم الهاتف الخاص بالموظف', 'warning');
                           }
                         }}
                         className="px-3 py-1.5 rounded-xl bg-[#25D366]/10 text-[#25D366] text-xs font-bold hover:bg-[#25D366]/20 transition-all flex items-center gap-1.5"
                       >
                         <MessageSquare size={14} /> واتساب
                       </button>
                       <button
                         onClick={() => {
                           const phone = [...teachers, ...admins].find(s => s.id === msg.staffId)?.phone;
                           if (phone) {
                             window.open(`sms:${phone.replace(/[^0-9]/g, '')}?body=${encodeURIComponent(msg.content)}`, '_self');
                           } else {
                             showToast('لم يتم العثور على رقم الهاتف الخاص بالموظف', 'warning');
                           }
                         }}
                         className="px-3 py-1.5 rounded-xl bg-[#007AFF]/10 text-[#007AFF] text-xs font-bold hover:bg-[#007AFF]/20 transition-all flex items-center gap-1.5"
                       >
                         <Send size={14} /> نصية
                       </button>
                     </div>
                   </div>
                   <textarea
                     value={msg.content}
                     onChange={(e) => {
                       const newCustom = { ...customMessages };
                       newCustom[`${msg.day}-${msg.staffId}`] = e.target.value;
                       setCustomMessages(newCustom);
                     }}
                     className="w-full text-sm font-medium leading-relaxed text-slate-700 bg-white rounded-xl p-4 border border-slate-100 focus:border-[#655ac1]/30 focus:ring-2 focus:ring-[#655ac1]/10 outline-none shadow-sm min-h-[80px] resize-y"
                   />
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutyMessagingModal;


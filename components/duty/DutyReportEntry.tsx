import React, { useState, useRef } from 'react';
import { Shield, Clock, AlertTriangle, Users, Check, X, ArrowLeft, Edit3, Trash2, Plus } from 'lucide-react';
import { DutyReportRecord, DutyStudentViolation, SchoolInfo } from '../../types';
import SignaturePad, { SignaturePadRef } from '../ui/SignaturePad';

interface Props {
  staffId: string;
  staffName: string;
  day: string;
  date: string;
  schoolInfo: SchoolInfo;
  onClose: () => void;
  onSubmit: (report: DutyReportRecord) => void;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const DutyReportEntry: React.FC<Props> = ({
  staffId, staffName, day, date, schoolInfo, onClose, onSubmit, showToast
}) => {
  const [lateStudents, setLateStudents] = useState<{studentName: string, gradeAndClass: string, notes: string}[]>([]);
  const [violatingStudents, setViolatingStudents] = useState<{studentName: string, gradeAndClass: string, violationType: string, notes: string}[]>([]);
  
  // Forms states
  const [studentName, setStudentName] = useState('');
  const [gradeClass, setGradeClass] = useState('');
  const [violationType, setViolationType] = useState('تأخر صباحي');
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'late' | 'violations'>('late');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signatureRef = useRef<SignaturePadRef>(null);

  const handleAddStudent = () => {
    if (!studentName.trim() || !gradeClass.trim()) {
      showToast('يرجى كتابة اسم الطالب والصف', 'warning');
      return;
    }

    const newStudent = {
      studentName: studentName.trim(),
      gradeAndClass: gradeClass.trim(),
      violationType: activeTab === 'late' ? 'تأخر صباحي' : violationType,
      notes: notes.trim(),
    };

    if (activeTab === 'late') {
      setLateStudents(prev => [...prev, { studentName: newStudent.studentName, gradeAndClass: newStudent.gradeAndClass, notes: newStudent.notes }]);
      showToast('تم إضافة الطالب المتأخر', 'success');
    } else {
      setViolatingStudents(prev => [...prev, newStudent]);
      showToast('تم إضافة الطالب المخالف', 'success');
    }

    setStudentName('');
    setGradeClass('');
    setNotes('');
  };

  const removeStudent = (index: number, type: 'late' | 'violation') => {
    if (type === 'late') {
      setLateStudents(prev => prev.filter((_, i) => i !== index));
    } else {
      setViolatingStudents(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    if (signatureRef.current?.isEmpty()) {
       showToast('يرجى توقيع التقرير أولاً', 'warning');
       return;
    }

    setIsSubmitting(true);
    
    // Convert current states into DutyReportRecord
    const signatureImage = signatureRef.current?.getSignature() || undefined;

    const report: DutyReportRecord = {
      id: Date.now().toString(),
      date,
      day,
      staffId,
      staffName,
      lateStudents: lateStudents.map((s, i) => ({ ...s, id: `late-${i}`, exitTime: '', actionTaken: '' })),
      violatingStudents: violatingStudents.map((s, i) => ({ ...s, id: `viol-${i}`, actionTaken: '' })),
      status: 'present', // implicitly present if they submitted the report
      isSubmitted: true,
      signature: signatureImage || undefined,
      submittedAt: new Date().toISOString()
    };

    setTimeout(() => {
      onSubmit(report);
      showToast('تم رفع تقرير المناوبة بنجاح', 'success');
      if (lateStudents.length > 0 || violatingStudents.length > 0) {
        setTimeout(() => showToast('تم تحويل سجل المخالفات إلكترونياً لوكيل شؤون الطلاب', 'success'), 1000);
      }
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-50 z-[9999] overflow-y-auto flex flex-col animate-in fade-in slide-in-from-bottom-4" dir="rtl">
      
      {/* Mobile-friendly Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-lg mx-auto w-full">
           <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full">
             <ArrowLeft size={20} />
           </button>
           <div className="text-center font-black text-slate-800 text-lg">تقرير المناوبة اليومية</div>
           <div className="w-10 h-10"></div> {/* Spacer */}
        </div>
      </div>

      <div className="flex-1 w-full max-w-lg mx-auto p-4 space-y-6 pb-24">
         
         {/* Officer Info Card */}
         <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-[#e5e1fe] text-[#655ac1] rounded-2xl flex items-center justify-center">
                  <Shield size={24} />
               </div>
               <div>
                 <h2 className="text-sm font-bold text-slate-500">مرحباً بك،</h2>
                 <p className="text-lg font-black text-slate-800">{staffName}</p>
               </div>
            </div>
            <div className="flex justify-between items-center text-sm font-bold bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-600">
               <div>اليوم: {day}</div>
               <div>التاريخ: {date}</div>
            </div>
         </div>

         {/* Entry Forms */}
         <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
               <button 
                 onClick={() => setActiveTab('late')}
                 className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'late' ? 'text-[#655ac1]' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <Clock size={16} /> المتأخرون ({lateStudents.length})
                 {activeTab === 'late' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8779fb] rounded-t-full" />}
               </button>
               <button 
                 onClick={() => setActiveTab('violations')}
                 className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'violations' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 <AlertTriangle size={16} /> المخالفون ({violatingStudents.length})
                 {activeTab === 'violations' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 rounded-t-full" />}
               </button>
            </div>

            {/* Form Fields */}
            <div className="p-5 space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">اسم الطالب</label>
                    <input 
                      type="text" 
                      value={studentName}
                      onChange={e => setStudentName(e.target.value)}
                      placeholder=" رباعي..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:border-[#8779fb] focus:ring-[#8779fb]"
                    />
                  </div>
                  <div className={activeTab === 'late' ? "col-span-2" : "col-span-1"}>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">الصف الدراسي</label>
                    <input 
                      type="text" 
                      value={gradeClass}
                      onChange={e => setGradeClass(e.target.value)}
                      placeholder="مثال: ثالث / ٢"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:border-[#8779fb] focus:ring-[#8779fb]"
                    />
                  </div>
                  
                  {activeTab === 'violations' && (
                     <div className="col-span-1">
                       <label className="text-xs font-bold text-slate-500 mb-1.5 block">نوع المخالفة</label>
                       <input 
                         type="text" 
                         value={violationType}
                         onChange={e => setViolationType(e.target.value)}
                         placeholder="حلاقة، جوال..."
                         className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:border-rose-500 focus:ring-rose-500"
                       />
                     </div>
                  )}

                  <div className="col-span-2">
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">ملاحظات (اختياري)</label>
                    <input 
                      type="text" 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="أي ملاحظات إضافية"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:border-[#8779fb] focus:ring-[#8779fb]"
                    />
                  </div>
               </div>
               
               <button 
                 onClick={handleAddStudent}
                 className={`w-full py-3 rounded-xl text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 ${activeTab === 'late' ? 'bg-[#8779fb] shadow-[#8779fb]/20' : 'bg-rose-500 shadow-rose-500/20'}`}
               >
                 <Plus size={18} /> {activeTab === 'late' ? 'إضافة متأخر' : 'إضافة مخالف'}
               </button>
            </div>
         </div>

         {/* Lists */}
         {activeTab === 'late' && lateStudents.length > 0 && (
           <div className="space-y-3">
             <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2"><Users size={16}/> قائمة المتأخرين المضافة</h3>
             {lateStudents.map((student, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                   <div>
                     <p className="font-bold text-slate-800 text-sm">{student.studentName}</p>
                     <p className="text-xs font-medium text-slate-500">{student.gradeAndClass} {student.notes ? `- ${student.notes}` : ''}</p>
                   </div>
                   <button onClick={() => removeStudent(idx, 'late')} className="w-8 h-8 flex items-center justify-center text-rose-500 bg-rose-50 rounded-xl">
                      <Trash2 size={16} />
                   </button>
                </div>
             ))}
           </div>
         )}

         {activeTab === 'violations' && violatingStudents.length > 0 && (
           <div className="space-y-3">
             <h3 className="font-bold text-slate-700 text-sm flex items-center gap-2"><Users size={16}/> قائمة المخالفين المضافة</h3>
             {violatingStudents.map((student, idx) => (
                <div key={idx} className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
                   <div>
                     <p className="font-bold text-slate-800 text-sm">{student.studentName}</p>
                     <p className="text-xs font-medium text-slate-500">{student.gradeAndClass} • {student.violationType}</p>
                     {student.notes && <p className="text-xs text-slate-400 mt-0.5">{student.notes}</p>}
                   </div>
                   <button onClick={() => removeStudent(idx, 'violation')} className="w-8 h-8 flex items-center justify-center text-rose-500 bg-rose-50 rounded-xl">
                      <Trash2 size={16} />
                   </button>
                </div>
             ))}
           </div>
         )}
         
         {/* Signature Pad */}
         <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-8">
            <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2"><Edit3 size={18} className="text-[#8779fb]"/> التوقيع الحي (إلزامي)</h3>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl h-40 bg-slate-50 relative overflow-hidden group">
               <SignaturePad 
                 ref={signatureRef}
                 penColor="#1e293b" 
                 canvasClassName="w-full h-full"
               />
               <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-40 group-hover:opacity-10 transition-opacity">
                  <Edit3 size={32} className="text-slate-400 mb-2"/>
                  <span className="text-xs font-bold text-slate-400">وقّع هنا داخل المربع</span>
               </div>
               
               <button 
                 onClick={(e) => { e.preventDefault(); signatureRef.current?.clear(); }}
                 className="absolute top-2 left-2 p-1.5 bg-white shadow-sm border border-slate-200 rounded-lg text-slate-500 hover:text-rose-500 z-10"
                 type="button"
               >
                 <Trash2 size={14} />
               </button>
            </div>
         </div>
         
      </div>

      {/* Sticky Bottom Actions */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
         <div className="max-w-lg mx-auto flex gap-3">
           <button 
             onClick={handleSubmit} 
             disabled={isSubmitting}
             className="flex-1 bg-[#8779fb] hover:bg-[#655ac1] active:scale-95 text-white py-4 rounded-2xl font-black shadow-lg shadow-[#8779fb]/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100"
           >
             {isSubmitting ? (
                 <span className="animate-pulse">جاري الرفع...</span>
             ) : (
                 <><Check size={20} /> اعتماد وإرسال التقرير</>
             )}
           </button>
         </div>
      </div>
    </div>
  );
};

export default DutyReportEntry;


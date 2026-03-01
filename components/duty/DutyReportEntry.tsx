import React, { useState, useRef } from 'react';
import { Shield, Clock, AlertTriangle, Users, Check, X, ArrowLeft, Edit3, Trash2, Plus } from 'lucide-react';
import { DutyReportRecord, DutyStudentLate, DutyStudentViolation, SchoolInfo } from '../../types';
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

const LATE_ACTION_OPTIONS = ['تم التواصل مع ولي الأمر', 'إنذار شفهي', 'إنذار كتابي', 'تحويل للوكيل', 'أخرى'];
const VIOLATION_ACTION_OPTIONS = ['إنذار شفهي', 'إنذار كتابي', 'ضبط الجهاز / المصادرة', 'تحويل للوكيل', 'أخرى'];
const VIOLATION_TYPE_OPTIONS = ['تأخر صباحي', 'حلاقة مخالفة', 'استخدام الجوال', 'الزي المدرسي', 'سلوك مخالف', 'أخرى'];

// ── helpers ──────────────────────────────────────────────────────────────────
const emptyLate = (): Omit<DutyStudentLate, 'id'> => ({
  studentName: '', gradeAndClass: '', exitTime: '', actionTaken: '', notes: ''
});
const emptyViolation = (): Omit<DutyStudentViolation, 'id'> => ({
  studentName: '', gradeAndClass: '', violationType: 'تأخر صباحي', actionTaken: '', notes: ''
});

// Hijri date helper (browser-native)
const toHijri = (dateStr: string) => {
  try {
    const d = dateStr ? new Date(dateStr) : new Date();
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric'
    }).format(d);
  } catch { return ''; }
};

const DAY_NAMES_AR: Record<string, string> = {
  sunday: 'الأحد', monday: 'الاثنين', tuesday: 'الثلاثاء',
  wednesday: 'الأربعاء', thursday: 'الخميس', friday: 'الجمعة', saturday: 'السبت'
};

const DutyReportEntry: React.FC<Props> = ({
  staffId, staffName, day, date, schoolInfo, onClose, onSubmit, showToast
}) => {
  // ── 5 default (empty) rows for each table ───────────────────────────────
  const [lateRows, setLateRows] = useState<(Omit<DutyStudentLate, 'id'>)[]>([
    ...Array(5).fill(null).map(() => emptyLate())
  ]);
  const [violationRows, setViolationRows] = useState<(Omit<DutyStudentViolation, 'id'>)[]>([
    ...Array(5).fill(null).map(() => emptyViolation())
  ]);

  const [activeTab, setActiveTab] = useState<'late' | 'violations'>('late');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signatureRef = useRef<SignaturePadRef>(null);

  const hijriDate = toHijri(date);

  // ── row updaters ────────────────────────────────────────────────────────
  const updateLateField = (idx: number, field: keyof Omit<DutyStudentLate, 'id'>, value: string) => {
    setLateRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };
  const updateViolationField = (idx: number, field: keyof Omit<DutyStudentViolation, 'id'>, value: string) => {
    setViolationRows(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  };

  const addLateRow = () => setLateRows(prev => [...prev, emptyLate()]);
  const addViolationRow = () => setViolationRows(prev => [...prev, emptyViolation()]);

  const removeLateRow = (idx: number) => setLateRows(prev => prev.filter((_, i) => i !== idx));
  const removeViolationRow = (idx: number) => setViolationRows(prev => prev.filter((_, i) => i !== idx));

  // ── submit ─────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (signatureRef.current?.isEmpty()) {
      showToast('يرجى توقيع التقرير أولاً', 'warning');
      return;
    }

    const filledLate = lateRows.filter(r => r.studentName.trim());
    const filledViol = violationRows.filter(r => r.studentName.trim());

    setIsSubmitting(true);
    const signatureImage = signatureRef.current?.getSignature() || undefined;

    const report: DutyReportRecord = {
      id: Date.now().toString(),
      date,
      day,
      staffId,
      staffName,
      lateStudents: filledLate.map((s, i) => ({ ...s, id: `late-${i}` })),
      violatingStudents: filledViol.map((s, i) => ({ ...s, id: `viol-${i}` })),
      status: 'present',
      isSubmitted: true,
      signature: signatureImage || undefined,
      submittedAt: new Date().toISOString(),
      isEmpty: filledLate.length === 0 && filledViol.length === 0,
    };

    setTimeout(() => {
      onSubmit(report);
      showToast('تم رفع تقرير المناوبة بنجاح', 'success');
      if (filledLate.length > 0 || filledViol.length > 0) {
        setTimeout(() => showToast('تم تحويل سجل المخالفات إلكترونياً لوكيل شؤون الطلاب', 'success'), 1000);
      }
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  // ── shared input style ───────────────────────────────────────────────────
  const inp = 'w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:border-[#8779fb] focus:ring-[#8779fb]';
  const sel = inp + ' cursor-pointer';

  return (
    <div className="fixed inset-0 bg-slate-50 z-[9999] overflow-y-auto flex flex-col animate-in fade-in slide-in-from-bottom-4" dir="rtl">

      {/* ── Sticky Header ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto w-full">
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="text-center">
            <p className="font-black text-slate-800 text-base">نموذج تقرير المناوبة اليومية</p>
            <p className="text-xs text-slate-500 font-medium">{schoolInfo.schoolName}</p>
          </div>
          <div className="w-10 h-10" /> {/* Spacer */}
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl mx-auto p-4 space-y-5 pb-24">

        {/* ── School Header Card ─────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-violet-50 rounded-2xl p-3 border border-violet-100">
              <p className="text-[10px] font-bold text-slate-500 mb-1">المدرسة</p>
              <p className="text-sm font-black text-slate-800 truncate">{schoolInfo.schoolName || '—'}</p>
            </div>
            <div className="bg-violet-50 rounded-2xl p-3 border border-violet-100">
              <p className="text-[10px] font-bold text-slate-500 mb-1">العام الدراسي</p>
              <p className="text-sm font-black text-slate-800">{schoolInfo.academicYear || '—'}</p>
            </div>
            <div className="bg-violet-50 rounded-2xl p-3 border border-violet-100">
              <p className="text-[10px] font-bold text-slate-500 mb-1">اليوم</p>
              <p className="text-sm font-black text-slate-800">{DAY_NAMES_AR[day] || day}</p>
            </div>
            <div className="bg-violet-50 rounded-2xl p-3 border border-violet-100">
              <p className="text-[10px] font-bold text-slate-500 mb-1">التاريخ</p>
              <p className="text-xs font-black text-slate-700">{hijriDate}</p>
              <p className="text-[10px] text-slate-500 font-medium">{date}</p>
            </div>
          </div>

          {/* Officer Info */}
          <div className="mt-4 flex items-center gap-4 bg-slate-50 rounded-2xl p-3 border border-slate-100">
            <div className="w-10 h-10 bg-[#e5e1fe] text-[#655ac1] rounded-xl flex items-center justify-center shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">المناوب</p>
              <p className="text-base font-black text-slate-800">{staffName}</p>
            </div>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            <button
              onClick={() => setActiveTab('late')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'late' ? 'text-[#655ac1]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Clock size={16} /> المتأخرون ({lateRows.filter(r => r.studentName.trim()).length})
              {activeTab === 'late' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8779fb] rounded-t-full" />}
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'violations' ? 'text-rose-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <AlertTriangle size={16} /> المخالفون ({violationRows.filter(r => r.studentName.trim()).length})
              {activeTab === 'violations' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500 rounded-t-full" />}
            </button>
          </div>

          {/* ── Late Students Table ──────────────────────────────────────── */}
          {activeTab === 'late' && (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-[#655ac1] text-white text-center">
                    <th className="p-2 rounded-tr-lg w-8">م</th>
                    <th className="p-2">اسم الطالب</th>
                    <th className="p-2">الصف / الفصل</th>
                    <th className="p-2 w-28">زمن الانصراف</th>
                    <th className="p-2 w-36">الإجراء</th>
                    <th className="p-2">ملاحظات</th>
                    <th className="p-2 rounded-tl-lg w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {lateRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                      <td className="p-1.5 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-1.5">
                        <input className={inp} value={row.studentName} onChange={e => updateLateField(idx, 'studentName', e.target.value)} placeholder="الاسم الرباعي" />
                      </td>
                      <td className="p-1.5">
                        <input className={inp} value={row.gradeAndClass} onChange={e => updateLateField(idx, 'gradeAndClass', e.target.value)} placeholder="ثالث / ٢" />
                      </td>
                      <td className="p-1.5">
                        <input className={inp} type="time" value={row.exitTime} onChange={e => updateLateField(idx, 'exitTime', e.target.value)} />
                      </td>
                      <td className="p-1.5">
                        <select className={sel} value={row.actionTaken} onChange={e => updateLateField(idx, 'actionTaken', e.target.value)}>
                          <option value="">اختر الإجراء</option>
                          {LATE_ACTION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="p-1.5">
                        <input className={inp} value={row.notes || ''} onChange={e => updateLateField(idx, 'notes', e.target.value)} placeholder="اختياري" />
                      </td>
                      <td className="p-1.5 text-center">
                        {lateRows.length > 1 && (
                          <button onClick={() => removeLateRow(idx)} className="w-6 h-6 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg mx-auto transition-colors">
                            <X size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addLateRow} className="mt-3 w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-[#655ac1] hover:border-indigo-300 hover:bg-violet-50/50 text-xs font-bold flex items-center justify-center gap-1 transition-all">
                <Plus size={13} /> إضافة صف
              </button>
            </div>
          )}

          {/* ── Violations Table ─────────────────────────────────────────── */}
          {activeTab === 'violations' && (
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-rose-500 text-white text-center">
                    <th className="p-2 rounded-tr-lg w-8">م</th>
                    <th className="p-2">اسم الطالب</th>
                    <th className="p-2">الصف / الفصل</th>
                    <th className="p-2 w-32">المخالفة السلوكية</th>
                    <th className="p-2 w-36">الإجراء</th>
                    <th className="p-2">ملاحظات</th>
                    <th className="p-2 rounded-tl-lg w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {violationRows.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-rose-50/30'}>
                      <td className="p-1.5 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="p-1.5">
                        <input className={inp} value={row.studentName} onChange={e => updateViolationField(idx, 'studentName', e.target.value)} placeholder="الاسم الرباعي" />
                      </td>
                      <td className="p-1.5">
                        <input className={inp} value={row.gradeAndClass} onChange={e => updateViolationField(idx, 'gradeAndClass', e.target.value)} placeholder="ثالث / ٢" />
                      </td>
                      <td className="p-1.5">
                        <select className={sel} value={row.violationType} onChange={e => updateViolationField(idx, 'violationType', e.target.value)}>
                          {VIOLATION_TYPE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="p-1.5">
                        <select className={sel} value={row.actionTaken} onChange={e => updateViolationField(idx, 'actionTaken', e.target.value)}>
                          <option value="">اختر الإجراء</option>
                          {VIOLATION_ACTION_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </td>
                      <td className="p-1.5">
                        <input className={inp} value={row.notes || ''} onChange={e => updateViolationField(idx, 'notes', e.target.value)} placeholder="اختياري" />
                      </td>
                      <td className="p-1.5 text-center">
                        {violationRows.length > 1 && (
                          <button onClick={() => removeViolationRow(idx)} className="w-6 h-6 flex items-center justify-center text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg mx-auto transition-colors">
                            <X size={12} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={addViolationRow} className="mt-3 w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-rose-300 hover:text-rose-500 hover:border-rose-300 hover:bg-rose-50/50 text-xs font-bold flex items-center justify-center gap-1 transition-all">
                <Plus size={13} /> إضافة صف
              </button>
            </div>
          )}
        </div>

        {/* ── Signature Pad ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-black text-slate-800 text-sm mb-3 flex items-center gap-2">
            <Edit3 size={18} className="text-[#8779fb]" /> التوقيع الحي (إلزامي)
          </h3>
          <div className="border-2 border-dashed border-slate-200 rounded-2xl h-40 bg-slate-50 relative overflow-hidden group">
            <SignaturePad
              ref={signatureRef}
              penColor="#1e293b"
              canvasClassName="w-full h-full"
            />
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center opacity-40 group-hover:opacity-10 transition-opacity">
              <Edit3 size={32} className="text-slate-400 mb-2" />
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

      {/* ── Sticky Bottom Actions ─────────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-200 p-4 sticky bottom-0 z-50 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button
            onClick={onClose}
            className="w-14 flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-all"
          >
            <X size={20} />
          </button>
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

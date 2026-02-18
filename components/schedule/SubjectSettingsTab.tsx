import React, { useState, useMemo } from 'react';
import { Subject, SubjectConstraint } from '../../types';
import { BookOpen, Ban, Star, Repeat, AlertTriangle, Info, ChevronDown, Users } from 'lucide-react';
import { getMaxDailyPeriodsForSubject, describeDistribution, ValidationWarning } from '../../utils/scheduleConstraints';

interface Props {
  subjects: Subject[];
  constraints: SubjectConstraint[];
  gradeSubjectMap: Record<string, string[]>;
  weekDays: number;
  periodsPerDay: number;
  warnings: ValidationWarning[];
  onChange: (c: SubjectConstraint[]) => void;
}

export default function SubjectSettingsTab({ subjects, constraints, gradeSubjectMap, weekDays, periodsPerDay, warnings, onChange }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expandedGrades, setExpandedGrades] = useState<Record<string, boolean>>({});

  const periods = Array.from({ length: periodsPerDay }, (_, i) => i + 1);

  const getConstraint = (id: string): SubjectConstraint => {
    return constraints.find(c => c.subjectId === id) || { subjectId: id, excludedPeriods: [], preferredPeriods: [], enableDoublePeriods: false };
  };

  const updateConstraint = (subjectId: string, updates: Partial<SubjectConstraint>) => {
    const existing = constraints.find(c => c.subjectId === subjectId);
    if (existing) {
      onChange(constraints.map(c => c.subjectId === subjectId ? { ...c, ...updates } : c));
    } else {
      onChange([...constraints, { subjectId, excludedPeriods: [], preferredPeriods: [], enableDoublePeriods: false, ...updates }]);
    }
  };

  const togglePeriod = (subjectId: string, period: number, field: 'excludedPeriods' | 'preferredPeriods') => {
    const constraint = getConstraint(subjectId);
    const current = constraint[field] || [];
    const otherField = field === 'excludedPeriods' ? 'preferredPeriods' : 'excludedPeriods';
    const otherList = constraint[otherField] || [];
    if (current.includes(period)) {
      updateConstraint(subjectId, { [field]: current.filter((p: number) => p !== period) });
    } else {
      updateConstraint(subjectId, { [field]: [...current, period], [otherField]: otherList.filter((p: number) => p !== period) });
    }
  };

  const selectedSubject = subjects.find(s => s.id === selectedId);
  const selectedConstraint = selectedId ? getConstraint(selectedId) : null;
  const selectedWarnings = selectedId ? warnings.filter(w => w.relatedId === selectedId) : [];

  // Group subjects by grade
  const gradeSubjects = useMemo(() => {
    const result: { gradeKey: string; gradeName: string; subjects: Subject[] }[] = [];
    for (const [gKey, sIds] of Object.entries(gradeSubjectMap)) {
      if (sIds.length === 0) continue;
      const parts = gKey.split('-');
      const gradeLabel = `${parts[0]} - الصف ${parts[1]}`;
      const gradeSubs = sIds.map(id => subjects.find(s => s.id === id)).filter(Boolean) as Subject[];
      if (gradeSubs.length > 0) result.push({ gradeKey: gKey, gradeName: gradeLabel, subjects: gradeSubs });
    }
    return result;
  }, [gradeSubjectMap, subjects]);

  return (
    <div className="space-y-6">
      {/* ─── توضيح القيود التلقائية ─── */}
      <div className="bg-gradient-to-l from-blue-50/60 to-indigo-50/40 rounded-2xl p-5 border border-blue-100/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
            <Info size={16} className="text-white" />
          </div>
          <h3 className="font-black text-slate-700 text-sm">ملاحظات مهمة عن توزيع الحصص</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white/80 rounded-xl p-3.5 border border-blue-100/40">
            <div className="text-xs font-black text-blue-600 mb-1">المواد ذات النصاب القليل</div>
            <p className="text-[12px] text-slate-600 leading-relaxed">المواد التي نصابها مثل عدد أيام الأسبوع أو أقل ستأخذ حصة واحدة فقط في اليوم</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3.5 border border-emerald-100/40">
            <div className="text-xs font-black text-emerald-600 mb-1">المواد ذات النصاب الكبير</div>
            <p className="text-[12px] text-slate-600 leading-relaxed">المواد ذات النصاب الأكبر من أيام الأسبوع ستأخذ حصتين في بعض الأيام مع توزيع عادل</p>
          </div>
          <div className="bg-white/80 rounded-xl p-3.5 border border-amber-100/40">
            <div className="text-xs font-black text-amber-600 mb-1">توزيع متنوع</div>
            <p className="text-[12px] text-slate-600 leading-relaxed">لن تتكرر المادة في نفس الحصة أكثر من يومين في الأسبوع لضمان التنوع</p>
          </div>
        </div>
      </div>



      {/* ─── المحتوى الرئيسي: القائمة الجانبية + التخصيص ─── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 bg-gradient-to-l from-violet-50/60 to-white border-b border-violet-100/40">
          <h3 className="font-black text-slate-800 text-sm">تخصيص قيود المواد</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">اختر مادة من القائمة لتعديل إعداداتها</p>
        </div>
        <div className="flex min-h-[400px]">
          <div className="w-56 md:w-64 border-l border-slate-100 bg-slate-50/40 overflow-y-auto custom-scrollbar shrink-0 max-h-[600px]">
            <div className="p-2 space-y-4">
              {gradeSubjects.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs shadow-inner bg-white/50 rounded-xl border border-dashed border-slate-200">
                  <Info size={24} className="mx-auto mb-2 opacity-20" />
                  لا توجد مواد معتمدة
                </div>
              ) : gradeSubjects.map(({ gradeKey, gradeName, subjects: gradeSubs }) => (
                <div key={gradeKey} className="space-y-1">
                  <div className="px-3 py-1.5 bg-slate-200/50 rounded-lg flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-black text-slate-500 uppercase flex items-center gap-1.5">
                      <Users size={10} className="text-slate-400" />
                      {gradeName}
                    </span>
                    <span className="text-[9px] font-bold bg-slate-300/50 text-slate-600 px-1.5 py-0.5 rounded-md">
                      {gradeSubs.length}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    {gradeSubs.map(sub => {
                      const isSelected = selectedId === sub.id;
                      const hasConstraint = constraints.some(c => c.subjectId === sub.id);
                      const hasError = warnings.some(w => w.relatedId === sub.id && w.level === 'error');
                      return (
                        <button key={sub.id} onClick={() => setSelectedId(sub.id)}
                          className={`w-full text-right px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-2.5 group ${
                            isSelected
                              ? 'bg-gradient-to-l from-primary/10 to-violet-50 ring-2 ring-primary/20 shadow-md'
                              : 'hover:bg-white hover:shadow-sm'
                          }`}>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[10px] font-black transition-all ${
                            isSelected ? 'bg-gradient-to-br from-primary to-violet-600 text-white shadow-md' : 'bg-slate-100 text-slate-400 group-hover:bg-violet-100 group-hover:text-violet-500'
                          }`}>
                            {sub.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-xs text-slate-700 truncate leading-tight">{sub.name}</div>
                            <div className="text-[9px] text-slate-400 font-medium">{sub.periodsPerClass} حصة</div>
                          </div>
                          {hasError && <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 shadow-sm shadow-red-200" />}
                          {!hasError && hasConstraint && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 shadow-sm shadow-emerald-200" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── منطقة التخصيص ─── */}
          <div className="flex-1 p-5 overflow-y-auto">
            {!selectedSubject ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <BookOpen size={48} className="mb-3 opacity-15" />
                <p className="font-bold text-sm">اختر مادة من القائمة</p>
                <p className="text-xs mt-1">لعرض وتعديل إعداداتها</p>
              </div>
            ) : (
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-black text-lg text-slate-800">{selectedSubject.name}</h4>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full font-bold">النصاب: {selectedSubject.periodsPerClass} حصة</span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-full font-bold">
                        الحد اليومي: {getMaxDailyPeriodsForSubject(selectedSubject.periodsPerClass, weekDays)} حصة
                      </span>
                      <span className="text-[10px] bg-slate-50 text-slate-500 px-2.5 py-0.5 rounded-full font-bold">
                        {describeDistribution(selectedSubject.periodsPerClass, weekDays)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {selectedWarnings.map(w => (
                  <div key={w.id} className={`rounded-xl p-3 flex items-start gap-2.5 text-xs ${w.level === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <div><span className="font-bold">{w.message}</span>{w.suggestion && <p className="text-[11px] mt-0.5 opacity-70">{w.suggestion}</p>}</div>
                  </div>
                ))}

                {/* الحصص المستثناة */}
                <div className="bg-slate-50/60 rounded-2xl p-4">
                  <label className="text-xs font-black text-slate-600 mb-3 flex items-center gap-1.5">
                    <Ban size={13} className="text-red-400" /> الحصص المستثناة
                    <span className="text-[10px] font-medium text-slate-400 mr-1">(المادة لن تُجدول في هذه الحصص)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {periods.map(p => {
                      const isOn = selectedConstraint?.excludedPeriods.includes(p);
                      return (
                        <button key={p} onClick={() => togglePeriod(selectedId!, p, 'excludedPeriods')}
                          className={`w-12 h-12 rounded-xl text-sm font-black transition-all duration-200 ${
                            isOn ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-200/50 scale-105' : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-red-300 hover:text-red-400'
                          }`}>
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* الحصص المفضلة */}
                <div className="bg-slate-50/60 rounded-2xl p-4">
                  <label className="text-xs font-black text-slate-600 mb-3 flex items-center gap-1.5">
                    <Star size={13} className="text-amber-400" /> الحصص المفضلة
                    <span className="text-[10px] font-medium text-slate-400 mr-1">(أولوية عند الجدولة)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {periods.map(p => {
                      const isOn = selectedConstraint?.preferredPeriods.includes(p);
                      return (
                        <button key={p} onClick={() => togglePeriod(selectedId!, p, 'preferredPeriods')}
                          className={`w-12 h-12 rounded-xl text-sm font-black transition-all duration-200 ${
                            isOn ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-200/50 scale-105' : 'bg-white border-2 border-slate-200 text-slate-400 hover:border-amber-300 hover:text-amber-400'
                          }`}>
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* تتابع الحصص */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-l from-purple-50/60 to-white rounded-2xl border border-purple-100/40">
                  <div>
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-2">
                      <Repeat size={14} className="text-purple-400" /> تفعيل تتابع الحصص
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">حصتين متتاليتين للمادة في نفس اليوم</p>
                  </div>
                  <button onClick={() => updateConstraint(selectedId!, { enableDoublePeriods: !selectedConstraint?.enableDoublePeriods })}
                    className={`w-14 h-8 rounded-full transition-all duration-300 relative shadow-inner ${selectedConstraint?.enableDoublePeriods ? 'bg-gradient-to-l from-purple-500 to-violet-600' : 'bg-slate-200'}`}>
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${selectedConstraint?.enableDoublePeriods ? 'right-1' : 'right-[calc(100%-1.75rem)]'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

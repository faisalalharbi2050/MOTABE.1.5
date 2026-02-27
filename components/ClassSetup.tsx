
import React, { useState, useMemo } from 'react';
import { Phase, ClassInfo, Subject, SchoolInfo } from '../types';
import { PHASE_CONFIG } from '../constants';
import { GraduationCap, Trash2, LayoutGrid, CheckCircle2, BookPlus, Copy, AlertCircle, X, School, PlusSquare } from 'lucide-react';

interface Props {
  classes: ClassInfo[];
  setClasses: React.Dispatch<React.SetStateAction<ClassInfo[]>>;
  subjects: Subject[];
  gradeSubjectMap: Record<string, string[]>;
  setGradeSubjectMap: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  schoolInfo: SchoolInfo;
}

const ClassSetup: React.FC<Props> = ({ classes, setClasses, subjects, gradeSubjectMap, setGradeSubjectMap, schoolInfo }) => {
  const [activePhase, setActivePhase] = useState<Phase>((schoolInfo.phases || [])[0] || Phase.ELEMENTARY);
  const [gradeCounts, setGradeCounts] = useState<Record<string, number>>({});
  const [editingGrade, setEditingGrade] = useState<number | null>(null);
  const [batchCount, setBatchCount] = useState<string>('');

  const getGradeKey = (grade: number) => `${activePhase}-${grade}`;
  const hasSecond = schoolInfo.hasSecondSchool && (schoolInfo.secondSchoolPhases || [])[0];

  const handleBatchCreate = () => {
    const count = parseInt(batchCount);
    if (!count || count <= 0) return alert("يرجى إدخال عدد صالح.");
    
    const newCounts = { ...gradeCounts };
    const totalGrades = PHASE_CONFIG[activePhase].grades;
    for(let i=1; i<=totalGrades; i++) {
        newCounts[getGradeKey(i)] = count;
    }
    setGradeCounts(newCounts);
    setBatchCount('');
  };

  const copyFromGrade = (targetGrade: number) => {
    const fromGrade = prompt("أدخل رقم الصف الذي تريد النسخ منه:");
    if (!fromGrade) return;
    
    const fromKey = `${activePhase}-${fromGrade}`;
    const targetKey = `${activePhase}-${targetGrade}`;
    
    if (gradeSubjectMap[fromKey]) {
        setGradeSubjectMap({
            ...gradeSubjectMap,
            [targetKey]: [...(gradeSubjectMap[fromKey] || [])]
        });
        alert(`تم نسخ مواد الصف ${fromGrade} إلى الصف ${targetGrade}`);
    } else {
        alert("الصف المصدر لا يحتوي على مواد.");
    }
  };

  const generateClasses = () => {
    const newGenerated: ClassInfo[] = [];
    const phaseConfig = PHASE_CONFIG[activePhase];

    for (let grade = 1; grade <= phaseConfig.grades; grade++) {
      const count = gradeCounts[getGradeKey(grade)] || 0;
      for (let section = 1; section <= count; section++) {
        newGenerated.push({
          id: `${activePhase}-${grade}-${section}`,
          phase: activePhase,
          grade,
          section,
          subjectIds: gradeSubjectMap[`${activePhase}-${grade}`] || []
        });
      }
    }

    setClasses(prev => {
      const otherPhasesClasses = prev.filter(c => c.phase !== activePhase);
      return [...otherPhasesClasses, ...newGenerated];
    });
    alert(`تم بنجاح إنشاء واعتماد فصول مرحلة ${activePhase}`);
  };

  const toggleSubjectForGrade = (grade: number, subId: string) => {
    const key = `${activePhase}-${grade}`;
    const current = gradeSubjectMap[key] || [];
    const updated = current.includes(subId) ? current.filter(id => id !== subId) : [...current, subId];
    setGradeSubjectMap({ ...gradeSubjectMap, [key]: updated });
  };

  const currentPhaseClasses = classes.filter(c => c.phase === activePhase);
  const totalGrades = PHASE_CONFIG[activePhase].grades;

  const classesByGrade = useMemo(() => {
    const map: Record<number, ClassInfo[]> = {};
    for (let i = 1; i <= totalGrades; i++) {
        map[i] = currentPhaseClasses.filter(c => c.grade === i).sort((a,b) => a.section - b.section);
    }
    return map;
  }, [currentPhaseClasses, totalGrades]);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">الصفوف والفصول</h2>
          <p className="text-slate-400">توزيع المواد والفصول للمرحلة الدراسية المختارة.</p>
        </div>

        <div className="flex items-center gap-2 bg-white p-2 border border-slate-100 rounded-2xl shadow-sm">
            <input 
                type="number" 
                placeholder="عدد فصول كل صف..." 
                className="w-40 p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs font-bold focus:border-primary transition-all"
                value={batchCount}
                onChange={e => setBatchCount(e.target.value)}
            />
            <button 
                onClick={handleBatchCreate}
                className="px-4 py-3 bg-primary text-white text-xs font-black rounded-xl hover:bg-secondary transition-all flex items-center gap-2"
            >
                <PlusSquare size={16} /> تطبيق على الكل
            </button>
        </div>
      </div>

      {hasSecond && (
        <div className="flex p-1.5 bg-slate-100 rounded-2xl w-fit border border-slate-200 shadow-inner">
           <button onClick={() => { setActivePhase((schoolInfo.phases || [])[0] || Phase.ELEMENTARY); setEditingGrade(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activePhase === (schoolInfo.phases || [])[0] ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
             <School size={18} /> {schoolInfo.schoolName || 'المدرسة الأساسية'} ({(schoolInfo.phases || [])[0]})
           </button>
           <button onClick={() => { setActivePhase((schoolInfo.secondSchoolPhases || [])[0]!); setEditingGrade(null); }} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${activePhase === (schoolInfo.secondSchoolPhases || [])[0] ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
             <School size={18} /> {schoolInfo.secondSchoolName || 'المدرسة الثانية'} ({(schoolInfo.secondSchoolPhases || [])[0]})
           </button>
        </div>
      )}

      <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-100/30 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 px-6 py-2 bg-primary/10 text-primary font-black text-[10px] rounded-bl-2xl">تعديل إعدادات: {activePhase}</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {Array.from({ length: totalGrades }).map((_, i) => {
            const grade = i + 1;
            const key = getGradeKey(grade);
            const subCount = (gradeSubjectMap[key] || []).length;
            
            return (
              <div key={grade} className={`group relative flex flex-col gap-4 bg-slate-50 p-6 rounded-3xl border transition-all duration-300 ${editingGrade === grade ? 'ring-4 ring-primary/10 border-primary bg-white' : 'border-slate-100 hover:border-primary/30'}`}>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-400 uppercase">الصف الدراسي</span>
                    <span className="text-2xl font-black text-slate-800">{grade}</span>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => copyFromGrade(grade)} className="p-2 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-primary transition-all" title="نسخ من صف آخر"><Copy size={14}/></button>
                    <button onClick={() => setEditingGrade(editingGrade === grade ? null : grade)} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${editingGrade === grade ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-primary hover:border-primary'}`}>
                      <BookPlus size={14} /> {subCount} مواد
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 mr-1">إجمالي فصول هذا الصف</label>
                  <input
                    type="number"
                    className="p-3 border border-slate-200 rounded-xl focus:border-primary outline-none w-full bg-white transition-all text-center font-black"
                    value={gradeCounts[key] || ''}
                    onChange={e => setGradeCounts({ ...gradeCounts, [key]: parseInt(e.target.value) || 0 })}
                  />
                </div>

                {editingGrade === grade && (
                  <div className="mt-2 p-4 bg-white rounded-2xl border-2 border-primary shadow-xl space-y-3 animate-in zoom-in-95 duration-200 z-10 relative">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                        <p className="text-[10px] font-black text-primary">المواد المتاحة لمرحلة {activePhase}:</p>
                        <button onClick={() => setEditingGrade(null)} className="text-slate-300 hover:text-rose-500"><X size={14}/></button>
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {subjects.filter(s => !s.isArchived && s.phases.includes(activePhase)).map(sub => (
                        <label key={sub.id} className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors group">
                           <input type="checkbox" className="w-4 h-4 accent-primary rounded cursor-pointer" checked={(gradeSubjectMap[key] || []).includes(sub.id)} onChange={() => toggleSubjectForGrade(grade, sub.id)} />
                           <div className="flex flex-col">
                               <span className="text-[11px] text-slate-700 font-bold group-hover:text-primary">{sub.name}</span>
                               <span className="text-[8px] text-slate-400">{sub.periodsPerClass} حصص أسبوعياً</span>
                           </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-4 pt-4 border-t border-slate-50">
          <button onClick={generateClasses} className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-lg hover:bg-secondary shadow-xl shadow-primary/20 transition-all flex items-center justify-center gap-3">
            <CheckCircle2 size={24} /> إنشاء واعتماد كافة الفصول
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <h4 className="font-bold text-slate-700 flex items-center gap-3 text-lg mr-2">
          <div className="w-2 h-8 bg-primary rounded-full"></div>
          الفصول المعتمدة حالياً ({activePhase})
        </h4>
        {/* تغيير هنا: جعل الفصول مستطيلات عريضة */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {currentPhaseClasses.map(c => (
                <div key={c.id} className="relative group p-6 bg-white border border-slate-100 rounded-3xl flex flex-col justify-center hover:border-primary hover:shadow-xl transition-all h-24">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">فصل دراسي</span>
                    <span className="text-xl font-black text-slate-800">{c.grade} / {c.section}</span>
                    <button onClick={() => setClasses(prev => prev.filter(item => item.id !== c.id))} className="absolute top-2 left-2 p-1 text-slate-200 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ClassSetup;

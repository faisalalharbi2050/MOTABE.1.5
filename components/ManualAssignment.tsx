import React, { useState, useMemo } from 'react';
import { Teacher, Subject, ClassInfo, Assignment, Phase, SchoolInfo, Specialization } from '../types';
import { 
  Search, LayoutGrid, X, Trash2, UserCheck, 
  ChevronDown, Filter, Check, Layers
} from 'lucide-react';

import AssignmentReport from './AssignmentReport';

interface Props {
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassInfo[];
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
  specializations: Specialization[];
  schoolInfo: SchoolInfo;
  gradeSubjectMap: Record<string, string[]>;
}

const ManualAssignment: React.FC<Props> = ({ 
  teachers, subjects, classes, assignments, 
  setAssignments, schoolInfo, gradeSubjectMap, specializations
}) => {
  const [activePhase] = useState<Phase>(schoolInfo.phase);
  const [showReport, setShowReport] = useState(false);
  
  // -- Filter States --
  const [teacherSearch, setTeacherSearch] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  
  // -- Selection States --
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);

  // -- Dropdown Toggles --
  const [showSpecDropdown, setShowSpecDropdown] = useState(false);
  const [showGradeFilter, setShowGradeFilter] = useState(false);
  const [visibleGrades, setVisibleGrades] = useState<number[]>([]); // Empty = All

  // -- Helpers --
  const getTeacherLoad = (tId: string) => {
    return assignments.filter(a => a.teacherId === tId).reduce((total, a) => {
      const sub = subjects.find(s => s.id === a.subjectId);
      return total + (sub?.periodsPerClass || 0);
    }, 0);
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(teacherSearch.toLowerCase());
      const matchSpec = selectedSpecs.length === 0 || selectedSpecs.includes(t.specializationId);
      return matchSearch && matchSpec;
    });
  }, [teachers, teacherSearch, selectedSpecs]);

  const sourceSubjects = useMemo(() => {
    return subjects.filter(s => !s.isArchived && s.phases.includes(activePhase));
  }, [subjects, activePhase]);

  // -- Assignment Actions --
  const handleAssign = (teacherId: string, classId: string, subjectId: string) => {
    setAssignments(prev => {
      const filtered = prev.filter(a => !(a.classId === classId && a.subjectId === subjectId));
      return [...filtered, { teacherId, classId, subjectId }];
    });
  };

  const handleUnassign = (classId: string, subjectId: string) => {
    setAssignments(prev => prev.filter(a => !(a.classId === classId && a.subjectId === subjectId)));
  };

  const handleUnassignTeacher = (tId: string, tName: string) => {
    if (confirm(`هل أنت متأكد من حذف جميع الإسنادات للمعلم: ${tName}؟`)) {
      setAssignments(prev => prev.filter(a => a.teacherId !== tId));
    }
  };

  const toggleSpec = (id: string) => {
    setSelectedSpecs(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  if (showReport) {
    return (
        <AssignmentReport 
            schoolInfo={schoolInfo} 
            teachers={teachers} 
            subjects={subjects} 
            classes={classes} 
            assignments={assignments} 
            specializations={specializations} 
            onClose={() => setShowReport(false)}
        />
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-slate-50/50">
      
      {/* 1. Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0 shadow-sm z-20">
         <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
               <LayoutGrid className="text-primary" size={24}/>
               إسناد المواد والفصول
            </h2>
         </div>

         <div className="flex items-center gap-3">
             <button 
                onClick={() => setShowReport(true)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-all text-xs font-bold" 
             >
                <Filter size={16} /> 
                تقرير الإسناد والطباعة
             </button>

             <button 
                onClick={() => { if(confirm("هل أنت متأكد من حذف إسناد الكل؟ هذا الإجراء لا يمكن التراجع عنه.")) setAssignments([]) }} 
                className="flex items-center gap-2 px-3 py-2 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all text-xs font-bold" 
                title="تصفير"
            >
                <Trash2 size={16} /> 
                حذف إسناد الكل
            </button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        {/* 2. Professional Sidebar (Teachers) */}
        <aside className="w-80 bg-white border-l border-slate-200 flex flex-col shrink-0 z-10 transition-all">
            {/* Search & Filter Header */}
            <div className="p-4 border-b border-slate-100 flex flex-col gap-3">
                <h3 className="font-black text-slate-800 text-sm">قائمة المعلمين</h3>
                <div className="relative">
                    <Search className="absolute right-3 top-3 text-slate-400" size={16}/>
                    <input 
                        type="text" 
                        placeholder="بحث عن معلم..." 
                        className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                        value={teacherSearch}
                        onChange={e => setTeacherSearch(e.target.value)}
                    />
                </div>
                
                <div className="relative">
                    <button 
                        onClick={() => setShowSpecDropdown(!showSpecDropdown)}
                        className="w-full flex justify-between items-center px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
                    >
                         <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                            <Filter size={14}/> 
                            {selectedSpecs.length ? `تخصص (${selectedSpecs.length})` : 'كل التخصصات'}
                         </span>
                         <ChevronDown size={14} className="text-slate-400"/>
                    </button>
                    {showSpecDropdown && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setShowSpecDropdown(false)}/>
                            <div className="absolute top-full mt-2 w-full bg-white border border-slate-100 rounded-xl shadow-xl z-40 max-h-60 overflow-y-auto custom-scrollbar p-1">
                                {specializations.map(s => (
                                    <button 
                                        key={s.id} 
                                        onClick={() => toggleSpec(s.id)}
                                        className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-xs font-bold transition-all ${selectedSpecs.includes(s.id) ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        {s.name}
                                        {selectedSpecs.includes(s.id) && <Check size={14}/>}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Teacher List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                {filteredTeachers.map(t => {
                    const load = getTeacherLoad(t.id);
                    const isSelected = selectedTeacherId === t.id;
                    const isOverLoad = load > t.quotaLimit;

                    return (
                        <div 
                            key={t.id} 
                            onClick={() => setSelectedTeacherId(t.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all group flex items-start gap-3 relative overflow-hidden ${isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}
                        >
                            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-sm font-bold shadow-sm ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-500'}`}>
                                {t.name.substring(0,2)}
                            </div>
                            <div className="flex-1 overflow-hidden flex justify-between items-start">
                                <div className="flex flex-col gap-0.5">
                                    <h4 className={`text-xs font-black truncate ${isSelected ? 'text-primary' : 'text-slate-700'}`}>{t.name}</h4>
                                    <span className="text-[10px] text-slate-400 font-bold truncate">
                                        {specializations.find(s => s.id === t.specializationId)?.name || 'عام'}
                                    </span>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isOverLoad ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                                        {load}/{t.quotaLimit}
                                    </span>
                                    {load > 0 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleUnassignTeacher(t.id, t.name);
                                            }}
                                            className="flex items-center gap-1 text-[10px] text-rose-500 hover:text-rose-700 transition-all font-bold bg-rose-50 px-2 py-0.5 rounded-full mt-1"
                                            title="حذف جميع إسنادات المعلم"
                                        >
                                            <Trash2 size={10} /> حذف
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden relative bg-[#FAFAFA]">
            <div className="h-full overflow-y-auto custom-scrollbar p-6 md:p-8">
                    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
                    
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <h3 className="text-lg font-black text-slate-800">قائمة الفصول والمواد</h3>
                        
                        {/* Grades Filter */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowGradeFilter(!showGradeFilter)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all shadow-sm"
                            >
                                <Filter size={14}/>
                                {visibleGrades.length === 0 ? 'كل الصفوف' : `تم اختيار (${visibleGrades.length})`}
                                <ChevronDown size={14}/>
                            </button>

                            {showGradeFilter && (
                                <>
                                    <div className="fixed inset-0 z-30" onClick={() => setShowGradeFilter(false)}/>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-40 p-2 space-y-1 animate-in zoom-in-95">
                                        <button 
                                            onClick={() => setVisibleGrades([])}
                                            className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-xs font-bold transition-all ${visibleGrades.length === 0 ? 'bg-primary/10 text-primary' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            عرض الكل ({[1,2,3,4,5,6].length})
                                            {visibleGrades.length === 0 && <Check size={14}/>}
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"/>
                                        {[1,2,3,4,5,6].map(g => (
                                            <button 
                                                key={g} 
                                                onClick={() => setVisibleGrades(prev => prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g])}
                                                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg text-xs font-bold transition-all ${visibleGrades.includes(g) ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-50 text-slate-600'}`}
                                            >
                                                الصف {g}
                                                {visibleGrades.includes(g) && <Check size={14}/>}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Grades Loop */}
                    {[1,2,3,4,5,6].filter(g => visibleGrades.length === 0 || visibleGrades.includes(g)).map(grade => {
                        const gradeClasses = classes.filter(c => c.phase === activePhase && c.grade === grade);
                        if (gradeClasses.length === 0) return null;

                        return (
                            <div key={grade} className="space-y-4">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Layers size={14}/> الصف الدراسي {grade}
                                </h3>
                                
                                <div className="space-y-4">
                                    {gradeClasses.map(cls => {
                                        // Filter and Deduplicate Subjects
                                        const rawSubjects: Subject[] = sourceSubjects.filter(
                                            (s) => gradeSubjectMap[`${activePhase}-${grade}`]?.includes(s.id) || cls.subjectIds?.includes(s.id)
                                        );
                                        const classSubjects: Subject[] = Array.from(new Map(rawSubjects.map(s => [s.id, s])).values());
                                        
                                        // Calculate completion
                                        const assignedCount = classSubjects.filter(s => assignments.some(a => a.classId === cls.id && a.subjectId === s.id)).length;
                                        const progress = Math.round((assignedCount / classSubjects.length) * 100);

                                        return (
                                            <div key={cls.id} className="bg-white rounded-2xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
                                                {/* Header */}
                                                <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-white">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                                                            {cls.section}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-slate-800">الفصل {cls.grade} / {cls.section}</h4>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className="h-full bg-emerald-400 transition-all duration-500" style={{width: `${progress}%`}}></div>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-400 font-bold">{progress}% مكتمل</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Subjects Grid */}
                                                <div className="p-4 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                                                    {classSubjects.map(sub => {
                                                        const assignment = assignments.find(a => a.classId === cls.id && a.subjectId === sub.id);
                                                        const assignedTeacher = teachers.find(t => t.id === assignment?.teacherId);

                                                        return (
                                                            <button 
                                                                key={sub.id}
                                                                onClick={() => selectedTeacherId && handleAssign(selectedTeacherId, cls.id, sub.id)}
                                                                className={`relative p-3 rounded-xl border text-right transition-all group ${assignment ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50' : 'border-slate-100 bg-slate-50/50 hover:border-indigo-200 hover:shadow-sm'}`}
                                                            >
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[11px] font-bold text-slate-700 truncate">{sub.name}</span>
                                                                    {assignment ? (
                                                                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 truncate">
                                                                            <UserCheck size={10}/> {assignedTeacher?.name}
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-[10px] text-slate-400 font-medium">--</span>
                                                                    )}
                                                                </div>
                                                                
                                                                {assignment && (
                                                                    <div 
                                                                        onClick={(e) => { e.stopPropagation(); handleUnassign(cls.id, sub.id); }}
                                                                        className="absolute top-2 left-2 text-rose-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                                                    >
                                                                        <X size={14} />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                    </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default ManualAssignment;

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { ClassInfo, Student, SchoolInfo, Phase } from '../../../types';
import { PHASE_CONFIG } from '../../../constants';
import {
  Users, Upload, Search, Filter, Printer, Trash2, Plus, X, Pencil, Check,
  AlertTriangle, School, GraduationCap, ArrowUpCircle, Download,
  ChevronDown, Loader2, CheckCircle2, Phone, Hash, FileSpreadsheet,
  RotateCcw, UserPlus, Trash
} from 'lucide-react';
import {
  parseStudentExcel,
  printStudentList,
  filterStudents,
  getStudentStats,
} from '../../../utils/studentUtils';
import SchoolTabs from '../SchoolTabs';

interface Step5Props {
  classes: ClassInfo[];
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  schoolInfo: SchoolInfo;
}

const Step5Students: React.FC<Step5Props> = ({ classes, students, setStudents, schoolInfo }) => {
  // ─── Core State ───
  const [activeSchoolId, setActiveSchoolId] = useState<string>('main');
  const [activePhase, setActivePhase] = useState<Phase>(schoolInfo.phases?.[0] || Phase.ELEMENTARY);

  // ─── Import State ───
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importResult, setImportResult] = useState<{ matched: number; unmatched: number; total: number; errors: string[] } | null>(null);
  const [showImportErrors, setShowImportErrors] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Manual Add/Edit State ───
  const [showAddForm, setShowAddForm] = useState(false);
  const [addName, setAddName] = useState('');
  const [addGrade, setAddGrade] = useState<number>(1);
  const [addClassId, setAddClassId] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editClassId, setEditClassId] = useState('');

  // ─── Filter State ───
  const [searchText, setSearchText] = useState('');
  const [filterGrade, setFilterGrade] = useState<number | ''>('');
  const [filterClassId, setFilterClassId] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null); // For drill-down navigation

  // ─── Selection State ───
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showMissingDataOnly, setShowMissingDataOnly] = useState(false); // Filter for missing data


  // ─── Print State ───
  const [showPrintMenu, setShowPrintMenu] = useState(false);

  // ─── Toast State ───
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // ─── Derived Data ───
  // Sync activePhase with activeSchoolId
  React.useEffect(() => {
    if (activeSchoolId === 'main') {
      const phases = schoolInfo.phases || [];
      if (phases.length > 0 && !phases.includes(activePhase)) {
        setActivePhase(phases[0]);
      }
    } else {
      const shared = schoolInfo.sharedSchools?.find(s => s.id === activeSchoolId);
      if (shared && shared.phases?.length > 0) {
        if (!shared.phases.includes(activePhase)) {
          setActivePhase(shared.phases[0]);
        }
      }
    }
  }, [activeSchoolId, schoolInfo, activePhase]);

  const hasSecond = schoolInfo.hasSecondSchool && schoolInfo.secondSchoolPhase;
  const totalGrades = PHASE_CONFIG[activePhase]?.grades || 6;

  const schoolStudents = useMemo(() => {
    return students.filter(s => (s.schoolId || 'main') === activeSchoolId);
  }, [students, activeSchoolId]);

  const schoolClasses = useMemo(() => {
    return classes.filter(c =>
      c.phase === activePhase && (c.schoolId || 'main') === activeSchoolId
    ).sort((a, b) => {
      if (a.grade !== b.grade) return a.grade - b.grade;
      return a.section - b.section;
    });
  }, [classes, activePhase, activeSchoolId]);

  const studentsWithMissingData = useMemo(() => {
    return schoolStudents.filter(s => !s.grade || !s.classId || !s.parentPhone);
  }, [schoolStudents]);

  const filteredStudents = useMemo(() => {
    let result = schoolStudents;

    if (showMissingDataOnly) {
      result = studentsWithMissingData;
    } else {
      result = filterStudents(result, {
        searchText: searchText || undefined,
        grade: filterGrade || undefined,
        classId: filterClassId || undefined,
      });
    }

    return result.sort((a, b) => {
      if (a.grade !== b.grade) return a.grade - b.grade;
      return a.name.localeCompare(b.name, 'ar');
    });
  }, [schoolStudents, searchText, filterGrade, filterClassId, showMissingDataOnly, studentsWithMissingData]);

  const stats = useMemo(() => getStudentStats(schoolStudents, schoolClasses), [schoolStudents, schoolClasses]);

  const classesForGrade = useMemo(() => {
    return schoolClasses.filter(c => c.grade === addGrade);
  }, [schoolClasses, addGrade]);

  // ─── Toast Helper ───
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // ─── Excel Import ───
  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(0);
    setImportResult(null);

    // Simulate progress for UX
    const progressInterval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const result = await parseStudentExcel(file, classes, activeSchoolId, activePhase);

      clearInterval(progressInterval);
      setImportProgress(100);

      // Add parsed students (merge with existing)
      setStudents(prev => {
        const otherSchool = prev.filter(s => (s.schoolId || 'main') !== activeSchoolId);
        return [...otherSchool, ...result.students];
      });

      setImportResult({
        matched: result.matched,
        unmatched: result.unmatched,
        total: result.students.length,
        errors: result.errors,
      });

      showToast(`تم تحميل ${result.students.length} طالب بنجاح`, 'success');

      setTimeout(() => {
        setIsImporting(false);
        setImportProgress(0);
      }, 1500);
    } catch (err) {
      clearInterval(progressInterval);
      setIsImporting(false);
      setImportProgress(0);
      showToast('حدث خطأ أثناء قراءة الملف', 'error');
    }

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [classes, activeSchoolId, activePhase, setStudents, showToast]);

  // ─── Manual Add ───
  const handleAddStudent = useCallback(() => {
    if (!addName.trim()) return;

    const student: Student = {
      id: `student-${activeSchoolId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: addName.trim(),
      classId: addClassId || '',
      grade: addGrade,
      parentPhone: addPhone.trim() || undefined,
      schoolId: activeSchoolId,
    };

    setStudents(prev => [...prev, student]);
    setAddName('');
    setAddPhone('');
    setAddClassId('');
    showToast('تم إضافة الطالب بنجاح');
  }, [addName, addGrade, addClassId, addPhone, activeSchoolId, setStudents, showToast]);

  // ─── Edit ───
  const handleStartEdit = useCallback((s: Student) => {
    setEditingStudent(s.id);
    setEditName(s.name);
    setEditPhone(s.parentPhone || '');
    setEditClassId(s.classId);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingStudent) return;
    setStudents(prev => prev.map(s =>
      s.id === editingStudent ? {
        ...s,
        name: editName.trim() || s.name,
        parentPhone: editPhone.trim() || undefined,
        classId: editClassId,
      } : s
    ));
    setEditingStudent(null);
    showToast('تم تحديث البيانات');
  }, [editingStudent, editName, editPhone, editClassId, setStudents, showToast]);

  // ─── Delete ───
  const handleDeleteOne = useCallback((id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
    setSelectedStudents(prev => { const ns = new Set(prev); ns.delete(id); return ns; });
  }, [setStudents]);

  const handleBulkDelete = useCallback(() => {
    setStudents(prev => prev.filter(s => !selectedStudents.has(s.id)));
    setSelectedStudents(new Set());
    setShowBulkDeleteConfirm(false);
    showToast(`تم حذف ${selectedStudents.size} طالب`);
  }, [selectedStudents, setStudents, showToast]);

  const handleDeleteAll = useCallback(() => {
    setStudents(prev => prev.filter(s => (s.schoolId || 'main') !== activeSchoolId));
    setSelectedStudents(new Set());
    setShowDeleteAllConfirm(false);
    showToast('تم حذف جميع الطلاب');
  }, [activeSchoolId, setStudents, showToast]);

  // ─── Selection ───
  const toggleSelect = useCallback((id: string) => {
    setSelectedStudents(prev => {
      const ns = new Set(prev);
      if (ns.has(id)) ns.delete(id); else ns.add(id);
      return ns;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const ids = filteredStudents.map(s => s.id);
    const allSelected = ids.every(id => selectedStudents.has(id));
    setSelectedStudents(prev => {
      const ns = new Set(prev);
      ids.forEach(id => { if (allSelected) ns.delete(id); else ns.add(id); });
      return ns;
    });
  }, [filteredStudents, selectedStudents]);

  // ─── Promotion Removed ───

  // ─── Print ───
  const handlePrint = useCallback((sortBy: 'grade' | 'class', specificClassId?: string) => {
    let listToPrint = schoolStudents;
    let title = '';

    if (specificClassId) {
      listToPrint = schoolStudents.filter(s => s.classId === specificClassId);
      title = `قائمة طلاب ${getClassName(specificClassId)}`;
    } else if (filterClassId) {
       listToPrint = filteredStudents;
       title = `قائمة طلاب ${getClassName(filterClassId)}`;
    }

    printStudentList(listToPrint, schoolClasses, schoolInfo, sortBy, title);
    setShowPrintMenu(false);
  }, [schoolStudents, filteredStudents, schoolClasses, schoolInfo, filterClassId]);

  // Helper: get class display name
  const getClassName = (classId: string) => {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return 'غير محدد';
    return cls.name || `${cls.grade}/${cls.section}`;
  };

  // ══════════════════════════════════════════════════════
  //   R E N D E R
  // ══════════════════════════════════════════════════════

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">

      {/* ══════ Toast Notification ══════ */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-emerald-500 text-white' :
          toast.type === 'error' ? 'bg-rose-500 text-white' :
          'bg-indigo-500 text-white'
        }`}>
          {toast.type === 'success' && <CheckCircle2 size={20} />}
          {toast.type === 'error' && <AlertTriangle size={20} />}
          {toast.type === 'info' && <ArrowUpCircle size={20} />}
          {toast.message}
        </div>
      )}

      {/* ══════ Header ══════ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <Users size={24} />
            </div>
            إدارة الطلاب
          </h2>
          <p className="text-sm text-slate-400 mt-1 mr-12">استيراد وإدارة بيانات الطلاب وتسكينهم في الفصول الدراسية.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Print */}
          {schoolStudents.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowPrintMenu(!showPrintMenu)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all"
              >
                <Printer size={16} /> طباعة <ChevronDown size={14} />
              </button>
              {showPrintMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowPrintMenu(false)} />
                  <div className="absolute left-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 w-52 overflow-hidden animate-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => handlePrint('grade')}
                      className="w-full px-4 py-3 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all text-right flex items-center gap-2"
                    >
                      <GraduationCap size={14} /> طباعة الكل (حسب الصف)
                    </button>
                    {(filterClassId || selectedGrade) && (
                         <button
                         onClick={() => handlePrint('class', filterClassId || undefined)}
                         className="w-full px-4 py-3 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all text-right flex items-center gap-2 border-t border-slate-100"
                       >
                         <School size={14} /> طباعة القائمة المعروضة
                       </button>
                    )}
                    <button
                      onClick={() => handlePrint('class')}
                      className="w-full px-4 py-3 text-xs font-bold text-slate-600 hover:bg-primary/5 hover:text-primary transition-all text-right flex items-center gap-2 border-t border-slate-100"
                    >
                      <School size={14} /> طباعة الكل (حسب الفصل)
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Missing Data Warning */}
          {studentsWithMissingData.length > 0 && (
             <button
              onClick={() => { setShowMissingDataOnly(!showMissingDataOnly); setSelectedGrade(null); setFilterGrade(''); setFilterClassId(''); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                showMissingDataOnly
                ? 'bg-amber-100 text-amber-700 shadow-inner'
                : 'bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 animate-pulse'
              }`}
            >
              <AlertTriangle size={16} />
              {showMissingDataOnly ? 'عرض جميع الطلاب' : `${studentsWithMissingData.length} طلاب بياناتهم ناقصة`}
            </button>
          )}

          {/* New Actions: Import & Add (Visible when list is not empty) */}
          {schoolStudents.length > 0 && (
            <>
               <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-primary hover:text-primary transition-all"
              >
                <Upload size={16} /> استيراد
              </button>
               <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-105 transition-all"
              >
                <UserPlus size={16} /> إضافة طالب
              </button>
            </>
          )}

          {/* Stats Badge */}
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center gap-2">
            <Hash size={14} className="text-primary" />
            <span className="text-xs font-bold text-slate-500">إجمالي:</span>
            <span className="text-lg font-black text-primary">{schoolStudents.length}</span>
            <span className="text-xs text-slate-400">طالب</span>
          </div>
        </div>
      </div>

      {/* ══════ School Tabs ══════ */}
      <SchoolTabs
        schoolInfo={schoolInfo}
        activeSchoolId={activeSchoolId}
        onTabChange={(id) => {
          setActiveSchoolId(id);
          setSelectedStudents(new Set());
        }}
      />

      {/* Phase Selector (if multi-phase) */}
      {(() => {
        const currentPhases = activeSchoolId === 'main' 
          ? schoolInfo.phases || [] 
          : (schoolInfo.sharedSchools?.find(s => s.id === activeSchoolId)?.phases || []);
        
        if (currentPhases.length <= 1) return null;

        return (
          <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-2">
            {currentPhases.map(p => (
              <button
                key={p}
                onClick={() => setActivePhase(p)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  activePhase === p
                    ? 'bg-primary text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                {p === Phase.OTHER && (activeSchoolId === 'main' ? schoolInfo.otherPhase : schoolInfo.sharedSchools?.find(s => s.id === activeSchoolId)?.otherPhase) 
                  ? (activeSchoolId === 'main' ? schoolInfo.otherPhase : schoolInfo.sharedSchools?.find(s => s.id === activeSchoolId)?.otherPhase) 
                  : p}
              </button>
            ))}
          </div>
        );
      })()}

      {/* ══════ Stats Cards (Drill-Down) ══════ */}
      {schoolStudents.length > 0 && (
        <div className="space-y-3">
          {selectedGrade && (
            <button
              onClick={() => { setSelectedGrade(null); setFilterGrade(''); setFilterClassId(''); }}
              className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary transition-all pr-1"
            >
              <ArrowUpCircle size={14} className="rotate-90" /> عودة لجميع الصفوف
            </button>
          )}
          
          <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 ${selectedGrade ? 'animate-in slide-in-from-right-4 duration-300' : ''}`}>
            {!selectedGrade ? (
              // Level 1: Grades
              Array.from({ length: totalGrades }, (_, i) => i + 1).map(grade => {
                const count = stats.gradeMap.get(grade) || 0;
                return (
                  <div
                    key={grade}
                    onClick={() => { setSelectedGrade(grade); setFilterGrade(grade); setFilterClassId(''); }}
                    className="p-4 rounded-2xl border-2 border-slate-100 bg-white hover:border-primary/30 hover:shadow-md transition-all cursor-pointer text-center group"
                  >
                    <div className="text-2xl font-black text-primary group-hover:scale-110 transition-transform">{count}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1 group-hover:text-primary">الصف {grade}</div>
                  </div>
                );
              })
            ) : (
              // Level 2: Classes for Selected Grade
              schoolClasses.filter(c => c.grade === selectedGrade).map(cls => {
                const count = stats.classMap.get(cls.id) || 0;
                const isSelected = filterClassId === cls.id;
                return (
                  <div
                    key={cls.id}
                    onClick={() => setFilterClassId(isSelected ? '' : cls.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-center group ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-slate-100 bg-white hover:border-primary/30 hover:shadow-md'
                    }`}
                  >
                    <div className={`text-2xl font-black transition-transform group-hover:scale-110 ${isSelected ? 'text-primary' : 'text-slate-600'}`}>
                      {count}
                    </div>
                    <div className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-primary' : 'text-slate-400'}`}>
                      {cls.name || `${cls.grade}/${cls.section}`}
                    </div>
                  </div>
                );
              })
            )}
            
            {/* Show "No Classes" state if in grade view but no classes exist */}
            {selectedGrade && schoolClasses.filter(c => c.grade === selectedGrade).length === 0 && (
               <div className="col-span-full p-6 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                 <p className="text-xs font-bold">لا توجد فصول مضافة لهذا الصف بعد.</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ Excel Import Section (Visible Only if Empty or Importing) ══════ */}
      {(schoolStudents.length === 0 || isImporting) && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-50/50 overflow-hidden">
        <div className="p-8">
          <h3 className="font-black text-slate-800 flex items-center gap-3 mb-6">
            <div className="w-2 h-8 bg-primary rounded-full"></div>
            استيراد البيانات
          </h3>

          {isImporting ? (
            // ── Loading State ──
            <div className="flex flex-col items-center justify-center p-10 space-y-6 animate-in fade-in duration-300">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <div className="absolute inset-3 bg-primary/10 rounded-full flex items-center justify-center">
                  <FileSpreadsheet size={24} className="text-primary" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="font-black text-slate-700 mb-1">جاري تحميل البيانات...</h4>
                <p className="text-sm text-slate-400">يتم قراءة ملف Excel ومطابقة الطلاب بالفصول</p>
              </div>
              {/* Progress Bar */}
              <div className="w-full max-w-md">
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-primary to-indigo-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${Math.min(importProgress, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-center text-slate-400 mt-2 font-bold">
                  {Math.round(importProgress)}%
                </p>
              </div>
            </div>
          ) : (
            // ── Upload Area ──
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center p-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 hover:bg-primary/5 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <Upload size={32} className="text-primary" />
                </div>
                <h4 className="font-black text-slate-700 mb-2">استيراد من ملف Excel</h4>
                <p className="text-sm text-slate-400 text-center max-w-md">
                  قم برفع ملف Excel (من نظام نور أو أي نظام آخر) يحتوي على أعمدة: <strong>اسم الطالب - الصف - الفصل - رقم جوال ولي الأمر</strong>
                </p>
                <div className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-xs font-bold group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
                  <Upload size={14} className="inline ml-2" /> اختيار ملف
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
      
      {/* Hidden Input for Header Button */}
      {!isImporting && (
         <input
         ref={fileInputRef}
         type="file"
         accept=".xlsx,.xls,.csv"
         onChange={handleFileSelect}
         className="hidden"
       />
      )}

      {/* ─── Import Results Toast/Dialog ─── */}
      {importResult && !isImporting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
               <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      <CheckCircle2 size={24} className="text-emerald-500" /> نتائج الاستيراد
                    </h3>
                    <button onClick={() => setImportResult(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all">
                      <X size={20} />
                    </button>
               </div>
               
               <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="text-2xl font-black text-primary">{importResult.total}</div>
                      <div className="text-xs text-slate-400 font-bold mt-1">إجمالي الطلاب</div>
                    </div>
                    <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <div className="text-2xl font-black text-emerald-500">{importResult.matched}</div>
                      <div className="text-xs text-emerald-600/70 font-bold mt-1">تمت المطابقة</div>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <div className="text-2xl font-black text-amber-500">{importResult.unmatched}</div>
                      <div className="text-xs text-amber-600/70 font-bold mt-1">بيانات ناقصة</div>
                    </div>
                </div>

                {importResult.errors.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-4 max-h-40 overflow-y-auto custom-scrollbar border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                      <AlertTriangle size={12} /> تنبيهات ({importResult.errors.length})
                    </h4>
                    <div className="space-y-1">
                      {importResult.errors.map((err, i) => (
                         <div key={i} className="text-[10px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-100/50">{err}</div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6 flex justify-end">
                  <button onClick={() => setImportResult(null)} className="px-6 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-all">
                    إغلاق
                  </button>
                </div>
             </div>
          </div>
      )}

      {/* ══════ Manual Add Modal (Replaces Card) ══════ */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200 p-4">
           <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center">
               <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                 <UserPlus size={24} className="text-emerald-500" /> إضافة طالب جديد
               </h3>
               <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all">
                 <X size={20} />
               </button>
             </div>
             
             <div className="p-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">اسم الطالب *</label>
                      <input
                        type="text"
                        placeholder="أدخل اسم الطالب رباعياً"
                        value={addName}
                        onChange={e => setAddName(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        autoFocus
                      />
                    </div>
                     <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">رقم ولي الأمر</label>
                      <input
                        type="tel"
                        placeholder="05xxxxxxxx"
                        value={addPhone}
                        onChange={e => setAddPhone(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">الصف الدراسي *</label>
                      <select
                        value={addGrade}
                        onChange={e => { setAddGrade(parseInt(e.target.value)); setAddClassId(''); }}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-primary transition-all"
                      >
                        {Array.from({ length: totalGrades }, (_, i) => (
                          <option key={i + 1} value={i + 1}>الصف {i + 1}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-2">الفصل</label>
                      <select
                        value={addClassId}
                        onChange={e => setAddClassId(e.target.value)}
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-bold focus:border-primary transition-all"
                      >
                        <option value="">اختر الفصل</option>
                        {classesForGrade.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name || `${c.grade}/${c.section}`}
                          </option>
                        ))}
                      </select>
                    </div>
                 </div>
                 
                 <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => { handleAddStudent(); setShowAddForm(false); }}
                      disabled={!addName.trim()}
                      className="flex-1 py-4 bg-emerald-500 text-white font-black text-sm rounded-xl hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 size={18} /> حفظ البيانات
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 py-4 bg-white text-slate-400 border border-slate-200 font-bold text-sm rounded-xl hover:bg-slate-50 transition-all"
                    >
                      إلغاء
                    </button>
                 </div>
             </div>
           </div>
        </div>
      )}

      {/* ══════ Student List ══════ */}
      {schoolStudents.length > 0 && (
        <div className="space-y-4">

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />
              <input
                type="text"
                placeholder="بحث عن طالب بالاسم..."
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="w-full pr-12 pl-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
              />
              {searchText && (
                <button onClick={() => setSearchText('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500">
                  <X size={16} />
                </button>
              )}
            </div>
            <select
              value={filterGrade}
              onChange={e => setFilterGrade(e.target.value ? parseInt(e.target.value) : '')}
              className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold text-slate-600 focus:border-primary transition-all min-w-[140px]"
            >
              <option value="">جميع الصفوف</option>
              {Array.from({ length: totalGrades }, (_, i) => (
                <option key={i + 1} value={i + 1}>الصف {i + 1}</option>
              ))}
            </select>
            <select
              value={filterClassId}
              onChange={e => setFilterClassId(e.target.value)}
              className="px-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none text-sm font-bold text-slate-600 focus:border-primary transition-all min-w-[140px]"
            >
              <option value="">جميع الفصول</option>
              {schoolClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name || `${c.grade}/${c.section}`}</option>
              ))}
            </select>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-slate-500">
                {filteredStudents.length === schoolStudents.length
                  ? `${schoolStudents.length} طالب`
                  : `${filteredStudents.length} من ${schoolStudents.length} طالب`
                }
              </span>
              {selectedStudents.size > 0 && (
                <>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                    {selectedStudents.size} محدد
                  </span>
                  <button
                    onClick={() => setShowBulkDeleteConfirm(true)}
                    className="flex items-center gap-1 px-3 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all"
                  >
                    <Trash size={14} /> حذف المحدد
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setShowDeleteAllConfirm(true)}
              className="flex items-center gap-1 px-3 py-2 bg-white text-slate-400 border border-slate-200 rounded-xl text-xs font-bold hover:text-rose-500 hover:border-rose-300 transition-all"
            >
              <RotateCcw size={14} /> حذف جميع الطلاب
            </button>
          </div>

          {/* Bulk Delete Confirmation */}
          {showBulkDeleteConfirm && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-in zoom-in-95 duration-200">
              <AlertTriangle size={20} className="text-rose-500" />
              <span className="text-sm font-bold text-rose-700 flex-1">
                هل أنت متأكد من حذف {selectedStudents.size} طالب؟
              </span>
              <button onClick={handleBulkDelete} className="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-all">
                نعم، احذف
              </button>
              <button onClick={() => setShowBulkDeleteConfirm(false)} className="px-4 py-2 bg-white text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all border border-slate-200">
                إلغاء
              </button>
            </div>
          )}

          {/* Delete All Confirmation */}
          {showDeleteAllConfirm && (
            <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-2xl animate-in zoom-in-95 duration-200">
              <AlertTriangle size={20} className="text-rose-500" />
              <span className="text-sm font-bold text-rose-700 flex-1">
                هل تريد حذف جميع الطلاب ({schoolStudents.length})؟ لا يمكن التراجع عن هذا الإجراء.
              </span>
              <button onClick={handleDeleteAll} className="px-4 py-2 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 transition-all">
                نعم، احذف الكل
              </button>
              <button onClick={() => setShowDeleteAllConfirm(false)} className="px-4 py-2 bg-white text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all border border-slate-200">
                إلغاء
              </button>
            </div>
          )}

          {/* Student Table */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-50/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="p-4 w-12 text-center">
                      <div
                        onClick={toggleSelectAll}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mx-auto cursor-pointer transition-all ${
                          filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.has(s.id))
                            ? 'bg-primary border-primary'
                            : 'border-slate-300 hover:border-primary'
                        }`}
                      >
                        {filteredStudents.length > 0 && filteredStudents.every(s => selectedStudents.has(s.id)) && (
                          <Check size={12} className="text-white" />
                        )}
                      </div>
                    </th>
                    <th className="p-4 text-right text-xs font-black text-slate-500 w-12">#</th>
                    <th className="p-4 text-right text-xs font-black text-slate-500">اسم الطالب</th>
                    <th className="p-4 text-center text-xs font-black text-slate-500 w-24">الصف</th>
                    <th className="p-4 text-center text-xs font-black text-slate-500 w-28">الفصل</th>
                    <th className="p-4 text-center text-xs font-black text-slate-500 w-36">رقم ولي الأمر</th>
                    <th className="p-4 text-center text-xs font-black text-slate-500 w-28">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => {
                    const isEditing = editingStudent === student.id;
                    const isSelected = selectedStudents.has(student.id);

                    return (
                      <tr
                        key={student.id}
                        className={`border-b border-slate-50 transition-all group ${
                          isSelected ? 'bg-primary/5' : 'hover:bg-slate-50/50'
                        }`}
                      >
                        <td className="p-4 text-center">
                          <div
                            onClick={() => toggleSelect(student.id)}
                            className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mx-auto cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-primary border-primary'
                                : 'border-slate-200 opacity-40 group-hover:opacity-100 hover:border-primary'
                            }`}
                          >
                            {isSelected && <Check size={12} className="text-white" />}
                          </div>
                        </td>
                        <td className="p-4 text-right text-xs font-bold text-slate-400">{index + 1}</td>
                        <td className="p-4">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editName}
                              onChange={e => setEditName(e.target.value)}
                              className="w-full p-2 bg-white border border-primary rounded-lg outline-none text-sm font-bold"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setEditingStudent(null);
                              }}
                            />
                          ) : (
                            <span className="text-sm font-bold text-slate-800">{student.name}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                            {student.grade}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {isEditing ? (
                            <select
                              value={editClassId}
                              onChange={e => setEditClassId(e.target.value)}
                              className="p-2 bg-white border border-primary rounded-lg outline-none text-xs font-bold w-full"
                            >
                              <option value="">غير محدد</option>
                              {schoolClasses.filter(c => c.grade === student.grade).map(c => (
                                <option key={c.id} value={c.id}>{c.name || `${c.grade}/${c.section}`}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                              student.classId ? 'text-primary bg-primary/10' : 'text-amber-500 bg-amber-50'
                            }`}>
                              {getClassName(student.classId)}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editPhone}
                              onChange={e => setEditPhone(e.target.value)}
                              className="w-full p-2 bg-white border border-primary rounded-lg outline-none text-xs font-bold text-center"
                              dir="ltr"
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setEditingStudent(null);
                              }}
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-500" dir="ltr">
                              {student.parentPhone || '-'}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={handleSaveEdit}
                                  className="p-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                                  title="حفظ"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  onClick={() => setEditingStudent(null)}
                                  className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-all"
                                  title="إلغاء"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleStartEdit(student)}
                                  className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="تعديل"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteOne(student.id)}
                                  className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="حذف"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredStudents.length === 0 && schoolStudents.length > 0 && (
              <div className="p-10 text-center text-slate-400">
                <Search size={40} className="mx-auto mb-3 text-slate-200" />
                <p className="font-bold text-sm">لا توجد نتائج مطابقة</p>
                <p className="text-xs mt-1">جرب تعديل كلمات البحث أو الفلاتر</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════ Empty State ══════ */}
      {schoolStudents.length === 0 && !isImporting && (
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-indigo-50/50 p-10 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Users size={36} className="text-slate-200" />
          </div>
          <h3 className="font-black text-slate-700 text-lg mb-2">لم يتم إضافة طلاب بعد</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            يمكنك استيراد بيانات الطلاب من ملف Excel أو إضافتهم يدوياً واحداً تلو الآخر.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:bg-secondary transition-all"
            >
              <Upload size={16} /> استيراد من Excel
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-slate-600 rounded-xl text-sm font-bold border border-slate-200 hover:border-primary hover:text-primary transition-all"
            >
              <UserPlus size={16} /> إضافة يدوي
            </button>
          </div>
        </div>
      )}


    </div>
  );
};

export default Step5Students;

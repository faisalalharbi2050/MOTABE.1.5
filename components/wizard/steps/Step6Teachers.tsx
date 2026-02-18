import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Teacher, Specialization, SchoolInfo } from '../../../types';
import { Briefcase, Plus, X, Upload, Trash2, Edit, Check, ChevronDown, ChevronUp, Search, Printer, List, User, Shield, ArrowUp, ArrowDown, School } from 'lucide-react';
import { INITIAL_SPECIALIZATIONS } from '../../../constants';
import { parseTeachersExcel } from '../../../utils/excelTeachers';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import SchoolTabs from '../SchoolTabs';

interface Step6Props {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  specializations: Specialization[];
  schoolInfo: SchoolInfo;
  setSchoolInfo?: React.Dispatch<React.SetStateAction<SchoolInfo>>;
}

const Step6Teachers: React.FC<Step6Props> = ({ teachers = [], setTeachers, specializations = [], schoolInfo, setSchoolInfo }) => {
  // State
  const [activeSchoolId, setActiveSchoolId] = useState<string>('main');
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSpecialization, setFilterSpecialization] = useState<string | null>(null);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentTeacher, setCurrentTeacher] = useState<Partial<Teacher>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  
  const [printMenuOpen, setPrintMenuOpen] = useState(false);
  const printMenuRef = useRef<HTMLDivElement>(null);
  
  // Custom Specialization Order State (local for now, could be persisted)
  const [specializationOrder, setSpecializationOrder] = useState<string[]>(INITIAL_SPECIALIZATIONS.map(s => s.id));

  // --- Helpers ---
  const currentSchoolTeachers = useMemo(() => {
    if (schoolInfo.mergeTeachersView) return teachers;
    return teachers.filter(t => (t.schoolId || 'main') === activeSchoolId);
  }, [teachers, activeSchoolId, schoolInfo.mergeTeachersView]);

  const getUsedSpecializationIds = (): string[] => {
    return Array.from(new Set(currentSchoolTeachers.map(t => t.specializationId))) as string[];
  };

  const getSpecializationName = (id: string) => {
      const spec = specializations.find(s => s.id === id);
      return spec ? spec.name : 'أخرى';
  };

  // --- Handlers ---

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      try {
        const newTeachers = await parseTeachersExcel(e.target.files[0]);
        // De-duplicate based on name
        const uniqueNew = newTeachers.filter(nt => !teachers.some(et => et.name === nt.name));
        
        if (uniqueNew.length === 0) {
            alert("لم يتم إضافة أي معلم - الأسماء موجودة مسبقاً");
        } else {
            setTeachers(prev => {
                const maxSort = Math.max(...prev.map(t => t.sortIndex || 0), 0);
                const newWithSort = uniqueNew.map((t, idx) => ({ 
                  ...t, 
                  sortIndex: maxSort + 1 + idx,
                  schoolId: activeSchoolId // Assign to active school
                }));
                return [...prev, ...newWithSort];
            });
            alert(`تم إضافة ${uniqueNew.length} معلم بنجاح`);
        }
      } catch (error) {
        console.error(error);
        alert("حدث خطأ في قراءة الملف");
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    const maxSort = Math.max(...teachers.map(t => t.sortIndex || 0), 0);
    setCurrentTeacher({
        id: `t-${Date.now()}`,
        name: '',
        specializationId: specializations[0]?.id || '99',
        quotaLimit: 24,
        waitingQuota: 0,
        phone: '',
        assignedSubjectId: '',
        sortIndex: maxSort + 1,
        schoolId: activeSchoolId // Default to active school
    });
    setShowModal(true);
  };

  const openEditModal = (t: Teacher) => {
    setModalMode('edit');
    setCurrentTeacher({ ...t });
    setShowModal(true);
  };

  const saveTeacher = () => {
      if (!currentTeacher.name) return alert("يرجى إدخال الاسم");
      
      const teacherToSave = { ...currentTeacher, schoolId: currentTeacher.schoolId || activeSchoolId } as Teacher;
      
      if (modalMode === 'add') {
          setTeachers(prev => [...prev, teacherToSave]);
      } else {
          setTeachers(prev => prev.map(t => t.id === teacherToSave.id ? teacherToSave : t));
      }
      setShowModal(false);
  };

  const removeTeacher = (id: string) => {
      if(confirm("هل أنت متأكد من الحذف؟")) {
          setTeachers(prev => prev.filter(t => t.id !== id));
      }
  };

  const handlePrint = (type: 'all' | 'specialization', specId?: string) => {
      setPrintMenuOpen(false);
      setSearchTerm('');
      if (type === 'all') {
          setFilterSpecialization(null);
      } else if (specId) {
          setFilterSpecialization(specId);
      }
      setTimeout(() => window.print(), 500);
  };

  const moveTeacher = (id: string, direction: 'up' | 'down') => {
      const tIndex = teachers.findIndex(t => t.id === id);
      if (tIndex === -1) return;
      
      const teacher = teachers[tIndex];
      // Get list of teachers in same group (specialization) sorted
      // Filter by school as well for correct ordering context?
      // Actually usually sortIndex is global or per school? 
      // If we move up/down, we should only swap with teachers visible in the current list?
      // Yes, safe to swap with same school teachers.
      const sameSpecTeachers = currentSchoolTeachers.filter(t => t.specializationId === teacher.specializationId).sort((a,b) => (a.sortIndex||0) - (b.sortIndex||0));
      
      const currentIndexInGroup = sameSpecTeachers.findIndex(t => t.id === id);
      if (currentIndexInGroup === -1) return;

      const targetIndexInGroup = direction === 'up' ? currentIndexInGroup - 1 : currentIndexInGroup + 1;
      if (targetIndexInGroup < 0 || targetIndexInGroup >= sameSpecTeachers.length) return;

      const targetTeacher = sameSpecTeachers[targetIndexInGroup];

      // Swap sort indexes in main list
      setTeachers(prev => prev.map(t => {
          if (t.id === teacher.id) return { ...t, sortIndex: targetTeacher.sortIndex };
          if (t.id === targetTeacher.id) return { ...t, sortIndex: teacher.sortIndex };
          return t;
      }));
  };
  
    const moveSection = (specId: string, direction: 'up' | 'down') => {
        // Only consider visible specializations
        const usedSpecs = getUsedSpecializationIds();
        const visibleOrder = specializationOrder.filter(id => usedSpecs.includes(id));
        
        const currentIdx = visibleOrder.indexOf(specId);
        if (currentIdx === -1) return;
        
        const targetIdx = direction === 'up' ? currentIdx - 1 : currentIdx + 1;
        if (targetIdx < 0 || targetIdx >= visibleOrder.length) return;
        
        const targetSpecId = visibleOrder[targetIdx];
        
        // Swap in full list
        const fullCurrentIdx = specializationOrder.indexOf(specId);
        const fullTargetIdx = specializationOrder.indexOf(targetSpecId);
        
        const newOrder = [...specializationOrder];
        newOrder[fullCurrentIdx] = targetSpecId;
        newOrder[fullTargetIdx] = specId;
        setSpecializationOrder(newOrder);
    };

  // --- Render ---

  // Close print menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (printMenuRef.current && !printMenuRef.current.contains(event.target as Node)) {
        setPrintMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredTeachers = currentSchoolTeachers.filter(t => {
      const matchSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.phone.includes(searchTerm);
      const matchSpec = filterSpecialization ? t.specializationId === filterSpecialization : true;
      return matchSearch && matchSpec;
  });

  // Group by specialization
  const groupedTeachers: Record<string, Teacher[]> = {};
  filteredTeachers.forEach(t => {
      const specId = t.specializationId;
      if (!groupedTeachers[specId]) groupedTeachers[specId] = [];
      groupedTeachers[specId].push(t);
  });
  
  // Sort teachers within groups
  Object.keys(groupedTeachers).forEach(key => {
      groupedTeachers[key].sort((a,b) => (a.sortIndex || 0) - (b.sortIndex || 0));
  });

  // Determine order of groups to render
  const specsToRender = specializationOrder.filter(id => groupedTeachers[id] && groupedTeachers[id].length > 0);
  // Add any specs not in order at the end
  Object.keys(groupedTeachers).forEach(id => {
      if (!specsToRender.includes(id)) specsToRender.push(id);
  });

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500 pb-20">
      
      {/* ══════ School Tabs ══════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SchoolTabs
          schoolInfo={schoolInfo}
          activeSchoolId={activeSchoolId}
          onTabChange={(id) => {
              setActiveSchoolId(id);
              setSearchTerm('');
              setFilterSpecialization(null);
          }}
        />

        {schoolInfo.sharedSchools && schoolInfo.sharedSchools.length > 0 && (
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm mb-6">
            <span className="text-sm font-bold text-slate-600">دمج المعلمين في المدارس المشتركة:</span>
            <button
                onClick={() => setSchoolInfo && setSchoolInfo(prev => ({ ...prev, mergeTeachersView: !prev.mergeTeachersView }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    schoolInfo.mergeTeachersView ? 'bg-[#655ac1]' : 'bg-slate-200'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        schoolInfo.mergeTeachersView ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
         <h3 className="text-lg font-bold text-[#655ac1] flex items-center gap-2 mb-6 border-b border-slate-50 pb-2">
            <Briefcase size={20} /> بيانات المعلمين
        </h3>

        {/* Toolbar */}
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
                 {/* Hidden File Input */}
                 <input type="file" ref={fileInputRef} hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
                 
                 <Button onClick={openAddModal}>
                    <Plus size={18} className="ml-2"/> إضافة معلم
                 </Button>
                 <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Upload size={18} className="ml-2"/> {loading ? 'جاري الاستيراد...' : 'استيراد (Excel)'}
                 </Button>
                  <Button 
                    variant={isBulkEdit ? 'primary' : 'outline'} 
                    onClick={() => setIsBulkEdit(!isBulkEdit)}
                    className={isBulkEdit ? 'text-white border-transparent' : 'text-slate-600'}
                 >
                    {isBulkEdit ? <Check size={18} className="ml-2"/> : <Edit size={18} className="ml-2"/>}
                    {isBulkEdit ? 'حفظ التعديلات' : 'تعديل'}
                 </Button>

                 {/* Print Menu */}
                 <div className="relative" ref={printMenuRef}>
                    <Button variant="outline" onClick={() => setPrintMenuOpen(!printMenuOpen)}>
                        <Printer size={18} className="ml-2"/> طباعة
                        <ChevronDown size={14} className="mr-2 opacity-50"/>
                    </Button>
                    {printMenuOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                            <div className="p-2 border-b border-gray-50">
                                <button onClick={() => handlePrint('all')} className="w-full text-right px-3 py-2 text-sm hover:bg-indigo-50 rounded-lg flex items-center gap-2">
                                    <List size={16}/> طباعة الكل
                                </button>
                            </div>
                            <div className="max-h-48 overflow-y-auto p-2">
                                <div className="text-xs text-gray-400 font-bold mb-2 px-2">حسب التخصص</div>
                                {getUsedSpecializationIds().map(id => (
                                    <button key={id} onClick={() => handlePrint('specialization', id)} className="w-full text-right px-3 py-1.5 text-sm hover:bg-gray-50 rounded-lg text-gray-600">
                                        {getSpecializationName(id)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                 </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="بحث بالاسم أو الجوال..."
                        className="w-full pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#8779fb]/20"
                    />
                </div>
                <select 
                    value={filterSpecialization || ''}
                    onChange={e => setFilterSpecialization(e.target.value || null)}
                    className="p-2 border border-slate-200 rounded-lg outline-none bg-white min-w-[200px]"
                >
                    <option value="">كل التخصصات</option>
                    {getUsedSpecializationIds().map(id => (
                        <option key={id} value={id}>{getSpecializationName(id)}</option>
                    ))}
                </select>
            </div>
            
            <div className="text-sm text-gray-500 font-medium">
                العدد الكلي: {filteredTeachers.length} معلم
            </div>
        </div>

        {/* Teachers List / Table */}
        <div className="space-y-6">
            {specsToRender.map(specId => {
                const group = groupedTeachers[specId];
                return (
                    <div key={specId} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                         <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center print:bg-white print:border-b-2">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-5 bg-[#655ac1] rounded-full" />
                                <h4 className="font-bold text-gray-800">{getSpecializationName(specId)} <span className="text-xs font-normal text-gray-500">({group.length})</span></h4>
                            </div>
                            <div className="flex items-center gap-1 print:hidden">
                                <button onClick={() => moveSection(specId, 'up')} className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-gray-400 hover:text-[#655ac1]"><ArrowUp size={14}/></button>
                                <button onClick={() => moveSection(specId, 'down')} className="p-1 hover:bg-white rounded border border-transparent hover:border-gray-200 text-gray-400 hover:text-[#655ac1]"><ArrowDown size={14}/></button>
                            </div>
                         </div>
                         
                         <table className="w-full text-right">
                             <thead className="bg-white border-b text-xs text-gray-500">
                                <tr>
                                    <th className="px-4 py-3 w-12">#</th>
                                    <th className="px-4 py-3">الاسم</th>
                                    <th className="px-4 py-3">الجوال</th>
                                    <th className="px-4 py-3 text-center w-24">حصص</th>
                                    <th className="px-4 py-3 text-center w-24">انتظار</th>
                                    <th className="px-4 py-3 text-center w-24">مجموع</th>
                                    <th className="px-4 py-3 w-24 print:hidden">إجراءات</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y text-sm">
                                {group.map((t, idx) => (
                                    <tr key={t.id} className="hover:bg-slate-50 group">
                                        <td className="px-4 py-3 text-gray-400">
                                            <div className="flex items-center gap-1">
                                                {!isBulkEdit && (
                                                    <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                                                        <button onClick={() => moveTeacher(t.id, 'up')} disabled={idx===0} className="hover:text-[#655ac1]"><ChevronUp size={12}/></button>
                                                        <button onClick={() => moveTeacher(t.id, 'down')} disabled={idx===group.length-1} className="hover:text-[#655ac1]"><ChevronDown size={12}/></button>
                                                    </div>
                                                )}
                                                {idx + 1}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-gray-800">
                                            {isBulkEdit ? (
                                                <input value={t.name} onChange={e => setTeachers(prev => prev.map(pt => pt.id === t.id ? {...pt, name: e.target.value} : pt))} className="w-full p-1 border rounded" />
                                            ) : t.name}
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                                             {isBulkEdit ? (
                                                <input value={t.phone} onChange={e => setTeachers(prev => prev.map(pt => pt.id === t.id ? {...pt, phone: e.target.value} : pt))} className="w-full p-1 border rounded dir-ltr text-right" />
                                            ) : t.phone}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold">
                                             {isBulkEdit ? (
                                                <input type="number" value={t.quotaLimit} onChange={e => setTeachers(prev => prev.map(pt => pt.id === t.id ? {...pt, quotaLimit: Number(e.target.value)} : pt))} className="w-16 p-1 border rounded text-center" />
                                            ) : t.quotaLimit}
                                        </td>
                                        <td className="px-4 py-3 text-center font-bold text-orange-600">
                                             {isBulkEdit ? (
                                                <input type="number" value={t.waitingQuota || 0} onChange={e => setTeachers(prev => prev.map(pt => pt.id === t.id ? {...pt, waitingQuota: Number(e.target.value)} : pt))} className="w-16 p-1 border rounded text-center" />
                                            ) : (t.waitingQuota || 0)}
                                        </td>
                                         <td className="px-4 py-3 text-center font-black text-[#655ac1]">
                                            {(t.quotaLimit || 0) + (t.waitingQuota || 0)}
                                        </td>
                                        <td className="px-4 py-3 print:hidden">
                                            {!isBulkEdit && (
                                                <div className="flex gap-2">
                                                    <button onClick={() => openEditModal(t)} className="text-blue-400 hover:text-blue-600"><Edit size={16}/></button>
                                                    <button onClick={() => removeTeacher(t.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                         </table>
                    </div>
                );
            })}
             {filteredTeachers.length === 0 && (
                <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                    لا يوجد معلمين يطابقون البحث
                </div>
            )}
        </div>

        {/* Modal */}
        {showModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                 <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="font-bold text-xl">{modalMode === 'add' ? 'إضافة معلم جديد' : 'تعديل بيانات معلم'}</h3>
                        <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-red-500"/></button>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">الاسم</label>
                            <input value={currentTeacher.name} onChange={e => setCurrentTeacher({...currentTeacher, name: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-[#655ac1]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">التخصص</label>
                            <select value={currentTeacher.specializationId} onChange={e => setCurrentTeacher({...currentTeacher, specializationId: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-[#655ac1]">
                                {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">رقم الجوال</label>
                            <input value={currentTeacher.phone} onChange={e => setCurrentTeacher({...currentTeacher, phone: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-[#655ac1]" />
                        </div>
                        {schoolInfo.sharedSchools && schoolInfo.sharedSchools.length > 0 && !schoolInfo.mergeTeachersView && (
                            <div>
                                <label className="block text-sm font-bold mb-1">المدرسة</label>
                                <select 
                                    value={currentTeacher.schoolId || 'main'} 
                                    onChange={e => setCurrentTeacher({...currentTeacher, schoolId: e.target.value})} 
                                    className="w-full p-2 border rounded-lg outline-none focus:border-[#655ac1]"
                                >
                                    <option value="main">{schoolInfo.schoolName}</option>
                                    {schoolInfo.sharedSchools.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                         <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold mb-1">نصاب الحصص</label>
                                <input type="number" value={currentTeacher.quotaLimit} onChange={e => setCurrentTeacher({...currentTeacher, quotaLimit: Number(e.target.value)})} className="w-full p-2 border rounded-lg outline-none focus:border-[#655ac1]" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-1">نصاب الانتظار</label>
                                <input type="number" value={currentTeacher.waitingQuota || 0} onChange={e => setCurrentTeacher({...currentTeacher, waitingQuota: Number(e.target.value)})} className="w-full p-2 border rounded-lg outline-none focus:border-[#655ac1]" />
                            </div>
                         </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-8 pt-4 border-t">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>إلغاء</Button>
                        <Button onClick={saveTeacher}>حفظ</Button>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Step6Teachers;

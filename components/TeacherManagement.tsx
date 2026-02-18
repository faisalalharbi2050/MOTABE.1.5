
import React, { useState, useRef, useMemo } from 'react';
import { Teacher, Specialization, Subject } from '../types';
import { UserPlus, Trash2, X, Plus, User, BookOpen, Search, Users, ShieldCheck, FileSpreadsheet, ClipboardPaste, CheckCircle2, Upload, Info, AlertCircle, TrendingUp, Award, Filter, Edit3, ArrowUp, ArrowDown, Settings2, Sparkles } from 'lucide-react';

interface Props {
  teachers: Teacher[];
  setTeachers: React.Dispatch<React.SetStateAction<Teacher[]>>;
  specializations: Specialization[];
  setSpecializations: React.Dispatch<React.SetStateAction<Specialization[]>>;
  subjects: Subject[];
}

declare var XLSX: any;

// قاموس الربط الذكي للمسميات التعليمية
const SMART_SPEC_MAPPING: Record<string, string[]> = {
  'دين': ['قران', 'اسلاميه', 'دراسات اسلاميه', 'تربيه اسلاميه', 'تفسير', 'توحيد', 'فقه', 'حديث', 'ثقافه اسلاميه'],
  'عربي': ['لغه عربيه', 'لغتي', 'لغتي الخالده', 'نحو', 'ادب', 'بلاغه'],
  'رياضيات': ['حساب', 'رياضيات عامه', 'math'],
  'علوم': ['العلوم', 'ساينس', 'science'],
  'انجليزي': ['لغه انجليزيه', 'انجلش', 'english'],
  'الاجتماعيات': ['دراسات اجتماعيه', 'تاريخ', 'جغرافيا', 'مواطنه'],
  'الحاسب': ['حاسب الي', 'تقنيه معلومات', 'رقميه', 'مهارات رقميه', 'it'],
  'البدنية': ['رياضه', 'تربيه بدنيه', 'لياقه', 'العاب'],
  'الفنية': ['رسم', 'تربيه فنيه', 'اشغال', 'فنون'],
  'مهارات حياتية': ['اسريه', 'تربيه اسريه', 'مهارات حياتيه واسريه'],
};

const TeacherManagement: React.FC<Props> = ({ teachers, setTeachers, specializations, setSpecializations, subjects }) => {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({ name: '', specId: '', customSpec: '', subjectId: '', quota: '24', phone: '' });
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [tableSearch, setTableSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'specialization'>('name');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // دالة متطورة لتنظيف وتوحيد النصوص
  const normalizeText = (s: string) => {
    if (!s) return '';
    return s.trim()
      .replace(/\s+/g, ' ')
      .replace(/[أإآ]/g, 'ا')
      .replace(/ة/g, 'ه')
      .replace(/ى/g, 'ي')
      .replace(/^ال/, '') // إزالة ال التعريف من بداية الكلمة
      .replace(/ ال/, ' '); // إزالة ال التعريف بعد مسافة
  };

  // محرك البحث الذكي عن التخصص
  const findSmartSpecId = (rawName: string, currentSpecs: Specialization[]): string | null => {
    const normalizedInput = normalizeText(rawName);
    if (!normalizedInput) return null;

    // 1. البحث في القاموس الذكي أولاً
    for (const [mainSpec, synonyms] of Object.entries(SMART_SPEC_MAPPING)) {
      if (normalizeText(mainSpec) === normalizedInput || synonyms.some(syn => normalizeText(syn) === normalizedInput)) {
        // ابحث عن التخصص الرئيسي في القائمة الحالية
        const found = currentSpecs.find(s => normalizeText(s.name) === normalizeText(mainSpec));
        if (found) return found.id;
      }
    }

    // 2. البحث في القائمة الحالية عن تطابق مباشر أو جزئي
    const directMatch = currentSpecs.find(s => normalizeText(s.name) === normalizedInput);
    if (directMatch) return directMatch.id;

    return null;
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    let finalSpecId = formData.specId;
    
    if (formData.customSpec.trim()) {
      const smartId = findSmartSpecId(formData.customSpec, specializations);
      if (smartId) {
        finalSpecId = smartId;
      } else {
        const newId = `spec-${Date.now()}`;
        const newSpecObj = { id: newId, name: formData.customSpec.trim() };
        setSpecializations(prev => [...prev, newSpecObj]);
        finalSpecId = newId;
      }
    }

    const newTeacher: Teacher = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      specializationId: finalSpecId,
      assignedSubjectId: formData.subjectId,
      quotaLimit: parseInt(formData.quota) || 24,
      phone: formData.phone
    };

    setTeachers(prev => [...prev, newTeacher]);
    setFormData({ name: '', specId: '', customSpec: '', subjectId: '', quota: '24', phone: '' });
    setShowModal(false);
  };

  const handleEditInit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      specId: teacher.specializationId,
      customSpec: '',
      subjectId: teacher.assignedSubjectId,
      quota: teacher.quotaLimit.toString(),
      phone: teacher.phone || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher) return;

    setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? {
      ...t,
      name: formData.name,
      specializationId: formData.specId,
      quotaLimit: parseInt(formData.quota) || 24,
      phone: formData.phone
    } : t));

    setShowEditModal(false);
    setEditingTeacher(null);
    setFormData({ name: '', specId: '', customSpec: '', subjectId: '', quota: '24', phone: '' });
  };

  const moveSpec = (index: number, direction: 'up' | 'down') => {
    const newSpecs = [...specializations];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSpecs.length) return;
    
    [newSpecs[index], newSpecs[targetIndex]] = [newSpecs[targetIndex], newSpecs[index]];
    setSpecializations(newSpecs);
  };

  const processFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
        
        if (data.length < 1) {
          alert('الملف فارغ أو غير صالح.');
          return;
        }

        const headers: any[] = data[0] as any[];
        let nameIdx = -1, specIdx = -1, phoneIdx = -1;

        headers.forEach((h, i) => {
          if (!h) return;
          const s = h.toString().toLowerCase();
          if (s.includes('اسم') || s.includes('معلم') || s.includes('name')) nameIdx = i;
          if (s.includes('تخصص') || s.includes('spec') || s.includes('مادة')) specIdx = i;
          if (s.includes('جوال') || s.includes('هاتف') || s.includes('رقم') || s.includes('phone') || s.includes('mobile')) phoneIdx = i;
        });

        if (nameIdx === -1) nameIdx = 0;

        const newTeachers: Teacher[] = [];
        const currentSpecs = [...specializations];

        for (let i = 1; i < data.length; i++) {
          const row: any[] = data[i] as any[];
          if (!row || row.length === 0) continue;

          const rawName = row[nameIdx]?.toString().trim();
          if (!rawName || rawName.length < 2) continue;

          const rawSpec = specIdx !== -1 ? row[specIdx]?.toString().trim() : '';
          const rawPhone = phoneIdx !== -1 ? row[phoneIdx]?.toString().trim() : '';

          let specId = '';
          if (rawSpec) {
            const smartId = findSmartSpecId(rawSpec, currentSpecs);
            if (smartId) {
              specId = smartId;
            } else {
              // إذا لم يجد مرادف، ينشئ تخصص جديد
              const newId = `spec-${Math.random().toString(36).substr(2, 5)}-${Date.now()}`;
              const newSpecObj = { id: newId, name: rawSpec };
              currentSpecs.push(newSpecObj);
              specId = newId;
            }
          }

          newTeachers.push({
            id: Math.random().toString(36).substr(2, 9),
            name: rawName,
            phone: rawPhone || '',
            specializationId: specId,
            assignedSubjectId: '',
            quotaLimit: 24
          });
        }

        if (newTeachers.length > 0) {
          setSpecializations(currentSpecs);
          setTeachers(prev => [...prev, ...newTeachers]);
          alert(`تم بنجاح تحليل البيانات ودمج التخصصات المتشابهة. تم استيراد ${newTeachers.length} معلماً.`);
        } else {
          alert('لم يتم العثور على بيانات صالحة في الملف.');
        }
      } catch (err) {
        console.error(err);
        alert('حدث خطأ أثناء معالجة الملف.');
      } finally {
        setIsProcessing(false);
        setShowImportModal(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };

  const deleteSpecialization = (id: string) => {
    if (teachers.some(t => t.specializationId === id)) {
      alert("لا يمكن حذف تخصص مرتبط بمعلمين.");
      return;
    }
    if (confirm("هل أنت متأكد؟")) {
      setSpecializations(prev => prev.filter(s => s.id !== id));
    }
  };

  const totalQuota = teachers.reduce((sum, t) => sum + t.quotaLimit, 0);

  const filteredAndSortedTeachers = useMemo(() => {
    const specOrderMap = new Map<string, number>();
    specializations.forEach((s, i) => specOrderMap.set(s.id, i));
    
    return [...teachers]
      .filter(t => t.name.toLowerCase().includes(tableSearch.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name, 'ar');
        } else {
          const orderA = specOrderMap.has(a.specializationId) ? specOrderMap.get(a.specializationId)! : 9999;
          const orderB = specOrderMap.has(b.specializationId) ? specOrderMap.get(b.specializationId)! : 9999;
          
          if (orderA !== orderB) return orderA - orderB;
          return a.name.localeCompare(b.name, 'ar');
        }
      });
  }, [teachers, tableSearch, sortBy, specializations]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* Header & Actions */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
             إدارة المعلمين
          </h2>
          <p className="text-slate-400 text-sm font-medium">أضف الطاقم التعليمي وخصص التخصصات والأنصبة.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <button
                onClick={() => setShowSpecsModal(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all font-bold text-xs"
            >
                <Award size={16} /> عرض التخصصات
            </button>
            <button
                onClick={() => setShowImportModal(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl hover:bg-emerald-100 transition-all font-bold text-xs"
            >
                <FileSpreadsheet size={16} /> استيراد ذكي (Excel)
            </button>
            <button
                onClick={() => setShowModal(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2 bg-primary text-white rounded-xl hover:bg-secondary shadow-lg shadow-primary/10 transition-all font-bold text-xs"
            >
                <UserPlus size={16} /> إضافة معلم
            </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center shrink-0"><Users size={20}/></div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">إجمالي المعلمين</p>
                  <h4 className="text-lg font-black text-slate-800 mt-1">{teachers.length}</h4>
              </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shrink-0"><TrendingUp size={20}/></div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">إجمالي الأنصبة</p>
                  <h4 className="text-lg font-black text-slate-800 mt-1">{totalQuota}</h4>
              </div>
          </div>
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center shrink-0"><ShieldCheck size={20}/></div>
              <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none">متوسط النصاب</p>
                  <h4 className="text-lg font-black text-slate-800 mt-1">{teachers.length > 0 ? (totalQuota / teachers.length).toFixed(1) : 0}</h4>
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                    <Search size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="بحث سريع في قائمة المعلمين..." 
                        className="w-full pr-10 pl-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-bold outline-none focus:border-primary transition-all"
                        value={tableSearch}
                        onChange={e => setTableSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 p-1 rounded-xl w-full sm:w-auto">
                    <button 
                        onClick={() => setSortBy('name')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${sortBy === 'name' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        بالاسم
                    </button>
                    <button 
                        onClick={() => setSortBy('specialization')}
                        className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${sortBy === 'specialization' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        بالتخصص
                    </button>
                </div>
                {sortBy === 'specialization' && (
                  <button 
                    onClick={() => setShowOrderModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl text-[10px] font-black hover:bg-amber-100 transition-all animate-in zoom-in"
                  >
                    <Settings2 size={14} /> ضبط ترتيب التخصصات
                  </button>
                )}
              </div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  عرض {filteredAndSortedTeachers.length} من أصل {teachers.length}
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-right min-w-[600px]">
              <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 font-black text-slate-500 text-[11px]">الاسم</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[11px]">التخصص</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[11px] text-center">رقم الجوال</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[11px] text-center">النصاب</th>
                  <th className="px-6 py-4 font-black text-slate-500 text-[11px] text-center">إجراء</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                  {filteredAndSortedTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-accent/5 transition-all group">
                      <td className="px-6 py-3">
                        <div className="font-bold text-slate-800 text-xs">{teacher.name}</div>
                      </td>
                      <td className="px-6 py-3">
                          <span className="px-3 py-1 bg-primary/5 text-primary rounded-lg text-[10px] font-black">
                              {specializations.find(s => s.id === teacher.specializationId)?.name || 'غير محدد'}
                          </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                          <span className="text-[10px] font-bold text-slate-400">{teacher.phone || '-'}</span>
                      </td>
                      <td className="px-6 py-3 text-center">
                          <div className="inline-block px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-700">{teacher.quotaLimit}</div>
                      </td>
                      <td className="px-6 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                              <button onClick={() => handleEditInit(teacher)} className="p-2 text-slate-200 hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="تعديل"><Edit3 size={16} /></button>
                              <button onClick={() => setTeachers(prev => prev.filter(t => t.id !== teacher.id))} className="p-2 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="حذف"><Trash2 size={16} /></button>
                          </div>
                      </td>
                  </tr>
                  ))}
              </tbody>
              </table>
              {filteredAndSortedTeachers.length === 0 && (
                  <div className="py-20 text-center">
                      <Users size={32} className="text-slate-100 mx-auto mb-3" />
                      <p className="text-slate-300 font-bold text-sm">لا يوجد معلمين مطابقين للبحث.</p>
                  </div>
              )}
          </div>
      </div>

      {/* Specializations Modal */}
      {showSpecsModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Award size={24} />
                    <h3 className="text-lg font-black">قائمة تخصصات المعلمين</h3>
                 </div>
                 <button onClick={() => setShowSpecsModal(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                 {/* Grand Total Counter */}
                 <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-3xl flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white text-indigo-600 rounded-xl flex items-center justify-center shadow-sm"><Users size={20}/></div>
                        <span className="font-black text-indigo-900 text-sm">إجمالي المعلمين بكافة التخصصات</span>
                    </div>
                    <span className="text-2xl font-black text-indigo-600">{teachers.length}</span>
                 </div>

                 <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
                    {specializations.length === 0 ? (
                        <div className="text-center py-10 text-slate-300 font-bold text-xs">لا توجد تخصصات مضافة حالياً.</div>
                    ) : (
                        specializations.map(s => {
                            const count = teachers.filter(t => t.specializationId === s.id).length;
                            return (
                                <div key={s.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 transition-all group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                                        <span className="font-bold text-xs text-slate-700">{s.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-0.5 rounded-lg border border-indigo-100">
                                                {count} معلم
                                            </span>
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); deleteSpecialization(s.id); }} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all">
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                 </div>

                 <button onClick={() => setShowSpecsModal(false)} className="w-full bg-slate-100 text-slate-500 py-3 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">إغلاق النافذة</button>
              </div>
           </div>
        </div>
      )}

      {/* Specialization Ordering Modal */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[120] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-amber-600 p-6 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Settings2 size={24} />
                    <h3 className="text-lg font-black">ترتيب التخصصات يدوياً</h3>
                 </div>
                 <button onClick={() => setShowOrderModal(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                 <p className="text-[11px] text-slate-400 font-bold mb-2">سيتم ترتيب المعلمين في الجدول بناءً على هذا الترتيب المختار.</p>
                 <div className="max-h-[450px] overflow-y-auto custom-scrollbar space-y-2 pr-1">
                    {specializations.map((s, index) => {
                      const count = teachers.filter(t => t.specializationId === s.id).length;
                      return (
                        <div key={s.id} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-2xl group/item">
                          <div className="flex flex-col">
                            <span className="font-black text-xs text-slate-700">{s.name}</span>
                            <span className="text-[9px] font-bold text-slate-400">مرتبط بـ {count} معلم</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <button 
                              disabled={index === 0}
                              onClick={() => moveSpec(index, 'up')} 
                              className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button 
                              disabled={index === specializations.length - 1}
                              onClick={() => moveSpec(index, 'down')} 
                              className="p-2 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-primary disabled:opacity-30 transition-all shadow-sm"
                            >
                              <ArrowDown size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                 </div>
                 <button onClick={() => setShowOrderModal(false)} className="w-full bg-primary text-white py-3.5 rounded-2xl font-black text-sm hover:bg-secondary shadow-lg shadow-primary/10 transition-all active:scale-95">اعتماد الترتيب الجديد</button>
              </div>
           </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <FileSpreadsheet size={24} />
                    <h3 className="text-lg font-black">استيراد ذكي من Excel</h3>
                 </div>
                 <button onClick={() => setShowImportModal(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-6">
                 <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex gap-3 items-start">
                    <Sparkles size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-emerald-800 leading-relaxed font-bold">
                       <p className="flex items-center gap-1">محرك الربط الذكي مفعل <span className="text-[9px] bg-emerald-200 px-1 rounded">AI</span></p>
                       <ul className="list-disc list-inside mt-1 text-[10px]">
                          <li>سيتم تحويل (قرآن، توحيد، إلخ) إلى تخصص "دين".</li>
                          <li>سيتم تحويل (لغة عربية، لغتي) إلى تخصص "عربي".</li>
                          <li>دمج تلقائي للمسميات المتشابهة لتجنب التكرار.</li>
                       </ul>
                    </div>
                 </div>

                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group border-2 border-dashed border-slate-100 rounded-3xl p-10 flex flex-col items-center justify-center gap-3 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all cursor-pointer"
                 >
                    {isProcessing ? (
                        <div className="flex flex-col items-center animate-pulse">
                            <Upload className="text-emerald-500 animate-bounce mb-1" size={32} />
                            <p className="text-emerald-600 text-xs font-black">جاري تحليل البيانات ذكياً...</p>
                        </div>
                    ) : (
                        <>
                            <Upload size={32} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                            <div className="text-center">
                                <p className="text-sm font-black text-slate-700">اضغط لرفع ملف Excel</p>
                                <p className="text-[10px] text-slate-400 mt-1">xls, xlsx, csv</p>
                            </div>
                        </>
                    )}
                    <input ref={fileInputRef} type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={processFile} disabled={isProcessing} />
                 </div>

                 <button onClick={() => setShowImportModal(false)} className="w-full bg-slate-100 text-slate-500 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">إلغاء</button>
              </div>
           </div>
        </div>
      )}

      {/* Manual Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-primary p-6 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <UserPlus size={24} />
                    <h3 className="text-lg font-black">إضافة معلم جديد</h3>
                 </div>
                 <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleAdd} className="p-6 space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">اسم المعلم</label>
                       <input required autoFocus className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-xs font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="الاسم الرباعي" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">رقم الجوال</label>
                       <input className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-xs font-bold text-left" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="05xxxxxxxx" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">التخصص</label>
                       <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold appearance-none" value={formData.specId} onChange={e => setFormData({...formData, specId: e.target.value})}>
                         <option value="">اختر التخصص من القائمة</option>
                         {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">أو أضف تخصص جديد</label>
                       <input className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-xs font-bold" value={formData.customSpec} onChange={e => setFormData({...formData, customSpec: e.target.value})} placeholder="اكتب اسم التخصص هنا" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">النصاب</label>
                       <input type="number" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-center font-bold text-sm" value={formData.quota} onChange={e => setFormData({...formData, quota: e.target.value})} />
                    </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-black text-sm hover:bg-secondary shadow-lg shadow-primary/10 transition-all active:scale-95">حفظ المعلم</button>
                    <button type="button" onClick={() => setShowModal(false)} className="px-8 bg-slate-100 text-slate-500 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">إلغاء</button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {showEditModal && editingTeacher && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
           <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="bg-primary p-6 text-white flex justify-between items-center">
                 <div className="flex items-center gap-3">
                    <Edit3 size={24} />
                    <h3 className="text-lg font-black">تعديل بيانات المعلم</h3>
                 </div>
                 <button onClick={() => setShowEditModal(false)} className="p-1.5 hover:bg-white/10 rounded-full transition-all"><X size={20} /></button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">اسم المعلم</label>
                       <input required autoFocus className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-xs font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="الاسم الرباعي" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">رقم الجوال</label>
                       <input className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary transition-all text-xs font-bold text-left" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="05xxxxxxxx" />
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">التخصص</label>
                       <select className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs font-bold appearance-none" value={formData.specId} onChange={e => setFormData({...formData, specId: e.target.value})}>
                         <option value="">اختر التخصص</option>
                         {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-1.5">
                       <label className="text-[11px] font-black text-slate-500 mr-2">النصاب</label>
                       <input type="number" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-center font-black text-sm" value={formData.quota} onChange={e => setFormData({...formData, quota: e.target.value})} />
                    </div>
                 </div>
                 <div className="pt-4 flex gap-3">
                    <button type="submit" className="flex-1 bg-primary text-white py-3.5 rounded-2xl font-black text-sm hover:bg-secondary shadow-lg shadow-primary/10 transition-all active:scale-95">تحديث البيانات</button>
                    <button type="button" onClick={() => setShowEditModal(false)} className="px-8 bg-slate-100 text-slate-500 py-3.5 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all">إلغاء</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default TeacherManagement;

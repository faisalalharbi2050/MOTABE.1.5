import React, { useState } from 'react';
import { X, Printer, Users, User, LayoutGrid, BookOpen, CalendarClock, ChevronDown } from 'lucide-react';
import { ScheduleSettingsData, Teacher, ClassInfo, Subject, SchoolInfo } from '../../types';
import PrintableSchedule from './PrintableSchedule';

interface PrintOptionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: ScheduleSettingsData;
    teachers: Teacher[];
    classes: ClassInfo[];
    subjects: Subject[];
    schoolInfo: SchoolInfo;
}

type PrintType = 'general_teachers' | 'general_classes' | 'individual_teacher' | 'individual_class' | 'general_waiting';

const PrintOptionsModal: React.FC<PrintOptionsModalProps> = ({
    isOpen,
    onClose,
    settings,
    teachers,
    classes,
    subjects,
    schoolInfo
}) => {
    const [selectedType, setSelectedType] = useState<PrintType | null>(null);
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
    const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState<number>(1);
    const [showPreview, setShowPreview] = useState(false);

    if (!isOpen) return null;
    
    // Chunk helper
    const chunkArray = (arr: any[], size: number) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const printOptions: Array<{
        id: PrintType;
        title: string;
        icon: React.ReactNode;
    }> = [
        { id: 'general_teachers', title: 'الجدول العام للمعلمين', icon: <Users size={18} className="text-[#655ac1]" /> },
        { id: 'general_classes',  title: 'الجدول العام للفصول',  icon: <LayoutGrid size={18} className="text-[#655ac1]" /> },
        { id: 'general_waiting',  title: 'الجدول العام للانتظار', icon: <CalendarClock size={18} className="text-[#655ac1]" /> },
        { id: 'individual_teacher', title: 'جدول معلم', icon: <User size={18} className="text-[#655ac1]" /> },
        { id: 'individual_class',   title: 'جدول فصل',  icon: <BookOpen size={18} className="text-[#655ac1]" /> },
    ];

    const needsTeachers = selectedType === 'individual_teacher';
    const needsClasses  = selectedType === 'individual_class';
    const isReady = selectedType && (
        (!needsTeachers && !needsClasses) ||
        (needsTeachers && selectedTeacherIds.length > 0) ||
        (needsClasses  && selectedClassIds.length > 0)
    );

    // Toggle selection helper
    const toggleId = (id: string, list: string[], setList: (v: string[]) => void) => {
        setList(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
    };

    if (showPreview && selectedType) {
        const targetIds = needsTeachers ? selectedTeacherIds : needsClasses ? selectedClassIds : ['__all__'];
        // Use chunking if individual
        const chunks = (needsTeachers || needsClasses) ? chunkArray(targetIds, itemsPerPage) : targetIds.map(id => [id]);

        return (
            <div className="fixed inset-0 z-[110] bg-white overflow-auto print:p-0">
                {/* Toolbar */}
                <div className="no-print sticky top-0 z-10 flex items-center gap-3 px-6 py-3 bg-white border-b border-slate-200 shadow-sm print:hidden">
                    <button
                        onClick={() => setShowPreview(false)}
                        className="flex items-center gap-2 px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                    >
                        <X size={16} />
                        رجوع
                    </button>
                    <div className="bg-slate-100 rounded-lg px-3 py-2 flex gap-2 items-center">
                        <span className="text-xs font-bold text-slate-500">جداول/صفحة:</span>
                        {[1,2,3,4].map(n => (
                            <button 
                                key={n}
                                onClick={() => setItemsPerPage(n)}
                                className={`w-6 h-6 rounded flex items-center justify-center text-xs font-black transition-colors ${itemsPerPage===n ? 'bg-[#655ac1] text-white' : 'bg-white hover:bg-slate-200 text-slate-600'}`}
                            >
                                {n}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-5 py-2 bg-[#655ac1] hover:bg-[#5046a0] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#655ac1]/20 transition-colors"
                    >
                        <Printer size={16} />
                        طباعة
                    </button>
                    <span className="text-sm text-slate-500 font-medium">
                        المعاينة — {printOptions.find(p => p.id === selectedType)?.title}
                    </span>
                </div>
                {/* Preview Content */}
                <div className="p-8 print:p-0">
                    {chunks.map((chunk, chunkIdx) => (
                        <div key={chunkIdx} 
                             className={`mb-12 print:mb-0 print:break-after-page last:mb-0 bg-white min-h-[29.7cm] p-[1cm] shadow-sm print:shadow-none print:min-h-0 print:h-auto print:w-full grid gap-4`}
                             style={{
                                 gridTemplateColumns: itemsPerPage > 1 ? 'repeat(2, 1fr)' : '1fr',
                                 gridTemplateRows: itemsPerPage > 2 ? 'repeat(2, 1fr)' : (itemsPerPage === 2 ? 'repeat(2, 1fr)' : '1fr')
                             }}
                        >
                            {chunk.map(tid => (
                                <div key={tid} className="border border-slate-200 rounded-xl overflow-hidden print:border-none">
                                    <PrintableSchedule
                                        type={selectedType}
                                        settings={settings}
                                        teachers={teachers}
                                        classes={classes}
                                        subjects={subjects}
                                        targetId={tid === '__all__' ? undefined : tid}
                                        schoolInfo={schoolInfo}
                                        onClose={() => setShowPreview(false)}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
                {/* Header */}
          {/* ... existing header ... */}
          <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#e5e1fe] flex items-center justify-center">
                            <Printer size={20} className="text-[#655ac1]" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800">معاينة وطباعة الجداول</h3>
                            <p className="text-xs text-slate-500">اختر نوع الجدول المطلوب</p>
                        </div>
                    </div>
                     {/* Items per page selector (visible for individual) */}
                     {(needsTeachers || needsClasses) && (
                        <div className="flex gap-1 bg-white p-1 rounded-lg border border-slate-200">
                            {[1,2,3,4].map(n => (
                                <button 
                                key={n}
                                onClick={() => setItemsPerPage(n)}
                                title={`${n} جدول في الصفحة`}
                                className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-black transition-colors ${itemsPerPage===n ? 'bg-[#655ac1] text-white' : 'text-slate-400 hover:bg-slate-50'}`}
                            >
                                {n}
                            </button>
                            ))}
                        </div>
                    )}
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3 overflow-y-auto max-h-[70vh]">
                    {/* Type Selection */}
                    <div className="space-y-1.5">
                        {printOptions.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => {
                                    setSelectedType(opt.id);
                                    setSelectedTeacherIds([]);
                                    setSelectedClassIds([]);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border-2 font-bold text-sm transition-all ${
                                    selectedType === opt.id
                                        ? 'border-[#8779fb] bg-white text-[#655ac1]'
                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-[#8779fb]/40 hover:bg-slate-100'
                                }`}
                            >
                                <span className="shrink-0">{opt.icon}</span>
                                <span>{opt.title}</span>
                                {selectedType === opt.id && <ChevronDown size={16} className="mr-auto" />}
                            </button>
                        ))}
                    </div>

                    {/* Teacher Multi-Select */}
                    {needsTeachers && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                            <p className="text-xs font-black text-slate-500 mb-2">اختر المعلم / المعلمين</p>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                                {teachers.map(t => (
                                    <label key={t.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedTeacherIds.includes(t.id)}
                                            onChange={() => toggleId(t.id, selectedTeacherIds, setSelectedTeacherIds)}
                                            className="w-4 h-4 accent-[#655ac1] rounded"
                                        />
                                        <span className="text-sm font-bold text-slate-700">{t.name}</span>
                                    </label>
                                ))}
                            </div>
                            {selectedTeacherIds.length > 0 && (
                                <p className="text-xs text-[#655ac1] font-bold mt-2">✓ تم اختيار {selectedTeacherIds.length} معلم</p>
                            )}
                        </div>
                    )}

                    {/* Class Multi-Select */}
                    {needsClasses && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                            <p className="text-xs font-black text-slate-500 mb-2">اختر الفصل / الفصول</p>
                            <div className="space-y-1 max-h-48 overflow-y-auto">
                                {[...classes].sort((a, b) => a.grade !== b.grade ? a.grade - b.grade : (a.section || 0) - (b.section || 0)).map(c => (
                                    <label key={c.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={selectedClassIds.includes(c.id)}
                                            onChange={() => toggleId(c.id, selectedClassIds, setSelectedClassIds)}
                                            className="w-4 h-4 accent-[#655ac1] rounded"
                                        />
                                        <span className="text-sm font-bold text-slate-700">{c.name || `${c.grade}/${c.section}`}</span>
                                    </label>
                                ))}
                            </div>
                            {selectedClassIds.length > 0 && (
                                <p className="text-xs text-[#655ac1] font-bold mt-2">✓ تم اختيار {selectedClassIds.length} فصل</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm transition-colors">
                        إلغاء
                    </button>
                    <button
                        onClick={() => isReady && setShowPreview(true)}
                        disabled={!isReady}
                        className="flex-1 py-3 bg-[#655ac1] hover:bg-[#5046a0] text-white rounded-2xl font-bold text-sm shadow-lg shadow-[#655ac1]/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Printer size={16} />
                        معاينة
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrintOptionsModal;

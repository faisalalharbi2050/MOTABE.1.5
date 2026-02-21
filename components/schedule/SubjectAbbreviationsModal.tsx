import React, { useState, useEffect } from 'react';
import { Subject, ScheduleSettingsData } from '../../types';
import { Bot, Save, X, TypeIcon, Sparkles } from 'lucide-react';

interface SubjectAbbreviationsModalProps {
    isOpen: boolean;
    onClose: () => void;
    subjects: Subject[];
    settings: ScheduleSettingsData;
    onSave: (abbreviations: Record<string, string>) => void;
}

const generateSuggestion = (name: string): string => {
    // Basic smart suggestions
    if (name.includes('الدراسات الإسلامية')) return 'إسلامية';
    if (name.includes('التربية البدنية')) return 'بدنية';
    if (name.includes('التربية الفنية')) return 'فنية';
    if (name.includes('الدراسات الاجتماعية')) return 'اجتماعيات';
    if (name.includes('المهارات الرقمية')) return 'رقمية';
    if (name.includes('المهارات الحياتية')) return 'حياتية';
    if (name.includes('لغتي')) return 'لغتي';
    if (name.includes('القرآن الكريم')) return 'قرآن';
    if (name.includes('الرياضيات')) return 'رياضيات';
    if (name.includes('العلوم')) return 'علوم';
    if (name.includes('اللغة الإنجليزية')) return 'E';
    
    // If multiple words and no specific rule, just return first word if it's distinctive, or full name if short
    const words = name.split(' ');
    if (words.length > 1 && words[0] !== 'التربية' && words[0] !== 'الدراسات' && words[0] !== 'اللغة') {
        return words[0];
    } else if (words.length > 1) {
        return words[1]; // Return second word e.g "التربية الموسيقية" -> "الموسيقية"
    }
    
    return name;
};

const SubjectAbbreviationsModal: React.FC<SubjectAbbreviationsModalProps> = ({
    isOpen,
    onClose,
    subjects,
    settings,
    onSave
}) => {
    const [abbreviations, setAbbreviations] = useState<Record<string, string>>({});

    // Load existing or suggest new ones upon opening
    useEffect(() => {
        if (isOpen) {
            const initialMap: Record<string, string> = {};
            subjects.forEach(sub => {
                if (settings.subjectAbbreviations && settings.subjectAbbreviations[sub.id]) {
                    initialMap[sub.id] = settings.subjectAbbreviations[sub.id];
                } else {
                    initialMap[sub.id] = generateSuggestion(sub.name);
                }
            });
            setAbbreviations(initialMap);
        }
    }, [isOpen, subjects, settings.subjectAbbreviations]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(abbreviations);
        onClose();
    };

    const handleSuggestAll = () => {
        const newMap: Record<string, string> = {};
        subjects.forEach(sub => {
             newMap[sub.id] = generateSuggestion(sub.name);
        });
        setAbbreviations(newMap);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#e5e1fe] text-[#655ac1] flex items-center justify-center shadow-sm">
                            <TypeIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-800">اختصارات المواد</h2>
                            <p className="text-sm font-medium text-slate-500 mt-1">تحديد أسماء قصيرة للمواد لتوفير مساحة في الجدول</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={handleSuggestAll}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 rounded-xl transition-all"
                        >
                            <Sparkles size={16} className="text-amber-500" />
                            اقتراح ذكي للكل
                        </button>
                        <button 
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto p-6 flex-1 custom-scrollbar bg-slate-50/50">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {subjects.map(subject => (
                             <div key={subject.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-2">
                                 <label className="text-sm font-bold text-slate-700 truncate" title={subject.name}>
                                     {subject.name}
                                 </label>
                                 <div className="relative">
                                     <input 
                                         type="text"
                                         value={abbreviations[subject.id] || ''}
                                         onChange={(e) => setAbbreviations({...abbreviations, [subject.id]: e.target.value})}
                                         className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-[#655ac1] focus:outline-none focus:ring-2 focus:ring-[#655ac1]/20 focus:border-[#655ac1] transition-all dir-rtl"
                                         placeholder="اسم مختصر..."
                                         maxLength={15}
                                     />
                                     <Bot size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none opacity-50" />
                                 </div>
                             </div>
                         ))}
                     </div>
                     
                     {subjects.length === 0 && (
                         <div className="text-center py-12 text-slate-400 font-medium">
                             لا يوجد مواد مضافة للنظام حتى الآن.
                         </div>
                     )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                    >
                        إلغاء الأمر
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-8 py-2.5 bg-[#655ac1] hover:bg-[#5a4eb3] text-white font-bold rounded-xl transition-all shadow-md shadow-[#655ac1]/20 flex items-center gap-2"
                    >
                        <Save size={18} />
                        حفظ الاختصارات
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SubjectAbbreviationsModal;

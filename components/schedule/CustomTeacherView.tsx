import React, { useState } from 'react';
import { Teacher, ScheduleSettingsData, TimetableData, Subject, ClassInfo, AuditLogEntry } from '../../types';
import { getKey, tryMoveOrSwap, findChainSwap, SwapResult } from '../../utils/scheduleInteractive';
import { Search, UserPlus, Check, X, Users, Lock, Eye } from 'lucide-react';
import SwapConfirmationModal from './SwapConfirmationModal';

interface CustomTeacherViewProps {
    teachers: Teacher[];
    subjects: Subject[];
    classes: ClassInfo[];
    settings: ScheduleSettingsData;
    onUpdateSettings: (newSettings: ScheduleSettingsData) => void;
    activeSchoolId: string;
}

const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
const DAY_NAMES: Record<string, string> = {
    'sunday': 'الأحد', 'monday': 'الإثنين', 'tuesday': 'الثلاثاء', 'wednesday': 'الأربعاء', 'thursday': 'الخميس'
};

const CustomTeacherView: React.FC<CustomTeacherViewProps> = ({
    teachers,
    subjects,
    classes,
    settings,
    onUpdateSettings,
    activeSchoolId
}) => {
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSelecting, setIsSelecting] = useState(false);

    const [dragSource, setDragSource] = useState<{teacherId: string, day: string, period: number} | null>(null);
    const [hoverTarget, setHoverTarget] = useState<string | null>(null);
    const [pendingSwap, setPendingSwap] = useState<SwapResult | null>(null);

    const periodCount = 7; // Customize if needed from timing config
    const timetable = settings.timetable || {};

    const filteredTeachers = teachers.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) && !selectedTeacherIds.includes(t.id)
    );

    const selectedTeachers = teachers.filter(t => selectedTeacherIds.includes(t.id));

    // Drag and Drop Logic
    const handleDragStart = (e: React.DragEvent, teacherId: string, day: string, period: number) => {
        const key = getKey(teacherId, day, period);
        if (!timetable[key]) {
            e.preventDefault();
            return;
        }
        setDragSource({ teacherId, day, period });
        e.dataTransfer.setData('sourceKey', key);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, targetKey: string) => {
        e.preventDefault();
        setHoverTarget(targetKey);
    };

    const handleDrop = (e: React.DragEvent, targetTeacherId: string, targetDay: string, targetPeriod: number) => {
        e.preventDefault();
        setHoverTarget(null);
        if (!dragSource) return;

        // Ensure we are dropping on same day if required (or allow across days if user wants? User requested any slot)
        const result = tryMoveOrSwap(
            timetable,
            dragSource,
            { teacherId: targetTeacherId, day: targetDay, period: targetPeriod },
            settings
        );

        if (result.success) {
            setPendingSwap(result);
        } else {
            const chainResult = findChainSwap(
                timetable,
                dragSource,
                { teacherId: targetTeacherId, day: targetDay, period: targetPeriod },
                teachers,
                settings
            );

            if (chainResult && chainResult.success) {
                setPendingSwap(chainResult);
            } else {
                alert(result.reason || "لا يمكن النقل (تعارض في الجدول)");
            }
        }
        
        setDragSource(null);
    };

    const confirmSwap = () => {
        if (pendingSwap && pendingSwap.newTimetable) {
            const logEntry: AuditLogEntry = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                user: "المستخدم الحالي",
                actionType: pendingSwap.isChain ? 'chain_swap' : 'swap',
                description: pendingSwap.chainSteps?.join(' | ') || 'تبديل حصص من العرض المخصص',
                relatedTeacherIds: pendingSwap.relatedTeacherIds || []
            };

            const updatedLogs = [...(settings.auditLogs || []), logEntry];
            
            // Auto add related teachers to the view if not already there
            if (pendingSwap.relatedTeacherIds) {
                const newIds = pendingSwap.relatedTeacherIds.filter(id => !selectedTeacherIds.includes(id));
                if (newIds.length > 0) {
                    setSelectedTeacherIds([...selectedTeacherIds, ...newIds]);
                }
            }

            onUpdateSettings({ 
                ...settings, 
                timetable: pendingSwap.newTimetable,
                auditLogs: updatedLogs
            });
        }
        setPendingSwap(null);
    };

    const getCellContent = (teacherId: string, day: string, period: number, isHovered: boolean) => {
        const key = getKey(teacherId, day, period);
        const slot = timetable[key];
        
        const isClassInActiveSchool = (c?: ClassInfo) => {
            if (!c) return true;
            if (activeSchoolId === 'main' || !activeSchoolId) return !c.schoolId || c.schoolId === 'main';
            return c.schoolId === activeSchoolId;
        };

        if (!slot) {
            return (
                 <div 
                    title="وقت فارغ"
                    className={`w-full h-full p-1 rounded-lg border-2 border-dashed transition-all flex items-center justify-center
                        ${isHovered ? 'bg-[#655ac1]/10 border-[#655ac1]/30' : 'border-slate-100 bg-white hover:bg-slate-50'}
                    `}
                 >
                     <span className="text-[10px] text-slate-300 font-bold opacity-0 hover:opacity-100">فراغ</span>
                 </div>
            );
        }

        const subj = subjects.find(s => s.id === slot.subjectId);
        const cls = classes.find(c => c.id === slot.classId);
        const isForeignSlot = cls && !isClassInActiveSchool(cls);

        if (isForeignSlot) {
             return (
                <div className="w-full h-full p-1 rounded-lg text-[10px] flex flex-col items-center justify-center gap-0.5 bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed transition-all" title="محجوز في المدرسة المشتركة الأخرى">
                    <Lock size={14} className="opacity-50 mb-1" />
                    <span className="font-bold truncate w-full text-center">مشغول</span>
                </div>
            );
        }

        if (slot.type === 'waiting') {
            return (
                <div className={`w-full h-full p-1 rounded-lg text-[10px] flex flex-col items-center justify-center gap-0.5 border transition-all cursor-grab active:cursor-grabbing
                    ${isHovered ? 'ring-2 ring-[#4c3d8f] border-transparent bg-[#3d2b8e] text-white' : 'bg-[#2d1f6e] text-white border-[#4c3d8f] hover:bg-[#3d2b8e]'}
                `}>
                    <Eye size={14} className="opacity-70" />
                    <span className="font-bold truncate w-full text-center">انتظار</span>
                </div>
            );
        }

        return (
            <div className={`
                w-full h-full p-1 rounded-lg text-[10px] flex flex-col items-center justify-center gap-0.5 transition-all
                cursor-grab active:cursor-grabbing border
                ${isHovered ? 'ring-2 ring-[#a59bf0] border-transparent bg-[#f4f2ff] text-[#7c6dd6]' : 'bg-[#fcfcff] text-[#7c6dd6] border-[#f4f2ff] hover:border-[#a59bf0]/40'}
            `}>
                <span className="font-extrabold truncate w-full text-center" title={subj?.name}>
                    {settings.subjectAbbreviations?.[subj?.id || ''] || subj?.name || '---'}
                </span>
                <span className="font-bold opacity-80 truncate w-full text-center dir-ltr">{cls?.name || '---'}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header and selector */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative">
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                    <div>
                        <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <Users size={20} className="text-[#655ac1]" />
                            التعديل الفردي المتعدد
                        </h4>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            اختر المعلمين المراد التعديل بينهم جنباً إلى جنب بشكل مباشر.
                        </p>
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsSelecting(!isSelecting)}
                            className="px-5 py-2.5 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 hover:border-[#655ac1]/30 transition-all flex items-center gap-2"
                        >
                            <UserPlus size={18} />
                            إضافة معلمين للواجهة
                        </button>

                        {isSelecting && (
                            <div className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50 animate-in slide-in-from-top-2">
                                <div className="relative mb-2">
                                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input 
                                        type="text" 
                                        placeholder="ابحث عن معلم..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="w-full pl-3 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#655ac1]/20 font-medium"
                                    />
                                </div>
                                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 pr-1">
                                    {filteredTeachers.map(t => (
                                        <button 
                                            key={t.id}
                                            onClick={() => {
                                                setSelectedTeacherIds([...selectedTeacherIds, t.id]);
                                                setIsSelecting(false);
                                                setSearchQuery('');
                                            }}
                                            className="w-full text-right px-3 py-2 text-sm font-bold text-slate-700 hover:bg-[#f0edff] hover:text-[#655ac1] rounded-lg transition-colors flex items-center justify-between group"
                                        >
                                            {t.name}
                                            <Check size={14} className="opacity-0 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                    {filteredTeachers.length === 0 && (
                                        <p className="text-center text-xs text-slate-400 font-medium py-3">لا يوجد معلمين مطابقين</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selected Badges */}
                {selectedTeachers.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                        {selectedTeachers.map(t => (
                            <div key={t.id} className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-[#f0edff] text-[#655ac1] rounded-lg border border-[#e5e1fe]">
                                <span className="text-sm font-bold">{t.name}</span>
                                <button 
                                    onClick={() => setSelectedTeacherIds(selectedTeacherIds.filter(id => id !== t.id))}
                                    className="p-1 hover:bg-white rounded-md transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Timetable comparisons */}
            {selectedTeachers.length > 0 ? (
                <div className="overflow-x-auto pb-4 custom-scrollbar">
                    <div className="flex gap-4 items-start min-w-max">
                        {selectedTeachers.map(teacher => (
                            <div key={teacher.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 w-72 shrink-0 overflow-hidden">
                                {/* Teacher Header */}
                                <div className="p-4 bg-slate-50 border-b border-slate-100 flex flex-col gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white text-[#655ac1] border border-[#e5e1fe] flex items-center justify-center font-black text-lg shrink-0 shadow-sm">
                                            {teacher.name.charAt(0)}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-bold text-slate-700 truncate" title={teacher.name}>{teacher.name}</div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                                        <div className="bg-white border border-slate-200 rounded-lg p-1.5 text-center text-slate-600 shadow-sm">
                                            أساسي: <strong className="text-slate-800">{teacher.quotaLimit}</strong>
                                        </div>
                                        <div className="bg-[#2d1f6e] border border-[#4c3d8f] rounded-lg p-1.5 text-center text-white shadow-sm">
                                            انتظار: <strong className="text-white">{teacher.waitingQuota || 0}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule Column */}
                                <div className="divide-y divide-slate-100">
                                    {DAYS.map(day => (
                                        <div key={day} className="flex flex-col">
                                            <div className="bg-slate-50/80 px-4 py-1.5 text-xs font-black text-slate-600 border-b border-slate-100">
                                                {DAY_NAMES[day]}
                                            </div>
                                            <div className="grid grid-cols-2 p-2 gap-2">
                                                {Array.from({ length: periodCount }).map((_, i) => {
                                                    const p = i + 1;
                                                    const key = getKey(teacher.id, day, p);
                                                    const isHovered = hoverTarget === key;
                                                    
                                                    const slotInfo = timetable[key];
                                                    const cls = slotInfo?.classId ? classes.find(c => c.id === slotInfo.classId) : undefined;
                                                    const isClassInActiveSchool = (c?: ClassInfo) => {
                                                        if (!c) return true;
                                                        if (activeSchoolId === 'main' || !activeSchoolId) return !c.schoolId || c.schoolId === 'main';
                                                        return c.schoolId === activeSchoolId;
                                                    };
                                                    const isForeignSlot = cls && !isClassInActiveSchool(cls);
                                                    
                                                    return (
                                                        <div 
                                                            key={i}
                                                            draggable={!!timetable[key] && !isForeignSlot}
                                                            onDragStart={(e) => { if (!isForeignSlot) handleDragStart(e, teacher.id, day, p); }}
                                                            onDragOver={(e) => { if (!isForeignSlot) handleDragOver(e, key); }}
                                                            onDrop={(e) => { if (!isForeignSlot) handleDrop(e, teacher.id, day, p); }}
                                                            className={`
                                                                h-16 relative flex flex-col items-center justify-center transition-all group/slot
                                                                ${isForeignSlot ? 'opacity-80' : ''}
                                                            `}
                                                        >
                                                            {/* Period Number Label */}
                                                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-white border border-slate-200 text-slate-400 font-bold text-[9px] rounded-full flex items-center justify-center z-10 shadow-sm">
                                                                {p}
                                                            </div>
                                                            {getCellContent(teacher.id, day, p, isHovered)}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
                        <Users size={32} />
                    </div>
                    <h5 className="text-lg font-black text-slate-700 mb-2">استعرض وقارن</h5>
                    <p className="text-sm font-medium text-slate-500 max-w-sm">
                        قم باختيار المعلمين المراد التعديل بينهم لعرض جداولهم متجاورة كأعمدة للتبديل والتعديل اللحظي بسهولة ومرونة.
                    </p>
                </div>
            )}

            <SwapConfirmationModal 
                isOpen={!!pendingSwap}
                onClose={() => setPendingSwap(null)}
                onConfirm={confirmSwap}
                swapResult={pendingSwap}
            />
        </div>
    );
};

export default CustomTeacherView;

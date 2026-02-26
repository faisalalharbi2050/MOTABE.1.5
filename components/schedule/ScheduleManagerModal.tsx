import React, { useState } from 'react';
import {
    X, Save, Trash2, CheckCircle2, Clock, History,
    Pencil, Check, Star, CalendarDays, User2, BookOpenCheck, Plus, Shield
} from 'lucide-react';
import { ScheduleSettingsData, SavedSchedule, TimetableData } from '../../types';

interface ScheduleManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: ScheduleSettingsData;
    onUpdateSettings: (newSettings: ScheduleSettingsData) => void;
    currentTimetable?: TimetableData;
}

const ScheduleManagerModal: React.FC<ScheduleManagerModalProps> = ({
    isOpen,
    onClose,
    settings,
    onUpdateSettings,
    currentTimetable,
}) => {
    const [editingScheduleId, setEditingScheduleId]     = useState<string | null>(null);
    const [editingScheduleName, setEditingScheduleName] = useState('');
    const [confirmDeleteId, setConfirmDeleteId]         = useState<string | null>(null);
    const [showManualSave, setShowManualSave]           = useState(false);
    const [manualSaveName, setManualSaveName]           = useState('');

    const savedSchedules   = settings.savedSchedules  || [];
    const activeScheduleId = settings.activeScheduleId;

    if (!isOpen) return null;

    const dayNames: Record<number, string> = {
        0: 'الأحد', 1: 'الإثنين', 2: 'الثلاثاء',
        3: 'الأربعاء', 4: 'الخميس', 5: 'الجمعة', 6: 'السبت',
    };

    const formatDateTime = (iso: string) => {
        const d    = new Date(iso);
        const day  = dayNames[d.getDay()];
        const date = new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
            year: 'numeric', month: 'long', day: 'numeric',
        }).format(d);
        const time = new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
            hour: '2-digit', minute: '2-digit', hour12: true,
        }).format(d);
        return { day, date, time };
    };

    const handleAdopt = (schedule: SavedSchedule) => {
        onUpdateSettings({
            ...settings,
            timetable:        JSON.parse(JSON.stringify(schedule.timetable)),
            activeScheduleId: schedule.id,
        });
        onClose();
    };

    const handleDelete = (id: string) => {
        const updated     = savedSchedules.filter(s => s.id !== id);
        const newActiveId = id === activeScheduleId
            ? (updated[0]?.id ?? undefined)
            : activeScheduleId;
        onUpdateSettings({
            ...settings,
            savedSchedules:   updated,
            activeScheduleId: newActiveId,
            ...(id === activeScheduleId && updated[0]
                ? { timetable: JSON.parse(JSON.stringify(updated[0].timetable)) }
                : {}),
        });
        setConfirmDeleteId(null);
    };

    const handleRenameSave = () => {
        if (!editingScheduleId || !editingScheduleName.trim()) return;
        const updated = savedSchedules.map(s =>
            s.id === editingScheduleId ? { ...s, name: editingScheduleName.trim() } : s
        );
        onUpdateSettings({ ...settings, savedSchedules: updated });
        setEditingScheduleId(null);
        setEditingScheduleName('');
    };

    const handleManualSave = () => {
        if (!currentTimetable || Object.keys(currentTimetable).length === 0) return;
        if (savedSchedules.length >= 10) return;
        const newId = `schedule-${Date.now()}`;
        const newEntry: SavedSchedule = {
            id:        newId,
            name:      manualSaveName.trim() || `لقطة يدوية ${savedSchedules.length + 1}`,
            createdAt: new Date().toISOString(),
            createdBy: 'المستخدم',
            timetable: JSON.parse(JSON.stringify(currentTimetable)),
        };
        onUpdateSettings({
            ...settings,
            savedSchedules:   [newEntry, ...savedSchedules].slice(0, 10),
            activeScheduleId: newId,
        });
        setManualSaveName('');
        setShowManualSave(false);
    };

    const activeSchedule = savedSchedules.find(s => s.id === activeScheduleId);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div
                className="bg-white w-full flex flex-col overflow-hidden"
                style={{
                    maxWidth: '840px',
                    maxHeight: '90vh',
                    borderRadius: '28px',
                    boxShadow: '0 40px 100px rgba(101,90,193,0.25),0 12px 32px rgba(0,0,0,0.14)',
                    fontFamily: '"Tajawal", sans-serif',
                }}
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 bg-slate-50 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-12 h-12 rounded-2xl flex items-center justify-center"
                            style={{
                                background: 'linear-gradient(135deg,#655ac1,#7c6dd6)',
                                boxShadow: '0 6px 16px rgba(101,90,193,0.38)',
                            }}
                        >
                            <History size={22} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-xl text-slate-800">إدارة الجداول</h3>
                            <p className="text-sm font-bold text-slate-500 mt-0.5">
                                كل جدول يُحفظ تلقائياً عند الإنشاء — اعتمد أو احذف أو عدّل الاسم
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Active banner */}
                {activeSchedule && (
                    <div
                        className="mx-6 mt-5 px-4 py-3 rounded-2xl flex items-center gap-3 bg-slate-50 border border-slate-200"
                    >
                        <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                            style={{ background: 'linear-gradient(135deg,#655ac1,#7c6dd6)' }}
                        >
                            <Star size={14} className="text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#655ac1] font-semibold">الجدول المعتمد حالياً</p>
                            <p className="text-sm font-bold text-slate-800 truncate">{activeSchedule.name}</p>
                        </div>
                        <span
                            className="text-[10px] font-medium px-2.5 py-1 rounded-full text-[#655ac1]"
                            style={{ background: 'rgba(101,90,193,0.1)' }}
                        >
                            {Object.keys(activeSchedule.timetable).length} حصة
                        </span>
                    </div>
                )}

                {/* Manual Save */}
                {currentTimetable && Object.keys(currentTimetable).length > 0 && savedSchedules.length < 10 && (
                    <div className="mx-6 mt-3">
                        {!showManualSave ? (
                            <button
                                onClick={() => setShowManualSave(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-[#655ac1] transition-all hover:scale-[1.02] bg-slate-50 border border-slate-200 hover:bg-slate-100"
                            >
                                <Plus size={14} /> حفظ لقطة يدوية من الجدول الحالي
                            </button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="اسم اللقطة (اختياري)"
                                    value={manualSaveName}
                                    onChange={e => setManualSaveName(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleManualSave();
                                        if (e.key === 'Escape') setShowManualSave(false);
                                    }}
                                    autoFocus
                                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-[#655ac1] bg-white"
                                />
                                <button
                                    onClick={handleManualSave}
                                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white rounded-xl transition-all"
                                    style={{ background: 'linear-gradient(135deg,#655ac1,#7c6dd6)' }}
                                >
                                    <Save size={13} /> حفظ
                                </button>
                                <button
                                    onClick={() => setShowManualSave(false)}
                                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* List */}
                <div className="flex-1 overflow-y-auto px-6 pt-4 pb-6 space-y-3">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1">
                        <div className="flex items-center gap-1.5">
                            <BookOpenCheck size={13} className="text-[#655ac1]" />
                            الجداول المحفوظة ({savedSchedules.length} / 10)
                        </div>
                        <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{
                                    width: `${(savedSchedules.length / 10) * 100}%`,
                                    background: savedSchedules.length >= 10 ? '#ef4444' : 'linear-gradient(90deg,#655ac1,#8779fb)',
                                }}
                            />
                        </div>
                    </div>

                    {savedSchedules.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-4 text-slate-400">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-slate-100">
                                <History size={28} style={{ color: '#a59bf0' }} />
                            </div>
                            <div className="text-center">
                                <p className="font-semibold text-slate-600 mb-1">لا توجد جداول محفوظة بعد</p>
                                <p className="text-xs font-normal">
                                    سيُحفظ الجدول تلقائياً عند إنشائه من زر «بناء الجدول»
                                </p>
                            </div>
                        </div>
                    ) : (
                        savedSchedules.map((schedule, index) => {
                            const isActive   = schedule.id === activeScheduleId;
                            const isLatest   = index === 0;
                            const { day, date, time } = formatDateTime(schedule.createdAt);
                            const isSystem   = schedule.createdBy === 'النظام';
                            const isEditing  = editingScheduleId === schedule.id;
                            const isDeleting = confirmDeleteId === schedule.id;

                            return (
                                <div
                                    key={schedule.id}
                                    className="rounded-2xl overflow-hidden transition-all duration-200"
                                    style={{
                                        border: isActive ? '2px solid #8779fb' : '1.5px solid #e8e6f0',
                                        background: isActive ? 'linear-gradient(135deg,#faf9ff,#f3f0ff)' : 'white',
                                        boxShadow: isActive ? '0 4px 16px rgba(101,90,193,0.14)' : '0 1px 4px rgba(0,0,0,0.05)',
                                    }}
                                >
                                    {isActive && (
                                        <div
                                            className="h-1 w-full"
                                            style={{ background: 'linear-gradient(90deg,#655ac1,#8779fb)' }}
                                        />
                                    )}

                                    <div className="p-4">
                                        {/* Row 1 */}
                                        <div className="flex items-start gap-3 mb-3">
                                            <div
                                                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                                                style={{
                                                    background: isActive ? 'linear-gradient(135deg,#655ac1,#7c6dd6)' : '#f1f0f8',
                                                    color: isActive ? 'white' : '#94a0b8',
                                                }}
                                            >
                                                {savedSchedules.length - index}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                {isEditing ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={editingScheduleName}
                                                            onChange={e => setEditingScheduleName(e.target.value)}
                                                            autoFocus
                                                            onKeyDown={e => {
                                                                if (e.key === 'Enter') handleRenameSave();
                                                                if (e.key === 'Escape') setEditingScheduleId(null);
                                                            }}
                                                            className="flex-1 px-3 py-1.5 bg-white border border-[#655ac1] rounded-lg text-sm outline-none"
                                                        />
                                                        <button
                                                            onClick={handleRenameSave}
                                                            className="p-1.5 rounded-lg text-white transition-colors"
                                                            style={{ background: '#655ac1' }}
                                                        >
                                                            <Check size={13} />
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingScheduleId(null)}
                                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                                        >
                                                            <X size={13} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="font-semibold text-slate-800 text-sm leading-tight">
                                                            {schedule.name}
                                                        </span>
                                                        {isActive && (
                                                            <span
                                                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#655ac1]"
                                                                style={{ background: 'rgba(101,90,193,0.12)' }}
                                                            >
                                                                <Star size={9} /> معتمد
                                                            </span>
                                                        )}
                                                        {isLatest && !isActive && (
                                                            <span
                                                                className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-amber-600"
                                                                style={{ background: '#fef9ec', border: '1px solid #fde68a' }}
                                                            >
                                                                الأحدث
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Row 2 */}
                                        <div className="grid grid-cols-3 gap-2 mb-3">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <CalendarDays size={11} style={{ color: '#655ac1', flexShrink: 0 }} />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-normal text-slate-400">{day}</p>
                                                    <p className="text-[10px] font-semibold text-slate-700 leading-tight truncate">{date}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                                <Clock size={11} style={{ color: '#655ac1', flexShrink: 0 }} />
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-normal text-slate-400">الوقت</p>
                                                    <p className="text-[10px] font-semibold text-slate-700 leading-tight">{time}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                                                {isSystem
                                                    ? <Shield size={11} style={{ color: '#655ac1', flexShrink: 0 }} />
                                                    : <User2  size={11} style={{ color: '#655ac1', flexShrink: 0 }} />
                                                }
                                                <div className="min-w-0">
                                                    <p className="text-[9px] font-normal text-slate-400">أنشئ بواسطة</p>
                                                    <p className="text-[10px] font-semibold text-slate-700 leading-tight">{schedule.createdBy}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Row 3 */}
                                        <div className="flex items-center justify-between gap-2">
                                            <span
                                                className="text-[10px] font-normal text-slate-400 px-2 py-1 rounded-lg"
                                                style={{ background: '#f1f5f9' }}
                                            >
                                                {Object.keys(schedule.timetable).length} حصة مُسندة
                                            </span>
                                            {isDeleting ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-medium text-rose-500">تأكيد الحذف؟</span>
                                                    <button
                                                        onClick={() => handleDelete(schedule.id)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-xl transition-colors"
                                                    >
                                                        نعم
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(null)}
                                                        className="px-3 py-1.5 text-xs font-semibold text-slate-600 rounded-xl transition-colors"
                                                        style={{ background: '#f1f5f9' }}
                                                    >
                                                        إلغاء
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    {!isActive && (
                                                        <button
                                                            onClick={() => handleAdopt(schedule)}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-xl transition-all hover:scale-[1.02]"
                                                            style={{
                                                                background: 'linear-gradient(135deg,#655ac1,#7c6dd6)',
                                                                boxShadow: '0 3px 10px rgba(101,90,193,0.3)',
                                                            }}
                                                        >
                                                            <CheckCircle2 size={12} /> اعتماد
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setEditingScheduleId(schedule.id);
                                                            setEditingScheduleName(schedule.name);
                                                        }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 rounded-xl transition-all hover:text-[#655ac1]"
                                                        style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}
                                                    >
                                                        <Pencil size={12} /> تعديل الاسم
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDeleteId(schedule.id)}
                                                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-100">
                    <span className="text-xs text-slate-400 font-normal">
                        يُحفظ الجدول تلقائياً عند كل إنشاء جديد
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-2xl font-medium text-sm text-slate-600 transition-all hover:scale-[1.02]"
                        style={{ background: '#f1f5f9', border: '1.5px solid #e2e8f0' }}
                    >
                        إغلاق
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagerModal;
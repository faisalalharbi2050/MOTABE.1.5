import React, { useState } from 'react';
import { X, Save, Copy, Trash2, CheckCircle2, RotateCcw, AlertCircle, Clock, History, Pencil, Check } from 'lucide-react';
import { ScheduleSettingsData, SavedSchedule, TimetableData } from '../../types';

interface ScheduleManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: ScheduleSettingsData;
    onUpdateSettings: (newSettings: ScheduleSettingsData) => void;
    currentTimetable?: TimetableData; // Pass current if we want to save it
}

const ScheduleManagerModal: React.FC<ScheduleManagerModalProps> = ({ 
    isOpen, 
    onClose, 
    settings, 
    onUpdateSettings,
    currentTimetable
}) => {
    const [newScheduleName, setNewScheduleName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteCurrentConfirm, setShowDeleteCurrentConfirm] = useState(false);
    const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
    const [editingScheduleName, setEditingScheduleName] = useState('');
    
    // Safely get the saved schedules
    const savedSchedules = settings.savedSchedules || [];

    if (!isOpen) return null;

    const handleSaveCurrent = () => {
        if (!currentTimetable || Object.keys(currentTimetable).length === 0) {
            alert('لا يوجد جدول حالي لحفظه.');
            return;
        }
        if (!newScheduleName.trim()) {
            alert('يرجى إدخال اسم للجدول.');
            return;
        }

        if (savedSchedules.length >= 10) {
            alert('لقد وصلت للحد الأقصى (10 جداول). يرجى حذف بعض الجداول القديمة أولاً.');
            return;
        }

        const newSchedule: SavedSchedule = {
            id: `schedule-${Date.now()}`,
            name: newScheduleName.trim(),
            createdAt: new Date().toISOString(),
            timetable: JSON.parse(JSON.stringify(currentTimetable)) // Deep copy
        };

        const updatedSchedules = [newSchedule, ...savedSchedules];
        
        onUpdateSettings({
            ...settings,
            savedSchedules: updatedSchedules
        });
        
        setNewScheduleName('');
        setIsSaving(false);
    };

    const handleRestore = (schedule: SavedSchedule) => {
        if (window.confirm(`هل أنت متأكد من استعادة "${schedule.name}"؟ سيتم استبدال الجدول الحالي (إذا لم يكن محفوظاً سيتم فقدانه).`)) {
            onUpdateSettings({
                ...settings,
                timetable: JSON.parse(JSON.stringify(schedule.timetable))
            });
            onClose();
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الجدول من السجل؟')) {
            const updatedSchedules = savedSchedules.filter(s => s.id !== id);
            onUpdateSettings({
                ...settings,
                savedSchedules: updatedSchedules
            });
        }
    };

    const handleRenameStart = (schedule: SavedSchedule) => {
        setEditingScheduleId(schedule.id);
        setEditingScheduleName(schedule.name);
    };

    const handleRenameSave = () => {
        if (!editingScheduleId || !editingScheduleName.trim()) return;
        const updatedSchedules = savedSchedules.map(s =>
            s.id === editingScheduleId ? { ...s, name: editingScheduleName.trim() } : s
        );
        onUpdateSettings({ ...settings, savedSchedules: updatedSchedules });
        setEditingScheduleId(null);
        setEditingScheduleName('');
    };

    const handleDeleteCurrentTimetable = () => {
        onUpdateSettings({ ...settings, timetable: {}, auditLogs: [] });
        setShowDeleteCurrentConfirm(false);
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col relative animate-in zoom-in-95 overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#e5e1fe] text-[#655ac1] flex items-center justify-center shadow-inner">
                            <Save size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-xl">إدارة الجداول المحفوظة</h3>
                            <p className="text-sm font-bold text-slate-500">
                                حفظ واسترجاع نسخ متعددة من الجداول (الحد الأقصى: 10)
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 bg-slate-50/50">
                    {/* Left/Top Panel: Save New */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                            <h4 className="font-black text-slate-700 mb-4 flex items-center gap-2">
                                <Copy size={18} className="text-[#655ac1]" />
                                حفظ الجدول الحالي
                            </h4>
                            
                            {(!currentTimetable || Object.keys(currentTimetable).length === 0) ? (
                                <div className="p-4 bg-orange-50 text-orange-600 rounded-xl text-sm font-bold flex gap-2 items-start">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <p>لا يوجد جدول مفعّل حالياً لحفظه. قم بإنشاء جدول أولاً.</p>
                                </div>
                            ) : savedSchedules.length >= 10 ? (
                                <div className="p-4 bg-rose-50 text-rose-600 rounded-xl text-sm font-bold flex gap-2 items-start">
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <p>لقد وصلت للحد الأقصى للمسودات (10). يرجى حذف جدول قديم لتتمكن من حفظ جدول جديد.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-600 mb-2">اسم النسخة (اختياري/تلقائي)</label>
                                        <input 
                                            type="text" 
                                            placeholder="مثال: جدول مبدئي، جدول بعد التعديل..."
                                            value={newScheduleName}
                                            onChange={(e) => setNewScheduleName(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#655ac1]/20 focus:border-[#655ac1] transition-all font-medium text-slate-700"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleSaveCurrent}
                                        disabled={!newScheduleName.trim()}
                                        className="w-full bg-[#655ac1] hover:bg-[#5448a8] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#655ac1]/20"
                                    >
                                        <Save size={18} />
                                        حفظ كنسخة جديدة
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Storage Indicator */}
                        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                            <div className="flex justify-between items-center text-sm font-bold mb-2">
                                <span className="text-slate-600">المساحة المستخدمة</span>
                                <span className={savedSchedules.length >= 10 ? 'text-rose-500' : 'text-[#655ac1]'}>
                                    {savedSchedules.length} / 10
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full transition-all ${savedSchedules.length >= 10 ? 'bg-rose-500' : 'bg-[#655ac1]'}`}
                                    style={{ width: `${(savedSchedules.length / 10) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Delete Current Timetable */}
                        <div className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm">
                            <h4 className="font-black text-slate-700 mb-3 flex items-center gap-2">
                                <Trash2 size={16} className="text-rose-500" />
                                حذف الجدول الحالي
                            </h4>
                            {!showDeleteCurrentConfirm ? (
                                <button
                                    onClick={() => setShowDeleteCurrentConfirm(true)}
                                    disabled={!currentTimetable || Object.keys(currentTimetable).length === 0}
                                    className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl font-bold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} /> حذف الجدول الحالي
                                </button>
                            ) : (
                                <div className="space-y-2 animate-in zoom-in-95 duration-150">
                                    <p className="text-xs font-bold text-rose-600 text-center">هل أنت متأكد؟ لا يمكن التراجع.</p>
                                    <div className="flex gap-2">
                                        <button onClick={handleDeleteCurrentTimetable} className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold text-xs transition-all">نعم، احذف</button>
                                        <button onClick={() => setShowDeleteCurrentConfirm(false)} className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-xs transition-all">إلغاء</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right/Bottom Panel: List of Saved Schedules */}
                    <div className="w-full md:w-2/3">
                        <h4 className="font-black text-slate-700 mb-4 flex items-center gap-2">
                            <History size={18} className="text-slate-500" />
                            السجل والجداول المحفوظة ({savedSchedules.length})
                        </h4>
                        
                        {savedSchedules.length === 0 ? (
                            <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400 gap-4">
                                <Save size={48} strokeWidth={1} />
                                <p className="font-bold text-lg">لم تقم بحفظ أي جدول للآن</p>
                                <p className="text-sm">يمكنك حفظ الجدول الحالي للرجوع إليه لاحقاً وتجربة تعديلات أخرى بكل أريحية.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 pr-2" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                                {savedSchedules.map((schedule) => (
                                    <div key={schedule.id} className="bg-white border border-slate-200 p-4 rounded-2xl hover:border-[#655ac1]/50 hover:shadow-md transition-all group flex flex-col gap-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                {editingScheduleId === schedule.id ? (
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="text"
                                                            value={editingScheduleName}
                                                            onChange={e => setEditingScheduleName(e.target.value)}
                                                            autoFocus
                                                            onKeyDown={e => { if (e.key === 'Enter') handleRenameSave(); if (e.key === 'Escape') { setEditingScheduleId(null); } }}
                                                            className="flex-1 px-3 py-1.5 bg-slate-50 border border-[#655ac1] rounded-lg text-sm font-bold outline-none"
                                                        />
                                                        <button onClick={handleRenameSave} className="p-1.5 bg-[#655ac1] text-white rounded-lg hover:bg-[#5448a8] transition-colors"><Check size={14}/></button>
                                                        <button onClick={() => setEditingScheduleId(null)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"><X size={14}/></button>
                                                    </div>
                                                ) : (
                                                    <h5 className="font-black text-slate-800 text-base truncate">{schedule.name}</h5>
                                                )}
                                                <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mt-1">
                                                    <Clock size={12} />
                                                    {formatDate(schedule.createdAt)}
                                                </p>
                                                <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 px-2 py-1 rounded inline-block">
                                                    يحتوي على {Object.keys(schedule.timetable).length} حصة مسندة
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => handleRestore(schedule)}
                                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#655ac1] text-white hover:bg-[#5448a8] rounded-xl font-bold transition-colors text-xs shadow-sm"
                                            >
                                                <CheckCircle2 size={14} />
                                                اعتماد
                                            </button>
                                            <button 
                                                onClick={() => handleRenameStart(schedule)}
                                                className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 text-slate-600 hover:text-[#655ac1] hover:border-[#655ac1] rounded-xl font-bold transition-colors text-xs"
                                                title="تعديل الاسم"
                                            >
                                                <Pencil size={14} /> تعديل
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(schedule.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                                title="حذف هذه النسخة"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScheduleManagerModal;

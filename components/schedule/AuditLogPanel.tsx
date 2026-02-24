import React from 'react';
import { History, FileText, ArrowRightLeft, RotateCcw, X, User } from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AuditLogPanelProps {
    logs: AuditLogEntry[];
    isOpen: boolean;
    onClose: () => void;
}

const AuditLogPanel: React.FC<AuditLogPanelProps> = ({ logs, isOpen, onClose }) => {
    if (!isOpen) return null;

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ar-SA', {
            hour: '2-digit', minute: '2-digit', second: '2-digit'
        }).format(date);
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('ar-SA', {
            year: 'numeric', month: 'short', day: 'numeric'
        }).format(date);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col relative animate-in zoom-in-95 overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                            <History size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-800 text-xl">سجل تعديلات الجدول</h3>
                            <p className="text-sm font-bold text-slate-500">سجل التعديلات اليدوية للجدول</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 custom-scrollbar">
                {(!logs || logs.length === 0) ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-4 opacity-60 py-20">
                        <FileText size={64} strokeWidth={1} />
                        <p className="font-bold text-lg">لا توجد تعديلات يدوية مسجلة في هذا الجدول حتى الآن</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {logs.slice().reverse().map((log) => (
                            <div key={log.id} className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group relative flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2.5 rounded-xl shrink-0
                                            ${log.actionType === 'chain_swap' ? 'bg-indigo-50 text-indigo-500' : 'bg-emerald-50 text-emerald-500'}
                                        `}>
                                            {log.actionType === 'chain_swap' ? <RotateCcw size={20} /> : <ArrowRightLeft size={20} />}
                                        </div>
                                        <div>
                                            <span className={`text-sm font-black px-2.5 py-1 rounded-lg block w-max mb-1
                                                ${log.actionType === 'chain_swap' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}
                                            `}>
                                                {log.actionType === 'chain_swap' ? 'تبديل مركب (متعدد)' : 'تبديل بسيط (مباشر)'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-black text-slate-500 bg-slate-100 px-2 py-1 rounded-md mb-1 inline-block">
                                            {formatTime(log.timestamp)}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 block">
                                            {formatDate(log.timestamp)}
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2 flex-1 relative bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <div className="text-sm font-bold text-slate-700 leading-relaxed">
                                        {log.description.split(' | ').map((line, i) => (
                                            <div key={i} className="mb-1.5 last:mb-0 text-slate-600 flex items-start gap-2">
                                                <span className="text-blue-400 mt-1 shrink-0">•</span>
                                                <span>{line}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="text-xs text-slate-400 font-bold flex items-center justify-end gap-1.5 mt-4 pt-4 border-t border-slate-100">
                                    <User size={14} className="text-slate-300" />
                                    <span>بواسطة:</span>
                                    <span className="text-slate-600">{log.user}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default AuditLogPanel;

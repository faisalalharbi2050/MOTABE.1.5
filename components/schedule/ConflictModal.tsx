import React from 'react';
import { X, AlertTriangle, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';
import { ValidationWarning } from '../../utils/scheduleConstraints';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  warnings: ValidationWarning[];
  onContinue: (bypass: boolean) => void;
  isGenerating: boolean;
  onNavigateTo?: (type: 'subject' | 'teacher' | 'general', id?: string) => void;
}

const ConflictModal: React.FC<ConflictModalProps> = ({ 
  isOpen, 
  onClose, 
  warnings, 
  onContinue,
  isGenerating,
  onNavigateTo
}) => {
  if (!isOpen) return null;

  const errors = warnings.filter(w => w.level === 'error');
  const warningList = warnings.filter(w => w.level === 'warning');
  const infos = warnings.filter(w => w.level === 'info');

  const hasErrors = errors.length > 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className={`p-6 border-b flex justify-between items-center ${hasErrors ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
           <div className="flex items-center gap-3">
               <div className={`p-2 rounded-full ${hasErrors ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                   {hasErrors ? <AlertTriangle size={24} strokeWidth={2.5} /> : <CheckCircle2 size={24} strokeWidth={2.5} />}
               </div>
               <div>
                   <h3 className={`font-black text-xl ${hasErrors ? 'text-rose-700' : 'text-slate-800'}`}>
                       {hasErrors ? 'هناك تعارضات تمنع أو تصعّب بناء الجدول' : 'جاهز لبناء الجدول'}
                   </h3>
                   <p className="text-sm font-bold opacity-70">
                       {hasErrors 
                         ? `تم اكتشاف ${errors.length} خطأ و ${warningList.length} تنبيه` 
                         : 'جميع القيود تبدو منطقية، ولكن قد توجد بعض الملاحظات'}
                   </p>
               </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-slate-400 transition-colors">
               <X size={20} />
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            
            {/* Errors Section */}
            {errors.length > 0 && (
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-black text-rose-600 text-sm">
                        <AlertCircle size={16} /> أخطاء يجب معالجتها ({errors.length})
                    </h4>
                    {errors.map((err, idx) => (
                        <div key={idx} className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3">
                            <div className="mt-0.5 text-rose-500"><X size={16} /></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-rose-800">{err.message}</p>
                                {err.suggestion && (
                                    <p className="text-xs font-medium text-rose-600 mt-1 flex items-center gap-1">
                                        <Info size={12} /> اقتراح: {err.suggestion}
                                    </p>
                                )}
                            </div>
                            {onNavigateTo && err.type && (
                                <button 
                                    onClick={() => onNavigateTo(err.type, err.relatedId)}
                                    className="p-1.5 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors flex shrink-0 items-center justify-center gap-1"
                                    title="الذهاب لصفحة التعديل"
                                >
                                    <span className="text-xs font-bold">تعديل</span>
                                    <ExternalLink size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Warnings Section */}
            {warningList.length > 0 && (
                <div className="space-y-3">
                    <h4 className="flex items-center gap-2 font-black text-amber-600 text-sm">
                        <AlertTriangle size={16} /> تنبيهات قد تؤثر على الجودة ({warningList.length})
                    </h4>
                    {warningList.map((warn, idx) => (
                        <div key={idx} className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                            <div className="mt-0.5 text-amber-500"><AlertTriangle size={16} /></div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-amber-800">{warn.message}</p>
                                {warn.suggestion && (
                                    <p className="text-xs font-medium text-amber-600 mt-1">
                                        اقتراح: {warn.suggestion}
                                    </p>
                                )}
                            </div>
                            {onNavigateTo && warn.type && (
                                <button 
                                    onClick={() => onNavigateTo(warn.type, warn.relatedId)}
                                    className="p-1.5 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors flex shrink-0 items-center justify-center gap-1"
                                    title="الذهاب لصفحة التعديل"
                                >
                                    <span className="text-xs font-bold">تعديل</span>
                                    <ExternalLink size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Info Section - Only if NO errors/warnings, or purely info */}
            {warnings.length === 0 && (
                <div className="text-center py-10">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} className="text-emerald-500" />
                    </div>
                    <p className="font-bold text-slate-600">البيانات تبدو سليمة ومنطقية.</p>
                    <p className="text-sm text-slate-400 mt-2">يمكنك البدء بعملية التوليد الآلي الآن.</p>
                </div>
            )}

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 flex-wrap">
            <button 
                onClick={() => onContinue(hasErrors)}
                disabled={isGenerating}
                className={`flex-1 py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                    ${hasErrors 
                        ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200' 
                        : 'bg-gradient-to-l from-[#655ac1] to-[#7f75d0] hover:shadow-[#655ac1]/30 hover:-translate-y-0.5'}
                    ${isGenerating ? 'opacity-70 cursor-not-allowed transform-none' : ''}
                `}
            >
                {isGenerating ? (
                    'جاري البدء...'
                ) : (
                    hasErrors ? 'تجاوز الأخطاء التلقائي والمحاولة' : 'بدء بناء الجدول ذكي'
                )}
            </button>
            <button 
                onClick={onClose}
                disabled={isGenerating}
                className="px-6 py-3.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
            >
                إلغاء ومراجعة يدوية
            </button>
        </div>

      </div>
    </div>
  );
};

export default ConflictModal;

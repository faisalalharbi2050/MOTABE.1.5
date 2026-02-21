import React from 'react';
import { X, ArrowRightLeft, Info, CheckCircle2, RotateCcw } from 'lucide-react';
import { SwapResult } from '../../utils/scheduleInteractive';

interface SwapConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    swapResult: SwapResult | null;
}

const SwapConfirmationModal: React.FC<SwapConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    swapResult
}) => {
    if (!isOpen || !swapResult) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                {/* Header */}
                <div className={`p-6 border-b flex items-center justify-between
                    ${swapResult.isChain ? 'bg-indigo-50 border-indigo-100' : 'bg-[#e5e1fe] border-[#655ac1]/20'}
                `}>
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
                            ${swapResult.isChain ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-[#655ac1] shadow-sm'}
                        `}>
                            {swapResult.isChain ? <RotateCcw size={20} /> : <ArrowRightLeft size={20} />}
                        </div>
                        <div>
                            <h3 className={`font-black text-lg ${swapResult.isChain ? 'text-indigo-900' : 'text-[#655ac1]'}`}>
                                {swapResult.isChain ? 'تأكيد التعديل المتعدد (مركب)' : 'تأكيد التعديل البسيط'}
                            </h3>
                            <p className={`text-sm font-medium ${swapResult.isChain ? 'text-indigo-600' : 'text-[#655ac1]/80'}`}>
                                يرجى مراجعة تفاصيل النقل قبل الاعتماد
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    {swapResult.isChain && (
                        <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100 text-amber-800">
                            <Info size={20} className="shrink-0 mt-0.5" />
                            <p className="text-sm leading-relaxed font-bold">
                                النقل المباشر غير ممكن لوجود تعارض، لذا اقترح النظام هذا التبديل المتعدد الأطراف لحل المشكلة.
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <h4 className="font-bold text-slate-700">تفاصيل الحركات:</h4>
                        <div className="space-y-2">
                            {swapResult.chainSteps?.map((step, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 font-medium font-mono">
                                    <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-400 shrink-0">
                                        {idx + 1}
                                    </div>
                                    <span className="flex-1">{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3 rounded-b-2xl">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200/50 rounded-xl transition-colors"
                    >
                        إلغاء الأمر
                    </button>
                    <button 
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-[#655ac1] text-white font-bold rounded-xl hover:bg-[#5a4eb3] transition-all shadow-md shadow-[#655ac1]/20 flex items-center gap-2 active:scale-95"
                    >
                        <CheckCircle2 size={18} />
                        تأكيد واعتماد
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwapConfirmationModal;

import React, { useState } from 'react';
import { X, Shuffle, CheckCircle2, UserCog, Settings2 } from 'lucide-react';
import { SubstitutionConfig } from '../../types';

interface WaitingModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: SubstitutionConfig;
    onSave: (config: SubstitutionConfig) => void;
    onDistribute: (config: SubstitutionConfig) => void;
}

const WaitingModal: React.FC<WaitingModalProps> = ({ 
    isOpen, onClose, config, onSave, onDistribute 
}) => {
    if (!isOpen) return null;

    const [localConfig, setLocalConfig] = useState<SubstitutionConfig>({
        method: config.method || 'auto',
        maxTotalQuota: config.maxTotalQuota || 24,
        maxDailyTotal: config.maxDailyTotal || 5,
        fixedPerPeriod: config.fixedPerPeriod || 3
    });

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
                
                {/* Header */}
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-black text-xl text-slate-800 flex items-center gap-2">
                        <Shuffle size={24} className="text-orange-500" />
                        توزيع حصص الانتظار
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    
                    {/* Method Selection */}
                    <div>
                        <label className="block text-sm font-bold text-slate-500 mb-3">طريقة التوزيع</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => setLocalConfig({...localConfig, method: 'auto'})}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${localConfig.method === 'auto' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-slate-100 text-slate-500 hover:border-orange-200'}`}
                            >
                                <Settings2 className="w-6 h-6 mx-auto mb-2 opacity-80" />
                                تلقائي (ملء الفراغات)
                                <span className="block text-[10px] opacity-60 font-normal mt-1">تعبئة نصاب المعلمين بالكامل</span>
                            </button>
                            <button 
                                onClick={() => setLocalConfig({...localConfig, method: 'fixed'})}
                                className={`p-4 rounded-xl border-2 text-center transition-all ${localConfig.method === 'fixed' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-slate-100 text-slate-500 hover:border-orange-200'}`}
                            >
                                <UserCog className="w-6 h-6 mx-auto mb-2 opacity-80" />
                                محدد (عدد ثابت)
                                <span className="block text-[10px] opacity-60 font-normal mt-1">تحديد عدد منتظرين لكل حصة</span>
                            </button>
                        </div>
                    </div>

                    {/* Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">الحد الأقصى للنصاب</label>
                            <input 
                                type="number" 
                                value={localConfig.maxTotalQuota}
                                onChange={e => setLocalConfig({...localConfig, maxTotalQuota: Number(e.target.value)})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">الحد الأقصى اليومي</label>
                            <input 
                                type="number" 
                                value={localConfig.maxDailyTotal}
                                onChange={e => setLocalConfig({...localConfig, maxDailyTotal: Number(e.target.value)})}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-center outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all"
                            />
                        </div>
                    </div>

                    {/* Fixed Count Input (Only if fixed) */}
                    {localConfig.method === 'fixed' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs font-bold text-slate-500 mb-1.5">عدد المنتظرين للحصة الواحدة</label>
                            <input 
                                type="number" 
                                value={localConfig.fixedPerPeriod}
                                onChange={e => setLocalConfig({...localConfig, fixedPerPeriod: Number(e.target.value)})}
                                className="w-full p-3 bg-white border-2 border-orange-200 rounded-xl font-black text-center text-orange-600 outline-none focus:border-orange-500 transition-all"
                            />
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <button 
                        onClick={() => onDistribute(localConfig)}
                        className="flex-1 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Shuffle size={18} /> توزيع الآن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WaitingModal;

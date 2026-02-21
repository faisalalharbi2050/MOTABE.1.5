import React, { useMemo } from 'react';
import { Teacher, SubstitutionConfig } from '../../types';
import { Clock, Zap, ArrowLeftRight, Check, AlertTriangle, Info } from 'lucide-react';
import { calculateSubstitutionBalance, ValidationWarning } from '../../utils/scheduleConstraints';

interface Props {
  teachers: Teacher[];
  config: SubstitutionConfig;
  weekDays: number;
  periodsPerDay: number;
  warnings: ValidationWarning[];
  onChange: (c: SubstitutionConfig) => void;
}

export default function SubstitutionTab({ teachers, config, weekDays, periodsPerDay, warnings, onChange }: Props) {
  const totalWeeklyPeriods = weekDays * periodsPerDay;

  const balance = useMemo(() =>
    calculateSubstitutionBalance(teachers, config.maxTotalQuota, totalWeeklyPeriods, config.fixedPerPeriod || 0),
    [teachers, config.maxTotalQuota, totalWeeklyPeriods, config.fixedPerPeriod]
  );

  const methods = [
    { id: 'auto' as const, label: 'التوزيع التلقائي', desc: 'ملء فراغات المعلمين تلقائياً بنصاب الانتظار المحدد', icon: Zap, gradient: 'from-emerald-500 to-teal-600' },
    { id: 'fixed' as const, label: 'التوزيع المحدد', desc: 'عدد ثابت من المنتظرين لكل حصة', icon: ArrowLeftRight, gradient: 'from-blue-500 to-indigo-600' },
    { id: 'manual' as const, label: 'التوزيع اليدوي', desc: 'إنشاء حصص الانتظار بشكل يدوي لكل معلم', icon: Check, gradient: 'from-[#655ac1] to-[#8779fb]' },
  ];

  return (
    <div className="space-y-8">
      {/* ─── Info Note ─── */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-br from-[#655ac1]/10 to-[#8779fb]/15 rounded-[2rem] blur-xl" />
        <div className="relative bg-gradient-to-l from-[#e5e1fe]/60 to-white rounded-[1.75rem] border border-[#8779fb]/20 p-5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#655ac1] to-[#8779fb] flex items-center justify-center shrink-0 shadow-lg shadow-[#655ac1]/20">
            <Info size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-700">هذه الإعدادات تُجهّز لعملية إنشاء جدول الانتظار</p>
            <p className="text-xs text-slate-500 mt-1">
              التوزيع الفعلي يتم بالضغط على زر <span className="font-black text-[#655ac1]">"إنشاء الانتظار"</span> بعد قفل جدول الحصص.
              يُرمز للانتظار بـ <span className="font-black bg-[#e5e1fe] text-[#655ac1] px-1.5 py-0.5 rounded mx-0.5">م</span> بلون مميز.
            </p>
          </div>
        </div>
      </div>

      {/* ─── Global Config ─── */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-br from-[#655ac1]/10 to-[#8779fb]/10 rounded-[2rem] blur-xl" />
        <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.75rem] border border-[#8779fb]/20 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#655ac1] to-[#8779fb] flex items-center justify-center shadow-lg shadow-[#655ac1]/20">
              <Clock size={18} className="text-white" />
            </div>
            <h3 className="font-black text-slate-800">إعدادات عامة</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wide">الحد الأقصى للنصاب (أساسي + انتظار)</label>
              <div className="relative">
                <input type="number" min={1} max={40} value={config.maxTotalQuota}
                  onChange={e => onChange({ ...config, maxTotalQuota: Number(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#8779fb]/30 focus:border-[#655ac1] outline-none transition-all" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">حصة/أسبوع</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wide">الحد الأقصى اليومي (أساسي + انتظار)</label>
              <div className="relative">
                <input type="number" min={1} max={10} value={config.maxDailyTotal}
                  onChange={e => onChange({ ...config, maxDailyTotal: Number(e.target.value) })}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-[#8779fb]/30 focus:border-[#655ac1] outline-none transition-all" />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">حصة/يوم</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Method Selection ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {methods.map(m => (
          <button key={m.id} onClick={() => onChange({ ...config, method: m.id })}
            className={`relative p-6 rounded-2xl border-2 text-right transition-all duration-300 group overflow-hidden ${
              config.method === m.id
                ? 'border-[#655ac1] shadow-2xl shadow-[#655ac1]/10 bg-white scale-[1.02]'
                : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-lg'
            }`}>
            {config.method === m.id && (
              <div className="absolute top-3 left-3 w-6 h-6 bg-[#655ac1] rounded-full flex items-center justify-center shadow-md">
                <Check size={14} className="text-white" />
              </div>
            )}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shadow-lg mb-3`}>
              <m.icon size={22} className="text-white" />
            </div>
            <h4 className="font-black text-slate-800 text-base mb-1">{m.label}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
          </button>
        ))}
      </div>

      {/* ─── Method Details ─── */}
      {config.method === 'auto' && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-[2rem] blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.75rem] border border-emerald-100/60 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="text-emerald-500" size={20} />
              <span className="font-black text-slate-800">كيف يعمل التوزيع التلقائي؟</span>
            </div>
            <div className="space-y-2">
              {[
                `ملء فراغات المعلمين في جداولهم تلقائياً بنصاب الانتظار المحدد لهم`,
                `الحد الأقصى اليومي ${config.maxDailyTotal} حصص (أساسي + انتظار)`,
                'التوزيع العادل بين الحصص الأولى والوسطى والأخيرة',
                'عدم التعارض مع الحصص المنشأة والاجتماعات التخصصية',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-emerald-50/60 rounded-xl">
                  <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {config.method === 'fixed' && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-[2rem] blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.75rem] border border-blue-100/60 p-6 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700">عدد المنتظرين لكل حصة</label>
              <input type="number" min={1} max={20} value={config.fixedPerPeriod || ''}
                onChange={e => onChange({ ...config, fixedPerPeriod: Number(e.target.value) })}
                placeholder="مثال: 5"
                className="w-64 bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none transition-all" />
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2 mb-3">
                <ArrowLeftRight className="text-blue-500" size={18} />
                <span className="font-black text-slate-800 text-sm">كيف يعمل التوزيع المحدد؟</span>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  `تغطية كل حصة بعدد ${config.fixedPerPeriod || 'X'} معلمين بشكل ثابت`,
                  'اختيار المعلمين الذين لديهم فراغ في الحصة المحددة',
                  'توزيع النصاب بشكل عادل بناءً على الفراغات المتاحة',
                  'إعطاء تنبيه فوري في حال وجود عجز في عدد المعلمين',
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                    <span className="text-sm text-slate-600 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {config.fixedPerPeriod && config.fixedPerPeriod > 0 && (
              <>
                <div className="border-t border-slate-200 my-3" />
                <div className={`rounded-2xl p-5 border-2 ${balance.deficit > 0 ? 'bg-red-50 border-red-200 shadow-sm' : 'bg-emerald-50 border-emerald-200 shadow-sm'}`}>
                  <div className="flex items-center gap-2 mb-4">
                    {balance.deficit > 0 ? <AlertTriangle className="text-red-500" size={20} /> : <Check className="text-emerald-500" size={20} />}
                    <span className="font-black text-base">{balance.deficit > 0 ? 'يوجد عجز' : 'التوزيع متوازن ✓'}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'المطلوب/حصة', value: balance.required, color: 'text-blue-600', bg: 'bg-white border border-blue-300' },
                      { label: 'المتاح/حصة', value: balance.available, color: 'text-emerald-600', bg: 'bg-white border border-emerald-300' },
                      { label: 'العجز', value: balance.deficit, color: balance.deficit > 0 ? 'text-red-600' : 'text-slate-400', bg: balance.deficit > 0 ? 'bg-white border border-red-300' : 'bg-slate-50' },
                    ].map(item => (
                      <div key={item.label} className={`${item.bg} rounded-xl p-4 text-center border border-white/60`}>
                        <div className={`text-2xl font-black ${item.color}`}>{item.value}</div>
                        <div className="text-[10px] text-slate-500 font-bold mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  {balance.deficit > 0 && (
                    <p className="text-sm text-white mt-4 font-bold bg-red-500 rounded-xl p-3">
                      💡 الرقم الأقرب المتاح: <span className="font-black text-lg">{balance.suggestedMax}</span> منتظرين/حصة
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {config.method === 'manual' && (
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-br from-[#655ac1]/10 to-[#8779fb]/10 rounded-[2rem] blur-xl" />
          <div className="relative bg-white/80 backdrop-blur-sm rounded-[1.75rem] border border-[#8779fb]/20 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Check className="text-[#655ac1]" size={20} />
              <span className="font-black text-slate-800">كيف يعمل التوزيع اليدوي؟</span>
            </div>
            <div className="space-y-2">
              {[
                'إمكانية إضافة حصص الانتظار يدوياً في جداول المعلمين',
                'توزيع تلقائي مقترح في الفراغات عند فتح جدول المعلم',
                'ظهور عداد تراكمي للمنتظرين في رأس كل حصة',
                'التحكم الكامل في عدد ومواقع حصص الانتظار لكل معلم',
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-[#e5e1fe]/40 rounded-xl">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#655ac1] to-[#8779fb] rounded-lg flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                  <span className="text-sm text-slate-600 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Substitution Warnings */}
      {warnings.filter(w => w.id.startsWith('sub-')).map(w => (
        <div key={w.id} className="bg-amber-50/80 border-2 border-amber-200/60 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-bold text-amber-700">{w.message}</p>
            {w.suggestion && <p className="text-xs text-amber-600 mt-1">{w.suggestion}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

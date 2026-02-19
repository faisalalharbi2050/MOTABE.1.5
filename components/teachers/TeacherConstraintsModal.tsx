import React, { useState, useMemo } from 'react';
import { Teacher, Specialization, TeacherConstraint, SpecializedMeeting, ClassInfo } from '../../types';
import { Users, Search, AlertTriangle, X, Copy, Sliders, Ban, Clock, ArrowRightFromLine, ArrowLeftFromLine, Plus, Repeat, GripVertical, ChevronUp, ChevronDown, Calendar, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { ValidationWarning } from '../../utils/scheduleConstraints';
import { INITIAL_SPECIALIZATIONS } from '../../constants';

// --- Constants & Helpers ---
const DAYS_AR_DEFAULT = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

function getDayLabel(d: string): string {
  if (!d) return 'يوم';
  const map: Record<string, string> = { 
    sunday:'الأحد', monday:'الإثنين', tuesday:'الثلاثاء', wednesday:'الأربعاء', thursday:'الخميس', friday:'الجمعة', saturday:'السبت' 
  };
  return map[d.toLowerCase()] ?? d;
}

// --- Component ---
interface Props {
  isOpen: boolean;
  onClose: () => void;
  teachers?: Teacher[];
  specializations?: Specialization[];
  constraints?: TeacherConstraint[];
  meetings?: SpecializedMeeting[];
  activeDays?: string[];
  periodsPerDay?: number;
  warnings?: ValidationWarning[];
  classes?: ClassInfo[];
  onChangeConstraints: (c: TeacherConstraint[]) => void;
  onChangeMeetings: (m: SpecializedMeeting[]) => void;
}

export default function TeacherConstraintsModal({
  isOpen, onClose,
  teachers = [], specializations = [], constraints = [], meetings = [], activeDays = [], periodsPerDay = 7,
  warnings = [], classes = [], onChangeConstraints, onChangeMeetings
}: Props) {

  // --- Safe Locals ---
  const safePeriodsCount = useMemo(() => {
    const p = Math.floor(Number(periodsPerDay)) || 7;
    return Math.max(1, Math.min(20, p));
  }, [periodsPerDay]);

  const periods = useMemo(() => Array.from({ length: safePeriodsCount }, (_, i) => i + 1), [safePeriodsCount]);
  
  const days = useMemo(() => {
    return (activeDays && activeDays.length > 0) ? activeDays.filter(Boolean) : DAYS_AR_DEFAULT;
  }, [activeDays]);

  // --- State ---
  const [selId, setSelId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'spec' | 'alpha'>('spec');
  const [specOrder, setSpecOrder] = useState<string[]>(() => INITIAL_SPECIALIZATIONS.map(s => s.id));
  const [showSpecPanel, setShowSpecPanel] = useState(false);
  const [showCopy, setShowCopy] = useState(false);
  const [copyTargets, setCopyTargets] = useState<string[]>([]);
  
  // Meeting Form & Smart Distribution
  const [mForm, setMForm] = useState({ specId: '', day: DAYS_AR_DEFAULT[0], period: 1 });
  const [distributeModal, setDistributeModal] = useState<{ teachers: string[], specId: string, day: string, period: number } | null>(null);

  // Copy Options
  const [copyOpts, setCopyOpts] = useState({
    consecutive: true,
    excluded: true,
    allocation: true,
    firstLast: true,
    earlyEntry: true,
  });
  
  // Sections Expansions
  const [open, setOpen] = useState<Record<string, boolean>>({ c1: true, c2: true, c3: true, c4: true, c5: true, c_copy: false, c6: true });

  // Early Return
  if (!isOpen) return null;

  // --- Logic Helpers ---
  const getC = (id: string): TeacherConstraint =>
    constraints.find(c => c.teacherId === id) || { teacherId: id, maxConsecutive: 2, excludedSlots: {} }; // Default changed to 2

  const updC = (tid: string, upd: Partial<TeacherConstraint>) => {
    const ex = constraints.find(c => c.teacherId === tid);
    const newConstraints = ex
      ? constraints.map(c => c.teacherId === tid ? { ...c, ...upd } : c)
      : [...constraints, { teacherId: tid, maxConsecutive: 2, excludedSlots: {}, ...upd }];
    onChangeConstraints(newConstraints);
  };

  // --- Stats ---
  const stats = (() => {
    try {
      const tc = classes.length || 0;
      const dc = days.length || 5;
      const need = tc * dc;
      const rec = Math.max(1, Math.ceil(need / (teachers.length || 1)));
      return { need, rec, tc, dc };
    } catch (e) {
      return { need: 0, rec: 5, tc: 0, dc: 5 };
    }
  })();

  // --- Filters ---
  const filteredTeachers = teachers.filter(t => {
    if (!t || !t.name) return false;
    const sName = specializations.find(s => s.id === t.specializationId)?.name || '';
    const term = search.toLowerCase();
    return t.name.toLowerCase().includes(term) || sName.toLowerCase().includes(term);
  }).sort((a, b) => {
    if (sortBy === 'alpha') return a.name.localeCompare(b.name, 'ar');
    const iA = specOrder.indexOf(a.specializationId ?? '');
    const iB = specOrder.indexOf(b.specializationId ?? '');
    const valA = iA === -1 ? 999 : iA;
    const valB = iB === -1 ? 999 : iB;
    if (valA !== valB) return valA - valB;
    return a.name.localeCompare(b.name, 'ar');
  });

  const selTeacher = teachers.find(t => t.id === selId);
  const sc = selId ? getC(selId) : null;
  const selWarnings = selId ? warnings.filter(w => w.relatedId === selId) : [];

  // --- Render Helpers ---
  const renderSectionHeader = (key: string, bg: string, border: string, iconBg: string, iconCol: string, Icon: React.ElementType, title: string, subtitle: string) => (
    <button onClick={() => setOpen(prev => ({ ...prev, [key]: !prev[key] }))}
      className={`w-full flex items-center justify-between p-4 rounded-2xl ${bg} border ${border} transition-all hover:opacity-90`}>
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center ${iconCol}`}>
          <Icon size={18} />
        </div>
        <div className="text-right">
          <div className="text-sm font-black text-slate-800">{title}</div>
          <div className="text-[10px] text-slate-500 font-bold">{subtitle}</div>
        </div>
      </div>
      <ChevronDown size={16} className={`text-slate-400 transition-transform ${open[key] ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3" style={{ direction: 'rtl' }}>
      <div className="bg-slate-50 w-full max-w-6xl h-[92vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-slate-200">

        {/* --- Header --- */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#e5e1fe] rounded-2xl flex items-center justify-center text-[#655ac1]"><Sliders size={22} /></div>
            <div>
              <h2 className="text-lg font-black text-slate-800">قيود المعلمين</h2>
              <p className="text-[11px] text-slate-400 font-bold">إدارة القيود والتفضيلات الفردية للمعلمين</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all"><X size={22} /></button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* --- Sidebar --- */}
          <div className="w-72 bg-white border-l border-slate-100 flex flex-col shrink-0">
            {/* Search & Sort */}
            <div className="p-3 border-b border-slate-100 space-y-2">
              <div className="relative">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="بحث..." className="w-full pr-9 pl-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none" />
              </div>
              <div className="flex gap-1.5">
                <button onClick={() => setSortBy('spec')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${sortBy==='spec'?'bg-[#655ac1] text-white':'bg-slate-100 text-slate-500'}`}>التخصص</button>
                <button onClick={() => setSortBy('alpha')} className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${sortBy==='alpha'?'bg-[#655ac1] text-white':'bg-slate-100 text-slate-500'}`}>أبجدي</button>
                {sortBy === 'spec' && (
                  <button onClick={() => setShowSpecPanel(!showSpecPanel)} className={`p-1.5 rounded-lg transition-all ${showSpecPanel?'bg-[#655ac1] text-white':'bg-slate-100 text-slate-500'}`}><GripVertical size={14} /></button>
                )}
              </div>
              {/* Spec Sorting Panel */}
              {showSpecPanel && sortBy === 'spec' && (
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-2 max-h-44 overflow-y-auto space-y-1">
                  {specOrder.map((sid, idx) => {
                    const sp = specializations.find(s => s.id === sid) || INITIAL_SPECIALIZATIONS.find(s => s.id === sid);
                    if (!sp) return null;
                    return (
                      <div key={sid} className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white border border-slate-100">
                        <span className="flex-1 text-[10px] font-bold text-slate-600 truncate">{sp.name}</span>
                        <div className="flex gap-1">
                          <button onClick={() => {
                            const newOrder = [...specOrder];
                            if (idx > 0) {
                              [newOrder[idx], newOrder[idx - 1]] = [newOrder[idx - 1], newOrder[idx]];
                              setSpecOrder(newOrder);
                            }
                          }} disabled={idx === 0} className="text-slate-300 hover:text-[#655ac1] disabled:opacity-30"><ChevronUp size={12} /></button>
                          <button onClick={() => {
                            const newOrder = [...specOrder];
                            if (idx < specOrder.length - 1) {
                              [newOrder[idx], newOrder[idx + 1]] = [newOrder[idx + 1], newOrder[idx]];
                              setSpecOrder(newOrder);
                            }
                          }} disabled={idx === specOrder.length - 1} className="text-slate-300 hover:text-[#655ac1] disabled:opacity-30"><ChevronDown size={12} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {/* List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredTeachers.map(t => {
                const isSel = selId === t.id;
                const spName = specializations.find(s => s.id === t.specializationId)?.name || '';
                const hasC = constraints.some(c => c.teacherId === t.id);
                return (
                  <button key={t.id} onClick={() => setSelId(t.id)}
                    className={`w-full text-right p-3 rounded-xl border flex items-center gap-3 transition-colors ${isSel ? 'bg-[#655ac1] text-white border-[#655ac1]' : 'bg-white border-transparent hover:bg-slate-50'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${isSel ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>{t.name.charAt(0)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate">{t.name}</div>
                      <div className={`text-[10px] truncate ${isSel ? 'text-white/70' : 'text-slate-400'}`}>{spName}</div>
                    </div>
                    {hasC && <div className={`w-1.5 h-1.5 rounded-full ${isSel ? 'bg-white' : 'bg-[#655ac1]'}`} />}
                  </button>
                );
              })}
              {filteredTeachers.length === 0 && <div className="text-center py-8 text-xs text-slate-400">لا يوجد معلمين</div>}
            </div>
          </div>

          {/* --- Main Content --- */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {!selTeacher ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                <Users size={48} className="opacity-20" />
                <p className="text-sm font-bold text-slate-400">اختر معلماً للبدء</p>
              </div>
            ) : (
              <div className="space-y-4 pb-10">
                {/* Info Card */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#e5e1fe] flex items-center justify-center text-[#655ac1] font-black text-lg">{selTeacher.name.charAt(0)}</div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800">{selTeacher.name}</h3>
                      <div className="flex gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500">{specializations.find(s=>s.id===selTeacher.specializationId)?.name || 'عام'}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">نصاب: {selTeacher.quotaLimit}</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Warnings */}
                {selWarnings.map(w => (
                  <div key={w.id} className={`p-3 rounded-xl text-xs border flex gap-3 ${w.level==='error'?'bg-rose-50 text-rose-700 border-rose-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    <AlertTriangle size={16} className="shrink-0" />
                    <div>
                      <div className="font-bold">{w.message}</div>
                      {w.suggestion && <div className="opacity-80 mt-1">{w.suggestion}</div>}
                    </div>
                  </div>
                ))}

                {/* 1. Consecutive Periods - Smaller, Pattern N+0, Default 2 */}
                <div className="space-y-2">
                  {renderSectionHeader('c1', 'bg-violet-50', 'border-violet-200', 'bg-violet-100', 'text-violet-600', Sliders, 'تتابع الحصص', 'الحد الأقصى للحصص المتتالية')}
                  {open.c1 && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                      <div className="flex flex-wrap gap-2 px-4">
                        {[1, 2, 3, 4, 5].map(n => {
                          const isAct = (sc?.maxConsecutive ?? 2) === n;
                          return (
                            <button key={n} onClick={() => updC(selTeacher.id, { maxConsecutive: n })}
                              className={`w-14 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${isAct ? 'border-violet-500 bg-violet-50 shadow-sm shadow-violet-100' : 'border-slate-100 hover:border-violet-200 bg-white'}`}>
                              <span className={`text-base font-black ${isAct ? 'text-violet-600' : 'text-slate-400'}`}>{n}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Excluded Slots - Improved Layout, Check (Available) vs X (Excluded) */}
                <div className="space-y-2">
                  {renderSectionHeader('c2', 'bg-rose-50', 'border-rose-200', 'bg-rose-100', 'text-rose-600', Ban, 'استثناء الحصص', 'منع إسناد حصص معينة')}
                  {open.c2 && (
                      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm overflow-x-auto">
                        <div className="min-w-[600px]">
                          {/* Header */}
                          <div className="flex mb-3 gap-2">
                             <div className="w-24 shrink-0"></div>
                             {periods.map(p => (
                               <div key={p} className="flex-1 text-center">
                                  <button onClick={() => {
                                      const c = getC(selTeacher.id);
                                      const currentSlots = c.excludedSlots || {};
                                      const allBlocked = days.every(d => (currentSlots[d] || []).includes(p));
                                      const newSlots = { ...currentSlots };
                                      days.forEach(d => {
                                        const daySlots = newSlots[d] || [];
                                        if (allBlocked) newSlots[d] = daySlots.filter(x => x !== p);
                                        else if (!daySlots.includes(p)) newSlots[d] = [...daySlots, p];
                                      });
                                      updC(selTeacher.id, { excludedSlots: newSlots });
                                  }} className="w-8 h-8 rounded-full bg-slate-50 text-[10px] font-black text-slate-500 hover:bg-slate-200 hover:text-slate-700 transition-colors mx-auto flex items-center justify-center">
                                    {p}
                                  </button>
                               </div>
                             ))}
                          </div>
                          
                          {/* Body */}
                          <div className="space-y-2">
                            {days.map(d => (
                              <div key={d} className="flex items-center gap-2 group">
                                <button onClick={() => {
                                      const c = getC(selTeacher.id);
                                      const current = c.excludedSlots?.[d] || [];
                                      const newSlots = { ...(c.excludedSlots || {}) };
                                      newSlots[d] = current.length === safePeriodsCount ? [] : [...periods];
                                      updC(selTeacher.id, { excludedSlots: newSlots });
                                }} className="w-24 shrink-0 text-right px-3 py-2 text-[11px] font-bold text-slate-500 rounded-xl group-hover:bg-slate-50 group-hover:text-slate-700 transition-colors">
                                  {getDayLabel(d)}
                                </button>
                                
                                {periods.map(p => {
                                    const isEx = (sc?.excludedSlots?.[d] || []).includes(p);
                                    const isEarly = (sc?.earlyExit?.[d] !== undefined) && p > sc.earlyExit[d];
                                    
                                    return (
                                      <div key={p} className="flex-1 flex justify-center">
                                        <button 
                                          onClick={() => {
                                            if (isEarly) return;
                                            const c = getC(selTeacher.id);
                                            const cur = c.excludedSlots?.[d] || [];
                                            const newSlots = { ...(c.excludedSlots || {}) };
                                            newSlots[d] = cur.includes(p) ? cur.filter(x => x !== p) : [...cur, p];
                                            updC(selTeacher.id, { excludedSlots: newSlots });
                                          }}
                                          disabled={isEarly}
                                          className={`w-full max-w-[3rem] h-9 rounded-lg flex items-center justify-center transition-all duration-200
                                            ${isEarly ? 'bg-slate-50 border border-slate-100 opacity-50 cursor-not-allowed' : 
                                              isEx 
                                                ? 'bg-rose-50 border border-rose-100 text-rose-500 hover:border-rose-300 hover:shadow-sm' // Excluded
                                                : 'bg-emerald-50 border border-emerald-100 text-emerald-500 hover:border-emerald-300 hover:shadow-sm' // Available
                                            }`}>
                                          {isEarly && <span className="text-slate-300">-</span>}
                                          {!isEarly && isEx && <X size={16} strokeWidth={3} />}
                                          {!isEarly && !isEx && <Check size={16} strokeWidth={3} />}
                                        </button>
                                      </div>
                                    );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}
                </div>

                {/* 3. Daily Limits - Redesigned Table */}
                <div className="space-y-2">
                  {renderSectionHeader('c3', 'bg-blue-50', 'border-blue-200', 'bg-blue-100', 'text-blue-600', Sparkles, 'تخصيص الحصص اليومية', 'تخصيص حصص المعلم في اليوم من وإلى')}
                  {open.c3 && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
                      <table className="w-full text-center border-collapse">
                        <thead>
                          <tr className="bg-slate-50/50">
                            <th className="p-3 text-[10px] text-slate-400 font-bold rounded-r-xl">اليوم</th>
                            <th className="p-3 text-[10px] text-slate-400 font-bold">بداية الدوام</th>
                            <th className="p-3 text-[10px] text-slate-400 font-bold">نهاية الدوام</th>

                            <th className="p-3 text-[10px] text-slate-400 font-bold rounded-l-xl">تعميم</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {days.map(d => {
                            const l = sc?.dailyLimits?.[d] || { min: 0, max: safePeriodsCount, windowStart: 1, windowEnd: safePeriodsCount };
                            return (
                              <tr key={d} className="hover:bg-slate-50/30 transition-colors">
                                <td className="p-3 text-[11px] font-bold text-slate-600 text-right">{getDayLabel(d)}</td>
                                <td className="p-2">
                                  <div className="relative inline-block w-full max-w-[4rem]">
                                    <select value={l.windowStart} onChange={e => {
                                        const val = Number(e.target.value);
                                        const currentEnd = l.windowEnd || safePeriodsCount;
                                        // Auto-adjust Max based on window
                                        const newMax = Math.max(0, currentEnd - val + 1);
                                        const lims = { ...(sc?.dailyLimits || {}) };
                                        lims[d] = { ...l, windowStart: val, max: newMax, min: 0 };
                                        updC(selTeacher.id, { dailyLimits: lims });
                                    }} className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center appearance-none focus:border-blue-400 outline-none">
                                        {periods.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><ChevronDown size={10} /></div>
                                  </div>
                                </td>
                                <td className="p-2">
                                  <div className="relative inline-block w-full max-w-[4rem]">
                                    <select value={l.windowEnd} onChange={e => {
                                        const val = Number(e.target.value);
                                        const currentStart = l.windowStart || 1;
                                        // Auto-adjust Max based on window
                                        const newMax = Math.max(0, val - currentStart + 1);
                                        const lims = { ...(sc?.dailyLimits || {}) };
                                        lims[d] = { ...l, windowEnd: val, max: newMax, min: 0 };
                                        updC(selTeacher.id, { dailyLimits: lims });
                                    }} className="w-full p-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center appearance-none focus:border-blue-400 outline-none">
                                        {periods.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                    <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"><ChevronDown size={10} /></div>
                                  </div>
                                </td>

                                <td className="p-2">
                                  <button onClick={() => {
                                    const src = sc?.dailyLimits?.[d];
                                    if (!src) return;
                                    const lims = { ...(sc?.dailyLimits || {}) };
                                    days.forEach(day => { if (day !== d) lims[day] = { ...src }; });
                                    updC(selTeacher.id, { dailyLimits: lims });
                                  }} className="p-1.5 rounded-lg text-slate-300 hover:bg-blue-50 hover:text-blue-500 transition-colors" title="نسخ لباقي الأيام"><Repeat size={14} /></button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* 4. First/Last - Auto-enable Dropdowns */}
                <div className="space-y-2">
                  {renderSectionHeader('c4', 'bg-emerald-50', 'border-emerald-200', 'bg-emerald-100', 'text-emerald-600', ArrowRightFromLine, 'الحصص الأولى والأخيرة', 'تخصيص توزيع عدد الحصص الأولى والأخيرة')}
                  {open.c4 && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid md:grid-cols-2 gap-6">
                      
                      <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-black text-slate-700">الحصص الأولى</label>
                          <div className="text-[10px] text-slate-400 font-bold">أقصى حد أسبوعي</div>
                        </div>
                        <div className="relative">
                          <select 
                             value={sc?.maxFirstPeriods ?? 0} 
                             onChange={e => {
                               const val = Number(e.target.value);
                               updC(selTeacher.id, { maxFirstPeriods: val === 0 ? undefined : val }); // 0 means disabled
                             }} 
                             className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all">
                             <option value={0}>-- غير مفعل --</option>
                             {[...Array(days.length + 1).keys()].slice(1).map(n => <option key={n} value={n}>{n} حصص</option>)}
                          </select>
                          <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">تحديد الحد الأقصى للحصص الأولى التي يمكن إسنادها للمعلم خلال الأسبوع.</p>
                      </div>

                      <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-black text-slate-700">الحصص الأخيرة</label>
                          <div className="text-[10px] text-slate-400 font-bold">أقصى حد أسبوعي</div>
                        </div>
                        <div className="relative">
                          <select 
                             value={sc?.maxLastPeriods ?? 0} 
                             onChange={e => {
                               const val = Number(e.target.value);
                               updC(selTeacher.id, { maxLastPeriods: val === 0 ? undefined : val }); // 0 means disabled
                             }} 
                             className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all">
                             <option value={0}>-- غير مفعل --</option>
                             {[...Array(days.length + 1).keys()].slice(1).map(n => <option key={n} value={n}>{n} حصص</option>)}
                          </select>
                          <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">تحديد الحد الأقصى للحصص الأخيرة التي يمكن إسنادها للمعلم خلال الأسبوع.</p>
                      </div>

                    </div>
                  )}
                </div>

                {/* 5. Early Exit - Improved Design */}
                <div className="space-y-2">
                  {renderSectionHeader('c5', 'bg-amber-50', 'border-amber-200', 'bg-amber-100', 'text-amber-600', Clock, 'الخروج المبكر', 'إنهاء الدوام مبكراً')}
                  {open.c5 && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                      
                      <div className="flex justify-center">
                        <div className="bg-slate-100 p-1.5 rounded-xl inline-flex relative">
                           {['manual', 'auto'].map(m => {
                             const isSel = (sc?.earlyExitMode || 'manual') === m;
                             return (
                               <button key={m} onClick={() => updC(selTeacher.id, { earlyExitMode: m as any })}
                                 className={`relative z-10 px-6 py-2 rounded-lg text-xs font-bold transition-all ${isSel ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                 {m === 'manual' ? 'تحديد يوم يدوي' : 'تحديد يوم تلقائي'}
                               </button>
                             );
                           })}
                        </div>
                      </div>

                      <div className="bg-amber-50/50 rounded-2xl p-6 border border-amber-100/50 flex flex-col md:flex-row gap-6 items-center">
                        {(sc?.earlyExitMode || 'manual') === 'manual' && (
                          <div className="w-full md:w-1/2">
                            <label className="text-xs font-bold text-slate-500 block mb-2">اليوم المطلوب</label>
                            <div className="relative">
                                <select 
                                  value={sc?.earlyExit ? Object.keys(sc.earlyExit)[0] || '' : ''}
                                  onChange={e => {
                                    const d = e.target.value;
                                    if (!d) { updC(selTeacher.id, { earlyExit: {} }); return; }
                                    const oldP = sc?.earlyExit ? Object.values(sc.earlyExit)[0] : (safePeriodsCount - 1);
                                    updC(selTeacher.id, { earlyExit: { [d]: oldP || (safePeriodsCount - 1) } });
                                  }}
                                  className="w-full p-3 bg-white border border-amber-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-amber-100 outline-none">
                                  <option value="">-- اختر يوماً --</option>
                                  {days.map(d => <option key={d} value={d}>{getDayLabel(d)}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                          </div>
                        )}

                        <div className="w-full md:w-1/2">
                          <label className="text-xs font-bold text-slate-500 block mb-2">الخروج بعد الحصة</label>
                          <div className="relative">
                              <select 
                                value={sc?.earlyExit ? Object.values(sc.earlyExit)[0] || '' : ''}
                                onChange={e => {
                                  const v = Number(e.target.value);
                                  const mode = sc?.earlyExitMode || 'manual';
                                  const day = sc?.earlyExit ? Object.keys(sc.earlyExit)[0] : (mode === 'auto' ? days[0] : '');
                                  if (!day && mode === 'manual') return;
                                  const targetDay = day || days[0];
                                  
                                  // Conflict Check
                                  const p = v;
                                  const maxTotal = p + (days.length - 1) * safePeriodsCount;
                                  if (maxTotal < selTeacher.quotaLimit) {
                                    alert('تنبيه: هذا التوقيت يتعارض مع نصاب المعلم!');
                                  }
                                  
                                  updC(selTeacher.id, { earlyExit: { [targetDay]: v } });
                                }}
                                className="w-full p-3 bg-white border border-amber-200 rounded-xl text-sm font-bold focus:ring-4 focus:ring-amber-100 outline-none">
                                <option value="">-- اختر --</option>
                                {periods.slice(0, -1).map(p => <option key={p} value={p}>{p}</option>)}
                              </select>
                              <ChevronDown size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

<div className="space-y-2">
                  {renderSectionHeader('c_copy', 'bg-cyan-50', 'border-cyan-200', 'bg-cyan-100', 'text-cyan-600', Copy, 'نسخ القيود للمعلمين', 'نسخ قيود معلم لآخر')}
                  {open.c_copy && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        {/* Copy Options */}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                             <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-slate-700 text-xs">خيارات النسخ</h4>
                                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-cyan-600 hover:text-cyan-700">
                                    <input type="checkbox" checked={copyOpts.consecutive && copyOpts.excluded && copyOpts.allocation && copyOpts.firstLast && copyOpts.earlyEntry} 
                                           onChange={e => {
                                               const v = e.target.checked;
                                               setCopyOpts({ consecutive: v, excluded: v, allocation: v, firstLast: v, earlyEntry: v });
                                           }} className="accent-cyan-600 w-4 h-4 rounded" />
                                    <span>تحديد الكل</span>
                                </label>
                             </div>
                             <div className="flex flex-wrap gap-2">
                                {[
                                    { k: 'consecutive', l: 'تتابع' },
                                    { k: 'excluded', l: 'استثناء' },
                                    { k: 'allocation', l: 'تخصيص يومي' },
                                    { k: 'firstLast', l: 'أولى/أخيرة' },
                                    { k: 'earlyEntry', l: 'خروج مبكر' }
                                ].map(opt => (
                                    <label key={opt.k} className="flex-1 min-w-[80px] flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 cursor-pointer hover:border-cyan-300 transition-colors select-none">
                                        <input type="checkbox" checked={copyOpts[opt.k as keyof typeof copyOpts]} 
                                               onChange={e => setCopyOpts({...copyOpts, [opt.k]: e.target.checked})} className="accent-cyan-600 w-4 h-4 rounded" />
                                        <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap">{opt.l}</span>
                                    </label>
                                ))}
                             </div>
                        </div>

                        <div className="flex justify-between items-center bg-cyan-50/50 p-4 rounded-xl border border-cyan-100">
                             <div>
                                 <h4 className="font-bold text-slate-700">تحديد المعلمين</h4>
                                 <p className="text-xs text-slate-400 mt-1">اختر المعلمين المراد تطبيق نفس القيود عليهم</p>
                             </div>
                             <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                                    {copyTargets.length} معلمين محددين
                                </span>
                                <button 
                                    onClick={() => {
                                        const allIds = filteredTeachers.filter(t => t.id !== selId).map(t => t.id);
                                        if (copyTargets.length === allIds.length) setCopyTargets([]);
                                        else setCopyTargets(allIds);
                                    }}
                                    className="text-xs font-bold text-cyan-600 hover:text-cyan-700 px-3 py-1.5 hover:bg-cyan-50 rounded-lg transition-colors"
                                >
                                    {copyTargets.length === filteredTeachers.filter(t => t.id !== selId).length ? 'إلغاء الكل' : 'تحديد الكل'}
                                </button>
                             </div>
                        </div>

                        <div className="max-h-60 overflow-y-auto border border-slate-100 rounded-xl p-2 space-y-1 bg-slate-50/50 custom-scrollbar">
                           {filteredTeachers.filter(t => t.id !== selId).map(t => (
                             <label key={t.id} className="flex items-center gap-3 p-2.5 hover:bg-white border border-transparent hover:border-slate-100 rounded-xl cursor-pointer transition-all">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${copyTargets.includes(t.id) ? 'bg-cyan-500 border-cyan-500' : 'bg-white border-slate-300'}`}>
                                   {copyTargets.includes(t.id) && <Check size={14} className="text-white" strokeWidth={3} />}
                                </div>
                                <span className="text-xs font-bold text-slate-700">{t.name}</span>
                                <input type="checkbox" className="hidden" checked={copyTargets.includes(t.id)} onChange={e => {
                                  if (e.target.checked) setCopyTargets([...copyTargets, t.id]);
                                  else setCopyTargets(copyTargets.filter(id => id !== t.id));
                                }} />
                             </label>
                           ))}
                           {filteredTeachers.length <= 1 && <div className="text-center py-4 text-xs text-slate-400">لا يوجد معلمين آخرين للنسخ إليهم</div>}
                        </div>
                        
                        <div className="pt-2">
                           <button 
                            disabled={copyTargets.length === 0}
                            onClick={() => {
                                if (copyTargets.length === 0) return;
                                if (!confirm(`هل أنت متأكد من نسخ القيود المحددة إلى ${copyTargets.length} معلم؟`)) return;
                                
                                const src = getC(selId!);
                                const nc = [...constraints];
                                copyTargets.forEach(tid => {
                                    const idx = nc.findIndex(c => c.teacherId === tid);
                                    const existing: TeacherConstraint = idx >= 0 ? nc[idx] : { 
                                        teacherId: tid, 
                                        maxConsecutive: 2, 
                                        excludedSlots: {} 
                                    };
                                    
                                    // Merge logic
                                    const n = { ...existing };
                                    if (copyOpts.consecutive) n.maxConsecutive = src.maxConsecutive;
                                    if (copyOpts.excluded) n.excludedSlots = src.excludedSlots;
                                    if (copyOpts.allocation) n.dailyLimits = src.dailyLimits;
                                    if (copyOpts.firstLast) {
                                        n.maxFirstPeriods = src.maxFirstPeriods;
                                        n.maxLastPeriods = src.maxLastPeriods;
                                    }
                                    if (copyOpts.earlyEntry) {
                                        n.earlyExit = src.earlyExit;
                                        n.earlyExitMode = src.earlyExitMode;
                                    }

                                    if (idx >= 0) nc[idx] = n; else nc.push(n);
                                });
                                onChangeConstraints(nc);
                                setCopyTargets([]);
                                alert('تم نسخ القيود بنجاح');
                            }} 
                            className="w-full py-3 bg-cyan-600 text-white rounded-xl text-xs font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                          >
                                <Copy size={16} /> تطبيق النسخ على المحدد ({copyTargets.length})
                          </button>
                        </div>
                    </div>
                  )}
                </div>

                <div className="my-6 border-t border-slate-100 mx-4" />

                {/* 6. Meetings - Fix Add All Teachers */}
                <div className="space-y-2">
                  {renderSectionHeader('c6', 'bg-indigo-50', 'border-indigo-200', 'bg-indigo-100', 'text-indigo-600', Calendar, 'الاجتماعات', 'مواعيد ثابتة للتخصص')}
                  {open.c6 && (
                    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                      <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 grid grid-cols-4 gap-4 items-end">
                        <div className="col-span-1">
                           <label className="text-[10px] font-bold block mb-1.5 text-slate-600">التخصص</label>
                           <div className="relative">
                               <select value={mForm.specId} onChange={e => setMForm({...mForm, specId: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500">
                                 <option value="">اختر التخصص...</option>
                                 {specializations.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                               </select>
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold block mb-1.5 text-slate-600">اليوم</label>
                           <div className="relative">
                               <select value={mForm.day} onChange={e => setMForm({...mForm, day: e.target.value})} className="w-full p-2.5 text-xs font-bold rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500">
                                 {days.map(d => <option key={d} value={d}>{getDayLabel(d)}</option>)}
                               </select>
                           </div>
                        </div>
                        <div>
                           <label className="text-[10px] font-bold block mb-1.5 text-slate-600">الحصة</label>
                           <div className="relative">
                               <select value={mForm.period} onChange={e => setMForm({...mForm, period: Number(e.target.value)})} className="w-full p-2.5 text-xs font-bold rounded-lg border border-slate-200 bg-white outline-none focus:border-indigo-500">
                                 {periods.map(p => <option key={p} value={p}>{p}</option>)}
                               </select>
                           </div>
                        </div>
                        <button onClick={() => {
                          if (!mForm.specId) { alert('الرجاء اختيار التخصص'); return; }
                          
                          // Find all teachers
                          const tids = teachers.filter(t => t.specializationId === mForm.specId).map(t => t.id);
                          
                          if (tids.length === 0) { alert('لا يوجد معلمين في هذا التخصص'); return; }

                          // Smart Warning / Mode
                          if (tids.length > 5) {
                             setDistributeModal({ teachers: tids, specId: mForm.specId, day: mForm.day, period: mForm.period });
                             return;
                          }

                          const newMeeting: SpecializedMeeting = {
                              id: `m-${Date.now()}`, 
                              specializationId: mForm.specId, 
                              day: mForm.day, 
                              period: mForm.period, 
                              teacherIds: tids 
                          };

                          onChangeMeetings([...meetings, newMeeting]);
                        }} className="bg-indigo-600 text-white p-2.5 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2">
                            <Plus size={16} /> إضافة للجميع
                        </button>
                      </div>
                      
                      {meetings.length > 0 ? (
                        <div className="space-y-2">
                          {meetings.map((m, i) => (
                            <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl bg-white hover:border-indigo-100 transition-colors">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    <Users size={16} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-indigo-900">{specializations.find(s=>s.id===m.specializationId)?.name}</div>
                                    <div className="text-[10px] text-slate-400 font-bold mt-0.5">{getDayLabel(m.day)} - الحصة {m.period} • {m.teacherIds.length} معلمين</div>
                                </div>
                              </div>
                              <button onClick={() => onChangeMeetings(meetings.filter((_, idx) => idx !== i))} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><X size={16} /></button>
                            </div>
                          ))}
                        </div>
                      ) : (
                          <div className="text-center py-6 text-slate-300 text-xs font-bold border-2 border-dashed border-slate-100 rounded-xl">لا توجد اجتماعات مضافة</div>
                      )}
                    </div>
                  )}
                </div>
                
              </div>
            )}
          </div>
        </div>

        {/* Copy Modal - Added Select All */}


      </div>

      {/* Smart Distribution Modal */}
      {distributeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="p-5 border-b border-slate-100 bg-indigo-50/50 flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-white text-indigo-600 flex items-center justify-center shadow-sm">
                   <Sparkles size={20} />
                 </div>
                 <div>
                   <h3 className="font-black text-slate-800">توزيع ذكي للمعلمين</h3>
                   <p className="text-xs font-bold text-slate-500">عدد المعلمين كبير ({distributeModal.teachers.length})، اختر طريقة التوزيع</p>
                 </div>
               </div>
               <button onClick={() => setDistributeModal(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
             </div>
             
             <div className="p-5 space-y-3">
               {/* Option 1: All in One */}
               <button onClick={() => {
                   const newMeeting: SpecializedMeeting = {
                      id: `m-${Date.now()}`, 
                      specializationId: distributeModal.specId, 
                      day: distributeModal.day, 
                      period: distributeModal.period, 
                      teacherIds: distributeModal.teachers 
                   };
                   onChangeMeetings([...meetings, newMeeting]);
                   setDistributeModal(null);
               }} className="w-full text-right p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group">
                  <div className="font-bold text-slate-700 group-hover:text-indigo-700">جمع الجميع في يوم واحد</div>
                  <div className="text-xs text-slate-400 mt-1">إضافة {distributeModal.teachers.length} معلم في {distributeModal.day} - الحصة {distributeModal.period}</div>
               </button>

               {/* Option 2: Split 2 Days */}
               {(activeDays?.length ?? 0) >= 2 && (
                 <button onClick={() => {
                     const half = Math.ceil(distributeModal.teachers.length / 2);
                     const g1 = distributeModal.teachers.slice(0, half);
                     const g2 = distributeModal.teachers.slice(half);
                     
                     // Find next day from activeDays
                     const d1 = distributeModal.day;
                     // Note: activeDays might be undefined, fallback to DAYS_AR_DEFAULT
                     const daysList = activeDays && activeDays.length > 0 ? activeDays : DAYS_AR_DEFAULT;
                     
                     // Find index using localized display comparison is risky if activeDays are keys
                     // Assuming activeDays contains 'Sunday', 'Monday', etc... 
                     // But getDayLabel implies keys might be English or Arabic.
                     // The component uses 'days' helper which comes from props or fallback.
                     // Let's use the 'days' variable defined in the component logic (line ~35)
                     // But wait, 'days' variable is internal to component scope and not available here?
                     // Ah, I am inside the component function scope. Yes.
                     // I'll assume 'days' (lines 35-45) is accessible.
                     // Since I am appending JSX, I need to make sure I am inside the function scope.
                     // Yes, I am replacing the closing brace of return.
                     
                     // Re-reading file structure:
                     // The 'days' const is defined at top of component.
                     // It is accessible.
                     
                     const idx = days.indexOf(d1);
                     const nextIdx = idx === -1 ? 1 : (idx + 1) % days.length;
                     const d2 = days[nextIdx];

                     const m1 = { id: `m-${Date.now()}-1`, specializationId: distributeModal.specId, day: d1, period: distributeModal.period, teacherIds: g1 };
                     const m2 = { id: `m-${Date.now()}-2`, specializationId: distributeModal.specId, day: d2, period: distributeModal.period, teacherIds: g2 };
                     
                     onChangeMeetings([...meetings, m1, m2]);
                     setDistributeModal(null);
                 }} className="w-full text-right p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group">
                    <div className="flex items-center justify-between">
                       <div className="font-bold text-slate-700 group-hover:text-emerald-700">توزيع على يومين (50/50)</div>
                       <span className="text-[10px] font-black px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg">موصى به</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">يوم {getDayLabel(distributeModal.day)} ({Math.ceil(distributeModal.teachers.length/2)}) + اليوم التالي ({Math.floor(distributeModal.teachers.length/2)})</div>
                 </button>
               )}

               {/* Option 3: Split 3 Days */}
               {(activeDays?.length ?? 0) >= 3 && distributeModal.teachers.length > 8 && (
                 <button onClick={() => {
                     const third = Math.ceil(distributeModal.teachers.length / 3);
                     const g1 = distributeModal.teachers.slice(0, third);
                     const g2 = distributeModal.teachers.slice(third, third*2);
                     const g3 = distributeModal.teachers.slice(third*2);
                     
                     const d1 = distributeModal.day;
                     // Reuse 'days' scope variable
                     const idx = days.indexOf(d1);
                     const d2 = days[(idx + 1) % days.length];
                     const d3 = days[(idx + 2) % days.length];

                     const m1 = { id: `m-${Date.now()}-1`, specializationId: distributeModal.specId, day: d1, period: distributeModal.period, teacherIds: g1 };
                     const m2 = { id: `m-${Date.now()}-2`, specializationId: distributeModal.specId, day: d2, period: distributeModal.period, teacherIds: g2 };
                     const m3 = { id: `m-${Date.now()}-3`, specializationId: distributeModal.specId, day: d3, period: distributeModal.period, teacherIds: g3 };
                     
                     onChangeMeetings([...meetings, m1, m2, m3]);
                     setDistributeModal(null);
                 }} className="w-full text-right p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50 transition-all group">
                    <div className="font-bold text-slate-700 group-hover:text-sky-700">توزيع على 3 أيام</div>
                    <div className="text-xs text-slate-400 mt-1">توزيع {distributeModal.teachers.length} معلم على 3 أيام متتالية</div>
                 </button>
               )}
             </div>
          </div>
        </div>
      )}

    </div>
  );
}

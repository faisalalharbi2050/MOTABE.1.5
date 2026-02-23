import React, { useState, useMemo } from 'react';
import { ScheduleSettingsData, Teacher, ClassInfo, Subject } from '../../types';
import { Maximize2, Minimize2 } from 'lucide-react';
import { mockTeachers, mockClasses, mockSubjects, mockSettings, mockSpecNames } from './mockScheduleData';

export type TeacherSortMode = 'alpha' | 'specialization' | 'custom';

const ENGLISH_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'];
const ARABIC_DAYS  = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const MAX_PERIODS  = 7;

// Design tokens
const C_BG          = '#a59bf0'; // purple – day header bg & content text
const C_BG_SOFT     = '#f4f2ff'; // very light purple – period-number row bg
const C_BG_HEADER_ROW = '#a59bf0'; // same purple for sticky info header
const C_BORDER      = '#94a3b8'; // slate-400 – normal column dividers (light)
const C_DAY_SEP     = '#64748b'; // slate-500 – separator between days (medium)
const C_STRONG_SEP  = '#334155'; // slate-700 – post-waiting-quota strong separator

const SPECIALIZATION_ABBR: Record<string, string> = {
    'اللغة العربية': 'عربي',
    'الدراسات الإسلامية': 'دين',
    'القرآن الكريم': 'دين',
    'اللغة الإنجليزية': 'انجليزي',
    'التربية الفنية': 'فنية',
    'التربية البدنية': 'بدنية',
    'الحاسب الآلي': 'حاسب',
    'الرياضيات': 'رياضيات',
    'العلوم': 'علوم',
    'الاجتماعيات': 'اجتماعيات',
    'المهارات الحياتية': 'مهارات',
    'التربية المهنية': 'مهنية',
    'التقنية الرقمية': 'رقمية',
    'أحياء': 'أحياء',
    'فيزياء': 'فيزياء',
    'كيمياء': 'كيمياء',
    'علم البيئة': 'بيئة',
};

interface InlineScheduleViewProps {
    type: 'general_teachers' | 'general_classes' | 'individual_teacher' | 'individual_class' | 'general_waiting';
    settings: ScheduleSettingsData;
    teachers: Teacher[];
    classes: ClassInfo[];
    subjects: Subject[];
    targetId?: string;
    teacherSortMode?: TeacherSortMode;
    teacherCustomOrder?: string[];
    specializationCustomOrder?: string[];
    specializationNames?: Record<string, string>;
}

const InlineScheduleView: React.FC<InlineScheduleViewProps> = ({
    type, settings: _settings, teachers: _teachers, classes: _classes, subjects: _subjects, targetId,
    teacherSortMode = 'alpha',
    teacherCustomOrder = [],
    specializationCustomOrder = [],
    specializationNames: _specNames = {},
}) => {
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [showWaitingCounts, setShowWaitingCounts] = useState(true);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    // ── استخدام البيانات الوهمية عند الضغط على زر المعاينة ──
    const settings          = isPreviewMode ? mockSettings        : _settings;
    const teachers          = isPreviewMode ? mockTeachers        : _teachers;
    const classes           = isPreviewMode ? mockClasses         : _classes;
    const subjects          = isPreviewMode ? mockSubjects        : _subjects;
    const specializationNames = isPreviewMode ? mockSpecNames     : _specNames;
    const timetable = settings.timetable || {};

    /* ── look-up helpers ─────────────────────────────── */
    const subjName    = (id: string) => subjects.find(s => s.id === id)?.name || '';
    const subjDisplay = (id: string) => settings.subjectAbbreviations?.[id] || subjName(id);
    const tName       = (id: string) => teachers.find(t => t.id === id)?.name || '';
    const cName       = (id: string) => { const c = classes.find(c => c.id === id); return c ? (c.name || c.grade+'/'+c.section) : ''; };
    const tLQ  = (t: Teacher) => t.quotaLimit   || 0;
    const tWQ  = (t: Teacher) => t.waitingQuota || 0;

    /* ── abbreviation helper ────────────────────────── */
    const getAbbrSpec = (specId: string) => {
        const full = (specializationNames[specId] || specId || '').trim();
        // Try exact match first
        if(SPECIALIZATION_ABBR[full]) return SPECIALIZATION_ABBR[full];
        // Try partial mapping (e.g. contains "إسلامية")
        if(full.includes('إسلامية') || full.includes('قرآن')) return 'دين';
        if(full.includes('عربية')) return 'عربي';
        if(full.includes('إنجليزية') || full.includes('انجليزي')) return 'انجليزي';
        if(full.includes('فنية')) return 'فنية';
        if(full.includes('بدنية')) return 'بدنية';
        if(full.includes('حاسب')) return 'حاسب';
        return full;
    };

    /* ── class lesson count ──────────────────────────── */
    const classLessonCount = useMemo(() => {
        const m = new Map<string,number>();
        Object.values(timetable).forEach(s => { if(s.classId && s.type==='lesson') m.set(s.classId,(m.get(s.classId)||0)+1); });
        return m;
    }, [timetable]);

    /* ── class-keyed slot map (classId-day-period) ───── */
    const classSlotMap = useMemo(() => {
        const m = new Map<string, typeof timetable[string]>();
        Object.entries(timetable).forEach(([key, slot]) => {
            if (!slot.classId) return;
            for(const day of ENGLISH_DAYS){
                const match = key.match(new RegExp(`-(${day})-(\\d+)$`));
                if(match){ m.set(`${slot.classId}-${day}-${match[2]}`, slot); break; }
            }
        });
        return m;
    }, [timetable]);

    /* ── sorting ─────────────────────────────────────── */
    const getSortedTeachers = (): Teacher[] => {
        const list = [...teachers];
        if(teacherSortMode === 'alpha') return list.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
        if(teacherSortMode === 'specialization'){
            if(specializationCustomOrder.length > 0){
                const om = new Map(specializationCustomOrder.map((id,i)=>[id,i]));
                return list.sort((a,b)=>{
                    const ia = om.has(a.specializationId)?om.get(a.specializationId)!:9999;
                    const ib = om.has(b.specializationId)?om.get(b.specializationId)!:9999;
                    return ia!==ib ? ia-ib : a.name.localeCompare(b.name,'ar');
                });
            }
            return list.sort((a,b)=>{
                const sa=specializationNames[a.specializationId]||a.specializationId||'';
                const sb=specializationNames[b.specializationId]||b.specializationId||'';
                const c=sa.localeCompare(sb,'ar'); return c!==0?c:a.name.localeCompare(b.name,'ar');
            });
        }
        if(teacherSortMode==='custom' && teacherCustomOrder.length>0){
            const om=new Map(teacherCustomOrder.map((id,i)=>[id,i]));
            return list.sort((a,b)=>{
                const ia=om.has(a.id)?om.get(a.id)!:9999, ib=om.has(b.id)?om.get(b.id)!:9999; return ia-ib;
            });
        }
        return list;
    };
    const getSortedClasses = () => [...classes].sort((a,b)=> a.grade!==b.grade?a.grade-b.grade:(a.section||0)-(b.section||0));

    const teachersWithWaiting = useMemo(()=>{
        const ids=new Set<string>();
        Object.values(timetable).forEach(s=>{ if(s.type==='waiting'||s.isSubstitution) ids.add(s.teacherId); });
        const sorted = getSortedTeachers();
        return ids.size===0 ? sorted : sorted.filter(t=>ids.has(t.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[timetable,teachers,teacherSortMode,teacherCustomOrder,specializationCustomOrder]);

    const titleMap: Record<string,string> = {
        general_teachers:   'الجدول العام للمعلمين',
        general_classes:    'الجدول العام للفصول',
        general_waiting:    'الجدول العام للانتظار',
        individual_teacher: 'جدول المعلم: '+tName(targetId||''),
        individual_class:   'جدول الفصل: ' +cName(targetId||''),
    };
    const isGeneral = type.startsWith('general_');

    /* ════════════════════════════════════════════════════
       CELL renderers
    ════════════════════════════════════════════════════ */
    const renderTeacherCell = (teacherId: string, di: number, pi: number) => {
        const slot = timetable[teacherId+'-'+ENGLISH_DAYS[di]+'-'+(pi+1)];
        if(!slot) return <div className="w-full h-full bg-slate-50/40"/>;
        if(type==='general_waiting'){
            if(slot.type==='waiting'||slot.isSubstitution)
                return (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-0.5 rounded"
                         style={{background:'rgba(101,90,193,0.12)'}}>
                        <span className="font-black text-sm leading-none" style={{color:C_BG}}>م</span>
                        <span className="text-xs font-bold leading-none" style={{color:C_BG}}>انتظار</span>
                    </div>
                );
            return <div className="w-full h-full bg-slate-50/40"/>;
        }
        const subj = subjDisplay(slot.subjectId||'');
        const cls  = cName(slot.classId||'');
        return (
            <div className="w-full h-full flex flex-col items-center justify-center px-1 gap-0.5"
                 title={`${subj}\n${cls}`}>
                <span className="text-xs font-extrabold leading-tight text-center w-full"
                      style={{color:C_BG, wordBreak:'break-word', overflowWrap:'anywhere'}}>{subj}</span>
                <span className="text-[11px] font-medium leading-tight text-center w-full text-slate-500"
                      style={{wordBreak:'break-word', overflowWrap:'anywhere'}}>{cls}</span>
            </div>
        );
    };

    const renderClassCell = (classId: string, di: number, pi: number) => {
        const slot = classSlotMap.get(classId+'-'+ENGLISH_DAYS[di]+'-'+(pi+1));
        if(!slot) return <div className="w-full h-full bg-slate-50/40"/>;
        const subj    = subjDisplay(slot.subjectId||'');
        const teacher = tName(slot.teacherId);
        return (
            <div className="w-full h-full flex flex-col items-center justify-center px-1 gap-0.5"
                 title={`${subj}\n${teacher}`}>
                <span className="text-xs font-extrabold leading-tight text-center w-full"
                      style={{color:C_BG, wordBreak:'break-word', overflowWrap:'anywhere'}}>{subj}</span>
                <span className="text-[11px] font-medium leading-tight text-center w-full text-slate-500"
                      style={{wordBreak:'break-word', overflowWrap:'anywhere'}}>{teacher}</span>
            </div>
        );
    };

    /* ════════════════════════════════════════════════════
       GENERAL TABLE
    ════════════════════════════════════════════════════ */
    const renderGeneralTable = () => {

        const isWaiting  = type==='general_waiting';
        const isClasses  = type==='general_classes';
        const isTeachers = type==='general_teachers';

        interface Row { serial:number; id:string; name:string; spec?:string; quota1?:number; quota2?:number; }
        const rows: Row[] = [];
        if(isClasses){
            getSortedClasses().forEach((c,i)=>rows.push({serial:i+1,id:c.id,name:c.name||(c.grade+'/'+c.section),quota1:classLessonCount.get(c.id)||0}));
        } else {
            const list = isWaiting ? teachersWithWaiting : getSortedTeachers();
            list.forEach((t,i)=>rows.push({serial:i+1,id:t.id,name:t.name,spec:getAbbrSpec(t.specializationId),quota1:isWaiting?tWQ(t):tLQ(t),quota2:isTeachers?tWQ(t):undefined}));
        }

        /* Calculate waiting counts per period (for header) */
        const periodWaitingCounts: number[][] = Array.from({length:ENGLISH_DAYS.length}, () => Array(MAX_PERIODS).fill(0));
        if((isTeachers || isWaiting) && showWaitingCounts){
            teachers.forEach(t => {
                ENGLISH_DAYS.forEach((d, di) => {
                    for(let p=1; p<=MAX_PERIODS; p++){
                         const s = timetable[`${t.id}-${d}-${p}`];
                         if(s && (s.type === 'waiting' || (isWaiting && s.isSubstitution))) {
                             periodWaitingCounts[di][p-1]++;
                         }
                    }
                });
            });
        }

        const ROW_H  = 60; // px per data row

        const thBase  = "border-b font-bold select-none";
        const tdStick = "sticky bg-white font-medium text-sm";
        
        // White cells – strong dark separator after each day's last period
        const periodStyle = (di:number, pi:number) => {
             const isLastPeriod = pi === MAX_PERIODS - 1;
             const hasSeparator = isLastPeriod && di < ENGLISH_DAYS.length - 1;
             return {
                 background: '#ffffff',
                 borderTop:    '1px solid '+C_BORDER,
                 borderBottom: '1px solid '+C_BORDER,
                 borderLeft:  hasSeparator ? '3px solid '+C_DAY_SEP : '1px solid '+C_BORDER,
                 borderRight: '1px solid '+C_BORDER,
             };
        };

        return (
            <div className="w-full relative">
                <div className="flex justify-end mb-2 gap-2 p-1">
                     {(isTeachers || isWaiting) && (
                        <button onClick={()=>setShowWaitingCounts(!showWaitingCounts)} 
                            className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors flex items-center gap-2">
                             <div className={`w-3 h-3 rounded-full ${showWaitingCounts?'bg-[#8e85d6]':'bg-slate-300'}`}></div>
                             {showWaitingCounts ? 'إخفاء عدد حصص الانتظار' : 'إظهار عدد حصص الانتظار'}
                        </button>
                     )}
                </div>
            <div style={{
                border: '2px solid '+C_DAY_SEP,
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 6px 28px rgba(165,155,240,0.22)'
            }}>
            <div className="w-full">
              <table className="border-collapse" style={{borderSpacing:0, width:'100%', tableLayout:'fixed'}}>
                <colgroup>
                    <col style={{width:'3%'}}/>             {/* م */}
                    <col style={{width:'10%'}}/>             {/* name */}
                    {!isClasses && <col style={{width:'7%'}}/>}    {/* spec */}
                    <col style={{width:'4%'}}/>             {/* quota1 */}
                    {isTeachers && <col style={{width:'4%'}}/>}   {/* quota2 */}
                    {ENGLISH_DAYS.flatMap((_,di)=>
                        Array.from({length:MAX_PERIODS}).map((_,pi)=>(
                            <col key={di+'-'+pi}/>
                        ))
                    )}
                </colgroup>

                {/* ─── THEAD ─── */}
                <thead>
                    {/* Row 1: info cols + day names */}
                    <tr>
                        <th rowSpan={2} className={thBase} style={{background:C_BG,color:'#fff',borderRight:'1px solid '+C_BORDER,borderBottom:'2px solid '+C_DAY_SEP}}>م</th>
                        <th rowSpan={2} className={thBase+" text-right pr-2"} style={{background:C_BG,color:'#fff',borderRight:'1px solid '+C_BORDER,borderBottom:'2px solid '+C_DAY_SEP}}>
                            {isClasses?'اسم الفصل':'اسم المعلم'}
                        </th>
                        {!isClasses && (
                            <th rowSpan={2} className={thBase} style={{background:C_BG,color:'#fff',borderRight:'1px solid '+C_BORDER,borderBottom:'2px solid '+C_DAY_SEP}}>التخصص</th>
                        )}
                        <th rowSpan={2} className={thBase+" text-xs leading-tight"}
                            style={{background:C_BG,color:'#fff',borderRight:'2px solid '+C_DAY_SEP,borderBottom:'2px solid '+C_DAY_SEP}}>
                            {isClasses?'الحصص':(isWaiting?'نصاب الانتظار':'نصاب الحصص')}
                        </th>
                        {isTeachers && (
                            <th rowSpan={2} className={thBase+" text-xs leading-tight"} style={{background:C_BG,color:'#fff',borderRight:'1px solid '+C_BORDER,borderBottom:'2px solid '+C_DAY_SEP}}>نصاب الانتظار</th>
                        )}
                        {ARABIC_DAYS.map((day,di)=>(
                            <th key={day} colSpan={MAX_PERIODS} className={thBase+" text-base py-2 text-center"}
                                style={{
                                    background: C_BG,
                                    color: '#ffffff',
                                    borderBottom: '0',
                                    borderLeft:  di < ARABIC_DAYS.length-1 ? '3px solid '+C_DAY_SEP : '1px solid '+C_BORDER,
                                    borderRight: '1px solid '+C_BORDER,
                                }}>
                                {day}
                            </th>
                        ))}
                    </tr>
                    {/* Row 2: period numbers */}
                    <tr>
                        {ENGLISH_DAYS.flatMap((_,di)=>
                            Array.from({length:MAX_PERIODS}).map((_,pi)=>(
                                <th key={di+'-'+pi}
                                    className="text-center font-bold text-xs py-1 relative group"
                                    style={{
                                        background: C_BG_SOFT,
                                        color: '#64748b',
                                        borderBottom: '2px solid '+C_DAY_SEP,
                                        borderTop: '1px solid '+C_BORDER,
                                        borderLeft:  (pi===MAX_PERIODS-1 && di < ENGLISH_DAYS.length-1) ? '3px solid '+C_DAY_SEP : '1px solid '+C_BORDER,
                                        borderRight: '1px solid '+C_BORDER,
                                    }}>
                                    <span>{pi+1}</span>
                                    {showWaitingCounts && (isTeachers || isWaiting) && periodWaitingCounts[di][pi] > 0 && (
                                        <div className="absolute top-0 right-0 -mt-2 -mr-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center shadow-sm z-10 border border-white">
                                            {periodWaitingCounts[di][pi]}
                                        </div>
                                    )}
                                </th>
                            ))
                        )}
                    </tr>
                </thead>

                {/* ─── TBODY ─── */}
                <tbody>
                    {rows.length===0 ? (
                        <tr><td colSpan={999} className="text-center p-10 text-slate-400 text-base font-medium">
                            لا توجد بيانات — قم بإنشاء الجدول أولاً
                        </td></tr>
                    ) : rows.map((row,idx)=>{
                        const rowBg = '#ffffff';
                        return (
                            <tr key={row.id} style={{minHeight:ROW_H+'px',background:rowBg}}>
                                {/* serial */}
                                <td className="text-center text-slate-500 text-xs font-bold"
                                    style={{background:rowBg,borderTop:'1px solid '+C_BORDER,borderBottom:'1px solid '+C_BORDER,borderRight:'1px solid '+C_BORDER}}>
                                    {row.serial}
                                </td>
                                {/* name */}
                                <td className="text-right pr-2 text-slate-800 font-bold"
                                    style={{background:rowBg,borderTop:'1px solid '+C_BORDER,borderBottom:'1px solid '+C_BORDER,borderRight:'1px solid '+C_BORDER}}
                                    title={row.name}>
                                    <span className="block truncate text-sm">{row.name}</span>
                                </td>
                                {/* spec */}
                                {!isClasses && (
                                    <td className="text-center text-slate-600 text-xs"
                                        style={{background:rowBg,borderTop:'1px solid '+C_BORDER,borderBottom:'1px solid '+C_BORDER,borderRight:'1px solid '+C_BORDER}}
                                        title={row.spec}>
                                        <span className="block truncate px-1">{row.spec}</span>
                                    </td>
                                )}
                                {/* quota1 */}
                                <td className="text-center font-bold text-sm"
                                    style={{color:'#64748b',background:rowBg,
                                        borderTop:'1px solid '+C_BORDER,borderBottom:'1px solid '+C_BORDER,borderRight:'2px solid '+C_DAY_SEP}}>
                                    {row.quota1}
                                </td>
                                {/* quota2 (teachers only) */}
                                {isTeachers && (
                                    <td className="text-center font-bold text-sm"
                                        style={{color:'#64748b',background:rowBg,
                                            borderTop:'1px solid '+C_BORDER,borderBottom:'1px solid '+C_BORDER,borderRight:'1px solid '+C_BORDER}}>
                                        {row.quota2}
                                    </td>
                                )}
                                {/* period cells */}
                                {ENGLISH_DAYS.flatMap((_,di)=>
                                    Array.from({length:MAX_PERIODS}).map((_,pi)=>(
                                        <td key={di+'-'+pi}
                                            className="relative"
                                            style={{
                                                height:ROW_H+'px',
                                                padding:'4px 2px',
                                                verticalAlign:'middle',
                                                borderTop:'1px solid #e2e8f0',
                                                borderBottom:'1px solid #e2e8f0',
                                                ...periodStyle(di, pi)
                                            }}>
                                            {isClasses ? renderClassCell(row.id,di,pi) : renderTeacherCell(row.id,di,pi)}
                                        </td>
                                    ))
                                )}
                            </tr>
                        );
                    })}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        );
    };

    /* ════════════════════════════════════════════════════
       INDIVIDUAL TABLE (teacher / class)
    ════════════════════════════════════════════════════ */
    const renderIndividualTable = () => {
        const isTeacher = type==='individual_teacher';
        const teacher = isTeacher ? teachers.find(t=>t.id===targetId) : null;
        const cls     = !isTeacher ? classes.find(c=>c.id===targetId) : null;

        return (
            <div className="w-full max-w-4xl mx-auto" style={{direction:'rtl'}}>

                {/* ── Info strip ── */}
                <div className="rounded-t-lg px-5 py-3 flex items-center gap-6 flex-wrap"
                    style={{background:C_BG, borderTop:'1.5px solid '+C_DAY_SEP, borderRight:'1.5px solid '+C_DAY_SEP, borderLeft:'1.5px solid '+C_DAY_SEP}}>
                    {isTeacher && teacher ? <>
                        <div className="flex items-baseline gap-2">
                            <span className="text-white/60 text-xs font-semibold">اسم المعلم</span>
                            <span className="text-white font-black text-lg">{teacher.name}</span>
                        </div>
                        <div className="w-px self-stretch bg-white/20"/>
                        <div className="flex items-baseline gap-2">
                            <span className="text-white/60 text-xs font-semibold">التخصص</span>
                            <span className="text-white font-bold text-sm">{specializationNames[teacher.specializationId]||'—'}</span>
                        </div>
                        <div className="flex-1"/>
                        <div className="flex items-center gap-4">
                            <div className="text-center">
                                <div className="text-white/60 text-[10px] font-semibold leading-none mb-0.5">نصاب الحصص</div>
                                <div className="text-white font-black text-xl leading-none">{tLQ(teacher)}</div>
                            </div>
                            <div className="w-px self-stretch bg-white/20"/>
                            <div className="text-center">
                                <div className="text-white/60 text-[10px] font-semibold leading-none mb-0.5">نصاب الانتظار</div>
                                <div className="text-white font-black text-xl leading-none">{tWQ(teacher)}</div>
                            </div>
                        </div>
                    </> : cls ? <>
                        <div className="flex items-baseline gap-2">
                            <span className="text-white/60 text-xs font-semibold">اسم الفصل</span>
                            <span className="text-white font-black text-lg">{cls.name||(cls.grade+'/'+cls.section)}</span>
                        </div>
                        <div className="flex-1"/>
                        <div className="text-center">
                            <div className="text-white/60 text-[10px] font-semibold leading-none mb-0.5">عدد الحصص</div>
                            <div className="text-white font-black text-xl leading-none">{classLessonCount.get(cls.id)||0}</div>
                        </div>
                    </> : null}
                </div>

                {/* ── Table ── */}
                <div className="overflow-x-auto rounded-b-lg" style={{border:'1.5px solid '+C_DAY_SEP, borderTop:'2px solid '+C_DAY_SEP}}>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr>
                                <th className="px-4 py-2.5 font-bold text-white text-sm text-center"
                                    style={{minWidth:'90px', background:C_BG, borderBottom:'2px solid '+C_DAY_SEP, borderRight:'2px solid '+C_DAY_SEP}}>
                                    اليوم
                                </th>
                                {Array.from({length:MAX_PERIODS}).map((_,i)=>(
                                    <th key={i} className="py-2.5 font-bold text-sm text-center"
                                        style={{minWidth:'100px', background:C_BG_SOFT, color:'#64748b',
                                            borderBottom:'2px solid '+C_DAY_SEP, borderLeft:'1px solid '+C_BORDER}}>
                                        {i+1}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {ARABIC_DAYS.map((day,di)=>(
                                <tr key={day} style={{borderBottom:'1px solid '+C_BORDER}}>
                                    <td className="px-4 py-0 font-black text-sm text-center"
                                        style={{minWidth:'90px', background:C_BG_SOFT, color:C_BG,
                                            borderRight:'2px solid '+C_DAY_SEP, height:'68px'}}>
                                        {day}
                                    </td>
                                    {Array.from({length:MAX_PERIODS}).map((_,pi)=>(
                                        <td key={pi} className="relative align-middle p-0"
                                            style={{height:'68px', minWidth:'100px', background:'#fff', borderLeft:'1px solid '+C_BORDER}}>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                {isTeacher ? (() => {
                                                    const slot = timetable[targetId+'-'+ENGLISH_DAYS[di]+'-'+(pi+1)];
                                                    if(!slot) return null;
                                                    const iw = slot.type==='waiting'||slot.isSubstitution;
                                                    return (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-1 gap-0.5">
                                                            <span className="font-black text-sm leading-tight text-center" style={{color:C_BG}}>{cName(slot.classId||'')}</span>
                                                            <span className="text-[11px] font-semibold text-slate-500 leading-tight text-center">{subjName(slot.subjectId||'')}</span>
                                                            {iw && <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full mt-0.5" style={{background:C_BG_SOFT, color:C_BG}}>انتظار</span>}
                                                        </div>
                                                    );
                                                })() : (() => {
                                                    const slot = classSlotMap.get(targetId+'-'+ENGLISH_DAYS[di]+'-'+(pi+1));
                                                    if(!slot) return null;
                                                    return (
                                                        <div className="w-full h-full flex flex-col items-center justify-center p-1 gap-0.5">
                                                            <span className="font-black text-sm leading-tight text-center" style={{color:C_BG}}>{subjName(slot.subjectId||'')}</span>
                                                            <span className="text-[11px] font-semibold text-slate-500 leading-tight text-center">{tName(slot.teacherId)}</span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    /* ════════════════════════════════════════════════════
       WRAPPER
    ════════════════════════════════════════════════════ */
    // Helper to close full screen
    const handleCloseFullScreen = () => setIsFullScreen(false);

    // If full screen, we render slightly differently to accommodate the "Back" button nicely
    if (isFullScreen && isGeneral) {
        return (
             <div className="fixed inset-0 z-[200] bg-slate-100 items-start justify-center overflow-auto p-4" style={{direction:'rtl'}}>
                <div className="bg-white rounded-xl shadow-2xl min-h-full p-4 relative">
                    {/* Full Screen Header */}
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <h2 className="text-2xl font-black text-slate-800">{titleMap[type]}</h2>
                        <button 
                            onClick={handleCloseFullScreen}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-bold transition-colors">
                            <Minimize2 size={18}/>
                            <span>رجوع</span>
                        </button>
                    </div>
                    
                    {/* Render Table */}
                    {renderGeneralTable()}
                </div>
             </div>
        );
    }

    return (
        <div className="bg-white font-sans w-full relative p-2" style={{direction:'rtl'}}>
            {/* Preview mode controls */}
            <div className="mb-3 flex items-center gap-2 flex-wrap">
                {!isPreviewMode && (
                    <button onClick={()=>setIsPreviewMode(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                        style={{background:'#f4f2ff', color:C_BG, border:'1.5px dashed '+C_BG}}>
                        <span style={{fontSize:'16px'}}>👁</span>
                        معاينة التصميم ببيانات تجريبية
                    </button>
                )}
                {isPreviewMode && (
                    <div className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-bold"
                         style={{background:'#fef9c3', color:'#92400e', border:'1.5px dashed #fbbf24'}}>
                        <span style={{fontSize:'16px'}}>👁</span>
                        <span>بيانات تجريبية — للمعاينة فقط</span>
                        <button onClick={()=>setIsPreviewMode(false)}
                            className="mr-2 px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-200 hover:bg-amber-300 text-amber-900 transition-colors">
                            إخفاء
                        </button>
                    </div>
                )}
            </div>
            {/* Inline Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="text-right">
                    <h2 className="text-lg font-black text-slate-800">{titleMap[type]}</h2>
                </div>
                {isGeneral && (
                    <button onClick={()=>setIsFullScreen(true)}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                        title="ملء الشاشة">
                        <Maximize2 size={20}/>
                    </button>
                )}
            </div>
            {/* Table */}
            {isGeneral ? renderGeneralTable() : renderIndividualTable()}
        </div>
    );
};

export default InlineScheduleView;

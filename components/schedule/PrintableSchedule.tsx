import React from 'react';
import { ScheduleSettingsData, Teacher, ClassInfo, Subject, SchoolInfo, TimetableSlot } from '../../types';

interface PrintableScheduleProps {
    type: 'general_teachers' | 'general_classes' | 'individual_teacher' | 'individual_class' | 'general_waiting';
    settings: ScheduleSettingsData;
    teachers: Teacher[];
    classes: ClassInfo[];
    subjects: Subject[];
    targetId?: string;
    schoolInfo: SchoolInfo;
    onClose: () => void;
}

const DAYS = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
const MAX_PERIODS = 8;

const PrintableSchedule: React.FC<PrintableScheduleProps> = ({
    type, settings, teachers, classes, subjects, targetId, schoolInfo
}) => {
    const subjectName  = (id: string) => settings.subjectAbbreviations?.[id] || subjects.find(s => s.id === id)?.name || '';
    const teacherName  = (id: string) => teachers.find(t => t.id === id)?.name || '';
    const className    = (id: string) => { const c = classes.find(cl => cl.id === id); return c ? (c.name || `${c.grade}/${c.section}`) : ''; };

    // ── School meta ──────────────────────────────────────────
    const schoolName      = schoolInfo.schoolName || '';
    const principal       = schoolInfo.principal  || '';
    const currentSemester = schoolInfo.semesters?.find(s => s.id === schoolInfo.currentSemesterId) || schoolInfo.semesters?.[0];
    const academicYear    = schoolInfo.academicYear || '';
    const semesterName    = currentSemester?.name || '';
    const calendarType    = currentSemester?.calendarType || 'hijri';

    const printDate = calendarType === 'hijri'
        ? new Intl.DateTimeFormat('ar-SA-u-ca-islamic', { dateStyle: 'long' }).format(new Date())
        : new Intl.DateTimeFormat('ar-EG', { dateStyle: 'long' }).format(new Date());

    // ── Lookup helpers using timetable key format: "teacherId-day-period" ──
    const { timetable } = settings;

    const getTeacherSlot   = (teacherId: string, day: string, period: number): TimetableSlot | undefined => 
        (timetable as Record<string, TimetableSlot>)?.[`${teacherId}-${day}-${period}`];

    const classIndex: Record<string, TimetableSlot> = {};
    if (timetable) {
        Object.entries(timetable as Record<string, TimetableSlot>).forEach(([key, slot]: [string, TimetableSlot]) => {
            const parts = key.split('-');
            const period = parseInt(parts[parts.length - 1]);
            const day    = parts.slice(1, parts.length - 1).join('-');
            if (slot.classId) {
                classIndex[`${slot.classId}-${day}-${period}`] = slot;
            }
        });
    }

    // ── Cell renderer ────────────────────────────────────────
    const renderCell = (day: string, period: number, rowId: string) => {
        if (!timetable) return null;

        if (type === 'general_teachers') {
            const slot = getTeacherSlot(rowId, day, period);
            if (!slot) return null;
            return (
                <div className="text-center">
                    <div className="font-bold text-[10px] break-words">{className(slot.classId || '')}</div>
                    <div className="text-[9px] text-gray-600">{subjectName(slot.subjectId || '')}</div>
                </div>
            );
        }
        if (type === 'general_classes') {
            const slot = classIndex[`${rowId}-${day}-${period}`];
            if (!slot) return null;
            return (
                <div className="text-center">
                    <div className="font-bold text-[10px] truncate">{subjectName(slot.subjectId || '')}</div>
                    <div className="text-[9px] text-gray-600 break-words">{teacherName(slot.teacherId)}</div>
                </div>
            );
        }
        if (type === 'general_waiting') {
            const slot = getTeacherSlot(rowId, day, period);
            if (!slot) return null;
            if (slot.isSubstitution) {
                return (
                    <div className="text-center bg-gray-100 h-full w-full flex flex-col justify-center items-center">
                        <div className="font-bold text-[10px] text-gray-800">انتظار</div>
                        <div className="text-[9px] font-black text-gray-600">{className(slot.classId || '')}</div>
                    </div>
                );
            }
            return null;
        }
        if (type === 'individual_teacher' && rowId === targetId) {
            const slot = getTeacherSlot(rowId, day, period);
            if (!slot) return null;
            return (
                <div className={`text-center h-full w-full flex flex-col justify-center items-center ${slot.isSubstitution ? 'bg-gray-100' : ''}`}>
                    <div className="font-bold text-sm text-gray-800 break-words mb-1">{className(slot.classId || '')}</div>
                    <div className="text-[11px] text-gray-600">
                        {subjectName(slot.subjectId || '')}
                        {slot.isSubstitution && <span className="text-gray-500 block text-[9px]">(انتظار)</span>}
                    </div>
                </div>
            );
        }
        if (type === 'individual_class' && rowId === targetId) {
            const slot = classIndex[`${rowId}-${day}-${period}`];
            if (!slot) return null;
            return (
                <div className="text-center h-full w-full flex flex-col justify-center items-center">
                    <div className="font-bold text-sm text-gray-800 break-words mb-1">{subjectName(slot.subjectId || '')}</div>
                    <div className="text-[11px] text-gray-600">{teacherName(slot.teacherId)}</div>
                </div>
            );
        }
        return null;
    };

    // ── Rows ─────────────────────────────────────────────────
    let rowsToRender: Array<{ id: string; name: string }> = [];
    if (type === 'general_classes') {
        rowsToRender = [...classes]
            .sort((a, b) => a.grade !== b.grade ? a.grade - b.grade : (a.section || 0) - (b.section || 0))
            .map(c => ({ id: c.id, name: c.name || `${c.grade}/${c.section}` }));
    } else if (type === 'general_teachers' || type === 'general_waiting') {
        rowsToRender = [...teachers].sort((a, b) => a.name.localeCompare(b.name, 'ar')).map(t => ({ id: t.id, name: t.name }));
    } else if (type === 'individual_teacher') {
        const t = teachers.find(t => t.id === targetId);
        if (t) rowsToRender = [{ id: t.id, name: t.name }];
    } else if (type === 'individual_class') {
        const c = classes.find(c => c.id === targetId);
        if (c) rowsToRender = [{ id: c.id, name: c.name || `${c.grade}/${c.section}` }];
    }

    const isIndividual = type === 'individual_teacher' || type === 'individual_class';
    const titleMap: Record<string, string> = {
        general_teachers:   'الجدول العام للمعلمين',
        general_classes:    'الجدول العام للفصول',
        general_waiting:    'الجدول العام للانتظار',
        individual_teacher: `جدول المعلم: ${teacherName(targetId || '')}`,
        individual_class:   `جدول الفصل: ${className(targetId || '')}`,
    };

    return (
        <div className="bg-white text-black font-sans" style={{ direction: 'rtl' }}>

            {/* ── Page Header ── */}
            <div className="text-center mb-4 pb-3 border-b-2 border-gray-400">
                {schoolName && (
                    <h1 className="text-xl font-black mb-1">{schoolName}</h1>
                )}
                {(academicYear || semesterName) && (
                    <p className="text-sm text-gray-600 font-bold">
                        {academicYear && `العام الدراسي: ${academicYear}`}
                        {academicYear && semesterName && ' | '}
                        {semesterName && `الفصل: ${semesterName}`}
                    </p>
                )}
                <h2 className="text-lg font-black mt-2">{titleMap[type]}</h2>
            </div>

            {/* ── Table ── */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-400 text-sm table-fixed">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-400 p-2 w-32 font-bold max-w-[120px]">
                                {type === 'general_classes' ? 'الفصل' : 'المعلم'}
                            </th>
                            {DAYS.map(day => (
                                <th key={day} colSpan={MAX_PERIODS} className="border border-gray-400 p-1 font-bold text-center">
                                    {day}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-gray-50 text-[10px]">
                            <th className="border border-gray-400 p-1 bg-gray-100 font-bold">الحصص ←</th>
                            {DAYS.map(day =>
                                Array.from({ length: MAX_PERIODS }).map((_, i) => (
                                    <th key={`${day}-${i}`} className="border border-gray-400 p-1 w-10 text-center text-gray-600">
                                        {i + 1}
                                    </th>
                                ))
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rowsToRender.map(row => (
                            <tr key={row.id} className="border-b border-gray-400">
                                <td
                                    className={`border border-gray-400 p-2 font-bold truncate ${isIndividual ? 'text-sm' : 'text-[11px] w-32'} max-w-[120px]`}
                                    title={row.name}
                                >
                                    {row.name}
                                </td>
                                {DAYS.map(day =>
                                    Array.from({ length: MAX_PERIODS }).map((_, i) => (
                                        <td
                                            key={`${day}-${i}`}
                                            className={`border border-gray-400 p-0 ${isIndividual ? 'h-24 w-24' : 'h-10 w-10'} overflow-hidden relative align-middle`}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center p-0.5">
                                                {renderCell(day, i + 1, row.id)}
                                            </div>
                                        </td>
                                    ))
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Page Footer ── */}
            <div className="flex justify-between items-end mt-10 text-sm text-gray-700 font-bold px-2">
                {/* Left: principal signature */}
                <div className="text-right">
                    <div className="mb-2">اعتماد مدير المدرسة{principal ? `: ${principal}` : ''}</div>
                    <div className="border-t border-gray-400 pt-2 w-40 text-xs text-gray-400 text-center">التوقيع</div>
                </div>
                {/* Right: print date */}
                <div className="text-xs text-gray-500">تاريخ الطباعة: {printDate}</div>
            </div>
        </div>
    );
};

export default PrintableSchedule;

import React from 'react';
import { ScheduleSettingsData, Teacher, ClassInfo, Subject } from '../../types';

export type TeacherSortMode = 'alpha' | 'specialization' | 'custom';

interface InlineScheduleViewProps {
    type: 'general_teachers' | 'general_classes' | 'individual_teacher' | 'individual_class' | 'general_waiting';
    settings: ScheduleSettingsData;
    teachers: Teacher[];
    classes: ClassInfo[];
    subjects: Subject[];
    targetId?: string;
    // Sorting
    teacherSortMode?: TeacherSortMode;
    teacherCustomOrder?: string[]; // teacher IDs in desired order
    specializationNames?: Record<string, string>; // specializationId -> name
}

const InlineScheduleView: React.FC<InlineScheduleViewProps> = ({
    type, settings, teachers, classes, subjects, targetId,
    teacherSortMode = 'alpha',
    teacherCustomOrder = [],
    specializationNames = {}
}) => {
    const getSubjectAttr = (id: string, prop: keyof Subject) => subjects.find(s => s.id === id)?.[prop] || '';
    const getTeacherAttr = (id: string, prop: keyof Teacher) => teachers.find(t => t.id === id)?.[prop] || '';
    const getClassAttr = (id: string, prop: keyof ClassInfo) => classes.find(c => c.id === id)?.[prop] || '';

    // ── Sort teachers ──────────────────────────────────────────
    const getSortedTeachers = (): Teacher[] => {
        const list = [...teachers];
        if (teacherSortMode === 'alpha') {
            return list.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        }
        if (teacherSortMode === 'specialization') {
            return list.sort((a, b) => {
                const specA = specializationNames[a.specializationId] || a.specializationId || '';
                const specB = specializationNames[b.specializationId] || b.specializationId || '';
                const specCompare = specA.localeCompare(specB, 'ar');
                if (specCompare !== 0) return specCompare;
                return a.name.localeCompare(b.name, 'ar');
            });
        }
        if (teacherSortMode === 'custom' && teacherCustomOrder.length > 0) {
            const orderMap = new Map(teacherCustomOrder.map((id, i) => [id, i]));
            return list.sort((a, b) => {
                const ia = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
                const ib = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
                return ia - ib;
            });
        }
        return list;
    };

    // ── Sort classes: by grade ASC, then section ASC ───────────
    const getSortedClasses = (): ClassInfo[] => {
        return [...classes].sort((a, b) => {
            if (a.grade !== b.grade) return a.grade - b.grade;
            return (a.section || 0) - (b.section || 0);
        });
    };

    const renderCell = (dayIndex: number, periodIndex: number, rowId: string) => {
        const { timetable } = settings;
        if (!timetable) return null;

        if (type === 'general_teachers') {
            const slotKey = Object.keys(timetable).find(k => {
                const slot = timetable[k];
                return slot.teacherId === rowId && slot.dayId === dayIndex && slot.periodId === periodIndex;
            });
            if (slotKey) {
                const slot = timetable[slotKey];
                return (
                    <div className="text-center">
                        <div className="font-bold text-[10px] break-words">{getClassAttr(slot.classId || '', 'name')}</div>
                        <div className="text-[9px] text-gray-600">{settings.subjectAbbreviations?.[slot.subjectId || ''] || getSubjectAttr(slot.subjectId || '', 'name')}</div>
                    </div>
                );
            }
        } else if (type === 'general_classes') {
            const slotKey = Object.keys(timetable).find(k => {
                const slot = timetable[k];
                return slot.classId === rowId && slot.dayId === dayIndex && slot.periodId === periodIndex;
            });
            if (slotKey) {
                const slot = timetable[slotKey];
                return (
                    <div className="text-center">
                        <div className="font-bold text-[10px] truncate">{settings.subjectAbbreviations?.[slot.subjectId || ''] || getSubjectAttr(slot.subjectId || '', 'name')}</div>
                        <div className="text-[9px] text-gray-600 break-words">{getTeacherAttr(slot.teacherId, 'name')}</div>
                    </div>
                );
            }
        } else if (type === 'general_waiting') {
            const slotKey = Object.keys(timetable).find(k => {
                const slot = timetable[k];
                return slot.teacherId === rowId && slot.dayId === dayIndex && slot.periodId === periodIndex;
            });
            if (slotKey) {
                const slot = timetable[slotKey];
                if (slot.isSubstitution) {
                    return (
                        <div className="text-center bg-[#e5e1fe]/60 h-full w-full flex flex-col justify-center items-center">
                            <div className="font-bold text-[10px] text-[#655ac1] break-words">انتظار</div>
                            <div className="text-[9px] font-black text-[#655ac1]">{getClassAttr(slot.classId || '', 'name')}</div>
                        </div>
                    );
                }
                return <div className="text-center text-slate-200 text-[10px]">—</div>;
            }
        } else if (type === 'individual_teacher' && rowId === targetId) {
            const slotKey = Object.keys(timetable).find(k => {
                const slot = timetable[k];
                return slot.teacherId === rowId && slot.dayId === dayIndex && slot.periodId === periodIndex;
            });
            if (slotKey) {
                const slot = timetable[slotKey];
                return (
                    <div className={`text-center h-full w-full flex flex-col justify-center items-center ${slot.isSubstitution ? 'bg-[#e5e1fe]/40' : ''}`}>
                        <div className="font-bold text-sm text-gray-800 break-words mb-1">{getClassAttr(slot.classId || '', 'name')}</div>
                        <div className="text-[11px] text-gray-600">
                            {getSubjectAttr(slot.subjectId || '', 'name')}
                            {slot.isSubstitution && <span className="text-[#655ac1] block text-[9px] mt-0.5">(انتظار)</span>}
                        </div>
                    </div>
                );
            }
        } else if (type === 'individual_class' && rowId === targetId) {
            const slotKey = Object.keys(timetable).find(k => {
                const slot = timetable[k];
                return slot.classId === rowId && slot.dayId === dayIndex && slot.periodId === periodIndex;
            });
            if (slotKey) {
                const slot = timetable[slotKey];
                return (
                    <div className="text-center h-full w-full flex flex-col justify-center items-center">
                        <div className="font-bold text-sm text-gray-800 break-words mb-1">{getSubjectAttr(slot.subjectId || '', 'name')}</div>
                        <div className="text-[11px] text-gray-600">{getTeacherAttr(slot.teacherId, 'name')}</div>
                    </div>
                );
            }
        }
        return null;
    };

    const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];
    const maxPeriods = 8;

    let rowsToRender: Array<{ id: string; name: string; extra?: string }> = [];
    if (type === 'general_classes') {
        rowsToRender = getSortedClasses().map(c => ({ id: c.id, name: c.name || `${c.grade}/${c.section}` }));
    } else if (type === 'general_teachers' || type === 'general_waiting') {
        const sorted = getSortedTeachers();
        rowsToRender = sorted.map(t => ({
            id: t.id,
            name: t.name,
            extra: specializationNames[t.specializationId] || ''
        }));
    } else if (type === 'individual_teacher') {
        const teacher = teachers.find(t => t.id === targetId);
        if (teacher) rowsToRender = [{ id: teacher.id, name: teacher.name }];
    } else if (type === 'individual_class') {
        const classInfo = classes.find(c => c.id === targetId);
        if (classInfo) rowsToRender = [{ id: classInfo.id, name: classInfo.name || `${classInfo.grade}/${classInfo.section}` }];
    }

    const isIndividual = type === 'individual_teacher' || type === 'individual_class';
    const showSpecCol = (type === 'general_teachers' || type === 'general_waiting') && teacherSortMode === 'specialization';

    const titleMap: Record<string, string> = {
        general_teachers: 'الجدول العام للمعلمين',
        general_classes: 'الجدول العام للفصول',
        general_waiting: 'الجدول العام للانتظار',
        individual_teacher: `جدول المعلم: ${getTeacherAttr(targetId || '', 'name')}`,
        individual_class: `جدول الفصل: ${getClassAttr(targetId || '', 'name')}`,
    };

    return (
        <div className="bg-white text-black rtl font-sans" style={{ direction: 'rtl' }}>
            <div className="text-center mb-4">
                <h2 className="text-xl font-black text-slate-800 mb-1">{titleMap[type]}</h2>
                <p className="text-xs text-slate-400">نظام المتابع الذكي</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-slate-300 text-sm table-fixed">
                    <thead>
                        <tr className="bg-[#e5e1fe]/50">
                            <th className="border border-slate-300 p-2 w-32 font-bold text-[#655ac1]">
                                {type === 'general_classes' ? 'الفصل' : 'المعلم'}
                            </th>
                            {showSpecCol && (
                                <th className="border border-slate-300 p-2 w-24 font-bold text-[#655ac1]">التخصص</th>
                            )}
                            {days.map(day => (
                                <th key={day} colSpan={maxPeriods} className="border border-slate-300 p-1 font-bold text-center text-slate-700">
                                    {day}
                                </th>
                            ))}
                        </tr>
                        <tr className="bg-slate-50 text-[10px]">
                            <th className="border border-slate-300 p-1 font-bold bg-[#e5e1fe]/30 text-[#655ac1]">الحصص ←</th>
                            {showSpecCol && <th className="border border-slate-300 p-1 bg-[#e5e1fe]/30" />}
                            {days.map(day =>
                                Array.from({ length: maxPeriods }).map((_, i) => (
                                    <th key={`${day}-${i}`} className="border border-slate-300 p-1 w-10 text-center text-slate-500">
                                        {i + 1}
                                    </th>
                                ))
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rowsToRender.map(rowEntity => (
                            <tr key={rowEntity.id} className="hover:bg-slate-50/60 border-b border-slate-300">
                                <td
                                    className={`border border-slate-300 p-2 font-bold truncate ${isIndividual ? 'text-sm' : 'text-[11px] w-32'} max-w-[120px] text-slate-700`}
                                    title={rowEntity.name}
                                >
                                    {rowEntity.name}
                                </td>
                                {showSpecCol && (
                                    <td className="border border-slate-300 p-1 text-[10px] text-slate-500 text-center w-24">
                                        {rowEntity.extra || '—'}
                                    </td>
                                )}
                                {days.map((_, dayIndex) =>
                                    Array.from({ length: maxPeriods }).map((_, periodIndex) => (
                                        <td
                                            key={`${dayIndex}-${periodIndex}`}
                                            className={`border border-slate-300 p-0 ${isIndividual ? 'h-20 w-20' : 'h-10 w-10'} overflow-hidden relative align-middle`}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center p-0.5">
                                                {renderCell(dayIndex, periodIndex, rowEntity.id)}
                                            </div>
                                        </td>
                                    ))
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InlineScheduleView;

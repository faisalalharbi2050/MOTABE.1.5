
import React from 'react';
import { Teacher, Subject, ClassInfo, Assignment, Specialization, SchoolInfo } from '../types';
import { Printer, Download, FileText, School, Calendar, CheckSquare, Layers } from 'lucide-react';

interface Props {
  schoolInfo: SchoolInfo;
  teachers: Teacher[];
  subjects: Subject[];
  classes: ClassInfo[];
  assignments: Assignment[];
  specializations: Specialization[];
  onClose?: () => void;
}

const AssignmentReport: React.FC<Props> = ({ schoolInfo, teachers, subjects, classes, assignments, specializations, onClose }) => {
  const getTeacherAssignments = (tId: string) => assignments.filter(a => a.teacherId === tId);
  const getTeacherTotalQuota = (tId: string) => getTeacherAssignments(tId).reduce((total, a) => {
    const sub = subjects.find(s => s.id === a.subjectId);
    return total + (sub?.periodsPerClass || 0);
  }, 0);

  const handlePrint = () => window.print();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-800">تقرير إسناد المواد</h2>
          <p className="text-slate-400">عرض وتحميل التقرير النهائي للإسناد الدراسي.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-[#655ac1] text-white rounded-2xl hover:bg-[#5246a4] transition-all font-bold shadow-lg shadow-[#655ac1]/20">
            <Printer size={20} /> طباعة التقرير
          </button>
          {onClose && (
            <button onClick={onClose} className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all font-bold">
               عودة
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-50/50 p-10">
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-primary pb-8 mb-8">
           <div className="space-y-1 font-bold text-slate-800 text-sm">
              <p>المملكة العربية السعودية</p>
              <p>وزارة التعليم</p>
              <p>{schoolInfo.region || 'إدارة التعليم بالمنطقة'}</p>
              <p>مدرسة {schoolInfo.schoolName || '..........'}</p>
           </div>
           <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2"><School size={30} className="text-primary" /></div>
              <h1 className="text-xl font-black text-primary">تقرير إسناد المواد</h1>
              {schoolInfo.mergeTeachers && (
                  <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-black px-2 py-0.5 bg-emerald-50 rounded-lg">
                      <Layers size={12}/> (هيئة تعليمية مشتركة)
                  </div>
              )}
           </div>
           <div className="space-y-1 font-bold text-slate-800 text-sm text-left">
              <p className="flex items-center justify-end gap-2">التاريخ: {new Date().toLocaleDateString('ar-SA')} <Calendar size={14}/></p>
              <p>المرحلة: {schoolInfo.phase} {schoolInfo.hasSecondSchool ? `+ ${schoolInfo.secondSchoolPhase}` : ''}</p>
              {schoolInfo.hasSecondSchool && <p className="text-[10px] text-primary">المبنى: {schoolInfo.secondSchoolName}</p>}
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs">
            <thead>
              <tr className="bg-primary text-white">
                <th className="p-4 border border-primary/20">م</th>
                <th className="p-4 border border-primary/20">اسم المعلم</th>
                <th className="p-4 border border-primary/20">التخصص</th>
                <th className="p-4 border border-primary/20">المواد المسندة</th>
                <th className="p-4 border border-primary/20">الفصول</th>
                <th className="p-4 border border-primary/20">النصاب</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teachers.map((teacher, index) => {
                const teacherAssns = getTeacherAssignments(teacher.id);
                const subNames = Array.from(new Set(teacherAssns.map(a => subjects.find(s => s.id === a.subjectId)?.name))).join(' - ');
                const load = getTeacherTotalQuota(teacher.id);
                return (
                  <tr key={teacher.id} className="hover:bg-slate-50 transition-colors odd:bg-slate-50/30">
                    <td className="p-4 border border-slate-100 font-bold">{index + 1}</td>
                    <td className="p-4 border border-slate-100 font-black text-slate-800">{teacher.name}</td>
                    <td className="p-4 border border-slate-100 font-bold text-slate-600">{specializations.find(s => s.id === teacher.specializationId)?.name || '-'}</td>
                    <td className="p-4 border border-slate-100 text-slate-500">{subNames || '-'}</td>
                    <td className="p-4 border border-slate-100">
                      <div className="flex flex-wrap gap-1">
                        {teacherAssns.map(a => {
                          const cls = classes.find(c => c.id === a.classId);
                          return <span key={a.classId+a.subjectId} className="px-1.5 py-0.5 bg-accent text-primary rounded text-[9px] font-black">{cls?.grade}/{cls?.section}</span>;
                        })}
                      </div>
                    </td>
                    <td className="p-4 border border-slate-100 text-center font-black">{load} / {teacher.quotaLimit}</td>
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

export default AssignmentReport;

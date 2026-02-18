import React, { useState, useMemo, useEffect } from 'react';
import { Phase, Subject, SchoolInfo } from '../../../types';
import { DETAILED_TEMPLATES } from '../../../constants';
import { STUDY_PLANS_CONFIG } from '../../../study_plans_config';
import {
  Plus, Trash2, Printer, Search, Eye, Download, Info, School, Building, GraduationCap, BookOpen, Layers, CheckCircle2, X, Edit2, Check, Copy, List, Sparkles, ArrowRight, Table, Grid
} from 'lucide-react';
import { GradeDetailsModal } from './GradeDetailsModal';
import SchoolTabs from '../SchoolTabs';
import StudyPlansModal from '../StudyPlansModal';

interface Props {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  schoolInfo: SchoolInfo;
  gradeSubjectMap: Record<string, string[]>;
  setGradeSubjectMap: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

const Step3Subjects: React.FC<Props> = ({ subjects, setSubjects, schoolInfo, gradeSubjectMap, setGradeSubjectMap }) => {
  const [activeSchoolId, setActiveSchoolId] = useState<string>('main');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  
  // Grade Details Modal State
  const [viewingGradeDetails, setViewingGradeDetails] = useState<{
      gradeKey: string;
      gradeName: string;
      department: string;
      phase: Phase;
  } | null>(null);

  // State to track approved department per phase
  const [phaseDepartmentMap, setPhaseDepartmentMap] = useState<Record<Phase, string>>({} as Record<Phase, string>);

  const customPlans = useMemo(() => {
      return subjects.reduce((acc, sub) => {
          if (sub.customPlanName) {
              if (!acc[sub.customPlanName]) acc[sub.customPlanName] = [];
              acc[sub.customPlanName].push(sub);
          }
          return acc;
      }, {} as Record<string, Subject[]>);
  }, [subjects]);

  // Helper to check if we have data for the current view
  const hasData = useMemo(() => {
     // We should only check if there is data for the ACTIVE school context
     // But for simplicity, we check generally. 
     // A better check would be filtering subjects by the current phases.
     const hasCustomPlans = Object.keys(customPlans).length > 0;
     const hasMinistryPlans = Object.keys(gradeSubjectMap).length > 0;
     
     return subjects.length > 0 && (hasMinistryPlans || hasCustomPlans);
  }, [subjects, gradeSubjectMap, customPlans]);

  // Determine Active Phases based on Active School + Added Subjects
  const currentPhases = useMemo(() => {
      let activePhases: Phase[] = [];
      
      // 1. Get Configured Phases
      if (activeSchoolId === 'main') {
          activePhases = schoolInfo.phases || [];
      } else {
          const shared = schoolInfo.sharedSchools?.find(s => s.id === activeSchoolId);
          activePhases = shared?.phases || [];
      }

      // 2. Add Phases from Existing Subjects (so they don't disappear)
      const subjectPhases = new Set(subjects.map(s => s.phases[0]));
      
      // 3. Merge and Deduplicate
      const merged = Array.from(new Set([...activePhases, ...Array.from(subjectPhases)])) as Phase[];
      
      // 4. Default if empty
      if (merged.length === 0) return [Phase.ELEMENTARY];

      // 5. Sort by educational order
      const order = [Phase.ELEMENTARY, Phase.MIDDLE, Phase.HIGH, Phase.OTHER];
      return merged.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }, [activeSchoolId, schoolInfo, subjects]);


  // --- Helper Functions ---
  
  const getPhaseLabel = (phase: Phase) => {
    switch(phase) {
      case Phase.ELEMENTARY: return 'الابتدائية';
      case Phase.MIDDLE: return 'المتوسطة';
      case Phase.HIGH: return 'الثانوية';
      case Phase.KINDERGARTEN: return 'رياض الأطفال';
      default: return 'أخرى';
    }
  };
// ... (rest of helper functions)

  const getGradesForPhase = (phase: Phase) => {
      if (phase === Phase.ELEMENTARY) return [1, 2, 3, 4, 5, 6];
      if (phase === Phase.MIDDLE) return [1, 2, 3];
      if (phase === Phase.HIGH) return [1, 2, 3];
      if (phase === Phase.OTHER) return [1]; 
      return [];
  };

  const getGradeName = (phase: Phase, grade: number) => {
      const names = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'];
      return `الصف ${names[grade - 1] || grade}`;
  };

  // --- Actions ---

  const handleApprovePlan = (phase: Phase, departmentId: string, planKeys: string[]) => {
      const newSubjects: Subject[] = [];
      const newMapUpdates: Record<string, string[]> = {};

      planKeys.forEach(key => {
          const templates = DETAILED_TEMPLATES[key] || [];
          // Add subjects
          templates.forEach(t => {
             // Check if subject exists (by ID) to avoid duplicates
             if (!subjects.find(s => s.id === t.id) && !newSubjects.find(s => s.id === t.id)) {
                 newSubjects.push(t);
             }
          });

          // Update Map
          let grade = 0;
          if (key.includes('grade_1') || key.includes('الصف_الأول')) grade = 1;
          else if (key.includes('grade_2') || key.includes('الصف_الثاني')) grade = 2;
          else if (key.includes('grade_3') || key.includes('الصف_الثالث')) grade = 3;
          else if (key.includes('grade_4') || key.includes('الصف_الرابع')) grade = 4;
          else if (key.includes('grade_5') || key.includes('الصف_الخامس')) grade = 5;
          else if (key.includes('grade_6') || key.includes('الصف_السادس')) grade = 6;
          
          if (grade === 0) {
             const match = key.match(/grade_(\d+)/) || key.match(/_(\d+)/);
             if (match) grade = parseInt(match[1]);
          }

          if (grade > 0) {
             const gradeKey = `${phase}-${grade}`;
             newMapUpdates[gradeKey] = [
                 ...(gradeSubjectMap[gradeKey] || []),
                 ...(newMapUpdates[gradeKey] || []),
                 ...templates.map(s => s.id)
             ];
             newMapUpdates[gradeKey] = [...new Set(newMapUpdates[gradeKey])];
          }
      });
      
      setSubjects(prev => [...prev, ...newSubjects]);
      setGradeSubjectMap(prev => ({ ...prev, ...newMapUpdates }));
      
      // Update department map
      setPhaseDepartmentMap(prev => ({
          ...prev,
          [phase]: departmentId
      }));

      setShowPlanModal(false);
  };

  // School Selection Dropdown State
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  
  const handleDeletePlan = (phase: Phase) => {
      if (confirm('هل أنت متأكد من حذف الخطة الدراسية لهذه المرحلة؟ سيتم حذف جميع المواد المرتبطة بها.')) {
          // Identify subjects to remove (those in the gradeSubjectMap for this phase)
          const grades = getGradesForPhase(phase);
          let subjectsToRemove: string[] = [];
          
          grades.forEach(g => {
              const key = `${phase}-${g}`;
              if (gradeSubjectMap[key]) {
                  subjectsToRemove = [...subjectsToRemove, ...gradeSubjectMap[key]];
              }
          });

          // Update Map (Remove keys for this phase)
          setGradeSubjectMap(prev => {
              const next = { ...prev };
              grades.forEach(g => delete next[`${phase}-${g}`]);
              return next;
          });

          // Optional: Remove subjects from main list if they are no longer used?
          // For now, we keep them in 'subjects' array to avoid losing manual entries if keys overlap, 
          // or we can remove them if we are sure. 
          // Safest is just clearing the map for this phase.
          
          // Clear department map for this phase
          setPhaseDepartmentMap(prev => {
              const next = { ...prev };
              delete next[phase];
              return next;
          });
      }
  };

  const handleCustomPlanAdd = (planName: string, subjectCount: number) => {
      const generatedSubjects: Subject[] = [];
      
      for (let i = 0; i < subjectCount; i++) {
          const newSub: Subject = {
              id: `custom-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
              name: '',
              periodsPerClass: 0,
              phases: [Phase.OTHER], // Default phase, harmless
              department: 'custom',
              targetGrades: [],
              isArchived: false,
              specializationIds: [],
              customPlanName: planName
          };
          generatedSubjects.push(newSub);
      }

      setSubjects(prev => [...prev, ...generatedSubjects]);
      setShowManualModal(false);
  };
 
  // Grade Details Actions
  const handleOpenGradeDetails = (gradeKey: string, gradeName: string, phase: Phase) => {
      setViewingGradeDetails({
          gradeKey,
          gradeName,
          department: 'عام',
          phase
      });
  };

 const handleAddSubjectToGrade = (subject: Subject) => {
    setSubjects(prev => [...prev, subject]);
    if (viewingGradeDetails) {
      setGradeSubjectMap(prev => ({
        ...prev,
        [viewingGradeDetails.gradeKey]: [...(prev[viewingGradeDetails.gradeKey] || []), subject.id]
      }));
    }
 };

 const handleUpdateSubjectPeriods = (subjectId: string, periodsPerClass: number) => {
    setSubjects(prev => prev.map(s => s.id === subjectId ? { ...s, periodsPerClass } : s));
 };

 const handleDeleteSubjectFromGrade = (subjectId: string) => {
    if (viewingGradeDetails) {
      setGradeSubjectMap(prev => ({
        ...prev,
        [viewingGradeDetails.gradeKey]: (prev[viewingGradeDetails.gradeKey] || []).filter(id => id !== subjectId)
      }));
    }
 };

 const handleCopySubjectToGrades = (subjectId: string, targetGradeKeys: string[]) => {
    const original = subjects.find(s => s.id === subjectId);
    if (!original) return;

    targetGradeKeys.forEach(targetGradeKey => {
      const targetSubjectIds = gradeSubjectMap[targetGradeKey] || [];
      const alreadyExists = targetSubjectIds.some(id => {
        const s = subjects.find(sub => sub.id === id);
        return s?.name === original.name;
      });

      if (alreadyExists) return;

      const clonedSubject: Subject = {
        ...original,
        id: `copy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      };

      setSubjects(prev => [...prev, clonedSubject]);
      setGradeSubjectMap(prev => ({
        ...prev,
        [targetGradeKey]: [...(prev[targetGradeKey] || []), clonedSubject.id]
      }));
    });
    alert(`تم نسخ المادة بنجاح!`);
 };

 const getAvailableGradesForCopy = (currentGradeKey: string, phase: Phase) => {
     const grades = getGradesForPhase(phase);
     return grades.map(g => {
         const key = `${phase}-${g}`;
         if (key === currentGradeKey) return null;
         return { key, label: getGradeName(phase, g) };
     }).filter(Boolean) as { key: string; label: string }[];
 };


  // --- Render ---

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 relative group hover:shadow-md transition-all duration-300 overflow-hidden mb-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5e1fe] rounded-bl-[4rem] -z-0 transition-transform group-hover:scale-110 duration-500"></div>
          
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 relative z-10">
            <div className="p-2 bg-[#e5e1fe] text-[#655ac1] rounded-xl"><BookOpen size={24} /></div>
             المواد الدراسية
          </h3>
          <p className="text-slate-500 font-medium mt-2 mr-12 relative z-10">إدارة الخطط الدراسية والمواد وتوزيع الحصص</p>
      </div>



      {/* Action Bar */}
      <div className="flex flex-wrap items-center gap-4">
           {/* Study Plans Button */}
           <div className="relative">
               <button 
                 onClick={() => setShowPlanModal(true)}
                 className="flex items-center gap-2 bg-[#655ac1] hover:bg-[#5046a0] text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-[#655ac1]/20 transition-all hover:scale-105 active:scale-95"
               >
                   <Layers size={20} />
                   الخطط الدراسية
               </button>
           </div>

          <button 
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold transition-all hover:border-[#8779fb]"
          >
              <Plus size={20} className="text-[#8779fb]" />
              إضافة خطة مخصصة
          </button>
      </div>

      {/* Custom Plans Render Area */}
      {Object.entries(customPlans).map(([planName, planSubjects]: [string, Subject[]]) => (
           <div key={planName} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-6">
                <div className="p-6 border-b border-slate-100 bg-[#f8f7ff] flex justify-between items-center">
                    <h4 className="font-black text-lg text-[#655ac1] flex items-center gap-2">
                        <List size={20} />
                        {planName}
                        <span className="text-xs bg-white border border-slate-200 px-2 py-1 rounded-lg text-slate-500 font-bold">خطة مخصصة</span>
                    </h4>
                    <div className="flex gap-2">
                        <button onClick={() => window.print()} className="text-xs flex items-center gap-1 bg-white border border-[#e5e1fe] text-[#655ac1] px-3 py-1.5 rounded-lg font-bold hover:bg-[#655ac1] hover:text-white transition-all">
                            <Printer size={14} /> طباعة
                        </button>
                        <button 
                            onClick={() => {
                                if (confirm('هل أنت متأكد من حذف هذه الخطة بالكامل؟')) {
                                    setSubjects(prev => prev.filter(s => s.customPlanName !== planName));
                                }
                            }}
                            className="text-xs flex items-center gap-1 bg-white border border-rose-100 text-rose-500 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-500 hover:text-white transition-all"
                            title="حذف الخطة"
                        >
                            <Trash2 size={14} /> حذف
                        </button>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white border-b border-slate-100">
                                <th className="px-6 py-4 text-right text-sm font-black text-slate-600">اسم المادة</th>
                                <th className="px-6 py-4 text-center text-sm font-black text-slate-600">عدد الحصص</th>
                                <th className="px-6 py-4 text-center text-sm font-black text-slate-600">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {planSubjects.map((sub, idx) => (
                                <tr key={sub.id} className="hover:bg-[#f8f7ff] transition-colors group">
                                    <td className="px-6 py-4">
                                        <input 
                                            value={sub.name}
                                            onChange={e => {
                                                setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, name: e.target.value } : s));
                                            }}
                                            placeholder={`مادة ${idx + 1}`}
                                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#655ac1] outline-none font-bold text-slate-800 transition-colors py-1"
                                        />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                         <input 
                                            type="number"
                                            value={sub.periodsPerClass}
                                            onChange={e => {
                                                setSubjects(prev => prev.map(s => s.id === sub.id ? { ...s, periodsPerClass: parseInt(e.target.value) || 0 } : s));
                                            }}
                                            className="w-20 text-center bg-slate-50 border border-slate-200 rounded-lg py-1 focus:border-[#655ac1] outline-none font-bold text-slate-700"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button 
                                               onClick={() => {
                                                   if (confirm('حذف المادة؟')) {
                                                       setSubjects(prev => prev.filter(s => s.id !== sub.id));
                                                   }
                                               }}
                                               className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                                               title="حذف"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
           </div>
      ))}

      {/* Main Content Area */}
      {/* We iterate over currentPhases instead of schoolInfo.phases to match active tab */}
      {hasData ? (
          <div className="space-y-6">
             {currentPhases.map(phase => {
                 const grades = getGradesForPhase(phase);
                 const phaseData = grades.map(grade => {
                     const gradeKey = `${phase}-${grade}`;
                     const subjectIds = gradeSubjectMap[gradeKey] || [];
                     const gradeSubjects = subjects.filter(s => subjectIds.includes(s.id));
                     const totalPeriods = gradeSubjects.reduce((acc, curr) => acc + curr.periodsPerClass, 0);
                     
                     return {
                         grade,
                         gradeKey,
                         gradeName: getGradeName(phase, grade),
                         subjectCount: gradeSubjects.length,
                         totalPeriods,
                         subjects: gradeSubjects
                     };
                 }).filter(d => d.subjectCount > 0); 

                 if (phaseData.length === 0) return null;

                  const departmentId = phaseDepartmentMap[phase];
                  const departmentName = departmentId 
                      ? STUDY_PLANS_CONFIG.find(c => c.phase === phase)?.departments.find(d => d.id === departmentId)?.name 
                      : null;
                  
                  const activeSchoolName = activeSchoolId === 'main' 
                      ? schoolInfo.name 
                      : schoolInfo.sharedSchools?.find(s => s.id === activeSchoolId)?.name;

                  return (
                      <div key={phase} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                          <div className="p-6 border-b border-slate-100 bg-[#f8f7ff] flex justify-between items-center">
                              <h4 className="font-black text-lg text-[#655ac1] flex items-center gap-2">
                                  <span className="text-slate-700">{activeSchoolName}</span>
                                  <span className="text-slate-300">|</span>
                                  {getPhaseLabel(phase)}
                                  {departmentName && (
                                      <span className="text-sm font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                          {departmentName}
                                      </span>
                                  )}
                              </h4>
                             <div className="flex gap-2">
                                  <button onClick={() => alert('تم اعتماد الخطة بنجاح')} className="text-xs flex items-center gap-1 bg-[#22c55e] text-white border border-[#22c55e] px-3 py-1.5 rounded-lg font-bold hover:bg-[#16a34a] transition-all shadow-sm">
                                      <Check size={14} /> اعتماد
                                  </button>
                                  <button onClick={() => window.print()} className="text-xs flex items-center gap-1 bg-white border border-[#e5e1fe] text-[#655ac1] px-3 py-1.5 rounded-lg font-bold hover:bg-[#655ac1] hover:text-white transition-all">
                                      <Printer size={14} /> طباعة
                                  </button>
                                  <button 
                                      onClick={() => handleDeletePlan(phase)}
                                      className="text-xs flex items-center gap-1 bg-white border border-rose-100 text-rose-500 px-3 py-1.5 rounded-lg font-bold hover:bg-rose-500 hover:text-white transition-all"
                                      title="حذف الخطة"
                                  >
                                      <Trash2 size={14} /> حذف
                                  </button>
                              </div>
                         </div>
                         
                         <div className="overflow-x-auto">
                             <table className="w-full">
                                 <thead>
                                     <tr className="bg-white border-b border-slate-100">
                                         <th className="px-6 py-4 text-right text-sm font-black text-slate-600">الصف</th>
                                         <th className="px-6 py-4 text-center text-sm font-black text-slate-600">عدد المواد</th>
                                         <th className="px-6 py-4 text-center text-sm font-black text-slate-600">عدد الحصص</th>
                                         <th className="px-6 py-4 text-center text-sm font-black text-slate-600">الإجراءات</th>
                                     </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-50">
                                     {phaseData.map((row) => (
                                         <tr key={row.grade} className="hover:bg-[#f8f7ff] transition-colors group">
                                             <td className="px-6 py-4 text-sm font-bold text-slate-800">
                                                 <div className="flex items-center gap-3">
                                                     <div className="w-2 h-8 bg-[#8779fb] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                     {row.gradeName}
                                                 </div>
                                             </td>
                                             <td className="px-6 py-4 text-center">
                                                 <span className="inline-flex items-center justify-center bg-[#e5e1fe] text-[#655ac1] px-3 py-1 rounded-full text-xs font-black">
                                                     {row.subjectCount}
                                                 </span>
                                             </td>
                                              <td className="px-6 py-4 text-center">
                                                 <span className="inline-flex items-center justify-center bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-black">
                                                     {row.totalPeriods}
                                                 </span>
                                             </td>
                                             <td className="px-6 py-4">
                                                 <div className="flex items-center justify-center gap-2">
                                                     <button 
                                                        onClick={() => handleOpenGradeDetails(row.gradeKey, row.gradeName, phase)}
                                                        className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg text-slate-400 hover:text-[#655ac1] transition-all"
                                                        title="معاينة وتعديل"
                                                     >
                                                         <List size={18} />
                                                     </button>
                                                 </div>
                                             </td>
                                         </tr>
                                     ))}
                                 </tbody>
                             </table>
                         </div>
                     </div>
                 );
             })}
          </div>
      ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 border-dashed">
              <div className="w-20 h-20 bg-[#e5e1fe] rounded-full flex items-center justify-center text-[#655ac1] mb-6 animate-pulse">
                  <Layers size={40} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-2">لم يتم اعتماد خطة دراسية بعد</h3>
              <p className="text-slate-500 max-w-md text-center mb-8">
                  البدء باختيار الخطة الدراسية المناسبة للمدرسة لعرض المواد وتوزيع الحصص.
              </p>
              <button 
                  onClick={() => setShowPlanModal(true)}
                  className="bg-[#655ac1] hover:bg-[#5046a0] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#655ac1]/20 transition-all hover:scale-105"
              >
                  اختيار الخطة الدراسية
              </button>
          </div>
      )}

      {/* Modals */}
      <StudyPlansModal 
          isOpen={showPlanModal}
          onClose={() => setShowPlanModal(false)}
          onApprovePlan={handleApprovePlan}
          schoolPhases={currentPhases}
          activeSchoolId={activeSchoolId}
          onSchoolChange={setActiveSchoolId}
          schoolInfo={schoolInfo}
      />
      
      {viewingGradeDetails && (
          <GradeDetailsModal
            gradeKey={viewingGradeDetails.gradeKey}
            gradeName={viewingGradeDetails.gradeName}
            department={viewingGradeDetails.department}
            phase={viewingGradeDetails.phase}
            subjects={subjects.filter(s => (gradeSubjectMap[viewingGradeDetails.gradeKey] || []).includes(s.id))}
            allSubjects={subjects}
            onClose={() => setViewingGradeDetails(null)}
            onAddSubject={handleAddSubjectToGrade}
            onUpdateSubject={handleUpdateSubjectPeriods}
            onDeleteSubject={handleDeleteSubjectFromGrade}
            onCopySubjectToGrades={handleCopySubjectToGrades}
            availableGradesForCopy={getAvailableGradesForCopy(viewingGradeDetails.gradeKey, viewingGradeDetails.phase)}
          />
      )}

      {showManualModal && (
          <CustomPlanModal 
              onClose={() => setShowManualModal(false)}
              onAddPlan={handleCustomPlanAdd}
          />
      )}

    </div>
  );
};

const CustomPlanModal: React.FC<{
    onClose: () => void;
    onAddPlan: (planName: string, subjectCount: number) => void;
}> = ({ onClose, onAddPlan }) => {
    const [planName, setPlanName] = useState('');
    const [count, setCount] = useState('5'); // Default 5 subjects

    const handleSave = () => {
        if (!planName || !count) return;
        onAddPlan(planName, parseInt(count) || 1);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#e5e1fe] rounded-xl flex items-center justify-center text-[#655ac1]">
                            <BookOpen size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-slate-800">إضافة خطة مخصصة</h3>
                           <p className="text-sm text-slate-500 font-bold">إنشاء خطة جديدة وتحديد عدد المواد</p>
                        </div>
                    </div>
                    <button onClick={onClose}><X className="text-slate-400 hover:text-slate-600" /></button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1.5">اسم الخطة</label>
                        <input 
                            value={planName} 
                            onChange={e => setPlanName(e.target.value)} 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#655ac1] outline-none font-bold" 
                            placeholder="مثال: خطة النشاط" 
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-600 mb-1.5">عدد المواد</label>
                        <input 
                            type="number" 
                            value={count} 
                            onChange={e => setCount(e.target.value)} 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-[#655ac1] outline-none font-bold" 
                            min="1"
                            max="50"
                        />
                         <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                             <Info size={12} />
                             يمكنك تعديل أسماء المواد وعدد الحصص لاحقاً من الجدول
                         </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-3 font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors">إلغاء</button>
                    <button 
                        onClick={handleSave} 
                        disabled={!planName}
                        className="bg-[#655ac1] hover:bg-[#5046a0] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#655ac1]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:transform-none disabled:shadow-none"
                    >
                        إنشاء الخطة
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Step3Subjects;

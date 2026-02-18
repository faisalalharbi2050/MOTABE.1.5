import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, Book, GraduationCap, Building, School, Users, Activity, Star, ChevronLeft, ChevronRight, Check, Printer, Eye, BookOpen } from 'lucide-react';
import { Phase } from '../../types';
import { STUDY_PLANS_CONFIG } from '../../study_plans_config';
import { DETAILED_TEMPLATES } from '../../constants';

import { SchoolInfo } from '../../types';

interface StudyPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprovePlan: (phase: Phase, departmentId: string, planKeys: string[]) => void;
  schoolPhases: Phase[];
  activeSchoolId: string;
  onSchoolChange: (id: string) => void;
  schoolInfo: SchoolInfo;
}

const StudyPlansModal: React.FC<StudyPlansModalProps> = ({ 
    isOpen, 
    onClose, 
    onApprovePlan, 
    schoolPhases,
    activeSchoolId,
    onSchoolChange,
    schoolInfo
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  
  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
        setSelectedPhaseId(null);
        setSelectedDeptId(null);
    }
  }, [isOpen]);

  // Initial Filter by School Phases
  const availableCategories = useMemo(() => {
      // Show ALL plans so user can select them even if Basic Data wasn't configured perfectly
      return STUDY_PLANS_CONFIG;
  }, [schoolPhases]);

  const selectedCategory = useMemo(() => 
    STUDY_PLANS_CONFIG.find(c => c.id === selectedPhaseId), 
  [selectedPhaseId]);

  const selectedDepartment = useMemo(() => 
    selectedCategory?.departments.find(d => d.id === selectedDeptId),
  [selectedCategory, selectedDeptId]);

  const handleSave = () => {
      if (selectedCategory && selectedDepartment) {
          onApprovePlan(selectedCategory.phase, selectedDepartment.id, selectedDepartment.planKeys!);
      }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-7xl h-[85vh] rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#e5e1fe] flex items-center justify-center text-[#655ac1]">
              <Book size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800">الخطط الدراسية</h3>
              <p className="text-sm text-slate-500 font-medium">تصفح واعتماد الخطط الوزارية</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-rose-500 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          
          {/* Section 0: School Selection (if shared) */}
          {(schoolInfo.sharedSchools && schoolInfo.sharedSchools.length > 0) && (
              <div className="w-64 border-l border-slate-100 bg-white p-4 overflow-y-auto">
                  <h4 className="text-xs font-black text-slate-400 mb-2 px-2">المدرسة الأساسية</h4>
                  <button
                      onClick={() => onSchoolChange('main')}
                      className={`w-full flex flex-col items-start gap-1 px-4 py-3 rounded-2xl text-sm font-bold transition-all mb-4 ${
                          activeSchoolId === 'main'
                          ? 'bg-[#655ac1] text-white shadow-lg shadow-[#655ac1]/20' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                      <div className="flex items-center gap-2 w-full">
                          <School size={18} className={activeSchoolId === 'main' ? 'text-white' : 'text-slate-400'} />
                          <span className="truncate">{schoolInfo.schoolName || 'المدرسة'}</span>
                      </div>
                      <span className={`text-xs pr-7 ${activeSchoolId === 'main' ? 'text-white/80' : 'text-slate-400'}`}>
                          {schoolInfo.phases?.join('، ') || 'عام'}
                      </span>
                  </button>

                  <h4 className="text-xs font-black text-slate-400 mb-2 px-2">مدارس مشتركة</h4>
                  <div className="space-y-2">
                      {schoolInfo.sharedSchools.map(school => (
                          <button
                              key={school.id}
                              onClick={() => onSchoolChange(school.id)}
                              className={`w-full flex flex-col items-start gap-1 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                  activeSchoolId === school.id
                                  ? 'bg-[#655ac1] text-white shadow-lg shadow-[#655ac1]/20' 
                                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                              }`}
                          >
                              <div className="flex items-center gap-2 w-full">
                                  <Building size={18} className={activeSchoolId === school.id ? 'text-white' : 'text-slate-400'} />
                                  <span className="truncate">{school.name}</span>
                              </div>
                              <span className={`text-xs pr-7 ${activeSchoolId === school.id ? 'text-white/80' : 'text-slate-400'}`}>
                                  {school.phases?.join('، ') || 'عام'}
                              </span>
                          </button>
                      ))}
                  </div>
              </div>
          )}

          {/* Section 1: Phase Selection (Sidebar) */}
          <div className="w-64 border-l border-slate-100 bg-[#f8f7ff] p-4 overflow-y-auto">
             <h4 className="text-xs font-black text-slate-400 mb-4 px-2">1. تحديد المرحلة</h4>
             <div className="space-y-2">
                {availableCategories.map(cat => {
                    const Icon = getPhaseIcon(cat.phase);
                    const isSelected = selectedPhaseId === cat.id;
                    return (
                        <button
                            key={cat.id}
                            onClick={() => { setSelectedPhaseId(cat.id); setSelectedDeptId(null); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                                isSelected 
                                ? 'bg-[#655ac1] text-white shadow-lg shadow-[#655ac1]/20' 
                                : 'bg-white text-slate-600 hover:bg-white hover:shadow-md'
                            }`}
                        >
                            <Icon size={18} className={isSelected ? 'text-white' : 'text-slate-400'} />
                            <span>{cat.name}</span>
                        </button>
                    );
                })}
             </div>
          </div>

          {/* Section 2: Department Selection */}
          <div className="flex-1 p-8 overflow-y-auto bg-white flex flex-col">
              {!selectedPhaseId ? (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                       <School size={64} className="text-slate-300 mb-4" />
                       <p className="text-slate-400 font-bold">يرجى اختيار المرحلة أولاً</p>
                   </div>
              ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 flex-1">
                      
                      {/* Department Selection */}
                      <div>
                          <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-[#e5e1fe] text-[#655ac1] flex items-center justify-center text-xs">2</div>
                             تحديد القسم/المسار
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                              {selectedCategory?.departments.map(dept => (
                                  <button
                                      key={dept.id}
                                      onClick={() => setSelectedDeptId(dept.id)}
                                      className={`p-4 rounded-2xl border-2 text-right transition-all group relative overflow-hidden ${
                                          selectedDeptId === dept.id
                                          ? 'border-[#655ac1] bg-[#f8f7ff]'
                                          : 'border-slate-100 hover:border-[#655ac1]/50'
                                      }`}
                                  >
                                      <h5 className={`font-bold mb-1 transition-colors ${selectedDeptId === dept.id ? 'text-[#655ac1]' : 'text-slate-700'}`}>{dept.name}</h5>
                                      <p className="text-xs text-slate-400 line-clamp-2">{dept.description || 'خطة دراسية معتمدة'}</p>
                                      {selectedDeptId === dept.id && (
                                          <div className="absolute top-4 left-4 text-[#655ac1]">
                                              <Check size={16} />
                                          </div>
                                      )}
                                  </button>
                              ))}
                          </div>
                      </div>
                  </div>
              )}

              {/* Footer Actions */}
              {selectedDepartment && (
                  <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end animate-in slide-in-from-bottom-2">
                      <button 
                          onClick={handleSave}
                          className="flex items-center gap-2 bg-[#655ac1] hover:bg-[#5046a0] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-[#655ac1]/20 transition-all hover:scale-105 active:scale-95"
                      >
                          <Check size={20} />
                          حفظ واعتماد الخطة
                      </button>
                  </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to get icon for phase
const getPhaseIcon = (phase: Phase) => {
  switch (phase) {
    case Phase.ELEMENTARY: return School;
    case Phase.MIDDLE: return Building;
    case Phase.HIGH: return GraduationCap;
    case Phase.KINDERGARTEN: return Activity;
    case Phase.OTHER: return Star;
    default: return Star;
  }
};

export default StudyPlansModal;

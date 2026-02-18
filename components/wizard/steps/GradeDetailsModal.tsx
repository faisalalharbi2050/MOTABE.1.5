import React, { useState, useMemo } from 'react';
import { Phase, Subject } from '../../../types';
import { X, Plus, Edit2, Check, Copy, Trash2, BookOpen } from 'lucide-react';

interface GradeDetailsModalProps {
  gradeKey: string; // Format: "phase-gradeNumber" e.g., "الابتدائية-1"
  gradeName: string; // Display name e.g., "الصف الأول"
  department: string; // "عام" or "تحفيظ"
  phase: Phase;
  subjects: Subject[];
  allSubjects: Subject[];
  onClose: () => void;
  onAddSubject: (subject: Subject) => void;
  onUpdateSubject: (subjectId: string, periodsPerClass: number) => void;
  onDeleteSubject: (subjectId: string) => void;
  onCopySubjectToGrades: (subjectId: string, targetGradeKeys: string[]) => void;
  availableGradesForCopy: { key: string; label: string }[];
}

export const GradeDetailsModal: React.FC<GradeDetailsModalProps> = ({
  gradeKey,
  gradeName,
  department,
  phase,
  subjects,
  allSubjects,
  onClose,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onCopySubjectToGrades,
  availableGradesForCopy,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [copyingSubject, setCopyingSubject] = useState<Subject | null>(null);
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  
  // Add subject form state
  const [newSubject, setNewSubject] = useState({
    name: '',
    periods: '2',
  });

  const handleStartEdit = (subject: Subject) => {
    setEditingId(subject.id);
    setEditValue(subject.periodsPerClass.toString());
  };

  const handleSaveEdit = () => {
    if (editingId && editValue) {
      const periods = parseInt(editValue);
      if (periods > 0) {
        onUpdateSubject(editingId, periods);
        setEditingId(null);
        setEditValue('');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.name || !newSubject.periods) return;

    const subject: Subject = {
      id: `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: newSubject.name,
      specializationIds: [],
      periodsPerClass: parseInt(newSubject.periods),
      phases: [phase],
      department: department as 'عام' | 'تحفيظ',
      isArchived: false,
    };

    onAddSubject(subject);
    setNewSubject({ name: '', periods: '2' });
    setShowAddForm(false);
  };

  const handleCopySubject = () => {
    if (copyingSubject && selectedGrades.length > 0) {
      onCopySubjectToGrades(copyingSubject.id, selectedGrades);
      setCopyingSubject(null);
      setSelectedGrades([]);
    }
  };

  const handleToggleGrade = (gradeKey: string) => {
    setSelectedGrades(prev => 
      prev.includes(gradeKey) 
        ? prev.filter(k => k !== gradeKey)
        : [...prev, gradeKey]
    );
  };

  const handleSelectAll = () => {
    if (selectedGrades.length === availableGradesForCopy.length) {
      setSelectedGrades([]);
    } else {
      setSelectedGrades(availableGradesForCopy.map(g => g.key));
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{gradeName}</h2>
            <p className="text-sm text-slate-600 mt-1">
              القسم: <span className="font-semibold">{department}</span> • المرحلة: <span className="font-semibold">{phase}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white rounded-xl transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Actions bar */}
        <div className="px-6 py-4 border-b border-slate-200">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
          >
            <Plus size={18} />
            إضافة مادة
          </button>
        </div>

        {/* Subjects list */}
        <div className="flex-1 overflow-y-auto p-6">
          {subjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">لا توجد مواد مضافة لهذا الصف</p>
              <p className="text-sm mt-2">انقر على "إضافة مادة" للبدء</p>
            </div>
          ) : (
            <div className="space-y-2">
              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="flex items-center gap-4 p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800">{subject.name}</h3>
                  </div>

                  <div className="flex items-center gap-3">
                    {editingId === subject.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-3 py-2 border border-slate-300 rounded-lg text-center"
                          min="1"
                          autoFocus
                        />
                        <button
                          onClick={handleSaveEdit}
                          className="p-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-2 bg-slate-300 hover:bg-slate-400 text-slate-700 rounded-lg transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="text-center min-w-[80px]">
                          <p className="text-2xl font-bold text-emerald-600">{subject.periodsPerClass}</p>
                          <p className="text-xs text-slate-500">حصة</p>
                        </div>
                        <button
                          onClick={() => handleStartEdit(subject)}
                          className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                          title="تعديل عدد الحصص"
                        >
                          <Edit2 size={18} className="text-slate-600" />
                        </button>
                        <button
                          onClick={() => {
                            setCopyingSubject(subject);
                            setSelectedGrades([]);
                          }}
                          disabled={availableGradesForCopy.length === 0}
                          className="p-2 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          title="نسخ إلى صفوف أخرى"
                        >
                          <Copy size={18} className="text-blue-600" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من حذف المادة "${subject.name}"؟`)) {
                              onDeleteSubject(subject.id);
                            }
                          }}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                          title="حذف المادة"
                        >
                          <Trash2 size={18} className="text-red-600" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Subject Modal */}
      {showAddForm && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">إضافة مادة جديدة</h3>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  اسم المادة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="مثال: اللغة العربية"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  عدد الحصص <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={newSubject.periods}
                  onChange={(e) => setNewSubject({ ...newSubject, periods: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  min="1"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors"
                >
                  إضافة
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewSubject({ name: '', periods: '2' });
                  }}
                  className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Copy Subject to Multiple Grades Modal */}
      {copyingSubject && (
        <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4">نسخ المادة إلى صفوف أخرى</h3>
            
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>المادة:</strong> {copyingSubject.name}
              </p>
              <p className="text-sm text-blue-700 mt-1">
                عدد الحصص: {copyingSubject.periodsPerClass}
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  الصفوف المستهدفة <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                >
                  {selectedGrades.length === availableGradesForCopy.length ? 'إلغاء التحديد' : 'تحديد الكل'}
                </button>
              </div>
              
              {availableGradesForCopy.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  لا توجد صفوف متاحة للنسخ
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableGradesForCopy.map((grade) => (
                    <label
                      key={grade.key}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedGrades.includes(grade.key)
                          ? 'bg-blue-50 border border-blue-200'
                          : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGrades.includes(grade.key)}
                        onChange={() => handleToggleGrade(grade.key)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-sm font-semibold text-slate-700">{grade.label}</span>
                    </label>
                  ))}
                </div>
              )}
              
              <p className="text-xs text-slate-500 mt-3">
                ملاحظة: يمكن النسخ فقط للصفوف في نفس المرحلة والقسم
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopySubject}
                disabled={selectedGrades.length === 0}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                نسخ المادة
              </button>
              <button
                onClick={() => {
                  setCopyingSubject(null);
                  setSelectedGrades([]);
                }}
                className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { X, Users } from 'lucide-react';
import { Teacher, Admin, SupervisionStaffExclusion, SupervisionSettings } from '../../../types';
import SupervisionStaffPanel from '../SupervisionStaffPanel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  teachers: Teacher[];
  admins: Admin[];
  totalStaffCount: number;
  exclusions: SupervisionStaffExclusion[];
  setExclusions: (excs: SupervisionStaffExclusion[] | ((prev: SupervisionStaffExclusion[]) => SupervisionStaffExclusion[])) => void;
  settings: SupervisionSettings;
  setSettings: (s: SupervisionSettings | ((prev: SupervisionSettings) => SupervisionSettings)) => void;
  availableCount: number;
  suggestExclude: boolean;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const SupervisorsSettingsModal: React.FC<Props> = ({
  isOpen, onClose, teachers, admins, totalStaffCount,
  exclusions, setExclusions, settings, setSettings,
  availableCount, suggestExclude, showToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#e5e1fe] rounded-2xl flex items-center justify-center text-[#655ac1] shadow-sm">
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">إعدادات المشرفين</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                إجمالي الموظفين: <span className="font-bold text-[#655ac1] px-1">{totalStaffCount}</span> موظف
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <SupervisionStaffPanel
            teachers={teachers}
            admins={admins}
            exclusions={exclusions}
            setExclusions={setExclusions}
            settings={settings}
            setSettings={setSettings}
            availableCount={availableCount}
            suggestExclude={suggestExclude}
            showToast={showToast}
          />
        </div>
      </div>
    </div>
  );
};

export default SupervisorsSettingsModal;

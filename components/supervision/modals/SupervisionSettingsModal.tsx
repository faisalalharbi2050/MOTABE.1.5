import React from 'react';
import { X, Settings } from 'lucide-react';
import { SchoolInfo, SupervisionLocation, SupervisionPeriodConfig } from '../../../types';
import SupervisionLocationsPanel from '../SupervisionLocationsPanel';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  locations: SupervisionLocation[];
  setLocations: (locs: SupervisionLocation[] | ((prev: SupervisionLocation[]) => SupervisionLocation[])) => void;
  periods: SupervisionPeriodConfig[];
  setPeriods: (p: SupervisionPeriodConfig[] | ((prev: SupervisionPeriodConfig[]) => SupervisionPeriodConfig[])) => void;
  schoolInfo: SchoolInfo;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const SupervisionSettingsModal: React.FC<Props> = ({
  isOpen, onClose, locations, setLocations, periods, setPeriods, schoolInfo, showToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#e5e1fe] rounded-2xl flex items-center justify-center text-[#655ac1] shadow-sm">
              <Settings size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">إعدادات الإشراف</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">تهيئة مقرات وفترات الإشراف المستخرجة من التوقيت</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
           <SupervisionLocationsPanel
             locations={locations}
             setLocations={setLocations}
             periods={periods}
             setPeriods={setPeriods}
             schoolInfo={schoolInfo}
             showToast={showToast}
           />
        </div>
      </div>
    </div>
  );
};

export default SupervisionSettingsModal;

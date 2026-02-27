import React, { useState } from 'react';
import { X, Clock, Plus, Trash2, Check, AlertCircle } from 'lucide-react';
import { SchoolInfo, BreakInfo, PrayerInfo, TimingConfig } from '../../types';
import { Button } from '../ui/Button';

interface Props {
  schoolInfo: SchoolInfo;
  setSchoolInfo: React.Dispatch<React.SetStateAction<SchoolInfo>>;
  onClose: () => void;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const TimingPopup: React.FC<Props> = ({ schoolInfo, setSchoolInfo, onClose, showToast }) => {
  const existingTiming = schoolInfo.timing;

  const [breaks, setBreaks] = useState<BreakInfo[]>(existingTiming?.breaks || [
    { id: 'brk-1', name: 'الفسحة الأولى', duration: 25, afterPeriod: 2 },
  ]);

  const [prayers, setPrayers] = useState<PrayerInfo[]>(existingTiming?.prayers || [
    { id: 'prayer-1', name: 'صلاة الظهر', duration: 20, afterPeriod: 6, isEnabled: true },
  ]);

  const addBreak = () => {
    setBreaks(prev => [...prev, {
      id: `brk-${Date.now()}`,
      name: `فسحة ${prev.length + 1}`,
      duration: 20,
      afterPeriod: 4,
    }]);
  };

  const addPrayer = () => {
    setPrayers(prev => [...prev, {
      id: `prayer-${Date.now()}`,
      name: 'صلاة',
      duration: 15,
      afterPeriod: 6,
      isEnabled: true,
    }]);
  };

  const handleSave = () => {
    const updates: Partial<TimingConfig> = {
      breaks,
      prayers,
    };

    setSchoolInfo(prev => ({
      ...prev,
      timing: {
        ...(prev.timing || {
          activeDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday'],
          periodDuration: 45,
          assemblyTime: '06:45',
          periodCounts: { sunday: 7, monday: 7, tuesday: 7, wednesday: 7, thursday: 7 },
        }),
        breaks: updates.breaks || [],
        prayers: updates.prayers || [],
      } as TimingConfig,
    }));

    showToast('تم حفظ بيانات التوقيت', 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-5 rounded-t-2xl flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800">إعداد التوقيت</h3>
              <p className="text-xs text-slate-400">لم يتم إعداد أوقات الفسح والصلاة</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
            يمكنك إدخال بيانات التوقيت وسيتم تحديث صفحة التوقيت مباشرة
          </div>

          {/* Breaks */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-700 flex items-center gap-2">
                ☕ الفسح
              </h4>
              <button onClick={addBreak} className="p-1.5 rounded-lg hover:bg-slate-100 text-[#655ac1]">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {breaks.map((brk, idx) => (
                <div key={brk.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <input
                    type="text"
                    value={brk.name}
                    onChange={e => setBreaks(prev => prev.map(b => b.id === brk.id ? { ...b, name: e.target.value } : b))}
                    className="flex-1 px-2 py-1 rounded border border-slate-200 text-sm outline-none"
                    placeholder="اسم الفسحة"
                  />
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-slate-400">بعد الحصة</label>
                    <input
                      type="number"
                      value={brk.afterPeriod}
                      onChange={e => setBreaks(prev => prev.map(b => b.id === brk.id ? { ...b, afterPeriod: Number(e.target.value) } : b))}
                      className="w-14 px-2 py-1 rounded border border-slate-200 text-sm text-center outline-none"
                      min={1}
                      max={10}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-slate-400">المدة</label>
                    <input
                      type="number"
                      value={brk.duration}
                      onChange={e => setBreaks(prev => prev.map(b => b.id === brk.id ? { ...b, duration: Number(e.target.value) } : b))}
                      className="w-14 px-2 py-1 rounded border border-slate-200 text-sm text-center outline-none"
                      min={5}
                      max={60}
                    />
                    <span className="text-xs text-slate-400">د</span>
                  </div>
                  <button
                    onClick={() => setBreaks(prev => prev.filter(b => b.id !== brk.id))}
                    className="p-1 rounded hover:bg-red-50 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Prayers */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-700 flex items-center gap-2">
                🕌 الصلاة
              </h4>
              <button onClick={addPrayer} className="p-1.5 rounded-lg hover:bg-slate-100 text-[#655ac1]">
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-2">
              {prayers.map((prayer) => (
                <div key={prayer.id} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <input
                    type="text"
                    value={prayer.name}
                    onChange={e => setPrayers(prev => prev.map(p => p.id === prayer.id ? { ...p, name: e.target.value } : p))}
                    className="flex-1 px-2 py-1 rounded border border-slate-200 text-sm outline-none"
                    placeholder="اسم الصلاة"
                  />
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-slate-400">بعد الحصة</label>
                    <input
                      type="number"
                      value={prayer.afterPeriod}
                      onChange={e => setPrayers(prev => prev.map(p => p.id === prayer.id ? { ...p, afterPeriod: Number(e.target.value) } : p))}
                      className="w-14 px-2 py-1 rounded border border-slate-200 text-sm text-center outline-none"
                      min={1}
                      max={10}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <label className="text-xs text-slate-400">المدة</label>
                    <input
                      type="number"
                      value={prayer.duration}
                      onChange={e => setPrayers(prev => prev.map(p => p.id === prayer.id ? { ...p, duration: Number(e.target.value) } : p))}
                      className="w-14 px-2 py-1 rounded border border-slate-200 text-sm text-center outline-none"
                      min={5}
                      max={60}
                    />
                    <span className="text-xs text-slate-400">د</span>
                  </div>
                  <button
                    onClick={() => setPrayers(prev => prev.filter(p => p.id !== prayer.id))}
                    className="p-1 rounded hover:bg-red-50 text-red-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-5 rounded-b-2xl flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>تخطي</Button>
          <Button variant="primary" icon={Check} onClick={handleSave}>حفظ التوقيت</Button>
        </div>
      </div>
    </div>
  );
};

export default TimingPopup;

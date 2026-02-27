import React, { useState, useMemo } from 'react';
import {
  Users, UserCheck, UserX, Search, Filter, Shield,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Info
} from 'lucide-react';
import {
  Teacher, Admin, SupervisionStaffExclusion, SupervisionSettings
} from '../../types';
import { Badge } from '../ui/Badge';
import { getEligibleAdminRoles } from '../../utils/supervisionUtils';

interface Props {
  activeView?: 'settings' | 'staff';
  teachers: Teacher[];
  admins: Admin[];
  exclusions: SupervisionStaffExclusion[];
  setExclusions: (excs: SupervisionStaffExclusion[] | ((prev: SupervisionStaffExclusion[]) => SupervisionStaffExclusion[])) => void;
  settings: SupervisionSettings;
  setSettings: (s: SupervisionSettings | ((prev: SupervisionSettings) => SupervisionSettings)) => void;
  availableCount: number;
  suggestExclude: boolean;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const SupervisionStaffPanel: React.FC<Props> = ({
  teachers, admins, exclusions, setExclusions, settings, setSettings,
  availableCount, suggestExclude, showToast, activeView
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'teachers' | 'admins'>('all');
  const [showSettings, setShowSettings] = useState(true); // Keeping state, though always true now.

  const eligibleRoles = getEligibleAdminRoles();

  // Build combined staff list
  const allStaff = useMemo(() => {
    const staff: { id: string; name: string; type: 'teacher' | 'admin'; role?: string; phone?: string }[] = [];

    teachers.forEach(t => {
      staff.push({ id: t.id, name: t.name, type: 'teacher', phone: t.phone });
    });

    admins.forEach(a => {
      staff.push({ id: a.id, name: a.name, type: 'admin', role: a.role, phone: a.phone });
    });

    return staff;
  }, [teachers, admins]);

  // Filter
  const filteredStaff = useMemo(() => {
    let list = allStaff;
    if (filterType === 'teachers') list = list.filter(s => s.type === 'teacher');
    if (filterType === 'admins') list = list.filter(s => s.type === 'admin');
    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(term) || (s.role && s.role.toLowerCase().includes(term)));
    }
    return list;
  }, [allStaff, filterType, searchTerm]);

  // Exclusion helpers
  const isExcluded = (staffId: string) => {
    return exclusions.find(e => e.staffId === staffId)?.isExcluded || false;
  };

  const toggleExclusion = (staffId: string, staffType: 'teacher' | 'admin') => {
    const existing = exclusions.find(e => e.staffId === staffId);
    if (existing) {
      setExclusions(prev => prev.map(e => e.staffId === staffId ? { ...e, isExcluded: !e.isExcluded } : e));
    } else {
      setExclusions(prev => [...prev, { staffId, staffType, isExcluded: true }]);
    }
  };

  const excludedCount = exclusions.filter(e => e.isExcluded).length;

  // VP roles for auto-exclude
  const vpRoles = ['وكيل', 'وكيلة', 'وكيل الشؤون التعليمية', 'وكيل الشؤون المدرسية'];
  const vpAdmins = admins.filter(a => vpRoles.some(r => a.role?.includes(r)));

  return (
    <div className="space-y-6">
      {/* Staff List */}
      {(!activeView || activeView === 'staff') && (
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 h-full flex flex-col relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#e5e1fe]/50 to-transparent rounded-br-full -z-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 flex items-center justify-center bg-slate-100 text-[#655ac1] rounded-2xl shadow-sm">
               <Users size={24} />
             </div>
             <div>
                <h3 className="text-xl font-black text-[#655ac1] flex items-center gap-2">
                  الموظفين
                </h3>
                <p className="text-sm font-medium text-slate-500 mt-1">البحث، والفرز، واستثناء الموظفين من الإشراف</p>
             </div>
          </div>
          <div className="flex items-center gap-2 mr-auto">
             <Badge variant="info" className="px-3 py-1.5 text-[#655ac1] bg-[#e5e1fe] text-xs font-bold shadow-sm">{availableCount} متاح</Badge>
             {excludedCount > 0 && <Badge variant="warning" className="px-3 py-1.5 text-xs font-bold shadow-sm">{excludedCount} مستثنى</Badge>}
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex gap-2 mb-4">
          <div className="w-full sm:w-1/3 relative">
            <Search size={16} className="absolute right-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="بحث بالاسم أو المسمى..."
              className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-[#655ac1]/30 focus:border-[#655ac1] outline-none transition-all placeholder:text-slate-400 bg-white"
            />
          </div>
          <div className="flex-1 flex gap-2 flex-wrap sm:flex-nowrap bg-slate-100 rounded-2xl p-1.5 shrink-0 w-full sm:w-auto">
            {[
              { id: 'all', label: 'الكل' },
              { id: 'teachers', label: 'المعلمون' },
              { id: 'admins', label: 'الإداريون' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as any)}
                className={`flex-1 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filterType === f.id ? 'bg-white text-[#655ac1] shadow-sm ring-1 ring-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Staff List */}
        <div className="space-y-1.5 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredStaff.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm">
              لا يوجد موظفون مطابقون
            </div>
          )}
          {filteredStaff.map(staff => {
            const excluded = isExcluded(staff.id);
            const isVP = staff.type === 'admin' && vpRoles.some(r => staff.role?.includes(r));

            return (
              <div
                key={staff.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 group ${
                  excluded
                    ? 'bg-red-50/30 border-red-100 opacity-80 hover:opacity-100'
                    : 'bg-white border-slate-100 hover:border-[#655ac1]/30 hover:shadow-md'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black shrink-0 shadow-sm ${
                  staff.type === 'teacher' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                }`}>
                  {staff.type === 'teacher' ? 'م' : 'إ'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{staff.name}</p>
                  <p className="text-xs text-slate-400">
                    {staff.type === 'teacher' ? 'معلم' : staff.role || 'إداري'}
                    {isVP && settings.excludeVicePrincipals && (
                      <span className="text-amber-500 mr-1">(مستثنى تلقائياً - وكيل)</span>
                    )}
                  </p>
                </div>
                {excluded && <Badge variant="error">مستثنى</Badge>}
                {!excluded && !isVP && <Badge variant="success">متاح</Badge>}
                {isVP && settings.excludeVicePrincipals && <Badge variant="warning">وكيل</Badge>}

                <button
                  onClick={() => toggleExclusion(staff.id, staff.type)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    excluded
                      ? 'hover:bg-green-100 text-green-600'
                      : 'hover:bg-red-100 text-red-400'
                  }`}
                  title={excluded ? 'إلغاء الاستثناء' : 'استثناء'}
                >
                  {excluded ? <UserCheck size={16} /> : <UserX size={16} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* Settings */}
      {(!activeView || activeView === 'settings') && (
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-slate-100/50 to-transparent rounded-br-full -z-0 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between w-full mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 flex items-center justify-center bg-slate-100 text-[#655ac1] rounded-2xl shadow-sm">
               <Shield size={24} />
             </div>
             <div className="text-right">
                <h3 className="text-xl font-black text-[#655ac1] flex items-center gap-2">إعدادات أساسية</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">حدد الإعدادات الأساسية لإنشاء جدول الإشراف.</p>
             </div>
          </div>
        </div>

          <div className="relative z-10 space-y-4 animate-in fade-in duration-500">
            {/* VP Auto Exclude */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-base font-bold text-slate-700">استثناء الوكلاء تلقائياً</p>
                <p className="text-sm text-slate-500 mt-0.5">لن يُدرج الوكلاء في قائمة الإشراف إلا بقرار يدوي</p>
              </div>
              <button 
                onClick={() => setSettings(prev => ({ ...prev, excludeVicePrincipals: !prev.excludeVicePrincipals }))}
                className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
              >
                {settings.excludeVicePrincipals ? <ToggleRight size={32} className="text-green-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
              </button>
            </div>

            {/* Auto Exclude Teachers when 5+ admins */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-base font-bold text-slate-700">استثناء المعلمين عند وجود 5+ إداريين</p>
                <p className="text-sm text-slate-500 mt-0.5">عند وجود 5 مساعدين إداريين أو أكثر، يُستثنى المعلمون الممارسون</p>
              </div>
              <button 
                onClick={() => setSettings(prev => ({ ...prev, autoExcludeTeachersWhen5Admins: !prev.autoExcludeTeachersWhen5Admins }))}
                className="focus:outline-none transition-transform hover:scale-105 active:scale-95"
              >
                {settings.autoExcludeTeachersWhen5Admins ? <ToggleRight size={32} className="text-green-500" /> : <ToggleLeft size={32} className="text-slate-300" />}
              </button>
            </div>

            {/* Shared School Mode */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors">
              <div>
                <p className="text-base font-bold text-slate-700">نمط المدارس المشتركة</p>
                <p className="text-sm text-slate-500 mt-0.5">جدول إشراف موحد أو منفصل لكل مدرسة</p>
              </div>
              <select
                value={settings.sharedSchoolMode}
                onChange={e => setSettings(prev => ({ ...prev, sharedSchoolMode: e.target.value as any }))}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white focus:ring-2 focus:ring-[#655ac1]/30 focus:border-[#655ac1] outline-none cursor-pointer hover:border-slate-300 transition-colors"
              >
                <option value="unified">موحد</option>
                <option value="separate">منفصل</option>
              </select>
            </div>

            {/* VP list */}
            {vpAdmins.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1">
                  <Info size={14} />
                  الوكلاء المستثنون تلقائياً ({vpAdmins.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {vpAdmins.map(vp => (
                    <span key={vp.id} className="px-2 py-1 rounded-lg bg-white text-xs font-bold text-amber-700 border border-amber-200">
                      {vp.name} - {vp.role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
      </div>
      )}
    </div>
  );
};

export default SupervisionStaffPanel;

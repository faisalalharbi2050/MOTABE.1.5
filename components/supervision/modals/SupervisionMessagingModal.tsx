import React, { useState, useMemo } from 'react';
import { X, Send, Copy, RefreshCw, Check, ChevronDown } from 'lucide-react';
import { SchoolInfo, SupervisionScheduleData, Teacher, Admin } from '../../../types';
import { DAYS, DAY_NAMES, getTimingConfig, generateAssignmentMessage, generateReminderMessage } from '../../../utils/supervisionUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  supervisionData: SupervisionScheduleData;
  schoolInfo: SchoolInfo;
  teachers: Teacher[];
  admins: Admin[];
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

// ─── WhatsApp SVG Icon ───────────────────────────────────────────────────────
const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

// ─── Build message text ──────────────────────────────────────────────────────
function buildMessage(
  type: 'assignment' | 'reminder',
  staffName: string,
  staffType: 'teacher' | 'admin',
  day: string,
  locationNames: string[],
  effectiveDate: string | undefined,
  gender: 'بنين' | 'بنات'
): string {
  return type === 'assignment'
    ? generateAssignmentMessage(staffName, staffType, day, locationNames, effectiveDate, gender)
    : generateReminderMessage(staffName, staffType, day, locationNames, gender);
}

// ─── Component ───────────────────────────────────────────────────────────────
const SupervisionMessagingModal: React.FC<Props> = ({
  isOpen, onClose, supervisionData, schoolInfo, teachers, admins, showToast
}) => {
  const [messageType, setMessageType] = useState<'assignment' | 'reminder'>('assignment');
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [masterTemplate, setMasterTemplate] = useState<string>('');
  const [customMessages, setCustomMessages] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const timing = getTimingConfig(schoolInfo);
  const activeDays = timing.activeDays || DAYS.slice();

  // Build row data
  const rows = useMemo(() => {
    const daysToProcess = selectedDay === 'all' ? activeDays : [selectedDay];
    const result: {
      key: string;
      staffId: string;
      staffName: string;
      staffType: 'teacher' | 'admin';
      day: string;
      locationNames: string[];
      message: string;
    }[] = [];

    daysToProcess.forEach(day => {
      const da = supervisionData.dayAssignments.find(d => d.day === day);
      if (!da) return;
      da.staffAssignments.forEach(sa => {
        const locs = sa.locationIds
          .map(lid => supervisionData.locations.find(l => l.id === lid)?.name || '')
          .filter(Boolean);
        const staffType = sa.staffType || (teachers.some(t => t.id === sa.staffId) ? 'teacher' : 'admin');
        const key = `${day}-${sa.staffId}`;
        const baseMsg = buildMessage(messageType, sa.staffName, staffType, day, locs, supervisionData.effectiveDate, schoolInfo.gender ?? 'بنين');
        const message = customMessages[key] ?? baseMsg;
        result.push({ key, staffId: sa.staffId, staffName: sa.staffName, staffType, day, locationNames: locs, message });
      });
    });
    return result;
  }, [supervisionData, messageType, selectedDay, activeDays, schoolInfo.gender, customMessages, teachers]);

  // Select / deselect helpers
  const allSelected = rows.length > 0 && rows.every(r => selectedIds.has(r.key));
  const toggleAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(rows.map(r => r.key)));
  };
  const toggleRow = (key: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  // Apply master template to all visible rows
  const applyMaster = () => {
    if (!masterTemplate.trim()) return;
    const next = { ...customMessages };
    rows.forEach(r => { next[r.key] = masterTemplate; });
    setCustomMessages(next);
    showToast('تم اعتماد القالب على جميع الرسائل', 'success');
  };

  const copyAll = () => {
    const text = rows.map(r => r.message).join('\n\n' + '─'.repeat(24) + '\n\n');
    navigator.clipboard.writeText(text);
    showToast('تم نسخ جميع الرسائل', 'success');
  };

  const resetAll = () => {
    setCustomMessages({});
    setMasterTemplate('');
    showToast('تمت استعادة القوالب التلقائية', 'success');
  };

  // Send helpers
  const getPhone = (staffId: string) =>
    [...teachers, ...admins].find(s => s.id === staffId)?.phone;

  const sendWhatsApp = (staffId: string, message: string) => {
    const phone = getPhone(staffId);
    if (phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      showToast('لم يُعثر على رقم الهاتف', 'warning');
    }
  };

  const sendSMS = (staffId: string, message: string) => {
    const phone = getPhone(staffId);
    if (phone) {
      window.open(`sms:${phone.replace(/\D/g, '')}?body=${encodeURIComponent(message)}`, '_self');
    } else {
      showToast('لم يُعثر على رقم الهاتف', 'warning');
    }
  };

  const sendAllWhatsApp = () => {
    const targets = rows.filter(r => selectedIds.has(r.key));
    if (targets.length === 0) { showToast('لم يتم تحديد أي موظف', 'warning'); return; }
    targets.forEach(r => sendWhatsApp(r.staffId, r.message));
    showToast(`تم فتح ${targets.length} رسالة واتساب`, 'success');
  };

  const sendAllSMS = () => {
    const targets = rows.filter(r => selectedIds.has(r.key));
    if (targets.length === 0) { showToast('لم يتم تحديد أي موظف', 'warning'); return; }
    targets.forEach(r => sendSMS(r.staffId, r.message));
    showToast(`تم فتح ${targets.length} رسالة نصية`, 'success');
  };

  if (!isOpen) return null;

  const selectedCount = rows.filter(r => selectedIds.has(r.key)).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >

        {/* ── Modal Header ─────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#25D366]/10 rounded-2xl flex items-center justify-center shadow-sm">
              <WhatsAppIcon size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800">إرسال إشعارات الإشراف</h2>
              <p className="text-xs font-medium text-slate-500 mt-0.5">تبليغ المشرفين بمهامهم عبر الواتساب أو الرسائل النصية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── Zone 1 : Header / Template ───────────────────────────────── */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">

            {/* Row 1: type toggle + day dropdown */}
            <div className="flex flex-wrap items-center gap-3">

              {/* Message type toggle */}
              <div className="flex gap-1 bg-slate-100 rounded-xl p-1 border border-slate-200">
                <button
                  onClick={() => setMessageType('assignment')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    messageType === 'assignment'
                      ? 'bg-white text-[#655ac1] shadow-sm'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  رسالة تكليف
                </button>
                <button
                  onClick={() => setMessageType('reminder')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    messageType === 'reminder'
                      ? 'bg-white text-[#655ac1] shadow-sm'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  رسالة تذكير
                </button>
              </div>

              {/* Day dropdown */}
              <div className="relative">
                <select
                  value={selectedDay}
                  onChange={e => setSelectedDay(e.target.value)}
                  className="appearance-none pl-8 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-[#655ac1]/30 focus:border-[#655ac1] outline-none bg-white cursor-pointer hover:border-slate-300 transition-colors"
                >
                  <option value="all">كل الأيام</option>
                  {activeDays.map(day => (
                    <option key={day} value={day}>{DAY_NAMES[day]}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Copy All + Reset — subtle utility buttons on the right */}
              <div className="flex gap-2 mr-auto">
                <button
                  onClick={copyAll}
                  disabled={rows.length === 0}
                  title="نسخ جميع الرسائل"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold transition-all disabled:opacity-40"
                >
                  <Copy size={13} /> نسخ الكل
                </button>
                <button
                  onClick={resetAll}
                  title="استعادة القوالب التلقائية"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-500 text-xs font-bold transition-all"
                >
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            {/* Row 2: Master Template */}
            <div className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="text-xs font-bold text-slate-500 mb-1.5 block">قالب موحد — اكتب رسالة وطبّقها على الجميع</label>
                <textarea
                  value={masterTemplate}
                  onChange={e => setMasterTemplate(e.target.value)}
                  placeholder="اكتب نصًا واضغط (اعتماد للكل) لتطبيقه على جميع الرسائل الظاهرة..."
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 font-medium focus:ring-2 focus:ring-[#655ac1]/20 focus:border-[#655ac1] outline-none resize-none leading-relaxed"
                />
              </div>
              <button
                onClick={applyMaster}
                disabled={!masterTemplate.trim()}
                className="mt-6 flex items-center gap-2 bg-[#655ac1] hover:bg-[#4e44a6] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Check size={15} />
                اعتماد للكل
              </button>
            </div>
          </div>

          {/* ── Zone 2: Action Table ─────────────────────────────────────── */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Table toolbar */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-700">
                  {rows.length > 0
                    ? `${rows.length} مشرف • ${selectedCount > 0 ? `${selectedCount} محدد` : 'لم يتم التحديد'}`
                    : 'لا يوجد مشرفون'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                  <button
                    onClick={sendAllWhatsApp}
                    disabled={selectedCount === 0}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-bold transition-all border border-[#25D366]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <WhatsAppIcon size={14} />
                    واتساب للكل {selectedCount > 0 && `(${selectedCount})`}
                  </button>
                  <button
                    onClick={sendAllSMS}
                    disabled={selectedCount === 0}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF]/20 text-[#007AFF] text-xs font-bold transition-all border border-[#007AFF]/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send size={13} />
                    نصية للكل {selectedCount > 0 && `(${selectedCount})`}
                  </button>
                </div>
            </div>

            {rows.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="w-16 h-16 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-3">
                  <WhatsAppIcon size={32} />
                </div>
                <p className="font-bold text-slate-500">لا يوجد مشرفون للأيام المحددة</p>
                <p className="text-sm mt-1">يُرجى إعداد جدول الإشراف أولاً</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-right">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      {/* Checkbox all */}
                      <th className="px-4 py-3 w-10">
                        <button
                          onClick={toggleAll}
                          className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                            allSelected
                              ? 'bg-[#655ac1] border-[#655ac1] text-white'
                              : 'bg-white border-slate-300 hover:border-[#655ac1]'
                          }`}
                        >
                          {allSelected && <Check size={11} />}
                        </button>
                      </th>
                      <th className="px-3 py-3 font-black text-slate-500 text-xs w-10">م</th>
                      <th className="px-3 py-3 font-black text-slate-700 text-xs min-w-[140px]">الموظف</th>
                      <th className="px-3 py-3 font-black text-slate-700 text-xs text-center w-20">الصفة</th>
                      {selectedDay === 'all' && (
                        <th className="px-3 py-3 font-black text-slate-700 text-xs text-center w-20">اليوم</th>
                      )}
                      <th className="px-3 py-3 font-black text-slate-700 text-xs">الرسالة</th>
                      <th className="px-3 py-3 font-black text-slate-700 text-xs text-center w-20">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {rows.map((row, idx) => {
                      const checked = selectedIds.has(row.key);
                      return (
                        <tr
                          key={row.key}
                          className={`hover:bg-slate-50/60 transition-colors ${checked ? 'bg-[#f3f0ff]/60' : ''}`}
                        >
                          {/* Checkbox */}
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleRow(row.key)}
                              className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                                checked
                                  ? 'bg-[#655ac1] border-[#655ac1] text-white'
                                  : 'bg-white border-slate-300 hover:border-[#655ac1]'
                              }`}
                            >
                              {checked && <Check size={11} />}
                            </button>
                          </td>

                          {/* Index */}
                          <td className="px-3 py-3 text-slate-400 font-bold text-xs text-center">{idx + 1}</td>

                          {/* Name */}
                          <td className="px-3 py-3">
                            <span className="font-bold text-slate-800 text-sm leading-tight block">{row.staffName}</span>
                          </td>

                          {/* Role */}
                          <td className="px-3 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                              row.staffType === 'teacher'
                                ? 'bg-blue-50 text-blue-700 border-blue-100'
                                : 'bg-[#e5e1fe] text-[#655ac1] border-[#655ac1]/20'
                            }`}>
                              {row.staffType === 'teacher' ? 'معلم' : 'إداري'}
                            </span>
                          </td>

                          {/* Day (only in "all" mode) */}
                          {selectedDay === 'all' && (
                            <td className="px-3 py-3 text-center">
                              <span className="text-[10px] font-bold text-[#655ac1] bg-[#e5e1fe] px-2 py-0.5 rounded-lg">
                                {DAY_NAMES[row.day]}
                              </span>
                            </td>
                          )}

                          {/* Message preview — read-only, click to edit inline */}
                          <td className="px-3 py-2 max-w-sm">
                            <textarea
                              value={row.message}
                              onChange={e => {
                                setCustomMessages(prev => ({ ...prev, [row.key]: e.target.value }));
                              }}
                              rows={3}
                              className="w-full text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 border border-transparent hover:border-slate-200 focus:border-[#655ac1]/30 focus:ring-1 focus:ring-[#655ac1]/10 focus:bg-white rounded-lg px-2 py-1.5 outline-none resize-y min-h-[52px] max-h-[120px] transition-all"
                            />
                          </td>

                          {/* Actions */}
                          <td className="px-3 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* WhatsApp */}
                              <button
                                onClick={() => sendWhatsApp(row.staffId, row.message)}
                                title="إرسال عبر واتساب"
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/25 border border-[#25D366]/20 transition-all active:scale-90"
                              >
                                <WhatsAppIcon size={15} />
                              </button>
                              {/* SMS */}
                              <button
                                onClick={() => sendSMS(row.staffId, row.message)}
                                title="إرسال رسالة نصية"
                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF]/25 border border-[#007AFF]/20 transition-all active:scale-90"
                              >
                                <Send size={13} className="text-[#007AFF]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupervisionMessagingModal;

import React, { useState } from 'react';
import { X, Printer, Edit, ToggleLeft, ToggleRight } from 'lucide-react';
import { SchoolInfo, DutyScheduleData } from '../../../types';
import { getDutyPrintData } from '../../../utils/dutyUtils';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  dutyData: DutyScheduleData;
  schoolInfo: SchoolInfo;
  showToast: (msg: string, type: 'success' | 'warning' | 'error') => void;
}

const DutyPrintModal: React.FC<Props> = ({
  isOpen, onClose, dutyData, schoolInfo, showToast
}) => {
  const [footerText, setFooterText] = useState(dutyData.footerText || '');
  const [editingFooter, setEditingFooter] = useState(false);
  const [showSupervisorSig, setShowSupervisorSig] = useState(true);

  if (!isOpen) return null;

  const printData = getDutyPrintData(dutyData, schoolInfo);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
  <meta charset="UTF-8">
  <title>جدول المناوبة اليومية - ${printData.schoolName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Arial, sans-serif; direction: rtl; background: #fff; font-size: 11px; }

    /* ── Repeating header on every page ── */
    .page-header {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 3px solid #655ac1;
      padding: 8px 16px 8px 16px;
      margin-bottom: 10px;
      position: running(pageHeader);
    }
    .page-header .school-info { font-size: 10px; font-weight: bold; color: #334155; line-height: 1.5; }
    .page-header .doc-title { text-align: center; }
    .page-header .doc-title h1 { font-size: 14px; font-weight: 900; color: #655ac1; }
    .page-header .doc-title p { font-size: 9px; color: #8779fb; font-weight: bold; margin-top: 2px; }
    .page-header .doc-date { font-size: 10px; font-weight: bold; color: #475569; text-align: left; }

    @page { margin: 15mm 15mm 20mm 15mm; @top-center { content: element(pageHeader); } }

    /* Fallback for browsers that don't support CSS running elements – show inline header before first block */
    .inline-header { page-break-after: avoid; margin-bottom: 10px; }

    /* ── Tables ── */
    table { width: 100%; border-collapse: collapse; margin-bottom: 14px; font-size: 10.5px; }
    th {
      background-color: #655ac1;
      color: white;
      border: 1px solid #8779fb;
      padding: 6px 4px;
      font-weight: bold;
      text-align: center;
    }
    td { border: 1px solid #ddd6fe; padding: 5px 6px; text-align: center; vertical-align: middle; }
    tr:nth-child(even) { background-color: #f5f3ff; }
    .day-header { background-color: #ede9fe !important; font-weight: 900; color: #4c1d95; border: 1px solid #c4b5fd; }
    .empty-state { color: #94a3b8; font-style: italic; }
    .week-title {
      font-size: 11px; font-weight: 900; color: #5C50A4;
      background: #ede9fe; padding: 5px 10px; border-radius: 4px;
      margin-bottom: 6px; display: inline-block;
    }

    /* ── Repeating page footer ── */
    .page-footer {
      position: fixed; bottom: 0; left: 0; right: 0;
      text-align: center; font-size: 9px; font-weight: bold;
      color: #64748b; padding: 5px 20px;
      border-top: 1px dashed #c4b5fd; background: white;
    }

    /* ── Principal signature block ── */
    .principal-sig { text-align: left; margin-top: 16px; font-size: 11px; font-weight: bold; color: #334155; padding-left: 20px; }
    .principal-sig .sig-line { display: inline-block; min-width: 160px; border-top: 1px dotted #94a3b8; margin-top: 16px; padding-top: 3px; }

    /* ── Week block ── */
    .week-block { margin-bottom: 16px; }
    /* No forced page-breaks between weeks – let browser fit as many as possible per page */

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      th { background-color: #655ac1 !important; color: white !important; }
      .day-header { background-color: #ede9fe !important; }
      tr:nth-child(even) { background-color: #f5f3ff !important; }
    }
  </style>
</head>
<body>

  <!-- Inline header (shown above content, also used as running element) -->
  <div class="page-header inline-header">
    <div class="school-info">
      <div>المملكة العربية السعودية &nbsp;|&nbsp; وزارة التعليم</div>
      <div>${schoolInfo.region || 'إدارة التعليم'} &nbsp;|&nbsp; مدرسة ${printData.schoolName || '..........'}</div>
    </div>
    <div class="doc-title">
      <h1>${printData.title}</h1>
      <p>${printData.semester}</p>
    </div>
    <div class="doc-date">
      <div>التاريخ: ${new Date().toLocaleDateString('ar-SA')}</div>
      <div>العام الدراسي: ${schoolInfo.academicYear || ''}</div>
    </div>
  </div>

  ${(() => {
    let maxPerDayPrint = 1;
    printData.weeks.forEach(w => w.days.forEach(d => {
      if (d.supervisors.length > maxPerDayPrint) maxPerDayPrint = d.supervisors.length;
    }));
    const staffCols = Array.from({ length: maxPerDayPrint }, (_, i) =>
      maxPerDayPrint === 1 ? 'المناوب' : `مناوب ${i + 1}`
    );

    return printData.weeks.map((week) => `
    <div class="week-block">
      <div class="week-title">${week.weekName}${week.startDate ? ` &nbsp; ${week.startDate} — ${week.endDate}` : ''}</div>
      <table>
        <thead>
          <tr>
            <th style="width:11%;">اليوم</th>
            <th style="width:12%;">التاريخ</th>
            ${staffCols.map(h => `
              <th style="width:${showSupervisorSig ? 18 : 28}%;">${h}</th>
              ${showSupervisorSig ? `<th style="width:18%;">توقيع ${h}</th>` : ''}
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${week.days.map(day => {
            const sups = day.supervisors;
            if (sups.length === 0) {
              return `<tr>
                <td class="day-header">${day.dayName}</td>
                <td style="color:#94a3b8;">${day.date || '—'}</td>
                <td colspan="${maxPerDayPrint * (showSupervisorSig ? 2 : 1)}" class="empty-state">لم يتم التعيين</td>
              </tr>`;
            }
            return `<tr>
              <td class="day-header">${day.dayName}</td>
              <td style="color:#475569;">${day.date || '—'}</td>
              ${staffCols.map((_, idx) => {
                const sup = sups[idx];
                return `<td style="text-align:right; font-weight:bold; color:#1e293b;">${sup ? sup.name : ''}</td>
                  ${showSupervisorSig ? '<td></td>' : ''}`;
              }).join('')}
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `).join('');
  })()}

  <div class="page-footer">${footerText || printData.footerText}</div>

  <div class="principal-sig">
    <div>مدير المدرسة / ${schoolInfo.principal || '............................'}</div>
    <span class="sig-line">التوقيع</span>
  </div>

</body>
</html>
    `);

    printWindow.document.close();
    setTimeout(() => printWindow.print(), 300);
    showToast('تم فتح نافذة الطباعة', 'success');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-slate-50 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#e5e1fe] rounded-2xl flex items-center justify-center text-[#655ac1] shadow-sm">
              <Printer size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800">طباعة جدول المناوبة</h2>
              <p className="text-sm font-medium text-slate-500 mt-0.5">معاينة وطباعة جدول المناوبة اليومية</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-colors">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            {/* Footer Text Edit */}
            <div className="bg-slate-50 rounded-xl p-4 mb-4 border border-slate-100 flex flex-col md:flex-row gap-4">
               <div className="flex-1">
                 <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-bold text-slate-600">نص التذييل</label>
                    <button onClick={() => setEditingFooter(!editingFooter)} className="p-1.5 rounded-lg hover:bg-white text-slate-400 border border-transparent hover:border-slate-200 transition-colors">
                      <Edit size={14} />
                    </button>
                 </div>
                 {editingFooter ? (
                   <textarea
                     value={footerText}
                     onChange={e => setFooterText(e.target.value)}
                     placeholder={printData.footerText}
                     className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-[#8779fb]/30 focus:border-[#8779fb] outline-none resize-none"
                     rows={2}
                   />
                 ) : (
                    <p className="text-sm text-slate-600 font-medium bg-white p-2 text-right rounded-lg border border-slate-100">{footerText || printData.footerText}</p>
                 )}
               </div>
               
               {/* Column Toggles */}
               <div className="w-full md:w-64 bg-white p-3 rounded-xl border border-slate-200 shrink-0">
                  <h4 className="text-xs font-bold text-slate-500 mb-3 border-b border-slate-100 pb-2">إعدادات الأعمدة</h4>
                  <div className="flex items-center justify-between mb-1 text-sm font-bold text-slate-700">
                    <span>توقيع المناوب</span>
                    <button onClick={() => setShowSupervisorSig(!showSupervisorSig)} className={`text-xl transition-colors \${showSupervisorSig ? 'text-[#8779fb]' : 'text-slate-300'}`}>
                      {showSupervisorSig ? <ToggleRight size={28} className="text-[#8779fb]" /> : <ToggleLeft size={28} />}
                    </button>
                  </div>
               </div>
            </div>

            {/* Preview Document */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 overflow-y-auto custom-scrollbar">
              <div className="text-center mb-4 pb-4 border-b-2 border-double border-slate-300">
                <h4 className="text-lg font-black text-slate-800 mb-1">{printData.schoolName}</h4>
                <h5 className="text-sm font-bold text-slate-500">{printData.title}</h5>
              </div>

              <div className="space-y-8">
                {(() => {
                  // Compute max officers per day for JSX preview
                  let maxPerDay = 1;
                  printData.weeks.forEach(w => w.days.forEach(d => {
                    if (d.supervisors.length > maxPerDay) maxPerDay = d.supervisors.length;
                  }));
                  const staffCols = Array.from({ length: maxPerDay }, (_, i) =>
                    maxPerDay === 1 ? 'المناوب' : `مناوب ${i + 1}`
                  );

                  return printData.weeks.map(week => (
                    <div key={week.weekName} className="mb-4">
                      <h5 className="font-bold text-[#5C50A4] bg-[#ede9fe] py-1.5 px-3 rounded-lg mb-2 text-xs inline-block">
                         {week.weekName} {week.startDate && <span className="text-slate-500 mr-1">({week.startDate} - {week.endDate})</span>}
                      </h5>
                      <table className="w-full text-xs border-collapse">
                        <thead>
                          <tr className="bg-[#655ac1] text-white">
                            <th className="border border-[#8779fb] p-1.5">اليوم</th>
                            <th className="border border-[#8779fb] p-1.5">التاريخ</th>
                            {staffCols.map((h, i) => (
                              <React.Fragment key={i}>
                                <th className="border border-[#8779fb] p-1.5">{h}</th>
                                {showSupervisorSig && <th className="border border-[#8779fb] p-1.5">توقيع</th>}
                              </React.Fragment>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {week.days.map((day, rowIdx) => (
                            <tr key={day.date || day.dayName} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#f5f3ff]'}>
                              <td className="border border-[#ddd6fe] p-1.5 font-bold bg-[#ede9fe] text-[#4c1d95] text-center">{day.dayName}</td>
                              <td className="border border-[#ddd6fe] p-1.5 text-center text-slate-500 text-[10px]">{day.date || '—'}</td>
                              {day.supervisors.length === 0 ? (
                                <td className="border border-[#ddd6fe] p-1.5 text-slate-400 text-center" colSpan={maxPerDay * (showSupervisorSig ? 2 : 1)}>لم يتم التعيين</td>
                              ) : (
                                staffCols.map((_, idx) => {
                                  const sup = day.supervisors[idx];
                                  return (
                                    <React.Fragment key={idx}>
                                      <td className="border border-[#ddd6fe] p-1.5 text-right font-bold text-slate-800">{sup ? sup.name : ''}</td>
                                      {showSupervisorSig && <td className="border border-[#ddd6fe] p-1.5"></td>}
                                    </React.Fragment>
                                  );
                                })
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ));
                })()}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 text-center">
                <p className="font-bold text-xs text-slate-500">{footerText || printData.footerText}</p>
                <div className="mt-4 flex justify-end">
                  <div className="text-center">
                    <p className="font-bold text-sm text-slate-800">مدير المدرسة: {schoolInfo.principal || '----------------'}</p>
                    <p className="font-bold text-xs text-slate-500 mt-2">التوقيع: ..........................</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
               <button onClick={onClose} className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition-colors">
                 إلغاء
               </button>
               <button onClick={handlePrint} className="flex items-center gap-2 bg-[#8779fb] hover:bg-[#655ac1] text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg -[#e5e1fe] transition-all hover:scale-105 active:scale-95">
                 <Printer size={18} /> طباعة الجدول
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DutyPrintModal;


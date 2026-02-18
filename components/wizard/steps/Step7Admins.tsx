import React, { useState } from 'react';
import { Admin } from '../../../types';
import { Zap, Plus, X, UserCog, Edit, Trash2, Printer, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

interface Step7Props {
  admins: Admin[];
  setAdmins: React.Dispatch<React.SetStateAction<Admin[]>>;
}

const Step7Admins: React.FC<Step7Props> = ({ admins, setAdmins }) => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentAdmin, setCurrentAdmin] = useState<Partial<Admin>>({});
  const [isBulkEdit, setIsBulkEdit] = useState(false);
  
  const roles = ['مدير', 'وكيل', 'موجه طلابي', 'رائد نشاط', 'محضر مختبر', 'إداري', 'حارس'];

  const openAddModal = () => {
      setModalMode('add');
       const maxSort = Math.max(...admins.map(a => a.sortIndex || 0), 0);
      setCurrentAdmin({
          id: `a-${Date.now()}`,
          name: '',
          role: roles[1],
          phone: '',
          waitingQuota: 0,
          sortIndex: maxSort + 1
      });
      setShowModal(true);
  };

  const openEditModal = (admin: Admin) => {
      setModalMode('edit');
      setCurrentAdmin({ ...admin });
      setShowModal(true);
  };

  const saveAdmin = () => {
      if (!currentAdmin.name) return alert("يرجى إدخال الاسم");
      const adminToSave = currentAdmin as Admin;
      
      if (modalMode === 'add') {
          setAdmins(prev => [...prev, adminToSave]);
      } else {
          setAdmins(prev => prev.map(a => a.id === adminToSave.id ? adminToSave : a));
      }
      setShowModal(false);
  };

  const removeAdmin = (id: string) => {
      if (confirm("هل أنت متأكد من حذف هذا السجل؟")) {
          setAdmins(prev => prev.filter(a => a.id !== id));
      }
  };
  
    const moveAdmin = (id: string, direction: 'up' | 'down') => {
      const index = admins.findIndex(a => a.id === id);
      if (index === -1) return;
      
      const sortedAdmins = [...admins].sort((a,b) => (a.sortIndex||0) - (b.sortIndex||0));
      const currentIndex = sortedAdmins.findIndex(a => a.id === id);
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= sortedAdmins.length) return;
      
      const targetAdmin = sortedAdmins[targetIndex];
      const admin = sortedAdmins[currentIndex];
      
      setAdmins(prev => prev.map(a => {
          if (a.id === admin.id) return { ...a, sortIndex: targetAdmin.sortIndex };
          if (a.id === targetAdmin.id) return { ...a, sortIndex: admin.sortIndex };
          return a;
      }));
  };
  
  const handlePrint = () => {
      window.print();
  };
  
  const sortedAdmins = [...admins].sort((a,b) => (a.sortIndex || 0) - (b.sortIndex || 0));

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-primary flex items-center gap-2 mb-6 border-b border-slate-50 pb-2">
            <Zap size={20} /> الطاقم الإداري
        </h3>

        {/* Toolbar */}
        <div className="flex gap-2 mb-6">
            <Button onClick={openAddModal}>
                <Plus size={18} className="ml-2"/> إضافة إداري
            </Button>
             <Button 
                variant={isBulkEdit ? 'primary' : 'outline'} 
                onClick={() => setIsBulkEdit(!isBulkEdit)}
                className={isBulkEdit ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : ''}
            >
                {isBulkEdit ? <Check size={18} className="ml-2"/> : <Edit size={18} className="ml-2"/>}
                {isBulkEdit ? 'حفظ التعديلات' : 'تعديل سريع'}
            </Button>
            <Button variant="outline" onClick={handlePrint}>
                <Printer size={18} className="ml-2"/> طباعة
            </Button>
        </div>

        {/* Admins Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
             <table className="w-full text-right">
                <thead className="bg-[#f8fafc] text-sm text-gray-500 font-medium">
                    <tr>
                         <th className="p-4 w-12">#</th>
                         <th className="p-4">الاسم</th>
                         <th className="p-4">الدور الوظيفي</th>
                         <th className="p-4">الجوال</th>
                         <th className="p-4 text-center">نصاب الانتظار</th>
                         <th className="p-4 print:hidden">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="divide-y text-gray-700 text-sm">
                    {sortedAdmins.map((admin, idx) => (
                        <tr key={admin.id} className="hover:bg-blue-50/20 group">
                            <td className="p-4 text-gray-400">
                                 <div className="flex items-center gap-1">
                                    {!isBulkEdit && (
                                        <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                                            <button onClick={() => moveAdmin(admin.id, 'up')} disabled={idx===0} className="hover:text-primary"><ChevronUp size={12}/></button>
                                            <button onClick={() => moveAdmin(admin.id, 'down')} disabled={idx===sortedAdmins.length-1} className="hover:text-primary"><ChevronDown size={12}/></button>
                                        </div>
                                    )}
                                    {idx + 1}
                                </div>
                            </td>
                            <td className="p-4 font-bold flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs print:hidden font-bold">
                                    {admin.name.charAt(0)}
                                </div>
                                {isBulkEdit ? (
                                    <input value={admin.name} onChange={e => setAdmins(prev => prev.map(a => a.id === admin.id ? {...a, name: e.target.value} : a))} className="w-full p-1 border rounded focus:ring-2 focus:ring-primary outline-none" />
                                ) : admin.name}
                            </td>
                            <td className="p-4">
                                {isBulkEdit ? (
                                    <select value={admin.role} onChange={e => setAdmins(prev => prev.map(a => a.id === admin.id ? {...a, role: e.target.value} : a))} className="w-full p-1 border rounded focus:ring-2 focus:ring-primary outline-none">
                                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                ) : <Badge variant="neutral" className="bg-white border text-gray-600">{admin.role}</Badge>}
                            </td>
                            <td className="p-4 font-mono">
                                 {isBulkEdit ? (
                                    <input value={admin.phone} onChange={e => setAdmins(prev => prev.map(a => a.id === admin.id ? {...a, phone: e.target.value} : a))} className="w-full p-1 border rounded text-right dir-ltr" />
                                ) : admin.phone}
                            </td>
                            <td className="p-4 text-center font-bold text-blue-600">
                                 {isBulkEdit ? (
                                    <input type="number" value={admin.waitingQuota || 0} onChange={e => setAdmins(prev => prev.map(a => a.id === admin.id ? {...a, waitingQuota: Number(e.target.value)} : a))} className="w-16 p-1 border rounded text-center" />
                                ) : (admin.waitingQuota || 0)}
                            </td>
                            <td className="p-4 print:hidden">
                                {!isBulkEdit && (
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(admin)} className="text-blue-400 hover:text-blue-600"><Edit size={16}/></button>
                                        <button onClick={() => removeAdmin(admin.id)} className="text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                     {admins.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-10 text-gray-400 italic">لا يوجد إداريين مضافين</td>
                        </tr>
                    )}
                </tbody>
             </table>
        </div>

        {/* Modal */}
        {showModal && (
             <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                 <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="font-bold text-xl">{modalMode === 'add' ? 'إضافة إداري جديد' : 'تعديل بيانات إداري'}</h3>
                        <button onClick={() => setShowModal(false)}><X className="text-gray-400 hover:text-red-500"/></button>
                    </div>
                     <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold mb-1">الاسم</label>
                            <input value={currentAdmin.name} onChange={e => setCurrentAdmin({...currentAdmin, name: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">الدور الوظيفي</label>
                            <select value={currentAdmin.role} onChange={e => setCurrentAdmin({...currentAdmin, role: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-primary">
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">رقم الجوال</label>
                            <input value={currentAdmin.phone} onChange={e => setCurrentAdmin({...currentAdmin, phone: e.target.value})} className="w-full p-2 border rounded-lg outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-1">نصاب الانتظار</label>
                            <input type="number" value={currentAdmin.waitingQuota} onChange={e => setCurrentAdmin({...currentAdmin, waitingQuota: Number(e.target.value)})} className="w-full p-2 border rounded-lg outline-none focus:border-primary" />
                        </div>
                     </div>
                     <div className="flex justify-end gap-2 mt-8 pt-4 border-t">
                        <Button variant="ghost" onClick={() => setShowModal(false)}>إلغاء</Button>
                        <Button onClick={saveAdmin}>حفظ</Button>
                    </div>
                 </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Step7Admins;

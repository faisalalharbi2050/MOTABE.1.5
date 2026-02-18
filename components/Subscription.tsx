import React from 'react';
import { CreditCard } from 'lucide-react';

const Subscription: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-slate-400">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
        <CreditCard size={40} className="text-slate-300" />
      </div>
      <h2 className="text-xl font-bold text-slate-600">الاشتراك والفوترة</h2>
      <p className="text-sm">قريباً...</p>
    </div>
  );
};

export default Subscription;

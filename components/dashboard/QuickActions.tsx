import React from 'react';
import { 
  Clock, 
  Users, 
  GraduationCap, 
  Calendar, 
  LayoutGrid,
  MessageSquare,
  Settings
} from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (tab: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions = [
    { 
      label: 'إرسال رسالة', 
      icon: <MessageSquare size={24} strokeWidth={2} />, 
      onClick: () => onNavigate('messages'),
    },
    { 
      label: 'إضافة انتظار', 
      icon: <Clock size={24} strokeWidth={2} />, 
      onClick: () => onNavigate('manual'),
    },
    { 
      label: 'إعدادات الجدول', 
      icon: <Settings size={24} strokeWidth={2} />, 
      onClick: () => onNavigate('schedule_settings'),
    },
    { 
      label: 'الجدول العام', 
      icon: <Calendar size={24} strokeWidth={2} />, 
      onClick: () => onNavigate('report'),
    },
    { 
      label: 'جدول معلم', 
      icon: <Users size={24} strokeWidth={2} />, 
      onClick: () => onNavigate('report'),
    },
    { 
      label: 'جدول فصل', 
      icon: <LayoutGrid size={24} strokeWidth={2} />, 
      onClick: () => onNavigate('report'),
    }
  ];

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-center h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-1 h-6 bg-[#655ac1] rounded-full"></div>
        <h3 className="text-lg font-bold text-slate-800">إجراءات سريعة</h3>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group bg-white"
          >
            <div className={`p-3 rounded-xl mb-2 bg-slate-100 text-[#8779fb] group-hover:scale-110 transition-transform`}>
              {action.icon}
            </div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-[#655ac1] transition-colors">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;



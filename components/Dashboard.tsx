import React from 'react';
import { 
  Users, 
  GraduationCap, 
  School, 
  UserCheck,
  MessageSquare,
  CreditCard,
  Calendar,
  Layers, 
  MoreVertical,
  Minus,
  Plus,
  Briefcase,
  LayoutGrid,
  BarChart3
} from 'lucide-react';
import { 
  SchoolInfo, 
  Teacher, 
  ClassInfo, 
  Message, 
  CalendarEvent, 
  DailyScheduleItem, 
  SubscriptionInfo 
} from '../types';
import StatsCard from './dashboard/StatsCard';
import QuickActions from './dashboard/QuickActions';
import CalendarWidget from './dashboard/CalendarWidget';
import DailySchedule from './dashboard/DailySchedule';
import RecentMessages from './dashboard/RecentMessages';

// --- Sub-components for Dashboard ---



const WeeklyPerformanceChart: React.FC = () => (
    <div className="h-full w-full flex items-end justify-between px-2 pb-2 gap-2 sm:gap-4">
        {/* Mock Chart Bars */}
        {[65, 80, 45, 90, 75, 40, 20].map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end">
                <div className="w-full max-w-[30px] sm:max-w-[40px] bg-slate-50 rounded-t-xl relative h-[80%] overflow-hidden flex items-end">
                    <div className="w-full bg-[#655ac1] rounded-t-xl transition-all duration-1000 ease-out group-hover:bg-[#7e74da]" style={{ height: `${val}%` }}></div>
                    <div className="absolute bottom-0 w-full bg-rose-300/50 rounded-t-xl transition-all duration-1000 ease-out" style={{ height: `${Math.max(0, 100-val-20)}%` }}></div>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                    {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'][i]}
                </span>
            </div>
        ))}
    </div>
);

interface DashboardProps {
  schoolInfo: SchoolInfo;
  teachers: Teacher[];
  classes: ClassInfo[];
  messages: Message[];
  events: CalendarEvent[];
  todaySchedule: DailyScheduleItem[];
  tomorrowSchedule: DailyScheduleItem[];
  subscription: SubscriptionInfo;
  onNavigate: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  schoolInfo,
  teachers,
  classes,
  messages,
  events,
  todaySchedule,
  tomorrowSchedule,
  subscription,
  onNavigate
}) => {
  // Calculated stats
  const teacherCount = teachers.length;
  const classCount = classes.length;
  const staffCount = 0; // Placeholder
  const todayName = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(new Date());
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowName = new Intl.DateTimeFormat('ar-SA', { weekday: 'long' }).format(tomorrow);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. General Stats Title & Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-700 mb-4 px-2 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-[#655ac1]" />
          الإحصائيات العامة
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard 
            title="المعلمون" 
            value={teacherCount} 
            icon={Users} 
            color="bg-slate-100" // Prop kept for compatibility but ignored by new styles
            />
            <StatsCard 
            title="الطلاب" 
            value={schoolInfo.schoolName ? "1200" : "0"} 
            icon={GraduationCap} 
            color="bg-slate-100" 
            />
            <StatsCard 
            title="الإداريون" 
            value={staffCount} 
            icon={Briefcase} 
            color="bg-slate-100" 
            />
            <StatsCard 
            title="الفصول" 
            value={classCount} 
            icon={LayoutGrid} 
            color="bg-slate-100" 
            />
        </div>
      </div>

      {/* 2. Quick Actions & Calendar (Row 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch h-[450px]">
        <div className="lg:col-span-4 h-full">
           <QuickActions onNavigate={onNavigate} />
        </div>
        <div className="lg:col-span-8 h-full">
           <CalendarWidget events={events} onAddEvent={() => console.log('Add event')} />
        </div>
      </div>

      {/* 3. Today's Schedule & Recent Messages (Row 3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-8 min-h-[400px]">
           <DailySchedule schedule={todaySchedule} title={`جدول يوم ${todayName}`} />
        </div>
        <div className="lg:col-span-4 min-h-[400px]">
           <RecentMessages messages={messages} />
        </div>
      </div>

      {/* 4. Left: Messages & Package | Right: Tomorrow Schedule (Row 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
         
         {/* Tomorrow's Schedule (Right) */}
         <div className="lg:col-span-8 min-h-[400px]">
           <DailySchedule schedule={tomorrowSchedule} title={`جدول يوم ${tomorrowName}`} />
         </div>

         {/* Widgets (Left - Stacked) */}
         <div className="lg:col-span-4 space-y-4">
             {/* Circular Message Balance */}
             <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 h-[170px] flex items-center justify-between relative overflow-hidden">
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-500 mb-2">رصيد الرسائل</h4>
                    <p className="text-3xl font-black text-slate-800 mb-1">{subscription.remainingMessages}</p>
                    <p className="text-xs text-slate-400 font-bold">من أصل {subscription.totalMessages}</p>
                </div>
                <div className="w-28 h-28 relative flex items-center justify-center">
                    <svg className="transform -rotate-90 w-full h-full">
                        <circle cx="56" cy="56" r="46" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                        <circle cx="56" cy="56" r="46" stroke="#3b82f6" strokeWidth="12" fill="transparent" strokeDasharray={289} strokeDashoffset={289 - (289 * (subscription.remainingMessages / subscription.totalMessages))} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                        <MessageSquare size={24} />
                    </div>
                </div>
             </div>

             {/* Circular Current Package */}
             <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 h-[170px] flex items-center justify-between relative overflow-hidden">
                <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-500 mb-2">الباقة الحالية</h4>
                    <p className="text-lg font-black text-slate-800 mb-1">{subscription.planName}</p>
                    <p className="text-xs text-slate-400 font-bold">تنتهي: <span className="dir-ltr">{subscription.endDate}</span></p>
                </div>
                <div className="w-28 h-28 relative flex items-center justify-center">
                    <svg className="transform -rotate-90 w-full h-full">
                         <circle cx="56" cy="56" r="46" stroke="#f1f5f9" strokeWidth="12" fill="transparent" />
                         <circle cx="56" cy="56" r="46" stroke="#10b981" strokeWidth="12" fill="transparent" strokeDasharray={289} strokeDashoffset={289 * 0.25} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                        <CreditCard size={24} />
                    </div>
                </div>
             </div>
         </div>

      </div>
    </div>
  );
};


export default Dashboard;


import React, { useState, useEffect, useRef } from 'react';
import { 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Clock,
  Calendar,
  Settings,
  User,
  LayoutGrid,
  Save,
  Trash2
} from 'lucide-react';
import { SchoolInfo } from '../types';

interface HeaderProps {
  schoolInfo: SchoolInfo;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  onNavigate: (tab: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  schoolInfo, 
  isSidebarOpen, 
  setIsSidebarOpen, 
  onNavigate,
  onLogout 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000 * 60); // Update every minute
    return () => clearInterval(timer);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentTime);

  const gregorianDate = new Intl.DateTimeFormat('ar-SA', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(currentTime);

  const timeString = new Intl.DateTimeFormat('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(currentTime);

  return (
    <header className="sticky top-0 z-40 bg-[#fcfbff] px-4 pt-4 pb-2">
      <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm px-4 md:px-6 py-3 flex justify-between items-center relative">
          
          {/* SECTION 1: User Greeting & Mobile Menu (Start/Right) */}
          <div className="flex items-center gap-3 md:gap-4">
             {/* Mobile Menu Button */}
             <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
                className="lg:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600"
              >
                {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

             {/* User Info & Profile Popover */}
             <div className="relative" ref={profileRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors text-right"
                >
                    <div className="w-12 h-12 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center text-[#655ac1]">
                        <User size={24} />
                    </div>
                    <div>
                        <h1 className="text-base md:text-lg font-bold text-slate-800 flex items-center gap-1">
                            مرحباً، {schoolInfo.principal || 'المدير'} <span className="text-lg animate-wave">👋</span>
                        </h1>
                        {/* Removed system name text as requested */}
                    </div>
                </button>

                {/* Profile Popover */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 z-50 overflow-hidden transform transition-all animate-fade-in">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                      <h3 className="font-bold text-slate-800 mb-3 text-sm">الملف الشخصي</h3>
                      <div className="space-y-3">
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">اسم المستخدم</label>
                            <input 
                              type="text" 
                              defaultValue={schoolInfo.principal} 
                              className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#655ac1]"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">رقم الجوال</label>
                            <input 
                              type="text" 
                              defaultValue={schoolInfo.principalMobile || schoolInfo.phone} 
                              className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#655ac1] dir-ltr text-right"
                            />
                         </div>
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">البريد الإلكتروني</label>
                            <input 
                              type="email" 
                              defaultValue={schoolInfo.email} 
                              className="w-full text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-[#655ac1] dir-ltr text-right"
                            />
                         </div>
                      </div>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                          <Save size={16} className="text-[#655ac1]" />
                          حفظ التغييرات
                      </button>
                      <button className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                          <Trash2 size={16} className="text-rose-500" />
                          حذف الحساب
                      </button>
                    </div>
                  </div>
                )}
             </div>
          </div>

          {/* SECTION 2: Date & Time (Center) - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4 bg-slate-50/80 px-6 py-3 rounded-full border border-slate-100 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-sm">
               {/* Time */}
               <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                   <Clock size={18} className="text-[#655ac1]" />
                   <span className="text-sm font-bold text-slate-600 font-mono pt-0.5 dir-ltr">{timeString}</span>
               </div>
               {/* Date */}
               <div className="flex items-center gap-2">
                   <Calendar size={18} className="text-slate-400" />
                   <span className="text-xs font-bold text-slate-600">{gregorianDate}</span>
                   <span className="text-xs text-slate-300 mx-1">|</span>
                   <span className="text-xs font-bold text-slate-500">{hijriDate}</span>
               </div>
          </div>


          {/* SECTION 3: Actions (End/Left) */}
          <div className="flex items-center gap-2 md:gap-3">
               
               {/* Notification */}
               <button 
                  onClick={() => onNavigate('messages')}
                  className="group relative w-12 h-12 flex items-center justify-center rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-600 hover:text-[#655ac1] transition-colors"
                  title="الإشعارات & المهام"
               >
                  <Bell size={22} />
                  <span className="absolute top-3 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
               </button>

               {/* Divider */}
               <div className="h-10 w-px bg-slate-200 mx-1 hidden md:block"></div>

               {/* Logout */}
               <button 
                  onClick={onLogout} 
                  className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-4 py-2 rounded-xl transition-all font-bold text-sm hover:shadow-sm"
                  title="تسجيل الخروج"
               >
                  <span className="hidden md:inline">خروج</span>
                  <LogOut size={20} /> 
               </button>
          </div>
      </div>
    </header>
  );
};

export default Header;

import React from 'react';
import { MessageSquare, Phone, Mail, Eye } from 'lucide-react';
import { Message } from '../../types';

interface RecentMessagesProps {
  messages: Message[];
}

const RecentMessages: React.FC<RecentMessagesProps> = ({ messages = [] }) => {
  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#8779fb]">
                <MessageSquare size={18} />
            </div>
            آخر الرسائل
        </h3>
        <button className="text-xs font-bold text-[#8779fb] hover:underline">عرض الكل ({messages.length})</button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 max-h-[300px]">
        {messages.map((msg, index) => (
          <div key={msg.id || index} className="p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
            {/* Icon */}
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#8779fb] shadow-sm shrink-0 mt-1">
                <MessageSquare size={16} />
            </div>

            {/* Content Info */}
            <div className="flex-1">
                {/* 1. Title/Summary */}
                <h4 className="font-bold text-slate-800 text-sm mb-1 leading-snug line-clamp-1">{msg.content}</h4>
                
                {/* 2. Sender / Recipient */}
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-600">{msg.sender}</span>
                    <span className="text-[10px] text-slate-400">إلى</span>
                    <span className="text-xs font-bold text-slate-600">{msg.recipient}</span>
                </div>

                {/* 3. Time & Action */}
                <div className="flex items-center justify-between border-t border-slate-200/50 pt-2">
                    <span className="text-[10px] text-slate-400 font-bold dir-ltr">
                        {new Date(msg.timestamp).toLocaleTimeString('ar-SA', {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-[#8779fb] hover:bg-[#8779fb]/10 px-2 py-1 rounded-md transition-colors">
                        <Eye size={14} />
                        عرض التفاصيل
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentMessages;

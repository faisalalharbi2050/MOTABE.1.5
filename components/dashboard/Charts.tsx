import React from 'react';

// Circular Progress Component
const CircularProgress = ({ value, max, color, size = 120, strokeWidth = 10, label, subLabel }: { value: number, max: number, color: string, size?: number, strokeWidth?: number, label?: string, subLabel?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            className="text-slate-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          <circle
            className={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-slate-700">{value}</span>
          <span className="text-xs text-slate-400">/ {max}</span>
        </div>
      </div>
      {label && <p className="mt-2 text-sm font-medium text-slate-600">{label}</p>}
      {subLabel && <p className="text-xs text-slate-400">{subLabel}</p>}
    </div>
  );
};

// Simple Bar Chart Component
const BarChart = ({ data, color }: { data: { label: string, value: number }[], color: string }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="flex items-end justify-between gap-2 h-40 w-full pt-4">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 gap-2 h-full">
            <div className="w-full bg-slate-50 rounded-t-lg relative group flex-1 flex items-end overflow-hidden">
                <div 
                    className={`w-full ${color} rounded-t-lg transition-all duration-500 ease-out`}
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded transition-opacity whitespace-nowrap z-10">
                        {item.value}
                    </div>
                </div>
            </div>
            <span className="text-xs text-slate-500 font-medium truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export { CircularProgress, BarChart };

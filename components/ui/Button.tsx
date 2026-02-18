import React from "react";
import { LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  children?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export function Button({ 
  children, 
  variant = "primary", 
  size = "md",
  icon: Icon, 
  className = "", 
  isLoading,
  ...props 
}: ButtonProps) {
  
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-base",
    lg: "px-6 py-3 text-lg"
  };

  const variants = {
    primary: "bg-[#655ac1] text-white hover:bg-[#8779fb] shadow-indigo-200",
    secondary: "bg-[#e5e1fe] text-[#655ac1] hover:bg-[#d6d0fd]",
    outline: "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-[#655ac1]",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900",
  };

  return (
    <button className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
}

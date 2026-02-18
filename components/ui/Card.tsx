import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  noHover?: boolean;
}

export function Card({ children, className = "", noHover = false, ...props }: CardProps) {
  return (
    <div 
      className={`glass-card p-6 ${!noHover ? 'hover:shadow-lg' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

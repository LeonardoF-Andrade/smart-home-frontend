import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className }: CardProps) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: ReactNode;
}

export const CardContent = ({ children }: CardContentProps) => (
  <div className="p-4">{children}</div>
);

import React from 'react';

interface SimplePageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const SimplePageContainer: React.FC<SimplePageContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`h-full w-full flex flex-col items-center justify-center relative ${className}`} style={{ height: '100%' }}>
      <div className="max-w-md mx-auto px-6 text-center relative z-10 animate-fade-in">
        {children}
      </div>
    </div>
  );
};

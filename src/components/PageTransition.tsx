import React, { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  pageKey: string;
  direction?: 'up' | 'down';
}

export const PageTransition: React.FC<PageTransitionProps> = ({ 
  children, 
  pageKey, 
  direction = 'up' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentContent, setCurrentContent] = useState(children);

  useEffect(() => {
    // Start exit animation
    setIsVisible(false);
    
    // Wait for exit animation, then update content and enter
    const timer = setTimeout(() => {
      setCurrentContent(children);
      setIsVisible(true);
    }, 250);

    return () => clearTimeout(timer);
  }, [pageKey, children]);

  useEffect(() => {
    // Initial mount
    setIsVisible(true);
  }, []);

  return (
    <div 
      className={`w-full h-full transition-all duration-500 ease-out ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : direction === 'up' 
            ? 'translate-y-full opacity-0' 
            : '-translate-y-full opacity-0'
      }`}
    >
      {currentContent}
    </div>
  );
};
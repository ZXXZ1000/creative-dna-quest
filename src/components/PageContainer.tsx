import React from 'react';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';

interface PageContainerProps {
  children: React.ReactNode;
  onSwipeUp?: () => void;
  showSwipeIndicator?: boolean;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  onSwipeUp,
  showSwipeIndicator = false,
  className = ''
}) => {
  const { touchHandlers, swipeProgress, isDragging } = useSwipeNavigation(
    onSwipeUp || (() => {}),
    window.innerHeight * 0.3
  );

  return (
    <div 
      className={`page-container glow-bg ${className}`}
      {...(onSwipeUp ? touchHandlers : {})}
      style={{
        transform: isDragging ? `translateY(${swipeProgress * 50}px)` : 'translateY(0)',
        transition: isDragging ? 'none' : 'transform 0.3s ease-out'
      }}
    >
      <div className="page-content animate-fade-in">
        {children}
      </div>
      
      {showSwipeIndicator && (
        <div className="swipe-indicator">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-6 h-1 bg-primary rounded-full opacity-50"></div>
            <span className="text-xs">Swipe up to continue</span>
          </div>
        </div>
      )}
    </div>
  );
};
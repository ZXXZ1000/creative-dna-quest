import { useState, useCallback, useRef } from 'react';
import { SwipeState } from '../types/test';

export const useSwipeNavigation = (onSwipeUp: () => void, threshold: number = 100) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startY: 0,
    currentY: 0,
    threshold
  });

  const touchStartRef = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = touch.clientY;
    setSwipeState(prev => ({
      ...prev,
      isDragging: true,
      startY: touch.clientY,
      currentY: touch.clientY
    }));
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeState.isDragging) return;
    
    const touch = e.touches[0];
    const deltaY = touchStartRef.current - touch.clientY;
    
    setSwipeState(prev => ({
      ...prev,
      currentY: touch.clientY
    }));

    // Prevent default scroll behavior during swipe
    if (deltaY > 0) {
      e.preventDefault();
    }
  }, [swipeState.isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isDragging) return;

    const deltaY = touchStartRef.current - swipeState.currentY;
    
    if (deltaY > threshold) {
      onSwipeUp();
    }

    setSwipeState(prev => ({
      ...prev,
      isDragging: false,
      startY: 0,
      currentY: 0
    }));
  }, [swipeState, threshold, onSwipeUp]);

  const swipeProgress = Math.min(
    Math.max((touchStartRef.current - swipeState.currentY) / threshold, 0),
    1
  );

  return {
    swipeProgress,
    isDragging: swipeState.isDragging,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};
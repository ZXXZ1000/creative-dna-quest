import { useState, useCallback, useRef } from 'react';

interface SwipeState {
  isDragging: boolean;
  startY: number;
  currentY: number;
  dragOffset: number;
  isTransitioning: boolean;
}

interface UseEnhancedSwipeNavigationOptions {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enableUp?: boolean;
  enableDown?: boolean;
  damping?: number;
}

export const useEnhancedSwipeNavigation = ({
  onSwipeUp,
  onSwipeDown,
  threshold = 100,
  enableUp = true,
  enableDown = true,
  damping = 0.3
}: UseEnhancedSwipeNavigationOptions) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    startY: 0,
    currentY: 0,
    dragOffset: 0,
    isTransitioning: false
  });

  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const lastYRef = useRef(0);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (swipeState.isTransitioning) return;
    
    const touch = e.touches[0];
    const now = Date.now();
    
    setSwipeState(prev => ({
      ...prev,
      isDragging: true,
      startY: touch.clientY,
      currentY: touch.clientY,
      dragOffset: 0
    }));

    velocityRef.current = 0;
    lastTimeRef.current = now;
    lastYRef.current = touch.clientY;
  }, [swipeState.isTransitioning]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipeState.isDragging) return;

    const touch = e.touches[0];
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    const deltaY = touch.clientY - lastYRef.current;

    // 计算速度
    if (deltaTime > 0) {
      velocityRef.current = deltaY / deltaTime;
    }

    let offset = touch.clientY - swipeState.startY;
    
    // 应用阻尼效果
    const direction = offset > 0 ? 1 : -1;
    const absOffset = Math.abs(offset);
    
    // 如果超出阈值，应用阻尼
    if (absOffset > threshold) {
      const excessOffset = absOffset - threshold;
      const dampedExcess = excessOffset * damping;
      offset = direction * (threshold + dampedExcess);
    }

    // 检查边界限制
    if ((offset > 0 && !enableDown) || (offset < 0 && !enableUp)) {
      offset *= 0.2; // 强阻尼
    }

    setSwipeState(prev => ({
      ...prev,
      currentY: touch.clientY,
      dragOffset: offset
    }));

    lastTimeRef.current = now;
    lastYRef.current = touch.clientY;

    // 防止默认滚动行为
    if (Math.abs(offset) > 10) {
      e.preventDefault();
    }
  }, [swipeState.isDragging, swipeState.startY, threshold, damping, enableDown, enableUp]);

  const handleTouchEnd = useCallback(() => {
    if (!swipeState.isDragging) return;

    const velocity = velocityRef.current;
    const offset = swipeState.dragOffset;
    const absVelocity = Math.abs(velocity);
    const absOffset = Math.abs(offset);

    setSwipeState(prev => ({
      ...prev,
      isDragging: false,
      isTransitioning: true
    }));

    // 判断是否触发滑动
    let shouldTrigger = false;
    
    // 基于距离或速度判断
    if (absOffset > threshold || absVelocity > 0.5) {
      if (offset < 0 && enableUp) {
        // 向上滑动
        onSwipeUp?.();
        shouldTrigger = true;
      } else if (offset > 0 && enableDown) {
        // 向下滑动
        onSwipeDown?.();
        shouldTrigger = true;
      }
    }

    // 重置状态
    setTimeout(() => {
      setSwipeState(prev => ({
        ...prev,
        dragOffset: 0,
        isTransitioning: false,
        startY: 0,
        currentY: 0
      }));
    }, shouldTrigger ? 300 : 200);

  }, [swipeState.isDragging, swipeState.dragOffset, threshold, enableUp, enableDown, onSwipeUp, onSwipeDown]);

  // 计算滑动进度 (0-1)
  const swipeProgress = Math.min(Math.abs(swipeState.dragOffset) / threshold, 1);

  // 计算滑动方向 (-1: 向上, 0: 无, 1: 向下)
  const swipeDirection = swipeState.dragOffset === 0 ? 0 : swipeState.dragOffset > 0 ? 1 : -1;

  return {
    swipeProgress,
    swipeDirection,
    isDragging: swipeState.isDragging,
    dragOffset: swipeState.dragOffset,
    isTransitioning: swipeState.isTransitioning,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd
    }
  };
};
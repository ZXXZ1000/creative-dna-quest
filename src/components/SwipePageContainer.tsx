import React, { useState, useRef, useEffect } from 'react';

interface SwipePageContainerProps {
  children: React.ReactNode[];
  currentIndex: number;
  onPageChange: (index: number) => void;
  enableSwipe?: boolean;
}

export const SwipePageContainer: React.FC<SwipePageContainerProps> = ({
  children,
  currentIndex,
  onPageChange,
  enableSwipe = true
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);

  // 改为基于容器高度进行计算，避免依赖视口
  const getContainerHeight = () => containerRef.current?.clientHeight ?? (window.visualViewport?.height ?? window.innerHeight);

  // 滑动阈值（基于容器高度）
  const threshold = getContainerHeight() * 0.25; // 降低阈值，更容易滑动

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enableSwipe || isTransitioning) return;
    
    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    lastTimeRef.current = Date.now();
    setIsDragging(true);
    velocityRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !enableSwipe) return;

    const touch = e.touches[0];
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTimeRef.current;
    const deltaY = touch.clientY - currentYRef.current;
    
    if (deltaTime > 0) {
      velocityRef.current = deltaY / deltaTime;
    }

    const offset = touch.clientY - startYRef.current;
    
    // 滑动范围（基于容器高度）
    const maxOffset = getContainerHeight() * 0.5; // 减小最大滑动距离
    let finalOffset = Math.max(-maxOffset, Math.min(maxOffset, offset));
    
    // 更柔和的边界阻尼效果
    const dampingStrength = 0.25;
    const boundaryThreshold = getContainerHeight() * 0.15;
    
    // 在第一页向下滑动时添加阻尼
    if (currentIndex === 0 && finalOffset > 0) {
      if (finalOffset > boundaryThreshold) {
        const excess = finalOffset - boundaryThreshold;
        finalOffset = boundaryThreshold + excess * dampingStrength;
      }
    }
    
    // 在最后一页向上滑动时添加阻尼
    if (currentIndex === children.length - 1 && finalOffset < 0) {
      if (Math.abs(finalOffset) > boundaryThreshold) {
        const excess = Math.abs(finalOffset) - boundaryThreshold;
        finalOffset = -(boundaryThreshold + excess * dampingStrength);
      }
    }

    setDragOffset(finalOffset);
    currentYRef.current = touch.clientY;
    lastTimeRef.current = currentTime;

    // 防止默认滚动
    e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging || !enableSwipe) return;

    setIsDragging(false);
    setIsTransitioning(true);

    const velocity = Math.abs(velocityRef.current);
    const offset = dragOffset;
    const absOffset = Math.abs(offset);
    
    // 判断是否应该切换页面
    let shouldChangePage = false;
    let newIndex = currentIndex;

    // 页面切换判断
    const velocityThreshold = 0.25; // 进一步降低速度阈值
    const distanceThreshold = threshold;

    // 基于距离或速度判断
    const shouldTriggerByDistance = absOffset > distanceThreshold;
    const shouldTriggerByVelocity = velocity > velocityThreshold;

    if (shouldTriggerByDistance || shouldTriggerByVelocity) {
      if (offset < 0 && currentIndex < children.length - 1) {
        // 向上滑动到下一页
        shouldChangePage = true;
        newIndex = currentIndex + 1;
      } else if (offset > 0 && currentIndex > 0) {
        // 向下滑动到上一页  
        shouldChangePage = true;
        newIndex = currentIndex - 1;
      }
    }

    // 边界限制检查
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= children.length) newIndex = children.length - 1;

    if (shouldChangePage && newIndex !== currentIndex) {
      onPageChange(newIndex);
    }

    // 重置偏移
    setDragOffset(0);
    
    // 动画完成后重置状态
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  };

  // 当外部改变currentIndex时，确保容器位置正确
  useEffect(() => {
    if (!isDragging && !isTransitioning) {
      setDragOffset(0);
    }
  }, [currentIndex, isDragging, isTransitioning]);

  const getTransform = (index: number) => {
    const baseTranslateY = (index - currentIndex) * getContainerHeight();
    const currentOffset = isDragging ? dragOffset : 0;
    
    return `translateY(${baseTranslateY + currentOffset}px)`;
  };

  const getTransition = () => {
    if (isDragging) return 'none';
    return 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden touch-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        touchAction: 'none',
        background: '#ffffff',
        height: '100%'
      }}
    >
      {children.map((child, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full"
          style={{
            transform: getTransform(index),
            transition: getTransition(),
            willChange: 'transform'
          }}
        >
          {child}
        </div>
      ))}
      {/* 页面指示器已移除（不再显示定位条） */}
    </div>
  );
};

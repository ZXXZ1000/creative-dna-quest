import { useState, useEffect } from 'react';

interface ResponsiveConfig {
  baseWidth: number;
  baseHeight: number;
  minScale: number;
  maxScale: number;
}

interface ResponsiveLayout {
  scale: number;
  containerWidth: number;
  containerHeight: number;
  isLandscape: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  aspectRatio: number;
  arBand: 'tall' | 'standard' | 'wide';
}

export const useResponsiveLayout = (config?: ResponsiveConfig): ResponsiveLayout => {
  const defaultConfig: ResponsiveConfig = {
    baseWidth: 375, // iPhone 标准宽度
    baseHeight: 812, // iPhone 标准高度
    minScale: 0.6,
    maxScale: 1.5
  };

  const finalConfig = { ...defaultConfig, ...config };

  const [layout, setLayout] = useState<ResponsiveLayout>(() => {
    if (typeof window === 'undefined') {
      return {
        scale: 1,
        containerWidth: finalConfig.baseWidth,
        containerHeight: finalConfig.baseHeight,
        isLandscape: false,
        deviceType: 'mobile',
        aspectRatio: finalConfig.baseWidth / finalConfig.baseHeight,
        arBand: 'standard'
      };
    }

    return calculateLayout();
  });

  function calculateLayout(): ResponsiveLayout {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const isLandscape = viewportWidth > viewportHeight;
    const aspectRatio = viewportWidth / viewportHeight;

    // 确定设备类型
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'mobile';
    if (viewportWidth >= 768 && viewportWidth < 1024) {
      deviceType = 'tablet';
    } else if (viewportWidth >= 1024) {
      deviceType = 'desktop';
    }

    // 智能缩放算法
    let scale = 1;
    let containerWidth = viewportWidth;
    let containerHeight = viewportHeight;

    if (deviceType === 'mobile') {
      // 手机：基于宽度缩放，保持纵横比
      scale = Math.min(viewportWidth / finalConfig.baseWidth, viewportHeight / finalConfig.baseHeight);
      scale = Math.max(finalConfig.minScale, Math.min(finalConfig.maxScale, scale));
      
      containerWidth = finalConfig.baseWidth * scale;
      containerHeight = finalConfig.baseHeight * scale;
    } else if (deviceType === 'tablet') {
      // 平板：智能适配，考虑横竖屏
      if (isLandscape) {
        // 横屏平板：限制高度，允许更宽的布局
        scale = Math.min(viewportHeight / finalConfig.baseHeight, 1.2);
        containerWidth = Math.min(viewportWidth, finalConfig.baseWidth * scale * 1.5);
        containerHeight = finalConfig.baseHeight * scale;
      } else {
        // 竖屏平板：类似手机但允许更大的缩放
        scale = Math.min(viewportWidth / finalConfig.baseWidth, viewportHeight / finalConfig.baseHeight);
        scale = Math.max(0.8, Math.min(1.3, scale));
        
        containerWidth = finalConfig.baseWidth * scale;
        containerHeight = Math.min(viewportHeight, finalConfig.baseHeight * scale);
      }
    } else {
      // 桌面：居中显示，保持合理大小
      scale = Math.min(viewportWidth / (finalConfig.baseWidth * 2), viewportHeight / finalConfig.baseHeight);
      scale = Math.max(0.8, Math.min(1.5, scale));
      
      containerWidth = finalConfig.baseWidth * scale;
      containerHeight = finalConfig.baseHeight * scale;
    }

    // 纵横比分段：更易做按比例的微调
    let arBand: 'tall' | 'standard' | 'wide' = 'standard';
    if (aspectRatio < 0.58) arBand = 'tall'; // 接近 9:16 或更高
    else if (aspectRatio > 0.75) arBand = 'wide'; // 接近 3:4 或更宽

    return {
      scale,
      containerWidth,
      containerHeight,
      isLandscape,
      deviceType,
      aspectRatio,
      arBand
    };
  }

  useEffect(() => {
    const handleResize = () => {
      setLayout(calculateLayout());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return layout;
};

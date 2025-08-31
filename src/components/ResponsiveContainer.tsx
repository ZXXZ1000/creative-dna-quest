import React from 'react';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  layoutMode?: 'fluid' | 'fixed';
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ 
  children, 
  className = '',
  layoutMode = 'fluid'
}) => {
  const layout = useResponsiveLayout();

  // 根据设备类型生成CSS变量
  const cssVars = {
    '--responsive-scale': layout.scale.toString(),
    '--container-width': `${layout.containerWidth}px`,
    '--container-height': `${layout.containerHeight}px`,
    '--base-font-size': `${16 * layout.scale}px`,
    '--base-spacing': `${8 * layout.scale}px`,
    '--device-type': layout.deviceType,
    '--ar': layout.aspectRatio.toString(),
  } as React.CSSProperties;

  // 容器样式
  const containerStyle: React.CSSProperties =
    layoutMode === 'fixed'
      ? {
          width: layout.containerWidth,
          height: layout.containerHeight,
          maxWidth: '100vw',
          maxHeight: '100vh',
          margin: '0 auto',
          position: 'relative',
          transform:
            layout.deviceType === 'desktop'
              ? `scale(${Math.min(
                  1,
                  window.innerWidth / layout.containerWidth,
                  window.innerHeight / layout.containerHeight
                )})`
              : 'none',
          transformOrigin: 'center center',
          overflow: 'hidden',
        }
      : {
          width: '100%',
          height: '100dvh',
          position: 'relative',
        };

  return (
    <div 
      className={`responsive-container ${className}`}
      style={{ ...cssVars, ...containerStyle }}
      data-device-type={layout.deviceType}
      data-orientation={layout.isLandscape ? 'landscape' : 'portrait'}
      data-ar-band={layout.arBand}
    >
      {children}
    </div>
  );
};

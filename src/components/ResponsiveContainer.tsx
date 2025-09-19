import React from 'react';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useCanvas } from '../contexts/CanvasContext';

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
  const canvas = useCanvas();

  // Prefer stage (AspectCanvas) size to compute scale for true consistency.
  const baseWidth = 375; // keep in sync with useResponsiveLayout
  const baseHeight = 812;
  const hasStage = canvas.width > 0 && canvas.height > 0;
  const stageScale = hasStage
    ? Math.min(canvas.width / baseWidth, canvas.height / baseHeight)
    : layout.scale;
  const stageAspect = hasStage ? canvas.width / canvas.height : layout.aspectRatio;

  // 根据设备类型生成CSS变量
  const cssVars = {
    '--responsive-scale': stageScale.toString(),
    '--container-width': hasStage ? `${canvas.width}px` : `${layout.containerWidth}px`,
    '--container-height': hasStage ? `${canvas.height}px` : `${layout.containerHeight}px`,
    '--base-font-size': `${16 * stageScale}px`,
    '--base-spacing': `${8 * stageScale}px`,
    '--device-type': layout.deviceType,
    '--ar': stageAspect.toString(),
  } as React.CSSProperties;

  // 容器样式
  const containerStyle: React.CSSProperties =
    layoutMode === 'fixed'
      ? {
          width: hasStage ? canvas.width : layout.containerWidth,
          height: hasStage ? canvas.height : layout.containerHeight,
          maxWidth: '100vw',
          maxHeight: '100vh',
          margin: '0 auto',
          position: 'relative',
          transform:
            layout.deviceType === 'desktop'
              ? `scale(${Math.min(
                  1,
                  (hasStage ? window.innerWidth / canvas.width : window.innerWidth / layout.containerWidth),
                  (hasStage ? window.innerHeight / canvas.height : window.innerHeight / layout.containerHeight)
                )})`
              : 'none',
          transformOrigin: 'center center',
          overflow: 'hidden',
        }
      : {
          width: '100%',
          height: '100%',
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

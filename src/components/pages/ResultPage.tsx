import React, { useRef, useState, useEffect } from 'react';
import { useCanvas } from '../../contexts/CanvasContext';
import html2canvas from 'html2canvas';
import { Logo } from '../../components/Logo';
import { CreativeProfile } from '../../types/test';

interface ResultPageProps {
  result: CreativeProfile;
  userName: string;
  userRegion?: string;
  onRestart: () => void;
  onShare: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ 
  result,
  userName, 
  userRegion, 
  onRestart,
  onShare
}) => {
  // Map of country/region names to flag emojis
  const regionToEmoji: Record<string, string> = {
    "United States": "🇺🇸",
    "Canada": "🇨🇦", 
    "United Kingdom": "🇬🇧",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Australia": "🇦🇺",
    "Japan": "🇯🇵",
    "China": "🇨🇳",
    "South Korea": "🇰🇷",
    "Singapore": "🇸🇬",
    "Other": "🌍"
  };
  
  const regionEmoji = userRegion ? (regionToEmoji[userRegion] || "🌍") : "";
  const exportRef = useRef<HTMLDivElement>(null);

  // Canvas size from fixed 9:18 wrapper
  const { width: canvasWidth, height: canvasHeight } = useCanvas();

  // 图片尺寸状态管理
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollWindowHeight, setScrollWindowHeight] = useState('76vh');
  const [overlayWidth, setOverlayWidth] = useState(0); // 图片显示宽度，用于按比例缩放用户名字号

  // ========== Username Position Presets (Adjustment Area) ==========
  // Edit the following presets to fine-tune the username position.
  // Coordinates x/y are normalized (0..1) relative to the background image.
  // - x: 0 = left edge, 1 = right edge
  // - y: 0 = top edge, 1 = bottom edge
  // Two categories due to image size differences:
  //   1) builder: applies to MAKER (BULIDER.png)
  //   2) default: applies to other 5 types (ORGANIZER/LIGHT-SEEKER/INNIVATOR/EXPLORER/CRAFTER)
  // Optionally add per-type overrides (uncomment and adjust).
  const POSITION_PRESETS: Record<string, { x: number; y: number; rotation: number; fontScale: number }> = {
    // fontScale: 字号 = fontScale * 图片显示宽度（可按需要微调）
    builder: { x: 0.25, y: 0.62, rotation: 0, fontScale: 0.05 },
    default: { x: 0.25, y: 0.58, rotation: 0, fontScale: 0.05 },
    // Example overrides (uncomment to use):
    // TIDY:   { x: 0.68, y: 0.32, rotation: 0 },
    // ILLUMA: { x: 0.70, y: 0.34, rotation: 0 },
    // REFORM: { x: 0.69, y: 0.33, rotation: 0 },
    // NOMAD:  { x: 0.69, y: 0.33, rotation: 0 },
    // VISUAL: { x: 0.69, y: 0.33, rotation: 0 },
  };

  // Toggle to visualize the anchor point for quick adjustments
  const DEBUG_USERNAME_POSITION = false;

  // Resolve position by type with two-category fallback
  const getUserNamePosition = () => {
    const type = result?.type || 'MAKER';
    // Per-type explicit override takes priority if defined in presets
    if (POSITION_PRESETS[type]) return POSITION_PRESETS[type];
    // Category-based fallback
    return type === 'MAKER' ? POSITION_PRESETS.builder : POSITION_PRESETS.default;
  };

  // 根据结果类型获取对应的背景图片
  const getBackgroundImage = () => {
    const imageMap: Record<string, string> = {
      'MAKER': '/assets/result-images/BULIDER.png',
      'TIDY': '/assets/result-images/ORGANIZER.png',
      'ILLUMA': '/assets/result-images/LIGHT-SEEKER.png',
      'REFORM': '/assets/result-images/INNIVATOR.png',
      'NOMAD': '/assets/result-images/EXPLORER.png',
      'VISUAL': '/assets/result-images/CRAFTER.png'
    };
    
    const imagePath = imageMap[result?.type || 'MAKER'] || '/assets/result-images/BULIDER.png';
    console.log('Attempting to load image:', imagePath, 'for result type:', result?.type);
    return imagePath;
  };

  // 动态计算图片尺寸和容器高度
  useEffect(() => {
    const loadImageAndCalculateDimensions = () => {
      const img = new Image();
      const imageSrc = getBackgroundImage();
      
      img.onload = () => {
        const windowWidth = canvasWidth || window.innerWidth;
        const imageAspectRatio = img.naturalHeight / img.naturalWidth;
        
        // 计算图片在当前窗口宽度下的显示高度
        const displayHeight = windowWidth * imageAspectRatio;
        
        // 设置图片原始尺寸
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
        
        // 设置容器高度为图片实际显示高度
        setContainerHeight(displayHeight);
        // 记录当前图片显示宽度（容器 clientWidth）
        requestAnimationFrame(() => {
          if (exportRef.current) {
            setOverlayWidth(exportRef.current.clientWidth);
          }
        });
        
        // 计算合适的滑动窗口高度
        const windowHeight = canvasHeight || window.innerHeight;
        const availableHeight = windowHeight - 80 - 80; // 40px top margin + 40px bottom space for buttons
        const scrollHeight = Math.min(displayHeight, availableHeight);
        
        setScrollWindowHeight(`${scrollHeight}px`);
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', imageSrc);
        // 使用默认尺寸
        const fallbackH = canvasHeight || window.innerHeight;
        setContainerHeight(fallbackH * 1.5);
        setScrollWindowHeight('76vh');
        setImageLoaded(true);
      };
      
      img.src = imageSrc;
    };

    if (result) {
      loadImageAndCalculateDimensions();
    }

    // 监听窗口大小变化
    const handleResize = () => {
      if (imageDimensions.width && imageDimensions.height) {
        const windowWidth = canvasWidth || window.innerWidth;
        const imageAspectRatio = imageDimensions.height / imageDimensions.width;
        const displayHeight = windowWidth * imageAspectRatio;
        
        setContainerHeight(displayHeight);
        
        const windowHeight = canvasHeight || window.innerHeight;
        const availableHeight = windowHeight - 80 - 80;
        const scrollHeight = Math.min(displayHeight, availableHeight);
        
        setScrollWindowHeight(`${scrollHeight}px`);
        if (exportRef.current) {
          setOverlayWidth(exportRef.current.clientWidth);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [result, imageDimensions.width, imageDimensions.height, canvasWidth, canvasHeight]);

  // 导出图片功能
  const handleSaveResult = async () => {
    if (!exportRef.current) return;

    try {
      // 捕获滚动内容区域
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: false,
        scrollX: 0,
        scrollY: 0,
        width: exportRef.current.scrollWidth,
        height: exportRef.current.scrollHeight
      });

      // 创建下载链接
      const link = document.createElement('a');
      link.download = `${userName}_creative_dna_result.png`;
      link.href = canvas.toDataURL('image/png');
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出失败，请重试');
    }
  };

  return (
    <div className="h-full w-full relative bg-white">
      {/* Loading State */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500">Loading...</div>
        </div>
      )}
      
      {/* Independent Scrollable Window */}
      {imageLoaded && (
        <div 
          className="scrollable-container"
          style={{
            position: 'absolute',
            top: '40px', // 增加顶部间距
            left: '0',
            right: '0',
            height: scrollWindowHeight, // 使用动态计算的高度
            width: '100%',
            overflow: 'hidden', // 外层隐藏溢出
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            borderRadius: '36px' // 添加圆角
          }}
        >
        {/* 内层真正的滚动容器 */}
        <div
          style={{
            width: '100%',
            height: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden'
          }}
          onScroll={(e) => {
            e.stopPropagation(); // 阻止滚动事件冒泡
          }}
        >
          {/* 滚动内容容器 - 用于导出 */}
          <div 
            ref={exportRef}
            style={{ 
              position: 'relative',
              width: '100%', 
              height: `${containerHeight}px`, // 使用动态计算的精确高度
              backgroundImage: `url(${getBackgroundImage()})`,
              backgroundSize: '100% auto',
              // 除 BUILDER 页面外，其他图片上部裁切 10px（上移背景图）
              backgroundPosition: (() => {
                const src = getBackgroundImage();
                const isBuilder = src.includes('BULIDER.png');
                // Crop 10px from top for non-builder images
                return isBuilder ? 'top center' : 'left 50% top -50px';
              })(),
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* User Name - 使用百分比相对定位到背景图 */}
            {(() => {
              const position = getUserNamePosition();
              const src = getBackgroundImage();
              const isBuilder = src.includes('BULIDER.png');
              const cropOffsetPx = isBuilder ? 0 : -10; // keep in sync with non-builder crop

              return (
                <div style={{
                  position: 'absolute',
                  left: `${position.x * 100}%`,
                  top: `calc(${position.y * 100}% + ${cropOffsetPx}px)`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20
                }}>
                  {DEBUG_USERNAME_POSITION && (
                    <div style={{
                      position: 'absolute',
                      width: '8px',
                      height: '8px',
                      background: '#FF0000',
                      borderRadius: '50%',
                      top: '-4px',
                      left: '-4px'
                    }} />
                  )}
                  {(() => {
                    // 计算相对字号，避免不同屏幕比例导致用户名过大/过小
                    const fontScale = position.fontScale || 0.048;
                    const rawSize = overlayWidth * fontScale;
                    const fontSizePx = Math.max(14, Math.min(rawSize, 28)); // 轻度夹持，便于阅读
                    return (
                      <span className="font-medium" style={{
                    fontFamily: '"PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans CN", "WenQuanYi Micro Hei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: `${fontSizePx}px`,
                    color: '#FFFFFF',
                    fontStyle: 'italic',
                    textShadow: '0 1px 2px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.35)',
                    transform: `rotate(${position.rotation}deg)`,
                    transformOrigin: 'center center',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    writingMode: 'horizontal-tb',
                    textOrientation: 'mixed',
                    letterSpacing: '0.8px',
                    fontWeight: 500
                  }}>
                        @{userName} {regionEmoji}
                      </span>
                    );
                  })()}
                </div>
              );
            })()}
          </div>
        </div>
        </div>
      )}
      
      {/* 隐藏滚动条的CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .scrollable-container::-webkit-scrollbar {
            display: none;
          }
          .scrollable-container > div::-webkit-scrollbar {
            display: none;
          }
        `
      }} />

      {/* Bottom Action Buttons - Aligned with window bottom */}
      {imageLoaded && (
        <div className="absolute left-0 right-0 flex justify-between px-6 z-15" style={{
          top: `calc(40px + ${scrollWindowHeight} + 30px)` // 窗口顶部 + 动态窗口高度 + 间隙
        }}>
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          style={{
            fontFamily: 'RM Neue, sans-serif',
            fontSize: '14px',
            borderRadius: '50px',
            minWidth: '100px'
          }}
        >
          RESTART
        </button>
        <button
          onClick={handleSaveResult}
          className="px-6 py-1 bg-gray-200 text-black font-medium hover:bg-gray-300 transition-colors"
          style={{
            fontFamily: 'RM Neue, sans-serif',
            fontSize: '14px',
            borderRadius: '50px',
            minWidth: '100px'
          }}
        >
          SAVE RESULT
        </button>
        </div>
      )}
    </div>
  );
};

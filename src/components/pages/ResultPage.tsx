import React, { useRef, useState, useEffect } from 'react';
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

  // 图片尺寸状态管理
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollWindowHeight, setScrollWindowHeight] = useState('76vh');

  // 根据创意类型获取用户名标签位置
  const getUserNamePosition = () => {
    // 获取当前窗口宽度来计算像素位置
    const windowWidth = window.innerWidth;
    
    const positionMap: Record<string, { left?: string; right?: string; top: string; rotation: number }> = {
      'MAKER': { left: `${windowWidth * 0.75}px`, top: `${windowWidth * 0.25}px`, rotation: 90 },      // BUILDER - 保持原位置
      'TIDY': { left: `${windowWidth * 0.69}px`, top: `${windowWidth * 0.33}px`, rotation: 90 },       // ORGANIZER
      'ILLUMA': { left: `${windowWidth * 0.69}px`, top: `${windowWidth * 0.33}px`, rotation: 90 },     // LIGHT SEEKER
      'REFORM': { left: `${windowWidth * 0.69}px`, top: `${windowWidth * 0.33}px`, rotation: 90 },     // INNOVATOR  
      'NOMAD': { left: `${windowWidth * 0.69}px`, top: `${windowWidth * 0.33}px`, rotation: 90 },      // EXPLORER
      'VISUAL': { left: `${windowWidth * 0.69}px`, top: `${windowWidth * 0.33}px`, rotation: 90 }      // CRAFTER
    };
    
    return positionMap[result?.type || 'MAKER'] || positionMap['MAKER'];
  };

  // 根据结果类型获取对应的背景图片
  const getBackgroundImage = () => {
    const imageMap: Record<string, string> = {
      'MAKER': '/assets/result page/BULIDER.png',
      'TIDY': '/assets/result page/ORGANIZER.png',
      'ILLUMA': '/assets/result page/LIGHT SEEKER.png',
      'REFORM': '/assets/result page/INNIVATOR.png',
      'NOMAD': '/assets/result page/EXPLORER.png',
      'VISUAL': '/assets/result page/CRAFTER.png'
    };
    
    return imageMap[result?.type || 'MAKER'] || '/assets/result page/BULIDER.png';
  };

  // 动态计算图片尺寸和容器高度
  useEffect(() => {
    const loadImageAndCalculateDimensions = () => {
      const img = new Image();
      const imageSrc = getBackgroundImage();
      
      img.onload = () => {
        const windowWidth = window.innerWidth;
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
        
        // 计算合适的滑动窗口高度
        const windowHeight = window.innerHeight;
        const availableHeight = windowHeight - 80 - 80; // 40px top margin + 40px bottom space for buttons
        const scrollHeight = Math.min(displayHeight, availableHeight);
        
        setScrollWindowHeight(`${scrollHeight}px`);
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', imageSrc);
        // 使用默认尺寸
        setContainerHeight(window.innerHeight * 1.5);
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
        const windowWidth = window.innerWidth;
        const imageAspectRatio = imageDimensions.height / imageDimensions.width;
        const displayHeight = windowWidth * imageAspectRatio;
        
        setContainerHeight(displayHeight);
        
        const windowHeight = window.innerHeight;
        const availableHeight = windowHeight - 80 - 80;
        const scrollHeight = Math.min(displayHeight, availableHeight);
        
        setScrollWindowHeight(`${scrollHeight}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [result, imageDimensions.width, imageDimensions.height]);

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
    <div className="h-screen w-full relative bg-white">
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
              backgroundPosition: 'top center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* User Name - 动态定位到每张图片的最佳位置 */}
            {(() => {
              const position = getUserNamePosition();
              console.log('Current position:', position, 'Result type:', result?.type); // 调试信息
              
              const containerStyle: React.CSSProperties = {
                position: 'absolute',
                top: position.top,
                zIndex: 20
              };
              
              if (position.right) {
                containerStyle.right = position.right;
              }
              if (position.left) {
                containerStyle.left = position.left;
              }
              
              return (
                <div style={containerStyle}>
                  <span className="font-medium" style={{
                    fontFamily: '"PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans CN", "WenQuanYi Micro Hei", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '20px',
                    color: '#4A5568', // 深灰色 (gray-600)
                    transform: `rotate(${position.rotation}deg)`,
                    transformOrigin: 'center center',
                    whiteSpace: 'nowrap',
                    display: 'block',
                    writingMode: 'horizontal-tb',
                    textOrientation: 'mixed',
                    letterSpacing: '0.8px', // 稍微增加字间距让中文更清晰
                    fontWeight: 500 // 稍微减轻字重
                  }}>
                    @{userName} {regionEmoji}
                  </span>
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
        <div className="absolute left-0 right-0 flex justify-between px-6 z-20" style={{
          top: `calc(40px + ${scrollWindowHeight} + 12px)` // 窗口顶部 + 动态窗口高度 + 间隙
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
          className="px-6 py-2 bg-gray-200 text-black font-medium hover:bg-gray-300 transition-colors"
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
import React from 'react';
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

  return (
    <div className="h-screen w-full relative bg-white">
      {/* Independent Scrollable Window */}
      <div 
        className="scrollable-container"
        style={{
          position: 'absolute',
          top: '40px', // 增加顶部间距
          left: '0',
          right: '0',
          height: '76vh',
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
          {/* 滚动内容容器 */}
          <div style={{ 
            position: 'relative',
            width: '100%', 
            minHeight: '150vh',
            backgroundImage: 'url(/result-background.png)',
            backgroundSize: '100% auto',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat'
          }}>
            {/* User Name - 在滚动内容内部 */}
            <div className="absolute z-20" style={{
              top: '30px',
              right: '-140px'
            }}>
              <span className="text-black font-medium" style={{
                fontFamily: 'RM Neue, sans-serif',
                fontSize: '20px',
                transform: 'rotate(90deg)',
                transformOrigin: 'left top',
                whiteSpace: 'nowrap',
                display: 'block'
              }}>
                @{userName} {regionEmoji}
              </span>
            </div>
          </div>
        </div>
      </div>
      
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
      <div className="absolute left-0 right-0 flex justify-between px-6 z-20" style={{
        top: 'calc(40px + 76vh + 12px)' // 窗口顶部 + 窗口高度 + 间隙
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
          onClick={onShare}
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
    </div>
  );
};
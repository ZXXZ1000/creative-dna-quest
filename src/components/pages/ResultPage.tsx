import React, { useRef, useState, useEffect } from 'react';
import { useCanvas } from '../../contexts/CanvasContext';
// html2canvas removed from export path; using direct Canvas draw for exact alignment
import { track } from '../../lib/analytics';
import { Logo } from '../../components/Logo';
import { flagEmojiForName } from '../../lib/flagEmoji';
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
  // 为图片添加版本参数，强制 iOS Safari 刷新最新资源（避免顽固缓存）
  const IMG_VERSION = 'v20250911';
  const EXPLORE_URL = 'https://hototools.com/?utm_source=creative_gene&utm_medium=Social&utm_campaign=6th_hotoday';
  const regionEmoji = userRegion ? flagEmojiForName(userRegion) : '';
  const exportRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  // Canvas size from fixed 9:18 wrapper
  const { width: canvasWidth, height: canvasHeight } = useCanvas();

  // 图片尺寸状态管理
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollWindowHeight, setScrollWindowHeight] = useState('76vh');
  const [buttonsHeight, setButtonsHeight] = useState(56); // 底部按钮区高度（动态测量）
  const [buttonsBottomOffset, setButtonsBottomOffset] = useState(12); // 按钮距视口底部偏移（含安全区）
  const [overlayWidth, setOverlayWidth] = useState(0); // 图片显示宽度，用于按比例缩放用户名字号

  // ========== Username Position (Adjustment Area) ==========
  // Coordinates x/y are normalized (0..1) relative to the background image.
  // - x: 0 = left edge, 1 = right edge
  // - y: 0 = top edge, 1 = bottom edge
  // Unified preset applied to all types. Adjust here to move as a whole.
  const USERNAME_POS = { x: 0.04, y: 0.48, rotation: 0, fontScale: 0.05 } as const;
  // 细微位置微调：整体上移 1px
  const USERNAME_Y_NUDGE_PX = 2;

  // Toggle to visualize the anchor point for quick adjustments
  const DEBUG_USERNAME_POSITION = false;

  // Resolve position (unified for all types; easy to tweak in one place)
  const getUserNamePosition = () => USERNAME_POS;

  // 根据结果类型获取对应的背景图片
  const getBackgroundImage = () => {
    const imageMap: Record<string, string> = {
      'MAKER': '/assets/result-images/BUILDER.png',
      'TIDY': '/assets/result-images/ORGANIZER.png',
      'ILLUMA': '/assets/result-images/LIGHT-SEEKER.png',
      'REFORM': '/assets/result-images/INNOVATOR.png',
      'NOMAD': '/assets/result-images/EXPLORER.png',
      'VISUAL': '/assets/result-images/CRAFTER.png'
    };
    
    const raw = imageMap[result?.type || 'MAKER'] || '/assets/result-images/BUILDER.png';
    const base = (import.meta as any).env?.BASE_URL || '/';
    const path = raw.startsWith('/') ? raw.slice(1) : raw;
    const full = `${String(base).replace(/\/$/, '')}/${path}`;
    const withVersion = `${full}?v=${IMG_VERSION}`;
    console.log('Attempting to load image:', withVersion, 'for result type:', result?.type);
    return withVersion;
  };

  // 动态计算图片尺寸和容器高度
  useEffect(() => {
    const TOP_MARGIN = 12; // 顶部留白（缩小）
    const GAP_BETWEEN = 16; // 滚动窗口与按钮区之间的可视空隙

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
        
        // 测量底部按钮高度与底部偏移
        requestAnimationFrame(() => {
          if (actionRef.current) {
            const rect = actionRef.current.getBoundingClientRect();
            setButtonsHeight(Math.ceil(rect.height));
            const vh = canvasWidth ? (canvasHeight || window.innerHeight) : window.innerHeight;
            const bottomOffset = Math.max(0, (canvasHeight || window.innerHeight) - rect.bottom);
            setButtonsBottomOffset(Math.ceil(bottomOffset));
          }
        });

        // 计算合适的滑动窗口高度（缩小上下留白）
        const windowHeight = canvasHeight || window.innerHeight;
        // 预留空间：按钮区（动态高）+ 按钮距底部偏移（安全区）+ 期望可视空隙
        const reservedBottom = buttonsHeight + buttonsBottomOffset + GAP_BETWEEN;
        const availableHeight = windowHeight - TOP_MARGIN - reservedBottom;
        const scrollHeight = Math.min(displayHeight, availableHeight);
        
        setScrollWindowHeight(`${scrollHeight}px`);
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        console.error('Failed to load image:', imageSrc);
        // 使用默认尺寸
        const fallbackH = canvasHeight || window.innerHeight;
        setContainerHeight(fallbackH * 1.5);
        setScrollWindowHeight('80vh');
        setImageLoaded(true);
      };
      
      img.src = imageSrc;
    };

    if (result) {
      loadImageAndCalculateDimensions();
    }

    // 监听窗口大小变化
    const handleResize = () => {
      const TOP_MARGIN = 12;
      const GAP_BETWEEN = 16;
      if (imageDimensions.width && imageDimensions.height) {
        const windowWidth = canvasWidth || window.innerWidth;
        const imageAspectRatio = imageDimensions.height / imageDimensions.width;
        const displayHeight = windowWidth * imageAspectRatio;
        
        setContainerHeight(displayHeight);
        
        // 更新按钮高度与底部偏移测量
        if (actionRef.current) {
          const rect = actionRef.current.getBoundingClientRect();
          setButtonsHeight(Math.ceil(rect.height));
          const bottomOffset = Math.max(0, (canvasHeight || window.innerHeight) - rect.bottom);
          setButtonsBottomOffset(Math.ceil(bottomOffset));
        }

        const windowHeight = canvasHeight || window.innerHeight;
        const reservedBottom = buttonsHeight + buttonsBottomOffset + GAP_BETWEEN;
        const availableHeight = windowHeight - TOP_MARGIN - reservedBottom;
        const scrollHeight = Math.min(displayHeight, availableHeight);
        
        setScrollWindowHeight(`${scrollHeight}px`);
        if (exportRef.current) {
          setOverlayWidth(exportRef.current.clientWidth);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [result, imageDimensions.width, imageDimensions.height, canvasWidth, canvasHeight, buttonsHeight, buttonsBottomOffset]);

  // 首次渲染出按钮后，补测一次（确保空隙生效）
  useEffect(() => {
    if (!imageLoaded) return;
    requestAnimationFrame(() => {
      if (actionRef.current) {
        const rect = actionRef.current.getBoundingClientRect();
        const bh = Math.ceil(rect.height);
        const bo = Math.ceil(Math.max(0, (canvasHeight || window.innerHeight) - rect.bottom));
        if (bh !== buttonsHeight) setButtonsHeight(bh);
        if (bo !== buttonsBottomOffset) setButtonsBottomOffset(bo);
      }
    });
  }, [imageLoaded, canvasHeight]);

  // 导出/保存图片功能（iPhone 优先使用系统分享以便“保存到相册”）
  const handleSaveResult = async () => {
    try {
      // 直接以图片自然尺寸导出，确保用户名与图片相对位置100%一致
      const url = getBackgroundImage();
      const img = new Image();
      img.crossOrigin = 'anonymous';
      const loaded = await new Promise<HTMLImageElement>((resolve, reject) => {
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });

      const W = loaded.naturalWidth || 1080;
      const H = loaded.naturalHeight || Math.round(W * 1.5);

      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d')!;

      // draw background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);
      ctx.drawImage(loaded, 0, 0, W, H);

      // draw username in exact relative position
      const pos = getUserNamePosition();
      const x = pos.x * W; // left anchor
      const y = pos.y * H; // middle baseline
      const fontPx = Math.round((pos.fontScale || 0.05) * W);
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((pos.rotation || 0) * Math.PI) / 180);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.font = `500 ${fontPx}px "PingFang SC", "Hiragino Sans GB", "Noto Sans CJK SC", "Source Han Sans CN", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = '#ffffff';
      // optional shadow for readability
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = Math.max(2, Math.round(fontPx * 0.15));
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = Math.max(1, Math.round(fontPx * 0.05));
      const label = `@${userName}${regionEmoji ? ' ' + regionEmoji : ''}`;
      ctx.fillText(label, 0, 0);
      ctx.restore();

      // 生成二进制 Blob，便于通过系统分享（iOS 上可“存储到相册”）
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png');
      });

      const fileName = `${userName}_creative_dna_result.png`;
      const file = new File([blob], fileName, { type: 'image/png' });

      // iOS 识别：用于决定优先走分享面板，避免“下载为文件”
      const ua = navigator.userAgent || '';
      const isIOS = /iP(hone|od|ad)/.test(ua);
      const isAndroid = /Android/i.test(ua);
      const canWebShareFiles = typeof (navigator as any).canShare === 'function' && (navigator as any).canShare({ files: [file] });

      if (canWebShareFiles) {
        // 调用系统分享面板，用户可选择“存储图像”，从而保存到相册
        try {
          await (navigator as any).share({
            files: [file],
            title: 'My Creative DNA Result',
            text: 'Check out my Creative DNA result!',
          });
          try {
            track({ name: 'save_result_success', props: { result_type: result?.type, width: canvas.width, height: canvas.height, method: 'web_share_files' } })
          } catch {}
          return;
        } catch (err: any) {
          // 用户取消或分享失败则继续走兜底逻辑
          console.warn('Share sheet dismissed or failed, falling back.', err);
        }
      }

      if (isIOS || isAndroid) {
        // 移动端兜底：在新标签中打开图片，用户可长按/通过分享按钮“保存图片”到相册/图库
        const objUrl = URL.createObjectURL(blob);
        window.open(objUrl, '_blank');
        try {
          track({ name: 'save_result_success', props: { result_type: result?.type, width: canvas.width, height: canvas.height, method: isIOS ? 'ios_open_new_tab' : 'android_open_new_tab' } })
        } catch {}
        // 不立即 revoke，留给新页加载
        setTimeout(() => URL.revokeObjectURL(objUrl), 60_000);
        return;
      }

      // 非 iOS：继续采用下载方式
      const link = document.createElement('a');
      link.download = fileName;
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(link.href), 10_000);

      try {
        track({ name: 'save_result_success', props: { result_type: result?.type, width: canvas.width, height: canvas.height, method: 'download' } })
      } catch {}
    } catch (error) {
      console.error('导出图片失败:', error);
      alert('导出失败，请重试');
    }
  };

  const baseActionButtonStyle: React.CSSProperties = {
    fontFamily: 'RM Neue, sans-serif',
    fontSize: '12px',
    borderRadius: '999px',
    padding: '5px 12px',
    fontWeight: 600,
    transition: 'transform 0.2s ease, filter 0.2s ease',
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: '0.5px',
    whiteSpace: 'nowrap',
    minHeight: '28px',
    border: '1px solid #1F1F1F',
    minWidth: '92px',
    textAlign: 'center',
    lineHeight: 1
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
            top: '12px', // 缩小顶部留白
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
          {/* 滚动内容容器 - 用于导出（使用 img 以避免 background 渲染差异） */}
          <div 
            ref={exportRef}
            style={{ 
              position: 'relative',
              width: '100%', 
              height: `${containerHeight}px`, // 使用动态计算的精确高度
              overflow: 'hidden'
            }}
          >
            <img
              src={getBackgroundImage()}
              alt="Result Background"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
            {/* User Name - 使用百分比相对定位到背景图 */}
            {(() => {
              const position = getUserNamePosition();
              // 不再使用 background 裁切，直接依据图片百分比定位，跨浏览器一致
              const topPct = position.y * 100;

              return (
                <div style={{
                  position: 'absolute',
                  left: `${position.x * 100}%`,
                  top: `${topPct}%`,
                  // Anchor by left edge to make position independent of name length
                  transform: `translate(0, calc(-50% - ${USERNAME_Y_NUDGE_PX}px))`,
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
                    fontStyle: 'normal',
                    //textShadow: '0 1px 2px rgba(0,0,0,0.6), 0 0 8px rgba(0,0,0,0.35)',
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
        <div
          ref={actionRef}
          className="absolute left-0 right-0 px-4 z-15"
          style={{
            bottom: 'calc(24px + env(safe-area-inset-bottom))', // 上移按钮组，兼容安全区
            paddingRight: 'calc(56px + env(safe-area-inset-right) + 8px)', // 预留右侧空间给音乐按钮，避免重叠
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'nowrap',
              gap: '8px',
              maxWidth: '304px',
              width: '100%',
              justifyContent: 'center'
            }}
          >
            <button
              onClick={onRestart}
              style={{
                ...baseActionButtonStyle,
                backgroundColor: '#FFFFFF',
                color: '#1F1F1F'
              }}
              className="hover:brightness-95 active:scale-95"
            >
              RESTART
            </button>
            <button
              onClick={handleSaveResult}
              style={{
                ...baseActionButtonStyle,
                backgroundColor: '#C3C3C3',
                color: '#1F1F1F'
              }}
              className="hover:brightness-95 active:scale-95"
            >
              SAVE RESULT
            </button>
            <a
              href={EXPLORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...baseActionButtonStyle,
                backgroundColor: '#FFED00',
                color: '#1F1F1F',
                minWidth: '108px',
                padding: '6px 16px'
              }}
              className="hover:brightness-95 active:scale-95"
            >
              Explore HOTO
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

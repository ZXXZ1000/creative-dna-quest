import React, { useState, useEffect } from 'react';
import { Question } from '../../types/test';
import { questionImages } from '../../data/questionImages';

interface QuestionPageProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: number;
  onSelectOption: (optionId: number, scores: any) => void;
  onNext: () => void;
  isCurrentPage?: boolean; // 新增：标识是否为当前页面
}

const TypewriterLine: React.FC<{
  text: string;
  className?: string;
  style?: React.CSSProperties;
  startDelay?: number;
  speed?: number; // ms per char
  active?: boolean;
}> = ({ text, className = '', style, startDelay = 0, speed = 40, active = true }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    let timer: number | undefined;

    if (!active) {
      setCount(0);
      return () => {};
    }

    setCount(0);
    timer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        setCount((c) => {
          if (c >= text.length) {
            if (interval) window.clearInterval(interval);
            return c;
          }
          return c + 1;
        });
      }, Math.max(10, speed));
    }, Math.max(0, startDelay));

    return () => {
      if (timer) window.clearTimeout(timer);
      if (interval) window.clearInterval(interval);
    };
  }, [text, startDelay, speed, active]);

  const shown = text.slice(0, count);
  const done = count >= text.length;

  return (
    <div className={className} style={style}>
      <span>{shown}</span>
      {active && !done && <span className="typewriter-caret" aria-hidden="true" />}
    </div>
  );
};

// CSS-steps-based typewriter (more robust across renders)
const CssTypewriterLine: React.FC<{
  text: string;
  className?: string;
  style?: React.CSSProperties;
  startDelay?: number; // ms
  speed?: number; // ms per char
  active?: boolean;
}> = ({ text, className = '', style, startDelay = 0, speed = 40, active = true }) => {
  const chars = text.length;
  const duration = Math.max(10, speed) * chars;
  const delay = Math.max(0, startDelay);
  const animation = active
    ? `css-typing ${duration}ms steps(${chars}, end) ${delay}ms forwards`
    : 'none';
  return (
    <div className={className} style={style}>
      <span
        className="css-typewriter"
        style={{
          // Use CSS variable for final ch width
          // Multiply by 1ch per character
          // Note: visual width may vary with proportional fonts, but good enough for preview
          // @ts-ignore: custom CSS var
          ['--tw-chars' as any]: `${chars}ch`,
          animation,
        }}
      >
        {text}
      </span>
      {active && <span className="typewriter-caret" aria-hidden="true" />}
    </div>
  );
};

export const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onNext,
  isCurrentPage = false
}) => {
  const [selected, setSelected] = useState<number | null>(selectedOption || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false); // 新增：控制退出动画

  // 页面动画控制 - 实现流畅的进入和退出
  useEffect(() => {
    if (isCurrentPage) {
      // 成为当前页面时
      setIsProcessing(false);
      setIsExiting(false);
      setIsVisible(false);
      
      // 立即开始入场动画，同时也作为逐字的激活信号
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50);
      
      return () => clearTimeout(timer);
    } else {
      // 离开当前页时，重置状态，确保下次进入能重新触发打字
      setIsVisible(false);
      setIsExiting(false);
    }
  }, [isCurrentPage]);
  
  // 单独处理selectedOption变化
  useEffect(() => {
    setSelected(selectedOption || null);
  }, [selectedOption]);


  const handleOptionSelect = (optionId: number, scores: any) => {
    if (isProcessing) return;
    
    const wasAlreadySelected = selected === optionId;
    setSelected(optionId);
    onSelectOption(optionId, scores);
    
    if (!wasAlreadySelected) {
      // 开始流畅的退出过程
      setIsExiting(true);
      
      // 根据动画复杂度调整延迟时间，让退出动画与主题动画协调
      const exitDelayMap = {
        1: 600,  // 跳动浮现 - 需要更多时间
        2: 500,  // 左右交叉 - 中等时间
        3: 700,  // 螺旋渐现 - 最复杂，需要最多时间
        4: 650,  // 弹性波动 - 较多时间
        5: 600,  // 缩放绽放 - 需要更多时间
        6: 550,  // 旋转渐现 - 中等时间
        7: 450,  // 打字机效果 - 相对简单
        8: 700   // 流体流动 - 复杂，需要更多时间
      };
      
      const exitDelay = exitDelayMap[questionNumber as keyof typeof exitDelayMap] || 500;
      
      setTimeout(() => {
        onNext();
      }, exitDelay);
    }
  };

  // 进度条已上移到父级组件渲染

  // 解析问题文本（原始适配尺寸）
  const formatQuestionText = (text: string) => {
    // 问题 1: "Your :) ideal Saturday morning starts with..."
    if (text.includes("ideal Saturday morning")) {
      return {
        line1: { text: "Your :) ideal", fontSize: "32px", fontWeight: 500 },
        line2: { text: "Saturday", fontSize: "48px", fontWeight: 700 },
        line3: { text: "morning", fontSize: "40px", fontWeight: 500 },
        line4: { text: "starts with...", fontSize: "32px", fontWeight: 300 }
      };
    }
    
    // 问题 2: "Your laptop starts (=д=) overheating and running super slow..."
    if (text.includes("laptop starts")) {
      return {
        line1: { text: "Your laptop", fontSize: "40px", fontWeight: 500 },
        line2: { text: "starts (=д=)", fontSize: "32px", fontWeight: 500 },
        line3: { text: "overheating", fontSize: "44px", fontWeight: 700 },
        line4: { text: "and running", fontSize: "34px", fontWeight: 500 },
        line5: { text: "super slow...", fontSize: "38px", fontWeight: 700 }
      };
    }
    
    // 问题 3: "Your phone's photo library is mostly filled with..."
    if (text.includes("phone's photo library")) {
      return {
        line1: { text: "Your phone's", fontSize: "34px", fontWeight: 500 },
        line2: { text: "photo", fontSize: "40px", fontWeight: 500 },
        line3: { text: "library is", fontSize: "36px", fontWeight: 500 },
        line4: { text: "mostly filled", fontSize: "40px", fontWeight: 700 },
        line5: { text: "with...", fontSize: "36px", fontWeight: 500 }
      };
    }
    
    // 问题 4: "You see a cool DIY project online..."
    if (text.includes("DIY project online")) {
      return {
        line1: { text: "You see a cool", fontSize: "34px", fontWeight: 500 },
        line2: { text: "DIY project", fontSize: "42px", fontWeight: 700 },
        line3: { text: "online...", fontSize: "38px", fontWeight: 500 }
      };
    }
    
    // 问题 5: "You're (ಠ.ಠ)ง assembling IKEA furniture..."
    if (text.includes("assembling IKEA")) {
      return {
        line1: { text: "You're (ಠ.ಠ)ง", fontSize: "30px", fontWeight: 500 },
        line2: { text: "assembling", fontSize: "38px", fontWeight: 700 },
        line3: { text: "IKEA", fontSize: "44px", fontWeight: 700 },
        line4: { text: "furniture...", fontSize: "36px", fontWeight: 500 }
      };
    }
    
    // 问题 6: "If you were a vlogger, you'd most want to share..."
    if (text.includes("were a vlogger")) {
      return {
        line1: { text: "If you were a", fontSize: "32px", fontWeight: 500 },
        line2: { text: "vlogger", fontSize: "42px", fontWeight: 700 },
        line3: { text: "you'd most", fontSize: "30px", fontWeight: 500 },
        line4: { text: "want to", fontSize: "36px", fontWeight: 500 },
        line5: { text: "share...", fontSize: "40px", fontWeight: 700 }
      };
    }
    
    // 问题 7: "Your (^▽^) shopping style is..."
    if (text.includes("shopping style")) {
      return {
        line1: { text: "Your (^▽^)", fontSize: "32px", fontWeight: 500 },
        line2: { text: "shopping", fontSize: "40px", fontWeight: 700 },
        line3: { text: "style is...", fontSize: "42px", fontWeight: 700 }
      };
    }
    
    // 问题 8: "You're stuck in an elevator for 30 minutes... (^_^)"
    if (text.includes("stuck in an elevator")) {
      return {
        line1: { text: "You're stuck in", fontSize: "30px", fontWeight: 500 },
        line2: { text: "an elevator", fontSize: "38px", fontWeight: 700 },
        line3: { text: "for 30", fontSize: "42px", fontWeight: 700 },
        line4: { text: "minutes...", fontSize: "36px", fontWeight: 500 },
        line5: { text: "(^_^)", fontSize: "28px", fontWeight: 300 }
      };
    }
    
    // 默认处理
    return {
      line1: { text: text, fontSize: "40px", fontWeight: 500 }
    };
  };

  const questionLines = formatQuestionText(question.text);

  // Typing timing configuration (apply to all questions)
  const isQ1 = questionNumber === 1;
  const typingSpeedMs = 90; // ms per char
  const lineGapMs = 180; // pause between lines
  const l1Chars = questionLines.line1?.text.length || 0;
  const l2Chars = questionLines.line2?.text.length || 0;
  const l3Chars = questionLines.line3?.text.length || 0;
  const l4Chars = questionLines.line4?.text.length || 0;
  const l5Chars = questionLines.line5?.text.length || 0;
  const d1 = 0;
  const d2 = d1 + l1Chars * typingSpeedMs + lineGapMs;
  const d3 = d2 + l2Chars * typingSpeedMs + lineGapMs;
  const d4 = d3 + l3Chars * typingSpeedMs + lineGapMs;
  const d5 = d4 + l4Chars * typingSpeedMs + lineGapMs;
  const totalTypingMs = (questionLines as any).line5
    ? d5 + l5Chars * typingSpeedMs
    : d4 + l4Chars * typingSpeedMs; // end time of last char

  const [optionsLocked, setOptionsLocked] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false); // decouple visibility to avoid flash
  useEffect(() => {
    if (!isQ1) { setOptionsLocked(false); return; }
    if (isCurrentPage) {
      setOptionsLocked(true);
      setOptionsVisible(false);
      const t = window.setTimeout(() => {
        setOptionsLocked(false);
        // show on next frame to ensure animation class is applied before reveal
        requestAnimationFrame(() => setOptionsVisible(true));
      }, totalTypingMs + 10);
      return () => window.clearTimeout(t);
    } else {
      setOptionsLocked(true);
      setOptionsVisible(false);
    }
  }, [isQ1, isCurrentPage, totalTypingMs]);

  // 根据问题编号获取动画主题
  const getAnimationTheme = (questionNum: number) => {
    const themes = {
      1: {
        textAnimation: 'animate-bounce-float-in',
        optionAnimation: 'animate-option-float-in',
        name: '优雅跳动浮现'
      },
      2: {
        textAnimation: 'animate-slide-cross',
        optionAnimation: 'animate-option-slide',
        name: '左右交叉滑入'
      },
      3: {
        textAnimation: 'animate-spiral-fade-in',
        optionAnimation: 'animate-option-rotate-in',
        name: '螺旋渐现'
      },
      4: {
        textAnimation: 'animate-elastic-wave-in',
        optionAnimation: 'animate-option-wave-in',
        name: '弹性波动'
      },
      5: {
        textAnimation: 'animate-scale-bloom-in',
        optionAnimation: 'animate-option-scale-in',
        name: '缩放绽放'
      },
      6: {
        textAnimation: 'animate-rotation-fade-in',
        optionAnimation: 'animate-option-flip-in',
        name: '旋转渐现'
      },
      7: {
        textAnimation: 'animate-typewriter-in',
        optionAnimation: 'animate-option-type-in',
        name: '打字机效果'
      },
      8: {
        textAnimation: 'animate-liquid-flow-in',
        optionAnimation: 'animate-option-flow-in',
        name: '流体流动'
      }
    };
    
    return themes[questionNum as keyof typeof themes] || themes[1];
  };

  // 为问题2的左右交叉效果提供特殊处理
  const getTextAnimationClass = (lineIndex: number) => {
    const theme = getAnimationTheme(questionNumber);
    
    // For Q1 we rely on per-character animation only
    if (questionNumber === 1) return '';

    if (questionNumber === 2) {
      // 左右交叉：奇数行从左进入，偶数行从右进入
      return lineIndex % 2 === 0 ? 'animate-slide-cross-left' : 'animate-slide-cross-right';
    }
    
    return theme.textAnimation;
  };

  // 为问题2的选项按钮提供交替滑入效果
  const getOptionAnimationClass = (optionIndex: number) => {
    const theme = getAnimationTheme(questionNumber);
    
    if (questionNumber === 2) {
      // 选项交替滑入
      return optionIndex % 2 === 0 ? 'animate-option-slide-left' : 'animate-option-slide-right';
    }
    
    return theme.optionAnimation;
  };

  // 调整动画延迟时间，按75%设定让节奏更合适
  const getAnimationDelay = (index: number, type: 'text' | 'option' | 'image') => {
    const baseDelay = type === 'text' ? 0.45 : type === 'option' ? 2.1 : 0.2; // 图片从0.2s开始
    const increment = type === 'text' ? 0.3 : type === 'option' ? 0.19 : 0.1; // 图片间隔0.1s
    return `${baseDelay + index * increment}s`;
  };

  // 获取图片动画类型
  const getImageAnimationClass = (position: 'left' | 'right', questionNum: number) => {
    // 根据问题编号和位置决定动画类型
    const animationMap: Record<number, { left: string; right: string }> = {
      2: { left: 'animate-image-float-left', right: 'animate-image-slide-right' },
      3: { left: 'animate-image-spiral', right: 'animate-image-elastic' },
      4: { left: 'animate-image-elastic', right: 'animate-image-spiral' },
      5: { left: 'animate-image-slide-right', right: 'animate-image-float-left' },
      6: { left: 'animate-image-float-left', right: 'animate-image-slide-right' },
      7: { left: 'animate-image-spiral', right: 'animate-image-elastic' },
      8: { left: 'animate-image-elastic', right: 'animate-image-spiral' }
    };
    
    return animationMap[questionNum]?.[position] || 'animate-image-float-left';
  };

  return (
    <div className={`h-screen w-full relative overflow-hidden bg-white`}>
      {/* 主视图：保留页面整体入场/退出动画（不影响进度条）*/}
      <div className={`relative h-full transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} style={{ paddingTop: 'calc(56px + env(safe-area-inset-top))' }}>

      {/* 右上角ASCII艺术背景（Q3/4/5/8 进一步下移；Q8 缩小） */}
      <div 
        className={`absolute right-0 z-0 question-ascii-right ${
          isVisible ? getImageAnimationClass('right', questionNumber) : 'opacity-0 translate-x-8'
        }`}
        style={{ 
          animationDelay: getAnimationDelay(0, 'image'),
          top: (
            questionNumber === 8 ? '8.5rem' :
            [3,4,5].includes(questionNumber) ? '7.5rem' :
            '6rem'
          ),
          width: questionNumber === 8 ? '26%' : '32%'
        }}
      >
        <img 
          src={(questionImages[questionNumber]?.right) || "/ascii-right.png"}
          alt="ASCII Background" 
          className="w-full h-auto object-contain deco-yellow"
        />
      </div>

      {/* 左下角黄色ASCII艺术装饰（整体下移并缩小） */}
      <div 
        className={`absolute bottom-40 left-0 z-0 question-ascii-left ${
          isVisible ? getImageAnimationClass('left', questionNumber) : 'opacity-0 translate-y-8'
        }`}
        style={{ 
          animationDelay: getAnimationDelay(1, 'image'),
          width: '30%'
        }}
      >
        <img 
          src={(questionImages[questionNumber]?.left) || "/ascii-left.png"}
          alt="ASCII Decoration" 
          className="w-full h-auto object-contain deco-black"
        />
      </div>

      {/* 主内容区域 */}
      <div className="relative z-10 px-6">
        {/* 问题标题：所有题目统一使用打字机动画 */}
        <div className="mt-16 mb-12">
          {questionLines.line1 && (
            <CssTypewriterLine
              text={questionLines.line1.text}
              className={`text-black font-rm`}
              style={{
                fontSize: `calc(${questionLines.line1.fontSize} * var(--responsive-scale))`,
                fontWeight: questionLines.line1.fontWeight,
                lineHeight: '1.3',
                marginBottom: '6px'
              }}
              startDelay={d1}
              speed={typingSpeedMs}
              active={isCurrentPage}
            />
          )}
          {questionLines.line2 && (
            <CssTypewriterLine
              text={questionLines.line2.text}
              className={`text-black font-rm`}
              style={{ 
                fontSize: `calc(${questionLines.line2.fontSize} * var(--responsive-scale))`,
                fontWeight: questionLines.line2.fontWeight,
                lineHeight: '1.3',
                marginBottom: '6px'
              }}
              startDelay={d2}
              speed={typingSpeedMs}
              active={isCurrentPage}
            />
          )}
          {questionLines.line3 && (
            <CssTypewriterLine
              text={questionLines.line3.text}
              className={`text-black font-rm`}
              style={{ 
                fontSize: `calc(${questionLines.line3.fontSize} * var(--responsive-scale))`,
                fontWeight: questionLines.line3.fontWeight,
                lineHeight: '1.3',
                marginBottom: '6px'
              }}
              startDelay={d3}
              speed={typingSpeedMs}
              active={isCurrentPage}
            />
          )}
          {questionLines.line4 && (
            <CssTypewriterLine
              text={questionLines.line4.text}
              className={`text-black font-rm`}
              style={{ 
                fontSize: `calc(${questionLines.line4.fontSize} * var(--responsive-scale))`,
                fontWeight: questionLines.line4.fontWeight,
                lineHeight: '1.3',
                marginBottom: questionLines.line5 ? '6px' : '0px'
              }}
              startDelay={d4}
              speed={typingSpeedMs}
              active={isCurrentPage}
            />
          )}
          {questionLines.line5 && (
            <CssTypewriterLine
              text={questionLines.line5.text}
              className={`text-black font-rm`}
              style={{ 
                fontSize: `calc(${questionLines.line5.fontSize} * var(--responsive-scale))`,
                fontWeight: questionLines.line5.fontWeight,
                lineHeight: '1.3',
                marginBottom: '0px'
              }}
              startDelay={d5}
              speed={typingSpeedMs}
              active={isCurrentPage}
            />
          )}
        </div>

        {/* 选项按钮布局 */}
        <div className="space-y-3 mb-8 mx-auto mt-6" style={{ maxWidth: '340px' }}>
          {(!isQ1 || optionsVisible) && question.options.map((option, index) => {
            const locked = isQ1 && optionsLocked;
            const baseAnimClass = (!locked && isVisible)
              ? getOptionAnimationClass(index)
              : '';
            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id, option.scores)}
                disabled={isProcessing || locked}
                className={`w-full text-left flex items-center elegant-hover ${
                  selected === option.id ? 'selected-highlight' : ''
                } ${
                  (isProcessing || locked) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                } ${
                  baseAnimClass
                }`}
                style={{ 
                  animationDelay: (!locked && isVisible && !isExiting)
                    ? (isQ1 ? `${(index * 0.1).toFixed(2)}s` : getAnimationDelay(index, 'option'))
                    : undefined,
                  borderRadius: 'calc(16px * var(--responsive-scale))',
                  height: 'calc(64px * var(--responsive-scale))',
                  backgroundColor: selected === option.id ? '#FFED00' : '#F5F5F5',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  minHeight: 'calc(44px * var(--responsive-scale))',
                }}
              >
              {/* 左侧圆点指示器 */}
              <div 
                className="rounded-full flex-shrink-0 transition-all duration-300"
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: selected === option.id ? '#000000' : '#CCCCCC',
                  marginRight: '16px'
                }}
              />
              
              {/* 选项文字 */}
              <span 
                className="transition-all duration-300 font-rm"
                style={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: selected === option.id ? '#000000' : '#333333',
                  lineHeight: '1.4'
                }}
              >
                {option.text}
              </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 底部品牌标识 */}
      <div className={`absolute left-1/2 transform -translate-x-1/2 z-10 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`} 
      style={{ 
        bottom: 'calc(40px + env(safe-area-inset-bottom))',
        animationDelay: '0.8s'
      }}>
        <p 
          style={{
            fontSize: '14px',
            color: '#999999',
            fontWeight: 400
          }}
          className="font-rm"
        >
          Powered by HOTO
        </p>
      </div>

      </div>

    </div>
  );
};

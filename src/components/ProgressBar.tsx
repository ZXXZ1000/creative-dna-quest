import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
  animated?: boolean;
  type?: 'standard' | '3d' | 'dna';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  showText = true,
  animated = true,
  type = 'standard'
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const progress = (current / total) * 100;

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animated]);

  const getProgressComponent = () => {
    switch (type) {
      case '3d':
        return (
          <div className="progress-3d">
            <div className="progress-track"></div>
            <div 
              className="progress-fill-3d transition-all duration-700"
              style={{ width: `${animatedProgress}%` }}
            >
              <div className="progress-orb"></div>
            </div>
          </div>
        );
      
      case 'dna':
        return (
          <div className="relative">
            <div className="progress-bar">
              <div 
                className="progress-fill dna-helix transition-all duration-700"
                style={{ width: `${animatedProgress}%` }}
              />
            </div>
            {/* DNA particles along progress */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(Math.floor(animatedProgress / 20))].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
                  style={{
                    left: `${i * 20 + 10}%`,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    animationDelay: `${i * 0.2}s`
                  }}
                />
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="progress-bar">
            <div 
              className="progress-fill transition-all duration-500"
              style={{ width: `${animatedProgress}%` }}
            />
          </div>
        );
    }
  };

  const getEncouragementText = () => {
    if (progress >= 100) return "Complete! 🎉";
    if (progress >= 75) return "Almost there! 🚀";
    if (progress >= 50) return "Halfway through! 💫";
    if (progress >= 25) return "Great progress! ✨";
    return "Just getting started! 🌟";
  };

  return (
    <div className="w-full space-y-3">
      {showText && (
        <div className="flex justify-between items-center text-sm">
          <span className="text-white/70 font-medium">
            Question {current} of {total}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-white/60">{Math.round(animatedProgress)}%</span>
            {type === 'dna' && (
              <span className="text-blue-400 text-xs">
                {getEncouragementText()}
              </span>
            )}
          </div>
        </div>
      )}
      
      {getProgressComponent()}
      
      {/* Milestone Indicators */}
      {type === 'dna' && (
        <div className="flex justify-between relative">
          {[...Array(total)].map((_, i) => {
            const milestoneProgress = ((i + 1) / total) * 100;
            const isReached = animatedProgress >= milestoneProgress;
            const isCurrent = current === i + 1;
            
            return (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  isReached 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 scale-110 shadow-lg' 
                    : isCurrent 
                      ? 'bg-blue-400 scale-125 animate-pulse' 
                      : 'bg-white/20'
                }`}
                style={{ 
                  transitionDelay: `${i * 0.1}s`,
                  boxShadow: isReached ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
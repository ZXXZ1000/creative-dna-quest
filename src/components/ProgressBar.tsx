import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  showText?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  current, 
  total, 
  showText = true 
}) => {
  const progress = (current / total) * 100;

  return (
    <div className="w-full space-y-2">
      {showText && (
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Question {current} of {total}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
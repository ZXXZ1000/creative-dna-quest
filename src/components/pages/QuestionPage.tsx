import React, { useState, useEffect, useCallback } from 'react';
import { SimplePageContainer } from '../SimplePageContainer';
import { ProgressBar } from '../ProgressBar';
import { Question } from '../../types/test';

interface QuestionPageProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: number;
  onSelectOption: (optionId: number, scores: any) => void;
  onNext: () => void;
}

export const QuestionPage: React.FC<QuestionPageProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  onSelectOption,
  onNext
}) => {
  const [selected, setSelected] = useState<number | null>(selectedOption || null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [encouragement, setEncouragement] = useState<string>('');
  const [showEncouragement, setShowEncouragement] = useState(false);

  // Encouragement messages based on question progress
  const getEncouragement = useCallback((questionNum: number) => {
    const messages = [
      "Great start! Your creative mind is revealing itself... ✨",
      "Interesting choice! The patterns are emerging... 🧬", 
      "Your unique perspective is showing... 🎯",
      "Halfway there! Your DNA signature is taking shape... 🌟",
      "Excellent insights! The picture is getting clearer... 💫",
      "Almost complete! Your creative profile is nearly ready... 🚀",
      "Final stretch! Your DNA blueprint is forming... 🎨",
      "Perfect! Analyzing your creative genetic code... 🧪"
    ];
    return messages[questionNum - 1] || messages[0];
  }, []);

  // Question categories for dynamic theming
  const getQuestionCategory = useCallback((questionNum: number) => {
    const categories = [
      "Mindset", "Problem Solving", "Workflow", "Creativity",
      "Collaboration", "Environment", "Learning", "Motivation"
    ];
    return categories[questionNum - 1] || "Creativity";
  }, []);

  // 当外部传入的selectedOption改变时，同步本地状态
  useEffect(() => {
    setSelected(selectedOption || null);
  }, [selectedOption]);

  const handleOptionSelect = (optionId: number, scores: any, event?: React.MouseEvent) => {
    if (isProcessing) return;
    
    // Get click position for particle effect
    const rect = event?.currentTarget.getBoundingClientRect();
    const x = rect ? ((event.clientX - rect.left) / rect.width) * 100 : 50;
    const y = rect ? ((event.clientY - rect.top) / rect.height) * 100 : 50;
    
    // Set CSS custom properties for particle animation
    if (event?.currentTarget) {
      (event.currentTarget as HTMLElement).style.setProperty('--x', `${x}%`);
      (event.currentTarget as HTMLElement).style.setProperty('--y', `${y}%`);
    }
    
    const wasAlreadySelected = selected === optionId;
    setSelected(optionId);
    onSelectOption(optionId, scores);
    
    if (!wasAlreadySelected) {
      setIsProcessing(true);
      
      // Show encouragement
      const encouragementText = getEncouragement(questionNumber);
      setEncouragement(encouragementText);
      setShowEncouragement(true);
      
      setTimeout(() => {
        setShowEncouragement(false);
      }, 1000);
      
      // Move to next question
      setTimeout(() => {
        onNext();
        setIsProcessing(false);
      }, 1400);
    }
  };

  const questionCategory = getQuestionCategory(questionNumber);
  const progress = (questionNumber / totalQuestions) * 100;

  return (
    <SimplePageContainer className="justify-start pt-8 relative overflow-hidden">
      {/* Dynamic Background Based on Progress */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle at ${20 + (progress * 0.6)}% ${30 + (progress * 0.4)}%, rgba(66, 153, 225, 0.1) 0%, transparent 50%)`
          }}
        ></div>
      </div>

      <div className="w-full space-y-8 relative z-10">
        {/* Enhanced Progress with 3D Effect */}
        <div className="animate-fade-in">
          <div className="progress-3d mb-4">
            <div className="progress-track"></div>
            <div 
              className="progress-fill-3d"
              style={{ width: `${progress}%` }}
            >
              <div className="progress-orb"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-white/70">
            <span className="font-medium">{questionCategory}</span>
            <span>Question {questionNumber} of {totalQuestions}</span>
          </div>
        </div>

        {/* Enhanced Question Card */}
        <div className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="glass-morphism p-6 rounded-2xl">
            <div className="text-center space-y-4">
              <div className="inline-block px-3 py-1 bg-blue-500/20 rounded-full text-xs font-medium text-blue-300 mb-2">
                {questionCategory} • {questionNumber}/{totalQuestions}
              </div>
              <h2 className="text-2xl font-bold leading-tight text-white">
                {question.text}
              </h2>
            </div>
          </div>

          {/* Enhanced Options with Better UX */}
          <div className="space-y-4">
            {question.options.map((option, index) => (
              <button
                key={option.id}
                onClick={(e) => handleOptionSelect(option.id, option.scores, e)}
                disabled={isProcessing}
                className={`option-button animate-fade-in group ${
                  selected === option.id ? 'selected' : ''
                } ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ animationDelay: `${0.4 + index * 0.15}s` }}
              >
                <div className="flex items-center space-x-4">
                  {/* Enhanced Radio Button */}
                  <div className="relative">
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-300 ${
                      selected === option.id 
                        ? 'border-white bg-gradient-to-r from-blue-400 to-purple-500' 
                        : 'border-white/40 group-hover:border-white/60'
                    }`}>
                      {selected === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1.5 animate-scale-in"></div>
                      )}
                    </div>
                    {selected === option.id && (
                      <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
                    )}
                  </div>
                  
                  {/* Option Content */}
                  <div className="flex-1 text-left">
                    <div className="font-medium text-white group-hover:text-white/90 transition-colors">
                      {option.text}
                    </div>
                  </div>
                  
                  {/* Arrow Indicator */}
                  <div className={`transition-all duration-300 ${
                    selected === option.id 
                      ? 'transform translate-x-1 opacity-100' 
                      : 'opacity-0 group-hover:opacity-50'
                  }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Processing State */}
        {isProcessing && (
          <div className="pt-6 animate-fade-in text-center space-y-4">
            {/* Encouragement Message */}
            {showEncouragement && (
              <div className="glass-morphism px-6 py-3 rounded-xl animate-scale-in">
                <p className="text-white font-medium">{encouragement}</p>
              </div>
            )}
            
            {/* Loading Animation */}
            <div className="flex items-center justify-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
            
            <p className="text-sm text-white/60 mt-2">
              {questionNumber === totalQuestions 
                ? '🧬 Analyzing your creative DNA...' 
                : '✨ Processing your choice...'
              }
            </p>
          </div>
        )}
      </div>

      {/* Question Progress Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {[...Array(totalQuestions)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < questionNumber 
                  ? 'bg-gradient-to-r from-green-400 to-blue-500 scale-110' 
                  : i === questionNumber - 1 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-500 scale-125 shadow-lg' 
                    : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>
    </SimplePageContainer>
  );
};
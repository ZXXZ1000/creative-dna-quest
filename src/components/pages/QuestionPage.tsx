import React, { useState, useEffect } from 'react';
import { PageContainer } from '../PageContainer';
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
  const [autoAdvance, setAutoAdvance] = useState(false);

  const handleOptionSelect = (optionId: number, scores: any) => {
    setSelected(optionId);
    onSelectOption(optionId, scores);
    setAutoAdvance(true);
  };

  useEffect(() => {
    if (autoAdvance && selected) {
      const timer = setTimeout(() => {
        onNext();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, selected, onNext]);

  return (
    <PageContainer className="justify-start pt-16">
      <div className="w-full space-y-6">
        {/* Progress */}
        <div className="animate-fade-in">
          <ProgressBar 
            current={questionNumber} 
            total={totalQuestions} 
          />
        </div>

        {/* Question */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold leading-tight text-center">
            {question.text}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id, option.scores)}
                className={`option-button animate-fade-in ${
                  selected === option.id ? 'selected' : ''
                }`}
                style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                disabled={autoAdvance}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    selected === option.id 
                      ? 'bg-white border-white' 
                      : 'border-muted-foreground'
                  }`}>
                    {selected === option.id && (
                      <div className="w-2 h-2 bg-primary rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="text-left flex-1">{option.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Auto-advance indicator */}
        {autoAdvance && (
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary rounded-full animate-spin border-t-transparent"></div>
              <span>Moving to next question...</span>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};
import React from 'react';
import { PageContainer } from '../PageContainer';

interface SciencePageProps {
  onContinue: () => void;
  onSkip: () => void;
}

export const SciencePage: React.FC<SciencePageProps> = ({ onContinue, onSkip }) => {
  return (
    <PageContainer onSwipeUp={onContinue}>
      <div className="space-y-6">
        {/* Header */}
        <div className="animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center mb-2">The Science Behind</h2>
          <p className="text-center text-muted-foreground">Understanding your creative patterns</p>
        </div>

        {/* Science Points */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="bg-card p-4 rounded-xl border border-input-border">
            <h3 className="font-semibold mb-2 text-primary">Personality Psychology</h3>
            <p className="text-sm text-muted-foreground">
              Based on established frameworks like the Big Five and creative cognition research.
            </p>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-input-border">
            <h3 className="font-semibold mb-2 text-accent">Maker Patterns</h3>
            <p className="text-sm text-muted-foreground">
              Identifies your natural approach to creation, problem-solving, and tool preferences.
            </p>
          </div>
          
          <div className="bg-card p-4 rounded-xl border border-input-border">
            <h3 className="font-semibold mb-2 text-primary">Tool Alignment</h3>
            <p className="text-sm text-muted-foreground">
              Matches your creative DNA with HOTO tools designed for your specific maker style.
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3 pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button onClick={onContinue} className="btn-primary w-full">
            CONTINUE
          </button>
          <button onClick={onSkip} className="btn-secondary w-full">
            Skip to Test
          </button>
        </div>
      </div>
    </PageContainer>
  );
};
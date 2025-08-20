import React, { useState } from 'react';
import { PageContainer } from '../PageContainer';
import { CreativeProfile } from '../../types/test';

interface ResultPageProps {
  result: CreativeProfile;
  userName: string;
  onRestart: () => void;
  onShare: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({ 
  result, 
  userName, 
  onRestart, 
  onShare 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Congratulations Header */}
        <div className="text-center animate-scale-in">
          <div className="text-4xl mb-2">🎉</div>
          <h2 className="text-xl font-semibold mb-1">
            Congratulations, {userName}!
          </h2>
          <p className="text-muted-foreground text-sm">Your Creative DNA is ready</p>
        </div>

        {/* Result Card */}
        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${result.color} text-white`}>
            <div className="relative z-10">
              <div className="text-center space-y-3">
                <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                  {result.type}
                </div>
                <h1 className="text-2xl font-bold">{result.title}</h1>
                <p className="text-white/90 leading-relaxed">
                  {result.description}
                </p>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          </div>
        </div>

        {/* Traits */}
        <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-semibold mb-3">Your Key Traits</h3>
          <div className="grid grid-cols-2 gap-2">
            {result.traits.map((trait, index) => (
              <div 
                key={trait}
                className="bg-card p-3 rounded-xl border border-input-border text-center text-sm animate-fade-in"
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                {trait}
              </div>
            ))}
          </div>
        </div>

        {/* Product Recommendation */}
        <div className="bg-card p-4 rounded-xl border border-input-border animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <h3 className="font-semibold mb-2 text-primary">Perfect Match</h3>
          <p className="text-sm text-muted-foreground">{result.product}</p>
        </div>

        {/* Details Toggle */}
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-left p-4 bg-card rounded-xl border border-input-border hover:bg-card-hover transition-all animate-fade-in"
          style={{ animationDelay: '0.7s' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-medium">Learn More About Your Type</span>
            <svg 
              className={`w-5 h-5 transition-transform ${showDetails ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-input-border text-sm text-muted-foreground">
              <p>Your {result.title} personality thrives on {result.traits.join(', ').toLowerCase()} approaches to creativity. This makes you naturally drawn to tools and methods that support your systematic way of thinking and creating.</p>
            </div>
          )}
        </button>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button onClick={onShare} className="btn-primary w-full animate-fade-in" style={{ animationDelay: '0.8s' }}>
            SHARE RESULTS
          </button>
          <button onClick={onRestart} className="btn-secondary w-full animate-fade-in" style={{ animationDelay: '0.9s' }}>
            TAKE TEST AGAIN
          </button>
        </div>

        {/* Thank You */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '1s' }}>
          <p>Thank you for discovering your Creative DNA with HOTO</p>
        </div>
      </div>
    </PageContainer>
  );
};
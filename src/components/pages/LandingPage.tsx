import React from 'react';
import { PageContainer } from '../PageContainer';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <PageContainer onSwipeUp={onStart} showSwipeIndicator>
      <div className="space-y-8">
        {/* Logo/Brand */}
        <div className="animate-scale-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            HOTO
          </h1>
          <p className="text-muted-foreground text-sm">Creative DNA Test</p>
        </div>

        {/* Main Title */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-3xl font-bold leading-tight">
            What's Your<br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Creative DNA?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Discover your unique creative personality and unlock the tools that match your maker mindset.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">8 science-based questions</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm text-muted-foreground">Personalized tool recommendations</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Takes less than 2 minutes</span>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <button onClick={onStart} className="btn-primary w-full glow-primary">
            START TEST
          </button>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
          By continuing, you agree to our{' '}
          <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
          {' '}and{' '}
          <span className="text-primary cursor-pointer hover:underline">Terms of Service</span>
        </p>
      </div>
    </PageContainer>
  );
};
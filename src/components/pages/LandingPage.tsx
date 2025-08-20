import React, { useEffect, useState } from 'react';
import { SimplePageContainer } from '../SimplePageContainer';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [recentTests, setRecentTests] = useState(247);
  const [showFOMO, setShowFOMO] = useState(false);

  useEffect(() => {
    // Simulate real-time test count updates
    const interval = setInterval(() => {
      setRecentTests(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    // Show FOMO notification after a delay
    const fomoTimer = setTimeout(() => {
      setShowFOMO(true);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(fomoTimer);
    };
  }, []);

  return (
    <SimplePageContainer className="relative overflow-hidden">
      {/* DNA Background Elements */}
      <div className="absolute inset-0 dna-helix opacity-30"></div>
      <div className="glow-bg"></div>
      
      {/* FOMO Notification */}
      {showFOMO && (
        <div className="fomo-notification">
          <div className="pulse-dot"></div>
          {recentTests} people discovered their DNA in the last hour
        </div>
      )}

      {/* Social Proof Ticker */}
      <div className="social-proof-ticker">
        <div className="ticker-content">
          <div className="proof-item">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex-shrink-0"></div>
            <span>"Discovered I'm a MAKER! So accurate!" - Sarah K.</span>
          </div>
          <div className="proof-item">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex-shrink-0"></div>
            <span>"The VISUAL result changed my workflow!" - Mike D.</span>
          </div>
          <div className="proof-item">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex-shrink-0"></div>
            <span>"Perfect match with HOTO tools!" - Emma L.</span>
          </div>
        </div>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Enhanced Logo/Brand */}
        <div className="animate-scale-in">
          <div className="relative">
            <h1 className="text-6xl font-black tracking-tight mb-2">
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-orange-400 bg-clip-text text-transparent">
                HOTO
              </span>
            </h1>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-20 blur-xl"></div>
          </div>
          <p className="text-lg font-semibold text-orange-400">CREATIVE DNA LAB</p>
        </div>

        {/* Magnetic Main Title */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-4xl font-bold leading-tight">
            Unlock Your
            <br />
            <span className="relative">
              <span className="bg-gradient-to-r from-green-400 to-purple-500 bg-clip-text text-transparent">
                Creative DNA
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-purple-500 rounded-full"></div>
            </span>
          </h2>
          <p className="text-lg text-white/70 leading-relaxed max-w-sm mx-auto">
            Discover the genetic code of your creativity through our science-based personality analysis
          </p>
        </div>

        {/* Enhanced Features with Icons */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: '🧬', title: 'Science-Based', subtitle: '8 psychological questions', color: 'from-blue-500 to-cyan-500' },
            { icon: '🎯', title: 'Personalized Match', subtitle: 'Perfect tool recommendations', color: 'from-purple-500 to-pink-500' },
            { icon: '⚡', title: 'Lightning Fast', subtitle: 'Results in under 2 minutes', color: 'from-orange-500 to-red-500' }
          ].map((feature, index) => (
            <div key={index} className="glass-card p-4 rounded-xl backdrop-blur-md animate-fade-in" style={{ animationDelay: `${0.5 + index * 0.1}s` }}>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-lg`}>
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white text-left">{feature.title}</div>
                  <div className="text-sm text-white/60 text-left">{feature.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Button */}
        <div className="pt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <button onClick={onStart} className="btn-cta-enhanced w-full relative z-10">
            <span className="relative z-10">DISCOVER YOUR DNA</span>
          </button>
        </div>

        {/* Social Validation */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 text-yellow-400">⭐</div>
            ))}
            <span className="ml-2 text-sm text-white/60">4.9/5 from 10,000+ tests</span>
          </div>
          <p className="text-xs text-white/50">
            Trusted by creative professionals worldwide
          </p>
        </div>

        {/* Privacy Notice */}
        <p className="text-xs text-white/40 animate-fade-in leading-relaxed" style={{ animationDelay: '1.2s' }}>
          By continuing, you agree to our{' '}
          <span className="text-blue-400 cursor-pointer hover:underline transition-colors">Privacy Policy</span>
          {' '}and{' '}
          <span className="text-blue-400 cursor-pointer hover:underline transition-colors">Terms of Service</span>
        </p>
      </div>

      {/* Enhanced Swipe Indicator */}
      <div className="swipe-indicator">
        <div className="swipe-indicator-icon"></div>
        <span className="swipe-text">Swipe up to begin</span>
      </div>
    </SimplePageContainer>
  );
};
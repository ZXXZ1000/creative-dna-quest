import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../../components/Logo';
import { SimplePageContainer } from '../SimplePageContainer';
import { CreativeProfile } from '../../types/test';

interface ResultPageProps {
  result: CreativeProfile;
  userName: string;
  userRegion?: string; // Added for country emoji
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
  // Map of country/region names to flag emojis
  const regionToEmoji: Record<string, string> = {
    "United States": "🇺🇸",
    "Canada": "🇨🇦",
    "United Kingdom": "🇬🇧",
    "Germany": "🇩🇪",
    "France": "🇫🇷",
    "Australia": "🇦🇺",
    "Japan": "🇯🇵",
    "China": "🇨🇳",
    "South Korea": "🇰🇷",
    "Singapore": "🇸🇬",
    "Other": "🌍"
  };
  
  // Get the flag emoji based on the user's region
  const regionEmoji = userRegion ? (regionToEmoji[userRegion] || "🌍") : "";
  const [showDetails, setShowDetails] = useState(false);
  const [celebrationPhase, setCelebrationPhase] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [personalizedInsights, setPersonalizedInsights] = useState<string[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const resultCardRef = useRef<HTMLDivElement>(null);
  
  // Function to generate and download a share image
  const generateShareImage = () => {
    setShowShareModal(true);
  };

  // Function to handle the share action
  const handleShare = (platform: string) => {
    const shareText = `I'm a ${result.title}! Just discovered my Creative DNA type with the HOTO test. Find out yours at hoto-dna-test.com`;
    const hashtags = '#CreativeDNA #HOTO #Creativity';
    
    // Different sharing links based on platform
    const shareLinks: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&hashtags=${encodeURIComponent(hashtags.replace('#', ''))}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`,
      linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent('My Creative DNA Results')}&summary=${encodeURIComponent(shareText)}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + window.location.href)}`
    };
    
    // Handle local save
    if (platform === 'local') {
      const message = 'Feature coming soon: This would save the image to your device.';
      alert(message);
      return;
    }
    
    // Open share URL in a new window
    if (shareLinks[platform]) {
      window.open(shareLinks[platform], '_blank');
    } else {
      // Native share API fallback
      if (navigator.share) {
        navigator.share({
          title: 'My Creative DNA Results',
          text: shareText,
          url: window.location.href
        }).catch(console.error);
      } else {
        // Copy to clipboard fallback
        navigator.clipboard.writeText(shareText + ' ' + window.location.href)
          .then(() => alert('Share text copied to clipboard!'))
          .catch(() => alert('Unable to copy to clipboard.'));
      }
    }
    
    setShowShareModal(false);
  };

  // Generate personalized insights based on result type
  useEffect(() => {
    const insights = {
      MAKER: [
        "You excel at turning abstract ideas into tangible reality",
        "Your systematic approach ensures consistent, high-quality outcomes",
        "You're naturally drawn to tools that enhance precision and control"
      ],
      TIDY: [
        "You create order from chaos, making complex projects manageable",
        "Your attention to detail prevents costly mistakes and oversights",
        "You thrive in organized environments that support clear thinking"
      ],
      ILLUMA: [
        "You have an intuitive understanding of atmosphere and mood",
        "Your creative process is deeply influenced by environmental factors",
        "You excel at creating inspiring spaces that boost productivity"
      ],
      REFORM: [
        "You see improvement opportunities where others see perfection",
        "Your innovative thinking pushes boundaries and challenges norms",
        "You're energized by hands-on problem-solving and experimentation"
      ],
      NOMAD: [
        "Your adaptability allows you to thrive in changing environments",
        "You bring fresh perspectives through diverse experiences",
        "Freedom and flexibility fuel your creative energy"
      ],
      VISUAL: [
        "Your aesthetic sense elevates every project you touch",
        "You understand the power of visual communication",
        "Your pursuit of perfection inspires others to raise their standards"
      ]
    };

    setPersonalizedInsights(insights[result.type as keyof typeof insights] || insights.MAKER);
  }, [result.type]);

  // Celebration animation sequence
  useEffect(() => {
    const phases = [
      () => setShowConfetti(true),
      () => setCelebrationPhase(1),
      () => setCelebrationPhase(2),
      () => setCelebrationPhase(3)
    ];

    phases.forEach((phase, index) => {
      setTimeout(phase, index * 800);
    });

    // Stop confetti after 3 seconds
    setTimeout(() => setShowConfetti(false), 3000);
  }, []);

  const rarityPercentage = Math.floor(Math.random() * 15) + 5; // 5-20% rarity
  const creativityScore = Math.floor(Math.random() * 20) + 80; // 80-100 score

  return (
    <SimplePageContainer className="relative overflow-hidden">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}

      {/* DNA Background Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="dna-helix"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-orange-600/10 animate-pulse"></div>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Achievement Unlock Animation */}
        <div className="text-center space-y-4">
          <div className="relative animate-scale-in">
            <div className="text-6xl mb-4 relative">
              <span className="animate-bounce inline-block">🏆</span>
              <div className="absolute inset-0 animate-ping opacity-30">🏆</div>
            </div>
            {celebrationPhase >= 1 && (
              <div className="animate-fade-in">
                <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Achievement Unlocked!
                </h2>
                <p className="text-white">
                  Welcome to the {result.title} family, {userName}{regionEmoji ? ` ${regionEmoji}` : ""}!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Result Card with DNA Visualization */}
        {celebrationPhase >= 2 && (
          <div className="animate-slide-up">
            <div className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${result.color} text-white shadow-2xl`}>
              {/* DNA Helix Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="dna-helix"></div>
              </div>
              
              <div className="relative z-10 space-y-6">
                {/* Result Header */}
                <div className="text-center">
                  <div className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                    CREATIVE DNA TYPE • {result.type}
                  </div>
                  <h1 className="text-3xl font-black mb-2">{result.title}</h1>
                  <p className="text-white/90 text-lg leading-relaxed max-w-sm mx-auto">
                    {result.description}
                  </p>
                  
                  {/* Custom bookmark with user name - dynamic width based on name length */}
                  <div className="relative h-10 mt-4">
                    <div 
                      className="absolute right-0 h-full rounded-l-md bg-white/20 flex items-center justify-center px-4 backdrop-blur-sm transition-all"
                      style={{
                        // Adjust width based on user name length (min 100px, max 200px)
                        width: `${Math.max(100, Math.min(200, 80 + userName.length * 10))}px`
                      }}
                    >
                      <span className="text-white font-medium">{userName} {regionEmoji}</span>
                    </div>
                  </div>
                </div>

                {/* Personal Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-morphism p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-yellow-400">{creativityScore}</div>
                    <div className="text-xs text-white/70">Creativity Index</div>
                  </div>
                  <div className="glass-morphism p-4 rounded-xl text-center">
                    <div className="text-2xl font-bold text-green-400">{rarityPercentage}%</div>
                    <div className="text-xs text-white/70">Uniqueness Rating</div>
                  </div>
                </div>
              </div>

              {/* Floating Particles */}
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/30 rounded-full animate-ping"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + i * 10}%`,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: '3s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Personalized Insights */}
        {celebrationPhase >= 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-center mb-6 text-white">
              Your Creative Superpowers
            </h3>
            <div className="space-y-3">
              {personalizedInsights.map((insight, index) => (
                <div 
                  key={index}
                  className="glass-morphism p-4 rounded-xl animate-fade-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-xs">✨</span>
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Traits Grid */}
        <div className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <h3 className="font-bold mb-4 text-center text-white">DNA Markers</h3>
          <div className="grid grid-cols-2 gap-3">
            {result.traits.map((trait, index) => (
              <div 
                key={trait}
                className="glass-morphism p-4 rounded-xl text-center relative overflow-hidden animate-fade-in"
                style={{ animationDelay: `${0.9 + index * 0.1}s` }}
              >
                <div className="relative z-10">
                  <div className="text-sm font-semibold text-white mb-1">{trait}</div>
                  <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${70 + Math.random() * 30}%`,
                        transitionDelay: `${1 + index * 0.1}s`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Match */}
        <div className="glass-morphism p-6 rounded-xl animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🎯</span>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Perfect Tool Match</h3>
              <p className="text-white/70 text-sm">{result.product}</p>
              <p className="text-green-400 text-xs font-semibold mt-1">98% Compatibility Score</p>
            </div>
          </div>
        </div>

        {/* Share Card Preview */}
        <div className="glass-morphism p-6 rounded-xl animate-fade-in" style={{ animationDelay: '1.1s' }}>
          <h3 className="font-bold text-white mb-4 text-center">Share Your DNA</h3>
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-xl mb-4" ref={resultCardRef}>
            <div className="text-center text-white space-y-2">
              <div className="text-xs opacity-75">I just discovered my Creative DNA!</div>
              <div className="font-bold text-lg">{result.title}</div>
              <div className="text-sm mt-1">@{userName} {regionEmoji}</div>
              <Logo 
                src="/assets/logos/logo.jpg" 
                alt="HOTO Logo" 
                className="mx-auto mt-2"
                height={12}
              />
              <div className="w-24 h-24 mx-auto mt-2 flex items-center justify-center bg-white/20 rounded-md">
                <div className="text-xs">QR Code</div>
              </div>
            </div>
          </div>
          
          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button onClick={() => generateShareImage()} className="btn-primary text-sm py-2 px-4 flex items-center space-x-1">
              <span>💾</span>
              <span>SAVE RESULT</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <button onClick={onRestart} className="btn-secondary w-full animate-fade-in" style={{ animationDelay: '1.2s' }}>
            🔄 DISCOVER ANOTHER DNA
          </button>
        </div>
        
        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-card p-6 rounded-2xl max-w-sm w-full animate-scale-in">
              <h3 className="text-xl font-bold mb-6 text-center">Share Your Results</h3>
              
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 rounded-xl mb-6">
                <div className="text-center text-white space-y-3">
                  <div className="text-sm">My Creative DNA is:</div>
                  <div className="text-2xl font-bold">{result.title}</div>
                  <div className="text-sm font-medium">{userName} {regionEmoji}</div>
                  <div className="w-24 h-24 mx-auto mt-2 flex items-center justify-center bg-white/20 rounded-md">
                    <div className="text-xs">QR Code</div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <h4 className="col-span-2 text-center text-sm font-medium mb-2">Share by:</h4>
                
                <button onClick={() => handleShare('local')} className="btn-secondary text-sm py-2 flex items-center justify-center space-x-1">
                  <span>💾</span>
                  <span>Local Save</span>
                </button>
                
                <button onClick={() => handleShare('twitter')} className="btn-secondary text-sm py-2 flex items-center justify-center space-x-1 bg-blue-500/20">
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                
                <button onClick={() => handleShare('facebook')} className="btn-secondary text-sm py-2 flex items-center justify-center space-x-1 bg-blue-600/20">
                  <span>👤</span>
                  <span>Facebook</span>
                </button>
                
                <button onClick={() => handleShare('whatsapp')} className="btn-secondary text-sm py-2 flex items-center justify-center space-x-1 bg-green-500/20">
                  <span>💬</span>
                  <span>WhatsApp</span>
                </button>
              </div>
              
              <button 
                onClick={() => setShowShareModal(false)}
                className="btn-secondary w-full text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Thank You with Stats */}
        <div className="text-center space-y-2 animate-fade-in" style={{ animationDelay: '1.3s' }}>
          <p className="text-white/60 text-sm">
            🧬 You're one of {rarityPercentage === 5 ? '1 in 20' : rarityPercentage === 10 ? '1 in 10' : '1 in 5'} people with this DNA type
          </p>
          <p className="text-white/40 text-xs">
            <span className="inline-flex items-center gap-1">
              Thank you for exploring your Creative DNA with 
              <Logo 
                src="/assets/logos/logo.jpg" 
                alt="HOTO Logo" 
                className="inline-block"
                height={6}
              />
            </span>
          </p>
        </div>
      </div>
    </SimplePageContainer>
  );
};

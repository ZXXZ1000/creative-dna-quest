import React, { useState } from 'react';
import { Logo } from '../../components/Logo';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [agreementChecked, setAgreementChecked] = useState(true); // Default checked per spec
  const [showScienceModal, setShowScienceModal] = useState(false);

  return (
    <div className="h-screen w-full relative overflow-hidden" style={{ 
      backgroundColor: '#f8f8f8'
    }}>
      {/* ASCII Art Background - 与页面相似尺寸，居中自适应 */}
      <div 
        className="absolute inset-0 z-0 animate-ascii-fade-center landing-ascii-bg"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <img 
          src="/ascii-art.png" 
          alt="ASCII Art Background" 
          className="opacity-70 select-none"
          style={{
            width: 'min(100vmin, 100vw)',
            height: 'min(100vmin, 100dvh)',
            objectFit: 'contain',
            transform: 'translateY(30dvh) scale(2)',
            transformOrigin: 'center center'
          }}
        />
      </div>
      
      
      {/* Bookmarks - 响应式定位 */}
      <div className="absolute top-12 left-0 right-0 z-10 bookmark-container" style={{ height: 'calc(8rem * var(--responsive-scale))' }}>
        {/* Bookmark 1 - Yellow (START) */}
        <div 
          className="absolute bg-yellow-400 transform -skew-x-12 flex items-center justify-center bookmark-wave" 
          style={{ 
            left: 'calc(3rem * var(--responsive-scale))',
            top: 'calc(2rem * var(--responsive-scale))',
            width: 'calc(6rem * var(--responsive-scale))',
            height: 'calc(4rem * var(--responsive-scale))',
            animationDelay: '0.1s' 
          }}
        >
          <div className="transform skew-x-12 text-black font-bold r-text-xs font-rm">01 START</div>
        </div>
        
        {/* Bookmark 2 - Gray */}
        <div 
          className="absolute bg-gray-300 transform -skew-x-12 flex items-center justify-center bookmark-wave" 
          style={{ 
            left: 'calc(8rem * var(--responsive-scale))',
            top: 'calc(1rem * var(--responsive-scale))',
            width: 'calc(8rem * var(--responsive-scale))',
            height: 'calc(4rem * var(--responsive-scale))',
            animationDelay: '0.3s' 
          }}
        >
          <div className="transform skew-x-12 text-black font-bold r-text-xs font-rm">04 THE BUILDER</div>
        </div>
        
        {/* Bookmark 3 - Light Gray */}
        <div 
          className="absolute bg-gray-200 transform -skew-x-12 flex items-center justify-center bookmark-wave" 
          style={{ 
            right: 'calc(6rem * var(--responsive-scale))',
            top: '0',
            width: 'calc(8rem * var(--responsive-scale))',
            height: 'calc(4rem * var(--responsive-scale))',
            animationDelay: '0.5s' 
          }}
        >
          <div className="transform skew-x-12 text-black font-bold r-text-xs font-rm">04 THE BUILDER</div>
        </div>
        
        {/* Bookmark 4 - Yellow */}
        <div 
          className="absolute bg-yellow-300 transform -skew-x-12 flex items-center justify-center bookmark-wave" 
          style={{ 
            right: 'calc(2rem * var(--responsive-scale))',
            top: 'calc(1.5rem * var(--responsive-scale))',
            width: 'calc(8rem * var(--responsive-scale))',
            height: 'calc(4rem * var(--responsive-scale))',
            animationDelay: '0.7s' 
          }}
        >
          <div className="transform skew-x-12 text-black font-bold r-text-xs font-rm">03 THE BUILDER</div>
        </div>
        
        {/* Bookmark 5 - Light Gray */}
        <div 
          className="absolute bg-gray-100 border border-gray-300 transform -skew-x-12 flex items-center justify-center bookmark-wave" 
          style={{ 
            right: '0',
            top: 'calc(0.5rem * var(--responsive-scale))',
            width: 'calc(8rem * var(--responsive-scale))',
            height: 'calc(4rem * var(--responsive-scale))',
            animationDelay: '0.9s' 
          }}
        >
          <div className="transform skew-x-12 text-black font-bold r-text-xs font-rm">05 THE BUILDER</div>
        </div>
      </div>
      
      {/* HOTO Brand Logo (size halved) */}
      <div className="absolute z-10" style={{
        top: 'calc(8rem * var(--responsive-scale))',
        left: 'calc(1rem * var(--responsive-scale))'
      }}>
        {/* Use transparent-processed logo */}
        <Logo
          src="/dist/logo.jpg"
          alt="HOTO Logo"
          className="animate-fade-in"
          height={'calc(1.5rem * var(--responsive-scale))'}
        />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10" style={{
        paddingLeft: 'calc(1.5rem * var(--responsive-scale))',
        paddingRight: 'calc(1.5rem * var(--responsive-scale))',
        marginTop: 'calc(12rem * var(--responsive-scale))',
        gap: 'calc(2rem * var(--responsive-scale))',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Main Title - 响应式排版 */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h2 className="r-text-5xl font-light leading-tight text-black" style={{
            marginBottom: 'calc(1.5rem * var(--responsive-scale))'
          }}>
            <span className="italic font-extralight">What's Your</span>
            <br />
            <span className="italic font-extralight">Creative </span>
            <span className="font-bold" style={{ 
              fontSize: 'calc(3.5rem * var(--responsive-scale))',
              background: 'linear-gradient(45deg, #333, #666)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>Gene</span>
            <span className="r-text-6xl font-light">?</span>
          </h2>
        </div>
        
        {/* Subtitle */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-gray-600 r-text-lg leading-relaxed font-rm" style={{
            paddingLeft: 'calc(0.5rem * var(--responsive-scale))',
            paddingRight: 'calc(0.5rem * var(--responsive-scale))'
          }}>
            <span className="block" style={{ whiteSpace: 'nowrap' }}>What drives your creativity? Are you a</span>
            <span className="block" style={{ whiteSpace: 'nowrap' }}>systematic organizer, a visionary innovator, or</span>
            <span className="block" style={{ whiteSpace: 'nowrap' }}>something entirely different?</span>
          </div>
        </div>
        
      </div>
      
      {/* START TEST Button - 响应式 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 animate-button-slide-up z-10 landing-start" style={{ 
        bottom: 'calc(8rem * var(--responsive-scale) + env(safe-area-inset-bottom))',
        animationDelay: '1.2s' 
      }}>
        <button 
          onClick={() => {
            if (!agreementChecked) {
              // Show custom alert modal instead of browser alert
              const alertDiv = document.createElement('div');
              alertDiv.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
              alertDiv.innerHTML = `
                <div class="bg-white p-6 rounded-lg max-w-sm mx-4 text-center animate-scale-in">
                  <h3 class="text-lg font-bold mb-4 text-black">⚠️ Notice</h3>
                  <p class="text-gray-700 mb-6">Please check the agreement before starting the test.</p>
                  <button class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors" onclick="this.parentElement.parentElement.remove()">
                    Got it
                  </button>
                </div>
              `;
              document.body.appendChild(alertDiv);
              setTimeout(() => {
                if (document.body.contains(alertDiv)) {
                  document.body.removeChild(alertDiv);
                }
              }, 3000);
              return;
            }
            onStart();
          }}
          className={`landing-start-btn relative text-black font-bold transform -skew-x-12 transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${
            agreementChecked 
              ? 'bg-yellow-400 hover:bg-yellow-500 cursor-pointer' 
              : 'bg-gray-300 cursor-not-allowed'
          }`}
          style={{ 
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
          }}
        >
          <span className="transform skew-x-12 block font-rm">START TEST</span>
          <div 
            className="absolute -right-2 top-1/2 transform -translate-y-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeftStyle: 'solid',
              borderLeftColor: agreementChecked ? '#FACC15' : '#D1D5DB', // yellow-400 or gray-300
              borderTopStyle: 'solid',
              borderBottomStyle: 'solid',
              borderTopColor: 'transparent',
              borderBottomColor: 'transparent',
              borderLeftWidth: 'clamp(6px, calc(8px * var(--responsive-scale)), 10px)',
              borderTopWidth: 'clamp(6px, calc(8px * var(--responsive-scale)), 10px)',
              borderBottomWidth: 'clamp(6px, calc(8px * var(--responsive-scale)), 10px)'
            }}
          />
        </button>
      </div>
      
      {/* Test Info */}
      <div className="absolute left-0 right-0 flex justify-center animate-text-fade-up z-10 landing-testinfo" style={{ 
        bottom: 'calc(6rem * var(--responsive-scale) + env(safe-area-inset-bottom))',
        animationDelay: '1.4s' 
      }}>
        <p className="text-gray-600 r-text-sm font-medium font-rm">8 questions • 1 minute</p>
      </div>
      
      {/* Bottom Elements - 响应式居中 */}
      <div className="absolute left-0 right-0 flex justify-center z-10 landing-bottombar" style={{
        bottom: 'calc(2rem * var(--responsive-scale) + env(safe-area-inset-bottom))'
      }}>
        <div className="flex flex-col items-center animate-text-fade-up" style={{ 
          gap: 'calc(1rem * var(--responsive-scale))',
          animationDelay: '1.6s' 
        }}>
          {/* Science Behind Link */}
          <button 
            onClick={() => setShowScienceModal(true)}
            className="text-gray-400 r-text-sm underline hover:text-gray-600 transition-colors font-inter"
          >
            THE SCIENCE BEHIND
          </button>
          
          {/* Agreement Checkbox - Properly centered */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="sr-only"
              />
              <div className={`border-2 border-gray-400 r-rounded transition-all ${
                agreementChecked ? 'bg-black border-black' : 'bg-white'
              }`} style={{
                width: 'calc(1.25rem * var(--responsive-scale))',
                height: 'calc(1.25rem * var(--responsive-scale))'
              }}>
                {agreementChecked && (
                  <svg className="text-white mx-auto" fill="currentColor" viewBox="0 0 20 20" style={{
                    width: 'calc(0.75rem * var(--responsive-scale))',
                    height: 'calc(0.75rem * var(--responsive-scale))',
                    marginTop: 'calc(0.125rem * var(--responsive-scale))'
                  }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-gray-600 r-text-sm font-inter">Agree to terms</span>
          </label>
        </div>
      </div>
      
      {/* Bottom navigation bar simulation */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-black r-rounded-3xl z-10" style={{
        width: 'calc(8rem * var(--responsive-scale))',
        height: 'calc(0.25rem * var(--responsive-scale))'
      }}></div>
      
      {/* Science Behind Modal */}
      {showScienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" style={{
          padding: 'calc(1.5rem * var(--responsive-scale))'
        }}>
            <div className="bg-white w-full animate-scale-in shadow-2xl" style={{ 
              maxWidth: 'calc(28rem * var(--responsive-scale) * 0.75)', 
              height: 'calc(37.5rem * var(--responsive-scale))'
            }}>
            {/* Modal Header - White background with folder tab */}
            <div className="bg-white relative" style={{
              paddingLeft: 'calc(2rem * var(--responsive-scale))',
              paddingRight: 'calc(2rem * var(--responsive-scale))',
              paddingTop: 'calc(1.5rem * var(--responsive-scale))',
              paddingBottom: 'calc(1.5rem * var(--responsive-scale))',
              height: 'calc(5rem * var(--responsive-scale))'
            }}>
              <Logo
                src="/dist/logo.jpg"
                alt="HOTO Logo"
                height={'calc(1.25rem * var(--responsive-scale))'}
              />
              {/* Folder tab label in top right - like file folder */}
              <div className="absolute top-0" style={{
                right: 'calc(3rem * var(--responsive-scale))'
              }}>
                <div 
                  className="text-white r-text-xs font-medium relative font-rm"
                  style={{ 
                    backgroundColor: '#5a5a5a',
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)',
                    paddingLeft: 'calc(1rem * var(--responsive-scale))',
                    paddingRight: 'calc(1rem * var(--responsive-scale))',
                    paddingTop: 'calc(0.5rem * var(--responsive-scale))',
                    paddingBottom: 'calc(0.5rem * var(--responsive-scale))'
                  }}
                >
                  THE SCIENCE BEHIND
                </div>
              </div>
            </div>
            
            {/* Modal Content - Medium gray background */}
            <div style={{ 
              backgroundColor: '#5a5a5a', 
              height: 'calc(100% - 5rem * var(--responsive-scale))',
              paddingLeft: 'calc(2rem * var(--responsive-scale))',
              paddingRight: 'calc(2rem * var(--responsive-scale))',
              paddingTop: 'calc(2.5rem * var(--responsive-scale))',
              paddingBottom: 'calc(2.5rem * var(--responsive-scale))'
            }}>
              <h3 className="r-text-3xl font-light tracking-wide text-white font-rm" style={{
                marginBottom: 'calc(2.5rem * var(--responsive-scale))'
              }}>
                THE SCIENCE BEHIND
              </h3>
              
              <div className="text-base leading-relaxed" style={{
                gap: 'calc(1.5rem * var(--responsive-scale))',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <p className="text-white r-text-base font-rm">
                  Based on decades of research in creativity psychology, this test identifies your unique creative DNA - the psychological patterns that drive how you approach making, building, and creating.
                </p>
                
                <p className="text-white r-text-base font-rm">
                  Drawing from <strong className="text-white">Torrance Creative Thinking Test (1962)</strong> & <strong className="text-white">Gough Creative Personality Scale (1979)</strong>.
                </p>
              </div>
              
              <div style={{
                marginTop: 'calc(4rem * var(--responsive-scale))',
                marginBottom: 'calc(3rem * var(--responsive-scale))'
              }}>
                <p className="r-text-lg text-white">Ready to discover your type?</p>
              </div>
              
              {/* Oval button positioned to intersect with bottom edge */}
              <div className="relative h-0">
                <button 
                  onClick={() => {
                    setShowScienceModal(false);
                    if (agreementChecked) {
                      onStart();
                    }
                  }}
                  className="absolute bg-white text-gray-800 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center r-text-base"
                  style={{ 
                    width: 'calc(3rem * var(--responsive-scale))',
                    height: 'calc(1.5rem * var(--responsive-scale))',
                    borderRadius: 'calc(0.75rem * var(--responsive-scale))',
                    right: 'calc(2rem * var(--responsive-scale))',
                    bottom: 'calc(0.5rem * var(--responsive-scale))',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

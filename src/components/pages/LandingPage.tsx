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
      backgroundColor: '#ECECEC'
    }}>
      {/* Bottom-layer Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        <img
          src="/assets/bg/group-45-2.png"
          alt="Background"
          className="select-none"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            transform: 'scale(1) translateY(5vh)',
            transformOrigin: 'center center'
          }}
        />
      </div>
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
            transform: 'translateY(25dvh) scale(2)',
            transformOrigin: 'center center'
          }}
        />
      </div>
      
      {/* Bookmarks removed per new design */}
      
      {/* HOTO Brand Logo (top-left) */}
      <div className="absolute z-10" style={{
        top: 'calc(3rem * var(--responsive-scale) + env(safe-area-inset-top))',
        left: 'calc(1rem * var(--responsive-scale))'
      }}>
        {/* Use transparent-processed logo */}
        <Logo
          src="/assets/logos/logo.jpg"
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
        gap: 'calc(0.5rem * var(--responsive-scale))',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Creative Philosophy Quotes */}
        <div className="text-center space-y-1 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="grid grid-cols-1 gap-1 max-w-xs mx-auto">
            <div className="text-left">
              <p className="text-gray-500" style={{ 
                fontFamily: 'RM Neue, sans-serif',
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)'
              }}>
                Some tinker endlessly.<br />
                Others design first.
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500" style={{ 
                fontFamily: 'RM Neue, sans-serif',
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)'
              }}>
                Some crave order.<br />
                Others thrive in chaos.
              </p>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.5s', marginTop: '1vh' }}>
          <h1 className="text-black leading-tight" style={{
            fontSize: 'clamp(2.8rem, 10vw, 4.2rem)',
            fontFamily: 'RM Neue, sans-serif',
            fontWeight: 900,
            fontStyle: 'italic'
          }}>
            What's Your<br />
            Creative Gene?
          </h1>
        </div>
        
        {/* Subtitle */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '0.7s', marginTop: '0.5vh' }}>
          <p className="text-gray-600" style={{
            fontSize: 'clamp(1.25rem, 4.5vw, 1.4rem)',
            fontFamily: 'RM Neue, sans-serif',
            fontWeight: 600,
            fontStyle: 'italic',
            paddingLeft: 'calc(0.5rem * var(--responsive-scale))',
            paddingRight: 'calc(0.5rem * var(--responsive-scale))',
            whiteSpace: 'nowrap'
          }}>
            Like DNA, creativity comes in unique types.
          </p>
        </div>
        
      </div>
      
      {/* START TEST Button - 响应式 */}
      <div className="absolute left-1/2 transform -translate-x-1/2 animate-button-slide-up z-10 landing-start" style={{ 
        bottom: 'calc(8rem * var(--responsive-scale) + env(safe-area-inset-bottom))',
        animationDelay: '1.2s' 
      }}>
        <img 
          src="/start-test-button.png"
          alt="START TEST"
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
          className={`landing-start-btn transition-all duration-200 ease-out hover:scale-105 active:scale-95 ${
            agreementChecked 
              ? 'cursor-pointer' 
              : 'cursor-not-allowed opacity-50'
          }`}
          style={{ 
            filter: agreementChecked ? 'none' : 'grayscale(100%)'
          }}
        />
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
      
      {/* Science Behind Modal */}
      {showScienceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" style={{
          padding: 'clamp(1rem, 5vw, 2rem)'
        }}>
            <div className="bg-white w-full animate-scale-in shadow-2xl relative" style={{ 
              maxWidth: 'clamp(320px, 85vw, 480px)', 
              height: 'clamp(550px, 85vh, 650px)',
              width: '100%'
            }}>
            {/* Modal Header - White background with folder tab */}
            <div className="bg-white relative" style={{
              paddingLeft: 'clamp(1rem, 4vw, 2rem)',
              paddingRight: 'clamp(1rem, 4vw, 2rem)',
              paddingTop: 'clamp(1rem, 3vw, 1.5rem)',
              paddingBottom: 'clamp(1rem, 3vw, 1.5rem)',
              height: 'clamp(65px, 12vh, 85px)'
            }}>
              <Logo
                src="/assets/logos/logo.jpg"
                alt="HOTO Logo"
                height={'clamp(20px, 5vw, 30px)'}
              />
              {/* Folder tab label in top right - like file folder */}
              <div className="absolute top-0" style={{
                right: 'clamp(1.5rem, 6vw, 3rem)'
              }}>
                <div 
                  className="text-white r-text-xs font-medium relative font-rm"
                  style={{ 
                    backgroundColor: '#5a5a5a',
                    clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)',
                    paddingLeft: 'clamp(0.5rem, 2vw, 1rem)',
                    paddingRight: 'clamp(0.5rem, 2vw, 1rem)',
                    paddingTop: 'clamp(0.25rem, 1vw, 0.5rem)',
                    paddingBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
                    fontSize: 'clamp(0.7rem, 2.5vw, 0.875rem)'
                  }}
                >
                  THE SCIENCE BEHIND
                </div>
              </div>
            </div>
            
            {/* Modal Content - Medium gray background */}
            <div style={{ 
              backgroundColor: '#5a5a5a', 
              height: 'calc(100% - clamp(65px, 12vh, 85px))',
              paddingLeft: 'clamp(1.2rem, 5vw, 2.5rem)',
              paddingRight: 'clamp(1.2rem, 5vw, 2.5rem)',
              paddingTop: 'clamp(2rem, 6vw, 3rem)',
              paddingBottom: 'clamp(2.5rem, 7vw, 4rem)',
              overflowY: 'auto'
            }}>
              <h3 className="r-text-3xl font-light tracking-wide text-white font-rm" style={{
                marginBottom: 'clamp(2rem, 6vw, 3rem)',
                fontSize: 'clamp(1.8rem, 6vw, 2.2rem)'
              }}>
                THE SCIENCE BEHIND
              </h3>
              
              <div className="text-base leading-relaxed" style={{
                gap: 'clamp(1.5rem, 4vw, 2rem)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <p className="text-white r-text-base font-rm" style={{
                  fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
                  lineHeight: '1.8'
                }}>
                  Based on decades of research in creativity psychology, this test identifies your unique creative DNA - the psychological patterns that drive how you approach making, building, and creating.
                </p>
                
                <p className="text-white r-text-base font-rm" style={{
                  fontSize: 'clamp(1rem, 3.5vw, 1.1rem)',
                  lineHeight: '1.8'
                }}>
                  Drawing from <strong className="text-white">Torrance Creative Thinking Test (1962)</strong> & <strong className="text-white">Gough Creative Personality Scale (1979)</strong>.
                </p>
              </div>
              
              <div style={{
                marginTop: 'clamp(2.5rem, 7vw, 5rem)',
                marginBottom: 'clamp(2rem, 5vw, 3.5rem)'
              }}>
                <p className="r-text-lg text-white" style={{
                  fontSize: 'clamp(1.1rem, 4.5vw, 1.4rem)'
                }}>Ready to discover your type?</p>
              </div>
            </div>
            
            {/* Oval button positioned at bottom-right of modal */}
            <div className="absolute bottom-0 right-0 z-10" style={{
              padding: 'clamp(1rem, 3vw, 2rem)'
            }}>
              <button 
                onClick={() => {
                  setShowScienceModal(false);
                  if (agreementChecked) {
                    onStart();
                  }
                }}
                className="bg-white text-gray-800 font-medium hover:bg-gray-100 transition-colors flex items-center justify-center r-text-base"
                style={{ 
                  width: 'clamp(50px, 12vw, 70px)',
                  height: 'clamp(25px, 6vw, 35px)',
                  borderRadius: 'clamp(12px, 3vw, 17px)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  fontSize: 'clamp(1.2rem, 5vw, 1.5rem)'
                }}
              >
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

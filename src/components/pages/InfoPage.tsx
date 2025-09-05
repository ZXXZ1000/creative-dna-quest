import React, { useState } from 'react';
import { SimplePageContainer } from '../SimplePageContainer';
import { Logo } from '../../components/Logo';

interface InfoPageProps {
  onContinue: (name: string, email: string, region: string, emailSubscription: boolean) => void;
  initialData?: {
    name: string;
    email: string;
    region: string;
    emailSubscription: boolean;
  };
}

export const InfoPage: React.FC<InfoPageProps> = ({ onContinue, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [region, setRegion] = useState(initialData?.region || '');
  const [emailSubscription, setEmailSubscription] = useState(initialData?.emailSubscription ?? true);
  const [errors, setErrors] = useState<{ name?: string; email?: string; region?: string }>({});
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);

  const validate = () => {
    const newErrors: { name?: string; email?: string; region?: string } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (name.trim().length > 20) {
      newErrors.name = 'Name must be at most 20 characters';
    }

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!region) {
      newErrors.region = 'Please select your region';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    if (!email.trim()) {
      setShowEmailPrompt(true);
      return;
    }
    
    onContinue(name.trim(), email.trim(), region, emailSubscription);
  };

  const handleSkipEmail = () => {
    onContinue(name.trim(), '', region, emailSubscription);
    setShowEmailPrompt(false);
  };

  const regions = [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia',
    'Japan', 'China', 'South Korea', 'Singapore', 'Other'
  ];

  return (
    <SimplePageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2 animate-scale-in">
          {/* HOTO Logo - 左上角定位（替换文字为图片组件） */}
          <div className="mb-8 text-left">
            <Logo src="/assets/logos/logo.jpg" alt="HOTO Logo" height={24} />
          </div>
          {/* 标题居中 */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-black">Almost Done!</h2>
            <p className="text-gray-800">
              Tell us a bit about yourself to get your personalized results
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Your Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={20}
                className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all text-black
                  ${errors.name 
                    ? 'border-red-400 focus:border-red-500' 
                    : 'border-gray-200 focus:border-yellow-400'
                  } focus:outline-none`}
              />
              <div className="absolute right-3 bottom-3 text-xs text-black">
                {name.length}/20
              </div>
            </div>
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Email Address (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all text-black
                ${errors.email 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-gray-200 focus:border-yellow-400'
                } focus:outline-none`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-xs text-gray-800 mt-1">
              We'll send you your results and creative tips
            </p>
          </div>

          {/* Region Select */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Country/Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all text-gray-900
                ${errors.region 
                  ? 'border-red-400 focus:border-red-500' 
                  : 'border-gray-200 focus:border-yellow-400'
                } focus:outline-none`}
              style={{ color: region ? '#111827' : '#6B7280' }}
            >
              <option value="" className="text-gray-600">Select Country/Region</option>
              {regions.map(r => (
                <option key={r} value={r} className="text-gray-900">{r}</option>
              ))}
            </select>
            {errors.region && (
              <p className="text-red-500 text-sm mt-1">{errors.region}</p>
            )}
          </div>

          {/* Email Subscription removed per requirement */}
        </div>

        {/* Continue Button */}
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={handleSubmit}
            className="w-full text-black font-semibold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 hover:brightness-95"
            style={{ backgroundColor: '#FFED00' }}
          >
            GET MY RESULTS
          </button>
        </div>

        {/* Email Prompt Modal */}
        {showEmailPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-2xl max-w-sm w-full border border-gray-200 animate-scale-in">
              <div className="text-center space-y-4">
                <div className="text-4xl">🎁</div>
                <h3 className="text-lg font-semibold">Don't miss out!</h3>
                <p className="text-sm text-gray-800">
                  Add your email to receive your personalized Creative DNA results and future creative inspiration!
                </p>
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={() => setShowEmailPrompt(false)}
                    className="w-full text-black font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:brightness-95"
                    style={{ backgroundColor: '#FFED00' }}
                  >
                    I'll add my email
                  </button>
                  <button 
                    onClick={handleSkipEmail}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                  >
                    Skip for now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SimplePageContainer>
  );
};

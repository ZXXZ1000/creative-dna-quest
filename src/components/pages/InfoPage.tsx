import React, { useState } from 'react';
import { SimplePageContainer } from '../SimplePageContainer';

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
        <div className="text-center space-y-2 animate-scale-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Almost Done!</h2>
          <p className="text-muted-foreground">
            Tell us a bit about yourself to get your personalized results
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-input transition-all
                ${errors.name 
                  ? 'border-destructive focus:border-destructive' 
                  : 'border-input-border focus:border-input-focus'
                } focus:outline-none`}
            />
            {errors.name && (
              <p className="text-destructive text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Email Address (Optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 rounded-xl border-2 bg-input transition-all
                ${errors.email 
                  ? 'border-destructive focus:border-destructive' 
                  : 'border-input-border focus:border-input-focus'
                } focus:outline-none`}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              We'll send you your results and creative tips
            </p>
          </div>

          {/* Region Select */}
          <div>
            <label className="block text-sm font-medium mb-2">Country/Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl border-2 bg-input transition-all
                ${errors.region 
                  ? 'border-destructive focus:border-destructive' 
                  : 'border-input-border focus:border-input-focus'
                } focus:outline-none`}
            >
              <option value="">Select Country/Region</option>
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            {errors.region && (
              <p className="text-destructive text-sm mt-1">{errors.region}</p>
            )}
          </div>

          {/* Email Subscription */}
          <div className="flex items-start space-x-3 p-4 bg-card rounded-xl border border-input-border">
            <input
              type="checkbox"
              id="email-subscription"
              checked={emailSubscription}
              onChange={(e) => setEmailSubscription(e.target.checked)}
              className="mt-1 w-4 h-4 text-primary border-2 rounded focus:ring-primary"
            />
            <div className="flex-1">
              <label htmlFor="email-subscription" className="text-sm font-medium cursor-pointer">
                Get product updates and creative tips
              </label>
              <p className="text-xs text-muted-foreground mt-1">
                Receive occasional emails about new HOTO products and creative inspiration. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="pt-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={handleSubmit}
            className="btn-primary w-full"
          >
            GET MY RESULTS
          </button>
        </div>

        {/* Email Prompt Modal */}
        {showEmailPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card p-6 rounded-2xl max-w-sm w-full border border-input-border animate-scale-in">
              <div className="text-center space-y-4">
                <div className="text-4xl">🎁</div>
                <h3 className="text-lg font-semibold">Don't miss out!</h3>
                <p className="text-sm text-muted-foreground">
                  Add your email to receive your personalized Creative DNA results and future creative inspiration!
                </p>
                <div className="space-y-3 pt-2">
                  <button 
                    onClick={() => setShowEmailPrompt(false)}
                    className="btn-primary w-full text-sm py-2"
                  >
                    I'll add my email
                  </button>
                  <button 
                    onClick={handleSkipEmail}
                    className="btn-secondary w-full text-sm py-2"
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
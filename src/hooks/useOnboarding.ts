import { useState, useEffect } from 'react';

interface OnboardingData {
  name: string;
  mainGoals: string[];
  studyHours: string;
  preferredTimes: string[];
  musicPreferences: string[];
  distractionLevel: string;
  motivationStyles: string[];
  reminderTypes: string[];
  psychologicalProfile?: {
    procrastinationType: string;
    adhdIndicators: string[];
    recommendations: string[];
  };
}

export function useOnboarding() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(() => {
    return localStorage.getItem('onboarding_completed') === 'true';
  });
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    const data = localStorage.getItem('onboarding_data');
    
    if (completed === 'true' && data) {
      setIsOnboardingComplete(true);
      setOnboardingData(JSON.parse(data));
    }
  }, []);

  const completeOnboarding = (data: OnboardingData) => {
    localStorage.setItem('onboarding_completed', 'true');
    localStorage.setItem('onboarding_data', JSON.stringify(data));
    setOnboardingData(data);
    setIsOnboardingComplete(true);
  };

  const skipOnboarding = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setIsOnboardingComplete(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('onboarding_data');
    setIsOnboardingComplete(false);
    setOnboardingData(null);
  };

  return {
    isOnboardingComplete,
    onboardingData,
    completeOnboarding,
    skipOnboarding,
    resetOnboarding
  };
}
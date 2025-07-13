import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useProfileCompletion = () => {
  const { user, isAuthenticated } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const isProfileIncomplete = (user: any) => {
    if (!user || user.role === 'guide') return false; // Skip for guides as they have different flow
    
    // Check if basic profile fields are missing
    const basicFields = [
      user.phone,
      user.dateOfBirth, 
      user.countryOfResidence,
      user.travelStyle,
      user.travelFrequency
    ];
    
    // Profile is incomplete if ANY of the basic fields are missing
    const hasAllBasicInfo = basicFields.every(field => field && field.length > 0);
    return !hasAllBasicInfo;
  };

  const shouldShowProfilePrompt = (user: any) => {
    if (!user || user.role === 'guide') return false;
    
    // Don't show if already shown or if profile is complete
    if (user.profileCompletionPromptShown) return false;
    
    // Show if profile is incomplete
    return isProfileIncomplete(user);
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      // Small delay to ensure auth flow is complete
      const timer = setTimeout(() => {
        if (shouldShowProfilePrompt(user)) {
          setShowProfileModal(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, user]);

  const handleCloseModal = () => {
    setShowProfileModal(false);
  };

  const handleCompleteProfile = () => {
    setShowProfileModal(false);
  };

  return {
    showProfileModal,
    handleCloseModal,
    handleCompleteProfile,
    isProfileIncomplete: user ? isProfileIncomplete(user) : false
  };
};
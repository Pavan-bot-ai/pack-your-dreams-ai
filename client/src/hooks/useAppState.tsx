
import { useState } from "react";

export const useAppState = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLocalGuide, setShowLocalGuide] = useState(false);
  const [showTripPlanner, setShowTripPlanner] = useState(false);
  const [showTranslator, setShowTranslator] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState<string>('');
  const [showTransactions, setShowTransactions] = useState(false);
  const [showPlaceDetails, setShowPlaceDetails] = useState(false);
  const [selectedPlaceForDetails, setSelectedPlaceForDetails] = useState<string>('');

  const handleFeatureClick = (feature: string) => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
    
    switch (feature) {
      case 'trip-planner':
        setShowTripPlanner(true);
        break;
      case 'local-guide':
        setShowLocalGuide(true);
        break;
      case 'translator':
        setShowTranslator(true);
        break;
      case 'bookings':
        setShowBookings(true);
        break;
      default:
        console.log(`Opening ${feature}`);
    }
  };

  const handleTrendingPlaceClick = (destination: string) => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
    
    setSelectedDestination(destination);
    setShowTripPlanner(true);
  };

  const handleMenuItemClick = (item: string) => {
    if (!isLoggedIn && item !== 'login' && item !== 'settings') {
      setShowAuth(true);
      return;
    }

    switch (item) {
      case 'login':
        setShowAuth(true);
        break;
      case 'booked-plans':
        setShowTripPlanner(true);
        break;
      case 'transactions':
        setShowTransactions(true);
        break;
      case 'saved-places':
        console.log('Opening saved places');
        break;
      case 'trip-history':
        console.log('Opening trip history');
        break;
      case 'profile':
        console.log('Opening profile');
        break;
      case 'settings':
        console.log('Opening settings');
        break;
      default:
        console.log(`Opening ${item}`);
    }
  };

  const handleLogin = (userData: any) => {
    setIsLoggedIn(true);
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  const handlePlaceImageClick = (destination: string) => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
    
    setSelectedPlaceForDetails(destination);
    setShowPlaceDetails(true);
  };

  const handleGeneratePlanFromDetails = (planDetails: any) => {
    setSelectedDestination(planDetails.destination);
    console.log('Generating plan with details:', planDetails);
    setShowTripPlanner(true);
  };

  return {
    // State
    showAuth,
    isLoggedIn,
    showLocalGuide,
    showTripPlanner,
    showTranslator,
    showBookings,
    user,
    selectedDestination,
    showTransactions,
    showPlaceDetails,
    selectedPlaceForDetails,
    
    // State setters
    setShowAuth,
    setShowLocalGuide,
    setShowTripPlanner,
    setShowTranslator,
    setShowBookings,
    setShowTransactions,
    setShowPlaceDetails,
    setSelectedDestination,
    
    // Event handlers
    handleFeatureClick,
    handleTrendingPlaceClick,
    handleMenuItemClick,
    handleLogin,
    handleLogout,
    handlePlaceImageClick,
    handleGeneratePlanFromDetails,
  };
};

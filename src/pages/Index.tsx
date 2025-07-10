
import { useAppState } from "@/hooks/useAppState";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import QuickActionsSection from "@/components/QuickActionsSection";
import VideoReelsSection from "@/components/VideoReelsSection";
import ModalManager from "@/components/ModalManager";

const Index = () => {
  const {
    // State
    showAuth,
    isLoggedIn,
    showLocalGuide,
    showTripPlanner,
    showTranslator,
    showBookings,
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
  } = useAppState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header
        isLoggedIn={isLoggedIn}
        onMenuItemClick={handleMenuItemClick}
        onAuthClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      <HeroSection
        onPlaceClick={handleTrendingPlaceClick}
        onImageClick={handlePlaceImageClick}
      />

      <QuickActionsSection onActionClick={handleFeatureClick} />

      <VideoReelsSection />

      <ModalManager
        showAuth={showAuth}
        showPlaceDetails={showPlaceDetails}
        showTripPlanner={showTripPlanner}
        showLocalGuide={showLocalGuide}
        showTranslator={showTranslator}
        showBookings={showBookings}
        showTransactions={showTransactions}
        selectedPlaceForDetails={selectedPlaceForDetails}
        selectedDestination={selectedDestination}
        onAuthClose={() => setShowAuth(false)}
        onPlaceDetailsClose={() => setShowPlaceDetails(false)}
        onTripPlannerClose={() => {
          setShowTripPlanner(false);
          setSelectedDestination('');
        }}
        onLocalGuideClose={() => setShowLocalGuide(false)}
        onTranslatorClose={() => setShowTranslator(false)}
        onBookingsClose={() => setShowBookings(false)}
        onTransactionsClose={() => setShowTransactions(false)}
        onLogin={handleLogin}
        onGeneratePlan={handleGeneratePlanFromDetails}
      />
    </div>
  );
};

export default Index;

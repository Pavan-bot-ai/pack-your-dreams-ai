import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Plane, 
  MessageCircle, 
  Languages, 
  Calendar,
  Star,
  Play,
  User,
  LogIn
} from "lucide-react";
import TrendingPlaces from "@/components/TrendingPlaces";
import QuickActions from "@/components/QuickActions";
import VideoReels from "@/components/VideoReels";
import AuthModal from "@/components/AuthModal";
import AILocalGuide from "@/components/AILocalGuide";
import SmartTripPlanner from "@/components/SmartTripPlanner";
import AITranslator from "@/components/AITranslator";
import AIBookings from "@/components/AIBookings";
import HamburgerMenu from "@/components/HamburgerMenu";
import TransactionsList from "@/components/TransactionsList";
import PlaceDetailsModal from "@/components/PlaceDetailsModal";

const Index = () => {
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
    
    // Load default plan for the selected destination
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
    // Set the selected destination for the trip planner
    setSelectedDestination(planDetails.destination);
    
    // Store additional details for the trip planner to use
    console.log('Generating plan with details:', planDetails);
    
    // Open the trip planner with the detailed information
    setShowTripPlanner(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-morphism">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <HamburgerMenu isLoggedIn={isLoggedIn} onMenuItemClick={handleMenuItemClick} />
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Pack Your Bags
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Welcome back!</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => setShowAuth(true)}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login / Sign Up
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with Trending Places */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Discover Your Next Adventure
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Let AI plan your perfect trip with personalized recommendations and smart itineraries
            </p>
          </div>
          <TrendingPlaces 
            onPlaceClick={handleTrendingPlaceClick} 
            onImageClick={handlePlaceImageClick}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 bg-white/50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Quick Actions</h3>
          <QuickActions onActionClick={handleFeatureClick} />
        </div>
      </section>

      {/* Video Reels */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-8">Places & Reviews</h3>
          <VideoReels />
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onLogin={handleLogin}
      />

      {/* Place Details Modal */}
      <PlaceDetailsModal 
        isOpen={showPlaceDetails}
        onClose={() => setShowPlaceDetails(false)}
        destination={selectedPlaceForDetails}
        onGeneratePlan={handleGeneratePlanFromDetails}
      />

      {/* Smart Trip Planner Modal */}
      <SmartTripPlanner 
        isOpen={showTripPlanner}
        onClose={() => {
          setShowTripPlanner(false);
          setSelectedDestination('');
        }}
        defaultDestination={selectedDestination}
      />

      {/* AI Local Guide Modal */}
      <AILocalGuide 
        isOpen={showLocalGuide}
        onClose={() => setShowLocalGuide(false)}
      />

      {/* AI Translator Modal */}
      <AITranslator 
        isOpen={showTranslator}
        onClose={() => setShowTranslator(false)}
      />

      {/* AI Bookings Modal */}
      <AIBookings 
        isOpen={showBookings}
        onClose={() => setShowBookings(false)}
      />

      {/* Transactions Modal */}
      <TransactionsList 
        isOpen={showTransactions}
        onClose={() => setShowTransactions(false)}
      />
    </div>
  );
};

export default Index;

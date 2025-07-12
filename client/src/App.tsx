import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Router, Route, Switch } from "wouter";

// Auth Components
import AuthPageModal from "./components/AuthPageModal";
import GuideRegistration from "./pages/GuideRegistration";
import UserDashboard from "./pages/UserDashboard";
import GuideDashboard from "./pages/GuideDashboard";
import AdminDashboard from "./pages/AdminDashboard";

// Existing Components
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import BookedPlans from "./pages/BookedPlans";
import Transactions from "./pages/Transactions";
import TransactionDetails from "./pages/TransactionDetails";
import SavedPlaces from "./pages/SavedPlaces";
import TripHistory from "./pages/TripHistory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PlanGeneration from "./pages/PlanGeneration";
import BookingFlow from "./pages/BookingFlow";
import BookingSuccess from "./pages/BookingSuccess";
import HotelBooking from "./pages/HotelBooking";
import HotelPayment from "./pages/HotelPayment";
import PaymentStatus from "./pages/PaymentStatus";
import HotelBookingSuccess from "./pages/HotelBookingSuccess";
import TripPaymentSummary from "./pages/TripPaymentSummary";
import TripPaymentMethods from "./pages/TripPaymentMethods";
import TripPaymentDetails from "./pages/TripPaymentDetails";
import TripPaymentStatus from "./pages/TripPaymentStatus";

const App = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGuideRegistration, setShowGuideRegistration] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    // Check for existing user session and validate token
    const checkSession = async () => {
      const token = localStorage.getItem("travelApp_token");
      const storedUser = localStorage.getItem("travelApp_currentUser");
      
      if (token && storedUser) {
        try {
          // Validate token with server
          const response = await fetch("/api/auth/me", {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const user = await response.json();
            setCurrentUser(user);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("travelApp_token");
            localStorage.removeItem("travelApp_currentUser");
          }
        } catch (error) {
          // Network error, use stored user for offline functionality
          setCurrentUser(JSON.parse(storedUser));
        }
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setShowAuth(false);
    setShowGuideRegistration(false);
  };

  const handleGuideRegistration = () => {
    setShowAuth(false);
    setShowGuideRegistration(true);
  };

  const handleGuideRegistrationComplete = (user: any) => {
    setCurrentUser(user);
    setShowGuideRegistration(false);
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("travelApp_token");
      
      if (token) {
        const response = await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        
        if (!response.ok) {
          console.warn("Logout request failed:", response.status);
        }
      }
    } catch (error) {
      console.warn("Network error during logout:", error);
    } finally {
      // Always clear local storage and user state, regardless of server response
      localStorage.removeItem("travelApp_token");
      localStorage.removeItem("travelApp_currentUser");
      setCurrentUser(null);
    }
  };

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleAuthClose = () => {
    setShowAuth(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Show Guide Registration if user is guide but registration not complete
  if (showGuideRegistration || (currentUser?.role === "guide" && !currentUser?.isRegistrationComplete)) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GuideRegistration 
            onRegistrationComplete={handleGuideRegistrationComplete}
            onBack={() => {
              setShowGuideRegistration(false);
              setShowAuth(true);
            }}
          />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show Role-Based Dashboard for authenticated guides (they go directly to dashboard)
  if (currentUser?.role === "guide" && currentUser?.isRegistrationComplete) {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GuideDashboard user={currentUser} onLogout={handleLogout} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show Admin Dashboard for admin users
  if (currentUser?.role === "admin") {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AdminDashboard user={currentUser} onLogout={handleLogout} />
        </TooltipProvider>
      </QueryClientProvider>
    );
  }

  // Show home page for everyone else (logged in users, guests, and users with modal auth)
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Switch>
                <Route path="/dashboard" component={() => 
                  currentUser?.role === "user" ? (
                    <UserDashboard user={currentUser} onLogout={handleLogout} />
                  ) : (
                    <Index onLoginClick={handleLoginClick} currentUser={currentUser} onLogout={handleLogout} />
                  )
                } />
                <Route path="/" component={() => (
                  <Index 
                    onLoginClick={handleLoginClick} 
                    currentUser={currentUser} 
                    onLogout={handleLogout}
                  />
                )} />
                <Route path="/booked-plans" component={BookedPlans} />
                <Route path="/transactions" component={Transactions} />
                <Route path="/transaction-details/:tripId" component={TransactionDetails} />
                <Route path="/saved-places" component={SavedPlaces} />
                <Route path="/trip-history" component={TripHistory} />
                <Route path="/profile" component={Profile} />
                <Route path="/settings" component={Settings} />
                <Route path="/plan-generation" component={PlanGeneration} />
                <Route path="/booking-flow" component={BookingFlow} />
                <Route path="/booking-success" component={BookingSuccess} />
                <Route path="/hotel-booking" component={HotelBooking} />
                <Route path="/hotel-payment" component={HotelPayment} />
                <Route path="/payment-status" component={PaymentStatus} />
                <Route path="/hotel-booking-success" component={HotelBookingSuccess} />
                <Route path="/trip-payment-summary" component={TripPaymentSummary} />
                <Route path="/trip-payment-methods" component={TripPaymentMethods} />
                <Route path="/trip-payment-details" component={TripPaymentDetails} />
                <Route path="/trip-payment-status" component={TripPaymentStatus} />
                <Route path="/admin" component={() => 
                  currentUser?.role === "admin" ? (
                    <AdminDashboard user={currentUser} onLogout={handleLogout} />
                  ) : (
                    <Index onLoginClick={handleLoginClick} currentUser={currentUser} onLogout={handleLogout} />
                  )
                } />
                <Route component={NotFound} />
              </Switch>
            </Router>

            {/* Auth Modal */}
            {showAuth && (
              <AuthPageModal 
                isOpen={showAuth}
                onClose={handleAuthClose}
                onAuthSuccess={handleAuthSuccess}
                onGuideRegistration={handleGuideRegistration}
              />
            )}
          </TooltipProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;

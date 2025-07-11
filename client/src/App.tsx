import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route, Switch } from "wouter";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Switch>
          <Route path="/" component={Index} />
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

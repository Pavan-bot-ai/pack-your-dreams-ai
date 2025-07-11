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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route component={NotFound} />
        </Switch>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

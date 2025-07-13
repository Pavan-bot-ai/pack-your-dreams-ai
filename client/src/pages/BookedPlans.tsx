import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Plane, 
  Hotel, 
  CreditCard,
  ChevronRight,
  Package,
  Star,
  Eye
} from "lucide-react";

interface BookedPlan {
  id: number;
  planTitle: string;
  destination: string;
  planDetails: string;
  transportDetails: string;
  hotelDetails: string;
  itineraryDetails: string;
  totalAmount: number;
  transportAmount: number;
  hotelAmount: number;
  itineraryAmount: number;
  paymentMethod: string;
  bookingStatus: string;
  travelDate: string;
  duration: string;
  createdAt: string;
}

const BookedPlans = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<BookedPlan | null>(null);

  const { data: bookedPlans = [], isLoading, error } = useQuery({
    queryKey: ['/api/booked-plans'],
    enabled: isAuthenticated,
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const parseItineraryDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      if (parsed.itinerary && Array.isArray(parsed.itinerary)) {
        return parsed.itinerary.map((day: any, index: number) => (
          <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Day {day.day}</h4>
            <ul className="list-disc list-inside space-y-1">
              {day.activities?.map((activity: string, actIndex: number) => (
                <li key={actIndex} className="text-gray-600 text-sm">{activity}</li>
              ))}
            </ul>
          </div>
        ));
      }
      if (parsed.highlights && Array.isArray(parsed.highlights)) {
        return (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-800">Trip Highlights:</h4>
            <ul className="list-disc list-inside space-y-1">
              {parsed.highlights.map((highlight: string, index: number) => (
                <li key={index} className="text-gray-600 text-sm">{highlight}</li>
              ))}
            </ul>
          </div>
        );
      }
      return <p className="text-gray-600 text-sm">{parsed.title || 'Adventure activities included'}</p>;
    } catch (error) {
      return <p className="text-gray-500 text-sm">Activity details unavailable</p>;
    }
  };

  const parseTransportDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      if (Object.keys(parsed).length === 0) {
        return <p className="text-gray-500 text-sm">Transport details will be available after booking</p>;
      }
      return (
        <div className="space-y-1">
          {parsed.mode && <p className="text-sm text-gray-600">Mode: {parsed.mode}</p>}
          {parsed.from && <p className="text-sm text-gray-600">From: {parsed.from}</p>}
          {parsed.to && <p className="text-sm text-gray-600">To: {parsed.to}</p>}
          {parsed.date && <p className="text-sm text-gray-600">Date: {new Date(parsed.date).toLocaleDateString()}</p>}
        </div>
      );
    } catch (error) {
      return <p className="text-gray-500 text-sm">Transport details unavailable</p>;
    }
  };

  const parseHotelDetails = (details: string) => {
    try {
      const parsed = JSON.parse(details);
      if (Object.keys(parsed).length === 0) {
        return <p className="text-gray-500 text-sm">Hotel details will be available after booking</p>;
      }
      return (
        <div className="space-y-1">
          {parsed.name && <p className="text-sm text-gray-600">Hotel: {parsed.name}</p>}
          {parsed.room && <p className="text-sm text-gray-600">Room: {parsed.room}</p>}
          {parsed.checkin && <p className="text-sm text-gray-600">Check-in: {new Date(parsed.checkin).toLocaleDateString()}</p>}
          {parsed.checkout && <p className="text-sm text-gray-600">Check-out: {new Date(parsed.checkout).toLocaleDateString()}</p>}
        </div>
      );
    } catch (error) {
      return <p className="text-gray-500 text-sm">Hotel details unavailable</p>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Package className="w-12 h-12 mx-auto text-blue-500 mb-4" />
            <CardTitle>Please Sign In</CardTitle>
            <CardDescription>
              You need to be signed in to view your booked plans
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg text-gray-600">Loading your travel plans...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Booked Plans</h1>
              <p className="text-gray-600">Manage and view your travel bookings</p>
            </div>
          </div>
          
          {bookedPlans.length > 0 && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>Total Plans: {bookedPlans.length}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>Confirmed: {bookedPlans.filter((p: BookedPlan) => p.bookingStatus === 'confirmed').length}</span>
            </div>
          )}
        </div>

        {/* Plans Grid */}
        {bookedPlans.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <CardTitle className="text-gray-600">No Plans Yet</CardTitle>
              <CardDescription>
                Start planning your next adventure! Your booked plans will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                <MapPin className="w-4 h-4 mr-2" />
                Plan New Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookedPlans.map((plan: BookedPlan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow duration-200 cursor-pointer group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 line-clamp-1">{plan.planTitle}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{plan.destination}</span>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(plan.bookingStatus)} border`}>
                      {plan.bookingStatus}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Travel Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="text-gray-500">Travel Date</p>
                        <p className="font-medium">{plan.travelDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <div>
                        <p className="text-gray-500">Duration</p>
                        <p className="font-medium">{plan.duration}</p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Components */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-blue-500" />
                        <span>Transport</span>
                      </div>
                      <span className="font-medium">{formatCurrency(plan.transportAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Hotel className="w-4 h-4 text-orange-500" />
                        <span>Hotel</span>
                      </div>
                      <span className="font-medium">{formatCurrency(plan.hotelAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>Activities</span>
                      </div>
                      <span className="font-medium">{formatCurrency(plan.itineraryAmount)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between font-semibold">
                      <span>Total Amount</span>
                      <span className="text-green-600">{formatCurrency(plan.totalAmount)}</span>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CreditCard className="w-4 h-4" />
                    <span>Paid via {plan.paymentMethod}</span>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  </Button>

                  {/* Booking Date */}
                  <p className="text-xs text-gray-500 text-center">
                    Booked on {formatDate(plan.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Plan Details Modal */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{selectedPlan.planTitle}</h2>
                <Button variant="ghost" onClick={() => setSelectedPlan(null)}>
                  ✕
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Plan Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trip Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Destination</p>
                        <p className="font-semibold text-lg">{selectedPlan.destination}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Travel Date</p>
                        <p className="font-semibold">{selectedPlan.travelDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Duration</p>
                        <p className="font-semibold">{selectedPlan.duration}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Plane className="w-5 h-5 text-blue-500" />
                        Transportation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(selectedPlan.transportAmount)}</p>
                      {selectedPlan.transportDetails && (
                        <div className="mt-2">
                          {parseTransportDetails(selectedPlan.transportDetails)}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Hotel className="w-5 h-5 text-orange-500" />
                        Accommodation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-orange-600">{formatCurrency(selectedPlan.hotelAmount)}</p>
                      {selectedPlan.hotelDetails && (
                        <div className="mt-2">
                          {parseHotelDetails(selectedPlan.hotelDetails)}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        Activities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-yellow-600">{formatCurrency(selectedPlan.itineraryAmount)}</p>
                      {selectedPlan.itineraryDetails && (
                        <div className="mt-2">
                          {parseItineraryDetails(selectedPlan.itineraryDetails)}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Total and Payment */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between text-xl font-bold">
                      <span>Total Amount Paid</span>
                      <span className="text-green-600">{formatCurrency(selectedPlan.totalAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-gray-600">
                      <CreditCard className="w-4 h-4" />
                      <span>Payment Method: {selectedPlan.paymentMethod}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedPlans;
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, X } from "lucide-react";
import { useLocation } from "wouter";

const BookedPlans = () => {
  const [, setLocation] = useLocation();

  // Placeholder data - will be replaced with database fetch
  const bookedPlans = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Booked Plans</h1>
        </div>

        {/* Content */}
        {bookedPlans.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No booked plans yet</div>
            <div className="text-gray-400">Your future travel plans will appear here</div>
          </div>
        ) : (
          <div className="space-y-4">
            {bookedPlans.map((plan: any) => (
              <Card key={plan.id} className="w-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.tripName}</CardTitle>
                      <p className="text-gray-600">{plan.destination}</p>
                    </div>
                    <Badge variant={plan.status === "confirmed" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Travel Dates</p>
                      <p className="font-medium">{plan.travelDates}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Transport</p>
                      <p className="font-medium">{plan.transport}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Accommodation</p>
                      <p className="font-medium">{plan.accommodation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Booking Status</p>
                      <p className="font-medium">{plan.bookingStatus}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Ticket
                    </Button>
                    <Button size="sm" variant="destructive" className="ml-auto">
                      <X className="h-4 w-4 mr-2" />
                      Cancel Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookedPlans;
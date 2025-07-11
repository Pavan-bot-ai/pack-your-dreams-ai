import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star, Heart } from "lucide-react";
import { useLocation } from "wouter";

const SavedPlaces = () => {
  const [, setLocation] = useLocation();

  // Placeholder data - will be replaced with database fetch
  const savedPlaces = [];

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
          <h1 className="text-2xl font-bold text-gray-900">Saved Places</h1>
        </div>

        {/* Content */}
        {savedPlaces.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">You haven't saved any places yet</div>
            <div className="text-gray-400">Start exploring and tap the heart to add favorites</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlaces.map((place: any) => (
              <Card key={place.id} className="w-full overflow-hidden">
                <div className="relative">
                  <img 
                    src={place.image} 
                    alt={place.name}
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-600"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{place.name}</CardTitle>
                  <p className="text-gray-600 text-sm">{place.location}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{place.rating}</span>
                    <span className="text-gray-500 text-sm ml-1">({place.reviews} reviews)</span>
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

export default SavedPlaces;
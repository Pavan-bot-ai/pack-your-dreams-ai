
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

const trendingPlaces = [
  {
    id: 1,
    name: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
    rating: 4.9,
    price: "$1,200",
    description: "Stunning sunsets and white-washed buildings",
    tags: ["Romantic", "Beach", "Photography"]
  },
  {
    id: 2,
    name: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    rating: 4.8,
    price: "$900",
    description: "Ancient temples and cherry blossoms",
    tags: ["Culture", "Historic", "Gardens"]
  },
  {
    id: 3,
    name: "Machu Picchu, Peru",
    image: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=400&h=300&fit=crop",
    rating: 4.9,
    price: "$800",
    description: "Ancient Incan citadel in the clouds",
    tags: ["Adventure", "Historic", "Hiking"]
  },
  {
    id: 4,
    name: "Bali, Indonesia",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
    rating: 4.7,
    price: "$600",
    description: "Tropical paradise with rice terraces",
    tags: ["Beach", "Wellness", "Culture"]
  },
  {
    id: 5,
    name: "Swiss Alps",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    rating: 4.8,
    price: "$1,500",
    description: "Majestic mountains and pristine lakes",
    tags: ["Adventure", "Nature", "Skiing"]
  },
  {
    id: 6,
    name: "Dubai, UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
    rating: 4.6,
    price: "$1,100",
    description: "Futuristic city with luxury experiences",
    tags: ["Luxury", "Shopping", "Architecture"]
  }
];

const TrendingPlaces = () => {
  // Duplicate the array for seamless scrolling
  const duplicatedPlaces = [...trendingPlaces, ...trendingPlaces];

  return (
    <div className="relative overflow-hidden">
      <div className="flex space-x-6 scroll-animation">
        {duplicatedPlaces.map((place, index) => (
          <Card 
            key={`${place.id}-${index}`} 
            className="flex-shrink-0 w-80 card-hover cursor-pointer group"
          >
            <CardContent className="p-0">
              <div className="relative">
                <img 
                  src={place.image} 
                  alt={place.name}
                  className="w-full h-48 object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                    {place.price}
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass-morphism rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{place.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-white text-sm">{place.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-3">{place.description}</p>
                <div className="flex flex-wrap gap-2">
                  {place.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TrendingPlaces;


import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Star, MapPin, Heart } from "lucide-react";

const videoReels = [
  {
    id: 1,
    title: "Hidden Gems of Tokyo",
    location: "Tokyo, Japan",
    thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=400&fit=crop",
    rating: 4.8,
    views: "2.3M",
    duration: "3:45",
    author: "TravelWithSarah"
  },
  {
    id: 2,
    title: "Bali Beach Sunset",
    location: "Bali, Indonesia",
    thumbnail: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=300&h=400&fit=crop",
    rating: 4.9,
    views: "1.8M",
    duration: "2:30",
    author: "IslandVibes"
  },
  {
    id: 3,
    title: "Swiss Mountain Adventure",
    location: "Swiss Alps",
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop",
    rating: 4.7,
    views: "950K",
    duration: "4:12",
    author: "MountainExplorer"
  },
  {
    id: 4,
    title: "Santorini Blue Domes",
    location: "Santorini, Greece",
    thumbnail: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=400&fit=crop",
    rating: 4.9,
    views: "3.1M",
    duration: "2:15",
    author: "GreekIslands"
  },
  {
    id: 5,
    title: "Dubai Skyline at Night",
    location: "Dubai, UAE",
    thumbnail: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=300&h=400&fit=crop",
    rating: 4.6,
    views: "1.2M",
    duration: "3:20",
    author: "CityLights"
  },
  {
    id: 6,
    title: "Machu Picchu Sunrise",
    location: "Machu Picchu, Peru",
    thumbnail: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=300&h=400&fit=crop",
    rating: 4.8,
    views: "890K",
    duration: "5:00",
    author: "AndeanAdventure"
  }
];

const VideoReels = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videoReels.map((reel) => (
        <Card key={reel.id} className="group cursor-pointer card-hover overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img 
                src={reel.thumbnail} 
                alt={reel.title}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play className="w-8 h-8 text-white ml-1" fill="white" />
                </div>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/70 text-white hover:bg-black/70">
                  {reel.duration}
                </Badge>
              </div>

              {/* Heart Icon */}
              <div className="absolute top-4 left-4">
                <Heart className="w-6 h-6 text-white/80 hover:text-red-400 hover:fill-red-400 transition-colors cursor-pointer" />
              </div>

              {/* Views Badge */}
              <div className="absolute bottom-4 right-4">
                <Badge variant="secondary" className="bg-white/90">
                  {reel.views} views
                </Badge>
              </div>
            </div>

            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2 line-clamp-2">{reel.title}</h4>
              
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600 text-sm">{reel.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{reel.rating}</span>
                </div>
                <span className="text-sm text-gray-500">@{reel.author}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default VideoReels;

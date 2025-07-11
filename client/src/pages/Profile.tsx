import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, User, Mail, Phone, MapPin, Heart, Plane } from "lucide-react";
import { useLocation } from "wouter";

const Profile = () => {
  const [, setLocation] = useLocation();

  // Placeholder data - will be replaced with database fetch
  const profileData = {
    name: "",
    email: "",
    phone: "",
    location: "",
    profilePicture: "",
    travelPreferences: {
      budget: "",
      interests: [],
      accommodation: "",
      transport: ""
    }
  };

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
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        </div>

        {/* Content */}
        {!profileData.name ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <div className="text-gray-500 text-lg mb-2">No profile information found</div>
            <div className="text-gray-400">Please complete your profile during login</div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profileData.profilePicture} />
                    <AvatarFallback>
                      {profileData.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">{profileData.name}</h2>
                    <p className="text-gray-600">Travel Enthusiast</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{profileData.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Preferences Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-500" />
                  Travel Preferences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Budget Range</p>
                    <p className="font-medium">{profileData.travelPreferences.budget}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Preferred Transport</p>
                    <p className="font-medium">{profileData.travelPreferences.transport}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Accommodation Type</p>
                    <p className="font-medium">{profileData.travelPreferences.accommodation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Interests</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profileData.travelPreferences.interests.map((interest: string, index: number) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
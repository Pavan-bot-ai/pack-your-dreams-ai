import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  MapPin, 
  Star, 
  DollarSign, 
  Calendar, 
  Users, 
  Sparkles,
  Bell,
  TrendingUp,
  Award,
  Globe,
  Camera,
  MessageSquare,
  Settings,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface GuideDashboardProps {
  user: any;
  onLogout: () => void;
}

const GuideDashboard = ({ user, onLogout }: GuideDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [newRequests, setNewRequests] = useState([]);
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, thisWeek: 0 });
  const [tourIdeas, setTourIdeas] = useState([]);
  const [ideaPrompt, setIdeaPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading guide data
    loadGuideData();
  }, []);

  const loadGuideData = () => {
    // Simulate new tour requests
    setNewRequests([
      {
        id: 1,
        travelerName: "Sarah Johnson",
        destination: "Paris Historic District",
        date: "2025-01-15",
        duration: "4 hours",
        travelers: 2,
        budget: "$150",
        message: "Looking for a comprehensive tour of Montmartre with focus on art history.",
        status: "pending"
      },
      {
        id: 2,
        travelerName: "Mike Chen",
        destination: "Tokyo Food Culture",
        date: "2025-01-18",
        duration: "6 hours",
        travelers: 4,
        budget: "$200",
        message: "Want to experience authentic local cuisine and hidden food spots.",
        status: "pending"
      }
    ]);

    // Simulate earnings data
    setEarnings({
      total: user.totalEarnings || 2450,
      thisMonth: 620,
      thisWeek: 150
    });
  };

  const handleRequestAction = (requestId: number, action: string) => {
    setNewRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: action } : req
    ));
    
    toast({
      title: "Success",
      description: `Tour request ${action}ed successfully!`,
    });
  };

  const generateTourIdea = async () => {
    if (!ideaPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a destination or theme for tour ideas",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const newIdea = {
        id: Date.now(),
        title: `${ideaPrompt} Discovery Tour`,
        description: `An immersive experience exploring the best of ${ideaPrompt}, including hidden gems, local culture, and must-see attractions.`,
        duration: "3-4 hours",
        highlights: [
          "Expert local insights",
          "Hidden local spots",
          "Cultural experiences",
          "Photography opportunities"
        ],
        suggestedPrice: "$85-120",
        difficulty: "Easy to Moderate"
      };
      
      setTourIdeas(prev => [newIdea, ...prev]);
      setIdeaPrompt("");
      setIsGenerating(false);
      
      toast({
        title: "AI Tour Idea Generated!",
        description: "Your personalized tour concept is ready for review.",
      });
    }, 2000);
  };

  const stats = [
    {
      title: "Total Earnings",
      value: `$${earnings.total}`,
      icon: DollarSign,
      change: "+12%",
      period: "from last month"
    },
    {
      title: "Active Tours",
      value: user.completedTours || "8",
      icon: MapPin,
      change: "+3",
      period: "this month"
    },
    {
      title: "Rating",
      value: user.rating || "4.9",
      icon: Star,
      change: "+0.2",
      period: "from reviews"
    },
    {
      title: "New Requests",
      value: newRequests.length.toString(),
      icon: Bell,
      change: "",
      period: "awaiting response"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Local Guide Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {user.rating || "4.9"} Rating
              </Badge>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {newRequests.filter(r => r.status === "pending").length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                  {newRequests.filter(r => r.status === "pending").length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="tours">My Tours</TabsTrigger>
            <TabsTrigger value="ai-ideas">AI Ideas</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold">{stat.value}</p>
                          {stat.change && (
                            <Badge variant="secondary" className="text-xs">
                              {stat.change}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{stat.period}</p>
                      </div>
                      <stat.icon className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <Users className="h-4 w-4 text-blue-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">New tour request from Sarah Johnson</p>
                        <p className="text-xs text-gray-600">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                      <Star className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Received 5-star review from Mike Chen</p>
                        <p className="text-xs text-gray-600">1 day ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Payment received: $150</p>
                        <p className="text-xs text-gray-600">2 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Week's Earnings</span>
                      <span className="font-semibold">${earnings.thisWeek}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">This Month's Earnings</span>
                      <span className="font-semibold">${earnings.thisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Reviews</span>
                      <span className="font-semibold">{user.totalReviews || "23"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Response Rate</span>
                      <span className="font-semibold">98%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>New Tour Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {newRequests.filter(req => req.status === "pending").length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No new requests at the moment.</p>
                ) : (
                  newRequests.filter(req => req.status === "pending").map((request) => (
                    <Card key={request.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{request.travelerName}</h4>
                            <p className="text-sm text-gray-600">{request.destination}</p>
                          </div>
                          <Badge variant="outline">{request.budget}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <p className="font-medium">{request.date}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <p className="font-medium">{request.duration}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Travelers:</span>
                            <p className="font-medium">{request.travelers}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Budget:</span>
                            <p className="font-medium">{request.budget}</p>
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <span className="text-gray-500 text-sm">Message:</span>
                          <p className="text-sm mt-1">{request.message}</p>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button 
                            size="sm" 
                            onClick={() => handleRequestAction(request.id, "accepted")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRequestAction(request.id, "declined")}
                          >
                            Decline
                          </Button>
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Ideas Tab */}
          <TabsContent value="ai-ideas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  AI Tour Idea Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idea-prompt">Enter a destination or theme for tour ideas</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="idea-prompt"
                      placeholder="e.g., Historic Paris, Tokyo Food Culture, London Art Scene"
                      value={ideaPrompt}
                      onChange={(e) => setIdeaPrompt(e.target.value)}
                    />
                    <Button 
                      onClick={generateTourIdea}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-purple-600 to-blue-600"
                    >
                      {isGenerating ? "Generating..." : "Generate"}
                    </Button>
                  </div>
                </div>
                
                {tourIdeas.length > 0 && (
                  <div className="space-y-4 mt-6">
                    <h4 className="font-semibold">Generated Tour Ideas</h4>
                    {tourIdeas.map((idea) => (
                      <Card key={idea.id} className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <h5 className="font-semibold mb-2">{idea.title}</h5>
                          <p className="text-sm text-gray-600 mb-3">{idea.description}</p>
                          
                          <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                            <div>
                              <span className="text-gray-500">Duration:</span>
                              <p className="font-medium">{idea.duration}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Suggested Price:</span>
                              <p className="font-medium">{idea.suggestedPrice}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Difficulty:</span>
                              <p className="font-medium">{idea.difficulty}</p>
                            </div>
                          </div>
                          
                          <div className="mb-3">
                            <span className="text-gray-500 text-sm">Highlights:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {idea.highlights.map((highlight, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Button size="sm" variant="outline">
                            Save as Template
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guide Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Personal Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Name:</span> {user.name}</p>
                      <p><span className="text-gray-500">Email:</span> {user.email}</p>
                      <p><span className="text-gray-500">Phone:</span> {user.phone}</p>
                      <p><span className="text-gray-500">Experience:</span> {user.experience}</p>
                      {user.certification && (
                        <p><span className="text-gray-500">Certification:</span> {user.certification}</p>
                      )}
                      {user.hourlyRate && (
                        <p><span className="text-gray-500">Hourly Rate:</span> ${user.hourlyRate}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-500">Total Earnings:</span> ${earnings.total}</p>
                      <p><span className="text-gray-500">Completed Tours:</span> {user.completedTours || 0}</p>
                      <p><span className="text-gray-500">Rating:</span> {user.rating || "New Guide"}</p>
                      <p><span className="text-gray-500">Total Reviews:</span> {user.totalReviews || 0}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Bio</h4>
                  <p className="text-sm text-gray-700">{user.bio}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Service Areas
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.serviceAreas?.map((area: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.languages?.map((language: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Specializations
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {user.tourInterests?.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tours Tab */}
          <TabsContent value="tours" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Tours</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 text-center py-8">
                  Your tour history and upcoming tours will appear here once you start accepting requests.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GuideDashboard;
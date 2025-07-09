
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Calendar, 
  Users, 
  DollarSign, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  RefreshCw,
  CheckCircle
} from "lucide-react";

interface AILocalGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const samplePlans = [
  {
    id: 1,
    title: "Cultural Heritage Tour",
    duration: "5 days",
    feasibilityScore: 95,
    highlights: ["Ancient temples", "Local markets", "Traditional cuisine", "Art galleries"],
    itinerary: [
      { day: 1, activities: ["Arrive and check-in", "Local orientation walk", "Welcome dinner"] },
      { day: 2, activities: ["Temple complex visit", "Traditional craft workshop", "Street food tour"] },
      { day: 3, activities: ["Art gallery tours", "Local market exploration", "Cooking class"] },
      { day: 4, activities: ["Historical site visit", "Cultural performance", "Rooftop dining"] },
      { day: 5, activities: ["Souvenir shopping", "Final exploration", "Departure"] }
    ],
    estimatedCost: "$1,200 - $1,500"
  },
  {
    id: 2,
    title: "Adventure Explorer Package",
    duration: "7 days",
    feasibilityScore: 88,
    highlights: ["Hiking trails", "Water sports", "Mountain views", "Local wildlife"],
    itinerary: [
      { day: 1, activities: ["Arrival and gear check", "Base camp setup", "Evening briefing"] },
      { day: 2, activities: ["Mountain hiking", "Scenic viewpoints", "Outdoor camping"] },
      { day: 3, activities: ["Water sports activities", "Beach exploration", "Sunset watching"] },
      { day: 4, activities: ["Wildlife sanctuary visit", "Nature photography", "Local guide stories"] },
      { day: 5, activities: ["Rock climbing", "Adventure sports", "Team building"] },
      { day: 6, activities: ["Cultural village visit", "Traditional games", "Farewell party"] },
      { day: 7, activities: ["Pack up", "Final activities", "Departure"] }
    ],
    estimatedCost: "$1,800 - $2,200"
  },
  {
    id: 3,
    title: "Relaxation & Wellness Retreat",
    duration: "4 days",
    feasibilityScore: 92,
    highlights: ["Spa treatments", "Yoga sessions", "Healthy cuisine", "Beach relaxation"],
    itinerary: [
      { day: 1, activities: ["Arrival and welcome drink", "Spa orientation", "Sunset yoga"] },
      { day: 2, activities: ["Morning meditation", "Full body massage", "Healthy cooking class"] },
      { day: 3, activities: ["Beach yoga", "Wellness treatments", "Detox activities"] },
      { day: 4, activities: ["Final relaxation", "Wellness consultation", "Peaceful departure"] }
    ],
    estimatedCost: "$900 - $1,100"
  }
];

const AILocalGuide = ({ isOpen, onClose }: AILocalGuideProps) => {
  const [step, setStep] = useState<'input' | 'plans'>('input');
  const [currentPlan, setCurrentPlan] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    destination: '',
    duration: '',
    travelers: '',
    budget: '',
    interests: ''
  });

  const handleGeneratePlans = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setStep('plans');
    }, 2000);
  };

  const handleNextPlan = () => {
    if (currentPlan < samplePlans.length - 1) {
      setCurrentPlan(currentPlan + 1);
    }
  };

  const handlePrevPlan = () => {
    if (currentPlan > 0) {
      setCurrentPlan(currentPlan - 1);
    }
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setCurrentPlan(0);
    }, 2000);
  };

  const handleSelectPlan = () => {
    alert(`Selected: ${samplePlans[currentPlan].title}`);
    onClose();
  };

  const currentPlanData = samplePlans[currentPlan];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>AI Local Guide</span>
          </DialogTitle>
        </DialogHeader>

        {step === 'input' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">Tell us about your dream trip</h3>
              <p className="text-gray-600">We'll create personalized itineraries just for you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="Where do you want to go?"
                    className="pl-10"
                    value={tripDetails.destination}
                    onChange={(e) => setTripDetails({...tripDetails, destination: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="duration"
                    placeholder="How many days?"
                    className="pl-10"
                    value={tripDetails.duration}
                    onChange={(e) => setTripDetails({...tripDetails, duration: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelers">Number of Travelers</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="travelers"
                    placeholder="How many people?"
                    className="pl-10"
                    value={tripDetails.travelers}
                    onChange={(e) => setTripDetails({...tripDetails, travelers: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="budget"
                    placeholder="Your budget range"
                    className="pl-10"
                    value={tripDetails.budget}
                    onChange={(e) => setTripDetails({...tripDetails, budget: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests">Interests & Preferences</Label>
              <Input
                id="interests"
                placeholder="Adventure, culture, relaxation, food, nightlife..."
                value={tripDetails.interests}
                onChange={(e) => setTripDetails({...tripDetails, interests: e.target.value})}
              />
            </div>

            <Button 
              onClick={handleGeneratePlans}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating Plans...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Plans
                </>
              )}
            </Button>
          </div>
        )}

        {step === 'plans' && !isGenerating && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Your Personalized Plans</h3>
              <Badge variant="secondary">
                Plan {currentPlan + 1} of {samplePlans.length}
              </Badge>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl">{currentPlanData.title}</CardTitle>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Feasibility Score</div>
                    <div className="flex items-center space-x-2">
                      <Progress value={currentPlanData.feasibilityScore} className="w-20" />
                      <span className="font-bold text-lg">{currentPlanData.feasibilityScore}/100</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>{currentPlanData.duration}</span>
                  <span>•</span>
                  <span>{currentPlanData.estimatedCost}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentPlanData.highlights.map((highlight, index) => (
                        <Badge key={index} variant="outline">
                          {highlight}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Smart Itinerary</h4>
                    <div className="space-y-3">
                      {currentPlanData.itinerary.map((dayPlan) => (
                        <div key={dayPlan.day} className="border rounded-lg p-4">
                          <h5 className="font-medium mb-2">Day {dayPlan.day}</h5>
                          <ul className="space-y-1">
                            {dayPlan.activities.map((activity, index) => (
                              <li key={index} className="flex items-center space-x-2 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>{activity}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={handlePrevPlan}
                  disabled={currentPlan === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous Plan
                </Button>
                
                {currentPlan < samplePlans.length - 1 ? (
                  <Button
                    variant="outline"
                    onClick={handleNextPlan}
                  >
                    Next Plan
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                )}
              </div>

              <Button 
                onClick={handleSelectPlan}
                className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Select This Plan
              </Button>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Generating Your Perfect Trip</h3>
            <p className="text-gray-600">Our AI is analyzing thousands of options...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AILocalGuide;

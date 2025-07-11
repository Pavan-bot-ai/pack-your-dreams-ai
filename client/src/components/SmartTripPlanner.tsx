
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  MapPin, 
  Calendar as CalendarIcon, 
  Users, 
  DollarSign, 
  Sparkles,
  ChevronRight
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SmartTripPlannerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
  defaultPlan?: any;
}

const interestOptions = [
  { id: 'adventure', label: 'Adventure Trip', icon: '🏔️' },
  { id: 'pilgrimage', label: 'Pilgrimage Trip', icon: '🕉️' },
  { id: 'relaxation', label: 'Relaxation Trip', icon: '🏖️' },
  { id: 'business', label: 'Business Trip', icon: '💼' }
];

const SmartTripPlanner = ({ isOpen, onClose, defaultDestination, defaultPlan }: SmartTripPlannerProps) => {
  const [destination, setDestination] = useState(defaultDestination || '');
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const isFormComplete = destination && startDate && endDate && travelers && budget && selectedInterest;

  const handleGenerateAIPlan = () => {
    if (!isFormComplete) return;
    
    const tripDetails = {
      destination,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      travelers: parseInt(travelers),
      budget,
      interest: selectedInterest,
      duration: startDate && endDate ? 
        `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days` : ''
    };
    
    console.log('Generating plan with details:', tripDetails);
    
    // Store trip details and navigate to plan generation
    localStorage.setItem('currentTripDetails', JSON.stringify(tripDetails));
    
    // Close modal and navigate
    onClose();
    
    // Navigate to plan generation page
    setTimeout(() => {
      window.location.href = '/plan-generation';
    }, 100);
  };

  const resetForm = () => {
    setDestination(defaultDestination || '');
    setStartDate(undefined);
    setEndDate(undefined);
    setTravelers('');
    setBudget('');
    setSelectedInterest('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span>Smart Trip Planner</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Plan your perfect trip</h3>
            <p className="text-gray-600">Fill in the details below to generate your AI-powered itinerary</p>
          </div>

          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">Destination *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="destination"
                placeholder="Where do you want to go?"
                className="pl-10"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Date Range *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Starting Date</Label>
                <Popover open={showStartCalendar} onOpenChange={setShowStartCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setShowStartCalendar(false);
                      }}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Ending Date</Label>
                <Popover open={showEndCalendar} onOpenChange={setShowEndCalendar}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date);
                        setShowEndCalendar(false);
                      }}
                      disabled={(date) => !startDate || date <= startDate}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Number of Travelers */}
          <div className="space-y-2">
            <Label htmlFor="travelers" className="text-sm font-medium">Number of Travelers *</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="travelers"
                type="number"
                min="1"
                placeholder="How many people?"
                className="pl-10"
                value={travelers}
                onChange={(e) => setTravelers(e.target.value)}
              />
            </div>
          </div>

          {/* Budget Range */}
          <div className="space-y-2">
            <Label htmlFor="budget" className="text-sm font-medium">Budget Range *</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="budget"
                placeholder="e.g., $1000 - $2000"
                className="pl-10"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          {/* Interests and Preferences */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Interests and Preferences *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestOptions.map((option) => (
                <Card 
                  key={option.id}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedInterest === option.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedInterest(option.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{option.icon}</span>
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {selectedInterest === option.id && (
                        <ChevronRight className="w-5 h-5 text-blue-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Form Validation Message */}
          {!isFormComplete && (
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700 font-medium mb-2">
                Please fill in all required details to generate your AI trip plan:
              </p>
              <ul className="text-xs text-amber-600 space-y-1">
                {!destination && <li>• Enter destination</li>}
                {!startDate && <li>• Select starting date</li>}
                {!endDate && <li>• Select ending date</li>}
                {!travelers && <li>• Enter number of travelers</li>}
                {!budget && <li>• Enter budget range</li>}
                {!selectedInterest && <li>• Choose trip type</li>}
              </ul>
            </div>
          )}

          {/* Generate AI Plan Button */}
          {isFormComplete && (
            <Button 
              onClick={handleGenerateAIPlan}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate AI Plan
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SmartTripPlanner;

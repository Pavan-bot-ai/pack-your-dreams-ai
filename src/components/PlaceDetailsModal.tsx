
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

interface PlaceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  onGeneratePlan: (details: any) => void;
}

const interestOptions = [
  { id: 'adventure', label: 'Adventure Trip', icon: '🏔️' },
  { id: 'pilgrimage', label: 'Pilgrimage Trip', icon: '🕉️' },
  { id: 'relaxation', label: 'Relaxation Trip', icon: '🏖️' },
  { id: 'business', label: 'Business Trip', icon: '💼' }
];

const PlaceDetailsModal = ({ isOpen, onClose, destination, onGeneratePlan }: PlaceDetailsModalProps) => {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [travelers, setTravelers] = useState('');
  const [budget, setBudget] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const isFormComplete = startDate && endDate && travelers && budget && selectedInterest;

  const handleGeneratePlan = () => {
    if (!isFormComplete) return;

    const planDetails = {
      destination,
      startDate,
      endDate,
      travelers: parseInt(travelers),
      budget,
      interest: selectedInterest,
      duration: `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days`
    };

    onGeneratePlan(planDetails);
    onClose();
  };

  const resetForm = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setTravelers('');
    setBudget('');
    setSelectedInterest('');
  };

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>Plan Your Trip</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Destination - Read Only */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Destination</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                value={destination}
                disabled
                className="pl-10 bg-gray-50 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Starting Date</Label>
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
              <Label className="text-sm font-medium">Ending Date</Label>
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

          {/* Number of Travelers */}
          <div className="space-y-2">
            <Label htmlFor="travelers" className="text-sm font-medium">Number of Travelers</Label>
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
            <Label htmlFor="budget" className="text-sm font-medium">Budget Range</Label>
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
            <Label className="text-sm font-medium">Interests and Preferences</Label>
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
              <p className="text-sm text-amber-700">
                Please fill in all details to generate your AI trip plan:
              </p>
              <ul className="mt-2 text-xs text-amber-600 space-y-1">
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
              onClick={handleGeneratePlan}
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

export default PlaceDetailsModal;

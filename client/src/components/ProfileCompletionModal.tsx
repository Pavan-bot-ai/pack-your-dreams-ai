import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileCompletionSchema, type ProfileCompletion } from "@shared/schema";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { User, MapPin, Heart, Plane, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const TRAVEL_STYLES = [
  "Adventure", "Relaxation", "Cultural", "Luxury", "Budget", 
  "Family-friendly", "Solo", "Romantic", "Business", "Eco-tourism"
];

const TRAVEL_FREQUENCIES = [
  "Rarely (Once a year or less)", 
  "Occasionally (2-3 times a year)", 
  "Frequently (4-6 times a year)", 
  "Very Frequently (More than 6 times a year)"
];

const DIETARY_PREFERENCES = [
  "No restrictions", "Vegetarian", "Vegan", "Gluten-free", 
  "Halal", "Kosher", "Dairy-free", "Nut allergies", "Other"
];

const POPULAR_DESTINATIONS = [
  "Paris, France", "Tokyo, Japan", "New York, USA", "London, UK", 
  "Rome, Italy", "Barcelona, Spain", "Amsterdam, Netherlands", 
  "Bangkok, Thailand", "Sydney, Australia", "Dubai, UAE",
  "Bali, Indonesia", "Santorini, Greece", "Iceland", "Morocco"
];

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export const ProfileCompletionModal = ({ isOpen, onClose, onComplete }: ProfileCompletionModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<ProfileCompletion>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      phone: "",
      dateOfBirth: "",
      countryOfResidence: "",
      preferredDestinations: [],
      travelStyle: "",
      travelFrequency: "",
      passportCountry: "",
      emergencyContact: "",
      dietaryPreferences: [],
    },
  });

  const onSubmit = async (data: ProfileCompletion) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/auth/complete-profile', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      // Mark that the prompt has been shown
      await apiRequest('/api/auth/mark-prompt-shown', {
        method: 'POST',
      });
      
      await refreshUser();
      
      toast({
        title: "Profile Completed!",
        description: "Thank you for completing your travel profile. We'll now provide better recommendations!",
      });
      
      onComplete();
    } catch (error) {
      console.error('Error completing profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaybeLater = async () => {
    try {
      await apiRequest('/api/auth/mark-prompt-shown', {
        method: 'POST',
      });
      await refreshUser();
      onClose();
    } catch (error) {
      console.error('Error marking prompt as shown:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-2 -right-2 h-8 w-8 p-0"
            onClick={handleMaybeLater}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Tell Us About Yourself!</DialogTitle>
              <DialogDescription className="text-base mt-1">
                Help us personalize your travel experience by completing your profile
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="countryOfResidence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country of Residence</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., United States" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Plane className="w-5 h-5 text-purple-500" />
                Travel Preferences
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="travelStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAVEL_STYLES.map((style) => (
                            <SelectItem key={style} value={style}>{style}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="travelFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Travel Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="How often do you travel?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TRAVEL_FREQUENCIES.map((frequency) => (
                            <SelectItem key={frequency} value={frequency}>{frequency}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Preferred Destinations */}
              <FormField
                control={form.control}
                name="preferredDestinations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Destinations You Love (Optional - Select any that interest you)
                    </FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto p-2 border rounded-md">
                      {POPULAR_DESTINATIONS.map((destination) => (
                        <div key={destination} className="flex items-center space-x-2">
                          <Checkbox
                            id={destination}
                            checked={field.value?.includes(destination)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              if (checked) {
                                field.onChange([...currentValues, destination]);
                              } else {
                                field.onChange(currentValues.filter(v => v !== destination));
                              }
                            }}
                          />
                          <label 
                            htmlFor={destination} 
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {destination}
                          </label>
                        </div>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleMaybeLater}
                disabled={isSubmitting}
              >
                Maybe Later
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-8"
              >
                {isSubmitting ? "Saving..." : "Complete Profile"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
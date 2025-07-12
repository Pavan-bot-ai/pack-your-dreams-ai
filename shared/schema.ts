import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").default("user"), // 'user' or 'guide'
  sessionToken: text("session_token"),
  sessionExpiry: timestamp("session_expiry"),
  language: text("language").default("en"),
  lastActiveAt: timestamp("last_active_at").defaultNow(),
  isRegistrationComplete: boolean("is_registration_complete").default(true),
  
  // Guide-specific fields
  bio: text("bio"),
  phone: text("phone"),
  experience: text("experience"),
  certification: text("certification"),
  hourlyRate: decimal("hourly_rate", { precision: 10, scale: 2 }),
  serviceAreas: text("service_areas").array(),
  languages: text("languages").array(),
  tourInterests: text("tour_interests").array(),
  profileImageUrl: text("profile_image_url"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  totalReviews: integer("total_reviews").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  completedTours: integer("completed_tours").default(0),
  profileCompleted: boolean("profile_completed").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  transactionId: text("transaction_id").unique().notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(),
  paymentStatus: text("payment_status").notNull(), // success, pending, failed
  bookingType: text("booking_type").notNull(), // transport, hotel, etc.
  bookingDetails: text("booking_details").notNull(), // JSON string
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedPlaces = pgTable("saved_places", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  placeId: text("place_id").notNull(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  thumbnail: text("thumbnail").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hotelBookings = pgTable("hotel_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  hotelId: text("hotel_id").notNull(),
  hotelName: text("hotel_name").notNull(),
  destination: text("destination").notNull(),
  groupMembers: integer("group_members").notNull(),
  numberOfRooms: integer("number_of_rooms").notNull(),
  roomType: text("room_type").notNull(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  totalAmount: integer("total_amount").notNull(), // in cents
  budgetLimit: integer("budget_limit"), // in cents
  bookingStatus: text("booking_status").notNull().default("pending"), // pending, confirmed, cancelled
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, completed, failed
  transactionId: text("transaction_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookedPlans = pgTable("booked_plans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  planTitle: text("plan_title").notNull(),
  destination: text("destination").notNull(),
  planDetails: text("plan_details").notNull(), // JSON string of the plan
  transportDetails: text("transport_details").notNull(), // JSON string of transport booking
  hotelDetails: text("hotel_details").notNull(), // JSON string of hotel booking
  itineraryDetails: text("itinerary_details").notNull(), // JSON string of itinerary
  totalAmount: integer("total_amount").notNull(), // in cents
  transportAmount: integer("transport_amount").notNull(), // in cents
  hotelAmount: integer("hotel_amount").notNull(), // in cents
  itineraryAmount: integer("itinerary_amount").notNull(), // in cents
  paymentMethod: text("payment_method").notNull(),
  bookingStatus: text("booking_status").notNull().default("confirmed"),
  travelDate: text("travel_date").notNull(),
  duration: text("duration").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Guide-specific tables
export const tourRequests = pgTable("tour_requests", {
  id: serial("id").primaryKey(),
  guideId: integer("guide_id").notNull(),
  travelerName: text("traveler_name").notNull(),
  travelerEmail: text("traveler_email"),
  destination: text("destination").notNull(),
  date: text("date").notNull(),
  duration: text("duration").notNull(),
  travelers: integer("travelers").notNull(),
  budget: text("budget").notNull(),
  message: text("message"),
  status: text("status").default("pending"), // pending, accepted, declined, completed
  timeAgo: text("time_ago"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const guideTours = pgTable("guide_tours", {
  id: serial("id").primaryKey(),
  guideId: integer("guide_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  destination: text("destination").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: text("duration").notNull(),
  difficulty: text("difficulty").default("Easy"),
  highlights: text("highlights").array(),
  maxParticipants: integer("max_participants").default(10),
  status: text("status").default("active"), // active, paused, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tourIdeas = pgTable("tour_ideas", {
  id: serial("id").primaryKey(),
  guideId: integer("guide_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  duration: text("duration"),
  highlights: text("highlights").array(),
  suggestedPrice: text("suggested_price"),
  difficulty: text("difficulty").default("Easy to Moderate"),
  prompt: text("prompt"), // Original AI prompt used
  createdAt: timestamp("created_at").defaultNow(),
});

export const guideTransactions = pgTable("guide_transactions", {
  id: serial("id").primaryKey(),
  guideId: integer("guide_id").notNull(),
  tourRequestId: integer("tour_request_id"),
  client: text("client").notNull(),
  service: text("service").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, completed, failed
  paymentMethod: text("payment_method"),
  date: text("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  name: true,
  role: true,
}).extend({
  role: z.enum(["user", "guide"]).default("user"),
});

export const updateUserGuideSchema = createInsertSchema(users).pick({
  bio: true,
  phone: true,
  experience: true,
  certification: true,
  hourlyRate: true,
  serviceAreas: true,
  languages: true,
  tourInterests: true,
  profileImageUrl: true,
  profileCompleted: true,
  isRegistrationComplete: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  transactionId: true,
  amount: true,
  paymentMethod: true,
  paymentStatus: true,
  bookingType: true,
  bookingDetails: true,
}).extend({
  userId: z.number().optional(),
});

export const insertSavedPlaceSchema = createInsertSchema(savedPlaces).pick({
  userId: true,
  placeId: true,
  title: true,
  location: true,
  thumbnail: true,
});

export const insertHotelBookingSchema = createInsertSchema(hotelBookings).pick({
  userId: true,
  hotelId: true,
  hotelName: true,
  destination: true,
  groupMembers: true,
  numberOfRooms: true,
  roomType: true,
  checkInDate: true,
  checkOutDate: true,
  totalAmount: true,
  budgetLimit: true,
  transactionId: true,
});

export const insertBookedPlanSchema = createInsertSchema(bookedPlans).pick({
  userId: true,
  planTitle: true,
  destination: true,
  planDetails: true,
  transportDetails: true,
  hotelDetails: true,
  itineraryDetails: true,
  totalAmount: true,
  transportAmount: true,
  hotelAmount: true,
  itineraryAmount: true,
  paymentMethod: true,
  travelDate: true,
  duration: true,
});

export const insertTourRequestSchema = createInsertSchema(tourRequests).pick({
  guideId: true,
  travelerName: true,
  travelerEmail: true,
  destination: true,
  date: true,
  duration: true,
  travelers: true,
  budget: true,
  message: true,
  timeAgo: true,
});

export const insertGuideTourSchema = createInsertSchema(guideTours).pick({
  guideId: true,
  title: true,
  description: true,
  destination: true,
  price: true,
  duration: true,
  difficulty: true,
  highlights: true,
  maxParticipants: true,
});

export const insertTourIdeaSchema = createInsertSchema(tourIdeas).pick({
  guideId: true,
  title: true,
  description: true,
  duration: true,
  highlights: true,
  suggestedPrice: true,
  difficulty: true,
  prompt: true,
});

export const insertGuideTransactionSchema = createInsertSchema(guideTransactions).pick({
  guideId: true,
  tourRequestId: true,
  client: true,
  service: true,
  amount: true,
  paymentMethod: true,
  date: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUserGuide = z.infer<typeof updateUserGuideSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertSavedPlace = z.infer<typeof insertSavedPlaceSchema>;
export type SavedPlace = typeof savedPlaces.$inferSelect;
export type InsertHotelBooking = z.infer<typeof insertHotelBookingSchema>;
export type HotelBooking = typeof hotelBookings.$inferSelect;
export type InsertBookedPlan = z.infer<typeof insertBookedPlanSchema>;
export type BookedPlan = typeof bookedPlans.$inferSelect;
export type InsertTourRequest = z.infer<typeof insertTourRequestSchema>;
export type TourRequest = typeof tourRequests.$inferSelect;
export type InsertGuideTour = z.infer<typeof insertGuideTourSchema>;
export type GuideTour = typeof guideTours.$inferSelect;
export type InsertTourIdea = z.infer<typeof insertTourIdeaSchema>;
export type TourIdea = typeof tourIdeas.$inferSelect;
export type InsertGuideTransaction = z.infer<typeof insertGuideTransactionSchema>;
export type GuideTransaction = typeof guideTransactions.$inferSelect;

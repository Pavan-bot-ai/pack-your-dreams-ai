import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type InsertSavedPlace = z.infer<typeof insertSavedPlaceSchema>;
export type SavedPlace = typeof savedPlaces.$inferSelect;
export type InsertHotelBooking = z.infer<typeof insertHotelBookingSchema>;
export type HotelBooking = typeof hotelBookings.$inferSelect;

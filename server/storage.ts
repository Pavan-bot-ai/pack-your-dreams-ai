import { users, transactions, savedPlaces, hotelBookings, bookedPlans, type User, type InsertUser, type Transaction, type InsertTransaction, type SavedPlace, type InsertSavedPlace, type HotelBooking, type InsertHotelBooking, type BookedPlan, type InsertBookedPlan } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserBySessionToken(token: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserSession(id: number, sessionToken: string, expiryDate: Date): Promise<User | undefined>;
  updateUserLanguage(id: number, language: string): Promise<User | undefined>;
  updateUserActivity(id: number): Promise<void>;
  clearUserSession(id: number): Promise<void>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  getTransactionById(id: number): Promise<Transaction | undefined>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  getSavedPlacesByUser(userId: number): Promise<SavedPlace[]>;
  createSavedPlace(savedPlace: InsertSavedPlace): Promise<SavedPlace>;
  removeSavedPlace(userId: number, placeId: string): Promise<void>;
  isPlaceSaved(userId: number, placeId: string): Promise<boolean>;
  createHotelBooking(booking: InsertHotelBooking): Promise<HotelBooking>;
  getHotelBookingsByUser(userId: number): Promise<HotelBooking[]>;
  updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined>;
  createBookedPlan(plan: InsertBookedPlan): Promise<BookedPlan>;
  getBookedPlansByUser(userId: number): Promise<BookedPlan[]>;
  getBookedPlanById(id: number): Promise<BookedPlan | undefined>;
  updateBookedPlanStatus(id: number, status: string): Promise<BookedPlan | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getUserBySessionToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.sessionToken, token));
    if (user && user.sessionExpiry && new Date() > user.sessionExpiry) {
      // Session expired, clear it
      await this.clearUserSession(user.id);
      return undefined;
    }
    return user || undefined;
  }

  async updateUserSession(id: number, sessionToken: string, expiryDate: Date): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        sessionToken, 
        sessionExpiry: expiryDate,
        lastActiveAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserLanguage(id: number, language: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ language })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async updateUserActivity(id: number): Promise<void> {
    await db
      .update(users)
      .set({ lastActiveAt: new Date() })
      .where(eq(users.id, id));
  }

  async clearUserSession(id: number): Promise<void> {
    await db
      .update(users)
      .set({ 
        sessionToken: null, 
        sessionExpiry: null 
      })
      .where(eq(users.id, id));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set({ paymentStatus: status })
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  async getSavedPlacesByUser(userId: number): Promise<SavedPlace[]> {
    return await db.select().from(savedPlaces).where(eq(savedPlaces.userId, userId));
  }

  async createSavedPlace(insertSavedPlace: InsertSavedPlace): Promise<SavedPlace> {
    const [savedPlace] = await db
      .insert(savedPlaces)
      .values(insertSavedPlace)
      .returning();
    return savedPlace;
  }

  async removeSavedPlace(userId: number, placeId: string): Promise<void> {
    await db
      .delete(savedPlaces)
      .where(and(eq(savedPlaces.userId, userId), eq(savedPlaces.placeId, placeId)));
  }

  async isPlaceSaved(userId: number, placeId: string): Promise<boolean> {
    const [place] = await db
      .select()
      .from(savedPlaces)
      .where(and(eq(savedPlaces.userId, userId), eq(savedPlaces.placeId, placeId)));
    return !!place;
  }

  async createHotelBooking(insertBooking: InsertHotelBooking): Promise<HotelBooking> {
    const [booking] = await db
      .insert(hotelBookings)
      .values(insertBooking)
      .returning();
    return booking;
  }

  async getHotelBookingsByUser(userId: number): Promise<HotelBooking[]> {
    return await db.select().from(hotelBookings).where(eq(hotelBookings.userId, userId));
  }

  async updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined> {
    const [booking] = await db
      .update(hotelBookings)
      .set({ bookingStatus: status })
      .where(eq(hotelBookings.id, id))
      .returning();
    return booking || undefined;
  }

  async createBookedPlan(insertPlan: InsertBookedPlan): Promise<BookedPlan> {
    const [plan] = await db
      .insert(bookedPlans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async getBookedPlansByUser(userId: number): Promise<BookedPlan[]> {
    return await db
      .select()
      .from(bookedPlans)
      .where(eq(bookedPlans.userId, userId))
      .orderBy(bookedPlans.createdAt);
  }

  async getBookedPlanById(id: number): Promise<BookedPlan | undefined> {
    const [plan] = await db
      .select()
      .from(bookedPlans)
      .where(eq(bookedPlans.id, id));
    return plan;
  }

  async updateBookedPlanStatus(id: number, status: string): Promise<BookedPlan | undefined> {
    const [plan] = await db
      .update(bookedPlans)
      .set({ bookingStatus: status, updatedAt: new Date() })
      .where(eq(bookedPlans.id, id))
      .returning();
    return plan;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private transactions: Map<number, Transaction>;
  private savedPlaces: Map<number, SavedPlace>;
  private hotelBookings: Map<number, HotelBooking>;
  private bookedPlans: Map<number, BookedPlan>;
  currentId: number;
  currentTransactionId: number;
  currentSavedPlaceId: number;
  currentHotelBookingId: number;
  currentBookedPlanId: number;

  constructor() {
    this.users = new Map();
    this.transactions = new Map();
    this.savedPlaces = new Map();
    this.hotelBookings = new Map();
    this.bookedPlans = new Map();
    this.currentId = 1;
    this.currentTransactionId = 1;
    this.currentSavedPlaceId = 1;
    this.currentHotelBookingId = 1;
    this.currentBookedPlanId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id,
      sessionToken: null,
      sessionExpiry: null,
      language: "en",
      lastActiveAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getUserBySessionToken(token: string): Promise<User | undefined> {
    const userEntries = Array.from(this.users.values());
    for (const user of userEntries) {
      if (user.sessionToken === token) {
        if (user.sessionExpiry && new Date() > user.sessionExpiry) {
          // Session expired, clear it
          await this.clearUserSession(user.id);
          return undefined;
        }
        return user;
      }
    }
    return undefined;
  }

  async updateUserSession(id: number, sessionToken: string, expiryDate: Date): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { 
        ...user, 
        sessionToken, 
        sessionExpiry: expiryDate,
        lastActiveAt: new Date()
      };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async updateUserLanguage(id: number, language: string): Promise<User | undefined> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, language };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  async updateUserActivity(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { ...user, lastActiveAt: new Date() };
      this.users.set(id, updatedUser);
    }
  }

  async clearUserSession(id: number): Promise<void> {
    const user = this.users.get(id);
    if (user) {
      const updatedUser = { 
        ...user, 
        sessionToken: null, 
        sessionExpiry: null 
      };
      this.users.set(id, updatedUser);
    }
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const now = new Date();
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      userId: insertTransaction.userId || null,
      createdAt: now 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (transaction) => transaction.userId === userId,
    );
  }

  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (transaction) {
      transaction.paymentStatus = status;
      this.transactions.set(id, transaction);
      return transaction;
    }
    return undefined;
  }

  async getSavedPlacesByUser(userId: number): Promise<SavedPlace[]> {
    return Array.from(this.savedPlaces.values()).filter(
      (place) => place.userId === userId,
    );
  }

  async createSavedPlace(insertSavedPlace: InsertSavedPlace): Promise<SavedPlace> {
    const id = this.currentSavedPlaceId++;
    const now = new Date();
    const savedPlace: SavedPlace = { 
      ...insertSavedPlace, 
      id,
      createdAt: now 
    };
    this.savedPlaces.set(id, savedPlace);
    return savedPlace;
  }

  async removeSavedPlace(userId: number, placeId: string): Promise<void> {
    const entries = Array.from(this.savedPlaces.entries());
    for (const [key, place] of entries) {
      if (place.userId === userId && place.placeId === placeId) {
        this.savedPlaces.delete(key);
        break;
      }
    }
  }

  async isPlaceSaved(userId: number, placeId: string): Promise<boolean> {
    return Array.from(this.savedPlaces.values()).some(
      (place) => place.userId === userId && place.placeId === placeId,
    );
  }

  async createHotelBooking(insertBooking: InsertHotelBooking): Promise<HotelBooking> {
    const id = this.currentId++;
    const booking: HotelBooking = { 
      ...insertBooking,
      budgetLimit: insertBooking.budgetLimit || null,
      id,
      bookingStatus: "pending",
      paymentStatus: "pending",
      transactionId: null,
      createdAt: new Date()
    };
    return booking;
  }

  async getHotelBookingsByUser(userId: number): Promise<HotelBooking[]> {
    return [];
  }

  async updateHotelBookingStatus(id: number, status: string): Promise<HotelBooking | undefined> {
    return undefined;
  }

  async createBookedPlan(insertPlan: InsertBookedPlan): Promise<BookedPlan> {
    const id = this.currentBookedPlanId++;
    const plan: BookedPlan = { 
      ...insertPlan, 
      id,
      bookingStatus: 'confirmed',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.bookedPlans.set(id, plan);
    return plan;
  }

  async getBookedPlansByUser(userId: number): Promise<BookedPlan[]> {
    return Array.from(this.bookedPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async getBookedPlanById(id: number): Promise<BookedPlan | undefined> {
    return this.bookedPlans.get(id);
  }

  async updateBookedPlanStatus(id: number, status: string): Promise<BookedPlan | undefined> {
    const plan = this.bookedPlans.get(id);
    if (plan) {
      plan.bookingStatus = status;
      plan.updatedAt = new Date();
      this.bookedPlans.set(id, plan);
      return plan;
    }
    return undefined;
  }
}

export const storage = new DatabaseStorage();

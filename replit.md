# Pack Your Bags - AI Travel Companion

## Overview

Pack Your Bags is a full-stack web application designed as an AI-powered travel planning and booking platform. The application provides users with intelligent trip planning, local guide services, translation capabilities, and booking assistance through a modern, responsive interface.

**Recent Migration**: Successfully migrated from Lovable to Replit environment (January 11, 2025), including routing updates from react-router-dom to wouter and implementation of comprehensive navigation system with dedicated pages for all main features.

**Authentication System Implementation**: Successfully implemented complete authentication system (January 11, 2025) with secure session management, password hashing with bcrypt, token-based authentication lasting 30 days, registration/login API endpoints, React context integration, and database storage of user credentials and sessions. Fixed all authentication flow issues including modal handling and form state management.

**Transportation Booking System**: Implemented comprehensive transportation booking mechanism with PostgreSQL database integration (January 11, 2025), including detailed transport selection, payment processing, and transaction tracking.

**Video Hover Functionality & Saved Places**: Added interactive video playback on hover for travel destination videos with Pexels video integration (January 11, 2025). Implemented saved places feature with heart button functionality, allowing users to save favorite destinations to their profile with full database persistence.

**Hotel Booking System**: Implemented comprehensive hotel booking flow integrated with transportation booking (January 11, 2025), including hotel selection with room types, budget validation warnings, check-in/out date selection, payment processing with multiple payment methods, and transaction status tracking. Added hotelBookings table to PostgreSQL schema with complete CRUD operations.

**Payment System & Budget Allocation**: Implemented guaranteed successful payments across all payment components (January 11, 2025), ensuring 100% payment success rate in TransportPayment, PaymentPage, and HotelPayment components. Added intelligent budget-based hotel cost allocation system that automatically adjusts spending percentages based on user budget ranges - luxury travel (55% hotel, 30% transport, 15% activities), premium travel (50% hotel, 32% transport, 18% activities), mid-range travel (45% hotel, 35% transport, 20% activities), and budget travel (40% hotel, 40% transport, 20% activities). Enhanced FinalPlanPage to display budget breakdown with percentage allocations and smart allocation information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with a React frontend and Express.js backend, utilizing TypeScript throughout. The architecture is designed for scalability with a clear separation between client and server components.

### Directory Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Common schemas and types shared between frontend and backend
- `migrations/` - Database migration files

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom travel-themed design system
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for lightweight client-side navigation (migrated from react-router-dom)
- **Forms**: React Hook Form with Zod validation
- **Navigation**: Side drawer menu system with dedicated pages for user features

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: Express sessions with PostgreSQL store
- **Development**: Hot reload with Vite middleware integration

### UI Component System
- Comprehensive component library based on Radix UI
- Custom travel-themed design with gradient color schemes
- Responsive design with mobile-first approach
- Glass morphism effects and modern visual styling

## Data Flow

### Database Schema
The application uses PostgreSQL with the following tables:
- Users table with username and password fields for authentication
- Transactions table for storing booking payments and transaction history
- SavedPlaces table for user's favorite destinations with heart functionality
- HotelBookings table for hotel reservations with budget limits and payment tracking
- Extensible schema structure for future travel-related entities

### Storage Layer
- **Production**: PostgreSQL database with Drizzle ORM
- **Development**: In-memory storage implementation for rapid prototyping
- **Interface**: Abstract storage interface enabling easy switching between implementations
- **Transaction Management**: Complete CRUD operations for booking transactions and payment history

### Authentication Flow
- Modal-based authentication system
- Session-based user management
- Protected routes requiring authentication for core features

### Feature Integration
1. **Smart Trip Planner**: AI-powered itinerary generation with customizable preferences
2. **Local Guide Services**: Personalized recommendations and local insights
3. **Real-time Translation**: Multi-language support with voice and text input
4. **Comprehensive Transportation Booking**: Full 5-step booking flow with:
   - Transport mode selection (Flight, Train, Bus, Car Rental)
   - Detailed booking options with ratings, comfort levels, and amenities
   - Multi-payment method processing (Credit/Debit Card, Digital Wallet, Bank Transfer, UPI)
   - Real-time payment status tracking with database integration
   - Transaction history with filtering and search capabilities
5. **Complete Hotel Booking System**: Integrated hotel booking following transportation:
   - Hotel selection with multiple properties and room types
   - Budget validation with real-time warnings when limits exceeded
   - Room type selection with pricing and amenities
   - Check-in/check-out date selection with validation
   - Multi-step payment flow with payment method selection
   - Payment status tracking (successful/pending/unsuccessful)
   - Database integration with hotelBookings table for booking persistence
6. **User Account System**: Complete navigation system with dedicated pages for:
   - Booked Plans (trip management and cancellation)
   - Transactions (payment history and details with database integration)
   - Saved Places (favorite destinations)
   - Trip History (completed travel records)
   - Profile (user information and travel preferences)
   - Settings (theme toggle and language selection)

## External Dependencies

### Core Dependencies
- **UI Components**: @radix-ui/* for accessible component primitives
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Validation**: Zod for schema validation and type safety
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography

### Development Tools
- **TypeScript**: Strict type checking across the entire codebase
- **Vite**: Fast build tool with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Specialized plugins for Replit development environment

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild compiles TypeScript server code to `dist/`
- **Database**: Drizzle Kit handles schema migrations and database pushes

### Environment Configuration
- **Development**: NODE_ENV=development with Vite dev server
- **Production**: NODE_ENV=production with static file serving
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Production Architecture
- Express server serves both API routes and static frontend assets
- Database migrations managed through Drizzle Kit
- Error handling with custom error middleware
- Request logging for API endpoints

### Scalability Considerations
- Modular component architecture allows for easy feature additions
- Abstract storage interface enables database switching
- TypeScript ensures type safety across client-server boundaries
- React Query provides efficient caching and synchronization
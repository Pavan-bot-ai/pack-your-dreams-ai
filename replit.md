# Pack Your Bags - AI Travel Companion

## Overview

Pack Your Bags is a full-stack web application designed as an AI-powered travel planning and booking platform. The application provides users with intelligent trip planning, local guide services, translation capabilities, and booking assistance through a modern, responsive interface.

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
- **Routing**: React Router for client-side navigation
- **Forms**: React Hook Form with Zod validation

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
The application uses a simple user authentication schema with:
- Users table with username and password fields
- Extensible schema structure for future travel-related entities

### Storage Layer
- **Production**: PostgreSQL database with Drizzle ORM
- **Development**: In-memory storage implementation for rapid prototyping
- **Interface**: Abstract storage interface enabling easy switching between implementations

### Authentication Flow
- Modal-based authentication system
- Session-based user management
- Protected routes requiring authentication for core features

### Feature Integration
1. **Smart Trip Planner**: AI-powered itinerary generation with customizable preferences
2. **Local Guide Services**: Personalized recommendations and local insights
3. **Real-time Translation**: Multi-language support with voice and text input
4. **Booking Management**: Integrated booking system for transportation and accommodations

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
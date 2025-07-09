# Crop NFT Product Search Application

## Overview

This is a modern web application that allows users to search for products based on crop names or NFT IDs. The application uses a full-stack architecture with React frontend and Express backend, designed to match crops with corresponding products in an e-commerce context.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: Hot reloading with Vite integration

## Key Components

### Database Schema
The application uses two main entities:
- **Crops**: Stores crop information including name, NFT ID, and variety
- **Products**: Stores product details including title, price, image, buy link, and associated crop name

### API Endpoints
- `POST /api/crops/search`: Search for products by crop name or NFT ID format (e.g., "Tomato #124")

### Core Features
- Crop-to-product matching system
- Support for both crop names and NFT ID formats
- Product information display with images and purchase links
- Responsive design for mobile and desktop

## Data Flow

1. User enters crop name or NFT ID in search form
2. Frontend validates input using Zod schema
3. Request sent to backend API endpoint
4. Backend parses input to extract crop name and NFT ID
5. Database query executed to find matching product
6. Product information returned to frontend
7. Results displayed in user interface

## External Dependencies

### Frontend Dependencies
- React ecosystem (React, React DOM, React Query)
- UI components (Radix UI primitives, shadcn/ui)
- Form handling (React Hook Form, Hookform Resolvers)
- Styling (Tailwind CSS, class-variance-authority)
- Date utilities (date-fns)

### Backend Dependencies
- Express.js server framework


### Development Dependencies
- Vite build tool with React plugin
- TypeScript compiler
- ESBuild for production builds
- Replit development tools

## Deployment Strategy

### Development Environment
- Uses Vite dev server for frontend hot reloading
- Express server runs with tsx for TypeScript execution
- Development script: `npm run dev`

### Production Build
- Frontend built with Vite to static assets
- Backend compiled with ESBuild to single bundle
- Build script: `npm run build`
- Start script: `npm start`



## Changelog

- July 08, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.

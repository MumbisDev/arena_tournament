# Tournament Platform

A modern, responsive tournament management platform built with React, TypeScript, and Tailwind CSS.

## Features

### Pages
- **Discover Page** - Browse public tournaments with filtering by game, platform, region, and status
- **Authentication** - Login, Register, and Password Reset pages
- **Dashboard** - Overview of user's tournaments, upcoming matches, and quick actions
- **Create Tournament** - Multi-step form for creating tournaments
- **Tournament Details** - View tournament info, bracket, participants, and rules
- **Bracket/Matches** - Visual bracket display with match status
- **Profile** - User information, tournament history, and settings
- **Admin/Organizer Management** - Manage participants, update match results, edit tournament settings

### User Roles
- **Guest** - View public tournaments and details
- **Player** - Join/leave tournaments, view dashboard and profile
- **Organizer** - Create and manage tournaments, update match results
- **Admin** - Full access to all features

### Technical Features
- React 18 with TypeScript
- Tailwind CSS for styling (following the provided design system)
- React Router for navigation
- Zustand for state management
- Mock API with realistic data structures
- Component-based architecture with reusable UI components

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Demo Accounts

For testing, use these demo accounts (any password works):

| Role | Email |
|------|-------|
| Organizer | progamer@example.com |
| Player | nighthawk@example.com |

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Layout, Breadcrumbs
│   ├── tournament/      # Tournament-specific components
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
├── pages/               # Page components
│   └── auth/            # Authentication pages
├── store/               # Zustand stores and mock data
├── types/               # TypeScript type definitions
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
└── index.css            # Global styles and Tailwind
```

## Design System

The application follows a minimal modern design with:
- High contrast black/white color scheme
- Uppercase typography with letter spacing
- Clean, borderless components
- Subtle hover animations
- No border-radius (sharp corners throughout)

See `design.json` for complete design specifications.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## License

MIT


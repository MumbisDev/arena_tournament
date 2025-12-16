export type UserRole = 'guest' | 'player' | 'organizer' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  createdAt: string;
  bio?: string;
  stats: {
    tournamentsJoined: number;
    tournamentsCreated: number;
    wins: number;
    losses: number;
  };
}

export type TournamentStatus = 'upcoming' | 'live' | 'completed' | 'cancelled';
export type TournamentFormat = 'single-elimination' | 'double-elimination' | 'round-robin';
export type GamePlatform = 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'cross-platform';
export type Region = 'north-america' | 'europe' | 'asia' | 'oceania' | 'south-america' | 'global';

export interface Tournament {
  id: string;
  name: string;
  game: string;
  description: string;
  organizerId: string;
  organizerName: string;
  status: TournamentStatus;
  format: TournamentFormat;
  platform: GamePlatform;
  region: Region;
  maxParticipants: number;
  currentParticipants: number;
  prizePool?: string;
  rules: string;
  startDate: string;
  endDate?: string;
  registrationDeadline: string;
  createdAt: string;
  image?: string;
  participants: string[];
}

export type MatchStatus = 'pending' | 'live' | 'completed';

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  matchNumber: number;
  participant1: {
    id: string;
    name: string;
    score?: number;
  } | null;
  participant2: {
    id: string;
    name: string;
    score?: number;
  } | null;
  winnerId?: string;
  status: MatchStatus;
  scheduledAt?: string;
  completedAt?: string;
}

export interface Bracket {
  tournamentId: string;
  rounds: Match[][];
}

export interface FilterState {
  game: string;
  platform: GamePlatform | 'all';
  region: Region | 'all';
  status: TournamentStatus | 'all';
  search: string;
}

export interface CreateTournamentData {
  name: string;
  game: string;
  description: string;
  format: TournamentFormat;
  platform: GamePlatform;
  region: Region;
  maxParticipants: number;
  prizePool?: string;
  rules: string;
  startDate: string;
  registrationDeadline: string;
}


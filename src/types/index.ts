// User types - simplified, no roles
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  created_at: string;
  updated_at: string;
  bio?: string | null;
  // Stats from user_stats table
  tournaments_joined: number;
  tournaments_created: number;
  wins: number;
  losses: number;
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
  organizer_id: string;
  organizer_name: string;
  organizer_avatar?: string | null;
  status: TournamentStatus;
  format: TournamentFormat;
  platform: GamePlatform;
  region: Region;
  max_participants: number;
  current_participants: number;
  prize_pool?: string | null;
  rules: string;
  start_date: string;
  end_date?: string | null;
  registration_deadline: string;
  created_at: string;
  updated_at: string;
  image?: string | null;
}

export type MatchStatus = 'pending' | 'live' | 'completed';

export interface Match {
  id: string;
  tournament_id: string;
  round: number;
  match_number: number;
  participant1_id: string | null;
  participant1_score: number;
  participant2_id: string | null;
  participant2_score: number;
  winner_id: string | null;
  status: MatchStatus;
  scheduled_at: string | null;
  completed_at: string | null;
  // Joined data
  participant1?: { id: string; username: string; avatar?: string } | null;
  participant2?: { id: string; username: string; avatar?: string } | null;
  winner?: { id: string; username: string } | null;
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
  max_participants: number;
  prize_pool?: string;
  rules: string;
  start_date: string;
  registration_deadline: string;
  image?: string;
}

import { create } from 'zustand';
import type { Tournament, Match, FilterState, CreateTournamentData } from '../types';
import { mockTournaments, mockMatches } from './mockData';

interface TournamentState {
  tournaments: Tournament[];
  matches: Match[];
  filters: FilterState;
  
  // Actions
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  getFilteredTournaments: () => Tournament[];
  getTournamentById: (id: string) => Tournament | undefined;
  getMatchesByTournament: (tournamentId: string) => Match[];
  getUserTournaments: (userId: string) => { created: Tournament[]; joined: Tournament[] };
  
  // Tournament actions
  createTournament: (data: CreateTournamentData, organizerId: string, organizerName: string) => Tournament;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  joinTournament: (tournamentId: string, userId: string) => { success: boolean; error?: string };
  leaveTournament: (tournamentId: string, userId: string) => void;
  
  // Match actions
  updateMatchResult: (matchId: string, score1: number, score2: number, winnerId: string) => void;
}

const defaultFilters: FilterState = {
  game: '',
  platform: 'all',
  region: 'all',
  status: 'all',
  search: '',
};

export const useTournamentStore = create<TournamentState>((set, get) => ({
  tournaments: [...mockTournaments],
  matches: [...mockMatches],
  filters: defaultFilters,

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  getFilteredTournaments: () => {
    const { tournaments, filters } = get();
    
    return tournaments.filter((tournament) => {
      if (filters.search && !tournament.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !tournament.game.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.game && tournament.game !== filters.game) {
        return false;
      }
      if (filters.platform !== 'all' && tournament.platform !== filters.platform) {
        return false;
      }
      if (filters.region !== 'all' && tournament.region !== filters.region) {
        return false;
      }
      if (filters.status !== 'all' && tournament.status !== filters.status) {
        return false;
      }
      return true;
    });
  },

  getTournamentById: (id) => {
    return get().tournaments.find((t) => t.id === id);
  },

  getMatchesByTournament: (tournamentId) => {
    return get().matches.filter((m) => m.tournamentId === tournamentId);
  },

  getUserTournaments: (userId) => {
    const { tournaments } = get();
    return {
      created: tournaments.filter((t) => t.organizerId === userId),
      joined: tournaments.filter((t) => t.participants.includes(userId)),
    };
  },

  createTournament: (data, organizerId, organizerName) => {
    const newTournament: Tournament = {
      id: `tournament-${Date.now()}`,
      ...data,
      organizerId,
      organizerName,
      status: 'upcoming',
      currentParticipants: 0,
      createdAt: new Date().toISOString(),
      participants: [],
    };

    set((state) => ({
      tournaments: [newTournament, ...state.tournaments],
    }));

    return newTournament;
  },

  updateTournament: (id, updates) => {
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  },

  deleteTournament: (id) => {
    set((state) => ({
      tournaments: state.tournaments.filter((t) => t.id !== id),
      matches: state.matches.filter((m) => m.tournamentId !== id),
    }));
  },

  joinTournament: (tournamentId, userId) => {
    const tournament = get().getTournamentById(tournamentId);
    
    if (!tournament) {
      return { success: false, error: 'Tournament not found' };
    }
    
    if (tournament.participants.includes(userId)) {
      return { success: false, error: 'Already registered' };
    }
    
    if (tournament.currentParticipants >= tournament.maxParticipants) {
      return { success: false, error: 'Tournament is full' };
    }
    
    if (tournament.status !== 'upcoming') {
      return { success: false, error: 'Registration is closed' };
    }

    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === tournamentId
          ? {
              ...t,
              participants: [...t.participants, userId],
              currentParticipants: t.currentParticipants + 1,
            }
          : t
      ),
    }));

    return { success: true };
  },

  leaveTournament: (tournamentId, userId) => {
    set((state) => ({
      tournaments: state.tournaments.map((t) =>
        t.id === tournamentId
          ? {
              ...t,
              participants: t.participants.filter((p) => p !== userId),
              currentParticipants: Math.max(0, t.currentParticipants - 1),
            }
          : t
      ),
    }));
  },

  updateMatchResult: (matchId, score1, score2, winnerId) => {
    set((state) => ({
      matches: state.matches.map((m) =>
        m.id === matchId
          ? {
              ...m,
              participant1: m.participant1 ? { ...m.participant1, score: score1 } : null,
              participant2: m.participant2 ? { ...m.participant2, score: score2 } : null,
              winnerId,
              status: 'completed',
              completedAt: new Date().toISOString(),
            }
          : m
      ),
    }));
  },
}));


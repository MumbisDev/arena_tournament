import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tournamentService, type Tournament, type CreateTournamentInput } from '../services/tournaments';
import type { FilterState } from '../types';

interface TournamentCache {
  tournament: Tournament | null;
  participants: Array<{ user_id: string; profile: { id: string; username: string; avatar?: string } }>;
  timestamp: number;
}

interface TournamentState {
  tournaments: Tournament[];
  isLoading: boolean;
  error: string | null;
  filters: FilterState;
  prefetchCache: Map<string, TournamentCache>;
  
  // Actions
  setFilter: (key: keyof FilterState, value: string) => void;
  resetFilters: () => void;
  
  // Data fetching
  fetchTournaments: () => Promise<void>;
  getTournamentById: (id: string) => Promise<Tournament | null>;
  getUserTournaments: (userId: string) => Promise<{ created: Tournament[]; joined: Tournament[] }>;
  prefetchTournament: (id: string) => Promise<void>;
  getCachedTournament: (id: string) => TournamentCache | null;
  
  // Tournament actions
  createTournament: (data: CreateTournamentInput, organizerId: string) => Promise<Tournament>;
  updateTournament: (id: string, updates: Partial<CreateTournamentInput>) => Promise<void>;
  deleteTournament: (id: string) => Promise<void>;
  joinTournament: (tournamentId: string, userId: string) => Promise<{ success: boolean; error?: string }>;
  leaveTournament: (tournamentId: string, userId: string) => Promise<void>;
  
  // Match actions
  updateMatchResult: (matchId: string, score1: number, score2: number, winnerId: string) => Promise<void>;
}

const defaultFilters: FilterState = {
  game: '',
  platform: 'all',
  region: 'all',
  status: 'all',
  search: '',
};

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      tournaments: [],
      isLoading: false,
      error: null,
      filters: defaultFilters,
      prefetchCache: new Map(),

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
        }));
        // Refetch with new filters
        get().fetchTournaments();
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
        get().fetchTournaments();
      },

      fetchTournaments: async () => {
        const { filters } = get();
        set({ isLoading: true, error: null });
        
        try {
          const tournaments = await tournamentService.getTournaments({
            game: filters.game || undefined,
            platform: filters.platform,
            region: filters.region,
            status: filters.status,
            search: filters.search || undefined,
          });
          set({ tournaments, isLoading: false });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch tournaments';
          set({ error: message, isLoading: false });
        }
      },

      getTournamentById: async (id: string) => {
        try {
          return await tournamentService.getTournament(id);
        } catch (error) {
          console.error('Error fetching tournament:', error);
          return null;
        }
      },

      prefetchTournament: async (id: string) => {
        const cache = get().prefetchCache;
        const cached = cache.get(id);
        
        // Don't refetch if cached and less than 30 seconds old
        if (cached && Date.now() - cached.timestamp < 30000) {
          return;
        }

        try {
          const [tournamentData, participantsData] = await Promise.all([
            tournamentService.getTournament(id),
            tournamentService.getParticipants(id),
          ]);

          cache.set(id, {
            tournament: tournamentData,
            participants: participantsData as Array<{ user_id: string; profile: { id: string; username: string; avatar?: string } }>,
            timestamp: Date.now(),
          });

          set({ prefetchCache: new Map(cache) });
        } catch (error) {
          console.error('Error prefetching tournament:', error);
        }
      },

      getCachedTournament: (id: string) => {
        const cache = get().prefetchCache;
        return cache.get(id) || null;
      },

      getUserTournaments: async (userId: string) => {
        try {
          return await tournamentService.getUserTournaments(userId);
        } catch (error) {
          console.error('Error fetching user tournaments:', error);
          return { created: [], joined: [] };
        }
      },

      createTournament: async (data, organizerId) => {
        try {
          const tournament = await tournamentService.createTournament(data, organizerId);
          set((state) => ({
            tournaments: [tournament, ...state.tournaments],
          }));
          return tournament;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to create tournament';
          throw new Error(message);
        }
      },

      updateTournament: async (id, updates) => {
        try {
          await tournamentService.updateTournament(id, updates);
          // Refetch to get updated data
          await get().fetchTournaments();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update tournament';
          throw new Error(message);
        }
      },

      deleteTournament: async (id) => {
        try {
          await tournamentService.deleteTournament(id);
          set((state) => ({
            tournaments: state.tournaments.filter((t) => t.id !== id),
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to delete tournament';
          throw new Error(message);
        }
      },

      joinTournament: async (tournamentId, userId) => {
        try {
          await tournamentService.joinTournament(tournamentId, userId);
          // Refetch to get updated participant count
          await get().fetchTournaments();
          return { success: true };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to join tournament';
          return { success: false, error: message };
        }
      },

      leaveTournament: async (tournamentId, userId) => {
        try {
          await tournamentService.leaveTournament(tournamentId, userId);
          await get().fetchTournaments();
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to leave tournament';
          throw new Error(message);
        }
      },

      updateMatchResult: async (matchId, score1, score2, winnerId) => {
        try {
          await tournamentService.updateMatch(matchId, {
            participant1_score: score1,
            participant2_score: score2,
            winner_id: winnerId,
            status: 'completed',
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update match';
          throw new Error(message);
        }
      },
    }),
    {
      name: 'tournament-storage',
      partialize: (state) => ({
        // Only persist tournaments list for instant UI on page load
        // Fresh data is still fetched via fetchTournaments()
        tournaments: state.tournaments,
      }),
    }
  )
);

import { supabase } from '../lib/supabase';
import type { Tables, Views } from '../lib/database.types';

export type Tournament = Views<'tournaments_with_organizer'>;
export type TournamentInsert = Tables<'tournaments'>;
export type Match = Tables<'matches'>;
export type Participant = Tables<'tournament_participants'>;

export interface CreateTournamentInput {
  name: string;
  game: string;
  description: string;
  format: 'single-elimination' | 'double-elimination' | 'round-robin';
  platform: 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'cross-platform';
  region: 'north-america' | 'europe' | 'asia' | 'oceania' | 'south-america' | 'global';
  max_participants: number;
  prize_pool?: string;
  rules: string;
  start_date: string;
  registration_deadline: string;
  image?: string;
}

export const tournamentService = {
  /**
   * Get all tournaments with organizer info
   */
  async getTournaments(filters?: {
    game?: string;
    platform?: string;
    region?: string;
    status?: string;
    search?: string;
  }): Promise<Tournament[]> {
    let query = supabase
      .from('tournaments_with_organizer')
      .select('*')
      .order('created_at', { ascending: false });

    if (filters?.game) {
      query = query.eq('game', filters.game);
    }
    if (filters?.platform && filters.platform !== 'all') {
      query = query.eq('platform', filters.platform);
    }
    if (filters?.region && filters.region !== 'all') {
      query = query.eq('region', filters.region);
    }
    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status);
    }
    if (filters?.search) {
      query = query.or(`name.ilike.%${filters.search}%,game.ilike.%${filters.search}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single tournament by ID
   */
  async getTournament(id: string): Promise<Tournament | null> {
    const { data, error } = await supabase
      .from('tournaments_with_organizer')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  /**
   * Get tournaments for a specific user (created and joined)
   */
  async getUserTournaments(userId: string) {
    const [createdResult, joinedResult] = await Promise.all([
      supabase
        .from('tournaments_with_organizer')
        .select('*')
        .eq('organizer_id', userId)
        .order('created_at', { ascending: false }),
      supabase
        .from('tournament_participants')
        .select('tournament_id')
        .eq('user_id', userId),
    ]);

    if (createdResult.error) throw createdResult.error;
    if (joinedResult.error) throw joinedResult.error;

    const joinedIds = joinedResult.data?.map((p) => p.tournament_id) || [];
    
    let joined: Tournament[] = [];
    if (joinedIds.length > 0) {
      const { data, error } = await supabase
        .from('tournaments_with_organizer')
        .select('*')
        .in('id', joinedIds)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      joined = data || [];
    }

    return {
      created: createdResult.data || [],
      joined,
    };
  },

  /**
   * Create a new tournament
   */
  async createTournament(input: CreateTournamentInput, organizerId: string): Promise<Tournament> {
    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        ...input,
        organizer_id: organizerId,
      })
      .select()
      .single();

    if (error) throw error;

    // Fetch the full tournament with organizer info
    const tournament = await this.getTournament(data.id);
    if (!tournament) throw new Error('Failed to fetch created tournament');
    return tournament;
  },

  /**
   * Update a tournament
   */
  async updateTournament(id: string, updates: Partial<CreateTournamentInput>) {
    const { data, error } = await supabase
      .from('tournaments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a tournament
   */
  async deleteTournament(id: string) {
    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Get tournament participants
   */
  async getParticipants(tournamentId: string) {
    const { data, error } = await supabase
      .from('tournament_participants')
      .select(`
        *,
        profile:profiles(id, username, avatar)
      `)
      .eq('tournament_id', tournamentId)
      .order('joined_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Join a tournament
   */
  async joinTournament(tournamentId: string, userId: string) {
    const { error } = await supabase.from('tournament_participants').insert({
      tournament_id: tournamentId,
      user_id: userId,
    });

    if (error) {
      if (error.code === '23505') {
        throw new Error('Already registered for this tournament');
      }
      throw error;
    }
  },

  /**
   * Leave a tournament
   */
  async leaveTournament(tournamentId: string, userId: string) {
    const { error } = await supabase
      .from('tournament_participants')
      .delete()
      .eq('tournament_id', tournamentId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Get matches for a tournament
   */
  async getMatches(tournamentId: string): Promise<Match[]> {
    const { data, error } = await supabase
      .from('matches')
      .select(`
        *,
        participant1:profiles!matches_participant1_id_fkey(id, username, avatar),
        participant2:profiles!matches_participant2_id_fkey(id, username, avatar),
        winner:profiles!matches_winner_id_fkey(id, username)
      `)
      .eq('tournament_id', tournamentId)
      .order('round', { ascending: true })
      .order('match_number', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Update a match result
   */
  async updateMatch(
    matchId: string,
    updates: {
      participant1_score?: number;
      participant2_score?: number;
      winner_id?: string;
      status?: 'pending' | 'live' | 'completed';
    }
  ) {
    const updateData: Record<string, unknown> = { ...updates };
    if (updates.status === 'completed') {
      updateData.completed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', matchId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get available games
   */
  async getGames() {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Subscribe to tournament changes (real-time)
   */
  subscribeTournaments(callback: (payload: unknown) => void) {
    return supabase
      .channel('tournaments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, callback)
      .subscribe();
  },

  /**
   * Subscribe to match changes for a tournament (real-time)
   */
  subscribeMatches(tournamentId: string, callback: (payload: unknown) => void) {
    return supabase
      .channel(`matches:${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        callback
      )
      .subscribe();
  },
};


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          email: string;
          avatar?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          email?: string;
          avatar?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
      };
      user_stats: {
        Row: {
          user_id: string;
          tournaments_joined: number;
          tournaments_created: number;
          wins: number;
          losses: number;
        };
        Insert: {
          user_id: string;
          tournaments_joined?: number;
          tournaments_created?: number;
          wins?: number;
          losses?: number;
        };
        Update: {
          tournaments_joined?: number;
          tournaments_created?: number;
          wins?: number;
          losses?: number;
        };
      };
      tournaments: {
        Row: {
          id: string;
          name: string;
          game: string;
          description: string;
          organizer_id: string;
          status: 'upcoming' | 'live' | 'completed' | 'cancelled';
          format: 'single-elimination' | 'double-elimination' | 'round-robin';
          platform: 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'cross-platform';
          region: 'north-america' | 'europe' | 'asia' | 'oceania' | 'south-america' | 'global';
          max_participants: number;
          current_participants: number;
          prize_pool: string | null;
          rules: string;
          image: string | null;
          start_date: string;
          end_date: string | null;
          registration_deadline: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          game: string;
          description: string;
          organizer_id: string;
          status?: 'upcoming' | 'live' | 'completed' | 'cancelled';
          format: 'single-elimination' | 'double-elimination' | 'round-robin';
          platform: 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'cross-platform';
          region: 'north-america' | 'europe' | 'asia' | 'oceania' | 'south-america' | 'global';
          max_participants: number;
          current_participants?: number;
          prize_pool?: string | null;
          rules: string;
          image?: string | null;
          start_date: string;
          end_date?: string | null;
          registration_deadline: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          game?: string;
          description?: string;
          status?: 'upcoming' | 'live' | 'completed' | 'cancelled';
          format?: 'single-elimination' | 'double-elimination' | 'round-robin';
          platform?: 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'cross-platform';
          region?: 'north-america' | 'europe' | 'asia' | 'oceania' | 'south-america' | 'global';
          max_participants?: number;
          prize_pool?: string | null;
          rules?: string;
          image?: string | null;
          start_date?: string;
          end_date?: string | null;
          registration_deadline?: string;
          updated_at?: string;
        };
      };
      tournament_participants: {
        Row: {
          id: string;
          tournament_id: string;
          user_id: string;
          joined_at: string;
          seed: number | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          user_id: string;
          joined_at?: string;
          seed?: number | null;
        };
        Update: {
          seed?: number | null;
        };
      };
      matches: {
        Row: {
          id: string;
          tournament_id: string;
          round: number;
          match_number: number;
          participant1_id: string | null;
          participant1_score: number;
          participant2_id: string | null;
          participant2_score: number;
          winner_id: string | null;
          status: 'pending' | 'live' | 'completed';
          scheduled_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
          next_match_id: string | null;
        };
        Insert: {
          id?: string;
          tournament_id: string;
          round: number;
          match_number: number;
          participant1_id?: string | null;
          participant1_score?: number;
          participant2_id?: string | null;
          participant2_score?: number;
          winner_id?: string | null;
          status?: 'pending' | 'live' | 'completed';
          scheduled_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
          next_match_id?: string | null;
        };
        Update: {
          participant1_id?: string | null;
          participant1_score?: number;
          participant2_id?: string | null;
          participant2_score?: number;
          winner_id?: string | null;
          status?: 'pending' | 'live' | 'completed';
          scheduled_at?: string | null;
          completed_at?: string | null;
          next_match_id?: string | null;
        };
      };
      games: {
        Row: {
          id: string;
          name: string;
          image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          image?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          image?: string | null;
        };
      };
    };
    Views: {
      tournaments_with_organizer: {
        Row: {
          id: string;
          name: string;
          game: string;
          description: string;
          organizer_id: string;
          organizer_name: string;
          organizer_avatar: string | null;
          status: 'upcoming' | 'live' | 'completed' | 'cancelled';
          format: 'single-elimination' | 'double-elimination' | 'round-robin';
          platform: 'pc' | 'playstation' | 'xbox' | 'nintendo' | 'mobile' | 'cross-platform';
          region: 'north-america' | 'europe' | 'asia' | 'oceania' | 'south-america' | 'global';
          max_participants: number;
          current_participants: number;
          prize_pool: string | null;
          rules: string;
          image: string | null;
          start_date: string;
          end_date: string | null;
          registration_deadline: string;
          created_at: string;
          updated_at: string;
        };
      };
      profiles_with_stats: {
        Row: {
          id: string;
          username: string;
          email: string;
          avatar: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
          tournaments_joined: number;
          tournaments_created: number;
          wins: number;
          losses: number;
        };
      };
    };
  };
};

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];
export type Enums<T extends keyof Database['public']['Tables']['tournaments']['Row']> = Database['public']['Tables']['tournaments']['Row'][T];


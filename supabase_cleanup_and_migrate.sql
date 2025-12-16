-- Cleanup and Migration Script
-- This will drop existing objects and recreate them fresh
-- Run this in Supabase SQL Editor if you're getting errors

-- First, drop existing triggers and functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
DROP TRIGGER IF EXISTS set_updated_at_tournaments ON public.tournaments;
DROP TRIGGER IF EXISTS set_updated_at_matches ON public.matches;

DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop views
DROP VIEW IF EXISTS public.profiles_with_stats;
DROP VIEW IF EXISTS public.tournaments_with_organizer;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS public.matches CASCADE;
DROP TABLE IF EXISTS public.tournament_participants CASCADE;
DROP TABLE IF EXISTS public.tournaments CASCADE;
DROP TABLE IF EXISTS public.games CASCADE;
DROP TABLE IF EXISTS public.user_stats CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Now run the migration
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create user_stats table
CREATE TABLE public.user_stats (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  tournaments_joined INTEGER DEFAULT 0 NOT NULL,
  tournaments_created INTEGER DEFAULT 0 NOT NULL,
  wins INTEGER DEFAULT 0 NOT NULL,
  losses INTEGER DEFAULT 0 NOT NULL
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  game TEXT NOT NULL,
  description TEXT NOT NULL,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed', 'cancelled')),
  format TEXT NOT NULL CHECK (format IN ('single-elimination', 'double-elimination', 'round-robin')),
  platform TEXT NOT NULL CHECK (platform IN ('pc', 'playstation', 'xbox', 'nintendo', 'mobile', 'cross-platform')),
  region TEXT NOT NULL CHECK (region IN ('north-america', 'europe', 'asia', 'oceania', 'south-america', 'global')),
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0 NOT NULL,
  prize_pool TEXT,
  rules TEXT NOT NULL,
  image TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  registration_deadline TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create tournament_participants table
CREATE TABLE public.tournament_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  seed INTEGER,
  UNIQUE(tournament_id, user_id)
);

-- Create matches table
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID NOT NULL REFERENCES public.tournaments(id) ON DELETE CASCADE,
  round INTEGER NOT NULL,
  match_number INTEGER NOT NULL,
  participant1_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  participant1_score INTEGER DEFAULT 0 NOT NULL,
  participant2_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  participant2_score INTEGER DEFAULT 0 NOT NULL,
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'live', 'completed')),
  scheduled_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  next_match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  UNIQUE(tournament_id, round, match_number)
);

-- Create games table
CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger function
CREATE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_tournaments
  BEFORE UPDATE ON public.tournaments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at_matches
  BEFORE UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to create profile when user signs up
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_username TEXT;
BEGIN
  -- Extract username from metadata or use email prefix as fallback
  v_username := COALESCE(
    (NEW.raw_user_meta_data->>'username'),
    split_part(COALESCE(NEW.email, ''), '@', 1)
  );
  
  -- Ensure username is not empty - use a fallback
  IF v_username IS NULL OR trim(v_username) = '' THEN
    v_username := 'user_' || substr(replace(NEW.id::text, '-', ''), 1, 8);
  END IF;
  
  -- Insert profile (with conflict handling)
  INSERT INTO public.profiles (id, username, email)
  VALUES (NEW.id, v_username, COALESCE(NEW.email, ''))
  ON CONFLICT (id) DO UPDATE
  SET username = EXCLUDED.username,
      email = EXCLUDED.email;
  
  -- Create initial user stats (with conflict handling)
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create profiles_with_stats view
CREATE VIEW public.profiles_with_stats AS
SELECT 
  p.id,
  p.username,
  p.email,
  p.avatar,
  p.bio,
  p.created_at,
  p.updated_at,
  COALESCE(us.tournaments_joined, 0) AS tournaments_joined,
  COALESCE(us.tournaments_created, 0) AS tournaments_created,
  COALESCE(us.wins, 0) AS wins,
  COALESCE(us.losses, 0) AS losses
FROM public.profiles p
LEFT JOIN public.user_stats us ON p.id = us.user_id;

-- Create tournaments_with_organizer view
CREATE VIEW public.tournaments_with_organizer AS
SELECT 
  t.*,
  p.username AS organizer_name,
  p.avatar AS organizer_avatar
FROM public.tournaments t
JOIN public.profiles p ON t.organizer_id = p.id;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view all stats" ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats" ON public.user_stats;
DROP POLICY IF EXISTS "Anyone can view tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Organizers can update their tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Organizers can delete their tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Anyone can view participants" ON public.tournament_participants;
DROP POLICY IF EXISTS "Authenticated users can join tournaments" ON public.tournament_participants;
DROP POLICY IF EXISTS "Users can leave tournaments" ON public.tournament_participants;
DROP POLICY IF EXISTS "Anyone can view matches" ON public.matches;
DROP POLICY IF EXISTS "Tournament organizers can update matches" ON public.matches;
DROP POLICY IF EXISTS "Anyone can view games" ON public.games;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_stats
CREATE POLICY "Users can view all stats"
  ON public.user_stats FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own stats"
  ON public.user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for tournaments
CREATE POLICY "Anyone can view tournaments"
  ON public.tournaments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their tournaments"
  ON public.tournaments FOR UPDATE
  USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their tournaments"
  ON public.tournaments FOR DELETE
  USING (auth.uid() = organizer_id);

-- RLS Policies for tournament_participants
CREATE POLICY "Anyone can view participants"
  ON public.tournament_participants FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join tournaments"
  ON public.tournament_participants FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can leave tournaments"
  ON public.tournament_participants FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for matches
CREATE POLICY "Anyone can view matches"
  ON public.matches FOR SELECT
  USING (true);

CREATE POLICY "Tournament organizers can update matches"
  ON public.matches FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.tournaments
      WHERE tournaments.id = matches.tournament_id
      AND tournaments.organizer_id = auth.uid()
    )
  );

-- RLS Policies for games
CREATE POLICY "Anyone can view games"
  ON public.games FOR SELECT
  USING (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_stats TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.tournaments TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.tournament_participants TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.matches TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.games TO postgres, anon, authenticated, service_role;

-- Set view security
ALTER VIEW public.profiles_with_stats SET (security_invoker = true);
ALTER VIEW public.tournaments_with_organizer SET (security_invoker = true);

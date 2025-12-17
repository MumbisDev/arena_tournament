import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, Users, Award, ArrowRight } from 'lucide-react';
import { Layout } from '../components/layout';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { TournamentCard, TournamentFilters } from '../components/tournament';
import { useTournamentStore } from '../store/tournamentStore';
import { useAuthStore } from '../store/authStore';

export function DiscoverPage() {
  const { tournaments, fetchTournaments, isLoading, filters } = useTournamentStore();
  const { isAuthenticated } = useAuthStore();

  // Check if any filters are active
  const hasActiveFilters = 
    filters.search || 
    filters.game || 
    filters.platform !== 'all' || 
    filters.region !== 'all' || 
    filters.status !== 'all';

  // Fetch tournaments on initial load only (not when filters return empty results)
  useEffect(() => {
    if (tournaments.length === 0 && !isLoading && !hasActiveFilters) {
      fetchTournaments();
    }
  }, [tournaments.length, isLoading, hasActiveFilters, fetchTournaments]);

  // Get featured tournaments (live or upcoming with most participants)
  const featuredTournaments = [...tournaments]
    .filter((t) => t.status === 'live' || t.status === 'upcoming')
    .sort((a, b) => b.current_participants - a.current_participants)
    .slice(0, 3);

  return (
    <Layout>
      {/* Hero Section - Japanese Brutalist */}
      <section className="relative min-h-[500px] bg-brutal-black overflow-hidden animate-fade-in">
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        
        {/* Background image with heavy treatment */}
        <div
          className="absolute inset-0 opacity-20 grayscale"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Diagonal stripe accent */}
        <div 
          className="absolute top-0 right-0 w-96 h-full bg-brutal-vermillion transform skew-x-12 translate-x-32 opacity-80"
        />
        
        <div className="relative max-w-container mx-auto px-lg py-3xl flex flex-col justify-center min-h-[500px]">
          {/* Top label */}
          <div className="mb-lg">
            <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-[0.3em] border-b-2 border-brutal-vermillion pb-1">
              // Tournament Platform v1.0
            </span>
          </div>
          
          {/* Main heading with display font */}
          <h1 className="font-display text-[72px] md:text-[96px] lg:text-[120px] text-brutal-white uppercase leading-[0.85] mb-md max-w-4xl">
            Compete
            <br />
            <span className="text-brutal-vermillion">& Conquer</span>
          </h1>
          
          {/* Subtitle */}
          <p className="font-mono text-sm text-brutal-white/60 mb-2 tracking-widest uppercase">
            Compete at the highest level
          </p>
          
          {/* Description */}
          <p className="font-mono text-mono-sm text-neutral-400 max-w-lg mb-xl leading-relaxed">
            Join thousands of players in competitive gaming tournaments. 
            Create, compete, and climb the ranks. No limits. No excuses.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/create-tournament">
                  <Button size="lg">
                    Create Tournament
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button size="lg">
                    View Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg">
                    Get Started
                    <ArrowRight size={16} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Decorative corner brackets */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-brutal-vermillion" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-brutal-vermillion" />
      </section>

      {/* Stats Section - Dense info display */}
      <section className="bg-brutal-white border-y-4 border-brutal-black animate-fade-in">
        <div className="max-w-container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {[
              { icon: Trophy, value: `${tournaments.length}+`, label: 'Tournaments' },
              { icon: Users, value: '2,500+', label: 'Players' },
              { icon: Zap, value: tournaments.filter(t => t.status === 'live').length.toString(), label: 'Live Now' },
              { icon: Award, value: '$15K+', label: 'Prize Pools' },
            ].map((stat, index) => (
              <div 
                key={stat.label}
                className={`p-lg text-center border-brutal-black ${index < 3 ? 'border-r-3' : ''} hover:bg-brutal-cream transition-colors group animate-fade-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <stat.icon className="w-6 h-6 mx-auto mb-3 text-brutal-vermillion group-hover:scale-110 transition-transform" />
                <div className="font-display text-4xl text-brutal-black mb-1">{stat.value}</div>
                <div className="font-mono text-mono-xs uppercase tracking-widest text-neutral-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tournaments */}
      <section className="max-w-container mx-auto px-lg py-2xl">
        {/* Section header */}
        <div className="flex items-end justify-between mb-lg border-b-3 border-brutal-black pb-4">
          <div>
            <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-[0.3em] block mb-2">
              [01] Featured
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase text-brutal-black">
              Featured
            </h2>
          </div>
          {featuredTournaments.length > 0 && (
            <span className="hidden md:block font-mono text-mono-xs text-neutral-400 uppercase tracking-widest">
              {featuredTournaments.length} Events
            </span>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-brutal-white border-3 border-brutal-black animate-pulse" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
                <div className="h-48 bg-neutral-200" />
                <div className="p-lg space-y-3">
                  <div className="h-6 bg-neutral-200 rounded w-3/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : featuredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {featuredTournaments.map((tournament) => (
              <div key={tournament.id}>
                <TournamentCard tournament={tournament} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Trophy}
            title="No Featured Tournaments"
            description="Check back soon for featured tournaments"
          />
        )}
      </section>

      {/* Filters and All Tournaments */}
      <section className="max-w-container mx-auto px-lg pb-3xl animate-fade-in">
        {/* Section header */}
        <div className="flex items-end justify-between mb-lg border-b-3 border-brutal-black pb-4">
          <div>
            <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-[0.3em] block mb-2">
              [02] Browse
            </span>
            <h2 className="font-display text-4xl md:text-5xl uppercase text-brutal-black">
              All Tournaments
            </h2>
          </div>
          <span className="hidden md:block font-mono text-mono-xs text-neutral-400 uppercase tracking-widest">
            {tournaments.length} Total
          </span>
        </div>
        
        <TournamentFilters />

        <div className="mt-lg">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-brutal-white border-3 border-brutal-black animate-pulse" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
                  <div className="h-48 bg-neutral-200" />
                  <div className="p-lg space-y-3">
                    <div className="h-6 bg-neutral-200 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : tournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
              {tournaments.map((tournament) => (
                <div key={tournament.id}>
                  <TournamentCard tournament={tournament} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Trophy}
              title="No Tournaments Found"
              description="Be the first to create a tournament!"
            />
          )}
        </div>
      </section>
    </Layout>
  );
}

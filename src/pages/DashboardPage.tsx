import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, TrendingUp, Plus, ChevronRight, Zap } from 'lucide-react';
import { Layout, Breadcrumbs } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuthStore } from '../store/authStore';
import { useTournamentStore } from '../store/tournamentStore';
import { tournamentService } from '../services/tournaments';
import type { Tournament } from '../services/tournaments';
import type { Match } from '../types';

export function DashboardPage() {
  const { user } = useAuthStore();
  const { getUserTournaments, tournaments } = useTournamentStore();
  const [userTournaments, setUserTournaments] = useState<{ created: Tournament[]; joined: Tournament[] }>({ created: [], joined: [] });
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([]);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!user) {
        return;
      }

      try {
        // Load user tournaments
        const tournamentsData = await getUserTournaments(user.id);
        setUserTournaments(tournamentsData);

        // Load matches for all joined tournaments
        const matchesPromises = tournamentsData.joined.map((t) => tournamentService.getMatches(t.id));
        const matchesArrays = await Promise.all(matchesPromises);
        const allMatches = matchesArrays.flat();
        
        // Filter and sort upcoming matches
        const upcoming = allMatches
          .filter((m) => m.status === 'pending' || m.status === 'live')
          .slice(0, 5);
        
        setUpcomingMatches(upcoming);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadDashboardData();
  }, [user, getUserTournaments]);

  // Any authenticated user can create tournaments
  const canCreateTournament = !!user;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Layout>
      <div className="max-w-container mx-auto px-lg py-lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard' },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-xl border-b-3 border-brutal-black pb-lg">
          <div>
            <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-[0.3em] block mb-2">
              // User Dashboard
            </span>
            <h1 className="font-display text-4xl md:text-5xl uppercase text-brutal-black">
              Dashboard
            </h1>
            <p className="font-mono text-mono-sm text-neutral-500 mt-2">
              Welcome back, <span className="text-brutal-vermillion">{user?.username}</span>
            </p>
          </div>
          <div className="flex gap-md mt-md md:mt-0">
            {canCreateTournament && (
              <Link to="/create-tournament">
                <Button>
                  <Plus size={16} />
                  Create
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="secondary">Browse</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-xl bg-brutal-white border-3 border-brutal-black" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
          {[
            { label: 'Joined', value: user?.tournaments_joined || 0 },
            { label: 'Created', value: user?.tournaments_created || 0 },
            { label: 'Wins', value: user?.wins || 0, color: 'text-semantic-success' },
            { label: 'Losses', value: user?.losses || 0, color: 'text-neutral-400' },
          ].map((stat, index) => (
            <div 
              key={stat.label}
              className={`p-lg text-center ${index < 3 ? 'border-r-3 border-brutal-black' : ''}`}
            >
              <div className="font-mono text-mono-xs uppercase tracking-widest text-neutral-500 mb-1">
                {stat.label}
              </div>
              <div className={`font-display text-4xl ${stat.color || 'text-brutal-black'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
          {/* Upcoming Matches */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-md border-b-2 border-brutal-black pb-2">
              <h2 className="font-display text-2xl uppercase flex items-center gap-3">
                <Zap size={20} className="text-brutal-vermillion" />
                Upcoming Matches
              </h2>
              <span className="font-mono text-mono-xs text-neutral-400 uppercase tracking-widest">
                {upcomingMatches.length} Total
              </span>
            </div>
            
            {upcomingMatches.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No upcoming matches"
                description="Join a tournament to see your upcoming matches here."
                actionLabel="Browse Tournaments"
                onAction={() => window.location.href = '/'}
              />
            ) : (
              <div className="space-y-md">
                {upcomingMatches.map((match) => {
                  const tournament = tournaments.find(t => t.id === match.tournament_id) || 
                                    userTournaments.joined.find(t => t.id === match.tournament_id) ||
                                    userTournaments.created.find(t => t.id === match.tournament_id);
                  return (
                    <Link key={match.id} to={`/tournament/${match.tournament_id}/matches`}>
                      <Card hoverable className="group">
                        <div className="px-md py-sm bg-brutal-black text-brutal-white flex items-center justify-between">
                          <span className="font-mono text-mono-xs uppercase tracking-widest">
                            {tournament?.name}
                          </span>
                          <StatusBadge status={match.status} />
                        </div>
                        <CardContent className="p-md">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="font-display text-lg uppercase">
                                {match.participant1?.username || 'TBD'}
                              </span>
                              <span className="font-mono text-mono-xs text-brutal-vermillion">VS</span>
                              <span className="font-display text-lg uppercase">
                                {match.participant2?.username || 'TBD'}
                              </span>
                            </div>
                            <div className="flex items-center gap-md">
                              {match.scheduled_at && (
                                <span className="font-mono text-mono-xs text-neutral-500 uppercase tracking-widest">
                                  {formatDate(match.scheduled_at)}
                                </span>
                              )}
                              <ChevronRight size={16} className="text-neutral-400 group-hover:text-brutal-vermillion transition-colors" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Actions & My Tournaments */}
          <div className="space-y-xl">
            {/* Quick Actions */}
            <div>
              <h2 className="font-display text-xl uppercase mb-md border-b-2 border-brutal-black pb-2 flex items-center gap-2">
                <span className="text-brutal-vermillion">[01]</span> Quick Actions
              </h2>
              <div className="space-y-sm">
                <Link to="/" className="block">
                  <Card hoverable className="group">
                    <CardContent className="p-md flex items-center gap-md">
                      <Trophy size={18} className="text-neutral-500 group-hover:text-brutal-vermillion transition-colors" />
                      <span className="font-mono text-mono-sm uppercase tracking-widest">Find Tournaments</span>
                    </CardContent>
                  </Card>
                </Link>
                {canCreateTournament && (
                  <Link to="/create-tournament" className="block">
                    <Card hoverable className="group">
                      <CardContent className="p-md flex items-center gap-md">
                        <Plus size={18} className="text-neutral-500 group-hover:text-brutal-vermillion transition-colors" />
                        <span className="font-mono text-mono-sm uppercase tracking-widest">Create Tournament</span>
                      </CardContent>
                    </Card>
                  </Link>
                )}
                <Link to="/profile" className="block">
                  <Card hoverable className="group">
                    <CardContent className="p-md flex items-center gap-md">
                      <TrendingUp size={18} className="text-neutral-500 group-hover:text-brutal-vermillion transition-colors" />
                      <span className="font-mono text-mono-sm uppercase tracking-widest">View Profile</span>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>

            {/* My Tournaments */}
            <div>
              <h2 className="font-display text-xl uppercase mb-md border-b-2 border-brutal-black pb-2 flex items-center gap-2">
                <span className="text-brutal-vermillion">[02]</span> My Tournaments
              </h2>
              {userTournaments.joined.length === 0 && userTournaments.created.length === 0 ? (
                <p className="font-mono text-mono-sm text-neutral-500">No tournaments yet.</p>
              ) : (
                <div className="space-y-sm">
                  {[...userTournaments.created, ...userTournaments.joined]
                    .slice(0, 5)
                    .map((tournament) => (
                      <Link key={tournament.id} to={`/tournament/${tournament.id}`}>
                        <Card hoverable className="group">
                          <CardContent className="p-md">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-widest">
                                  {tournament.game}
                                </div>
                                <div className="font-display text-lg uppercase truncate mt-1">
                                  {tournament.name}
                                </div>
                              </div>
                              <StatusBadge status={tournament.status} />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

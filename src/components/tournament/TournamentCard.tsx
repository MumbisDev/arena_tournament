import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { Users, Calendar, MapPin, Gamepad2 } from 'lucide-react';
import type { Tournament } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { StatusBadge, TagBadge } from '../ui/Badge';
import { useTournamentStore } from '../../store/tournamentStore';
import { getGameThumbnail } from '../../lib/constants';

interface TournamentCardProps {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: TournamentCardProps) {
  const navigate = useNavigate();
  const { prefetchTournament } = useTournamentStore();
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    prefetchTournament(tournament.id);
  };

  // Prefetch when card is visible in viewport
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchTournament(tournament.id);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' } // Start prefetching 100px before card is visible
    );

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, [tournament.id, prefetchTournament]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRegion = (region: string) => {
    return region.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card
      ref={cardRef}
      hoverable
      onClick={() => navigate(`/tournament/${tournament.id}`)}
      onMouseEnter={handleMouseEnter}
      className="group overflow-hidden"
    >
      {/* Header bar */}
      <div className="px-md py-2 bg-brutal-black text-brutal-white flex items-center justify-between">
        <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-widest">
          [{tournament.id.slice(0, 4)}]
        </span>
        <span className="font-mono text-mono-xs uppercase tracking-widest">
          {tournament.game}
        </span>
      </div>

      {/* Image */}
      <div className="relative aspect-[16/9] bg-neutral-100 overflow-hidden border-b-3 border-brutal-black">
        {(() => {
          const imageUrl = tournament.image || getGameThumbnail(tournament.game);
          if (imageUrl) {
            return (
              <>
                <img
                  src={imageUrl}
                  alt={tournament.name}
                  className="w-full h-full object-cover transition-all duration-normal group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                {/* Scan lines overlay */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(10, 10, 10, 0.15) 2px, rgba(10, 10, 10, 0.15) 4px)',
                  }}
                />
              </>
            );
          }
          return (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200">
              <Gamepad2 className="w-16 h-16 text-neutral-400" />
            </div>
          );
        })()}
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={tournament.status} />
        </div>
        
        {/* Prize pool */}
        {tournament.prize_pool && (
          <div className="absolute top-3 right-3">
            <TagBadge>{tournament.prize_pool}</TagBadge>
          </div>
        )}
      </div>

      <CardContent className="p-md">
        {/* Tournament name */}
        <h3 className="font-display text-xl text-brutal-black uppercase tracking-wide mb-3 line-clamp-1 group-hover:text-brutal-vermillion transition-colors">
          {tournament.name}
        </h3>

        {/* Meta info with brutalist styling */}
        <div className="space-y-2 border-t-2 border-dashed border-neutral-300 pt-3">
          <div className="flex items-center gap-3">
            <Calendar size={12} className="text-brutal-vermillion" />
            <span className="font-mono text-mono-xs text-neutral-600 uppercase tracking-widest">
              {formatDate(tournament.start_date)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin size={12} className="text-brutal-vermillion" />
            <span className="font-mono text-mono-xs text-neutral-600 uppercase tracking-widest">
              {formatRegion(tournament.region)}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Users size={12} className="text-brutal-vermillion" />
            <span className="font-mono text-mono-xs text-neutral-600 uppercase tracking-widest">
              {tournament.current_participants}/{tournament.max_participants} Players
            </span>
          </div>
        </div>

        {/* Progress bar for registration */}
        {tournament.status === 'upcoming' && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-mono-xs text-neutral-500 uppercase tracking-widest">
                Capacity
              </span>
              <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-widest">
                {Math.round((tournament.current_participants / tournament.max_participants) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-neutral-200 border border-brutal-black overflow-hidden">
              <div
                className="h-full bg-brutal-black transition-all duration-slow"
                style={{
                  width: `${(tournament.current_participants / tournament.max_participants) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

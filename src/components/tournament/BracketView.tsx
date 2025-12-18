import type { Match } from '../../types';
import { StatusBadge } from '../ui/Badge';

interface BracketViewProps {
  matches: Match[];
  format: 'single-elimination' | 'double-elimination' | 'round-robin';
}

export function BracketView({ matches, format }: BracketViewProps) {
  // Group matches by round
  const rounds = matches.reduce((acc, match) => {
    const round = match.round;
    if (!acc[round]) acc[round] = [];
    acc[round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  const roundNumbers = Object.keys(rounds).map(Number).sort((a, b) => a - b);

  if (matches.length === 0) {
    return (
      <div className="bg-neutral-100 p-xl text-center">
        <p className="text-neutral-500 text-sm">
          Bracket will be generated when the tournament starts.
        </p>
      </div>
    );
  }

  if (format === 'round-robin') {
    return <RoundRobinView matches={matches} />;
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-xl min-w-max">
        {roundNumbers.map((roundNum) => (
          <div key={roundNum} className="flex flex-col gap-md">
            <h4 className="text-xs uppercase tracking-widest text-neutral-500 text-center mb-2">
              Round {roundNum}
            </h4>
            <div className="flex flex-col gap-lg justify-around flex-1">
              {rounds[roundNum].map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MatchCardProps {
  match: Match;
}

function MatchCard({ match }: MatchCardProps) {
  const isLive = match.status === 'live';
  const isCompleted = match.status === 'completed';

  return (
    <div
      className={`
        w-64 border transition-all duration-normal
        ${isLive ? 'border-semantic-success bg-semantic-success/5' : 'border-neutral-200 bg-primary-white'}
      `}
    >
      {/* Match header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-neutral-100">
        <span className="text-[10px] uppercase tracking-wide text-neutral-500">
          Match {match.match_number}
        </span>
        <StatusBadge status={match.status} />
      </div>

      {/* Participants */}
      <div className="divide-y divide-neutral-100">
        <ParticipantRow
          participant={match.participant1}
          score={match.participant1_score}
          isWinner={match.winner_id === match.participant1?.id}
          isCompleted={isCompleted}
        />
        <ParticipantRow
          participant={match.participant2}
          score={match.participant2_score}
          isWinner={match.winner_id === match.participant2?.id}
          isCompleted={isCompleted}
        />
      </div>
    </div>
  );
}

interface ParticipantRowProps {
  participant: { id: string; username: string; avatar?: string } | null | undefined;
  score: number;
  isWinner: boolean;
  isCompleted: boolean;
}

function ParticipantRow({ participant, score, isWinner, isCompleted }: ParticipantRowProps) {
  if (!participant) {
    return (
      <div className="flex items-center justify-between px-3 py-3">
        <span className="text-xs text-neutral-400 italic">TBD</span>
        <span className="text-xs text-neutral-300">-</span>
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-center justify-between px-3 py-3
        ${isWinner && isCompleted ? 'bg-semantic-success/10' : ''}
      `}
    >
      <span
        className={`
          text-xs uppercase tracking-wide truncate max-w-[160px]
          ${isWinner && isCompleted ? 'font-medium' : ''}
        `}
      >
        {participant.username}
      </span>
      <span
        className={`
          text-sm font-medium min-w-[24px] text-center
          ${isWinner && isCompleted ? 'text-semantic-success' : 'text-neutral-600'}
        `}
      >
        {score ?? '-'}
      </span>
    </div>
  );
}

interface RoundRobinViewProps {
  matches: Match[];
}

function RoundRobinView({ matches }: RoundRobinViewProps) {
  return (
    <div className="space-y-md">
      {matches.map((match) => (
        <div
          key={match.id}
          className={`
            border p-4 transition-all
            ${match.status === 'live' ? 'border-semantic-success bg-semantic-success/5' : 'border-neutral-200'}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-wide text-neutral-500">
              Round {match.round} - Match {match.match_number}
            </span>
            <StatusBadge status={match.status} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <span
                className={`
                  text-sm uppercase tracking-wide
                  ${match.winner_id === match.participant1?.id ? 'font-medium' : ''}
                `}
              >
                {match.participant1?.username || 'TBD'}
              </span>
            </div>
            
            <div className="flex items-center gap-4 px-4">
              <span className="text-lg font-medium w-8 text-center">
                {match.participant1_score ?? '-'}
              </span>
              <span className="text-neutral-300">vs</span>
              <span className="text-lg font-medium w-8 text-center">
                {match.participant2_score ?? '-'}
              </span>
            </div>
            
            <div className="flex-1 text-right">
              <span
                className={`
                  text-sm uppercase tracking-wide
                  ${match.winner_id === match.participant2?.id ? 'font-medium' : ''}
                `}
              >
                {match.participant2?.username || 'TBD'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


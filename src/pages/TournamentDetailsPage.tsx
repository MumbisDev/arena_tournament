import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Trophy, User, Clock, Settings } from 'lucide-react';
import { Layout, Breadcrumbs } from '../components/layout';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/Badge';
import { ConfirmModal } from '../components/ui/Modal';
import { BracketView } from '../components/tournament';
import { useAuthStore } from '../store/authStore';
import { useTournamentStore } from '../store/tournamentStore';

type Tab = 'overview' | 'bracket' | 'participants' | 'rules';

export function TournamentDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { getTournamentById, getMatchesByTournament, joinTournament, leaveTournament } = useTournamentStore();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [actionError, setActionError] = useState('');

  const tournament = getTournamentById(id || '');
  const matches = getMatchesByTournament(id || '');

  if (!tournament) {
    return (
      <Layout>
        <div className="max-w-container mx-auto px-lg py-3xl text-center">
          <Trophy className="w-16 h-16 mx-auto text-neutral-300 mb-md" />
          <h1 className="text-h2 uppercase mb-md">Tournament Not Found</h1>
          <p className="text-neutral-500 mb-lg">The tournament you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Browse Tournaments</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isOrganizer = user?.id === tournament.organizerId;
  const isParticipant = user ? tournament.participants.includes(user.id) : false;
  const canJoin = isAuthenticated && !isParticipant && !isOrganizer && tournament.status === 'upcoming';
  const canLeave = isParticipant && tournament.status === 'upcoming';
  const canManage = isOrganizer || user?.role === 'admin';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatRegion = (region: string) => {
    return region.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleJoin = () => {
    if (!user) return;
    const result = joinTournament(tournament.id, user.id);
    if (!result.success) {
      setActionError(result.error || 'Failed to join tournament');
    }
    setShowJoinModal(false);
  };

  const handleLeave = () => {
    if (!user) return;
    leaveTournament(tournament.id, user.id);
    setShowLeaveModal(false);
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'bracket', label: 'Bracket' },
    { key: 'participants', label: 'Participants' },
    { key: 'rules', label: 'Rules' },
  ];

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-64 bg-primary-black overflow-hidden">
        {tournament.image && (
          <>
            <img
              src={tournament.image}
              alt={tournament.name}
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
          </>
        )}
        <div className="relative max-w-container mx-auto px-lg h-full flex items-end pb-lg">
          <div className="text-primary-white">
            <div className="flex items-center gap-md mb-2">
              <span className="text-xs uppercase tracking-widest opacity-80">{tournament.game}</span>
              <StatusBadge status={tournament.status} />
            </div>
            <h1 className="text-h1 uppercase">{tournament.name}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-container mx-auto px-lg py-lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Tournaments', href: '/' },
            { label: tournament.name },
          ]}
        />

        {actionError && (
          <div className="bg-semantic-error/10 border border-semantic-error/20 px-4 py-3 text-sm text-semantic-error mb-lg">
            {actionError}
          </div>
        )}

        {/* Quick Info & Actions */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-lg mb-xl">
          <div className="flex flex-wrap gap-lg text-sm">
            <div className="flex items-center gap-2 text-neutral-600">
              <Calendar size={16} />
              <span>{formatDate(tournament.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <MapPin size={16} />
              <span>{formatRegion(tournament.region)}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <Users size={16} />
              <span>{tournament.currentParticipants} / {tournament.maxParticipants} Players</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-600">
              <User size={16} />
              <span>Hosted by {tournament.organizerName}</span>
            </div>
          </div>

          <div className="flex gap-md">
            {canJoin && (
              <Button onClick={() => setShowJoinModal(true)}>Join Tournament</Button>
            )}
            {canLeave && (
              <Button variant="secondary" onClick={() => setShowLeaveModal(true)}>Leave Tournament</Button>
            )}
            {canManage && (
              <Link to={`/tournament/${tournament.id}/manage`}>
                <Button variant="secondary">
                  <Settings size={16} />
                  Manage
                </Button>
              </Link>
            )}
            {!isAuthenticated && tournament.status === 'upcoming' && (
              <Link to="/login" state={{ from: { pathname: `/tournament/${tournament.id}` } }}>
                <Button>Login to Join</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-lg">
          <div className="flex gap-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  py-md text-xs uppercase tracking-widest transition-colors relative
                  ${activeTab === tab.key
                    ? 'text-primary-black font-medium'
                    : 'text-neutral-500 hover:text-primary-black'
                  }
                `}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-black" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
              <div className="lg:col-span-2">
                <h2 className="text-h3 uppercase mb-md">About</h2>
                <p className="text-sm text-neutral-600 leading-relaxed mb-xl">
                  {tournament.description}
                </p>

                {tournament.prizePool && (
                  <div className="bg-neutral-100 p-lg mb-xl">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-8 h-8 text-accent-yellow" />
                      <div>
                        <span className="text-xs text-neutral-500 uppercase tracking-wide block">Prize Pool</span>
                        <span className="text-2xl font-light">{tournament.prizePool}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-lg">
                <div className="border border-neutral-200 p-lg">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-md">Tournament Info</h3>
                  <div className="space-y-md text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Format</span>
                      <span className="capitalize">{tournament.format.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Platform</span>
                      <span className="capitalize">{tournament.platform.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Status</span>
                      <StatusBadge status={tournament.status} />
                    </div>
                  </div>
                </div>

                <div className="border border-neutral-200 p-lg">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-md">Important Dates</h3>
                  <div className="space-y-md text-sm">
                    <div className="flex items-start gap-3">
                      <Clock size={16} className="text-neutral-400 mt-0.5" />
                      <div>
                        <span className="text-neutral-500 block">Registration Closes</span>
                        <span>{formatDate(tournament.registrationDeadline)}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-neutral-400 mt-0.5" />
                      <div>
                        <span className="text-neutral-500 block">Tournament Starts</span>
                        <span>{formatDate(tournament.startDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bracket' && (
            <div>
              <h2 className="text-h3 uppercase mb-lg">Bracket</h2>
              <BracketView matches={matches} format={tournament.format} />
            </div>
          )}

          {activeTab === 'participants' && (
            <div>
              <h2 className="text-h3 uppercase mb-lg">
                Participants ({tournament.currentParticipants})
              </h2>
              {tournament.participants.length === 0 ? (
                <div className="bg-neutral-100 p-xl text-center">
                  <Users className="w-12 h-12 mx-auto text-neutral-300 mb-md" />
                  <p className="text-neutral-500">No participants yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                  {tournament.participants.map((participantId, index) => (
                    <div key={participantId} className="border border-neutral-200 p-md">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                          <User size={20} className="text-neutral-400" />
                        </div>
                        <div>
                          <span className="text-xs text-neutral-500">#{index + 1}</span>
                          <p className="text-sm font-medium">Player {index + 1}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <h2 className="text-h3 uppercase mb-lg">Rules & Guidelines</h2>
              {tournament.rules ? (
                <div className="bg-neutral-100 p-lg">
                  <pre className="whitespace-pre-wrap text-sm text-neutral-700 font-sans">
                    {tournament.rules}
                  </pre>
                </div>
              ) : (
                <p className="text-neutral-500">No specific rules have been set for this tournament.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onConfirm={handleJoin}
        title="Join Tournament"
        message={`Are you sure you want to join "${tournament.name}"? Make sure you're available on the tournament date.`}
        confirmText="Join"
      />

      <ConfirmModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
        onConfirm={handleLeave}
        title="Leave Tournament"
        message={`Are you sure you want to leave "${tournament.name}"? You can rejoin later if spots are available.`}
        confirmText="Leave"
        variant="danger"
      />
    </Layout>
  );
}


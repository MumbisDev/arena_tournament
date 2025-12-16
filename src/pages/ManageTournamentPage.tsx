import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Users, Trophy, Settings, Trash2, Play, CheckCircle, User, Save } from 'lucide-react';
import { Layout, Breadcrumbs } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input, Textarea, Select } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Modal, ConfirmModal } from '../components/ui/Modal';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { useAuthStore } from '../store/authStore';
import { useTournamentStore } from '../store/tournamentStore';
import { tournamentService, type Tournament } from '../services/tournaments';
import type { TournamentStatus } from '../types';

type Tab = 'participants' | 'matches' | 'settings';

interface Participant {
  user_id: string;
  joined_at: string;
  profile: {
    id: string;
    username: string;
    avatar?: string;
  };
}

export function ManageTournamentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { updateTournament, deleteTournament, leaveTournament, updateMatchResult } = useTournamentStore();

  const [activeTab, setActiveTab] = useState<Tab>('participants');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRemoveParticipantModal, setShowRemoveParticipantModal] = useState<string | null>(null);
  const [showEditMatchModal, setShowEditMatchModal] = useState<string | null>(null);
  const [matchScores, setMatchScores] = useState({ score1: 0, score2: 0, winnerId: '' });
  const [editedSettings, setEditedSettings] = useState<{
    name: string;
    description: string;
    rules: string;
    status: TournamentStatus;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const loadTournament = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const [tournamentData, participantsData] = await Promise.all([
          tournamentService.getTournament(id),
          tournamentService.getParticipants(id),
        ]);
        setTournament(tournamentData);
        setParticipants(participantsData as Participant[]);
      } catch (error) {
        console.error('Failed to load tournament:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTournament();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-container mx-auto px-lg py-3xl text-center">
          <div className="w-12 h-12 border-4 border-neutral-300 border-t-primary-black rounded-full animate-spin mx-auto mb-md" />
          <p className="text-neutral-500">Loading...</p>
        </div>
      </Layout>
    );
  }

  if (!tournament) {
    return (
      <Layout>
        <div className="max-w-container mx-auto px-lg py-3xl text-center">
          <Trophy className="w-16 h-16 mx-auto text-neutral-300 mb-md" />
          <h1 className="text-h2 uppercase mb-md">Tournament Not Found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isOrganizer = user?.id === tournament.organizer_id;
  const canManage = isOrganizer;

  if (!canManage) {
    navigate(`/tournament/${id}`);
    return null;
  }

  const handleRemoveParticipant = async (participantId: string) => {
    try {
      await leaveTournament(tournament.id, participantId);
      setParticipants((prev) => prev.filter((p) => p.user_id !== participantId));
    } catch (error) {
      console.error('Failed to remove participant:', error);
    }
    setShowRemoveParticipantModal(null);
  };

  const handleDeleteTournament = async () => {
    try {
      await deleteTournament(tournament.id);
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete tournament:', error);
    }
  };

  const handleUpdateMatch = async () => {
    if (showEditMatchModal) {
      try {
        await updateMatchResult(showEditMatchModal, matchScores.score1, matchScores.score2, matchScores.winnerId);
      } catch (error) {
        console.error('Failed to update match:', error);
      }
      setShowEditMatchModal(null);
      setMatchScores({ score1: 0, score2: 0, winnerId: '' });
    }
  };

  const handleSaveSettings = async () => {
    if (editedSettings) {
      try {
        await updateTournament(tournament.id, editedSettings);
        // Refresh tournament data
        const updated = await tournamentService.getTournament(tournament.id);
        if (updated) setTournament(updated);
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      setEditedSettings(null);
    }
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'participants', label: 'Participants', icon: <Users size={16} /> },
    { key: 'matches', label: 'Matches', icon: <Trophy size={16} /> },
    { key: 'settings', label: 'Settings', icon: <Settings size={16} /> },
  ];

  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="max-w-container mx-auto px-lg py-lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: tournament.name, href: `/tournament/${tournament.id}` },
            { label: 'Manage' },
          ]}
        />

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-xl">
          <div>
            <h1 className="text-h2 uppercase">Manage Tournament</h1>
            <div className="flex items-center gap-md mt-2">
              <span className="text-neutral-500">{tournament.name}</span>
              <StatusBadge status={tournament.status} />
            </div>
          </div>
          <div className="flex gap-md mt-md md:mt-0">
            <Link to={`/tournament/${tournament.id}`}>
              <Button variant="secondary">View Tournament</Button>
            </Link>
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
                  flex items-center gap-2 py-md text-xs uppercase tracking-widest transition-colors relative
                  ${activeTab === tab.key
                    ? 'text-primary-black font-medium'
                    : 'text-neutral-500 hover:text-primary-black'
                  }
                `}
              >
                {tab.icon}
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
          {activeTab === 'participants' && (
            <div>
              <div className="flex items-center justify-between mb-lg">
                <h2 className="text-h3 uppercase">
                  Participants ({tournament.current_participants}/{tournament.max_participants})
                </h2>
              </div>

              {participants.length === 0 ? (
                <Card className="p-xl text-center border border-neutral-200">
                  <Users className="w-12 h-12 mx-auto text-neutral-300 mb-md" />
                  <p className="text-neutral-500">No participants yet.</p>
                </Card>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>#</TableHeader>
                      <TableHeader>Player</TableHeader>
                      <TableHeader>Joined</TableHeader>
                      <TableHeader>Actions</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {participants.map((participant, index) => (
                      <TableRow key={participant.user_id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center overflow-hidden">
                              {participant.profile?.avatar ? (
                                <img src={participant.profile.avatar} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <User size={16} className="text-neutral-400" />
                              )}
                            </div>
                            <span>{participant.profile?.username || 'Unknown'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-neutral-500">
                          {formatDate(participant.joined_at)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="text"
                            size="sm"
                            onClick={() => setShowRemoveParticipantModal(participant.user_id)}
                            className="text-semantic-error"
                          >
                            Remove
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          )}

          {activeTab === 'matches' && (
            <div>
              <h2 className="text-h3 uppercase mb-lg">Match Results</h2>

              <Card className="p-xl text-center border border-neutral-200">
                <Trophy className="w-12 h-12 mx-auto text-neutral-300 mb-md" />
                <p className="text-neutral-500">Match generation coming soon.</p>
                {tournament.status === 'upcoming' && (
                  <Button 
                    className="mt-md" 
                    onClick={async () => {
                      await updateTournament(tournament.id, { status: 'live' });
                      const updated = await tournamentService.getTournament(tournament.id);
                      if (updated) setTournament(updated);
                    }}
                  >
                    <Play size={16} />
                    Start Tournament
                  </Button>
                )}
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl">
              <h2 className="text-h3 uppercase mb-lg">Tournament Settings</h2>

              <div className="space-y-lg">
                <Input
                  label="Tournament Name"
                  value={editedSettings?.name ?? tournament.name}
                  onChange={(e) =>
                    setEditedSettings((prev) => ({
                      name: e.target.value,
                      description: prev?.description ?? tournament.description,
                      rules: prev?.rules ?? tournament.rules,
                      status: prev?.status ?? tournament.status,
                    }))
                  }
                />

                <Textarea
                  label="Description"
                  rows={4}
                  value={editedSettings?.description ?? tournament.description}
                  onChange={(e) =>
                    setEditedSettings((prev) => ({
                      name: prev?.name ?? tournament.name,
                      description: e.target.value,
                      rules: prev?.rules ?? tournament.rules,
                      status: prev?.status ?? tournament.status,
                    }))
                  }
                />

                <Textarea
                  label="Rules"
                  rows={6}
                  value={editedSettings?.rules ?? tournament.rules}
                  onChange={(e) =>
                    setEditedSettings((prev) => ({
                      name: prev?.name ?? tournament.name,
                      description: prev?.description ?? tournament.description,
                      rules: e.target.value,
                      status: prev?.status ?? tournament.status,
                    }))
                  }
                />

                <Select
                  label="Status"
                  options={statusOptions}
                  value={editedSettings?.status ?? tournament.status}
                  onChange={(e) =>
                    setEditedSettings((prev) => ({
                      name: prev?.name ?? tournament.name,
                      description: prev?.description ?? tournament.description,
                      rules: prev?.rules ?? tournament.rules,
                      status: e.target.value as TournamentStatus,
                    }))
                  }
                />

                {editedSettings && (
                  <div className="flex gap-md">
                    <Button onClick={handleSaveSettings}>
                      <Save size={16} />
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={() => setEditedSettings(null)}>
                      Cancel
                    </Button>
                  </div>
                )}

                <hr className="border-neutral-200 my-xl" />

                <div className="border border-semantic-error/20 p-lg">
                  <h3 className="text-xs uppercase tracking-widest text-semantic-error mb-md">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-neutral-500 mb-md">
                    Deleting a tournament is permanent and cannot be undone.
                  </p>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(true)}
                    className="border-semantic-error text-semantic-error hover:bg-semantic-error hover:text-primary-white"
                  >
                    <Trash2 size={16} />
                    Delete Tournament
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Remove Participant Modal */}
      <ConfirmModal
        isOpen={!!showRemoveParticipantModal}
        onClose={() => setShowRemoveParticipantModal(null)}
        onConfirm={() => showRemoveParticipantModal && handleRemoveParticipant(showRemoveParticipantModal)}
        title="Remove Participant"
        message="Are you sure you want to remove this participant from the tournament?"
        confirmText="Remove"
        variant="danger"
      />

      {/* Delete Tournament Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTournament}
        title="Delete Tournament"
        message={`Are you sure you want to delete "${tournament.name}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />

      {/* Edit Match Result Modal */}
      <Modal
        isOpen={!!showEditMatchModal}
        onClose={() => setShowEditMatchModal(null)}
        title="Update Match Result"
        size="sm"
      >
        <div className="space-y-lg">
          <div className="flex items-center justify-between gap-md">
            <div className="flex-1">
              <label className="label">Player 1</label>
              <Input
                type="number"
                min={0}
                value={matchScores.score1}
                onChange={(e) => setMatchScores((prev) => ({ ...prev, score1: Number(e.target.value) }))}
              />
            </div>
            <span className="text-neutral-400 mt-6">vs</span>
            <div className="flex-1">
              <label className="label">Player 2</label>
              <Input
                type="number"
                min={0}
                value={matchScores.score2}
                onChange={(e) => setMatchScores((prev) => ({ ...prev, score2: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex gap-md justify-end">
            <Button variant="secondary" onClick={() => setShowEditMatchModal(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMatch} disabled={!matchScores.winnerId}>
              <CheckCircle size={16} />
              Save Result
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}

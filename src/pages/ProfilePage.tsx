import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Trophy, Calendar, Edit2, Save, X } from 'lucide-react';
import { Layout, Breadcrumbs } from '../components/layout';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '../components/ui/Table';
import { EmptyState } from '../components/ui/EmptyState';
import { useAuthStore } from '../store/authStore';
import { useTournamentStore } from '../store/tournamentStore';
import type { Tournament } from '../services/tournaments';

type Tab = 'overview' | 'tournaments' | 'history' | 'settings';

export function ProfilePage() {
  const { user, updateProfile } = useAuthStore();
  const { getUserTournaments } = useTournamentStore();
  
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  });
  const [userTournaments, setUserTournaments] = useState<{ created: Tournament[]; joined: Tournament[] }>({ created: [], joined: [] });
  const [isLoadingTournaments, setIsLoadingTournaments] = useState(true);

  useEffect(() => {
    const loadTournaments = async () => {
      if (!user) return;
      setIsLoadingTournaments(true);
      try {
        const tournaments = await getUserTournaments(user.id);
        setUserTournaments(tournaments);
      } catch (error) {
        console.error('Failed to load tournaments:', error);
      } finally {
        setIsLoadingTournaments(false);
      }
    };
    loadTournaments();
  }, [user, getUserTournaments]);

  const allTournaments = [...userTournaments.created, ...userTournaments.joined];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        username: editForm.username,
        bio: editForm.bio,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'tournaments', label: 'Tournaments' },
    { key: 'history', label: 'Match History' },
    { key: 'settings', label: 'Settings' },
  ];

  if (!user) {
    return (
      <Layout>
        <div className="max-w-container mx-auto px-lg py-3xl text-center">
          <User className="w-16 h-16 mx-auto text-neutral-300 mb-md" />
          <h1 className="text-h2 uppercase mb-md">Please Log In</h1>
          <p className="text-neutral-500 mb-lg">You need to be logged in to view your profile.</p>
          <Link to="/login">
            <Button>Log In</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-container mx-auto px-lg py-lg">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Profile' },
          ]}
        />

        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-start gap-lg mb-xl">
          <div className="w-24 h-24 bg-neutral-100 rounded-full overflow-hidden flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <User className="w-full h-full p-6 text-neutral-400" />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-h2 uppercase">{user.username}</h1>
                <div className="flex items-center gap-md mt-2">
                  <span className="text-xs text-neutral-500 uppercase tracking-wide">
                    Member since {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
              {!isEditing && activeTab === 'overview' && (
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 size={14} />
                  Edit Profile
                </Button>
              )}
            </div>
            
            {user.bio && !isEditing && (
              <p className="mt-md text-sm text-neutral-600">{user.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
          <Card className="p-md border border-neutral-200">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              Tournaments Joined
            </div>
            <div className="text-2xl font-light">{user.tournaments_joined}</div>
          </Card>
          <Card className="p-md border border-neutral-200">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              Tournaments Created
            </div>
            <div className="text-2xl font-light">{user.tournaments_created}</div>
          </Card>
          <Card className="p-md border border-neutral-200">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              Wins
            </div>
            <div className="text-2xl font-light text-semantic-success">{user.wins}</div>
          </Card>
          <Card className="p-md border border-neutral-200">
            <div className="text-xs uppercase tracking-wide text-neutral-500 mb-1">
              Win Rate
            </div>
            <div className="text-2xl font-light">
              {user.wins + user.losses > 0
                ? Math.round((user.wins / (user.wins + user.losses)) * 100)
                : 0}%
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-200 mb-lg">
          <div className="flex gap-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setIsEditing(false);
                }}
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
            <div>
              {isEditing ? (
                <div className="max-w-lg space-y-lg">
                  <Input
                    label="Username"
                    value={editForm.username}
                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  />
                  <Textarea
                    label="Bio"
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={4}
                    placeholder="Tell us about yourself..."
                  />
                  <div className="flex gap-md">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      <Save size={16} />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      <X size={16} />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-h3 uppercase mb-lg">Recent Activity</h2>
                  {isLoadingTournaments ? (
                    <div className="text-center py-xl">
                      <div className="w-8 h-8 border-2 border-neutral-300 border-t-primary-black rounded-full animate-spin mx-auto mb-md" />
                      <p className="text-neutral-500">Loading...</p>
                    </div>
                  ) : allTournaments.length === 0 ? (
                    <EmptyState
                      icon={Trophy}
                      title="No tournaments yet"
                      description="Join a tournament to start competing!"
                      actionLabel="Browse Tournaments"
                      onAction={() => window.location.href = '/'}
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                      {allTournaments.slice(0, 4).map((tournament) => (
                        <Link key={tournament.id} to={`/tournament/${tournament.id}`}>
                          <Card className="p-md border border-neutral-200 hover:border-neutral-400 transition-colors">
                            <div className="flex items-start justify-between">
                              <div>
                                <span className="text-xs text-neutral-500 uppercase tracking-wide">
                                  {tournament.game}
                                </span>
                                <h3 className="text-sm font-medium mt-1">{tournament.name}</h3>
                                <p className="text-xs text-neutral-500 mt-2">
                                  {formatDate(tournament.start_date)}
                                </p>
                              </div>
                              <StatusBadge status={tournament.status} />
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tournaments' && (
            <div>
              <h2 className="text-h3 uppercase mb-lg">My Tournaments</h2>
              
              {isLoadingTournaments ? (
                <div className="text-center py-xl">
                  <div className="w-8 h-8 border-2 border-neutral-300 border-t-primary-black rounded-full animate-spin mx-auto mb-md" />
                  <p className="text-neutral-500">Loading...</p>
                </div>
              ) : (
                <>
                  {userTournaments.created.length > 0 && (
                    <div className="mb-xl">
                      <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-md">Created</h3>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeader>Tournament</TableHeader>
                            <TableHeader>Game</TableHeader>
                            <TableHeader>Date</TableHeader>
                            <TableHeader>Participants</TableHeader>
                            <TableHeader>Status</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userTournaments.created.map((tournament) => (
                            <TableRow
                              key={tournament.id}
                              onClick={() => window.location.href = `/tournament/${tournament.id}`}
                            >
                              <TableCell className="font-medium">{tournament.name}</TableCell>
                              <TableCell>{tournament.game}</TableCell>
                              <TableCell>{formatDate(tournament.start_date)}</TableCell>
                              <TableCell>{tournament.current_participants}/{tournament.max_participants}</TableCell>
                              <TableCell><StatusBadge status={tournament.status} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {userTournaments.joined.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-md">Joined</h3>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableHeader>Tournament</TableHeader>
                            <TableHeader>Game</TableHeader>
                            <TableHeader>Date</TableHeader>
                            <TableHeader>Status</TableHeader>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {userTournaments.joined.map((tournament) => (
                            <TableRow
                              key={tournament.id}
                              onClick={() => window.location.href = `/tournament/${tournament.id}`}
                            >
                              <TableCell className="font-medium">{tournament.name}</TableCell>
                              <TableCell>{tournament.game}</TableCell>
                              <TableCell>{formatDate(tournament.start_date)}</TableCell>
                              <TableCell><StatusBadge status={tournament.status} /></TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}

                  {userTournaments.created.length === 0 && userTournaments.joined.length === 0 && (
                    <EmptyState
                      icon={Trophy}
                      title="No tournaments"
                      description="You haven't joined or created any tournaments yet."
                      actionLabel="Browse Tournaments"
                      onAction={() => window.location.href = '/'}
                    />
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div>
              <h2 className="text-h3 uppercase mb-lg">Match History</h2>
              <EmptyState
                icon={Calendar}
                title="No match history"
                description="Your completed matches will appear here."
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-lg">
              <h2 className="text-h3 uppercase mb-lg">Account Settings</h2>
              
              <div className="space-y-xl">
                <div className="border border-neutral-200 p-lg">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-md">
                    Email Address
                  </h3>
                  <p className="text-sm">{user.email}</p>
                </div>

                <div className="border border-neutral-200 p-lg">
                  <h3 className="text-xs uppercase tracking-widest text-neutral-500 mb-md">
                    Change Password
                  </h3>
                  <Button variant="secondary" size="sm">Update Password</Button>
                </div>

                <div className="border border-semantic-error/20 p-lg">
                  <h3 className="text-xs uppercase tracking-widest text-semantic-error mb-md">
                    Danger Zone
                  </h3>
                  <p className="text-sm text-neutral-500 mb-md">
                    Once you delete your account, there is no going back.
                  </p>
                  <Button variant="secondary" size="sm" className="border-semantic-error text-semantic-error hover:bg-semantic-error hover:text-primary-white">
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

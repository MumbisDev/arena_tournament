import { Search, X, Filter } from 'lucide-react';
import { Select } from '../ui/Input';
import { useTournamentStore } from '../../store/tournamentStore';
import { GAMES_LIST } from '../../lib/constants';

export function TournamentFilters() {
  const { filters, setFilter, resetFilters } = useTournamentStore();

  const hasActiveFilters = 
    filters.search || 
    filters.game || 
    filters.platform !== 'all' || 
    filters.region !== 'all' || 
    filters.status !== 'all';

  const gameOptions = [
    { value: '', label: 'All Games' },
    ...GAMES_LIST.map((game) => ({ value: game, label: game })),
  ];

  const platformOptions = [
    { value: 'all', label: 'All Platforms' },
    { value: 'pc', label: 'PC' },
    { value: 'playstation', label: 'PlayStation' },
    { value: 'xbox', label: 'Xbox' },
    { value: 'nintendo', label: 'Nintendo' },
    { value: 'mobile', label: 'Mobile' },
    { value: 'cross-platform', label: 'Cross-Platform' },
  ];

  const regionOptions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north-america', label: 'North America' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'south-america', label: 'South America' },
    { value: 'global', label: 'Global' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="bg-brutal-white border-3 border-brutal-black" style={{ boxShadow: '4px 4px 0px 0px #0A0A0A' }}>
      {/* Header */}
      <div className="px-md py-sm bg-brutal-black text-brutal-white flex items-center gap-3">
        <Filter size={14} className="text-brutal-vermillion" />
        <span className="font-mono text-mono-xs uppercase tracking-widest">
          Filters {hasActiveFilters && <span className="text-brutal-vermillion ml-2">• Active</span>}
        </span>
      </div>

      <div className="p-lg">
        {/* Search */}
        <div className="relative mb-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tournaments..."
            value={filters.search}
            onChange={(e) => setFilter('search', e.target.value)}
            className="w-full bg-brutal-cream border-3 border-brutal-black pl-12 pr-4 py-3 font-mono text-sm placeholder:text-neutral-400 focus:outline-none transition-all"
            style={{
              boxShadow: filters.search ? '2px 2px 0px 0px #D93025' : 'none',
            }}
          />
        </div>

        {/* Filter dropdowns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
          <Select
            options={gameOptions}
            value={filters.game}
            onChange={(e) => setFilter('game', e.target.value)}
          />
          <Select
            options={platformOptions}
            value={filters.platform}
            onChange={(e) => setFilter('platform', e.target.value)}
          />
          <Select
            options={regionOptions}
            value={filters.region}
            onChange={(e) => setFilter('region', e.target.value)}
          />
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(e) => setFilter('status', e.target.value)}
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="mt-md flex items-center gap-2 font-mono text-mono-xs uppercase tracking-widest text-neutral-500 hover:text-brutal-vermillion transition-colors group"
          >
            <X size={14} className="group-hover:rotate-90 transition-transform" />
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}

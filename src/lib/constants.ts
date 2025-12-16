// Games list - can be fetched from Supabase or use static list
export const GAMES_LIST = [
  'Valorant',
  'League of Legends',
  'Street Fighter 6',
  'Call of Duty',
  'Rocket League',
  'Mobile Legends',
  'Counter-Strike 2',
  'Dota 2',
  'Fortnite',
  'Apex Legends',
  'Overwatch 2',
  'Super Smash Bros',
] as const;

export type GameName = (typeof GAMES_LIST)[number];

// Platform options
export const PLATFORMS = [
  { value: 'pc', label: 'PC' },
  { value: 'playstation', label: 'PlayStation' },
  { value: 'xbox', label: 'Xbox' },
  { value: 'nintendo', label: 'Nintendo' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'cross-platform', label: 'Cross-Platform' },
] as const;

// Region options
export const REGIONS = [
  { value: 'north-america', label: 'North America' },
  { value: 'europe', label: 'Europe' },
  { value: 'asia', label: 'Asia' },
  { value: 'oceania', label: 'Oceania' },
  { value: 'south-america', label: 'South America' },
  { value: 'global', label: 'Global' },
] as const;

// Tournament format options
export const FORMATS = [
  { value: 'single-elimination', label: 'Single Elimination' },
  { value: 'double-elimination', label: 'Double Elimination' },
  { value: 'round-robin', label: 'Round Robin' },
] as const;

// Tournament status options
export const STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'live', label: 'Live' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
] as const;


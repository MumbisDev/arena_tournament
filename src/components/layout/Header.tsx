import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Trophy, LayoutDashboard, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../ui/Button';

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-[72px] bg-brutal-black border-b-4 border-brutal-vermillion z-50">
      <div className="h-full max-w-container mx-auto px-lg flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 bg-brutal-vermillion border-2 border-brutal-white flex items-center justify-center">
            <span className="font-display text-2xl text-brutal-white">A</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-display text-2xl text-brutal-white tracking-wider glitch-text">
              ARENA
            </span>
            <span className="font-mono text-[9px] text-brutal-vermillion tracking-[0.3em] -mt-1">
              TOURNAMENT
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-4 py-2 font-mono text-mono-xs text-brutal-white uppercase tracking-widest hover:bg-brutal-vermillion transition-colors border-r border-neutral-700"
          >
            Discover
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="px-4 py-2 font-mono text-mono-xs text-brutal-white uppercase tracking-widest hover:bg-brutal-vermillion transition-colors border-r border-neutral-700"
            >
              Dashboard
            </Link>
          )}
          <span className="px-4 py-2 font-mono text-mono-xs text-neutral-500 uppercase tracking-widest border-r border-neutral-700">
            2025.12
          </span>
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-3 px-3 py-2 bg-neutral-800 border-2 border-neutral-600 hover:border-brutal-vermillion transition-colors"
              >
                <div className="w-7 h-7 bg-brutal-vermillion border-2 border-brutal-white overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-full h-full p-1 text-brutal-white" />
                  )}
                </div>
                <span className="font-mono text-mono-xs text-brutal-white uppercase tracking-wider">
                  {user?.username}
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-brutal-white border-3 border-brutal-black shadow-brutal">
                  <div className="px-4 py-3 border-b-3 border-brutal-black bg-brutal-cream">
                    <span className="font-mono text-mono-xs text-neutral-500 uppercase tracking-widest">
                      Logged in as
                    </span>
                    <p className="font-mono text-sm text-brutal-black mt-1">{user?.email}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-mono text-mono-xs uppercase tracking-wider hover:bg-brutal-vermillion hover:text-brutal-white transition-colors border-b border-neutral-200"
                  >
                    <User size={14} />
                    Profile
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-mono text-mono-xs uppercase tracking-wider hover:bg-brutal-vermillion hover:text-brutal-white transition-colors border-b border-neutral-200"
                  >
                    <LayoutDashboard size={14} />
                    Dashboard
                  </Link>
                  {(user?.role === 'organizer' || user?.role === 'admin') && (
                    <Link
                      to="/create-tournament"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 font-mono text-mono-xs uppercase tracking-wider hover:bg-brutal-vermillion hover:text-brutal-white transition-colors border-b border-neutral-200"
                    >
                      <Trophy size={14} />
                      Create Tournament
                    </Link>
                  )}
                  <Link
                    to="/profile/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 font-mono text-mono-xs uppercase tracking-wider hover:bg-brutal-vermillion hover:text-brutal-white transition-colors border-b border-neutral-200"
                  >
                    <Settings size={14} />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 font-mono text-mono-xs uppercase tracking-wider hover:bg-brutal-black hover:text-brutal-white transition-colors w-full text-left text-brutal-vermillion"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-brutal-white border-2 border-neutral-600 hover:border-brutal-vermillion transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 right-0 bg-brutal-black border-b-4 border-brutal-vermillion">
          <nav className="flex flex-col">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-lg py-4 font-mono text-mono-sm text-brutal-white uppercase tracking-widest border-b border-neutral-700 hover:bg-brutal-vermillion transition-colors"
            >
              <span className="text-brutal-vermillion mr-2">&gt;</span> Discover
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-lg py-4 font-mono text-mono-sm text-brutal-white uppercase tracking-widest border-b border-neutral-700 hover:bg-brutal-vermillion transition-colors"
                >
                  <span className="text-brutal-vermillion mr-2">&gt;</span> Dashboard
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-lg py-4 font-mono text-mono-sm text-brutal-white uppercase tracking-widest border-b border-neutral-700 hover:bg-brutal-vermillion transition-colors"
                >
                  <span className="text-brutal-vermillion mr-2">&gt;</span> Profile
                </Link>
                {(user?.role === 'organizer' || user?.role === 'admin') && (
                  <Link
                    to="/create-tournament"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-lg py-4 font-mono text-mono-sm text-brutal-white uppercase tracking-widest border-b border-neutral-700 hover:bg-brutal-vermillion transition-colors"
                  >
                    <span className="text-brutal-vermillion mr-2">&gt;</span> Create Tournament
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-lg py-4 font-mono text-mono-sm text-brutal-vermillion uppercase tracking-widest text-left hover:bg-brutal-vermillion hover:text-brutal-white transition-colors"
                >
                  <span className="mr-2">&gt;</span> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-lg py-4 font-mono text-mono-sm text-brutal-white uppercase tracking-widest border-b border-neutral-700 hover:bg-brutal-vermillion transition-colors"
                >
                  <span className="text-brutal-vermillion mr-2">&gt;</span> Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-lg py-4 font-mono text-mono-sm text-brutal-white uppercase tracking-widest border-b border-neutral-700 hover:bg-brutal-vermillion transition-colors"
                >
                  <span className="text-brutal-vermillion mr-2">&gt;</span> Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

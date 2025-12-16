import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuthStore();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const result = await register(username, email, password);
    setIsLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual */}
      <div className="hidden lg:flex flex-1 bg-brutal-black relative overflow-hidden items-center justify-center">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
        
        {/* Large display text */}
        <div className="relative z-10 text-center p-xl">
          <div className="font-display text-[200px] text-brutal-white/5 leading-none select-none">
            +
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-brutal-vermillion border-4 border-brutal-white flex items-center justify-center mb-lg">
              <span className="font-display text-5xl text-brutal-white">A</span>
            </div>
            <h2 className="font-display text-4xl text-brutal-white uppercase mb-md tracking-wider">
              Begin
            </h2>
            <p className="font-mono text-sm text-brutal-vermillion tracking-widest uppercase">
              New Challenge
            </p>
            <p className="font-mono text-mono-xs text-neutral-500 mt-lg max-w-xs text-center leading-relaxed">
              Create your account and join the competitive gaming community today.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-4 border-t-4 border-brutal-vermillion" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-4 border-b-4 border-brutal-vermillion" />
        <div className="absolute top-1/2 right-8 transform -translate-y-1/2 rotate-90">
          <span className="font-mono text-mono-xs text-neutral-600 uppercase tracking-[0.5em]">
            New Player
          </span>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-lg bg-brutal-cream relative">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(10, 10, 10, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(10, 10, 10, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px',
          }}
        />
        
        <div className="w-full max-w-md relative z-10">
          {/* Logo */}
          <div className="mb-xl">
            <Link to="/" className="flex items-center gap-3 mb-lg group">
              <div className="w-12 h-12 bg-brutal-black border-3 border-brutal-black flex items-center justify-center group-hover:bg-brutal-vermillion transition-colors">
                <span className="font-display text-2xl text-brutal-white">A</span>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl text-brutal-black tracking-wider glitch-text">
                  ARENA
                </span>
                <span className="font-mono text-[9px] text-brutal-vermillion tracking-[0.3em] -mt-1">
                  TOURNAMENT
                </span>
              </div>
            </Link>
          </div>

          {/* Form card */}
          <div className="bg-brutal-white border-3 border-brutal-black p-xl" style={{ boxShadow: '8px 8px 0px 0px #0A0A0A' }}>
            {/* Header */}
            <div className="mb-xl border-b-3 border-brutal-black pb-lg">
              <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-[0.3em] block mb-2">
                // New Account
              </span>
              <h1 className="font-display text-4xl uppercase text-brutal-black">
                Register
              </h1>
              <p className="font-mono text-mono-sm text-neutral-500 mt-2">
                Join the tournament platform
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-md">
              {error && (
                <div className="bg-brutal-vermillion/10 border-3 border-brutal-vermillion px-4 py-3">
                  <span className="font-mono text-mono-xs text-brutal-vermillion uppercase tracking-wider">
                    ! Error: {error}
                  </span>
                </div>
              )}

              <Input
                label="Username"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <label className="flex items-start gap-3 cursor-pointer group pt-2">
                <div className="w-5 h-5 border-2 border-brutal-black flex items-center justify-center bg-brutal-white group-hover:border-brutal-vermillion transition-colors mt-0.5">
                  <input type="checkbox" className="sr-only peer" required />
                  <span className="hidden peer-checked:block text-brutal-vermillion font-bold">✓</span>
                </div>
                <span className="font-mono text-mono-xs text-neutral-600 leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>

              <Button type="submit" className="w-full" isLoading={isLoading} size="lg">
                Create Account →
              </Button>
            </form>

            <p className="mt-lg text-center font-mono text-mono-sm text-neutral-500">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-brutal-black font-bold hover:text-brutal-vermillion transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

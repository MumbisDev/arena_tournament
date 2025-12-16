import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, ArrowLeft, Mail } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-lg bg-neutral-100">
      <div className="w-full max-w-md bg-primary-white p-xl">
        <div className="text-center mb-xl">
          <Link to="/" className="inline-flex items-center gap-3 mb-lg">
            <Trophy className="w-8 h-8" />
            <span className="text-2xl font-light tracking-[0.2em] uppercase">Arena</span>
          </Link>
          
          {isSubmitted ? (
            <>
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-md">
                <Mail className="w-8 h-8 text-semantic-success" />
              </div>
              <h1 className="text-h3 uppercase mb-2">Check Your Email</h1>
              <p className="text-neutral-500 text-sm">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-h2 uppercase mb-2">Reset Password</h1>
              <p className="text-neutral-500 text-sm">
                Enter your email and we'll send you a reset link
              </p>
            </>
          )}
        </div>

        {isSubmitted ? (
          <div className="space-y-lg">
            <p className="text-sm text-neutral-500 text-center">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Try Another Email
            </Button>
            <Link to="/login" className="block">
              <Button variant="text" className="w-full">
                <ArrowLeft size={16} />
                Back to Login
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-lg">
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Send Reset Link
            </Button>

            <Link to="/login" className="block">
              <Button variant="text" className="w-full">
                <ArrowLeft size={16} />
                Back to Login
              </Button>
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}


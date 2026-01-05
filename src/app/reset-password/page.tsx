"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { resetPassword } from '@/app/login/actions';
import { Loader2, CheckCircle, XCircle, Eye, EyeOff, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

// Toast notification component
function Toast({ 
  message, 
  type, 
  onClose 
}: { 
  message: string; 
  type: 'success' | 'error' | 'info'; 
  onClose: () => void;
}) {
  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg shadow-2xl border backdrop-blur-sm",
      "transform transition-all duration-300 ease-out animate-in slide-in-from-right",
      type === 'success' && "bg-green-500/20 border-green-500/40 text-green-300",
      type === 'error' && "bg-red-500/20 border-red-500/40 text-red-300",
      type === 'info' && "bg-blue-500/20 border-blue-500/40 text-blue-300",
    )}>
      {type === 'success' && <CheckCircle className="w-5 h-5" />}
      {type === 'error' && <XCircle className="w-5 h-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}

function checkPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const passwordStrength = checkPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  useEffect(() => {
    // Check if we have a valid recovery session
    // The session is set by Supabase when clicking the reset link
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (!accessToken && type !== 'recovery') {
      // No recovery token in URL, check if we have an active session
      // This is a simplified check - in production you'd verify the session
      setIsValidSession(true); // Allow form to show, server will validate
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      showToast('Please enter a new password', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await resetPassword(password);
      
      if (result.error) {
        showToast(result.error, 'error');
        setIsLoading(false);
      } else {
        showToast('🔐 Password updated successfully!', 'success');
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  if (!isValidSession) {
    return (
      <PageWrapper>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md p-8 space-y-6 glass text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <Typography as="h2" variant="headline">
              Invalid or Expired Link
            </Typography>
            <Typography variant="body" className="text-muted-foreground text-sm">
              This password reset link has expired or is invalid. Please request a new one.
            </Typography>
            <Link href="/forgot-password">
              <Button className="w-full" variant="primary">
                Request New Link
              </Button>
            </Link>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
      
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 glass">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <Typography as="h2" variant="headline" className="text-glow-green">
              Set New Password
            </Typography>
            <Typography variant="body" className="text-muted-foreground text-sm">
              Enter your new password below.
            </Typography>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium leading-none">
                New Password
              </label>
              <div className="relative">
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? "text" : "password"}
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              <div className="flex gap-1 mt-2">
                {[0, 1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      i < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-muted"
                    )}
                  />
                ))}
              </div>
              {password.length > 0 && (
                <p className={cn(
                  "text-xs mt-1",
                  passwordStrength >= 3 ? "text-green-500" : passwordStrength >= 2 ? "text-yellow-500" : "text-red-500"
                )}>
                  {strengthLabels[passwordStrength - 1] || 'Too weak'} password
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                Confirm Password
              </label>
              <div className="relative">
                <input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showConfirmPassword ? "text" : "password"}
                  required 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full" 
              variant="primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </form>
        </Card>
      </div>
    </PageWrapper>
  );
}

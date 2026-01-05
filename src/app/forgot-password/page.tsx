"use client";

import { useState } from 'react';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { forgotPassword } from '@/app/login/actions';
import { Loader2, CheckCircle, XCircle, Mail, ArrowLeft, KeyRound } from 'lucide-react';
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
      {type === 'info' && <Mail className="w-5 h-5" />}
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <XCircle className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const startCountdown = () => {
    setCountdown(60);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showToast('Please enter your email address', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await forgotPassword(email);
      
      if (result.error) {
        showToast(result.error, 'error');
        setIsLoading(false);
      } else {
        showToast('📧 Reset link sent! Check your inbox.', 'success');
        setEmailSent(true);
        startCountdown();
        setIsLoading(false);
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const result = await forgotPassword(email);
      if (result.error) {
        showToast(result.error, 'error');
      } else {
        showToast('📧 Reset link resent!', 'success');
        startCountdown();
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

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
          {!emailSent ? (
            <>
              {/* Request Form */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <KeyRound className="w-8 h-8 text-primary" />
                </div>
                <Typography as="h2" variant="headline" className="text-glow-green">
                  Forgot your password?
                </Typography>
                <Typography variant="body" className="text-muted-foreground text-sm">
                  No worries! Enter your email and we&apos;ll send you a reset link.
                </Typography>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none">
                    Email Address
                  </label>
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="you@example.com"
                  />
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
                      Sending...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <Mail className="w-8 h-8 text-green-500" />
                </div>
                <Typography as="h2" variant="headline" className="text-glow-green">
                  Check your email 📬
                </Typography>
                <Typography variant="body" className="text-muted-foreground text-sm">
                  We&apos;ve sent a password reset link to<br />
                  <span className="text-foreground font-medium">{email}</span>
                </Typography>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Didn&apos;t receive the email?</strong>
                </p>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1 list-disc list-inside">
                  <li>Check your spam or junk folder</li>
                  <li>Make sure you entered the correct email</li>
                  <li>Wait a few minutes and try again</li>
                </ul>
              </div>

              {countdown > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Resend available in <span className="text-primary font-bold">{countdown}</span>s
                </p>
              )}

              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full" variant="primary">
                    Back to Login
                  </Button>
                </Link>
                <Button 
                  type="button"
                  onClick={handleResend}
                  disabled={countdown > 0 || isLoading}
                  className="w-full" 
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Resend email'
                  )}
                </Button>
                <button 
                  onClick={() => { setEmailSent(false); setEmail(''); }}
                  className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Try a different email
                </button>
              </div>
            </>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

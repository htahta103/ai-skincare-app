"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Typography } from '@/components/ui/typography';
import { signupWithCredentials, signInWithGoogle, resendConfirmationEmail } from '@/app/login/actions';
import { Loader2, CheckCircle, XCircle, Mail, Eye, EyeOff } from 'lucide-react';
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

function checkPasswordStrength(password: string): number {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;
  return Math.min(strength, 4);
}

// Google Icon Component
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 4.63c1.69 0 3.26.58 4.54 1.8l3.29-3.29C17.9 1.25 15.22 0 12 0 7.7 0 3.99 2.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const passwordStrength = checkPasswordStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

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
    
    if (!fullName || !email || !password) {
      showToast('Please fill in all fields', 'error');
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
      const result = await signupWithCredentials(email, password, fullName);
      
      if (result.error) {
        showToast(result.error, 'error');
        setIsLoading(false);
      } else if (result.needsConfirmation) {
        showToast('🎉 Account created! Please check your email.', 'success');
        setEmailSent(true);
        startCountdown();
        setIsLoading(false);
      } else if (result.success && result.redirect) {
        showToast('🔥 Welcome to ROAST! Redirecting...', 'success');
        setTimeout(() => {
          router.push(result.redirect!);
          router.refresh();
        }, 500);
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) {
        showToast(result.error, 'error');
        setIsGoogleLoading(false);
      } else if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      showToast('Google sign-in failed. Please try again.', 'error');
      setIsGoogleLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    
    setIsLoading(true);
    try {
      const result = await resendConfirmationEmail(email);
      if (result.error) {
        showToast(result.error, 'error');
      } else {
        showToast('📧 Confirmation email resent!', 'success');
        startCountdown();
      }
    } catch {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const anyLoading = isLoading || isGoogleLoading;

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
              {/* Signup Form */}
              <div className="text-center space-y-2">
                <Typography as="h2" variant="headline" className="text-glow-green">
                  Join the ROAST fam 🔥
                </Typography>
                <Typography variant="body" className="text-muted-foreground text-sm">
                  Create your account and start your skincare journey.
                </Typography>
              </div>

              {/* Google Auth Button */}
              <Button 
                type="button"
                onClick={handleGoogleSignup}
                disabled={anyLoading}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <GoogleIcon />
                )}
                Continue with Google
              </Button>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative bg-card px-3 text-sm text-muted-foreground">or</div>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium leading-none">
                    Full Name
                  </label>
                  <input 
                    id="fullName" 
                    name="fullName" 
                    type="text" 
                    required 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={anyLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="Enter your name"
                  />
                </div>

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
                    disabled={anyLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none">
                    Password
                  </label>
                  <div className="relative">
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"}
                      required 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={anyLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      placeholder="Create a password"
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
                  <p className={cn(
                    "text-xs",
                    password.length === 0 ? "text-muted-foreground" :
                    passwordStrength >= 3 ? "text-green-500" : 
                    passwordStrength >= 2 ? "text-yellow-500" : "text-red-500"
                  )}>
                    {password.length === 0 ? 'Must be at least 8 characters' : 
                     strengthLabels[passwordStrength - 1] || 'Too weak'}
                  </p>
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
                      disabled={anyLoading}
                      className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                      placeholder="Confirm your password"
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
                  disabled={anyLoading}
                  className="w-full" 
                  variant="primary"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                By creating an account, you agree to our{' '}
                <Link href="/terms" className="text-foreground font-medium hover:underline">Terms</Link> and{' '}
                <Link href="/privacy" className="text-foreground font-medium hover:underline">Privacy Policy</Link>.
              </p>

              <div className="text-center border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-bold hover:underline">Log in</Link>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Email Confirmation Success */}
              <div className="text-center space-y-2">
                <div className="w-20 h-20 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <Typography as="h2" variant="headline" className="text-glow-green">
                  Check your inbox! 📬
                </Typography>
                <Typography variant="body" className="text-muted-foreground text-sm">
                  We&apos;ve sent a confirmation link to<br />
                  <span className="text-foreground font-medium">{email}</span>
                </Typography>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm font-medium text-foreground mb-2">Next steps:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open the email we just sent you</li>
                  <li>Click the confirmation link</li>
                  <li>Start your skincare journey!</li>
                </ol>
              </div>

              {countdown > 0 && (
                <p className="text-center text-sm text-muted-foreground">
                  Resend available in <span className="text-primary font-bold">{countdown}</span>s
                </p>
              )}

              <div className="space-y-3">
                <Link href="/login">
                  <Button className="w-full" variant="primary">
                    Go to Login
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
                    'Resend confirmation email'
                  )}
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                Didn&apos;t receive it? Check your spam folder or{' '}
                <button 
                  onClick={() => setEmailSent(false)}
                  className="text-primary font-medium hover:underline"
                >
                  try a different email
                </button>
              </p>
            </>
          )}
        </Card>
      </div>
    </PageWrapper>
  );
}

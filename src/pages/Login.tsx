import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/auth/LoadingScreen';

let acbuLogoSrc: string | null = null;
try {
  acbuLogoSrc = new URL('../assets/logo.png', import.meta.url).href;
} catch {
  acbuLogoSrc = null;
}

const Login = () => {
  const navigate = useNavigate();
  const { user, signInWithGoogle, loading: authLoading, error: authError } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If user is already logged in, redirect to survey
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/survey', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleContinue = async () => {
    setError(null);
    setIsSigningIn(true);

    try {
      await signInWithGoogle();
      // Don't navigate - auth state change will handle routing
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Sign-in failed';
      setError(errorMsg);
    } finally {
      setIsSigningIn(false);
    }
  };

  if (authLoading) {
    return <LoadingScreen message="Verifying your account..." />;
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-primary/20 shrink-0">
        <div className="container-narrow h-14 flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div
            className="bg-card rounded-xl border border-border/50 p-6"
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(107, 15, 26, 0.1)"
            }}
          >
            {/* Logo */}
            <div className="text-center mb-6">
              {acbuLogoSrc ? (
                <img src={acbuLogoSrc} alt="ACBU Logo" className="h-16 w-auto mx-auto mb-3" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-maroon/10 flex items-center justify-center mx-auto mb-3">
                  <span className="text-maroon font-bold">ACBU</span>
                </div>
              )}
              <h1 className="text-xl font-semibold text-primary mb-1">
                Participant Verification
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in with your Google account to continue
              </p>
            </div>

            {/* Gold Divider */}
            <div className="gold-divider !my-6" />

            {/* Error Display */}
            {(error || authError) && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                <p className="font-semibold">Sign-in Failed</p>
                <p>{error || authError}</p>
              </div>
            )}

            {/* Continue Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 font-medium border-border hover:bg-gray-50 text-base"
              onClick={handleContinue}
              disabled={isSigningIn || authLoading}
            >
              {isSigningIn || authLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {/* Google Icon */}
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* Note */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              Click continue to start the survey. You'll be authenticated securely using Google.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center shrink-0">
        <p className="text-xs text-muted-foreground">
          Sandeshaya – Ananda College Broadcasting Unit
        </p>
      </footer>
    </div>
  );
};

export default Login;

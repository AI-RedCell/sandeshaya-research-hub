import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Import ACBU logo safely
let acbuLogoSrc: string | null = null;
try {
  acbuLogoSrc = new URL('../assets/logo.png', import.meta.url).href;
} catch {
  acbuLogoSrc = null;
}

const Login = () => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const { signInWithGoogle, user, loading, hasSubmitted } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      console.log("✓ User detected, redirecting...", { hasSubmitted });
      if (hasSubmitted) {
        navigate('/submitted', { replace: true });
      } else {
        navigate('/survey', { replace: true });
      }
    }
  }, [user, loading, hasSubmitted, navigate]);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      await signInWithGoogle();
      // Navigation will happen automatically via useEffect when user state updates
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed. Please try again.";
      
      // Check if it's a popup blocked error
      if (errorMessage.includes('popup') || errorMessage.includes('blocked')) {
        setGoogleError("Popup was blocked! Please allow popups for this site in your browser settings, then try again.");
      } else {
        setGoogleError(errorMessage);
      }
      setIsGoogleLoading(false);
    }
  };

  // Show loading if auth is still initializing
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-maroon" />
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex flex-col">
      {/* Simple Header */}
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
          {/* Card - Elegant 3D Effect */}
          <div
            className="bg-card rounded-xl border border-border/50 p-6"
            style={{
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 10px 20px -5px rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(107, 15, 26, 0.1)"
            }}
          >
            {/* ACBU Logo */}
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
                Enter your details to continue
              </p>
            </div>

            {/* Gold Divider */}
            <div className="gold-divider !my-6" />

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 font-medium border-border hover:bg-gray-50 text-base"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {/* Official Google "G" Icon */}
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            {/* Google Error Message */}
            {googleError && (
              <p className="text-xs text-red-500 text-center mt-3">
                {googleError}
              </p>
            )}

            {/* Note */}
            <p className="text-xs text-muted-foreground text-center mt-6">
              Use your Google account for secure access.
              <br />No password required.
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

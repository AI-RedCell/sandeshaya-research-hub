import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, User, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

// Import ACBU logo safely
let acbuLogoSrc: string | null = null;
try {
  acbuLogoSrc = new URL('../assets/logo.png', import.meta.url).href;
} catch {
  acbuLogoSrc = null;
}

const Login = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
  const { sendEmailLink, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setGoogleError(null);
    try {
      await signInWithGoogle();
      // Redirect is handled in signInWithGoogle
    } catch (error: unknown) {
      console.error("Google sign-in error:", error);
      const errorMessage = error instanceof Error ? error.message : "Google sign-in failed. Please try again.";
      setGoogleError(errorMessage);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName.trim() || !formData.email.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both your full name and email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await sendEmailLink(formData.email, formData.fullName);
      setEmailSent(true);
      toast({
        title: "Verification Email Sent",
        description: "Please check your email inbox and click the verification link to continue.",
      });
    } catch (error: unknown) {
      console.error("Error sending email link:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send verification email. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
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

        {/* Email Sent Confirmation */}
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="bg-card rounded-lg border border-border shadow-sm p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="p-3 rounded-full bg-accent/10">
                  <CheckCircle2 className="w-10 h-10 text-accent" />
                </div>
              </div>
              
              <h1 className="text-xl font-semibold text-primary mb-3">
                Check Your Email
              </h1>
              
              <p className="text-sm text-muted-foreground mb-4">
                We've sent a verification link to:
              </p>
              
              <p className="font-medium text-foreground mb-4 bg-secondary/50 py-2 px-3 rounded text-sm">
                {formData.email}
              </p>
              
              <p className="text-xs text-muted-foreground mb-6">
                Click the link in the email to continue. 
                The link expires in 24 hours.
              </p>

              <Button
                variant="outline"
                onClick={() => setEmailSent(false)}
                className="w-full"
                size="sm"
              >
                Use a different email
              </Button>
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
            <div className="text-center mb-4">
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
            <div className="gold-divider !my-4" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-foreground text-sm">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    className="pl-10 h-10"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-foreground text-sm">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10 h-10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="default" 
                className="w-full bg-maroon hover:bg-maroon/90 text-white h-10 font-medium"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-10 font-medium border-border hover:bg-gray-50"
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
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
              <p className="text-xs text-red-500 text-center mt-2">
                {googleError}
              </p>
            )}

            {/* Note */}
            <p className="text-xs text-muted-foreground text-center mt-4">
              A verification email will be sent to your address.
              No password required.
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

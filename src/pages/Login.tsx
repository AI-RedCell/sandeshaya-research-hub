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
  const { sendEmailLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

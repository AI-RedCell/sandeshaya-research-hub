import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isSignInWithEmailLink } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import LoadingScreen from '@/components/auth/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, userData, loading, hasSubmitted, isEmailLinkSignIn } = useAuth();
  const location = useLocation();
  
  // Check if we're in the middle of email link sign-in
  const isEmailLink = isSignInWithEmailLink(auth, window.location.href);

  // Show loading while auth state is being determined OR during email link sign-in
  if (loading || isEmailLinkSignIn || isEmailLink) {
    return <LoadingScreen message={isEmailLink ? "Verifying your email..." : "Loading..."} />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If already submitted, redirect to submitted page
  if (hasSubmitted) {
    return <Navigate to="/submitted" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;


import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, userData, loading, hasSubmitted } = useAuth();
  const location = useLocation();

  // Debug logging
  console.log("🛡️ ProtectedRoute check:", {
    loading,
    hasUser: !!user,
    userEmail: user?.email,
    hasSubmitted,
    currentPath: location.pathname
  });

  // Show loading while auth state is being determined
  if (loading) {
    return <LoadingScreen message="Verifying access..." />;
  }

  // If not authenticated, redirect to login
  if (!user) {
    console.log("🛡️ No user found, redirecting to login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If already submitted, redirect to submitted page
  if (hasSubmitted) {
    console.log("🛡️ User already submitted, redirecting to submitted page");
    return <Navigate to="/submitted" replace />;
  }

  console.log("🛡️ Access granted to:", location.pathname);
  return <>{children}</>;
};

export default ProtectedRoute;


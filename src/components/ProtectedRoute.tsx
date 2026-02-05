import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingScreen from '@/components/auth/LoadingScreen';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, userData, loading, hasSubmitted } = useAuth();
  const location = useLocation();



  // Show loading while auth state is being determined
  if (loading) {
    return <LoadingScreen message="Verifying access..." />;
  }

  // If not authenticated, redirect to login
  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If already submitted, redirect to submitted page
  // If already submitted, redirect to submitted page
  if (hasSubmitted) {
    return <Navigate to="/submitted" replace />;
  }


  return <>{children}</>;
};

export default ProtectedRoute;


import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStore } from './sessionStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session, initialized } = useSessionStore();
  const location = useLocation();
  console.log(session);
  console.log(initialized);
  // if (!session.isAuthenticated) {
  //   return (
  //       <div className="min-h-screen flex items-center justify-center" >
  //           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
  //       </div>
  //   );
  // }

  if (!session.isAuthenticated) {
    // Redirect to login while saving the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

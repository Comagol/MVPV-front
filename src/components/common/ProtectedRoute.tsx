import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  //mostrar loading mientras se verifica la autenticacion
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  //si no esta authenticado lo redirijo al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }

  //si esta autenticado, renderizo el componente hijo
  return <>{children}</>;
};
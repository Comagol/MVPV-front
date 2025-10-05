import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box } from '@chakra-ui/react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

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
  return (
    <Box  minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box w="100%" flex="1">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
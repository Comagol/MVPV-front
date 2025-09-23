import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
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
    <Box minH="100vh" bg="gray.50" w="100%">
      <Navbar />
      <Box w="100%" minH="calc(100vh - 120px)">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
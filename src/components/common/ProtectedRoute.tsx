import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Box, Spinner } from '@chakra-ui/react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <Box 
        minH="100vh" 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        bg="bg-primary"
      >
        <Spinner size="xl" color="button-primary" />
      </Box>
    );
  }

  // Si no está autenticado lo redirijo al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace/>
  }

  // Si está autenticado, renderizo el componente hijo
  return (
    <Box minH="100vh" display="flex" flexDirection="column" bg="bg-primary">
      <Navbar />
      <Box w="100%" flex="1">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
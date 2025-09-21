import { Box, Flex, Heading, Button, HStack, Image, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="blue.600" color="white" px={4} py={3} shadow="md">
      <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
        {/* Logo y nombre de la app */}
        <HStack gap={4}>
          <Box w="40px" h="40px" rounded="full" display="flex" alignItems="center" justifyContent="center">
            <Image src="/favicon.png" alt="Logo" w="40px" h="40px" />
          </Box>
          
          <Heading size="md" color="white">
            Rugby MVP Voting
          </Heading>
          
          <Text fontSize="sm" color="blue.100">
            {isAdmin ? 'Panel Admin' : 'Usuario'}
          </Text>
        </HStack>

        {/* Navegación */}
        <HStack gap={4}>
          {isAdmin ? (
            // Opciones para Admin
            <>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "blue.500" }}
                onClick={() => navigate('/admin/players')}
              >
                Cargar Jugadores
              </Button>
              
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "blue.500" }}
                onClick={() => navigate('/admin/matches')}
              >
                Gestionar Partidos
              </Button>
            </>
          ) : (
            // Opciones para Usuario normal
            <Button
              variant="ghost"
              color="white"
              _hover={{ bg: "blue.500" }}
              onClick={() => navigate('/vote')}
            >
              Votar Jugador del Partido
            </Button>
          )}
          
          <Button
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
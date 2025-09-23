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
      <Flex justify="space-between" align="center" w="100%" mx="auto">
        {/* Logo y nombre de la app */}
        <HStack gap={4}>
          <Box w="40px" h="40px" rounded="full" display="flex" alignItems="center" justifyContent="center">
            <Image src="/favicon.png" alt="Logo" w="40px" h="40px" />
          </Box>
          
          {/* Ocultar en móviles, mostrar en tablets y desktop */}
          <Heading 
            size="md" 
            color="white"
            display={{ base: "none", md: "block" }}
          >
            Rugby MVP Voting
          </Heading>
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
                display={{ base: "none", sm: "flex" }}
              >
                Cargar Jugadores
              </Button>
              
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: "blue.500" }}
                onClick={() => navigate('/admin/matches')}
                display={{ base: "none", sm: "flex" }}
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
              display={{ base: "none", sm: "flex" }}
            >
              Votar Jugador del Partido
            </Button>
          )}
          
          <Button
            variant="outline"
            colorScheme="whiteAlpha"
            onClick={handleLogout}
            size={{ base: "sm", md: "md" }}
          >
            Cerrar Sesión
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
import { Box, Flex, Heading, Button, HStack, Image} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box bg="bg-header" color="text-white" px={4} py={3} shadow="md">
      <Flex justify="space-between" align="center" w="100%" mx="auto">
        {/* Logo y nombre de la app */}
        <HStack gap={4}>
          <Box w="40px" h="40px" rounded="full" display="flex" alignItems="center" justifyContent="center">
            <Image src="/favicon.png" alt="Logo" w="40px" h="40px" />
          </Box>
          
          <Heading 
            size="md" 
            color="text-white"
            display={{ base: "none", md: "block" }}
          >
            VICENTINOS MVP
          </Heading>
        </HStack>

        {/* Navegación */}
        <HStack gap={4}>
          {isAdmin ? (
            <>
              <Button
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                onClick={() => navigate('/admin/players')}
                display={{ base: "none", sm: "flex" }}
              >
                Cargar Jugadores
              </Button>
              
              <Button
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                onClick={() => navigate('/admin/matches')}
                display={{ base: "none", sm: "flex" }}
              >
                Gestionar Partidos
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              color="text-white"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              onClick={() => navigate('/vote')}
              display={{ base: "none", sm: "flex" }}
            >
              Votar Jugador del Partido
            </Button>
          )}
          
          <Button
            variant="outline"
            borderColor="text-white"
            color="text-white"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
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
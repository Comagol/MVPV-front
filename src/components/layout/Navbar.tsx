import { Box, Flex, Heading, Button, HStack, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleVoteClick = () => {
    navigate('/vote');
  };

  return (
    <Box bg="blue.600" color="white" px={4} py={3} shadow="md">
      <Flex justify="space-between" align="center" maxW="7xl" mx="auto">
        {/* Logo y nombre de la app */}
        <HStack gap={4}>
          {/* Logo del club */}
          <Box w="40px" h="40px"  rounded="full" display="flex" alignItems="center" justifyContent="center">
            <Image src="/favicon.png" alt="Logo" w="40px" h="40px" />
          </Box>
          
          <Heading size="md" color="white">
            Rugby MVP Voting
          </Heading>
        </HStack>

        {/* Navegación */}
        <HStack gap={4}>
          <Button
            variant="ghost"
            color="white"
            _hover={{ bg: "blue.500" }}
            onClick={handleVoteClick}
          >
            Votar Jugador del Partido
          </Button>
          
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
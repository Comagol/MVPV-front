import { 
  Box, 
  Flex, 
  Heading, 
  Button, 
  HStack, 
  Image, 
  IconButton, 
  VStack, 
  Collapsible,
  useDisclosure,
  useBreakpointValue
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { open: isMenuOpen, onToggle } = useDisclosure();
  
  // Detectar si estamos en mobile
  const isMobile = useBreakpointValue({ base: true, lg: false });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    // Cerrar el menú móvil después de navegar
    if (isMobile && isMenuOpen) {
      onToggle();
    }
  };

  return (
    <Box bg="bg-header" color="text-white" shadow="md">
      {/* Navbar Principal */}
      <Flex justify="space-between" align="center" px={4} py={3} w="100%" mx="auto">
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

        {/* Desktop Navigation */}
        <HStack gap={4} display={{ base: "none", md: "flex" }}>
          {isAdmin ? (
            <>
              <Button
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                size="sm"
                onClick={() => handleNavigation('/admin/players')}
              >
                Cargar Jugadores
              </Button>
              
              <Button
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                size="sm"
                onClick={() => handleNavigation('/admin/matches')}
              >
                Gestionar Partidos
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                size="sm"
                onClick={() => handleNavigation('/vote')}
              >
                Votar Jugador del Partido
              </Button>
              
              <Button
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                size="sm"
                onClick={() => handleNavigation('/vote-history')}
              >
                Mi Historial
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            borderColor="text-white"
            color="text-white"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            onClick={handleLogout}
            size="sm"
          >
            Cerrar Sesión
          </Button>
        </HStack>

        {/* Mobile Menu Button */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          onClick={onToggle}
          variant="ghost"
          color="text-white"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </IconButton>
      </Flex>

      {/* Mobile Menu */}
      <Collapsible.Root open={isMenuOpen}>
        <Collapsible.Content>
          <Box
            bg="bg-header"
            px={4}
            pb={4}
            display={{ base: "block", md: "none" }}
            borderTop="1px solid"
            borderColor="rgba(255,255,255,0.1)"
          >
            <VStack gap={2} align="stretch">
              {isAdmin ? (
                <>
                  <Button
                    variant="ghost"
                    color="text-white"
                    _hover={{ bg: "rgba(255,255,255,0.1)" }}
                    size="sm"
                    justifyContent="flex-start"
                    onClick={() => handleNavigation('/admin/players')}
                  >
                    Cargar Jugadores
                  </Button>
                  
                  <Button
                    variant="ghost"
                    color="text-white"
                    _hover={{ bg: "rgba(255,255,255,0.1)" }}
                    size="sm"
                    justifyContent="flex-start"
                    onClick={() => handleNavigation('/admin/matches')}
                  >
                    Gestionar Partidos
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    color="text-white"
                    _hover={{ bg: "rgba(255,255,255,0.1)" }}
                    size="sm"
                    justifyContent="flex-start"
                    onClick={() => handleNavigation('/vote')}
                  >
                    Votar Jugador del Partido
                  </Button>
                  
                  <Button
                    variant="ghost"
                    color="text-white"
                    _hover={{ bg: "rgba(255,255,255,0.1)" }}
                    size="sm"
                    justifyContent="flex-start"
                    onClick={() => handleNavigation('/vote-history')}
                  >
                    Mi Historial
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                borderColor="text-white"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                onClick={handleLogout}
                size="sm"
                justifyContent="flex-start"
              >
                Cerrar Sesión
              </Button>
            </VStack>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
};

export default Navbar;
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
  console.log('=== HANDLE NAVIGATION START ===');
  console.log('Navigating to:', path);
  console.log('isMobile:', isMobile);
  console.log('isMenuOpen:', isMenuOpen);
    navigate(path);
    // Cerrar el menú móvil después de navegar
    if (isMobile && isMenuOpen) {
      onToggle();
    }
  };

  // Componente para los botones de navegación
  const NavigationButtons = () => {
    console.log('NavigationButtons rendering, isAdmin:', isAdmin);
    
    return (
      <>
        {isAdmin ? (
          <>
            <Button
              variant="ghost"
              color="text-white"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              size="sm"
              onClick={() =>{console.log('Cargar Jugadores clicked'); handleNavigation('/admin/players')}}
            >
              Cargar Jugadores
            </Button>
            
            <Button
              variant="ghost"
              color="text-white"
              _hover={{ bg: "rgba(255,255,255,0.1)" }}
              size="sm"
              onClick={() =>{console.log('Gestionar Partidos clicked'); handleNavigation('/admin/matches')}}
            >
              Gestionar Partidos
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            color="text-white"
            _hover={{ bg: "rgba(255,255,255,0.1)" }}
            size="sm"
            onClick={() =>{console.log('Votar Jugador del Partido clicked'); handleNavigation('/vote')}}
          >
            Votar Jugador del Partido
          </Button>
        )}
        
        <Button
          variant="outline"
          borderColor="text-white"
          color="text-white"
          _hover={{ bg: "rgba(255,255,255,0.1)" }}
          onClick={() =>{console.log('Cerrar Sesión clicked'); handleLogout()}}
          size="sm"
        >
          Cerrar Sesión
        </Button>
      </>
    );
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
          <NavigationButtons />
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
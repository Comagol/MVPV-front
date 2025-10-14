import { Box, Flex, HStack, VStack, Text, Link, IconButton, Image } from '@chakra-ui/react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box bg="bg-header" color="text-white" py={8} px={4}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
            maxW={{ base: "full", md: "7xl" }}
        mx="auto"
        gap={6}
      >
        {/* Logo de la app */}
        <VStack align={{ base: 'center', md: 'flex-start' }} gap={2}>
          <HStack gap={2}>
            <Box w="32px" h="32px" rounded="full" display="flex" alignItems="center" justifyContent="center">
              <Image src="/favicon.png" alt="Logo" w="32px" h="32px" />
            </Box>
            <Text fontSize="lg" fontWeight="bold" color="text-white">VICENTINOS MVP</Text>
          </HStack>
          <Text fontSize="sm" color="text-white" opacity={0.8} textAlign={{ base: 'center', md: 'left' }}>
            Sistema de votación para el mejor jugador del partido
          </Text>
        </VStack>

        {/* Redes sociales */}
        <VStack align="center" gap={3}>
          <Text fontSize="sm" fontWeight="semibold" color="text-white" opacity={0.9}>
            Síguenos en nuestras redes sociales
          </Text>
          <HStack gap={3}>
            <Link href="https://www.facebook.com/ClubVicentinos" target="_blank">
              <IconButton
                aria-label="Facebook"
                size="lg"
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                <FaFacebook />
              </IconButton>
            </Link>
            <Link href="https://www.instagram.com/clubvicentinos" target="_blank">
              <IconButton
                aria-label="Instagram"
                size="lg"
                variant="ghost"
                color="text-white"
                _hover={{ bg: "rgba(255,255,255,0.1)", transform: "scale(1.1)" }}
                transition="all 0.2s"
              >
                <FaInstagram />
              </IconButton>
            </Link>
          </HStack>
        </VStack>

        {/* Copyright */}
        <VStack align={{ base: 'center', md: 'flex-end' }} gap={1}>
          <Text fontSize="sm" color="text-white" opacity={0.8}>
            © {new Date().getFullYear()} MVP Vicentinos
          </Text>
          <Text fontSize="xs" color="text-white" opacity={0.6}>
            Todos los derechos reservados
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Footer;
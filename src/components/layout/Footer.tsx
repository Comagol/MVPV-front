import { Box, Flex, HStack, VStack, Text, Link, IconButton, Image } from '@chakra-ui/react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box bg="gray.800" color="white" py={8} px={4}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="space-between"
        align="center"
        maxW="7xl"
        mx="auto"
        gap={6}
      >
        {/* Logo de la app */}
        <VStack align={{ base: 'center', md: 'flex-start' }} gap={2}>
          <HStack gap={2}>
            <Box w="32px" h="32px"  rounded="full" display="flex" alignItems="center" justifyContent="center">
              <Image src="/favicon.png" alt="Logo" w="32px" h="32px" />
            </Box>
            <Text fontSize="lg" fontWeight="bold">Rugby MVP Voting</Text>
          </HStack>
          <Text fontSize="sm" color="gray.400" textAlign={{ base: 'center', md: 'left' }}>
            Sistema de votación para el mejor jugador del partido
          </Text>
        </VStack>

        {/* Redes sociales */}
        <VStack align="center" gap={3}>
          <Text fontSize="sm" fontWeight="semibold" color="gray.300">
            Síguenos en nuestras redes sociales
          </Text>
          <HStack gap={3}>
            <Link href="https://www.facebook.com/ClubVicentinos" target="_blank">
            <IconButton
              aria-label="Facebook"
              size="lg"
              colorScheme="facebook"
              variant="ghost"
              _hover={{ bg: "facebook.500", transform: "scale(1.1)", color: "blue.500" }}
              transition="all 0.2s"
              color="white"
              >
              <FaFacebook />
            </IconButton>
            </Link>
            <Link href="https://www.instagram.com/clubvicentinos" target="_blank">
            <IconButton
              aria-label="Instagram"
              size="lg"
              colorScheme="pink"
              variant="ghost"
              _hover={{ bg: "facebook.500", transform: "scale(1.1)", color: "pink.500" }}
              transition="all 0.2s"
              color="white"
              >
              <FaInstagram />
            </IconButton>
            </Link>
          </HStack>
        </VStack>

        {/* Copyright */}
        <VStack align={{ base: 'center', md: 'flex-end' }} gap={1}>
          <Text fontSize="sm" color="gray.400">
            © {new Date().getFullYear()} MVP Vicentinos
          </Text>
          <Text fontSize="xs" color="gray.500">
            Todos los derechos reservados
          </Text>
        </VStack>
      </Flex>
    </Box>
  );
};

export default Footer;
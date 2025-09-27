
import { Box, VStack, Heading, Text, Grid, Image } from '@chakra-ui/react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
  category: 'main' | 'secondary' | 'support';
}

const sponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Cando',
    logo: '/Cando.png',
    website: 'https://cando.com.ar',
    category: 'main'
  },
  {
    id: '2',
    name: 'Alori Estudio',
    logo: '/Alori.png',
    website: 'https://aloriestudio.com',
    category: 'secondary'
  },
  {
    id: '3',
    name: 'Checho Sandwicheria',
    logo: '/Checho.png',
    website: 'https://chechosandwicheria.com',
    category: 'support'
  },
  {
    id: '4',
    name: 'Leon Cars',
    logo: '/LeonCars.png',
    website: 'https://leoncars.com',
    category: 'support'
  },
  {
    id: '5',
    name: 'Seib Natatorios',
    logo: '/Seib.png',
    website: 'https://salsaysalsa.com',
    category: 'support'
  }
];

const Sponsors = () => {
  const mainSponsors = sponsors.filter(s => s.category === 'main');
  const secondarySponsors = sponsors.filter(s => s.category === 'secondary');
  const supportSponsors = sponsors.filter(s => s.category === 'support');

  return (
    <Box w="full" bg="white" p={6} rounded="lg" shadow="md">
      <VStack gap={6}>
        <Heading size="lg" textAlign="center" color="blue.600">
          🏆 Nuestros Sponsors
        </Heading>
        
        <Text textAlign="center" color="gray.600" fontSize="md">
          Gracias a nuestros sponsors que hacen posible este evento
        </Text>

        {/* Sponsors principales */}
        {mainSponsors.length > 0 && (
          <Box w="full">
            <Heading size="md" mb={4} textAlign="center" color="blue.500">
              Sponsors Principales
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
              {mainSponsors.map((sponsor) => (
                <Box
                  key={sponsor.id}
                  p={4}
                  bg="blue.50"
                  rounded="lg"
                  border="2px solid"
                  borderColor="blue.200"
                  textAlign="center"
                  _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
                >
                  <Image
                    src={'/Cando.png'}
                    alt={sponsor.name}
                    boxSize="120px"
                    mx="auto"
                    mb={3}
                    objectFit="contain"
                  />
                  <Text fontWeight="bold" color="blue.700">
                    {sponsor.name}
                  </Text>
                  {sponsor.website && (
                    <Text fontSize="sm" color="blue.500" mt={1}>
                      {sponsor.website}
                    </Text>
                  )}
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        {/* Sponsors secundarios */}
        {secondarySponsors.length > 0 && (
          <Box w="full">
            <Heading size="md" mb={4} textAlign="center" color="green.500">
              Sponsors Secundarios
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={3}>
              {secondarySponsors.map((sponsor) => (
                <Box
                  key={sponsor.id}
                  p={3}
                  bg="green.50"
                  rounded="md"
                  border="1px solid"
                  borderColor="green.200"
                  textAlign="center"
                  _hover={{ transform: 'scale(1.03)', transition: 'transform 0.2s' }}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    boxSize="80px"
                    mx="auto"
                    mb={2}
                    objectFit="contain"
                  />
                  <Text fontSize="sm" fontWeight="medium" color="green.700">
                    {sponsor.name}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        {/* Sponsors de apoyo */}
        {supportSponsors.length > 0 && (
          <Box w="full">
            <Heading size="md" mb={4} textAlign="center" color="gray.500">
              Con el Apoyo de
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={2}>
              {supportSponsors.map((sponsor) => (
                <Box
                  key={sponsor.id}
                  p={2}
                  bg="gray.50"
                  rounded="md"
                  textAlign="center"
                  _hover={{ transform: 'scale(1.02)', transition: 'transform 0.2s' }}
                >
                  <Image
                    src={sponsor.logo}
                    alt={sponsor.name}
                    boxSize="60px"
                    mx="auto"
                    mb={1}
                    objectFit="contain"
                  />
                  <Text fontSize="xs" color="gray.600">
                    {sponsor.name}
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        {/* Mensaje de agradecimiento */}
        <Box p={4} bg="yellow.50" rounded="md" border="1px solid" borderColor="yellow.200" w="full">
          <Text textAlign="center" color="yellow.800" fontSize="sm">
            💙 Gracias a todos nuestros sponsors por apoyar el rugby y hacer posible este evento
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sponsors;
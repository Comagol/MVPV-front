import { Box, VStack, Heading, Text, Grid, Image } from '@chakra-ui/react';

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

const sponsors: Sponsor[] = [
  {
    id: '1',
    name: 'Cando',
    logo: '/Cando.png',
    website: 'https://cando.com.ar'
  },
  {
    id: '2',
    name: 'Checho Sandwicheria',
    logo: '/Checho.png',
    website: 'https://checho.com'
  },
  {
    id: '3',
    name: 'Leon Cars',
    logo: '/LeonCars.png',
    website: 'https://leon-cars.com'
  },
  {
    id: '4',
    name: 'Seib Natatorios',
    logo: '/SeibLogo.png',
    website: 'https://seib.com'
  },
  {
    id: '5',
    name: 'Alori Estudio',
    logo: '/Alori.png',
    website: 'https://alori.com'
  }
];

const Sponsors = () => {
  return (
    <Box w="full" bg="white" p={6} rounded="lg" shadow="md">
      <VStack gap={6}>
        <Heading size="lg" textAlign="center" color="blue.600">
          Nuestros Sponsors del Partido
        </Heading>
        
        <Text textAlign="center" color="gray.600" fontSize="md">
          Gracias a nuestros sponsors que hacen posible este evento
        </Text>

        {/* Todos los sponsors en una sola sección */}
        <Box w="full">
          <Heading size="md" mb={4} textAlign="center" color="gray.500">
            Con el Apoyo de
          </Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
            {sponsors.map((sponsor) => (
              <Box
                key={sponsor.id}
                p={4}
                bg="gray.50"
                rounded="md"
                border="1px solid"
                borderColor="gray.200"
                textAlign="center"
                _hover={{ transform: 'scale(1.03)', transition: 'transform 0.2s' }}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  boxSize="80px"
                  mx="auto"
                  mb={3}
                  objectFit="contain"
                />
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  {sponsor.name}
                </Text>
                {sponsor.website && (
                  <Text fontSize="xs" color="gray.500" mt={1}>
                    {sponsor.website}
                  </Text>
                )}
              </Box>
            ))}
          </Grid>
        </Box>

        {/* Mensaje de agradecimiento */}
        <Box p={4} bg="yellow.50" rounded="md" border="1px solid" borderColor="yellow.200" w="full">
          <Text textAlign="center" color="yellow.800" fontSize="sm">
            💙 Gracias a todos nuestros sponsors por apoyar al club
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default Sponsors;
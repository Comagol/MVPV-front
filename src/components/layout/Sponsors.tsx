import { VStack, Text, Grid, Image } from '@chakra-ui/react';
import { Card } from '../ui';

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
    <VStack gap={4} align="center">
      <Text fontSize="sm" color="text-secondary" textAlign="center">
        con nuestros sponsors
      </Text>
      
      <Grid 
        templateColumns={{ 
          base: "repeat(2, 1fr)", 
          sm: "repeat(3, 1fr)", 
          md: "repeat(5, 1fr)" 
        }} 
        gap={4}
        w="full"
        maxW={{ base: "full", md: "700px" }}
      >
        {sponsors.map((sponsor) => (
          <Card
            key={sponsor.id}
            variant="outlined"
            p={4}
            textAlign="center"
            borderColor="border-light"
            bg="bg-card"
            _hover={{ 
              transform: 'scale(1.05)', 
              shadow: 'md',
              transition: 'all 0.2s' 
            }}
            minH="120px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
          >
            <Image
              src={sponsor.logo}
              alt={sponsor.name}
              boxSize="70px"
              mx="auto"
              mb={3}
              objectFit="contain"
            />
            <Text fontSize="sm" fontWeight="medium" color="text-primary">
              {sponsor.name}
            </Text>
          </Card>
        ))}
      </Grid>
    </VStack>
  );
};

export default Sponsors;
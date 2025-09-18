import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { playerService } from '../../services';
import type { PlayerResponse } from '../../types';

const PlayersPage = () => {
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const data = await playerService.getAllPlayers();
      setPlayers(data); 
      console.log('Jugadores cargados:', data);
    } catch (err: any) {
      console.error('Error cargando jugadores:', err);
      setError('Error al cargar jugadores');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box maxW="7xl" mx="auto" py={8} px={4}>
        <Text>Cargando jugadores...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW="7xl" mx="auto" py={8} px={4}>
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box maxW="7xl" mx="auto" py={8} px={4}>
      <VStack gap={6} align="stretch">
        <Heading size="lg">Gestión de Jugadores</Heading>
        
        <Text>Total de jugadores: {players?.length || 0}</Text>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {players.map((player) => (
            <Box 
              key={player.id}
              bg="white"
              p={4}
              rounded="lg"
              shadow="md"
              borderWidth="1px"
            >
              <VStack align="start" gap={2}>
                <Text fontWeight="bold" fontSize="lg">
                  #{player.camiseta} - {player.nombre}
                </Text>
                <Text color="gray.600">"{player.apodo}"</Text>
                <Text fontSize="sm">{player.posicion}</Text>
                <Text fontSize="sm" color="gray.500">
                  Camada: {player.camada}
                </Text>
                <Text fontSize="sm" color={player.activo ? "green.500" : "red.500"}>
                  {player.activo ? "Activo" : "Inactivo"}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {players.length === 0 && (
          <Text textAlign="center" color="gray.500">
            No hay jugadores registrados
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default PlayersPage;
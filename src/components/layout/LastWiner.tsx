import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Badge,
  HStack,
  Spinner
} from '@chakra-ui/react';
import { useMatches } from '../../hooks/useMatches';
import { voteService } from '../../services/voteService';
import { useState, useEffect } from 'react';
import type { VoteStatistics } from '../../types';

const LastWiner = () => {
  const { lastFinishedMatch, isLoading: matchLoading } = useMatches();
  const [winner, setWinner] = useState<VoteStatistics | null>(null);
  const [isLoadingWinner, setIsLoadingWinner] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWinner = async () => {
      console.log('🔍 LastWiner: lastFinishedMatch recibido:', lastFinishedMatch);
      if (!lastFinishedMatch) {
        console.log('❌ LastWiner: No hay lastFinishedMatch disponible');
        return;
      }

      setIsLoadingWinner(true);
      setError(null);
      
      try {
        console.log('📡 LastWiner: Solicitando ganador para match ID:', lastFinishedMatch.id);
        const winnerData = await voteService.getMatchWinner(lastFinishedMatch.id);
        console.log('✅ LastWiner: Ganador recibido:', winnerData);
        setWinner(winnerData);
      } catch (err: any) {
        console.error('❌ LastWiner: Error al obtener ganador:', err);
        setError(err.message || 'Error al cargar el ganador');
      } finally {
        setIsLoadingWinner(false);
      }
    };

    fetchWinner();
  }, [lastFinishedMatch]);

  if (matchLoading || isLoadingWinner) {
    return (
      <Box minH="200px" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Spinner size="lg" />
          <Text>Cargando último ganador...</Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        p={4} 
        bg="red.50" 
        border="1px solid" 
        borderColor="red.200" 
        rounded="lg"
        color="red.700"
      >
        <HStack gap={2}>
          <Text fontSize="sm" fontWeight="bold">⚠️</Text>
          <Text fontSize="sm">{error}</Text>
        </HStack>
      </Box>
    );
  }

  if (!lastFinishedMatch || !winner) {
    return (
      <Box minH="200px" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Heading size="md" color="gray.500">
            No hay partidos anteriores
          </Heading>
          <Text color="gray.400">
            Aún no se han completado partidos para mostrar resultados.
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      p={8}
      bg="white"
      rounded="xl"
      shadow="lg"
      border="1px solid"
      borderColor="gray.200"
      maxW="2xl"
      mx="auto"
    >
      <VStack gap={6} align="stretch">
        {/* Header del partido */}
        <Box textAlign="center">
          <Heading size="lg" mb={2} color="blue.600">
            🏆 Último Ganador
          </Heading>
          <Badge colorScheme="blue" fontSize="md" px={3} py={1} rounded="full">
            Partido Finalizado
          </Badge>
        </Box>

        {/* Línea separadora personalizada */}
        <Box h="1px" bg="gray.200" w="100%" />

        {/* Información del partido */}
        <Box textAlign="center">
          <Text fontSize="lg" fontWeight="semibold" color="gray.700">
            vs {lastFinishedMatch.rival}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {new Date(lastFinishedMatch.fecha).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Box>

        {/* Línea separadora personalizada */}
        <Box h="1px" bg="gray.200" w="100%" />

        {/* Información del ganador */}
        <VStack gap={4}>
          <Text fontSize="xl" fontWeight="bold" color="gold">
            🥇 Jugador del Partido
          </Text>
          
          <Image
            src={winner.playerImagen || "/placeholder-player.jpg"}
            alt={winner.playerName}
            boxSize="150px"
            borderRadius="full"
            objectFit="cover"
            border="4px solid"
            borderColor="gold"
          />
          
          <VStack gap={2}>
            <Heading size="lg" color="gray.800">
              {winner.playerName}
            </Heading>
            
            <HStack gap={4} fontSize="lg">
              <Badge colorScheme="green" px={3} py={1} rounded="full">
                {winner.totalVotos} votos
              </Badge>
              <Badge colorScheme="purple" px={3} py={1} rounded="full">
                {winner.porcentaje.toFixed(1)}%
              </Badge>
            </HStack>
          </VStack>
        </VStack>

        {/* Mensaje motivacional */}
        <Box textAlign="center" p={4} bg="blue.50" rounded="lg">
          <Text fontSize="sm" color="blue.700" fontStyle="italic">
            "¡Felicitaciones al jugador destacado de este partido! 🎉"
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};

export default LastWiner;
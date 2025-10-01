import {
  Box,
  VStack,
  Heading,
  Text,
  Image,
  Badge,
  HStack,
  Spinner,
  Skeleton,
  SkeletonCircle,
  SkeletonText
} from '@chakra-ui/react';
import { useMatches } from '../../hooks/useMatches';
import { voteService } from '../../services/voteService';
import { useState, useEffect, useCallback } from 'react';
import type { VoteStatistics } from '../../types';

const LastWiner = () => {
  const { lastFinishedMatch, isLoading: matchLoading } = useMatches();
  const [winner, setWinner] = useState<VoteStatistics | null>(null);
  const [isLoadingWinner, setIsLoadingWinner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);

  const fetchWinner = useCallback(async (matchId: string) => {
    setIsLoadingWinner(true);
    setError(null);

    try {
      const winnerData = await voteService.getMatchWinner(matchId);
      setWinner(winnerData);
    } catch (err: any) {
      console.error('Error fetching winner:', err);
      setError(err.response?.data?.message || err.message || 'Error al obtener el ganador');
    } finally {
      setIsLoadingWinner(false);
    }
  }, []);

  useEffect(() => {
    if (lastFinishedMatch?.id) {
      fetchWinner(lastFinishedMatch.id);
    }
  }, [lastFinishedMatch?.id, fetchWinner]);

  // Track if we've completed the initial loading
  useEffect(() => {
    if (!matchLoading && !isLoadingWinner) {
      setHasInitiallyLoaded(true);
    }
  }, [matchLoading, isLoadingWinner]);

  // Show skeleton loading during initial load
  if (!hasInitiallyLoaded) {
    return <SkeletonLoader />;
  }

  // Show error state
  if (error) {
    return (
      <Box 
        p={6} 
        bg="red.50" 
        border="1px solid" 
        borderColor="red.200" 
        rounded="lg"
        color="red.700"
        maxW="2xl"
        mx="auto"
      >
        <HStack gap={3}>
          <Text fontSize="lg" fontWeight="bold">⚠️</Text>
          <VStack align="start" gap={1}>
            <Text fontSize="md" fontWeight="semibold">Error al cargar datos</Text>
            <Text fontSize="sm">{error}</Text>
          </VStack>
        </HStack>
      </Box>
    );
  }

  // Show "no matches" message only after we've confirmed there are no matches
  if (!lastFinishedMatch || !winner) {
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
        textAlign="center"
      >
        <VStack gap={4}>
          <Box fontSize="6xl">🏈</Box>
          <Heading size="md" color="gray.500">
            No hay partidos anteriores
          </Heading>
          <Text color="gray.400" maxW="md">
            Aún no se han completado partidos para mostrar resultados. 
            ¡Pronto podrás ver quién fue el jugador destacado!
          </Text>
        </VStack>
      </Box>
    );
  }

  // Show the winner data
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
            {winner.playerApodo && (
              <Text fontSize="md" color="gray.600" fontStyle="italic">
                "{winner.playerApodo}"
              </Text>
            )}
            
            <HStack gap={4} fontSize="lg">
              <Badge colorScheme="green" px={3} py={1} rounded="full">
                {winner.totalVotos} votos
              </Badge>
              {winner.porcentaje && (
                <Badge colorScheme="purple" px={3} py={1} rounded="full">
                  {winner.porcentaje.toFixed(1)}%
                </Badge>
              )}
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

// Skeleton loader component
const SkeletonLoader = () => (
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
      {/* Header skeleton */}
      <Box textAlign="center">
        <Skeleton height="32px" width="200px" mx="auto" mb={2} />
        <Skeleton height="24px" width="150px" mx="auto" />
      </Box>

      {/* Separator */}
      <Box h="1px" bg="gray.200" w="100%" />

      {/* Match info skeleton */}
      <Box textAlign="center">
        <Skeleton height="24px" width="180px" mx="auto" mb={2} />
        <Skeleton height="16px" width="220px" mx="auto" />
      </Box>

      {/* Separator */}
      <Box h="1px" bg="gray.200" w="100%" />

      {/* Winner info skeleton */}
      <VStack gap={4}>
        <Skeleton height="28px" width="160px" mx="auto" />
        
        <SkeletonCircle size="150px" />
        
        <VStack gap={2}>
          <Skeleton height="28px" width="200px" />
          <Skeleton height="20px" width="120px" />
          
          <HStack gap={4}>
            <Skeleton height="24px" width="80px" />
            <Skeleton height="24px" width="60px" />
          </HStack>
        </VStack>
      </VStack>

      {/* Message skeleton */}
      <Box textAlign="center" p={4} bg="blue.50" rounded="lg">
        <Skeleton height="16px" width="300px" mx="auto" />
      </Box>
    </VStack>
  </Box>
);

export default LastWiner;
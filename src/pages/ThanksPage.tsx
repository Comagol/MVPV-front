import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Grid,
  Image,
  Badge,
  Spinner
} from '@chakra-ui/react';
import { useAuth } from '../hooks/useAuth';
import { useMatches } from '../hooks/useMatches';
import { useVoting } from '../hooks/useVoting';
import type { PlayerResponse } from '../types';

const ThanksPage = () => {
  const { user, logout } = useAuth();
  const { activeMatches, isLoading: matchesLoading } = useMatches();
  const { getMatchStats, getMatchWinner, getTotalVotes, isLoading: votingLoading } = useVoting();
  const [matchStats, setMatchStats] = useState<any>(null);
  const [winner, setWinner] = useState<PlayerResponse | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Obtener el partido activo
  const activeMatch = activeMatches?.[0] || null;

  useEffect(() => {
    const loadVotingData = async () => {
      if (activeMatch) {
        try {
          const [stats, winnerData, total] = await Promise.all([
            getMatchStats(activeMatch.id),
            getMatchWinner(activeMatch.id),
            getTotalVotes(activeMatch.id)
          ]);
          
          setMatchStats(stats);
          setWinner(winnerData);
          setTotalVotes(total);
        } catch (err) {
          setError('Error al cargar datos de votación');
        }
      }
    };
    loadVotingData();
  }, [activeMatch?.id]);

  if (matchesLoading || votingLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!activeMatch) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Heading>No hay partidos activos</Heading>
          <Text>No hay partidos disponibles en este momento.</Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" p={4}>
      <VStack gap={8} maxW="6xl" mx="auto">
        {/* Header de agradecimiento */}
        <Box w="full" textAlign="center">
          <Heading size="xl" mb={4} color="green.600">
            ¡Gracias por tu voto!
          </Heading>
          <Text fontSize="lg" color="gray.600" mb={2}>
            {activeMatch.rival} - {new Date(activeMatch.fecha).toLocaleDateString()}
          </Text>
          <Text fontSize="md" color="gray.500">
            {user?.nombre}, tu voto ha sido registrado exitosamente
          </Text>
        </Box>

        {/* Error message */}
        {error && (
          <Box p={4} bg="red.100" color="red.700" rounded="md" w="full">
            {error}
          </Box>
        )}

        {/* Estadísticas generales */}
        <Box w="full" bg="white" p={6} rounded="lg" shadow="md">
          <Heading size="md" mb={4} textAlign="center">
            Estadísticas del Partido
          </Heading>
          <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={4}>
            <Box textAlign="center" p={4} bg="blue.50" rounded="md">
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {totalVotes}
              </Text>
              <Text color="gray.600">Total de Votos</Text>
            </Box>
            <Box textAlign="center" p={4} bg="green.50" rounded="md">
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {activeMatch.jugadores.length}
              </Text>
              <Text color="gray.600">Jugadores</Text>
            </Box>
          </Grid>
        </Box>

        {/* Top 3 jugadores */}
        {matchStats && (
          <Box w="full" bg="white" p={6} rounded="lg" shadow="md">
            <Heading size="md" mb={4} textAlign="center">
              Top 3 Jugadores
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
              {matchStats.slice(0, 3).map((player: any, index: number) => (
                <Box
                  key={player._id}
                  p={4}
                  bg={index === 0 ? "yellow.50" : index === 1 ? "gray.50" : "orange.50"}
                  rounded="lg"
                  border={index === 0 ? "2px solid" : "1px solid"}
                  borderColor={index === 0 ? "yellow.400" : "gray.200"}
                  textAlign="center"
                >
                  <Badge
                    colorScheme={index === 0 ? "yellow" : index === 1 ? "gray" : "orange"}
                    mb={2}
                    fontSize="sm"
                  >
                    #{index + 1}
                  </Badge>
                  <Image
                    src={player.imagen || "/placeholder-player.jpg"}
                    alt={player.nombre}
                    boxSize="80px"
                    mx="auto"
                    mb={3}
                    borderRadius="full"
                    objectFit="cover"
                  />
                  <Heading size="sm" mb={1}>
                    {player.nombre}
                  </Heading>
                  <Text color="gray.600" fontSize="sm" mb={2}>
                    {player.apodo}
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    {player.votes || 0} votos
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        {/* Ganador destacado */}
        {winner && (
          <Box w="full" bg="green.50" p={6} rounded="lg" shadow="md" border="2px solid" borderColor="green.200">
            <Heading size="lg" mb={4} textAlign="center" color="green.700">
              🏆 Jugador del Partido ��
            </Heading>
            <Box textAlign="center">
              <Image
                src={winner.imagen || "/placeholder-player.jpg"}
                alt={winner.nombre}
                boxSize="120px"
                mx="auto"
                mb={4}
                borderRadius="full"
                objectFit="cover"
              />
              <Heading size="md" mb={2} color="green.700">
                {winner.nombre}
              </Heading>
              <Text color="gray.600" mb={2}>
                {winner.apodo}
              </Text>
              <Badge colorScheme="green" mb={2}>
                {winner.posicion}
              </Badge>
              <Text fontSize="lg" fontWeight="bold" color="green.600">
                Camiseta #{winner.camiseta}
              </Text>
            </Box>
          </Box>
        )}

        {/* Botones de acción */}
        <VStack gap={4} w="full">
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => navigate('/vote')}
            w="full"
            maxW="300px"
          >
            Volver a Votar
          </Button>
          
          <Button
            variant="outline"
            onClick={logout}
            w="full"
            maxW="300px"
          >
            Cerrar Sesión
          </Button>
        </VStack>
      </VStack>
    </Box>
  );
};

export default ThanksPage;
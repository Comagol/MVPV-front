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
import type { VoteStatistics } from '../types/vote';

const ThanksPage = () => {
  const { user, logout } = useAuth();
  const { activeMatches, isLoading: matchesLoading } = useMatches();
  const { getMatchStats, getTotalVotes, isLoading: votingLoading } = useVoting();
  const [matchStats, setMatchStats] = useState<VoteStatistics[]>([]);
  const [winner, setWinner] = useState<VoteStatistics | null>(null);
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  
  const navigate = useNavigate();

  // Obtener el partido activo
  const activeMatch = activeMatches?.[0] || null;

  useEffect(() => {
    const loadVotingData = async () => {
      if (activeMatch) {
        try {
          console.log('🔍 Iniciando carga de datos para match:', activeMatch.id);
          
          // Solo cargar stats (que funciona) y total votes
          const [stats, total] = await Promise.all([
            getMatchStats(activeMatch.id),
            getTotalVotes(activeMatch.id)
          ]);
          
          console.log('�� Stats del backend:', stats);
          console.log('🔍 Total votos del backend:', total);
          
          setMatchStats(stats);
          setTotalVotes(total);
          
          // Calcular el ganador desde las stats en lugar de usar el endpoint
          if (stats.length > 0) {
            const winner = stats.reduce((prev, current) => 
              (prev.totalVotos > current.totalVotos) ? prev : current
            );
            setWinner(winner);
            console.log('🔍 Ganador calculado:', winner);
          }
          
          setDataLoaded(true);
          console.log('�� Estado actualizado - matchStats:', stats);
          console.log('🔍 Estado actualizado - totalVotes:', total);
          
        } catch (err) {
          console.error('❌ Error al cargar datos de votación:', err);
          setError('Error al cargar datos de votación');
          setDataLoaded(true);
        }
      }
    };
    
    // Esperar un poco antes de cargar datos para dar tiempo al backend
    const timer = setTimeout(loadVotingData, 1000);
    return () => clearTimeout(timer);
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

        {/* Error message - solo mostrar si es un error crítico */}
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
              {dataLoaded ? (typeof totalVotes === 'object' ? (totalVotes as { totalVotes: number }).totalVotes : totalVotes) : '...'}
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

        {/* Resultados de votación - mostrar SIEMPRE que haya datos */}
        {dataLoaded && matchStats.length > 0 && (
          <Box w="full" bg="white" p={6} rounded="lg" shadow="md">
            <Heading size="md" mb={4} textAlign="center">
              Resultados de Votación
            </Heading>
            <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={4}>
              {matchStats.map((player: VoteStatistics, index: number) => (
                <Box
                  key={player.playerId}
                  p={4}
                  bg={index === 0 ? "yellow.50" : "gray.50"}
                  rounded="lg"
                  border={index === 0 ? "2px solid" : "1px solid"}
                  borderColor={index === 0 ? "yellow.400" : "gray.200"}
                  textAlign="center"
                >
                  <Badge
                    colorScheme={index === 0 ? "yellow" : "gray"}
                    mb={2}
                    fontSize="sm"
                  >
                    #{index + 1}
                  </Badge>
                  <Image
                    src={player.playerImage}
                    alt={player.playerName}
                    boxSize="80px"
                    mx="auto"
                    mb={3}
                    borderRadius="full"
                    objectFit="cover"
                  />
                  <Heading size="sm" mb={1}>
                    {player.playerName}
                  </Heading>
                  <Text fontSize="lg" fontWeight="bold" color="blue.600">
                    {player.totalVotos} votos
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {player.porcentaje.toFixed(1)}%
                  </Text>
                </Box>
              ))}
            </Grid>
          </Box>
        )}

        {/* Ganador destacado - solo mostrar si hay ganador */}
        {dataLoaded && winner && (
          <Box w="full" bg="green.50" p={6} rounded="lg" shadow="md" border="2px solid" borderColor="green.200">
            <Heading size="lg" mb={4} textAlign="center" color="green.700">
              🏆 Jugador del Partido ��
            </Heading>
            <Box textAlign="center">
              <Image
                src={winner.playerImage}
                alt={winner.playerName}
                boxSize="120px"
                mx="auto"
                mb={4}
                borderRadius="full"
                objectFit="cover"
              />
              <Heading size="md" mb={2} color="green.700">
                {winner.playerName}
              </Heading>
              <Text fontSize="lg" fontWeight="bold" color="green.600" mb={2}>
                {winner.totalVotos} votos ({winner.porcentaje.toFixed(1)}%)
              </Text>
            </Box>
          </Box>
        )}

        {/* Mensaje si no hay votos aún */}
        {dataLoaded && matchStats.length === 0 && (
          <Box w="full" bg="yellow.50" p={6} rounded="lg" border="1px solid" borderColor="yellow.200">
            <Text textAlign="center" color="yellow.800">
              Los resultados se mostrarán cuando haya más votos registrados.
            </Text>
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
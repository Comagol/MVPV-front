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
import type { Player } from '../types';

const VotePage = () => {
  const { user, logout } = useAuth();
  const { activeMatches, isLoading: matchesLoading } = useMatches();
  const { createVote, validateVote, isLoading: votingLoading } = useVoting();
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [canVote, setCanVote] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Obtener el partido activo (asumimos que hay solo uno)
  const activeMatch = activeMatches[0];

  useEffect(() => {
    const checkVotingStatus = async () => {
      if (activeMatch) {
        try {
          const canVoteResult = await validateVote(activeMatch._id);
          setCanVote(canVoteResult);
        } catch (err) {
          setError('Error al verificar estado de votación');
        }
      }
    };
    checkVotingStatus();
  }, [activeMatch, validateVote]);

  const handleVote = async () => {
    if (!selectedPlayer || !activeMatch) return;

    try {
      await createVote(selectedPlayer._id, activeMatch._id);
      navigate('/thanks');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al votar');
    }
  };

  if (matchesLoading) {
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
          <Text>No hay partidos disponibles para votar en este momento.</Text>
        </VStack>
      </Box>
    );
  }

  if (!canVote) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4}>
          <Heading>Ya has votado</Heading>
          <Text>Ya has realizado tu voto para este partido.</Text>
          <Button onClick={() => navigate('/thanks')}>
            Ver resultados
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" p={4}>
      <VStack gap={6} maxW="6xl" mx="auto">
        {/* Header */}
        <Box w="full" textAlign="center">
          <Heading size="lg" mb={2}>
            Votar por el Jugador del Partido
          </Heading>
          <Text fontSize="lg" color="gray.600">
            {activeMatch.rival} - {new Date(activeMatch.fecha).toLocaleDateString()}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Hola {user?.nombre}, selecciona tu jugador favorito
          </Text>
        </Box>

        {/* Error message */}
        {error && (
          <Box p={4} bg="red.100" color="red.700" rounded="md" w="full">
            {error}
          </Box>
        )}

        {/* Players Grid */}
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} w="full">
          {activeMatch.jugadores.map((player) => (
            <Box
              key={player._id}
              cursor="pointer"
              border={selectedPlayer?._id === player._id ? "2px solid" : "1px solid"}
              borderColor={selectedPlayer?._id === player._id ? "blue.500" : "gray.200"}
              onClick={() => setSelectedPlayer(player)}
              _hover={{ shadow: "md" }}
              p={6}
              bg="white"
              rounded="lg"
              textAlign="center"
            >
              <Image
                src={player.imagen || "/placeholder-player.jpg"}
                alt={player.nombre}
                boxSize="120px"
                mx="auto"
                mb={4}
                borderRadius="full"
                objectFit="cover"
              />
              <Heading size="md" mb={2}>
                {player.nombre}
              </Heading>
              <Text color="gray.600" mb={2}>
                {player.apodo}
              </Text>
              <Badge colorScheme="blue" mb={2}>
                {player.posicion}
              </Badge>
              <Text fontSize="sm" color="gray.500">
                Camiseta #{player.camiseta}
              </Text>
            </Box>
          ))}
        </Grid>

        {/* Vote Button */}
        <Button
          colorScheme="blue"
          size="lg"
          onClick={handleVote}
          disabled={!selectedPlayer || votingLoading}
          loading={votingLoading}
          loadingText="Votando..."
        >
          Votar por {selectedPlayer?.nombre || "un jugador"}
        </Button>

        {/* Logout Button */}
        <Button variant="outline" onClick={logout}>
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
  );
};

export default VotePage;
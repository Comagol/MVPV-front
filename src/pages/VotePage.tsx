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
import type { VoteValidationResponse } from '../types';
import LastWiner from '../components/layout/LastWiner';

const VotePage = () => {
  const { user, logout } = useAuth();
  const { activeMatches, isLoading: matchesLoading } = useMatches();
  const { createVote, validateVote, isLoading: votingLoading } = useVoting();
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerResponse | null>(null);
  const [voteValidation, setVoteValidation] = useState<VoteValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Obtener el partido activo
  const activeMatch = activeMatches?.[0] || null;

  useEffect(() => {
    const checkVotingStatus = async () => {
      if (activeMatch) {
        try {
          const validationResult = await validateVote(activeMatch.id);
          setVoteValidation(validationResult);
        } catch (err) {
          setError('Error al verificar estado de votación');
        }
      }
    };
    checkVotingStatus();
  }, [activeMatch, validateVote]);

  const handleVoteForPlayer = async (player: PlayerResponse) => {
    if (!activeMatch) return;

    try {
      await createVote(player.id, activeMatch.id);
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
      <Box minH="100vh" bg="gray.50" p={4}>
      <VStack gap={8} maxW="6xl" mx="auto">
        <Box w="full" textAlign="center">
          <Heading size="xl" mb={2} color="gray.700">
            No hay partidos activos o finalizados
          </Heading>
          <Text fontSize="lg" color="gray.600">
            No hay partidos disponibles para votar en este momento.
          </Text>
        </Box>
        
        {/* Mostrar el último ganador */}
        <LastWiner />
        
        {/* Botón de logout */}
        <Button variant="outline" onClick={logout}>
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
    );
  }

  if (voteValidation && !voteValidation.puedeVotar) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <VStack gap={4} maxW="md">
          <Box p={6} bg="orange.100" color="orange.800" rounded="lg" w="full" textAlign="center">
            <Heading size="md" mb={2}>No puedes votar</Heading>
            <Text>
              {voteValidation.razon || 'Ya has realizado tu voto para este partido.'}
            </Text>
          </Box>
          
          {voteValidation.tiempoRestante && (
            <Text fontSize="sm" color="gray.600">
              Tiempo restante: {Math.floor(voteValidation.tiempoRestante / 60)} minutos
            </Text>
          )}
          
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
            Hola {user?.nombre}, selecciona tu jugador de la fecha
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
          {activeMatch.jugadores.map((player: PlayerResponse) => (
            <Box
              key={player.id}
              cursor="pointer"
              border={selectedPlayer?.id === player.id ? "2px solid" : "1px solid"}
              borderColor={selectedPlayer?.id === player.id ? "blue.500" : "gray.200"}
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
              {/* Vote Button */}
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => handleVoteForPlayer(player)}
                disabled={votingLoading}
                loading={votingLoading}
                loadingText="Votando..."
              >
                Vota a {player.nombre}
              </Button>
            </Box>
          ))}
        </Grid>

        {/* Logout Button */}
        <Button variant="outline" onClick={logout}>
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
  );
};

export default VotePage;
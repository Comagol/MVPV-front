import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { matchService, playerService } from '../../services';
import type { MatchResponse, CreateMatchRequest, PlayerResponse } from '../../types';
import MatchCard from '../../components/admin/MatchCard';
import MatchForm from '../../components/admin/MatchForm';

const MatchesPage = () => {
  const [matches, setMatches] = useState<MatchResponse[]>([]);
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMatch, setEditingMatch] = useState<MatchResponse | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      // Cargar partidos y jugadores en paralelo
      const [matchesData, playersData] = await Promise.all([
        matchService.getAllMatches(),
        playerService.getAllPlayers()
      ]);
      setMatches(matchesData);
      setPlayers(playersData);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMatch = async (formData: CreateMatchRequest) => {
    try {
      if (editingMatch) {
        // Modo edición - actualizar partido
        await matchService.updateMatch(editingMatch.id, formData);
        setEditingMatch(null);
      } else {
        // Modo creación - crear nuevo partido
        console.log('Datos para crear partido:', formData);
        await matchService.createMatch(formData);
      }
      loadData(); // Recargar la lista
    } catch (error) {
      console.error('Error en handleSubmitMatch:', error);
      setError('Error al procesar partido');
    }
  };

  const handleEditMatch = (match: MatchResponse) => {
    setEditingMatch(match);
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
  };

  const handleDeleteMatch = async (id: string) => {
    try {
      // Aquí necesitarías agregar el método deleteMatch al service
      // await matchService.deleteMatch(id);
      console.log('Eliminar partido:', id);
      loadData();
    } catch (err: any) {
      console.error('Error eliminando partido:', err);
      setError('Error al eliminar partido');
    }
  };

  const handleStartMatch = async (id: string) => {
    try {
      await matchService.startMatch(id);
      loadData();
    } catch (err: any) {
      console.error('Error iniciando partido:', err);
      setError('Error al iniciar partido');
    }
  };

  const handleFinishMatch = async (id: string) => {
    try {
      await matchService.finishMatch(id);
      loadData();
    } catch (err: any) {
      console.error('Error finalizando partido:', err);
      setError('Error al finalizar partido');
    }
  };

  if (isLoading) {
    return (
      <Box maxW="7xl" mx="auto" py={8} px={4}>
        <Text>Cargando partidos...</Text>
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
        <Heading size="lg">Gestión de Partidos</Heading>
        
        {/* Formulario para crear/editar partidos */}
        <MatchForm
          onSubmit={handleSubmitMatch}
          onCancel={editingMatch ? handleCancelEdit : undefined}
          isEditing={!!editingMatch}
          players={players}
        />
        
        {/* Lista de partidos */}
        <Box>
          <Text mb={4} fontSize="lg" fontWeight="semibold">
            Partidos Registrados ({matches?.length || 0})
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {matches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onEdit={handleEditMatch}
                onDelete={handleDeleteMatch}
                onStart={handleStartMatch}
                onFinish={handleFinishMatch}
              />
            ))}
          </SimpleGrid>

          {matches.length === 0 && (
            <Text textAlign="center" color="gray.500">
              No hay partidos registrados
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default MatchesPage;
import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { matchService, playerService } from '../../services';
import type { CreateMatchRequest, PlayerResponse } from '../../types';
import MatchCard from '../../components/admin/MatchCard';
import MatchForm from '../../components/admin/MatchForm';
import { useMatch } from '../../contexts/MatchContext';

const MatchesPage = () => {
  // ✅ Usar el contexto en lugar del hook
  const { matches, isLoading, error, fetchAllMatches } = useMatch();
  
  // ✅ Solo manejar players localmente (porque no está en el contexto)
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [editingMatch, setEditingMatch] = useState<any>(null);

  // ✅ Solo cargar players, no matches
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const playersData = await playerService.getAllPlayers();
        setPlayers(playersData);
      } catch (err) {
        console.error('Error cargando players:', err);
      }
    };
    loadPlayers();
  }, []);

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
      // ✅ Usar la función del contexto para recargar
      await fetchAllMatches();
    } catch (error) {
      console.error('Error en handleSubmitMatch:', error);
    }
  };

  const handleEditMatch = (match: any) => {
    setEditingMatch(match);
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
  };

  const handleDeleteMatch = async (id: string) => {
    try {
      await matchService.deleteMatch(id);
      console.log('Eliminar partido:', id);
      // ✅ Usar la función del contexto para recargar
      await fetchAllMatches();
    } catch (err) {
      console.error('Error eliminando partido:', err);
    }
  };

  const handleStartMatch = async (id: string) => {
    try {
      await matchService.startMatch(id);
      // ✅ Usar la función del contexto para recargar
      await fetchAllMatches();
    } catch (err) {
      console.error('Error iniciando partido:', err);
    }
  };

  const handleFinishMatch = async (id: string) => {
    try {
      await matchService.finishMatch(id);
      // ✅ Usar la función del contexto para recargar
      await fetchAllMatches();
    } catch (err) {
      console.error('Error finalizando partido:', err);
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
            Partidos Registrados ({matches.length})
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
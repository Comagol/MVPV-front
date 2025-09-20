import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
} from '@chakra-ui/react';
import { playerService } from '../../services';
import type { PlayerResponse, CreatePlayerRequest, UpdatePlayerRequest } from '../../types';
import PlayerCard from '../../components/admin/PlayerCard';
import PlayerForm from '../../components/admin/PlayerForm';

const PlayersPage = () => {
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<PlayerResponse | null>(null);

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

  const handleSubmitPlayer = async (formData: CreatePlayerRequest) => {
    if (editingPlayer) {
      const updatedFields: UpdatePlayerRequest = {};
      if (formData.nombre && formData.nombre.trim() !== '') { updatedFields.nombre = formData.nombre;        
      }
      if (formData.apodo && formData.apodo.trim() !== '') { updatedFields.apodo = formData.apodo;        
      }
      if (formData.posicion && formData.posicion.trim() !== '') { updatedFields.posicion = formData.posicion;        
      }
      if (formData.imagen && formData.imagen.trim() !== '') { updatedFields.imagen = formData.imagen;        
      }
      if (formData.camiseta && formData.camiseta !== 0) { updatedFields.camiseta = formData.camiseta;        
      }
      if (formData.camada && formData.camada !== 0) { updatedFields.camada = formData.camada;        
      }
      await playerService.updatePlayer(editingPlayer.id, updatedFields);
      setEditingPlayer(null);
    } else {
      // Crear nuevo jugador
      await playerService.createPlayer(formData);
    }
    loadPlayers();
  };

  const handleEditPlayer = (player: PlayerResponse) => {
    setEditingPlayer(player);
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
  };

  const handleDeletePlayer = async (id: string) => {
    await playerService.deletePlayer(id);
    loadPlayers();
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
        
        {/* Formulario */}
        <PlayerForm
          onSubmit={handleSubmitPlayer}
          onCancel={editingPlayer ? handleCancelEdit : undefined}
          initialData={editingPlayer}
          isEditing={!!editingPlayer}
        />
        
        {/* Lista de jugadores */}
        <Box>
          <Text mb={4} fontSize="lg" fontWeight="semibold">
            Jugadores Registrados ({players?.length || 0})
          </Text>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={handleEditPlayer}
                onDelete={handleDeletePlayer}
              />
            ))}
          </SimpleGrid>

          {players.length === 0 && (
            <Text textAlign="center" color="gray.500">
              No hay jugadores registrados
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default PlayersPage;
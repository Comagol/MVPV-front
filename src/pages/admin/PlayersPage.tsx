import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Text,
  Grid,
  Spinner,
  HStack,
  Input,
} from '@chakra-ui/react';
import { playerService } from '../../services';
import type { PlayerResponse, CreatePlayerRequest, UpdatePlayerRequest } from '../../types';
import PlayerCard from '../../components/admin/PlayerCard';
import PlayerForm from '../../components/admin/PlayerForm';
import { Card, Button } from '../../components/ui';
import { FaSearch, FaPlus } from 'react-icons/fa';

const PlayersPage = () => {
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingPlayer, setEditingPlayer] = useState<PlayerResponse | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadPlayers();
  }, []);

  const loadPlayers = async () => {
    try {
      setIsLoading(true);
      const data = await playerService.getAllPlayers();
      setPlayers(data);
    } catch (err: any) {
      console.error('Error cargando jugadores:', err);
      setError('Error al cargar jugadores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPlayer = async (formData: CreatePlayerRequest) => {
    try {
      if (editingPlayer) {
        // Modo edición - solo campos modificados
        const updatedFields: UpdatePlayerRequest = {};
        
        if (formData.nombre && formData.nombre.trim() !== '') {
          updatedFields.nombre = formData.nombre;
        }
        if (formData.apodo && formData.apodo.trim() !== '') {
          updatedFields.apodo = formData.apodo;
        }
        if (formData.posicion && formData.posicion.trim() !== '') {
          updatedFields.posicion = formData.posicion;
        }
        if (formData.imagen && formData.imagen.trim() !== '') {
          updatedFields.imagen = formData.imagen;
        }
        if (formData.camiseta && formData.camiseta !== 0) {
          updatedFields.camiseta = formData.camiseta;
        }
        if (formData.camada && formData.camada !== 0) {
          updatedFields.camada = formData.camada;
        }
        
        await playerService.updatePlayer(editingPlayer.id, updatedFields);
        setEditingPlayer(null);
      } else {
        await playerService.createPlayer(formData);
      }
      setShowForm(false);
      loadPlayers();
    } catch (error) {
      console.error('Error en handleSubmitPlayer:', error);
      setError('Error al procesar jugador');
    }
  };

  const handleEditPlayer = (player: PlayerResponse) => {
    setEditingPlayer(player);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingPlayer(null);
    setShowForm(false);
  };

  const handleDeletePlayer = async (id: string) => {
    await playerService.deletePlayer(id);
    loadPlayers();
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await playerService.togglePlayerActive(id, currentStatus);
      loadPlayers();
    } catch (err: any) {
      console.error('Error cambiando estado del jugador:', err);
      setError('Error al cambiar estado del jugador');
    }
  };

  // Filtrar jugadores según búsqueda
  const filteredPlayers = players.filter(player =>
    player.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.apodo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    player.posicion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Box flex="1" display="flex" alignItems="center" justifyContent="center" bg="bg-primary" minH="60vh">
        <Spinner size="xl" color="button-primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box maxW={{ base: "full", md: "7xl" }} mx="auto" py={8} px={{ base: 4, md: 6 }}>
        <Card variant="outlined" borderColor="red.500" bg="red.50">
          <Text color="red.600" textAlign="center">{error}</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box maxW={{ base: "full", md: "7xl" }} mx="auto" py={8} px={{ base: 4, md: 6 }}>
      <VStack gap={6} align="stretch">
        {/* Header con búsqueda y botón agregar */}
        <Card variant="elevated">
          <VStack gap={4} align="stretch">
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <VStack align="start" gap={1}>
                <Text fontSize="2xl" fontWeight="bold" color="text-primary">
                  Gestión de Jugadores
                </Text>
                <Text fontSize="sm" color="text-secondary">
                  {players.length} jugadores registrados
                </Text>
              </VStack>
              
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowForm(!showForm)}
                leftIcon={<FaPlus />}
              >
                {showForm ? 'Ocultar Formulario' : 'Agregar Jugador'}
              </Button>
            </HStack>

            {/* Barra de búsqueda */}
            <HStack gap={2}>
              <Box flex="1" position="relative">
                <Input
                  placeholder="Buscar por nombre, apodo o posición..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="bg-primary"
                  borderColor="border-primary"
                  _focus={{ borderColor: "button-primary" }}
                />
                <Box
                  position="absolute"
                  right="12px"
                  top="50%"
                  transform="translateY(-50%)"
                  color="text-secondary"
                >
                  <FaSearch />
                </Box>
              </Box>
            </HStack>
          </VStack>
        </Card>

        {/* Formulario */}
        {showForm && (
          <PlayerForm
            onSubmit={handleSubmitPlayer}
            onCancel={handleCancelEdit}
            initialData={editingPlayer}
            isEditing={!!editingPlayer}
          />
        )}
        
        {/* Lista de jugadores */}
        <Box>
          <Grid 
            templateColumns={{
              base: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)"
            }} 
            gap={{ base: 4, md: 6 }}
          >
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={handleEditPlayer}
                onDelete={handleDeletePlayer}
                onToggleActive={handleToggleActive}
              />
            ))}
          </Grid>

          {filteredPlayers.length === 0 && (
            <Card variant="outlined" textAlign="center">
              <VStack gap={3} py={8}>
                <Text fontSize="lg" color="text-secondary">
                  {searchTerm ? 'No se encontraron jugadores' : 'No hay jugadores registrados'}
                </Text>
                {searchTerm && (
                  <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
                    Limpiar búsqueda
                  </Button>
                )}
              </VStack>
            </Card>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default PlayersPage;
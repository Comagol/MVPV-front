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
import { matchService, playerService } from '../../services';
import type { CreateMatchRequest, PlayerResponse } from '../../types';
import MatchCard from '../../components/admin/MatchCard';
import MatchForm from '../../components/admin/MatchForm';
import { useMatch } from '../../contexts/MatchContext';
import { Card, Button } from '../../components/ui';
import { FaSearch, FaPlus } from 'react-icons/fa';

const MatchesPage = () => {
  const { matches, isLoading, error, fetchAllMatches } = useMatch();
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [editingMatch, setEditingMatch] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
        await matchService.updateMatch(editingMatch.id, formData);
        setEditingMatch(null);
      } else {
        await matchService.createMatch(formData);
      }
      setShowForm(false);
      await fetchAllMatches();
    } catch (error) {
      console.error('Error en handleSubmitMatch:', error);
    }
  };

  const handleEditMatch = (match: any) => {
    setEditingMatch(match);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
    setShowForm(false);
  };

  const handleDeleteMatch = async (id: string) => {
    try {
      await matchService.deleteMatch(id);
      await fetchAllMatches();
    } catch (err) {
      console.error('Error eliminando partido:', err);
    }
  };

  const handleStartMatch = async (id: string) => {
    try {
      await matchService.startMatch(id);
      await fetchAllMatches();
    } catch (err) {
      console.error('Error iniciando partido:', err);
    }
  };

  const handleFinishMatch = async (id: string) => {
    try {
      await matchService.finishMatch(id);
      await fetchAllMatches();
    } catch (err) {
      console.error('Error finalizando partido:', err);
    }
  };

  // Filtrar partidos según búsqueda
  const filteredMatches = matches.filter(match =>
    match.rival.toLowerCase().includes(searchTerm.toLowerCase())
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
                  Gestión de Partidos
                </Text>
                <Text fontSize="sm" color="text-secondary">
                  {matches.length} partidos registrados
                </Text>
              </VStack>
              
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowForm(!showForm)}
                leftIcon={<FaPlus />}
              >
                {showForm ? 'Ocultar Formulario' : 'Agregar Partido'}
              </Button>
            </HStack>

            {/* Barra de búsqueda */}
            <HStack gap={2}>
              <Box flex="1" position="relative">
                <Input
                  placeholder="Buscar por rival..."
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
          <MatchForm
            onSubmit={handleSubmitMatch}
            onCancel={handleCancelEdit}
            isEditing={!!editingMatch}
            players={players}
          />
        )}
        
        {/* Lista de partidos */}
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
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onEdit={handleEditMatch}
                onDelete={handleDeleteMatch}
                onStart={handleStartMatch}
                onFinish={handleFinishMatch}
              />
            ))}
          </Grid>

          {filteredMatches.length === 0 && (
            <Card variant="outlined" textAlign="center">
              <VStack gap={3} py={8}>
                <Text fontSize="lg" color="text-secondary">
                  {searchTerm ? 'No se encontraron partidos' : 'No hay partidos registrados'}
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

export default MatchesPage;
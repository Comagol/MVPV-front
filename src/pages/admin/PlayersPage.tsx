import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Image,
  Button,
  Input
} from '@chakra-ui/react';
import { playerService } from '../../services';
import type { PlayerResponse, CreatePlayerRequest } from '../../types';

const PlayersPage = () => {
  const [players, setPlayers] = useState<PlayerResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreatePlayerRequest>({
    nombre: '',
    apodo: '',
    posicion: '',
    imagen: '',
    camiseta: 0,
    camada: 0,
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await playerService.createPlayer(formData);
      // Limpiar formulario
      setFormData({
        nombre: '',
        apodo: '',
        posicion: '',
        imagen: '',
        camiseta: 0,
        camada: 0,
      });
      // Recargar lista
      loadPlayers();
    } catch (err: any) {
      console.error('Error creando jugador:', err);
      setError('Error al crear jugador');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'camiseta' || name === 'camada' ? Number(value) : value
    }));
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
        
        <Text>Total de jugadores: {players?.length || 0}</Text>

        <Box bg="white" p={6} rounded="lg" shadow="md" borderWidth="1px" border="1px solid rgb(113, 122, 152)">
        <Heading size="md" mb={4}>Agregar Nuevo Jugador</Heading>
        
        <form onSubmit={handleSubmit}>
          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
            <Box>
              <Text mb={2} fontWeight="medium">Nombre *</Text>
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Nombre del jugador"
                required
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Apodo *</Text>
              <Input
                name="apodo"
                value={formData.apodo}
                onChange={handleInputChange}
                placeholder="Apodo del jugador"
                required
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Posición *</Text>
              <Input
                name="posicion"
                value={formData.posicion}
                onChange={handleInputChange}
                placeholder="Ej: Fullback, Wing, etc."
                required
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">URL de Imagen *</Text>
              <Input
                name="imagen"
                value={formData.imagen}
                onChange={handleInputChange}
                placeholder="https://..."
                required
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Número de Camiseta *</Text>
              <Input
                name="camiseta"
                type="number"
                value={formData.camiseta}
                onChange={handleInputChange}
                placeholder="Número"
                required
              />
            </Box>

            <Box>
              <Text mb={2} fontWeight="medium">Camada *</Text>
              <Input
                name="camada"
                type="number"
                value={formData.camada}
                onChange={handleInputChange}
                placeholder="Ej: 2020"
                required
              />
            </Box>
          </SimpleGrid>

          <Button type="submit" colorScheme="blue" mt={4} size="lg">
            Crear Jugador
          </Button>
        </form>
      </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {players.map((player) => (
            <Box 
              key={player.id}
              bg="white"
              p={4}
              rounded="lg"
              shadow="md"
              borderWidth="1px"
            >
              <VStack align="start" gap={2}>
                <Text fontWeight="bold" fontSize="lg" textAlign="center">
                  #{player.camiseta} - {player.nombre}
                </Text>
                <Text color="gray.600">"{player.apodo}"</Text>
                <Text fontSize="sm" textAlign="center">{player.posicion}</Text>
                <Text fontSize="sm" color="gray.500" textAlign="center">
                  Camada: {player.camada}
                </Text>
                <Image src={player.imagen} alt={player.nombre} boxSize="120px" mx="auto" mb={4} borderRadius="full" objectFit="cover" />
                <Text fontSize="sm" color={player.activo ? "green.500" : "red.500"}>
                  {player.activo ? "Activo" : "Inactivo"}
                </Text>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>

        {players.length === 0 && (
          <Text textAlign="center" color="gray.500">
            No hay jugadores registrados
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default PlayersPage;
import { useState, useMemo } from 'react';
import {
  Box,
  Text,
  Input,
  VStack,
  HStack,
  SimpleGrid,
  Image,
  Button,
} from '@chakra-ui/react';
import type { PlayerResponse } from '../../types';

interface PlayerSelectorProps {
  players: PlayerResponse[];
  selectedPlayerIds: string[];
  onPlayersChange: (selectedIds: string[]) => void;
  disabled?: boolean;
}

const PlayerSelector = ({ 
  players, 
  selectedPlayerIds, 
  onPlayersChange, 
  disabled = false 
}: PlayerSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar jugadores por búsqueda
  const filteredPlayers = useMemo(() => {
    if (!searchTerm) return players;
    
    return players.filter(player => 
      player.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.apodo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.posicion.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [players, searchTerm]);

  // Solo jugadores activos
  const activePlayers = useMemo(() => {
    return filteredPlayers.filter(player => player.activo);
  }, [filteredPlayers]);

  const handlePlayerToggle = (playerId: string) => {
    if (disabled) return;

    const isSelected = selectedPlayerIds.includes(playerId);
    let newSelectedIds: string[];

    if (isSelected) {
      newSelectedIds = selectedPlayerIds.filter(id => id !== playerId);
    } else {
      newSelectedIds = [...selectedPlayerIds, playerId];
    }

    onPlayersChange(newSelectedIds);
  };

  const getCounterColor = () => {
    const count = selectedPlayerIds.length;
    if (count < 15 || count > 23) return 'red.500';
    return 'green.500';
  };

  const getCounterText = () => {
    const count = selectedPlayerIds.length;
    if (count < 15) return `Faltan ${15 - count} jugadores`;
    if (count > 23) return `Sobran ${count - 23} jugadores`;
    return 'Cantidad correcta';
  };

  return (
    <Box>
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="medium">Seleccionar Jugadores *</Text>
        <Text 
          fontSize="sm" 
          color={getCounterColor()}
          fontWeight="semibold"
        >
          {selectedPlayerIds.length}/23 - {getCounterText()}
        </Text>
      </HStack>

      {/* Buscador */}
      <Input
        placeholder="Buscar por nombre, apodo o posición..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={disabled}
        mb={4}
      />

      {/* Lista de jugadores */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={3}>
        {activePlayers.map((player) => (
          <PlayerCheckboxCard
            key={player.id}
            player={player}
            isSelected={selectedPlayerIds.includes(player.id)}
            onToggle={() => handlePlayerToggle(player.id)}
            disabled={disabled}
          />
        ))}
      </SimpleGrid>

      {activePlayers.length === 0 && (
        <Text textAlign="center" color="gray.500" py={8}>
          {searchTerm ? 'No se encontraron jugadores' : 'No hay jugadores disponibles'}
        </Text>
      )}
    </Box>
  );
};

// Componente auxiliar para cada jugador
interface PlayerCheckboxCardProps {
  player: PlayerResponse;
  isSelected: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

const PlayerCheckboxCard = ({ 
  player, 
  isSelected, 
  onToggle, 
  disabled = false 
}: PlayerCheckboxCardProps) => {
  return (
    <Box
      borderWidth="1px"
      rounded="lg"
      p={3}
      bg={isSelected ? 'blue.50' : 'white'}
      borderColor={isSelected ? 'blue.200' : 'gray.200'}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      onClick={!disabled ? onToggle : undefined}
      _hover={!disabled ? { borderColor: 'blue.300' } : {}}
    >
      <VStack align="start" gap={2}>
        <HStack w="full">
          <Image 
            src={player.imagen} 
            alt={player.apodo} 
            width={12} 
            height={12} 
            rounded="full"
          />
          <VStack align="start" gap={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium">
              {player.apodo}
            </Text>
            <Text fontSize="xs" color="gray.600">
              {player.posicion} • #{player.camiseta}
            </Text>
          </VStack>
        </HStack>
        
        <Button
          size="xs"
          colorScheme={isSelected ? "red" : "blue"}
          variant={isSelected ? "solid" : "outline"}
          w="full"
          onClick={onToggle}
          disabled={disabled}
        >
          {isSelected ? 'Quitar' : 'Seleccionar'}
        </Button>
      </VStack>
    </Box>
  );
};

export default PlayerSelector;
import { Box, VStack, Text, Button, Image, HStack } from '@chakra-ui/react';
import type { PlayerResponse } from '../../types';

interface PlayerCardProps {
  player: PlayerResponse;
  onEdit: (player: PlayerResponse) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
}

const PlayerCard = ({ player, onEdit, onDelete, onToggleActive }: PlayerCardProps) => {
  return (
    <Box 
      bg="white"
      p={4}
      rounded="lg"
      shadow="md"
      borderWidth="1px"
    >
      <VStack align="start" gap={2}>
        <Text fontWeight="bold" fontSize="lg">
          {player.camiseta} - {player.nombre}
        </Text>
        <Text color="gray.600">"{player.apodo}"</Text>
        <Text fontSize="sm">{player.posicion}</Text>
        <Text fontSize="sm" color="gray.500">
          Camada: {player.camada}
        </Text>
        <Image src={player.imagen} alt={player.nombre} width={100} height={100} />
        <Text fontSize="sm" color={player.activo ? "green.500" : "red.500"}>
          {player.activo ? "Activo" : "Inactivo"}
        </Text>
        
        <Button
          size="sm"
          colorScheme="blue"
          mt={2}
          onClick={() => onEdit(player)}
        >
          Editar
        </Button>
        <HStack w="full" gap={2}>
            <Button
              size="sm"
              colorScheme={player.activo ? "orange" : "green"}
              flex="1"
              onClick={() => onToggleActive(player.id, player.activo)}
            >
              {player.activo ? "Desactivar" : "Activar"}
            </Button>
            
            <Button
              size="sm"
              colorScheme="red"
              flex="1"
              onClick={() => onDelete(player.id)}
            >
              Eliminar
            </Button>
          </HStack>
      </VStack>
    </Box>
  );
};

export default PlayerCard;
import { Box, VStack, Text, Button, Image } from '@chakra-ui/react';
import type { PlayerResponse } from '../../types';

interface PlayerCardProps {
  player: PlayerResponse;
  onEdit: (player: PlayerResponse) => void;
  onDelete: (id: string) => void;
}

const PlayerCard = ({ player, onEdit, onDelete }: PlayerCardProps) => {
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
        <Button
          size="sm"
          colorScheme="red"
          mt={2}
          onClick={() => onDelete(player.id)}
        >
          Eliminar
        </Button>
      </VStack>
    </Box>
  );
};

export default PlayerCard;
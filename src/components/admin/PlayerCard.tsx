import { Box, VStack, HStack, Text, Image } from '@chakra-ui/react';
import type { PlayerResponse } from '../../types';
import { Card, Button, Badge } from '../ui';
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

interface PlayerCardProps {
  player: PlayerResponse;
  onEdit: (player: PlayerResponse) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
}

const PlayerCard = ({ player, onEdit, onDelete, onToggleActive }: PlayerCardProps) => {
  return (
    <Card variant="outlined">
      <VStack gap={4} align="stretch">
        {/* Header con número y estado */}
        <HStack justify="space-between" align="start">
          <Badge variant="number" size="lg" bg="button-secondary" color="text-white">
            #{player.camiseta}
          </Badge>
          <Badge 
            variant="status" 
            size="sm" 
            bg={player.activo ? "green.500" : "red.500"}
            color="text-white"
          >
            {player.activo ? "Activo" : "Inactivo"}
          </Badge>
        </HStack>

        {/* Imagen del jugador */}
        <Box display="flex" justifyContent="center">
          <Image
            src={player.imagen}
            alt={player.nombre}
            boxSize="120px"
            borderRadius="full"
            objectFit="cover"
            border="3px solid"
            borderColor="border-light"
          />
        </Box>

        {/* Información del jugador */}
        <VStack gap={2} align="center">
          <Text fontSize="lg" fontWeight="bold" color="text-primary" textAlign="center">
            {player.nombre}
          </Text>
          
          {player.apodo && (
            <Text fontSize="sm" color="text-secondary" fontStyle="italic" textAlign="center">
              "{player.apodo}"
            </Text>
          )}

          <HStack gap={2}>
            <Badge variant="status" size="sm" bg="button-primary" color="text-white">
              {player.posicion}
            </Badge>
            <Badge variant="status" size="sm" bg="text-secondary" color="text-white">
              Camada {player.camada}
            </Badge>
          </HStack>
        </VStack>

        {/* Botones de acción */}
        <VStack gap={2} w="full">
          <Button
            variant="secondary"
            size="md"
            w="full"
            onClick={() => onEdit(player)}
            leftIcon={<FaEdit />}
          >
            Editar
          </Button>
          
          <HStack w="full" gap={2}>
            <Button
              variant="outline"
              size="sm"
              flex="1"
              onClick={() => onToggleActive(player.id, player.activo)}
              leftIcon={player.activo ? <FaToggleOff /> : <FaToggleOn />}
            >
              {player.activo ? "Desactivar" : "Activar"}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              flex="1"
              onClick={() => onDelete(player.id)}
              borderColor="red.500"
              color="red.500"
              _hover={{ bg: "red.50" }}
              leftIcon={<FaTrash />}
            >
              Eliminar
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Card>
  );
};

export default PlayerCard;
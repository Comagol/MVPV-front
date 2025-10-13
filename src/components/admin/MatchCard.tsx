import { Box, VStack, Text, HStack, Image } from '@chakra-ui/react';
import type { MatchResponse } from '../../types';
import { Card, Button, Badge } from '../ui';
import { FaEdit, FaTrash, FaPlay, FaStop, FaCheck, FaCalendar } from 'react-icons/fa';

interface MatchCardProps {
  match: MatchResponse;
  onEdit: (match: MatchResponse) => void;
  onDelete: (id: string) => void;
  onStart?: (id: string) => void;
  onFinish?: (id: string) => void;
}

const MatchCard = ({ match, onEdit, onDelete, onStart, onFinish }: MatchCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'programado':
        return { bg: 'blue.500', text: 'Programado' };
      case 'en_proceso':
        return { bg: 'button-primary', text: 'En Proceso' };
      case 'finalizado':
        return { bg: 'green.500', text: 'Finalizado' };
      default:
        return { bg: 'text-secondary', text: 'Desconocido' };
    }
  };

  const statusBadge = getStatusBadge(match.estado);

  return (
    <Card variant="outlined">
      <VStack gap={4} align="stretch">
        {/* Header del partido */}
        <HStack justify="space-between" align="start">
          <VStack align="start" gap={1}>
            <Text fontSize="xl" fontWeight="bold" color="text-primary">
              VICENTINOS
            </Text>
            <Text fontSize="lg" fontWeight="semibold" color="text-primary">
              vs {match.rival}
            </Text>
          </VStack>
          <Badge 
            variant="status" 
            size="sm" 
            bg={statusBadge.bg}
            color="text-white"
          >
            {statusBadge.text}
          </Badge>
        </HStack>
        
        {/* Fecha */}
        <HStack gap={2} color="text-secondary">
          <FaCalendar />
          <Text fontSize="sm">
            {formatDate(match.fecha)}
          </Text>
        </HStack>
        
        {/* Descripción */}
        {match.description && (
          <Text fontSize="sm" color="text-secondary" maxH="40px" overflow="hidden">
            {match.description}
          </Text>
        )}
        
        {/* Jugadores Convocados */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" color="text-primary" mb={2}>
            Jugadores Convocados ({match.jugadores.length})
          </Text>
          
          <HStack gap={1} flexWrap="wrap">
            {match.jugadores.slice(0, 8).map((player) => (
              <Image
                key={player.id}
                src={player.imagen}
                alt={player.apodo}
                boxSize="32px"
                rounded="full"
                objectFit="cover"
                border="2px solid"
                borderColor="border-light"
                title={`${player.apodo} - ${player.posicion}`}
              />
            ))}
            {match.jugadores.length > 8 && (
              <Box
                boxSize="32px"
                rounded="full"
                bg="border-light"
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid"
                borderColor="border-light"
              >
                <Text fontSize="xs" fontWeight="bold" color="text-secondary">
                  +{match.jugadores.length - 8}
                </Text>
              </Box>
            )}
          </HStack>
        </Box>
        
        {/* Botones de acción */}
        <VStack gap={2} w="full">
          <Button
            variant="secondary"
            size="md"
            w="full"
            onClick={() => onEdit(match)}
            leftIcon={<FaEdit />}
          >
            Editar Partido
          </Button>
          
          <HStack w="full" gap={2}>
            {/* Botón de estado según el estado actual */}
            {match.estado === 'programado' && onStart && (
              <Button
                variant="outline"
                size="sm"
                flex="1"
                onClick={() => onStart(match.id)}
                borderColor="green.500"
                color="green.500"
                _hover={{ bg: "green.50" }}
                leftIcon={<FaPlay />}
              >
                Iniciar
              </Button>
            )}
            
            {match.estado === 'en_proceso' && onFinish && (
              <Button
                variant="outline"
                size="sm"
                flex="1"
                onClick={() => onFinish(match.id)}
                borderColor="orange.500"
                color="orange.500"
                _hover={{ bg: "orange.50" }}
                leftIcon={<FaStop />}
              >
                Finalizar
              </Button>
            )}
            
            {match.estado === 'finalizado' && (
              <Button
                variant="outline"
                size="sm"
                flex="1"
                disabled
                borderColor="green.500"
                color="green.500"
                leftIcon={<FaCheck />}
              >
                Completado
              </Button>
            )}
            
            <Button
              variant="outline"
              size="sm"
              flex="1"
              onClick={() => onDelete(match.id)}
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

export default MatchCard;
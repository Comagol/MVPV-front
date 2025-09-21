import { Box, VStack, Text, Button, HStack, Image } from '@chakra-ui/react';
import type { MatchResponse } from '../../types';

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

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'programado': return 'blue.500';
      case 'en_proceso': return 'orange.500';
      case 'finalizado': return 'green.500';
      default: return 'gray.500';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'programado': return 'Programado';
      case 'en_proceso': return 'En Proceso';
      case 'finalizado': return 'Finalizado';
      default: return 'Desconocido';
    }
  };

  return (
    <Box 
      bg="white"
      p={4}
      rounded="lg"
      shadow="md"
      borderWidth="1px"
    >
      <VStack align="start" gap={3}>
        {/* Header del partido */}
        <HStack justify="space-between" w="full">
          <Text fontWeight="bold" fontSize="lg">
            vs {match.rival}
          </Text>
          <Text 
            fontSize="sm" 
            color={getStatusColor(match.estado)}
            fontWeight="semibold"
          >
            {getStatusText(match.estado)}
          </Text>
        </HStack>
        
        {/* Fecha */}
        <Text fontSize="sm" color="gray.600">
          📅 {formatDate(match.fecha)}
        </Text>
        
        {/* Descripción */}
        <Text fontSize="sm" color="gray.700">
          {match.description}
        </Text>
        
        {/* Jugadores */}
        <Box w="full">
          <Text fontSize="sm" fontWeight="medium" mb={2}>
            Jugadores Convocados ({match.jugadores.length})
          </Text>
          
          {/* Mostrar primeros 6 jugadores */}
          <HStack gap={1} mb={2}>
            {match.jugadores.slice(0, 6).map((player) => (
              <Image
                key={player.id}
                src={player.imagen}
                alt={player.apodo}
                width={8}
                height={8}
                rounded="full"
                title={`${player.apodo} - ${player.posicion}`}
              />
            ))}
            {match.jugadores.length > 6 && (
              <Box
                width={8}
                height={8}
                rounded="full"
                bg="gray.200"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="xs" color="gray.600">
                  +{match.jugadores.length - 6}
                </Text>
              </Box>
            )}
          </HStack>
        </Box>
        
        {/* Botones de acción */}
        <VStack w="full" gap={2}>
          <Button
            size="sm"
            colorScheme="blue"
            w="full"
            onClick={() => onEdit(match)}
          >
            Editar Partido
          </Button>
          
          <HStack w="full" gap={2}>
            {/* Botón de estado según el estado actual */}
            {match.estado === 'programado' && onStart && (
              <Button
                size="sm"
                colorScheme="green"
                flex="1"
                onClick={() => onStart(match.id)}
              >
                Iniciar
              </Button>
            )}
            
            {match.estado === 'en_proceso' && onFinish && (
              <Button
                size="sm"
                colorScheme="orange"
                flex="1"
                onClick={() => onFinish(match.id)}
              >
                Finalizar
              </Button>
            )}
            
            {match.estado === 'finalizado' && (
              <Button
                size="sm"
                colorScheme="gray"
                flex="1"
                disabled
              >
                Completado
              </Button>
            )}
            
            <Button
              size="sm"
              colorScheme="red"
              flex="1"
              onClick={() => onDelete(match.id)}
            >
              Eliminar
            </Button>
          </HStack>
        </VStack>
      </VStack>
    </Box>
  );
};

export default MatchCard;
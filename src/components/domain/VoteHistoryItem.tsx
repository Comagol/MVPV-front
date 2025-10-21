import { Box, HStack, VStack, Text, Image, Badge } from '@chakra-ui/react';
import type { VoteHistoryItem as VoteHistoryItemType } from '../../types/vote';

interface VoteHistoryItemProps {
  vote: VoteHistoryItemType;
}

export const VoteHistoryItem = ({ vote }: VoteHistoryItemProps) => {
  const formatFecha = (fecha: string) => {
    const date = new Date(fecha)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Box p={4} borderWidth={1} borderRadius="md" bg="white">
      <HStack justify="space-between" align="start">
        {/* Información del jugador */}
        <HStack gap={3}>
          <Image
            src={vote.playerImagen}
            alt={vote.playerName}
            boxSize="60px"
            borderRadius="full"
            objectFit="cover"
          />
          <VStack align="start" gap={1}>
            <Text fontWeight="bold" fontSize="lg">
              {vote.playerName}
            </Text>
            {vote.playerApodo && (
              <Text fontSize="sm" color="text-secondary">
                "{vote.playerApodo}"
              </Text>
            )}
            <Text fontSize="sm" color="text-secondary">
              {vote.playerPosicion} • #{vote.playerCamiseta}
            </Text>
          </VStack>
        </HStack>

        {/* Información del partido */}
        <VStack align="end" gap={1}>
          <Text fontWeight="bold" fontSize="md">
            vs {vote.matchRival}
          </Text>
          <Text fontSize="sm" color="text-secondary">
            {formatFecha(vote.matchFecha)}
          </Text>
          <Text fontSize="sm" color="text-secondary">
            Votado: {formatFecha(vote.fechaVoto)}
          </Text>
          {vote.ganador && (
            <Badge colorScheme="green" variant="solid">
              🏆 Ganador
            </Badge>
          )}
        </VStack>
      </HStack>
    </Box>
  )
}
